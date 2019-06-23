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

def gray_to_bw(gray, thr=128):
    thresh, im_bw = cv2.threshold(gray, thr, 255, cv2.THRESH_BINARY )
#     im_bw = cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)
    return im_bw

def canny_edge(gray):
    edged = cv2.Canny(gray, 20, 100)
    return edged
def show(img):
    plt.figure(figsize=(10,8))
    plt.imshow(img, cmap='gray')
    plt.show()
def check_pixel(pixel):
    THR = 50
    r,g,b = pixel 
    if np.abs(r-g) < THR and np.abs(r-b) < THR and np.abs(g-b) < THR :
        return True
    return False

def _persp_transform(img, s_points):
    """Transform perspective from start points to target points."""
    # Euclidean distance - calculate maximum height and width
    height = max(np.linalg.norm(s_points[0] - s_points[1]),
                 np.linalg.norm(s_points[2] - s_points[3]))
    width = max(np.linalg.norm(s_points[1] - s_points[2]),
                 np.linalg.norm(s_points[3] - s_points[0]))
    # Create target points
    t_points = np.array([[0, 0],
                        [0, height],
                        [width, height],
                        [width, 0]], np.float32)
    
    # getPerspectiveTransform() needs float32
    if s_points.dtype != np.float32:
        s_points = s_points.astype(np.float32)
    M = cv2.getPerspectiveTransform(s_points, t_points) 
    return cv2.warpPerspective(img, M, (int(width), int(height)))

def save_image(fname, img):
    cv2.imwrite(fname, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))

def run(path):
    img = read_rgb(path)
    sp = img.shape
    img = cv2.resize(img, (int(sp[1]/2), int(sp[0]/2)))
    sp = img.shape
    _mask = np.zeros((sp[0], sp[1]))
    img_b = img[:,:,0]
    img_g = img[:,:,1]
    img_r = img[:,:,2]
    img_sub = np.abs(img_r.astype(int) - img_b.astype(int))
    img_sub = img_sub.astype(np.uint8)
    bw = gray_to_bw(img_sub, 50) 
    kernel = np.ones((15,15),np.uint8)
    img_erosion = cv2.dilate(bw,kernel,iterations = 1)
    img_erosion = 255 - img_erosion
    im2, contours, hierarchy = cv2.findContours(img_erosion, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    max_area = -1
    max_contour = None
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > max_area:
            max_area = area
            max_contour = cnt
    epsilon = 0.1*cv2.arcLength(max_contour,True)
    approx = cv2.approxPolyDP(max_contour,epsilon,True)
    sp = img_erosion.shape
    print (sp)
    print (approx)
    list_point = []
    for x in approx:
        list_point.append((x[0][0]/sp[1], x[0][1]/sp[0]))
    # list_point = np.array(list_point) 
    img = read_rgb(path)
    _sp = img.shape
    list_4_points = [(int(e[0]*_sp[1]), int( e[1]*_sp[0])) for e in list_point]
    list_4_points = np.array(list_4_points)
    _per = _persp_transform(img, list_4_points)
    cv2.imwrite("crop.png", _per)
    _sp = _per.shape 
    bar_img = _per[0:int(_sp[0]*0.12), int(_sp[1]*0.48):int(_sp[1]*0.85) ]
    cv2.imwrite("bar.png", bar_img)
    # return list_point
    return _per
    
if __name__ == "__main__":
    res = run(sys.argv[1])
