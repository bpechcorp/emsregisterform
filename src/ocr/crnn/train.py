from __future__ import print_function
from __future__ import division

import argparse
import random
import torch
import torch.backends.cudnn as cudnn
import torch.optim as optim
import torch.utils.data
from torch.autograd import Variable
import numpy as np
from warpctc_pytorch import CTCLoss
import os
import utils
import dataset
from torchsummary import summary

import models.crnn as crnn

parser = argparse.ArgumentParser()
parser.add_argument('--trainroot', required=True, help='path to dataset')
parser.add_argument('--valroot', required=True, help='path to dataset')
parser.add_argument('--workers', type=int, help='number of data loading workers', default=2)
parser.add_argument('--batchSize', type=int, default=64, help='input batch size')
parser.add_argument('--imgH', type=int, default=64, help='the height of the input image to network')
parser.add_argument('--imgW', type=int, default=1024, help='the width of the input image to network')
parser.add_argument('--nh', type=int, default=256, help='size of the lstm hidden state')
parser.add_argument('--nepoch', type=int, default=25, help='number of epochs to train for')
parser.add_argument('--cuda', action='store_true', help='enables cuda')
parser.add_argument('--ngpu', type=int, default=1, help='number of GPUs to use')
parser.add_argument('--pretrained', default='', help="path to pretrained model (to continue training)")
parser.add_argument('--alphabet', type=str, required=True, help='path to char in labels')
parser.add_argument('--save_model', default='expr/net.pth', help='Where to store samples and models')
parser.add_argument('--displayInterval', type=int, default=2, help='Interval to be displayed')
parser.add_argument('--n_test_disp', type=int, default=5, help='Number of samples to display when test')
parser.add_argument('--valInterval', type=int, default=10, help='Interval to be displayed')
parser.add_argument('--saveInterval', type=int, default=5, help='Interval to be displayed')
parser.add_argument('--lr', type=float, default=0.001, help='learning rate for Critic, not used by adadealta')
parser.add_argument('--beta1', type=float, default=0.9, help='beta1 for adam. default=0.5')
parser.add_argument('--adam', action='store_true', help='Whether to use adam (default is rmsprop)')
parser.add_argument('--adadelta', action='store_true', help='Whether to use adadelta (default is rmsprop)')
parser.add_argument('--keep_ratio', action='store_true', help='whether to keep ratio for image resize')
parser.add_argument('--manualSeed', type=int, default=1234, help='reproduce experiemnt')
parser.add_argument('--random_sample', action='store_true', default=True, help='whether to sample the dataset with random sampler')
opt = parser.parse_args()
print(opt)

expr_dir, _ = os.path.split(opt.save_model)
if not os.path.exists(expr_dir):
    os.makedirs(expr_dir)

random.seed(opt.manualSeed)
np.random.seed(opt.manualSeed)
torch.manual_seed(opt.manualSeed)

cudnn.benchmark = True

if torch.cuda.is_available() and not opt.cuda:
    print("WARNING: You have a CUDA device, so you should probably run with --cuda")

train_dataset = dataset.lmdbDataset(root=opt.trainroot)
assert train_dataset
if not opt.random_sample:
    sampler = dataset.randomSequentialSampler(train_dataset, opt.batchSize)
else:
    sampler = None

train_loader = torch.utils.data.DataLoader(
    train_dataset, batch_size=opt.batchSize,
    shuffle=True, sampler=sampler,
    num_workers=int(opt.workers),
    drop_last=True,
    collate_fn=dataset.alignCollate(imgH=opt.imgH, imgW=opt.imgW, keep_ratio=opt.keep_ratio))

test_dataset = dataset.lmdbDataset(
    root=opt.valroot)

test_loader = torch.utils.data.DataLoader(
    test_dataset, batch_size=opt.batchSize,
    shuffle=True, sampler=None,
    num_workers=int(opt.workers),
    drop_last=True,
    collate_fn=dataset.alignCollate(imgH=opt.imgH, imgW=opt.imgW, keep_ratio=opt.keep_ratio))

alphabet = open(opt.alphabet).read().rstrip()
nclass = len(alphabet) + 1
nc = 1

print(len(alphabet), alphabet)
converter = utils.strLabelConverter(alphabet)
criterion = CTCLoss()


# custom weights initialization called on crnn
def weights_init(m):
    classname = m.__class__.__name__
    if classname.find('Conv') != -1:
        m.weight.data.normal_(0.0, 0.02)
    elif classname.find('BatchNorm') != -1:
        m.weight.data.normal_(1.0, 0.02)
        m.bias.data.fill_(0)


crnn = crnn.CRNN(opt.imgH, nc, nclass, opt.nh)
crnn.apply(weights_init)
if opt.pretrained != '':
    print('loading pretrained model from %s' % opt.pretrained)
    pretrain = torch.load(opt.pretrained)
    crnn.load_state_dict(pretrain, strict=False)

image = torch.FloatTensor(opt.batchSize, 3, opt.imgH, opt.imgH)
text = torch.IntTensor(opt.batchSize * 5)
length = torch.IntTensor(opt.batchSize)

if opt.cuda:
    crnn.cuda()
    crnn = torch.nn.DataParallel(crnn, device_ids=range(opt.ngpu))
    image = image.cuda()
    criterion = criterion.cuda()
summary(crnn, (1, 64, 1024))

image = Variable(image)
text = Variable(text)
length = Variable(length)


# setup optimizer
if opt.adam:
    optimizer = optim.Adam(crnn.parameters(), lr=opt.lr,
                           betas=(opt.beta1, 0.999))
elif opt.adadelta:
    optimizer = optim.Adadelta(crnn.parameters())
else:
    optimizer = optim.RMSprop(crnn.parameters(), lr=opt.lr)


def val(net, data_loader, criterion, max_iter=1000):
    print('Start val')

    for p in crnn.parameters():
        p.requires_grad = False

    net.eval()
    
    val_iter = iter(data_loader)

    i = 0
    loss_avg = 0
    cer_loss_avg = 0
    max_iter = min(max_iter, len(data_loader))
    for i in range(max_iter):
        data = val_iter.next()
        i += 1
        cpu_images, cpu_texts = data
        batch_size = cpu_images.size(0)
        utils.loadData(image, cpu_images)
        t, l = converter.encode(cpu_texts)
        utils.loadData(text, t)
        utils.loadData(length, l)

        preds = crnn(image)
        preds_size = Variable(torch.IntTensor([preds.size(0)] * batch_size))
        cost = criterion(preds, text, preds_size, length)
        loss_avg += cost

        _, preds = preds.max(2)
        preds = preds.transpose(1, 0).contiguous().view(-1)
        sim_preds = converter.decode(preds.data, preds_size.data, raw=False)
        cer_loss = utils.cer_loss(sim_preds, cpu_texts, ignore_case=False)
        cer_loss_avg += cer_loss

    loss_avg /= len(data_loader.dataset)
    cer_loss_avg /= len(data_loader.dataset)

    raw_preds = converter.decode(preds.data, preds_size.data, raw=True)[:opt.n_test_disp]
    for raw_pred, pred, gt in zip(raw_preds, sim_preds, cpu_texts):
        print('%-30s => %-30s, gt: %-30s' % (raw_pred, pred, gt))

    print('Test loss: %f - cer loss %f' % (loss_avg, cer_loss_avg))


def trainBatch(net, criterion, optimizer):
    data = train_iter.next()
    cpu_images, cpu_texts = data
    
    batch_size = cpu_images.size(0)
    utils.loadData(image, cpu_images)
    t, l = converter.encode(cpu_texts)
    utils.loadData(text, t)
    utils.loadData(length, l)
    
    preds = crnn(image)
    preds_size = Variable(torch.IntTensor([preds.size(0)] * batch_size))
    cost = criterion(preds, text, preds_size, length) 
#    cost /= len(cpu_images)
    crnn.zero_grad()
    cost.backward()
    optimizer.step()

    _, preds = preds.max(2)
    preds = preds.transpose(1, 0).contiguous().view(-1)
    sim_preds = converter.decode(preds.data, preds_size.data, raw=False)
    cer_loss = utils.cer_loss(sim_preds, cpu_texts, ignore_case=False)
#    cer_loss /= len(cpu_images)

    return cost, cer_loss


for epoch in range(1, opt.nepoch+1):
    train_iter = iter(train_loader)
    loss_avg = 0
    cer_avg = 0
    i = 0

    while i < len(train_loader):
        for p in crnn.parameters():
            p.requires_grad = True
        crnn.train()

        cost, cer_loss = trainBatch(crnn, criterion, optimizer)        
        loss_avg += cost
        cer_avg += cer_loss
        i += 1
    
    loss_avg/=len(train_loader.dataset)
    cer_avg/=len(train_loader.dataset)

    if epoch % opt.displayInterval == 0:
        print('[%d/%d] Loss: %f - cer loss: %f' %
                (epoch, opt.nepoch, loss_avg, cer_avg))

    if epoch % opt.valInterval == 0:
        val(crnn, test_loader, criterion)

    # do checkpointing
    if epoch% opt.saveInterval == 0:
        torch.save(
            crnn.module.state_dict(), '{}.epoch_{}'.format(opt.save_model, epoch))
