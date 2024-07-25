import io
import base64
from flask import jsonify, request
from models.video_model import VideoSteganography


def _detect_prefix(data):
    index_of_comma = data.find(',')
    if index_of_comma != -1:
        prefix = data[:index_of_comma + 1]
        new_data = data[index_of_comma + 1:]
    else:
        prefix = ""
        new_data = data

    return prefix, new_data

def get_video_encoded():
    print("---------------- Try encode video")

    try:
        print("Get data from request")
        video_base64 = request.json['video']
        message = request.json['message']

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    print(message)
    
    prefix, new_video_base64 = _detect_prefix(video_base64)

    try:
        print("Decode the base64-encoded video")
        video_data = base64.b64decode(new_video_base64)
        video_file = io.BytesIO(video_data)

        print("Call encode")
        stego = VideoSteganography()
        modified_video = stego.hide_data(video_file, message)

        print("Encode result video")
        encoded_video = prefix + base64.b64encode(modified_video.getvalue()).decode()

        print("Return response")
        return jsonify({'video': encoded_video})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500

def get_video_decoded():
    print("---------------- Try decode video")

    try:
        video_base64 = request.json['video']
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    prefix, new_video_base64 = _detect_prefix(video_base64)

    try:
        video_data = base64.b64decode(new_video_base64)
        video_file = io.BytesIO(video_data)

        stego = VideoSteganography()
        message = stego.recover_data(video_file)

        return jsonify({'message': message})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
