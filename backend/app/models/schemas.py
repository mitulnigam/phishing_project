from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class URLAnalysisRequest(BaseModel):
    url: str

class FeatureStats(BaseModel):
    url_length: int
    subdomain_count: int
    has_ip: int
    entropy: float
    hyphen_count: int
    dot_count: int
    at_count: int
    keyword_count: int
    path_depth: int
    is_https: int
    dns_record_count: int
    has_mx: int
    ttl_value: int
    nameserver_count: int
    domain_age_days: int

class URLAnalysisResponse(BaseModel):
    url: str
    probability: float
    prediction: int
    risk_level: str
    features: FeatureStats
    explanation: str

class DashboardStats(BaseModel):
    total_analyzed: int
    phishing_detected: int
    legitimate_detected: int
    avg_risk_score: float
    top_suspicious_keywords: List[str]
    threat_history: List[Dict[str, Any]]
