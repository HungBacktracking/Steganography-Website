from flask import Blueprint, request
from controllers.audio_controller import get_audio_encoded, get_audio_decoded

audio = Blueprint("audio", __name__)

@audio.route("/audio/encoded", methods=["POST"])
def get_audio_encoded():
    return get_audio_encoded(request.json) # Example of how to use the audio function from the controller

@audio.route("/audio/decoded", methods=["POST"])
def get_audio_decoded():
    return get_audio_decoded(request.json) # Example of how to use the audio function from the controller



