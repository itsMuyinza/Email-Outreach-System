
import React, { useState } from 'react';
import { Layout, BarChart3, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OpportunitiesBoard from './crm/OpportunitiesBoard';
import CRMReports from './crm/CRMReports';
import DealDetailModal from './crm/DealDetailModal';

type CRMModule = 'OPPORTUNITIES' | 'REPORTS';
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

const INITIAL_DEALS: Deal[] = [
  { id: 1, leadName: "Sundar Pichai", email: "sundar@google.com", company: "Google", value: 125000, stage: 'INTERESTED', lastContact: '2h ago' },
  { id: 2, leadName: "Tim Cook", email: "tim@apple.com", company: "Apple", value: 85000, stage: 'MEETING_BOOKED', lastContact: '5h ago' },
  { id: 3, leadName: "Satya Nadella", email: "satya@microsoft.com", company: "Microsoft", value: 45000, stage: 'MEETING_COMPLETED', lastContact: '1d ago' },
  { id: 4, leadName: "Jensen Huang", email: "jensen@nvidia.com", company: "NVIDIA", value: 250000, stage: 'WON', lastContact: '2d ago' },
  { id: 5, leadName: "Sam Altman", email: "sam@openai.com", company: "OpenAI", value: 15000, stage: 'INTERESTED', lastContact: '1h ago' },
];

const CRM: React.FC = () => {
  const [activeModule, setActiveModule] = useState<CRMModule>('OPPORTUNITIES');
  const [opportunities, setOpportunities] = useState<Deal[]>(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    const dealId = parseInt(e.dataTransfer.getData('dealId'));
    setOpportunities(prev => prev.map(d => 
      d.id === dealId ? { ...d, stage: targetStage } : d
    ));
  };

  const handleSaveDeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dealData = {
      leadName: formData.get('leadName') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      value: parseInt(formData.get('value') as string),
      stage: formData.get('stage') as PipelineStage,
    };

    if (selectedDeal && isFormOpen) {
       // logic for update handled in detail modal if needed, here we just do create/basic edit
       setOpportunities(prev => prev.map(d => d.id === selectedDeal.id ? { ...d, ...dealData } : d));
    } else {
      setOpportunities(prev => [...prev, { ...dealData, id: Date.now(), lastContact: 'Just now' }]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent">
      {/* CRM Navigation Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-white/5 bg-slate-950/40 p-4 space-y-8">
        <div className="space-y-4">
           <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">Sales Cluster</h2>
           <div className="space-y-1">
              <button 
                onClick={() => setActiveModule('OPPORTUNITIES')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-xs ${activeModule === 'OPPORTUNITIES' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                 <Layout size={16} className={activeModule === 'OPPORTUNITIES' ? 'text-blue-500' : ''} />
                 <span>Opportunities</span>
              </button>
              <button 
                onClick={() => setActiveModule('REPORTS')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-xs ${activeModule === 'REPORTS' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                 <BarChart3 size={16} className={activeModule === 'REPORTS' ? 'text-violet-500' : ''} />
                 <span>Reports</span>
              </button>
           </div>
        </div>

        <div className="mt-auto p-4 glass rounded-2xl bg-white/[0.02] border-white/5">
           <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Pipeline Health</p>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[34%] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
           </div>
           <p className="text-[10px] font-bold text-slate-600 mt-2 italic">34% of Monthly Revenue Goal</p>
        </div>
      </aside>

      {/* Module View */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeModule === 'OPPORTUNITIES' ? (
            <motion.div key="opps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <OpportunitiesBoard 
                deals={opportunities} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                onEditDeal={(d) => setSelectedDeal(d)}
                onAddDeal={() => { setSelectedDeal(null); setIsFormOpen(true); }}
                onDrop={handleDrop}
              />
            </motion.div>
          ) : (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <CRMReports />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Slide-over */}
        <AnimatePresence>
          {selectedDeal && !isFormOpen && (
            <DealDetailModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
          )}
        </AnimatePresence>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="glass w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">{selectedDeal ? 'Edit Opportunity' : 'New Opportunity'}</h3>
                  <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={20} /></button>
                </div>
                <form onSubmit={handleSaveDeal} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <input name="leadName" required placeholder="Lead Name" defaultValue={selectedDeal?.leadName} className="w-full glass bg-white/[0.03] p-4 rounded-2xl border-white/10 text-sm focus:border-blue-500/50 outline-none" />
                    <input name="email" required type="email" placeholder="Email Address" defaultValue={selectedDeal?.email} className="w-full glass bg-white/[0.03] p-4 rounded-2xl border-white/10 text-sm focus:border-blue-500/50 outline-none" />
                    <input name="company" required placeholder="Company" defaultValue={selectedDeal?.company} className="w-full glass bg-white/[0.03] p-4 rounded-2xl border-white/10 text-sm focus:border-blue-500/50 outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <DollarSign size={14} className="absolute left-4 top-4 text-slate-500" />
                        <input name="value" type="number" required placeholder="Deal Value" defaultValue={selectedDeal?.value} className="w-full glass bg-white/[0.03] pl-10 pr-4 py-4 rounded-2xl border-white/10 text-sm font-bold focus:border-blue-500/50 outline-none" />
                      </div>
                      <select name="stage" defaultValue={selectedDeal?.stage || 'INTERESTED'} className="w-full glass bg-slate-900 p-4 rounded-2xl border-white/10 text-sm font-bold focus:border-blue-500/50 outline-none appearance-none">
                        <option value="INTERESTED">Interested</option>
                        <option value="MEETING_BOOKED">Meeting Booked</option>
                        <option value="MEETING_COMPLETED">Meeting Completed</option>
                        <option value="WON">Won</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex space-x-4">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-white/5">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/40">Save Opportunity</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CRM;
