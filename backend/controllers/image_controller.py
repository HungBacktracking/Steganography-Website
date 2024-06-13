from flask import jsonify
from models.image_model import Image


def get_image_encoded(data):
    # This is where the image encoding will be done by calling function from the model
    value = Image.encode(data) # Dummy implementation
    return jsonify({"message": "Image encoded successfully", "data": value})