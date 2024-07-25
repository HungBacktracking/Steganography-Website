import io
import base64
from flask import jsonify, request
from models.video_model import VideoSteganography
from moviepy.editor import VideoFileClip


def _detect_prefix(data):
    index_of_comma = data.find(',')
    if index_of_comma != -1:
        prefix = data[:index_of_comma + 1]
        new_data = data[index_of_comma + 1:]
    else:
        prefix = ""
        new_data = data

    return prefix, new_data

def get_video_encoded():
    print("---------------- Try encode video")

    try:
        video_base64 = request.json['video']
        message = request.json['message']
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    prefix, new_video_base64 = _detect_prefix(video_base64)

    try:
        video_data = base64.b64decode(new_video_base64)
        
        frames, audio_data, fps = VideoSteganography.split_video(video_data)
        modified_frames = VideoSteganography.hide_data_in_frames(frames, message)
        combined_video = VideoSteganography.combine_frames_audio(modified_frames, audio_data, fps)

        encoded_video = prefix + base64.b64encode(combined_video).decode()

        return jsonify({'video': encoded_video})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500

def get_video_decoded():
    print("---------------- Try decode video")

    try:
        video_base64 = request.json['video']
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    prefix, new_video_base64 = _detect_prefix(video_base64)

    try:
        video_data = base64.b64decode(new_video_base64)
        
        frames, _, _ = VideoSteganography.split_video(video_data)
        message = VideoSteganography.recover_data_from_frames(frames)

        return jsonify({'message': message})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500