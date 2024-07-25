import io
import os
import cv2
import numpy as np
from PIL import Image
from moviepy.editor import VideoFileClip, AudioFileClip
from models.image_model import ImageSteganography
from models.audio_model import AudioSteganography

class VideoSteganography:
    def __init__(self):
        self.image_stego = ImageSteganography()
        self.audio_stego = AudioSteganography()

    def hide_data(self, video_file, message):
        video = VideoFileClip(video_file)

        # Split video into frames and audio
        frames = list(video.iter_frames())
        audio = video.audio

        # Encode message into frames and audio
        encoded_frames = []
        for frame in frames:
            image_file = io.BytesIO()
            Image.fromarray(frame).save(image_file, format='PNG')
            encoded_frame = self.image_stego.hide_data(image_file, message)
            encoded_frames.append(cv2.cvtColor(np.array(encoded_frame), cv2.COLOR_RGB2BGR))

        audio_file = io.BytesIO()
        audio.write_audiofile(audio_file)
        encoded_audio = self.audio_stego.hide_data(audio_file, message)

        # Combine encoded frames and audio into video
        temp_dir = "temp_video_frames"
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        for i, frame in enumerate(encoded_frames):
            cv2.imwrite(os.path.join(temp_dir, f"frame_{i:05d}.png"), frame)

        combined_video_path = "temp_combined_video.mp4"
        os.system(f"ffmpeg -framerate {video.fps} -i {temp_dir}/frame_%05d.png -i {encoded_audio.name} -codec copy {combined_video_path}")

        with open(combined_video_path, "rb") as f:
            combined_video = io.BytesIO(f.read())

        # Clean up temporary files
        for file in os.listdir(temp_dir):
            os.remove(os.path.join(temp_dir, file))
        os.rmdir(temp_dir)
        os.remove(encoded_audio.name)
        os.remove(combined_video_path)

        combined_video.seek(0)
        return combined_video

    def recover_data(self, video_file):
        video = VideoFileClip(video_file)

        # Split video into frames and audio
        frames = list(video.iter_frames())
        audio = video.audio

        # Decode message from frames and audio
        decoded_message = ""
        for frame in frames:
            image_file = io.BytesIO()
            Image.fromarray(frame).save(image_file, format='PNG')
            decoded_message += self.image_stego.recover_data(image_file)

        audio_file = io.BytesIO()
        audio.write_audiofile(audio_file)
        decoded_message += self.audio_stego.recover_data(audio_file)

        return decoded_message
