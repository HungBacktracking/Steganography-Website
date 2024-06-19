from flask import jsonify, send_file, request
from models.image_model import ImageSteganography


def get_image_encoded():
    try:
        image_file = request.files['image']
        message = request.form['message']

        stego = ImageSteganography()
        modified_image = stego.hide_data(image_file, message)

        return send_file(modified_image, attachment_filename='stego_image.png', as_attachment=True, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)})
    
def get_image_decoded():
    try:
        image_file = request.files['image']

        stego = ImageSteganography()
        message = stego.recover_data(image_file)

        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)})