
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, Calendar, MousePointer2, Mail, Users, BarChart3, Clock, CheckCircle } from 'lucide-react';

const MetricCard = ({ label, value, sub, icon: Icon, trend }: any) => (
  <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-900/20 group hover:border-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 group-hover:scale-110 transition-transform">
        <Icon size={18} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
      <p className="text-[10px] text-slate-600 font-bold uppercase">{sub}</p>
    </div>
  </div>
);

const CRMReports: React.FC = () => {
  const [range, setRange] = useState('This Month');
  const goal = 50000;
  const current = 17500;
  const percentage = Math.round((current / goal) * 100);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto scrollbar-hide">
      {/* Header & Goal Tracker */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 glass p-8 rounded-3xl border border-white/5 bg-slate-900/40 relative overflow-hidden group w-full">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={120} className="text-white" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center space-x-2">
                  <Target size={14} className="text-blue-500" />
                  <span>Monthly Sales Goal</span>
                </h2>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl font-black text-white tracking-tighter">${current.toLocaleString()}</span>
                  <span className="text-slate-500 font-bold text-sm">of ${goal.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-blue-500 opacity-20">{percentage}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                <span className="text-blue-400">{percentage}% OF GOAL REACHED</span>
                <span className="text-slate-500">${(goal - current).toLocaleString()} REMAINING</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-1">
             <Calendar size={20} className="text-slate-600 mb-2" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Reporting Range</span>
             <select 
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent text-sm font-black text-white focus:outline-none appearance-none cursor-pointer"
             >
                <option>Last 7 Days</option>
                <option>This Month</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
             </select>
          </div>
          <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-200 transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Opportunities Created" value="115" sub="+12 VS LAST MONTH" icon={TrendingUp} trend={8} />
        <MetricCard label="Opportunities Won" value="2" sub="REVENUE SECURED" icon={CheckCircle} />
        <MetricCard label="Closing Rate" value="1.8%" sub="CONVERSION EFFICIENCY" icon={BarChart3} trend={-0.2} />
        <MetricCard label="Sales Cycle" value="14.2" sub="AVG DAYS TO CLOSE" icon={Clock} trend={-5} />
      </div>

      {/* Activity & Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Outreach Activity</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-400" size={16} />
                <span className="text-xs font-black text-white">Emails</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500"><span>Sent</span><span>8,823</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: '90%'}} /></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500"><span>Received</span><span>114</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: '20%'}} /></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="text-violet-400" size={16} />
                <span className="text-xs font-black text-white">Meetings</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500"><span>Booked</span><span>60</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-violet-500" style={{width: '60%'}} /></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500"><span>Completed</span><span>2</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-fuchsia-500" style={{width: '5%'}} /></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="text-emerald-400" size={16} />
                <span className="text-xs font-black text-white">Pipeline</span>
              </div>
              <div className="space-y-3 text-center">
                 <p className="text-2xl font-black text-white">$145,200</p>
                 <p className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">TOTAL PIPELINE VALUE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Value Efficiency</h3>
          <div className="space-y-6 my-auto">
            <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Deal Size</span>
                <span className="text-xl font-black text-white">$4,250</span>
              </div>
              <DollarSign size={24} className="text-emerald-500 opacity-20" />
            </div>
            <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Annualized Val</span>
                <span className="text-xl font-black text-white">$1.2M</span>
              </div>
              <TrendingUp size={24} className="text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="pt-4 border-t border-white/5">
             <p className="text-[9px] text-slate-600 italic font-medium leading-relaxed">System prediction suggests 12% revenue growth next quarter based on current meeting completion velocity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMReports;
