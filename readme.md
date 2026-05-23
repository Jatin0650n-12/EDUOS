# EduOS — AI Personal Education Operating System

> An AI-powered personalized learning platform that helps students assess their skills, identify career gaps, and follow a structured learning roadmap tailored to their goals.

---

## 🚀 Features

- 📄 **Resume-Based Skill Extraction** — Upload PDF/DOCX resume and auto-extract technical skills
- 🤖 **AI Skill Recommendations** — Semantic skill suggestions using sentence-transformers + cosine similarity
- 🎯 **Career Role Prediction** — Predicts best-fit job role using Random Forest classifier
- 📝 **Role-Specific Quiz** — 10-question assessment with accuracy and response time tracking
- 🗺️ **AI Learning Roadmap** — 8-week personalized roadmap generated via Groq LLaMA 3.1
- 📊 **Skill Gap Analysis** — Compares your skills against target role requirements
- 📈 **Career Growth Forecasting** — Estimates readiness score and months to job-ready
- 💬 **AI Learning Copilot** — Real-time conversational AI tutor powered by Groq
- 🔐 **JWT Authentication** — Secure login with auto session expiry

---

## 🏗️ Project Structure

```
EDUOS/
├── EduOS/                  # Angular 18 Frontend
├── backend_eduos_copy/     # Node.js + Express Backend
└── ML_EDUOS_COP/           # Python Flask ML Service
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular 18, TypeScript, HTML, CSS |
| Backend | Node.js, Express.js, JWT, Bcrypt.js, Multer |
| Database | MongoDB Atlas, GridFS |
| ML Service | Python, Flask, Sentence-Transformers, Scikit-learn, NumPy, Pandas |
| AI | Groq API (LLaMA 3.1 8B) |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- Python 3.12+
- MongoDB Atlas account
- Groq API key

---

### 1. Clone the repository

```bash
git clone https://github.com/Jatin0650n-12/EDUOS.git
cd EDUOS
```

---

### 2. Backend Setup (Node.js)

```bash
cd backend_eduos_copy
npm install
```

Create a `.env` file:

```env
PORT=5010
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

Start the server:

```bash
node app.js
```

Backend runs on **http://localhost:5010**

---

### 3. ML Service Setup (Python)

```bash
cd ML_EDUOS_COP
pip install flask flask-cors sentence-transformers scikit-learn numpy pandas joblib
```

Train the career prediction model:

```bash
python create_dataset.py
python train_model.py
```

Start the ML service:

```bash
python app.py
```

ML service runs on **http://localhost:5001**

---

### 4. Frontend Setup (Angular)

```bash
cd EduOS
npm install
ng serve
```

Frontend runs on **http://localhost:4200**

---

## 🖥️ Running the Full Application

Open **three terminals** and run each service simultaneously:

| Terminal | Command | Port |
|---|---|---|
| 1 — ML Service | `cd ML_EDUOS_COP && python app.py` | 5001 |
| 2 — Backend | `cd backend_eduos_copy && node app.js` | 5010 |
| 3 — Frontend | `cd EduOS && ng serve` | 4200 |

Then open **http://localhost:4200** in your browser.

---

## 📡 API Endpoints

### Node.js Backend (Port 5010)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/files/upload` | Upload resume file |
| GET | `/api/files/getfiles` | List uploaded files |
| GET | `/api/extract/:id` | Extract skills from resume |
| GET | `/quiz/:role` | Fetch quiz questions by role |
| POST | `/quiz/submit` | Submit quiz answers |
| POST | `/roadmap/generate` | Generate AI learning roadmap |
| POST | `/copilot/ask` | Ask AI learning copilot |

### Python ML Service (Port 5001)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/recommend-skills` | Semantic skill recommendations |
| POST | `/predict-career` | Predict career role from skills |
| POST | `/api/skills/gap` | Skill gap analysis |
| POST | `/forecast-growth` | Career growth forecasting |
| POST | `/recommend` | Collaborative filtering resources |

---

## 👤 Author

**Jatin Kumar**
Roll No: 23001003051
B.Tech Computer Engineering — 6th Semester
J.C. Bose University of Science & Technology, YMCA, Faridabad

**Supervisor:** Dr. Parul Gupta

---

## 📄 License

This project is developed as a Capstone Project for academic purposes at J.C. Bose University of Science & Technology, YMCA, Faridabad — Jan to June 2026.