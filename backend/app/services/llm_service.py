import asyncio
import logging
from typing import Any, Dict

from google import genai

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self):
        self.gemini_api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.gemini_api_key:
            self.client = genai.Client(api_key=self.gemini_api_key)

    async def get_explanation(self, url: str, ml_results: Dict[str, Any]) -> str:
        features = ml_results["features"]
        prob = ml_results["probability"]

        prompt = f"""
You are a senior cybersecurity analyst. Analyze the following URL and its technical indicators to explain why it might be phishing or legitimate.

URL: {url}
ML Phishing Probability: {prob:.2f}
Risk Level: {ml_results['risk_level']}

Technical Indicators:
- URL Length: {features['url_length']}
- Subdomain Count: {features['subdomain_count']}
- Entropy Score: {features['entropy']:.2f}
- Suspicious Keywords: {features['keyword_count']}
- Domain Age: {features['domain_age_days']} days
- DNS Records: {features['dns_record_count']}
- Nameservers: {features['nameserver_count']}
- Has MX Record: {'Yes' if features['has_mx'] else 'No'}
- HTTPS: {'Yes' if features['is_https'] else 'No'}

Please provide:
1. A concise verdict.
2. Confidence level.
3. Detailed reasoning based ONLY on the provided indicators.
4. Suspicious patterns detected.
5. A simple human-readable explanation for a non-technical user.

Do NOT hallucinate. If you are unsure, state the limitations.
"""

        if self.client:
            explanation = await asyncio.to_thread(self._generate_with_gemini, prompt)
            if explanation:
                return explanation

        return self._generate_fallback_explanation(url, ml_results)

    def _generate_with_gemini(self, prompt: str) -> str | None:
        for model in settings.gemini_models:
            try:
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt,
                )
                text = self._extract_response_text(response)
                if text:
                    logger.info("Gemini explanation generated with model=%s", model)
                    return text
                logger.warning("Gemini model %s returned empty text", model)
            except Exception as e:
                err = str(e)
                if "429" in err or "RESOURCE_EXHAUSTED" in err:
                    logger.warning("Gemini model %s quota exhausted, trying next", model)
                elif "404" in err or "NOT_FOUND" in err:
                    logger.warning("Gemini model %s not found, trying next", model)
                else:
                    logger.error("Gemini model %s failed: %s", model, err[:200])
        return None

    @staticmethod
    def _extract_response_text(response) -> str | None:
        text = getattr(response, "text", None)
        if text and text.strip():
            return text.strip()

        candidates = getattr(response, "candidates", None) or []
        for candidate in candidates:
            content = getattr(candidate, "content", None)
            parts = getattr(content, "parts", None) if content else None
            if not parts:
                continue
            for part in parts:
                part_text = getattr(part, "text", None)
                if part_text and part_text.strip():
                    return part_text.strip()
        return None

    def _generate_fallback_explanation(self, url: str, ml_results: Dict[str, Any]) -> str:
        prob = ml_results["probability"]
        features = ml_results["features"]

        explanation = "### PhishScope AI Analysis (Rule-Based Fallback)\n\n"
        explanation += f"**Verdict:** {'Suspicious' if prob > 0.5 else 'Likely Safe'}\n"
        explanation += f"**Confidence:** Moderate (ML Score: {prob:.2f})\n\n"
        explanation += "#### Indicators:\n"

        if features["domain_age_days"] < 30 and features["domain_age_days"] > 0:
            explanation += "- **Recently Registered Domain:** This domain was registered very recently, which is a common tactic for phishing.\n"
        if features["keyword_count"] > 0:
            explanation += "- **Suspicious Keywords:** The URL contains sensitive terms like 'login' or 'secure'.\n"
        if features["has_ip"] == 1:
            explanation += "- **IP Address in URL:** The URL uses an IP address instead of a domain name.\n"
        if features["is_https"] == 0:
            explanation += "- **Lack of HTTPS:** The site does not use secure encryption.\n"

        explanation += "\n#### Summary:\n"
        if prob > 0.5:
            explanation += "The combination of these technical indicators suggests a high likelihood of phishing. Avoid entering any credentials on this site."
        else:
            explanation += "The indicators suggest this URL follows standard legitimate patterns."

        return explanation


llm_service = LLMService()
