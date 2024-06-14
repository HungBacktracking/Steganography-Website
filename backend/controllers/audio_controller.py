from flask import jsonify, send_file, request
from models.audio_model import AudioSteganography


def get_audio_encoded(data):
    try:
        audio_file = request.files['audio']
        message = request.form['message']

        stego = AudioSteganography()
        modified_audio = stego.hide_data(audio_file, message)

        return send_file(modified_audio, attachment_filename='stego_audio.wav', as_attachment=True, mimetype='audio/wav')
    except Exception as e:
        return jsonify({'error': str(e)})
    
def get_audio_decoded(data):
    try:
        audio_file = request.files['audio']
        bytes_to_recover = int(request.form['bytes'])

        stego = AudioSteganography()
        message = stego.recover_data(audio_file, bytes_to_recover)

        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)})