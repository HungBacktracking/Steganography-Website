from flask import Blueprint, request
from controllers.video_controller import get_video_encoded, get_video_decoded

video = Blueprint("video", __name__)


@video.route("/video/encoded", methods=["POST"])
def encode_video():
    return get_video_encoded()

@video.route("/video/decoded", methods=["POST"])
def decode_video():
    return get_video_decoded()



