from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os
from dotenv import load_dotenv

# Try to load .env from the current directory or parent
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "PhishScope AI"
    API_V1_STR: str = "/api/v1"
    
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    DATABASE_URL: str = "sqlite:///./phishscope.db"
    
    MODEL_PATH: str = "app/models/phish_model.joblib"
    DATASET_PATH: str = "datasets/sample_urls.csv"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Debug print to help the user verify key loading
if settings.OPENAI_API_KEY:
    masked_key = settings.OPENAI_API_KEY[:8] + "..." + settings.OPENAI_API_KEY[-4:]
    print(f"INFO: OpenAI API Key loaded successfully ({masked_key})")

if settings.GEMINI_API_KEY:
    masked_key = settings.GEMINI_API_KEY[:8] + "..." + settings.GEMINI_API_KEY[-4:]
    print(f"INFO: Gemini API Key loaded successfully ({masked_key})")

if not settings.OPENAI_API_KEY and not settings.GEMINI_API_KEY:
    print("WARNING: No LLM API Keys found in environment or .env file.")
