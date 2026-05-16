import sys
import os
import pandas as pd
import numpy as np
from datasets import load_dataset
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Add app to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.feature_extractor import feature_extractor

def train():
    print("Loading dataset from Hugging Face...")
    try:
        # Try local fallback first for reliability in this demo
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        csv_path = os.path.join(base_dir, "datasets", "sample_urls.csv")
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            print("Loaded local sample dataset.")
        else:
            # Fallback to HF if local not found
            dataset = load_dataset("akashmishra/phishing_url_detection")
            df = pd.DataFrame(dataset['train'])
            if 'url' in df.columns:
                df = df.rename(columns={'url': 'text'})
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return

    print(f"Dataset loaded. Total rows: {len(df)}")
    
    # Take a subset for training (DNS lookups are slow, so we'll mostly use linguistic features for the bulk)
    # For a real research project, you'd want a larger pre-extracted dataset.
    subset_size = min(50, len(df)) 
    phishing = df[df['label'] == 1]
    benign = df[df['label'] == 0]
    
    if len(phishing) > subset_size // 2: phishing = phishing.sample(subset_size // 2)
    if len(benign) > subset_size // 2: benign = benign.sample(subset_size // 2)
    
    sample_df = pd.concat([phishing, benign]).reset_index(drop=True)

    print(f"Extracting features for {len(sample_df)} URLs...")
    X = []
    y = []

    for index, row in sample_df.iterrows():
        url = row['text']
        label = row['label']
        
        if index % 100 == 0:
            print(f"Processing {index}/{len(sample_df)}...")
            
        try:
            # We use extract_all which includes DNS (slow)
            # In a production/large-scale training, you'd skip DNS for the bulk 
            # and only use it for real-time inference or a smaller validation set.
            features = feature_extractor.extract_all(url)
            X.append(list(features.values()))
            y.append(label)
        except:
            continue

    X = np.array(X)
    y = np.array(y)
    
    feature_names = list(feature_extractor.extract_all("http://example.com").keys())

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("\nModel Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))

    # Save model
    model_dir = "app/models"
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, "phish_model.joblib")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

    # Feature Importance
    importances = model.feature_importances_
    feat_importances = pd.Series(importances, index=feature_names)
    print("\nTop 10 Feature Importances:")
    print(feat_importances.nlargest(10))

if __name__ == "__main__":
    train()
