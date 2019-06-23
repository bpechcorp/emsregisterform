import torch
from torch.autograd import Variable
import utils
import dataset 
from PIL import Image
import os 
import sys 
import crnn
from torch.nn.functional import softmax
import tensorflow as tf
import argparse
import numpy as np

class BeamSearchDecoder():
    def __init__(self, lib, corpus, chars, word_chars, beam_width=50, lm_type='Words', lm_smoothing=0.2, tfsess=None):
        word_beam_search_module = tf.load_op_library(lib)
        self.mat = tf.placeholder(tf.float32)
        corpus = open(corpus).read()
        chars = open(chars).read()
        word_chars = open(word_chars).read()

        self.beamsearch_decoder = word_beam_search_module.word_beam_search(self.mat, beam_width, lm_type, lm_smoothing, corpus, chars, word_chars)
        self.tfsess = tfsess or tf.Session()
        self.idx2char = dict(zip(range(0, len(chars)), chars))

    def beamsearch(self, mat):

        mat = np.concatenate((mat[:,:, 1:], mat[:,:,:1]), axis=-1)
        results=self.tfsess.run(self.beamsearch_decoder, {self.mat:mat})
        return results

    def decode(self, preds_idx):
        return [''.join([self.idx2char[idx] for idx in row if idx < len(self.idx2char)]) for row in preds_idx]


class CRNNOCR(object):
    def __init__(self, model_path, alphabet_path, normalize_size, beamsearch_lib, corpus, word_chars):
        self.model_path = model_path 
        self.alphabet = open(alphabet_path).read().rstrip()
        self.nclass = len(self.alphabet) + 1
        self.model = crnn.CRNN(32, 1, self.nclass, 256)
        self.model = self.model.cuda()

        self.model.load_state_dict(torch.load(self.model_path))

        self.converter = utils.strLabelConverter(self.alphabet)
        self.transformer = dataset.resizeNormalize(normalize_size)
    
        self.beam_decoder = BeamSearchDecoder(
                    beamsearch_lib,
                    corpus,
                    alphabet_path,
                    word_chars)

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
                
        preds_ = Variable(torch.FloatTensor(preds.detach().cpu().numpy().astype('float')))
        preds_ = self.beam_decoder.beamsearch(softmax(preds_, -1))
        sim_pred = self.beam_decoder.decode(preds_)[0]

        return sim_pred, sent_prob

    def run_path(self, path):
        img = Image.open(path) 
        return self.run_image(img)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--img', required=True, help='path to img')
    parser.add_argument('--alphabet', required=True, help='path to vocab')
    parser.add_argument('--model', required=True, help='path to model')
    parser.add_argument('--imgW', type=int, default=1024, help='path to model')
    parser.add_argument('--imgH', type=int, default=64, help='path to model')

    parser.add_argument('--beamsearch_lib', type=str, required=True, help='path to beamsearch lib')
    parser.add_argument('--corpus', type=str, required=True, help='path to corpus to learn language model')
    parser.add_argument('--word_chars', type=str, required=True, help='path to word chars which was removed number')

    opt = parser.parse_args()
    ocr_engine = CRNNOCR(model_path=opt.model, alphabet_path=opt.alphabet, normalize_size=(opt.imgW, opt.imgH), beamsearch_lib=opt.beamsearch_lib, corpus=opt.corpus, word_chars=opt.word_chars)

    pred, prob = ocr_engine.run_path(opt.img)
    print('pred: {} \t prob: {}'.format(pred, prob))
