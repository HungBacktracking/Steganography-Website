import wave
import struct
import io

class AudioSteganography:
    def __init__(self):
        self.num_lsb = 8

    def prepare(self, sound_path):
        self.sound = wave.open(sound_path, "r")
        self.params = self.sound.getparams()
        self.num_channels = self.sound.getnchannels()
        self.sample_width = self.sound.getsampwidth()
        self.n_frames = self.sound.getnframes()
        self.n_samples = self.n_frames * self.num_channels

        if self.sample_width == 1:
            self.fmt = "{}B".format(self.n_samples)
            self.mask = (1 << 8) - (1 << self.num_lsb)
            self.smallest_byte = -(1 << 8)
        elif self.sample_width == 2:
            self.fmt = "{}h".format(self.n_samples)
            self.mask = (1 << 15) - (1 << self.num_lsb)
            self.smallest_byte = -(1 << 15)
        else:
            raise ValueError("File has an unsupported bit-depth")

    def hide_data(self, sound_path, message):
        self.prepare(sound_path)
        max_bytes_to_hide = (self.n_samples * self.num_lsb) // 8
        if len(message) > max_bytes_to_hide:
            raise ValueError("Message too large to hide in audio file")
        
        raw_data = list(struct.unpack(self.fmt, self.sound.readframes(self.n_frames)))
        self.sound.close()

        input_data = memoryview(message.encode('utf-8'))

        data_index = 0
        sound_index = 0
        values = []
        buffer = 0
        buffer_length = 0
        done = False

        while not done:
            while buffer_length < self.num_lsb and data_index // 8 < len(input_data):
                buffer += (input_data[data_index // 8] >> (data_index % 8)) << buffer_length
                bits_added = 8 - (data_index % 8)
                buffer_length += bits_added
                data_index += bits_added

            current_data = buffer % (1 << self.num_lsb)
            buffer >>= self.num_lsb
            buffer_length -= self.num_lsb

            while sound_index < len(raw_data) and raw_data[sound_index] == self.smallest_byte:
                values.append(struct.pack(self.fmt[-1], raw_data[sound_index]))
                sound_index += 1

            if sound_index < len(raw_data):
                current_sample = raw_data[sound_index]
                sound_index += 1

                sign = 1
                if current_sample < 0:
                    current_sample = -current_sample
                    sign = -1

                altered_sample = sign * ((current_sample & self.mask) | current_data)
                values.append(struct.pack(self.fmt[-1], altered_sample))

            if data_index // 8 >= len(input_data) and buffer_length <= 0:
                done = True

        while sound_index < len(raw_data):
            values.append(struct.pack(self.fmt[-1], raw_data[sound_index]))
            sound_index += 1

        output_sound = io.BytesIO()
        sound_steg = wave.open(output_sound, "w")
        sound_steg.setparams(self.params)
        sound_steg.writeframes(b"".join(values))
        sound_steg.close()
        output_sound.seek(0)

        return output_sound