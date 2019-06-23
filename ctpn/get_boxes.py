from PIL import Image, ImageDraw 
import sys, os 
import cv2
import matplotlib.pyplot as plt 
import numpy as np
import tensorflow as tf
from tensorflow.python.platform import gfile

sys.path.append(os.getcwd()+"/ctpn")
from lib.fast_rcnn.config import cfg, cfg_from_file
from lib.fast_rcnn.test import _get_blobs
from lib.text_connector.detectors import TextDetector
from lib.text_connector.text_connect_cfg import Config as TextLineCfg
from lib.rpn_msr.proposal_layer_tf import proposal_layer


class LineDetector(object):
    def __init__ (self, pb_path='network/ctpn.pb'):
        # cfg_from_file('ctpn/text.yml')
        # init session
        self.config = tf.ConfigProto(allow_soft_placement=True)
        self.sess = tf.Session(config=self.config)
        with gfile.FastGFile( pb_path, 'rb') as f:
            self.graph_def = tf.GraphDef()
            self.graph_def.ParseFromString(f.read())
            self.sess.graph.as_default()
            tf.import_graph_def(self.graph_def, name='')
        self.sess.run(tf.global_variables_initializer())

        self.input_img = self.sess.graph.get_tensor_by_name('Placeholder:0')
        self.output_cls_prob = self.sess.graph.get_tensor_by_name('Reshape_2:0')
        self.output_box_pred = self.sess.graph.get_tensor_by_name('rpn_bbox_pred/Reshape_1:0')
    def resize_im(self, im, scale, max_scale=None):
        f = float(scale) / min(im.shape[0], im.shape[1])
        if max_scale != None and f * max(im.shape[0], im.shape[1]) > max_scale:
            f = float(max_scale) / max(im.shape[0], im.shape[1])
        return cv2.resize(im, None, None, fx=f, fy=f, interpolation=cv2.INTER_LINEAR), f

    def draw_boxes(self, img, boxes, scale):
        result = []
        for box in boxes:
            if np.linalg.norm(box[0] - box[1]) < 5 or np.linalg.norm(box[3] - box[0]) < 5:
                continue
            min_x = min(int(box[0] / scale), int(box[2] / scale), int(box[4] / scale), int(box[6] / scale))
            min_y = min(int(box[1] / scale), int(box[3] / scale), int(box[5] / scale), int(box[7] / scale))
            max_x = max(int(box[0] / scale), int(box[2] / scale), int(box[4] / scale), int(box[6] / scale))
            max_y = max(int(box[1] / scale), int(box[3] / scale), int(box[5] / scale), int(box[7] / scale))
            result.append((min_x, min_y, max_x, max_y)) 
            # fragment = [int (box[i]) for i in range(8)]
            # fragment[0], fragment[2] = fragment[2], fragment[0]
            # fragment[1], fragment[3] = fragment[3], fragment[1]
            # result.append(fragment) 
        return result 

    def run_image(self, img_arr):
        img = np.array(img_arr)
        img, scale = self.resize_im(img, scale=TextLineCfg.SCALE, max_scale=TextLineCfg.MAX_SCALE)
        blobs, im_scales = _get_blobs(img, None)
        if cfg.TEST.HAS_RPN:
            im_blob = blobs['data']
            blobs['im_info'] = np.array(
                [[im_blob.shape[1], im_blob.shape[2], im_scales[0]]],
                dtype=np.float32)
        cls_prob, box_pred = self.sess.run([self.output_cls_prob, self.output_box_pred], feed_dict={self.input_img: blobs['data']})
        rois, _ = proposal_layer(cls_prob, box_pred, blobs['im_info'], 'TEST', anchor_scales=cfg.ANCHOR_SCALES)

        scores = rois[:, 0]
        boxes = rois[:, 1:5] / im_scales[0]
        textdetector = TextDetector()
        boxes = textdetector.detect(boxes, scores[:, np.newaxis], img.shape[:2])
        result = self.draw_boxes(img, boxes, scale)
        return result

    def run_file(self, img_path):
        img_arr = cv2.imread(img_path)
        return self.run_image(img_arr)

if __name__ == "__main__":
    line_detector = LineDetector()  
    fname = sys.argv[1]
    list_box = line_detector.run_file(sys.argv[1])
    print (list_box)

    def draw_line(img, text_lines):
        arr = img.copy() 
        draw = ImageDraw.Draw(arr)
        for c in text_lines:
            coord = [c[0], c[1], c[0], c[3], c[2], c[3], c[2], c[1], c[0], c[1]]
            draw.line(coord, "#ff0000")
        return arr

    img = Image.open(sys.argv[1]) 
    arr = draw_line(img, list_box)

    outname = fname.split('.')[0] + '_out.png'
    arr.save(outname, "PNG")
    arr.show()
    

