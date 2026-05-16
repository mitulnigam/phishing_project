import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="scanline"></div>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="py-8 text-center text-white/30 text-sm border-t border-white/5">
          <p>© 2026 PhishScope AI • Advanced Cybersecurity Intelligence</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
