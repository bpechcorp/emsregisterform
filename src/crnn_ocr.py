import torch
from torch.autograd import Variable
import ocr.crnn.utils as utils
import ocr.crnn.dataset as dataset 
from PIL import Image
import os 
import sys 
import ocr.crnn.models.crnn as crnn
from torch.nn.functional import softmax


class CRNNOCR(object):
    def __init__(self, model_path, alphabet_path, normalize_size):
        self.model_path = model_path 
        self.alphabet = open(alphabet_path).read().rstrip()
        self.nclass = len(self.alphabet) + 1
        self.model = crnn.CRNN(32, 1, self.nclass, 256)
        self.model.load_state_dict(torch.load(self.model_path, map_location='cpu'))
        self.converter = utils.strLabelConverter(self.alphabet)
        self.transformer = dataset.resizeNormalize(normalize_size)
        print('ocr alphabet: {}'.format(self.alphabet))

    def run_image(self, img):
        image = img.convert("L") 
        image = self.transformer(image)
        if torch.cuda.is_available():
            image = image.cuda()
        image = image.view(1, *image.size())
        image = Variable(image)
        self.model.eval()
        preds = self.model(image)
        
        values, prob = softmax(preds, dim=-1).max(2)
        preds_idx = (prob > 0).nonzero()
        sent_prob = values[preds_idx[:,0], preds_idx[:, 1]].mean().item()

        _, preds = preds.max(2)
        preds = preds.transpose(1, 0).contiguous().view(-1)

        preds_size = Variable(torch.IntTensor([preds.size(0)]))
        raw_pred = self.converter.decode(preds.data, preds_size.data, raw=True)
        sim_pred = self.converter.decode(preds.data, preds_size.data, raw=False)
        print('%-20s => %-20s' % (raw_pred, sim_pred))
        return sim_pred, sent_prob

    def run_path(self, path):
        img = Image.open(path) 
        return self.run_image(img)

if __name__ == "__main__":
    ocr_engine = CRNNOCR()
    ocr_engine.run_path(sys.argv[1])
