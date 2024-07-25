import traceback
from moviepy.video.io.ffmpeg_writer import ffmpeg_write_video
import io
import math
import cv2
import numpy as np
from PIL import Image
from moviepy.editor import VideoFileClip
import tempfile
import os

class VideoSteganography:

    @staticmethod
    def split_video(video_data):
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video_file:
                temp_video_file.write(video_data)
                temp_video_file.flush()
                video = VideoFileClip(temp_video_file.name)

            frames = [frame for frame in video.iter_frames()]
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio_file:
                video.audio.write_audiofile(temp_audio_file.name)
                with open(temp_audio_file.name, 'rb') as audio_file:
                    audio_data = audio_file.read()
            
            return frames, audio_data, video.fps
        except Exception as e:
            print("An error occurred in split_video:")
            traceback.print_exc()

    @staticmethod
    def combine_frames_audio(frames, audio_data, fps):
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio_file:
                temp_audio_file.write(audio_data)
                temp_audio_file.flush()
                
                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video_file:
                    video_buffer = io.BytesIO()
                    ffmpeg_write_video(temp_video_file.name, frames, fps, codec='libx264')
                    
                    # Combine video and audio
                    combined_path = temp_video_file.name.replace(".mp4", "_combined.mp4")
                    os.system(f"ffmpeg -i {temp_video_file.name} -i {temp_audio_file.name} -c:v copy -c:a aac {combined_path}")
                    
                    with open(combined_path, "rb") as combined_file:
                        video_buffer.write(combined_file.read())
                    
                    return video_buffer.getvalue()
        except Exception as e:
            print("An error occurred in combine_frames_audio:")
            traceback.print_exc()

    @staticmethod
    def hide_data_in_frames(frames, data):
        try:
            total_frames = len(frames)
            datapoints = math.ceil(len(data) / total_frames)
            modified_frames = []

            for i, frame in enumerate(frames):
                if i * datapoints >= len(data):
                    modified_frames.append(frame)
                    continue

                img = Image.fromarray(frame)
                encodetext = data[i * datapoints:(i + 1) * datapoints]
                newimage = img.copy()
                VideoSteganography._encoder(newimage, encodetext)
                modified_frames.append(np.array(newimage))

            return modified_frames
        except Exception as e:
            print("An error occurred in hide_data_in_frames:")
            traceback.print_exc()

    @staticmethod
    def _encoder(newimage, data):
        try:
            w, h = newimage.size
            pixels = np.array(newimage)
            
            datalist = [format(ord(i), '08b') for i in data]
            datalist = ''.join(datalist)
            data_len = len(datalist)
            
            pixel_iter = pixels.flatten()
            
            for i in range(data_len):
                pixel_iter[i] = (pixel_iter[i] & ~1) | int(datalist[i])
            
            pixels = pixel_iter.reshape((h, w, 3))
            newimage.paste(Image.fromarray(pixels))
        except Exception as e:
            print("An error occurred in _encoder:")
            traceback.print_exc()

    @staticmethod
    def recover_data_from_frames(frames):
        try:
            data_bits = []
            
            for frame in frames:
                img = Image.fromarray(frame)
                pixels = np.array(img).flatten()
                for pixel in pixels:
                    data_bits.append(pixel & 1)
            
            data_bits = ''.join(map(str, data_bits))
            data_chars = [chr(int(data_bits[i:i+8], 2)) for i in range(0, len(data_bits), 8)]
            data_str = ''.join(data_chars)
            
            return data_str.rstrip('\x00')
        except Exception as e:
            print("An error occurred in recover_data_from_frames:")
            traceback.print_exc()
