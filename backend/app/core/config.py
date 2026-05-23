from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv

# Always load backend/.env regardless of process working directory
_BACKEND_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(_BACKEND_ROOT / ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "PhishScope AI"
    API_V1_STR: str = "/api/v1"
    
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_MODEL_FALLBACKS: str = "gemini-2.5-flash-lite,gemini-flash-latest,gemini-3.1-flash-lite"
    
    DATABASE_URL: str = "sqlite:///./phishscope.db"
    
    MODEL_PATH: str = "app/models/phish_model.joblib"
    DATASET_PATH: str = "datasets/sample_urls.csv"

    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_ROOT / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def gemini_models(self) -> list[str]:
        fallbacks = [m.strip() for m in self.GEMINI_MODEL_FALLBACKS.split(",") if m.strip()]
        models = [self.GEMINI_MODEL, *fallbacks]
        seen: set[str] = set()
        ordered: list[str] = []
        for model in models:
            if model not in seen:
                seen.add(model)
                ordered.append(model)
        return ordered

settings = Settings()

# Debug print to help the user verify key loading
if settings.OPENAI_API_KEY:
    masked_key = settings.OPENAI_API_KEY[:8] + "..." + settings.OPENAI_API_KEY[-4:]
    print(f"INFO: OpenAI API Key loaded successfully ({masked_key})")

if settings.GEMINI_API_KEY:
    masked_key = settings.GEMINI_API_KEY[:8] + "..." + settings.GEMINI_API_KEY[-4:]
    print(f"INFO: Gemini API Key loaded successfully ({masked_key})")

if not settings.GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not set — AI explanations will use rule-based fallback only.")
