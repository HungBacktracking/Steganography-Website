import io
import base64
from flask import jsonify, send_file, request
from utils import detect_prefix
from models.audio_model import AudioSteganography

def get_audio_encoded():
    try:
        print("Get data from request")
        audio_base64 = request.json['audio']
        message = request.json['message']

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    print(message)
    
    prefix, new_audio_base64 = detect_prefix(audio_base64)

    try:
        print("Decode the base64-encoded audio")
        audio_data = base64.b64decode(new_audio_base64)
        audio_file = io.BytesIO(audio_data)

        print("Call encode")
        stego = AudioSteganography()
        modified_audio = stego.hide_data(audio_file, message)

        print("Encode result audio")
        encoded_audio = prefix + base64.b64encode(modified_audio.getvalue()).decode()

        print("Return response")
        return jsonify({'audio': encoded_audio})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def get_audio_decoded():
    try:
        audio_base64 = request.json['audio']
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    prefix, new_audio_base64 = detect_prefix(audio_base64)

    try:
        audio_data = base64.b64decode(new_audio_base64)
        audio_file = io.BytesIO(audio_data)

        stego = AudioSteganography()
        message = stego.recover_data(audio_file)

        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500