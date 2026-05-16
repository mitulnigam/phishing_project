import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Shield, Target, AlertTriangle, TrendingUp, Users, Globe } from 'lucide-react';

const Dashboard = () => {
  // Sample data for research visualization
  const trendData = [
    { name: 'Mon', phishing: 45, benign: 120 },
    { name: 'Tue', phishing: 52, benign: 110 },
    { name: 'Wed', phishing: 89, benign: 134 },
    { name: 'Thu', phishing: 64, benign: 156 },
    { name: 'Fri', phishing: 98, benign: 142 },
    { name: 'Sat', phishing: 32, benign: 89 },
    { name: 'Sun', phishing: 28, benign: 75 },
  ];

  const featureImportance = [
    { name: 'Domain Age', value: 0.35 },
    { name: 'URL Entropy', value: 0.22 },
    { name: 'HTTPS Presence', value: 0.18 },
    { name: 'Keyword Match', value: 0.12 },
    { name: 'Subdomains', value: 0.08 },
    { name: 'Path Depth', value: 0.05 },
  ];

  const COLORS = ['#00f2ff', '#7000ff', '#ff00e5', '#ff003c', '#00ff9d', '#ffcc00'];

  const stats = [
    { label: 'Total Scanned', value: '1.2M+', icon: Globe, color: 'text-primary' },
    { label: 'Phishing Detected', value: '428K', icon: Target, color: 'text-danger' },
    { label: 'Avg Risk Score', value: '0.64', icon: AlertTriangle, color: 'text-accent' },
    { label: 'Accuracy Rate', value: '98.2%', icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Research <span className="text-primary">Dashboard</span></h1>
          <p className="text-white/50">Global threat intelligence and model performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs">Export Data (CSV)</button>
          <button className="btn-primary text-xs">Refresh Live Feed</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] text-success font-bold font-mono">+12% ↑</div>
            </div>
            <div className="text-3xl font-bold font-mono mb-1">{stat.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="text-primary w-5 h-5" /> Threat Detection Trends
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBenign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="phishing" stroke="#ff003c" fillOpacity={1} fill="url(#colorPhishing)" strokeWidth={3} />
                <Area type="monotone" dataKey="benign" stroke="#00f2ff" fillOpacity={1} fill="url(#colorBenign)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart: Feature Importance */}
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold mb-8">Model Feature Weights</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureImportance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {featureImportance.map((feat, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-white/60">{feat.name}</span>
                </div>
                <span className="font-mono text-white/40">{(feat.value * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
