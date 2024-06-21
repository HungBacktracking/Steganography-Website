from flask import Blueprint, request
from controllers.image_controller import get_encoded_image, get_decoded_image

image = Blueprint("image", __name__)

@image.route("/image/encoded", methods=["POST"])
def encode_image():
    # print("request in Route")
    # print(request)
    return get_encoded_image(request.json)

@image.route("/image/decoded", methods=["POST"])
def decode_image():
    return get_decoded_image(request.json)
