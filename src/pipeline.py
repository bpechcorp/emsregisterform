import os, sys, time, copy, datetime
from flask import Flask, render_template, request, jsonify, current_app
import argparse
import subprocess
import pytesseract 
import json 


app = Flask(__name__)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DPI = 300

root_dir = os.getcwd()

app.config['JSON_AS_ASCII'] = False
@app.route("/upload", methods=['POST'])
def upload():
    # upload a file: curl -F "file=@/data/workspace/evnml/data/pdf/14178.PDF" localhost:2019/upload
    data_path = os.path.join(root_dir, "../data")
    os.makedirs(name=data_path, exist_ok=True)
    try:
        result_metadata = {}
        result_metadata["from"] = {"name":"Ha Nhat Cuong", "address":"182 Le Dai Hanh, Phuong 15, Quan 11, HCM", "phone":"0169696969"}
        result_metadata["to"] = {"name":"Pham Ba Cuong Quoc", "address":"69 Le Dai Hanh, Phuong 15, Quan 11, HCM", "phone":"0169696969"}
        result_metadata["barcode"] = "MK023948234"
        result_metadata["status"] = True
        return jsonify(result_metadata)
    except Exception as e:
        print (e) 
        return jsonify({"status":False, "error":e})

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    app.run(host="0.0.0.0", port=30033, debug=False)
 