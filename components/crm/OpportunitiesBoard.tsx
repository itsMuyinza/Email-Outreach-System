
import React, { useMemo } from 'react';
import { Layout, Zap, Search, PlusCircle } from 'lucide-react';
import DealCard from '../DealCard';

type PipelineStage = 'INTERESTED' | 'MEETING_BOOKED' | 'MEETING_COMPLETED' | 'WON';

interface Deal {
  id: number;
  leadName: string;
  email: string;
  company: string;
  value: number;
  stage: PipelineStage;
  lastContact: string;
}

interface OpportunitiesBoardProps {
  deals: Deal[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onEditDeal: (deal: Deal) => void;
  onAddDeal: () => void;
  onDrop: (e: React.DragEvent, targetStage: PipelineStage) => void;
}

const PipelineColumn = ({ 
  title, 
  stage, 
  color, 
  deals, 
  onEditDeal,
  onDrop,
  onDragOver
}: { 
  title: string, 
  stage: PipelineStage, 
  color: string, 
  deals: Deal[],
  onEditDeal: (deal: Deal) => void,
  onDrop: (e: React.DragEvent, targetStage: PipelineStage) => void,
  onDragOver: (e: React.DragEvent) => void
}) => {
  const totalValue = deals.reduce((acc, curr) => acc + curr.value, 0);
  const count = deals.length;

  return (
    <div 
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
      className="flex flex-col h-full min-w-[320px] max-w-[320px] bg-slate-900/20 rounded-2xl border border-white/[0.02] flex-shrink-0"
    >
      <div className="p-5 space-y-3 border-b border-white/[0.03] bg-white/[0.01] rounded-t-2xl">
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg bg-${color}-500/10 text-${color}-400 ring-1 ring-${color}-500/20`}>
            <Zap size={14} fill="currentColor" />
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/90">{title}</h4>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-white leading-none">${totalValue.toLocaleString()}</span>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{count} deals</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide pb-10">
        {deals.length > 0 ? (
          deals.map(deal => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              onEdit={onEditDeal} 
              onDragStart={(e) => {
                e.dataTransfer.setData('dealId', deal.id.toString());
              }}
            />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center opacity-30 grayscale p-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
             <Layout size={24} className="text-slate-600 mb-3" />
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Drop leads here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ 
  deals, 
  searchQuery, 
  setSearchQuery, 
  onEditDeal, 
  onAddDeal,
  onDrop 
}) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const filtered = useMemo(() => {
    return deals.filter(d => 
      d.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deals, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/40">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Opportunities</span>
            <span className="text-sm font-bold text-white">Active Pipeline View</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
           <div className="relative group">
              <Search className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 w-80 transition-all placeholder-slate-700"
              />
           </div>
           
           <button 
              onClick={onAddDeal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-blue-900/40 transition-all active:scale-95"
           >
              <PlusCircle size={16} />
              <span>New Lead</span>
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 scrollbar-hide">
        <div className="h-full flex space-x-6 min-w-max pb-4">
          <PipelineColumn 
            title="Interested" stage="INTERESTED" color="yellow" 
            deals={filtered.filter(d => d.stage === 'INTERESTED')} 
            onEditDeal={onEditDeal} onDragOver={handleDragOver} onDrop={onDrop}
          />
          <PipelineColumn 
            title="Meeting booked" stage="MEETING_BOOKED" color="violet" 
            deals={filtered.filter(d => d.stage === 'MEETING_BOOKED')} 
            onEditDeal={onEditDeal} onDragOver={handleDragOver} onDrop={onDrop}
          />
          <PipelineColumn 
            title="Meeting completed" stage="MEETING_COMPLETED" color="indigo" 
            deals={filtered.filter(d => d.stage === 'MEETING_COMPLETED')} 
            onEditDeal={onEditDeal} onDragOver={handleDragOver} onDrop={onDrop}
          />
          <PipelineColumn 
            title="Won" stage="WON" color="green" 
            deals={filtered.filter(d => d.stage === 'WON')} 
            onEditDeal={onEditDeal} onDragOver={handleDragOver} onDrop={onDrop}
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesBoard;
