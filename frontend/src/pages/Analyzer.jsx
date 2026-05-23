import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, Info, Loader2, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import ThreatGauge from '../components/ThreatGauge';
import DNSPanel from '../components/DNSPanel';
import ExplanationPanel from '../components/ExplanationPanel';

const Analyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/analyze', { url });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(detail || 'Failed to analyze URL. Ensure the backend is running on http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Search Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">URL Security <span className="text-primary">Analyzer</span></h1>
        <p className="text-white/50 mb-8">Enter any URL to perform deep linguistic, DNS, and AI-powered phishing analysis.</p>
        
        <form onSubmit={handleAnalyze} className="relative group">
          <input 
            type="text" 
            placeholder="https://example.com/login"
            className="cyber-input py-6 pl-14 pr-40 text-lg group-focus-within:border-primary/50 group-hover:border-white/20 transition-all"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-6 h-6 group-focus-within:text-primary transition-colors" />
          <button 
            type="submit"
            disabled={loading || !url}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze Now'}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="text-white/50 font-mono text-sm tracking-widest uppercase">
              Extracting Features & DNS Data...
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6 bg-danger/10 border border-danger/30 rounded-2xl flex items-center gap-4 text-danger mb-8"
          >
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Score & Summary */}
            <div className="lg:col-span-1 space-y-8">
              <div className="glass-card p-8 flex flex-col items-center text-center">
                <ThreatGauge score={result.probability} />
                <h2 className={`text-2xl font-bold mt-4 ${result.risk_level === 'High' ? 'text-danger' : result.risk_level === 'Medium' ? 'text-accent' : 'text-success'}`}>
                  {result.risk_level} Risk Detected
                </h2>
                <p className="text-white/40 text-sm font-mono mt-2 break-all">{result.url}</p>
                
                <div className="mt-8 flex gap-2 w-full">
                  <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Report
                  </button>
                  <a href={result.url} target="_blank" rel="noreferrer" className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Visit
                  </a>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Quick Insights
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: 'Verdict', value: result.prediction === 1 ? 'Phishing' : 'Legitimate', color: result.prediction === 1 ? 'text-danger' : 'text-success' },
                    { label: 'Phishing Prob.', value: `${(result.probability * 100).toFixed(1)}%` },
                    { label: 'HTTPS Secure', value: result.features.is_https ? 'Yes' : 'No', color: result.features.is_https ? 'text-success' : 'text-danger' },
                    { label: 'Domain Age', value: `${result.features.domain_age_days} days` },
                  ].map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white/50">{item.label}</span>
                      <span className={`font-bold ${item.color || 'text-white'}`}>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Detailed Panels */}
            <div className="lg:col-span-2 space-y-8">
              <ExplanationPanel explanation={result.explanation} />
              <DNSPanel features={result.features} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyzer;
