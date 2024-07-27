from moviepy.editor import *
from io import BytesIO
from models.audio_model import AudioSteganography
import os
import tempfile
import io
import magic

class VideoSteganography:
    def __init__(self):
        self.num_lsb = 8
    
    # Function to split video into audio and video without audio
    @staticmethod
    def split_video(video_path):
        # Load the video
        video = VideoFileClip(video_path)

        # Extract the audio
        audio = video.audio

        # Create temporary files to hold the audio and video without audio
        audio_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        video_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")

        try:
            # Write audio to temporary file
            audio.write_audiofile(audio_temp_file.name, codec='pcm_s16le')

            # Write video (without audio) to temporary file
            video_without_audio = video.without_audio()
            video_without_audio.write_videofile(video_temp_file.name, codec='libx264', audio=False)

            # Read the audio and video files back into BytesIO objects
            with open(audio_temp_file.name, 'rb') as f:
                audio_bytes_io = io.BytesIO(f.read())
            with open(video_temp_file.name, 'rb') as f:
                video_bytes_io = io.BytesIO(f.read())
            
        finally:
            # Clean up temporary files
            i = 1
            # os.remove(audio_temp_file.name)
            # os.remove(video_temp_file.name)

        return audio_bytes_io, video_bytes_io
    
    # Function to combine audio and video
    @staticmethod
    def combine_audio_video(audio_io, video_io):
        # Write the BytesIO objects to temporary files
        audio_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        video_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")

        try:
            with open(audio_temp_file.name, 'wb') as f:
                f.write(audio_io.read())
            with open(video_temp_file.name, 'wb') as f:
                f.write(video_io.read())

            # Load the audio and video files
            audio_clip = AudioFileClip(audio_temp_file.name)
            video_clip = VideoFileClip(video_temp_file.name)

            # Set the audio of the video clip
            final_clip = video_clip.set_audio(audio_clip)

            # Create a BytesIO object to hold the final video
            final_video_io = BytesIO()
            final_video_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")

            final_clip.write_videofile(final_video_temp_file.name, codec='libx264', audio_codec='aac')

            with open(final_video_temp_file.name, 'rb') as f:
                final_video_io.write(f.read())

            final_video_io.seek(0)
            
        finally:
            i = 1
            # Clean up temporary files
            # os.remove(audio_temp_file.name)
            # os.remove(video_temp_file.name)
            # os.remove(final_video_temp_file.name)

        return final_video_io

    def hide_data(self, video_data, message):
        print("Hiding message:", message)

        # Detect MIME type
        mime = magic.from_buffer(video_data, mime=True)
        if mime == "video/mp4":
            file_extension = ".mp4"
        elif mime == "video/x-matroska":
            file_extension = ".mkv"
        elif mime == "video/webm":
            file_extension = ".webm"
        elif mime == "image/gif":
            file_extension = ".gif"
        else:
            raise ValueError("Unsupported video format")

        # Save the video data to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_video_file:
            temp_video_file.write(video_data)
            temp_video_file.flush()
            temp_video_path = temp_video_file.name

        audio_io, video_io = VideoSteganography.split_video(temp_video_path)

        audio_stego = AudioSteganography()
        modified_audio = audio_stego.hide_data(audio_io, message)

        return self.combine_audio_video(modified_audio, video_io)
    
    def recover_data(self, video_data):
        # Detect MIME type
        mime = magic.from_buffer(video_data, mime=True)
        if mime == "video/mp4":
            file_extension = ".mp4"
        elif mime == "video/x-matroska":
            file_extension = ".mkv"
        elif mime == "video/webm":
            file_extension = ".webm"
        elif mime == "image/gif":
            file_extension = ".gif"
        else:
            raise ValueError("Unsupported video format")

        # Save the video data to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_video_file:
            temp_video_file.write(video_data)
            temp_video_file.flush()
            temp_video_path = temp_video_file.name

        audio_io, video_io = VideoSteganography.split_video(temp_video_path)

        audio_stego = AudioSteganography()
        message = audio_stego.recover_data(audio_io)
        print("Hidden message:", message)
        
        return message
