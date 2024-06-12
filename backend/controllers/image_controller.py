from flask import jsonify


def get_image_encoded(data):
    # This is where the image encoding will be done by calling function from the model
    value = 1
    return jsonify({"message": "Image encoded successfully", "data": value})