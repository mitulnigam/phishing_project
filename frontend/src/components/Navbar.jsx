import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, BarChart3, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/analyzer', label: 'Analyzer', icon: Search },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:shadow-neon transition-all">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PhishScope <span className="text-primary">AI</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Cyber Intelligence Platform</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path ? 'text-primary' : 'text-white/60'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-primary shadow-neon"
                />
              )}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-bold uppercase tracking-wider">System Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
