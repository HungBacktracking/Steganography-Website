from flask import jsonify
from models.video_model import Video


def get_video_encoded(data):
    # This is where the video encoding will be done by calling function from the model
    value = Video.encode(data) # Dummy implementation
    return jsonify({"message": "Video encoded successfully", "data": value})