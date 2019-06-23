import cv2
import numpy as np
from PIL import ImageDraw
import copy
import cv2 
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import imutils
import sys 

from_box_ratio = [150./1686, 165./2600, 600./1686, 1205./2600] 
to_box_ratio = [150./1686, 1195./2600, 590./1686, 2420./2600] 
def save_image(fname, img):
    cv2.imwrite(fname, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
def run(path):
    img = cv2.imread(path)
    sp = img.shape
    _from_box_ratio = copy.deepcopy(from_box_ratio)
    _to_box_ratio = copy.deepcopy(to_box_ratio)
    _from_box_ratio[0] = int(sp[0] * _from_box_ratio[0])
    _from_box_ratio[2] = int(sp[0] * _from_box_ratio[2])
    _from_box_ratio[1] = int(sp[1] * _from_box_ratio[1])
    _from_box_ratio[3] = int(sp[1] * _from_box_ratio[3])
    #
    _to_box_ratio[0] = int(sp[0] * _to_box_ratio[0])
    _to_box_ratio[2] = int(sp[0] * _to_box_ratio[2])
    _to_box_ratio[1] = int(sp[1] * _to_box_ratio[1])
    _to_box_ratio[3] = int(sp[1] * _to_box_ratio[3])
    # print (_from_box_ratio)
    from_img = img[_from_box_ratio[0]:_from_box_ratio[2],_from_box_ratio[1]:_from_box_ratio[3]]
    # show(from_img)
    save_image("region_from.png", from_img)
    to_img = img[_to_box_ratio[0]:_to_box_ratio[2],_to_box_ratio[1]:_to_box_ratio[3]]
    # show(to_img)
    save_image("region_to.png", to_img)

if __name__ == "__main__":
    run(sys.argv[1])