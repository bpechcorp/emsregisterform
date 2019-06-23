import torch
from torch.autograd import Variable
import utils
import dataset
from PIL import Image
import os 
import models.crnn as crnn


model_path = './expr/netCRNN.pth'
img_path = './data/12966-0_6.jpg'
alphabet = ' -,:?/.&+0123456789aáàăắẵâầẫậãảạbcdđeéèêếễệfghiíìĩỉịjklmnoóòôốồộơớờpqrstuúũụưửvwxy'
nclass = len(alphabet) + 1

model = crnn.CRNN(32, 1, nclass, 256)
if torch.cuda.is_available():
    model = model.cuda()
print('loading pretrained model from %s' % model_path)
model.load_state_dict(torch.load(model_path, map_location='cpu'))

converter = utils.strLabelConverter(alphabet)

transformer = dataset.resizeNormalize((300, 32))
data_dir = "../../../data/id"
list_file = os.listdir(data_dir) 
for fname in list_file:
    print (fname)
    img_path = os.path.join(data_dir, fname) 
    image = Image.open(img_path).convert('L')
    image = transformer(image)
    if torch.cuda.is_available():
        image = image.cuda()
    image = image.view(1, *image.size())
    image = Variable(image)

    model.eval()
    preds = model(image)

    _, preds = preds.max(2)
    preds = preds.transpose(1, 0).contiguous().view(-1)

    preds_size = Variable(torch.IntTensor([preds.size(0)]))
    raw_pred = converter.decode(preds.data, preds_size.data, raw=True)
    sim_pred = converter.decode(preds.data, preds_size.data, raw=False)
    print('%-20s => %-20s' % (raw_pred, sim_pred))
