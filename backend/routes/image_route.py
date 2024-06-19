from flask import Blueprint, request
from controllers.image_controller import get_image_encoded, get_image_decoded

image = Blueprint("image", __name__)


@image.route("/image/encoded", methods=["POST"])
def get_image_encoded():
    return get_image_encoded(request.json) # Example of how to use the audio function from the controller

@image.route("/image/decoded", methods=["POST"])
def get_audio_decoded():
    return get_audio_decoded(request.json) # Example of how to use the audio function from the controller



