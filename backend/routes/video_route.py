from flask import Blueprint, request
from controllers.video_controller import get_video_encoded

video = Blueprint("video", __name__)


@video.route("/video/encoded", methods=["POST"])
def get_video_encoded():
    return get_video_encoded(request.json) # Example of how to use the video function from the controller



