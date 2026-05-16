import re
import math
import tldextract
import dns.resolver
import whois
from datetime import datetime
from typing import Dict, Any

class FeatureExtractor:
    def __init__(self):
        self.suspicious_keywords = ['login', 'verify', 'secure', 'banking', 'update', 'account', 'signin', 'wp-admin']

    def calculate_entropy(self, text: str) -> float:
        if not text:
            return 0.0
        prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
        entropy = - sum([p * math.log(p) / math.log(2.0) for p in prob])
        return entropy

    def extract_linguistic_features(self, url: str) -> Dict[str, Any]:
        ext = tldextract.extract(url)
        domain = ext.domain + "." + ext.suffix
        subdomain = ext.subdomain
        
        # IP presence
        ip_present = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else 0
        
        # Lengths
        url_len = len(url)
        subdomain_count = len(subdomain.split('.')) if subdomain else 0
        
        # Characters
        hyphen_count = url.count('-')
        at_count = url.count('@')
        dot_count = url.count('.')
        
        # Suspicious keywords
        keyword_count = sum(1 for word in self.suspicious_keywords if word in url.lower())
        
        # Path depth
        path = url.split(domain)[-1] if domain in url else ""
        path_depth = len([p for p in path.split('/') if p])
        
        # HTTPS
        https = 1 if url.startswith('https') else 0
        
        # Entropy
        entropy = self.calculate_entropy(url)
        
        return {
            "url_length": url_len,
            "subdomain_count": subdomain_count,
            "has_ip": ip_present,
            "entropy": entropy,
            "hyphen_count": hyphen_count,
            "dot_count": dot_count,
            "at_count": at_count,
            "keyword_count": keyword_count,
            "path_depth": path_depth,
            "is_https": https
        }

    def extract_dns_features(self, url: str) -> Dict[str, Any]:
        ext = tldextract.extract(url)
        domain = ext.domain + "." + ext.suffix
        
        features = {
            "dns_record_count": 0,
            "has_mx": 0,
            "ttl_value": 0,
            "nameserver_count": 0,
            "domain_age_days": 0
        }
        
        try:
            # DNS records
            for qtype in ['A', 'MX', 'NS']:
                try:
                    answers = dns.resolver.resolve(domain, qtype)
                    features["dns_record_count"] += len(answers)
                    if qtype == 'MX':
                        features["has_mx"] = 1
                    if qtype == 'NS':
                        features["nameserver_count"] = len(answers)
                    if qtype == 'A' and answers.rrset:
                        features["ttl_value"] = answers.rrset.ttl
                except:
                    continue
            
            # WHOIS for domain age
            try:
                w = whois.whois(domain)
                creation_date = w.creation_date
                if isinstance(creation_date, list):
                    creation_date = creation_date[0]
                
                if creation_date:
                    if creation_date.tzinfo is not None:
                        age = (datetime.now(creation_date.tzinfo) - creation_date).days
                    else:
                        age = (datetime.now() - creation_date).days
                    features["domain_age_days"] = max(0, age)
            except:
                pass
                
        except Exception as e:
            print(f"Error extracting DNS features for {domain}: {e}")
            
        return features

    def extract_all(self, url: str) -> Dict[str, Any]:
        features = {}
        features.update(self.extract_linguistic_features(url))
        features.update(self.extract_dns_features(url))
        return features

feature_extractor = FeatureExtractor()
