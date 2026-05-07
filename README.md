# DigitAI — Handwritten Digit Recognition

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?style=for-the-badge&logo=tensorflow)
![Flask](https://img.shields.io/badge/Flask-3.x-black?style=for-the-badge&logo=flask)
![MNIST](https://img.shields.io/badge/Dataset-MNIST-yellow?style=for-the-badge)
![Accuracy](https://img.shields.io/badge/Accuracy-99%25-brightgreen?style=for-the-badge)

**AI-powered handwritten digit recognition using a CNN trained on the MNIST dataset.**  
Draw any digit (0–9) on the canvas and get an instant prediction with confidence scores.

</div>

---

## Preview

```
Draw → CNN Processes → Instant Prediction + Probability Breakdown
```

---

## Features

- ✍️ Interactive drawing canvas (mouse + touch support)
- 🧠 CNN model with 2 convolutional layers trained on 60,000 MNIST images
- ⚡ Real-time prediction in under 5ms
- 📊 Full probability breakdown for all 10 digits
- 🎨 Premium UI — glassmorphism, animations, fully responsive
- 💾 Loads pre-trained `model.h5` instantly (no retraining on startup)

---

## Project Structure

```
PPP/
├── app.py                  # Flask backend + prediction API
├── model.h5                # Pre-trained CNN model
├── mnist.ipynb             # Jupyter notebook (model training)
├── requirements.txt        # Python dependencies
├── .gitignore
├── templates/
│   └── index.html          # Frontend (Jinja2 template)
└── static/
    ├── style.css           # Premium stylesheet
    └── script.js           # Canvas, animations, API calls
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/PPP.git
cd PPP
```

### 2. Create and activate virtual environment

```bash
# Windows
python -m venv tf_env
tf_env\Scripts\activate

# macOS / Linux
python -m venv tf_env
source tf_env/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the app

```bash
python app.py
```

Open your browser at **http://127.0.0.1:5000**

---

## Model Architecture

| Layer | Type | Details |
|---|---|---|
| 1 | Conv2D | 32 filters, 3×3, ReLU |
| 2 | MaxPooling2D | 2×2 |
| 3 | Conv2D | 64 filters, 3×3, ReLU |
| 4 | MaxPooling2D | 2×2 |
| 5 | Flatten | — |
| 6 | Dense | 128 units, ReLU |
| 7 | Dropout | 0.3 |
| 8 | Dense (Output) | 10 units, Softmax |

- **Optimizer:** Adam
- **Loss:** Sparse Categorical Crossentropy
- **Epochs:** 5
- **Batch size:** 128
- **Test accuracy:** ~99.2%

---

## API

### `POST /predict`

**Request body:**
```json
{
  "image": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "digit": 7,
  "confidence": 98.43,
  "probabilities": [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.984, 0.008, 0.009]
}
```

---

## Requirements

```
flask
tensorflow
pillow
numpy
```

---

## Tech Stack

- **Backend:** Python, Flask, TensorFlow / Keras
- **Frontend:** HTML5 Canvas, CSS3, Vanilla JavaScript
- **Model:** CNN trained on MNIST (28×28 grayscale images)
- **Dataset:** [MNIST](http://yann.lecun.com/exdb/mnist/) — 60,000 training + 10,000 test images

---

## License

MIT License — free to use, modify, and distribute.

---

<div align="center">
Made with ❤️ by Hassan Dheriwala
</div>