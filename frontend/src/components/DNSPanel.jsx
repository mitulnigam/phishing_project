import React from 'react';
import { Globe, Database, Clock, Hash } from 'lucide-react';

const DNSPanel = ({ features }) => {
  const items = [
    { label: 'Domain Age', value: `${features.domain_age_days} days`, icon: Clock, desc: 'Days since domain registration' },
    { label: 'DNS Records', value: features.dns_record_count, icon: Database, desc: 'Total A, MX, NS records found' },
    { label: 'Nameservers', value: features.nameserver_count, icon: Globe, desc: 'Number of authoritative servers' },
    { label: 'TTL Value', value: features.ttl_value, icon: Hash, desc: 'Time-to-Live for A records' },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold">Technical Indicators</h3>
        <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded border border-primary/20 text-[10px] text-primary uppercase font-bold tracking-widest">
          Research Data
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
        {items.map((item, i) => (
          <div key={i} className="p-6 bg-background group hover:bg-white/5 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-xl font-bold font-mono">{item.value}</div>
                <div className="text-[10px] text-white/20 mt-2 italic">{item.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-white/5 border-t border-white/5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Linguistic Complexity</h4>
        <div className="space-y-4">
          {[
            { label: 'URL Entropy', value: features.entropy.toFixed(3), progress: (features.entropy / 8) * 100 },
            { label: 'Subdomain Depth', value: features.subdomain_count, progress: (features.subdomain_count / 10) * 100 },
            { label: 'Path Complexity', value: features.path_depth, progress: (features.path_depth / 10) * 100 },
          ].map((bar, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">{bar.label}</span>
                <span className="font-mono text-primary">{bar.value}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-neon transition-all duration-1000" 
                  style={{ width: `${Math.min(100, bar.progress)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DNSPanel;
