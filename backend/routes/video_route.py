from flask import Blueprint, request
from controllers.video_controller import get_video_encoded, get_video_decoded

video = Blueprint("video", __name__)


@video.route("/video/encoded", methods=["POST"])
def get_video_encoded():
    return get_video_encoded(request.json) # Example of how to use the video function from the controller

@video.route("/video/decoded", methods=["POST"])
def get_video_decoded():
    return get_video_decoded(request.json) # Example of how to use the video function from the controller



