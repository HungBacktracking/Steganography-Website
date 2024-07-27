import pytest
import requests
import base64
from Crypto.Cipher import AES
from io import BytesIO
import wave

BASE_URL = 'http://127.0.0.1:5001/audio'

# Utility function to encrypt text with AES
def encrypt_aes(plaintext, key):
    cipher = AES.new(key, AES.MODE_EAX)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode('utf-8'))
    return base64.b64encode(nonce + ciphertext).decode('utf-8')

# Utility function to decrypt text with AES
def decrypt_aes(encrypted_base64, key):
    encrypted_data = base64.b64decode(encrypted_base64)
    nonce = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
    plaintext = cipher.decrypt(ciphertext)
    return plaintext.decode('utf-8')

def test_audio_encode():
    # Load and encode an audio file in base64
    with open('origin_audio.wav', 'rb') as audio_file:
        audio_base64 = base64.b64encode(audio_file.read()).decode()

    # Encrypt a text message with AES
    key = 'mysecretpassword'  # Key should be 16, 24, or 32 bytes long
    text = 'Hello, World!'
    text_encrypted_base64 = encrypt_aes(text, key.encode('utf-8'))
    
    # Send a POST request to the API
    response = requests.post(f'{BASE_URL}/encoded', json={
        'audio': audio_base64,
        'message': text_encrypted_base64  # Ensure the key matches the server expectation
    })

    assert response.status_code == 200

    # Decode the response audio
    response_data = response.json()
    encoded_audio_base64 = response_data['audio']
    encoded_audio_data = base64.b64decode(encoded_audio_base64)
    
    # Save and open the returned audio
    with open('encoded_audio.wav', 'wb') as audio_file:
        audio_file.write(encoded_audio_data)

    # Optionally, you can add more checks to validate the output audio
    with wave.open('encoded_audio.wav', 'rb') as audio_file:
        assert audio_file.getnchannels() > 0  # Just a basic check to see if the file is valid

def test_audio_decode():
    # Load and encode the previously saved audio file in base64
    with open('encoded_audio.wav', 'rb') as audio_file:
        audio_base64 = base64.b64encode(audio_file.read()).decode()

    # Send a POST request to the API
    response = requests.post(f'{BASE_URL}/decoded', json={
        'audio': audio_base64
    })

    assert response.status_code == 200

    # Decode the response message
    response_data = response.json()
    decoded_message_encrypted_base64 = response_data['message']
    
    # Decrypt the message
    key = 'mysecretpassword'  # Same key used for encryption
    decrypted_message = decrypt_aes(decoded_message_encrypted_base64, key.encode('utf-8'))

    assert decrypted_message == 'Hello, World!'

if __name__ == '__main__':
    test_audio_encode()
