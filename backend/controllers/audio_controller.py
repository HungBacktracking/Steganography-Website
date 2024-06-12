from flask import jsonify


def get_audio_encoded(data):
    # This is where the audio encoding will be done by calling function from the model
    value = 1
    return jsonify({"message": "Audio encoded successfully", "data": value})