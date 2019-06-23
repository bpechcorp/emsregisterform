import cv2 
from pyzbar import pyzbar
import sys 
import pytesseract
from PIL import Image 

def run(path):
    content = "EP071810491VN"
    img = cv2.imread(path) 
    list_bar = pyzbar.decode(img) 
    if len(list_bar) > 0:
        dc = list_bar[0] 
        return dc.data.decode()
    else:
        list_lines = pytesseract.image_to_string(Image.open(path))
        # print("Run with tesseract.")
        # print (list_lines)
        for line in list_lines.split("\n"):
            if "VN" in line :
                content = line.replace(" ","")
    return content
if __name__ == "__main__":
    content = run(sys.argv[1])
    print (content)