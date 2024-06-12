from flask import jsonify
from models.audio_model import Audio


def get_audio_encoded(data):
    # This is where the audio encoding will be done by calling function from the model
    value = Audio.encode(data) # Dummy implementation
    return jsonify({"message": "Audio encoded successfully", "data": value})