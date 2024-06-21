import pytest
import requests
import base64
from Crypto.Cipher import AES
from io import BytesIO
from PIL import Image
import os

BASE_URL = 'http://127.0.0.1:5000/image'

# Utility function to encrypt text with AES
def encrypt_aes(plaintext, key):
    cipher = AES.new(key, AES.MODE_EAX)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode('utf-8'))
    return base64.b64encode(nonce + ciphertext).decode('utf-8')

def test_encode():
    # Load and encode an image in base64
    with open('origin_image.png', 'rb') as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode()

    # Encrypt a text message with AES
    key = 'mysecretpassword'  # Key should be 16, 24, or 32 bytes long
    text = 'Hello, World!'
    text_encrypted_base64 = encrypt_aes(text, key.encode('utf-8'))
    
    # Send a POST request to the API
    response = requests.post(f'{BASE_URL}/encoded', json={
        'image': image_base64,
        'text': text_encrypted_base64,
        'key': key
    })

    assert response.status_code == 200

    # Save and open the returned image
    output_image = Image.open(BytesIO(response.content))
    output_image.save('encoded_image.png')

    # Optionally, you can add more checks to validate the output image
    assert output_image.format == 'PNG'

if __name__ == '__main__':
    pytest.main()
