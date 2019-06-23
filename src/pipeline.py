import os, sys, time, copy, datetime
from flask import Flask, render_template, request, jsonify, current_app
import argparse
import subprocess
import pytesseract 
import json 
import wget
import time
from detect_rectangle import detect_rect
from barcode import readBar
from detect_region import detect_region
from detect_line import boxes_pipeline
from PIL import Image, ImageDraw
import crnn_ocr 
from ctpn.get_boxes import LineDetector
from firebase import Firebase
import urllib.request

firebaseConfig = {
    "apiKey": "AIzaSyAOew38a3cmVkrClA3TfIeJwgP-xEBIhdE",
    "authDomain": "vnpost-6d57e.firebaseapp.com",
    "databaseURL": "https://vnpost-6d57e.firebaseio.com",
    "projectId": "vnpost-6d57e",
    "storageBucket": "vnpost-6d57e.appspot.com",
    "messagingSenderId": "419665295516",
    "appId": "1:419665295516:web:7e3ec35c1c4e7514"
  }
firebase = Firebase(firebaseConfig)


line_detector = LineDetector("ctpn/network/ctpn.pb") 

app = Flask(__name__)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DPI = 300
ALL_LINE_SIZE = (1000, 64)
all_ocrer = crnn_ocr.CRNNOCR(model_path="../duc/vnpost_ocr/ocr.model", normalize_size=ALL_LINE_SIZE, 
        alphabet_path="../duc/vnpost_ocr/char")

root_dir = os.getcwd()

def process_region(path):
    list_lines = boxes_pipeline(path, line_detector)
    print (list_lines)
    list_text = []
    org_img = Image.open(path).convert("RGB")
    for line in list_lines:
        # crop 
        cropped = org_img.crop(line)
        # detect
        line_content, sent_prob = all_ocrer.run_image(cropped) 
        print ("content:", line_content, sent_prob )
        list_text.append(line_content)
        name = list_text[0]
        phone = list_text[-1]
        address = " ".join(list_text[1:-1])
    return {"name":name, "address":address, "phone":phone}

app.config['JSON_AS_ASCII'] = False
@app.route("/upload", methods=['POST'])
def upload():
    # upload a file: curl -F "file=@/data/workspace/evnml/data/pdf/14178.PDF" localhost:2019/upload
    data_path = os.path.join(root_dir, "../data")
    os.makedirs(name=data_path, exist_ok=True)
    try:
        if request.method == 'POST':
            _data = request.data.decode()
            if (len(_data)):
                url = eval(_data)["url"]
            else:
                url = request.form.get('url')
            tmp_name = "../data/{}.jpg".format(int(time.time()*1000))
            print ("[INFO] Save",url," to ", tmp_name)
            # wget.download(url, tmp_name, bar=None)
            urllib.request.urlretrieve(url, tmp_name)  
            detect_rect.run(tmp_name)
            detect_region.run("crop.png")
            bar_string = readBar.run("bar.png")
            # 
            result_metadata = {}
            result_metadata["from"] = process_region("region_from.png")
            result_metadata["to"] = process_region("region_to.png")
            result_metadata["barcode"] = bar_string
            result_metadata["status"] = True
            return jsonify(result_metadata)
    except Exception as e:
        print (e) 
        return jsonify({"status":False, "error":e})

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    app.run(host="0.0.0.0", port=30033, debug=False)
 