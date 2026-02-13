
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Mail, MousePointer2, MessageSquare, DollarSign, Eye } from 'lucide-react';

const KPICard = ({ label, value, trend, trendValue, icon: Icon, color }: any) => (
  <div className="glass rounded-xl p-4 border border-white/5 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <div className={`p-1.5 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        <Icon size={14} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
      {trend && (
        <div className={`flex items-center text-[9px] font-bold ${trend === 'up' ? 'text-green-400' : 'text-rose-400'}`}>
          {trend === 'up' ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
  </div>
);

const CampaignAnalytics: React.FC = () => {
  const chartData = [30, 45, 35, 60, 55, 80, 70, 90, 85, 100]; // Simulated trend
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 overflow-y-auto scrollbar-hide h-full pb-10">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard label="Sent" value="1,240" icon={Mail} color="blue" />
        <KPICard label="Open Rate" value="45.2%" trend="up" trendValue="+2.4%" icon={Eye} color="violet" />
        <KPICard label="Click Rate" value="12.1%" trend="up" trendValue="+0.8%" icon={MousePointer2} color="fuchsia" />
        <KPICard label="Replies" value="5" trend="down" trendValue="-1" icon={MessageSquare} color="indigo" />
        <KPICard label="Opportunities" value="$4.5k" icon={DollarSign} color="emerald" />
      </div>

      {/* Main Chart Section */}
      <div className="glass rounded-2xl p-6 border border-white/5 bg-slate-900/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-sm font-bold text-white">Engagement Volume</h4>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Last 14 Days Activity</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-400">Sent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-[10px] font-bold text-slate-400">Opens</span>
            </div>
          </div>
        </div>
        
        <div className="h-48 w-full relative group">
          <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(139, 92, 246)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path 
              d={`M 0 30 ${chartData.map((d, i) => `L ${i * (100/(chartData.length-1))} ${30 - (d/100 * 25)}`).join(' ')} L 100 30 Z`} 
              fill="url(#grad)" 
            />
            <path 
              d={chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * (100/(chartData.length-1))} ${30 - (d/100 * 25)}`).join(' ')} 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            {chartData.map((d, i) => (
              <circle 
                key={i}
                cx={i * (100/(chartData.length-1))} 
                cy={30 - (d/100 * 25)} 
                r="0.8" 
                fill="#8b5cf6" 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest mt-4">
          <span>01 Mar</span><span>04 Mar</span><span>07 Mar</span><span>10 Mar</span><span>14 Mar</span>
        </div>
      </div>

      {/* Step Breakdown Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.01]">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Step Performance Breakdown</h4>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-tighter bg-white/[0.01]">
              <th className="px-6 py-3 font-black">Sequence Step</th>
              <th className="px-6 py-3 font-black">Sent</th>
              <th className="px-6 py-3 font-black">Opens (%)</th>
              <th className="px-6 py-3 font-black">Replies (%)</th>
              <th className="px-6 py-3 font-black text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-bold text-white">Step 1: Initial Hook</td>
              <td className="px-6 py-4 text-slate-300">800</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold w-8">45%</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[60px]">
                    <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold w-8">2.5%</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[60px]">
                    <div className="h-full bg-green-500" style={{ width: '25%' }} />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right font-black text-emerald-400">$3,200</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-bold text-white">Step 2: Follow-up</td>
              <td className="px-6 py-4 text-slate-300">440</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold w-8">32%</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[60px]">
                    <div className="h-full bg-blue-500" style={{ width: '32%' }} />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold w-8">1.8%</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[60px]">
                    <div className="h-full bg-green-500" style={{ width: '18%' }} />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right font-black text-emerald-400">$1,300</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
