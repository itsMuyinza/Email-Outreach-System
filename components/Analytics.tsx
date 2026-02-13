
import React from 'react';
import { 
  TrendingUp, 
  Mail, 
  Reply, 
  Globe, 
  ShieldCheck, 
  Flame,
  ArrowUpRight,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const GlassBox = ({ children, className = "", title }: any) => (
  <div className={`glass rounded-2xl p-4 border border-white/5 flex flex-col ${className}`}>
    {title && <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center justify-between">
      {title}
      <div className="w-1 h-1 rounded-full bg-violet-500/30" />
    </h3>}
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <GlassBox className="hover:border-white/10 transition-colors group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={18} />
      </div>
      {trend && (
        <div className={`flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'}`}>
          <TrendingUp size={8} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
    <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
  </GlassBox>
);

const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Mail} label="Total Sent" value="8,421" trend="+22.1%" color="violet" />
        <StatCard icon={Reply} label="Reply Rate" value="12.4%" trend="+4.2%" color="fuchsia" />
        <StatCard icon={Globe} label="Domains" value="5" color="blue" />
        <StatCard icon={ShieldCheck} label="Health" value="98%" trend="+0.5%" color="green" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <GlassBox title="Throughput Performance" className="col-span-12 lg:col-span-8 h-64">
          <div className="flex-1 flex items-end justify-between px-2 pb-2 space-x-1.5">
            {[40, 65, 45, 90, 85, 60, 75, 55, 95, 80, 70, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="flex-1 w-full bg-gradient-to-t from-violet-600/30 to-fuchsia-600/70 rounded-t-lg relative group"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] pt-2 px-1 border-t border-white/5">
            <span>Jan</span><span>May</span><span>Sep</span><span>Dec</span>
          </div>
        </GlassBox>

        <GlassBox title="Sentiment Distribution" className="col-span-12 lg:col-span-4 h-64">
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-4 border-violet-600 flex items-center justify-center font-black text-white text-xs shadow-lg">74%</div>
              <div className="flex-1">
                <p className="text-xs font-black text-white">Positive Leads</p>
                <p className="text-[10px] text-slate-500 font-medium">Auto-categorized by Gemini</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Informational', val: 20, color: 'bg-blue-500' },
                { label: 'Neutral', val: 15, color: 'bg-slate-600' },
                { label: 'Bounces', val: 6, color: 'bg-rose-600' }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassBox>

        <GlassBox title="Recent Node Activity" className="col-span-12 lg:col-span-7 h-auto">
          <div className="space-y-2.5">
            {[
              { type: 'REPLY', user: 'Steve Jobs', meta: 'Applied AI smart draft', time: '2m ago' },
              { type: 'SENT', user: 'Mark Zuckerberg', meta: 'Sequence "Growth Q1"', time: '14m ago' },
              { type: 'BOUNCE', user: 'admin@tesla.com', meta: 'Error 550 - marked inactive', time: '45m ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 glass bg-white/[0.01] rounded-xl border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-lg ${log.type === 'REPLY' ? 'bg-green-500/10 text-green-500' : log.type === 'SENT' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {log.type === 'REPLY' ? <Reply size={12} /> : log.type === 'SENT' ? <ArrowUpRight size={12} /> : <Mail size={12} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none mb-0.5">{log.user}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{log.meta}</span>
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase">{log.time}</span>
              </div>
            ))}
          </div>
        </GlassBox>

        <GlassBox title="System Cluster" className="col-span-12 lg:col-span-5 h-auto">
          <div className="space-y-4">
            <div className="p-4 bg-violet-600/5 rounded-2xl border border-violet-500/10 space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load Status</span>
                  <span className="text-[10px] font-black text-violet-400">14% ACTIVE</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[14%] bg-violet-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <Flame size={16} className="text-orange-500 mb-1" />
                <span className="text-[8px] font-black uppercase text-slate-600">Warmup</span>
                <span className="text-base font-black text-white">30/30</span>
              </div>
              <div className="glass p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <UserPlus size={16} className="text-blue-500 mb-1" />
                <span className="text-[8px] font-black uppercase text-slate-600">Leads</span>
                <span className="text-base font-black text-white">+524</span>
              </div>
            </div>
          </div>
        </GlassBox>
      </div>
    </div>
  );
};

export default AnalyticsView;
