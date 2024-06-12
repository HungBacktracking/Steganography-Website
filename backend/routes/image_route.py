from flask import Blueprint, request
from controllers.image_controller import get_image_encoded

image = Blueprint("image", __name__)


@image.route("/image/encoded", methods=["POST"])
def get_image_encoded():
    return get_image_encoded(request.json) # Example of how to use the Image function from the controller



