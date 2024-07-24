from flask import Flask, jsonify, request
from flask_cors import CORS

from routes.image_route import image
from routes.video_route import video
from routes.audio_route import audio

app = Flask(__name__)
CORS(app)

app.register_blueprint(image)
app.register_blueprint(video)
app.register_blueprint(audio)


@app.route("/")
@app.route("/index")
def index():
    return jsonify({"message": "Hello World!"}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5001)
