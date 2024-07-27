import base64
import io
from flask import jsonify, request
from utils import detect_prefix
from models.video_model import VideoSteganography
import traceback
import tempfile
import os

def get_video_encoded():
    try:
        print("Get data from request")
        video_base64 = request.json['video']
        message = request.json['message']

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    print(message)

    prefix, new_video_base64 = detect_prefix(video_base64)

    try:
        print("Decode the base64-encoded video")
        video_data = base64.b64decode(new_video_base64)
        
        print("Call encode")
        stego = VideoSteganography()
        modified_video = stego.hide_data(video_data, message)

        print("Encode result video")
        encoded_video = prefix + base64.b64encode(modified_video.getvalue()).decode()

        print("Return response")
        return jsonify({'video': encoded_video}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
def get_video_decoded():
    try:
        video_base64 = request.json['video']
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    _, new_video_base64 = detect_prefix(video_base64)

    try:
        video_data = base64.b64decode(new_video_base64)

        stego = VideoSteganography()
        message = stego.recover_data(video_data)

        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500