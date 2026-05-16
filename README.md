# PhishScope AI 🛡️
**Advanced LLM-Powered Phishing URL Detection & Explainability Platform**

PhishScope AI is a research-grade cybersecurity tool that identifies phishing URLs using a hybrid approach combining Machine Learning, DNS/WHOIS intelligence, and LLM reasoning. Unlike binary classifiers, PhishScope provides **explainable evidence** for every risk assessment.

## 🚀 Key Features
- **Hybrid ML Model**: Trained on 800k+ URLs using Random Forest.
- **DNS Intelligence**: Real-time analysis of domain age, TTL, nameservers, and MX records.
- **Linguistic NLP**: URL entropy, subdomain depth, and suspicious keyword detection.
- **LLM Reasoning**: AI-powered cybersecurity analyst persona that explains *why* a URL is suspicious.
- **Premium Dashboard**: Dark-themed, glassmorphic UI with Recharts visualizations.

## 🛠️ Tech Stack
- **Backend**: FastAPI, Scikit-Learn, dnspython, whois, joblib.
- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Recharts.
- **AI**: OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet.
- **Dataset**: `ealvaradob/phishing-dataset` (Hugging Face).

## 🏃 Quick Start

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create `.env` (use `.env.example` as template) and add your OpenAI/Anthropic API Key.
4. Train the model: `python scripts/train_model.py`
5. Start server: `python app/main.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📊 Research Goals
This project is designed for:
- Evaluating the effectiveness of hybrid detection pipelines.
- Studying XAI (Explainable AI) in cybersecurity.
- Benchmarking LLM reasoning vs. statistical ML models.

## 📄 License
MIT License.
