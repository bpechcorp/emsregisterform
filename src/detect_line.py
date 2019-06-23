
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


def read_bgr(fname):
    return cv2.imread(fname, 1)

def plot_img(img):
    if len(img.shape) == 3:
        plt.imshow(img)
    else:
        plt.imshow(img, cmap='gray', vmin=0, vmax=255)        

def read_rgb(fname):
    img = cv2.imread(fname, 1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

def rgb2gray(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    return gray

def resize(img):
    ratio = img.shape[0] / 100.0
    image = imutils.resize(img, height = 300)
    return image

def gray_to_bw(gray):
    thresh, im_bw = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    return im_bw

def canny_edge(gray):
    edged = cv2.Canny(gray, 20, 100)
    return edged

def rgb_to_bgr(rgb):
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)

def save_image(fname, img):
    cv2.imwrite(fname, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))

def draw_boxes(image, boxes):
    for i in range(len(boxes)):
        (x, y) = (boxes[i][0], boxes[i][1])
        (w, h) = (boxes[i][2], boxes[i][3])
        
        cv2.rectangle(image, (x, y), (w, h), red, 5)
        cv2.putText(image, str(i), (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
                    2, red, 4)
    
    plot_img(image)

    return image
       

def overlap(x0, x1):
    olap = [0] * 2
    
    if x0[0] >= x1[1] or x0[1] <= x1[0]:
        return 0.
    
    olap[0] = max(x0[0], x1[0])
    olap[1] = min(x0[1], x1[1])
    
#     print(x0, x1, olap)
    
    return len_x(*olap) * 1. / max(len_x(x0[0], x1[1]), len_x(x0[1], x1[0]))

def overlap_hor(x0, x1):
    olap = min(len_x(x0[1], x1[0]), len_x(x0[0], x1[1]))
    total =  max(len_x(x0[1], x1[0]), len_x(x0[0], x1[1]))
#     print(x0, x1, olap, total)
    return olap * 1. / total

def olap_box(box0, box1):
    x0 = [box0[1], box0[3]]
    x1 = [box1[1], box1[3]]
    return overlap(x0, x1)
    

def olap_box_hor(box0, box1):
    x0 = [box0[0], box0[2]]
    x1 = [box1[0], box1[2]]
    return overlap_hor(x0, x1)
    

def join_box(box0, box1):
    return (min(box0[0], box1[0]), min(box0[1], box1[1]), max(box0[2], box1[2]), max(box0[3], box1[3]))

def len_x(a, b):
    return abs(a - b)

def join_all_boxes(list_box):
    boxes = list_box.copy()
    
    # sort by x[1]
    boxes = sorted(boxes, key=lambda x: x[1])
    ret = []
    
    for i in range(len(boxes) - 1):
        if olap_box(boxes[i], boxes[i + 1]) > 0.6:
            if olap_box_hor(boxes[i], boxes[i + 1]) < 0.2:
                ret.append(i)
    
    ret_boxes = []
    # 
    i = 0
    while i < len(boxes):
        if i not in ret:
            ret_boxes.append(boxes[i])
            i += 1
        else:
            bb = join_box(boxes[i], boxes[i + 1])
            ret_boxes.append(bb)
            i += 2
    
    return ret_boxes
        

def join_all_boxes(list_box):
    boxes = list_box.copy()
    
    # sort by x[1]
    boxes = sorted(boxes, key=lambda x: x[1])
    ret_boxes = []
    ret_boxes.append(boxes[0])
    
    for i in range(len(boxes) - 1):
        if olap_box(ret_boxes[-1], boxes[i + 1]) > 0.6:
            box = ret_boxes.pop()
            box = join_box(box, boxes[i + 1])
            ret_boxes.append(box)
        else:
            ret_boxes.append(boxes[i + 1])
    
    return ret_boxes

def get_out_name(fname):
    return fname.split('.')[0] + '_out.png'

def draw_boxes(image, boxes):
    for i in range(len(boxes)):
        (x, y) = (boxes[i][0], boxes[i][1])
        (w, h) = (boxes[i][2], boxes[i][3])
        
        cv2.rectangle(image, (x, y), (w, h), red, 5)
        cv2.putText(image, str(i), (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
                    2, red, 4)
    
    plot_img(image)

    return image  

### Too much noise

def boxes_pipeline(fname, line_detector):
    print('Detecting boxes...')
    list_box = line_detector.run_file(fname)
    print('Got {} boxes'.format(len(list_box)))
    
    
    # Refine boxes
    img = read_rgb(fname)
    img_height = img.shape[0]

    boxes = refine_boxes(list_box, img_height, 0.11)

    # Draw
    img = draw_boxes(img, boxes)
    save_image(get_out_name(fname), img)
    return boxes

def refine_boxes(boxes, img_height, ratio=0.11):
    # Filter
    boxes = filter_boxes(boxes, img_height, ratio=ratio)
    print('Filter down to {} boxes.'.format(len(boxes)))
    
    # Join
    boxes = join_all_boxes(boxes)
    return boxes

def box_height(box):
    return abs(box[3] - box[1])

def filter_boxes(boxes, max_height, ratio=0.11):
    ret = []
    for box in boxes:
        rate = box_height(box) * 1. / max_height
        if rate > ratio:
            ret.append(box)
    return ret

