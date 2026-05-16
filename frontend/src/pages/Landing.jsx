import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, BarChart, ChevronRight, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-12 md:py-24">
      {/* Hero Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto mb-24"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
          <Zap className="w-3 h-3" /> Next-Gen Phishing Detection
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          Unmasking Deception with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Deep AI Analysis</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
          PhishScope AI combines DNS intelligence, linguistic NLP features, and LLM reasoning to detect sophisticated phishing attacks with explainable evidence.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/analyzer" className="btn-primary flex items-center gap-2 group w-full sm:w-auto">
            Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard" className="btn-secondary w-full sm:w-auto">
            View Research Stats
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {[
          {
            icon: Cpu,
            title: "ML Prediction",
            desc: "Hybrid Random Forest & XGBoost models trained on 800k+ URLs for high-accuracy classification.",
            color: "text-primary"
          },
          {
            icon: Globe,
            title: "DNS Intelligence",
            desc: "Real-time WHOIS, TTL, and nameserver analysis to detect fast-flux and recently registered domains.",
            color: "text-secondary"
          },
          {
            icon: Lock,
            title: "Explainable AI",
            desc: "LLM-powered reasoning layer provides human-readable evidence for every risk detection.",
            color: "text-accent"
          }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 group hover:border-primary/30 transition-all hover:-translate-y-2"
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:shadow-neon transition-all`}>
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-white/50 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Research Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass-card p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BarChart className="w-64 h-64 text-primary" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Research-Grade Architecture</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Designed for IEEE/Cybersecurity researchers, PhishScope AI provides full transparency into its feature extraction process and decision-making pipeline. Export detailed reports as PDFs for academic or forensic use.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold text-primary">98.2%</div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-mono">Accuracy</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold text-secondary">24+</div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-mono">Features</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold text-accent">Real-time</div>
              <div className="text-xs text-white/40 uppercase tracking-widest font-mono">Analysis</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
