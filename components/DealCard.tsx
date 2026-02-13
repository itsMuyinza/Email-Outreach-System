
import React from 'react';
import { MoreHorizontal, Clock, DollarSign, GripVertical } from 'lucide-react';

interface Deal {
  id: number;
  leadName: string;
  company: string;
  value: number;
  stage: string;
  lastContact: string;
}

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit, onDragStart }) => {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onClick={() => onEdit(deal)}
      className="glass group p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.06] transition-all cursor-grab active:cursor-grabbing shadow-xl relative overflow-hidden"
    >
      {/* Selection Glow */}
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <GripVertical size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-none mb-1">
              {deal.leadName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">{deal.company}</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="p-1.5 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-black tracking-tight text-emerald-400">
            ${deal.value.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-tight">
          <Clock size={11} />
          <span>{deal.lastContact}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-[#0f172a] flex items-center justify-center text-[9px] font-black text-white shadow-lg">
            {deal.leadName.charAt(0)}
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0f172a] flex items-center justify-center text-[8px] font-bold text-slate-400">
            +1
          </div>
        </div>
        <div className="flex items-center space-x-1.5 bg-blue-500/10 px-2 py-0.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active</span>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
