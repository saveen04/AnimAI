# 🐾 Animal Species Detector AI

> Full-Stack AI Powered Animal Detection Web Application built using **Next.js, MongoDB, TensorFlow, and FastAPI** 🚀

Detect animal species from uploaded images or live camera feed using a trained **Convolutional Neural Network (CNN)** model with secure authentication and history tracking.

---

# ✨ Features

## 🔐 Authentication System

* User Signup & Login
* Secure JWT Authentication
* Password Hashing with bcrypt
* Protected Routes using Middleware
* Logout Functionality

---

## 🤖 AI Animal Detection

* Upload animal images for prediction
* Live webcam detection support
* CNN-based TensorFlow model
* FastAPI AI inference server
* Confidence score prediction

---

## 📸 Detection Options

* 🖼️ Image Upload Detection
* 🎥 Live Camera Detection
* 📜 Detection History Tracking

---

## 🧠 AI Model Workflow

* TensorFlow/Keras CNN model
* Trained using Cats vs Dogs dataset
* Supports custom datasets
* FastAPI integration for predictions

---

# 🛠️ Tech Stack

| 🚀 Layer       | 💻 Technology                   |
| -------------- | ------------------------------- |
| Frontend       | Next.js 14, React, Tailwind CSS |
| Backend        | Next.js API Routes              |
| Authentication | JWT, bcryptjs, Cookies          |
| Database       | MongoDB                         |
| AI/ML          | TensorFlow, Keras, FastAPI      |
| Dataset        | TensorFlow Datasets             |

---

# ⚙️ Prerequisites

Before running the project install:

* ✅ Node.js 18+
* ✅ Python 3.10+
* ✅ MongoDB
* ✅ npm / pip
* ✅ Optional GPU for faster training

---

# 🚀 Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/animal-ai-detector.git

cd animal-ai-detector
```

---

## 2️⃣ Setup Environment Variables

```bash
cp .env.example .env
```

Update `.env` file:

```env
MONGODB_URI=your_mongodb_uri
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_secret_key
```

---

## 3️⃣ Install Frontend Dependencies

```bash
npm install
```

---

## 4️⃣ Start Next.js Application

```bash
npm run dev
```

🌐 Frontend runs on:

```bash
http://localhost:3000
```

---

# 🤖 AI Model Setup

## 1️⃣ Navigate to AI Folder

```bash
cd ai-model
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### macOS/Linux

```bash
python -m venv venv

source venv/bin/activate
```

---

## 3️⃣ Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Download Dataset

```bash
python download_dataset.py
```

📦 Downloads Cats vs Dogs dataset (~800MB)

---

## 5️⃣ Train CNN Model

```bash
python train_model.py
```

Generated files:

* ✅ `animal_model.h5`
* ✅ `class_names.txt`

---

## 6️⃣ Start FastAPI Server

```bash
python main.py
```

🌐 AI Service runs on:

```bash
http://localhost:8000
```

---

# 🧪 API Endpoints

## 🔐 Authentication APIs

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register User |
| POST   | `/api/auth/login`  | Login User    |
| POST   | `/api/auth/logout` | Logout User   |
| GET    | `/api/auth/me`     | Current User  |

---

## 🤖 Detection APIs

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| POST   | `/api/detect` | Detect Animal Species |

---

## 📜 History APIs

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| GET    | `/api/history` | User Detection History |

---

# 🗄️ MongoDB Collections

## 👤 Users Collection

```js
{
  email,
  password,
  name,
  createdAt
}
```

---

## 🐾 Detections Collection

```js
{
  userId,
  label,
  confidence,
  description,
  imageBase64,
  createdAt
}
```

---

# 🎯 Main Functionalities

✅ Secure Authentication
✅ AI Image Detection
✅ Webcam Integration
✅ Detection History
✅ MongoDB Storage
✅ CNN Model Training
✅ FastAPI AI Service
✅ Protected Routes

---

# 📂 Important Commands

## Frontend

```bash
npm run dev
```

---

## AI Commands

### Download Dataset

```bash
python ai-model/download_dataset.py
```

### Train Model

```bash
python ai-model/train_model.py
```

### Start FastAPI

```bash
python ai-model/main.py
```

### CLI Prediction

```bash
python ai-model/predict.py image.jpg
```

---

# 🌟 Future Enhancements

* 🐅 Multiple animal species support
* ☁️ Cloud deployment
* 📱 Mobile responsive optimization
* 🎯 Higher accuracy models
* 📊 Analytics Dashboard
* 🔍 Object detection integration

---

# 📜 License

📄 MIT License

---

# ❤️ Developed With

* ⚛️ Next.js
* 🐍 Python
* 🧠 TensorFlow
* 🍃 MongoDB
* 🚀 FastAPI
