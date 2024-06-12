from flask import jsonify


def get_video_encoded(data):
    # This is where the video encoding will be done
    value = 1
    return jsonify({"message": "Video encoded successfully", "data": value})