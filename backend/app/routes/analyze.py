from fastapi import APIRouter, HTTPException
from app.models.schemas import URLAnalysisRequest, URLAnalysisResponse
from app.services.ml_service import ml_service
from app.services.llm_service import llm_service
import time

router = APIRouter()

@router.post("/analyze", response_model=URLAnalysisResponse)
async def analyze_url(request: URLAnalysisRequest):
    url = request.url
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
        
    try:
        # Perform ML analysis
        ml_results = ml_service.predict(url)
        
        # Get LLM explanation
        explanation = await llm_service.get_explanation(url, ml_results)
        
        return {
            "url": url,
            "probability": ml_results['probability'],
            "prediction": ml_results['prediction'],
            "risk_level": ml_results['risk_level'],
            "features": ml_results['features'],
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}
