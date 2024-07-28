from io import BytesIO
import io
import tempfile
import ffmpeg
from moviepy.editor import VideoFileClip
import magic
from models.audio_model import AudioSteganography
import cv2

class VideoSteganography:
    def __init__(self):
        self.num_lsb = 8
    
    @staticmethod
    def split_video(video_path):
        video = VideoFileClip(video_path)
        audio = video.audio
        
        audio_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        video_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        
        try:
            # Trích xuất âm thanh từ video sử dụng ffmpeg
            ffmpeg.input(video_path).output(audio_temp_file.name, acodec='pcm_s16le', vcodec='copy').run(overwrite_output=True)
            
            # Loại bỏ âm thanh từ video gốc sử dụng ffmpeg
            ffmpeg.input(video_path).output(video_temp_file.name, an=None, vcodec='copy').run(overwrite_output=True)
            
            # Đọc tệp audio vào BytesIO
            with open(audio_temp_file.name, 'rb') as f:
                audio_bytes_io = BytesIO(f.read())
            
            # Đọc tệp video vào BytesIO
            with open(video_temp_file.name, 'rb') as f:
                video_bytes_io = BytesIO(f.read())
        finally:
            audio_temp_file.close()
            video_temp_file.close()
        
        return audio_bytes_io, video_bytes_io
    
    @staticmethod
    def get_video_fps(video_path):
        probe = ffmpeg.probe(video_path)
        video_streams = [stream for stream in probe['streams'] if stream['codec_type'] == 'video']
        if video_streams:
            fps = eval(video_streams[0]['r_frame_rate'])
            return fps
        return None
    
    @staticmethod
    def combine_audio_video(audio_io, video_io, original_video_path):
        audio_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        video_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        
        try:
            # Ghi tệp audio từ BytesIO
            with open(audio_temp_file.name, 'wb') as f:
                f.write(audio_io.read())
            
            # Kiểm tra định dạng của tệp audio
            audio_probe = ffmpeg.probe(audio_temp_file.name)
            if not any(stream['codec_type'] == 'audio' for stream in audio_probe['streams']):
                raise ValueError("Invalid audio data")
            
            # Ghi tệp video từ BytesIO
            with open(video_temp_file.name, 'wb') as f:
                f.write(video_io.read())
            
            # Lấy fps của video gốc
            fps = VideoSteganography.get_video_fps(original_video_path)
            # capture = cv2.VideoCapture(original_video_path) # Stores OG Video into a Capture Window
            # fps = capture.get(cv2.CAP_PROP_FPS) # Extracts FPS of OG Video
            for i in range(10):
                print("FPS: ", fps)
            
            final_video_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
            
            # Kết hợp audio và video sử dụng ffmpeg-python
            video_input = ffmpeg.input(video_temp_file.name, r=fps)
            audio_input = ffmpeg.input(audio_temp_file.name, r=fps)
            ffmpeg.output(video_input, audio_input, final_video_temp_file.name, vcodec='copy', acodec='aac', strict='very', audio_bitrate='320k', r=fps).run(overwrite_output=True)
            
            final_video_io = BytesIO()
            with open(final_video_temp_file.name, 'rb') as f:
                final_video_io.write(f.read())
            
            final_video_io.seek(0)
        except ffmpeg.Error as e:
            print("stdout:", str(e.stdout))
            print("stderr:", str(e.stderr))
            raise e
        finally:
            audio_temp_file.close()
            video_temp_file.close()
            final_video_temp_file.close()
        
        return final_video_io
    
    def hide_data(self, video_data, message):
        mime = magic.from_buffer(video_data, mime=True)
        file_extension = {
            "video/mp4": ".mp4",
            "video/x-matroska": ".mkv",
            "video/webm": ".webm",
            "image/gif": ".gif"
        }.get(mime, None)
        
        if not file_extension:
            raise ValueError("Unsupported video format")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_video_file:
            temp_video_file.write(video_data)
            temp_video_file.flush()
            temp_video_path = temp_video_file.name
        
        audio_io, video_io = VideoSteganography.split_video(temp_video_path)
        
        audio_stego = AudioSteganography()
        modified_audio = audio_stego.hide_data(audio_io, message)
        
        # Kiểm tra và chuyển đổi định dạng âm thanh nếu cần thiết
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
            with open(temp_audio_file.name, 'wb') as f:
                f.write(modified_audio.read())
            
            # Chuyển đổi về định dạng đúng nếu cần thiết
            corrected_audio_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
            ffmpeg.input(temp_audio_file.name).output(corrected_audio_temp_file.name, codec='pcm_s16le', vcodec='copy').run(overwrite_output=True)
            with open(corrected_audio_temp_file.name, 'rb') as f:
                corrected_audio_io = BytesIO(f.read())

        print("Testing: ", message)

        return self.combine_audio_video(corrected_audio_io, video_io, temp_video_path)
    
    def recover_data(self, video_data):
        mime = magic.from_buffer(video_data, mime=True)
        file_extension = {
            "video/mp4": ".mp4",
            "video/x-matroska": ".mkv",
            "video/webm": ".webm",
            "image/gif": ".gif"
        }.get(mime, None)
        
        if not file_extension:
            raise ValueError("Unsupported video format")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_video_file:
            temp_video_file.write(video_data)
            temp_video_file.flush()
            temp_video_path = temp_video_file.name
        
        audio_io, video_io = VideoSteganography.split_video(temp_video_path)
        
        audio_stego = AudioSteganography()
        message = audio_stego.recover_data(audio_io)
        
        print("Recovered message:", message)
        
        return message