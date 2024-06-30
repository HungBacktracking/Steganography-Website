from flask import jsonify, send_file
from models.image_model import ImageSteganography
import base64
import io

def get_encoded_image(request):
    print("---------------- Try encode image")
    # print("request in controller")
    # print(request)
    try:
        print("Get data from request")
        image_base64 = request['image']
        message = request['message']

        try:
            # Decode the base64-encoded image
            print("Decode the base64-encoded image")
            image_data = base64.b64decode(image_base64)
            image_file = io.BytesIO(image_data)

            print("Call encode")
            stego = ImageSteganography()
            modified_image = stego.hide_data(image_file, message)

            # Save the image to a BytesIO object
            print("Save the image to a BytesIO object")
            image_io = io.BytesIO()
            modified_image.save(image_io, format='PNG')
            image_io.seek(0)

            # Encode the modified image back to base64
            print("Encode result image")
            encoded_image = base64.b64encode(image_io.getvalue()).decode()

            print("Return response")
            return jsonify({'image': encoded_image})
        except Exception as e:
            print("ERROR 500")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print("ERROR 400")
        return jsonify({'error': str(e)}), 400

def get_decoded_image(request):
    print("---------------- Try decode image")
    try:
        print("Get data from request json")
        image_base64 = request['image']

        # Decode the base64-encoded image
        print("Decode the base64-encoded image")
        image_data = base64.b64decode(image_base64)
        image_file = io.BytesIO(image_data)

        print("Call decode")
        stego = ImageSteganography()
        message = stego.recover_data(image_file)

        print("Return response")
        return jsonify({'message': message})
    except Exception as e:
        print("ERROR 400")
        return jsonify({'error': str(e)}), 400
