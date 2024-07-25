import cv2
import numpy as np
import wave
import struct
import io
from moviepy.editor import VideoFileClip, AudioFileClip

class VideoSteganography:
    def __init__(self):
        self.num_lsb = 8

    def hide_data(self, video_file, message):
        video = VideoFileClip(video_file)
        audio = video.audio

        # Convert video to frames
        frames = [frame for frame in video.iter_frames()]

        # Convert message to binary
        message += '\0'  # Null terminator
        binary_message = ''.join([format(ord(char), '08b') for char in message])
        
        # Encode message into frames
        frame_idx = 0
        bit_idx = 0

        while bit_idx < len(binary_message):
            frame = frames[frame_idx]
            for i in range(frame.shape[0]):
                for j in range(frame.shape[1]):
                    for k in range(frame.shape[2]):
                        if bit_idx < len(binary_message):
                            frame[i, j, k] = (frame[i, j, k] & ~1) | int(binary_message[bit_idx])
                            bit_idx += 1
            frames[frame_idx] = frame
            frame_idx += 1

        # Convert frames back to video
        height, width, layers = frames[0].shape
        output_video = io.BytesIO()
        out = cv2.VideoWriter(output_video, cv2.VideoWriter_fourcc(*'XVID'), video.fps, (width, height))

        for frame in frames:
            out.write(frame)

        out.release()

        # Combine video and audio
        output_video.seek(0)
        final_video = VideoFileClip(output_video)
        final_video = final_video.set_audio(audio)

        final_output = io.BytesIO()
        final_video.write_videofile(final_output, codec='libx264', audio_codec='aac')

        final_output.seek(0)
        return final_output

    def recover_data(self, video_file):
        video = VideoFileClip(video_file)
        frames = [frame for frame in video.iter_frames()]

        binary_message = ''
        for frame in frames:
            for i in range(frame.shape[0]):
                for j in range(frame.shape[1]):
                    for k in range(frame.shape[2]):
                        binary_message += str(frame[i, j, k] & 1)

        message = ''
        for i in range(0, len(binary_message), 8):
            byte = binary_message[i:i+8]
            char = chr(int(byte, 2))
            if char == '\0':
                break
            message += char

        return message
