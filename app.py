from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image
import base64
import io
import os

app = Flask(__name__)

# =========================
# Load Model
# =========================
MODEL_PATH = "model.h5"

if os.path.exists(MODEL_PATH):
    print(f"Loading existing model from {MODEL_PATH}...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded!")
else:
    print("No model.h5 found — training from scratch...")
    (x_train, y_train), _ = tf.keras.datasets.mnist.load_data()
    x_train = x_train / 255.0
    x_train = x_train.reshape(-1, 28, 28, 1)

    model = tf.keras.models.Sequential([
        tf.keras.layers.Input(shape=(28, 28, 1)),
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(10, activation="softmax")
    ])
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    model.fit(x_train, y_train, epochs=5, batch_size=128, verbose=1)
    model.save(MODEL_PATH)
    print("Model trained and saved!")


# =========================
# Routes
# =========================
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['image']
    data = data.split(",")[1]
    image_bytes = base64.b64decode(data)

    image = Image.open(io.BytesIO(image_bytes)).convert('L')
    image = image.resize((28, 28))

    img_array = np.array(image)
    img_array = img_array / 255.0
    img_array = img_array.reshape(1, 28, 28, 1)

    prediction    = model.predict(img_array)
    digit         = int(np.argmax(prediction))
    confidence    = float(np.max(prediction) * 100)
    probabilities = prediction[0].tolist()

    return jsonify({
        "digit":         digit,
        "confidence":    round(confidence, 2),
        "probabilities": probabilities
    })


if __name__ == '__main__':
    app.run(debug=True)