from flask import Blueprint, request
from controllers.audio_controller import get_audio_encoded, get_audio_decoded

audio = Blueprint("audio", __name__)

@audio.route("/audio/encoded", methods=["POST"])
def hanlde_audio_encoded():
    return get_audio_encoded() # Example of how to use the audio function from the controller

@audio.route("/audio/decoded", methods=["POST"])
def hanlde_audio_decoded():
    return get_audio_decoded() # Example of how to use the audio function from the controller



