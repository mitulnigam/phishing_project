import joblib
import os
import pandas as pd
from app.core.config import settings
from app.services.feature_extractor import feature_extractor
from typing import Dict, Any

class MLService:
    def __init__(self):
        self.model = None
        self.model_path = settings.MODEL_PATH
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print(f"Model loaded from {self.model_path}")
            except Exception as e:
                print(f"Failed to load model: {e}")
        else:
            print(f"Model file not found at {self.model_path}. Please run training script.")

    def predict(self, url: str) -> Dict[str, Any]:
        features = feature_extractor.extract_all(url)
        
        # Convert features to DataFrame for prediction
        df = pd.DataFrame([features])
        
        if self.model:
            # Predict probability
            # Note: The model should be trained on the same feature set
            try:
                prob = self.model.predict_proba(df)[0][1] # Probability of being phishing
                prediction = int(self.model.predict(df)[0])
            except Exception as e:
                print(f"Prediction error: {e}")
                prob = 0.5
                prediction = 0
        else:
            # Baseline/Heuristic fallback if model is not loaded
            # Use a simple heuristic based on features
            score = 0
            if features['url_length'] > 75: score += 0.2
            if features['keyword_count'] > 0: score += 0.3
            if features['has_ip'] == 1: score += 0.4
            if features['domain_age_days'] < 30 and features['domain_age_days'] > 0: score += 0.3
            if features['is_https'] == 0: score += 0.2
            
            prob = min(0.99, score)
            prediction = 1 if prob > 0.5 else 0

        return {
            "probability": float(prob),
            "prediction": prediction,
            "features": features,
            "risk_level": "High" if prob > 0.7 else "Medium" if prob > 0.3 else "Low"
        }

ml_service = MLService()
