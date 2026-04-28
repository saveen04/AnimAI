# Animal Species Detector

Full-stack AI web application that detects animal species from images using a Convolutional Neural Network (CNN). Built with Next.js, MongoDB, TensorFlow, and FastAPI. Includes **login/signup authentication** and a **trained model** workflow.

## Project Structure

```
animal-ai-detector/
├── app/
│   ├── api/
│   │   ├── auth/           # signup, login, logout, me
│   │   ├── detect/         # image detection (protected)
│   │   └── history/       # detection history (protected)
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── detection/         # Animal detection hub (protected)
│   ├── upload/            # Upload image (protected)
│   ├── camera/            # Live camera (protected)
│   ├── history/           # Detection history (protected)
│   ├── about/             # About AI model
│   └── page.js            # Home
├── components/
│   ├── AuthProvider.js
│   ├── Navbar.js
│   └── ResultCard.js
├── lib/
│   ├── auth.js            # JWT, bcrypt, cookies
│   ├── db.js
│   └── constants.js
├── scripts/
│   └── seed-user.js       # Create default users
├── ai-model/
│   ├── download_dataset.py # Download cats_vs_dogs
│   ├── train_model.py     # CNN training
│   ├── predict.py
│   ├── main.py            # FastAPI
│   └── dataset/           # train/val with cat, dog
├── middleware.js          # Protect routes
└── database/SCHEMA.md
```

---

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)
- (Optional) GPU for faster CNN training

---

## Quick Start

### 1. Environment

```bash
cd animal-ai-detector
cp .env.example .env
# Edit .env: MONGODB_URI, AI_SERVICE_URL, JWT_SECRET (optional)
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

Ensure MongoDB is running (e.g. `mongod` or MongoDB Atlas). Set `MONGODB_URI` in `.env`.

### 4. Next.js App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then create a new account at `/signup` and log in at `/login`.

### 5. AI Model (FastAPI)

```bash
cd ai-model
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python download_dataset.py   # Downloads cats_vs_dogs (~800MB)
python train_model.py        # Trains CNN (cat vs dog)
python main.py               # Starts FastAPI on :8000
```

AI service: [http://localhost:8000](http://localhost:8000).

---

## Train the Model (Full Pipeline)

1. **Download dataset** (cats vs dogs from TensorFlow Datasets):

   ```bash
   cd ai-model
   pip install -r requirements.txt
   python download_dataset.py
   ```

2. **Train**:

   ```bash
   python train_model.py
   ```

   Saves `animal_model.h5` and `class_names.txt`. Restart `python main.py` to load the new model.

3. **Use your own dataset** (optional):

   - Put images in `ai-model/dataset/train/<class>/` and `ai-model/dataset/val/<class>/`
   - Run `python train_model.py`

---

## Features

- **Authentication:** Signup, Login, Logout. Protected routes for detection and history.
- **Upload Image:** Upload an image; AI detects species (cat/dog with trained model).
- **Live Camera:** Webcam capture and detection.
- **Results:** Animal name, confidence score, description.
- **Detection History:** Per-user history stored in MongoDB.

---

## API Integration

- **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Detect:** `POST /api/detect` (multipart image) → forwards to FastAPI `/predict`
- **History:** `GET /api/history` (returns detections for logged-in user)

---

## MongoDB Schema

- **users:** `email`, `password` (hashed), `name`, `createdAt`
- **detections:** `userId`, `label`, `confidence`, `description`, `imageBase64`, `createdAt`

See [database/SCHEMA.md](database/SCHEMA.md).

---

## Tech Stack

| Layer   | Technology |
|--------|------------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Auth | JWT (jose), bcryptjs, httpOnly cookies |
| Backend | Next.js API Routes |
| Database | MongoDB |
| AI | TensorFlow/Keras CNN, FastAPI, tensorflow-datasets |

---

## Scripts

- `npm run dev` – Next.js dev server
- `python ai-model/download_dataset.py` – Download cats_vs_dogs
- `python ai-model/train_model.py` – Train CNN
- `python ai-model/main.py` – Start FastAPI
- `python ai-model/predict.py <image>` – CLI prediction

---

## License

MIT.
