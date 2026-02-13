
import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Globe, Clock, History, DollarSign, MessageSquare, Zap, Plus, CheckCircle } from 'lucide-react';

interface Deal {
  id: number;
  leadName: string;
  email: string;
  company: string;
  value: number;
  stage: string;
  lastContact: string;
}

interface DealDetailModalProps {
  deal: Deal;
  onClose: () => void;
}

const DealDetailModal: React.FC<DealDetailModalProps> = ({ deal, onClose }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-lg glass bg-slate-950/90 border-l border-white/10 z-[110] shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-blue-900/40">
              {deal.leadName.charAt(0)}
           </div>
           <div>
              <h2 className="text-xl font-black text-white tracking-tighter">{deal.leadName}</h2>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                 <span className="text-blue-400">{deal.company}</span>
                 <div className="w-1 h-1 bg-slate-700 rounded-full" />
                 <span>{deal.stage.replace('_', ' ')}</span>
              </div>
           </div>
        </div>
        <button onClick={onClose} className="p-2.5 glass rounded-xl text-slate-500 hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {/* Deal Value Widget */}
        <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between">
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Total Opportunity Value</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">${deal.value.toLocaleString()}</h3>
           </div>
           <DollarSign size={32} className="text-blue-500 opacity-20" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="glass p-4 rounded-2xl border-white/5">
              <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-2">Email Address</p>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                 <Mail size={12} className="text-blue-500" />
                 <span className="truncate">{deal.email}</span>
              </div>
           </div>
           <div className="glass p-4 rounded-2xl border-white/5">
              <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-2">Last Activity</p>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                 <Clock size={12} className="text-violet-500" />
                 <span>{deal.lastContact}</span>
              </div>
           </div>
        </div>

        {/* History / Timeline */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center space-x-2">
              <History size={14} />
              <span>Deal Timeline</span>
           </h4>
           <div className="space-y-4 pl-4 border-l border-white/5">
              {[
                { label: 'Stage changed to WON', time: '2h ago', icon: CheckCircle, color: 'text-green-500' },
                { label: 'Demo meeting completed', time: '1d ago', icon: Zap, color: 'text-violet-500' },
                { label: 'Lead replied to initial hook', time: '3d ago', icon: MessageSquare, color: 'text-blue-500' },
                { label: 'Opportunity created', time: '4d ago', icon: Plus, color: 'text-slate-500' },
              ].map((item: any, i) => (
                <div key={i} className="relative group">
                   <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-slate-900 border border-white/20 group-hover:scale-150 transition-transform" />
                   <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                         <item.icon size={12} className={item.color} />
                         <span className="text-[11px] font-bold text-white leading-none">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-600 uppercase">{item.time}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium italic">Automated log from System Engine</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center space-x-4">
         <button className="flex-1 py-4 glass rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Archive Deal</button>
         <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/40">Open in Unibox</button>
      </div>
    </motion.div>
  );
};

export default DealDetailModal;
