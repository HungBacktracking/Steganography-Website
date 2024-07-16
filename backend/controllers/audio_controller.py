import io
import base64
from flask import jsonify, send_file, request
from models.audio_model import AudioSteganography


def _detect_prefix(data):
    index_of_comma = data.find(',')
    if index_of_comma != -1:
        prefix = data[:index_of_comma+1]
        new_data = data[index_of_comma + 1:]
    else:
        prefix = ""
        new_data = data

    return prefix, new_data

def get_audio_encoded(request):
    try:
        print("Get data from request")
        audio_base64 = request['audio']
        message = request['message']

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    prefix, new_audio_base64 = _detect_prefix(audio_base64)

    try:
        audio_data = base64.b64decode(new_audio_base64)
        audio_file = io.BytesIO(audio_data)

        stego = AudioSteganography()
        modified_audio = stego.hide_data(audio_file, message)

        audio_io = io.BytesIO()
        modified_audio.save(audio_io, format='wav')
        audio_io.seek(0)

        encoded_audio = prefix + base64.b64encode(audio_io.getvalue()).decode()

        return jsonify({'audio': encoded_audio})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def get_audio_decoded(request):
    try:
        audio_base64 = request['audio']
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    prefix, new_audio_base64 = _detect_prefix(audio_base64)

    try:
        audio_data = base64.b64decode(new_audio_base64)
        audio_file = io.BytesIO(audio_data)

        stego = AudioSteganography()
        message = stego.recover_data(audio_file)

        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500