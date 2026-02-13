
import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  Send, 
  CheckCircle2, 
  Filter, 
  Clock, 
  MoreHorizontal,
  Mail,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle,
  TrendingUp,
  Inbox,
  Layers,
  Star,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StatusType = 'LEAD' | 'INTERESTED' | 'MEETING_BOOKED' | 'MEETING_COMPLETED' | 'WON' | 'BOUNCE' | 'WARMUP';

interface Thread {
  id: number;
  name: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  status: StatusType;
  lastMsg: string;
  campaign: string;
}

const MOCK_THREADS: Thread[] = [
  { id: 1, name: 'Steve Jobs', email: 'steve@apple.com', subject: 'Interested in the proposal!', preview: 'Thanks for reaching out, would love to see a demo of the new sync engine...', time: '2h ago', status: 'INTERESTED', lastMsg: 'Our team is exploring several solutions. Are you available for a quick technical deep dive next Tuesday at 10 AM?', campaign: 'Apple Growth' },
  { id: 2, name: 'Bill Gates', email: 'bill@microsoft.com', subject: 'Cloud Infrastructure', preview: 'Can we schedule a call for next week? I have a few technical questions...', time: '5h ago', status: 'MEETING_BOOKED', lastMsg: 'I saw your note on domain health. We might be able to integrate this into our workflow.', campaign: 'MS FTW' },
  { id: 3, name: 'Elon Musk', email: 'elon@tesla.com', subject: 'Neural Sync Follow-up', preview: 'Internal sync request: Automated warm-up reply sequence triggered...', time: '1d ago', status: 'WARMUP', lastMsg: 'System generated warmup packet: #8122-TX. No response required.', campaign: 'Warmup Pool' },
  { id: 4, name: 'Mark Zuckerberg', email: 'mark@meta.com', subject: 'Delivery Status Notification', preview: 'Recipient not found. Status: 550. Permanent delivery failure...', time: '2d ago', status: 'BOUNCE', lastMsg: 'Diagnostic code: 5.1.1 (bad destination mailbox address).', campaign: 'Meta Outreach' },
  { id: 5, name: 'Jeff Bezos', email: 'jeff@amazon.com', subject: 'Logistics Project', preview: 'We are reviewing the proposal internally and will get back to you...', time: '3d ago', status: 'LEAD', lastMsg: 'Acknowledged. We will review and provide feedback by end of week.', campaign: 'Amazon Scale' },
  { id: 6, name: 'Satya Nadella', email: 'satya@microsoft.com', subject: 'Cloud Partnership', preview: 'The board liked your presentation. Let\'s finalize the terms.', time: '4d ago', status: 'WON', lastMsg: 'Excellent work. We are ready to sign.', campaign: 'MS FTW' },
];

const FilterItem = ({ icon: Icon, label, count, active, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all text-xs font-medium group ${
      active ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
    }`}
  >
    <div className="flex items-center space-x-2.5">
      <Icon size={14} className={active ? `text-${color}-400` : `text-slate-600 group-hover:text-slate-400`} />
      <span>{label}</span>
    </div>
    {count !== undefined && (
      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-slate-700 group-hover:text-slate-500'}`}>
        {count}
      </span>
    )}
  </button>
);

const UniboxView: React.FC = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [isGeminiExpanded, setIsGeminiExpanded] = useState(true);
  
  const filteredThreads = MOCK_THREADS.filter(t => 
    selectedFilter === 'ALL' || t.status === selectedFilter
  );

  const selectedThread = MOCK_THREADS.find(t => t.id === selectedId) || MOCK_THREADS[0];

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'INTERESTED': return 'yellow';
      case 'MEETING_BOOKED': return 'violet';
      case 'MEETING_COMPLETED': return 'indigo';
      case 'WON': return 'blue';
      case 'LEAD': return 'emerald';
      case 'BOUNCE': return 'rose';
      case 'WARMUP': return 'sky';
      default: return 'slate';
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'INTERESTED': return Flame;
      case 'MEETING_BOOKED': return Calendar;
      case 'WON': return Star;
      case 'LEAD': return Zap;
      default: return Mail;
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent">
      {/* Column 1: Filter Sidebar (Instantly Style) */}
      <div className="w-[240px] flex-shrink-0 flex flex-col border-r border-white/5 bg-slate-950/60 p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Status</h3>
          </div>
          <div className="space-y-0.5">
            <FilterItem 
              icon={Inbox} label="All Messages" count={MOCK_THREADS.length} 
              active={selectedFilter === 'ALL'} onClick={() => setSelectedFilter('ALL')} color="blue" 
            />
            <FilterItem 
              icon={Zap} label="Lead" count={1} 
              active={selectedFilter === 'LEAD'} onClick={() => setSelectedFilter('LEAD')} color="emerald" 
            />
            <FilterItem 
              icon={Flame} label="Interested" count={1} 
              active={selectedFilter === 'INTERESTED'} onClick={() => setSelectedFilter('INTERESTED')} color="yellow" 
            />
            <FilterItem 
              icon={Calendar} label="Meeting booked" count={1} 
              active={selectedFilter === 'MEETING_BOOKED'} onClick={() => setSelectedFilter('MEETING_BOOKED')} color="violet" 
            />
            <FilterItem 
              icon={CheckCircle} label="Won" count={1} 
              active={selectedFilter === 'WON'} onClick={() => setSelectedFilter('WON')} color="blue" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">All Campaigns</h3>
            <ChevronRight size={12} className="text-slate-700" />
          </div>
          <div className="px-3">
             <div className="relative">
                <Search className="absolute left-2.5 top-2 text-slate-600" size={12} />
                <input 
                  type="text" placeholder="Search campaign..." 
                  className="w-full bg-white/5 border border-white/5 rounded-lg pl-8 pr-2 py-1.5 text-[10px] focus:outline-none" 
                />
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">All Inboxes</h3>
            <ChevronRight size={12} className="text-slate-700" />
          </div>
        </div>

        <div className="mt-auto p-4 glass rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center space-y-3">
           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-blue-500" />
           </div>
           <p className="text-[10px] font-bold text-slate-300 leading-relaxed">
             Take Unibox with you everywhere. Download the mobile app.
           </p>
           <button className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400">Scan QR Code</button>
        </div>
      </div>

      {/* Column 2: Thread List */}
      <div className="w-[340px] flex-shrink-0 flex flex-col border-r border-white/5 bg-slate-950/20">
        <div className="p-4 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-3 px-1">
             <h2 className="text-xs font-black uppercase tracking-widest text-white">Inbox</h2>
             <div className="flex space-x-2">
                <button className="text-[10px] font-bold text-blue-500">Primary</button>
                <button className="text-[10px] font-bold text-slate-600">Others</button>
             </div>
          </div>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-slate-600" size={14} />
            <input 
              type="text" 
              placeholder="Search mail..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/40 transition-all placeholder-slate-700"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredThreads.length > 0 ? filteredThreads.map((thread) => (
            <div 
              key={thread.id}
              onClick={() => setSelectedId(thread.id)}
              className={`p-4 cursor-pointer transition-all border-b border-white/[0.03] relative group ${
                selectedId === thread.id 
                  ? 'bg-blue-600/10 border-l-[3px] border-blue-500' 
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold text-xs truncate max-w-[160px] ${selectedId === thread.id ? 'text-white' : 'text-slate-300'}`}>
                  {thread.name}
                </span>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{thread.time}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 truncate flex-1">{thread.subject}</span>
                {thread.status !== 'WARMUP' && (
                  <div className={`bg-${getStatusColor(thread.status)}-500/10 text-${getStatusColor(thread.status)}-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase ring-1 ring-${getStatusColor(thread.status)}-500/20`}>
                    {thread.status.replace('_', ' ')}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
                {thread.preview}
              </p>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 opacity-40 grayscale">
              <Inbox size={48} className="text-slate-600" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No emails found</p>
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Message View */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedId}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Thread Header (Fixed) */}
            <div className="flex-none h-14 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md ring-1 ring-white/10">
                  {selectedThread.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-none">{selectedThread.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium lowercase tracking-tight">{selectedThread.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1.5 bg-${getStatusColor(selectedThread.status)}-500/10 px-3 py-1.5 rounded-lg border border-${getStatusColor(selectedThread.status)}-500/20`}>
                   {React.createElement(getStatusIcon(selectedThread.status), { size: 12, className: `text-${getStatusColor(selectedThread.status)}-400` })}
                   <span className={`text-[10px] font-black uppercase tracking-widest text-${getStatusColor(selectedThread.status)}-400`}>
                     {selectedThread.status.replace('_', ' ')}
                   </span>
                </div>
                <div className="w-px h-6 bg-white/5 mx-2" />
                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Clock size={16} /></button>
                <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
              </div>
            </div>

            {/* Chat Area (Scrolls) */}
            <div className="flex-1 overflow-y-auto min-h-0 p-8 space-y-8 scrollbar-hide">
              <div className="flex flex-col items-start space-y-2">
                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tl-none max-w-lg text-xs text-slate-300 leading-relaxed shadow-sm">
                  Hi {selectedThread.name.split(' ')[0]}, thanks for reaching out. I've reviewed your recent project updates and I think our cold outreach platform could significantly boost your lead generation speed.
                </div>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Sent 1d ago</span>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-3xl rounded-tr-none max-w-lg text-xs text-white shadow-xl shadow-blue-900/10 leading-relaxed font-medium">
                  {selectedThread.lastMsg}
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-1">Received {selectedThread.time}</span>
              </div>
            </div>

            {/* Bottom Section (Fixed) */}
            <div className="flex-none">
              {/* AI Suggestion Bar */}
              {selectedThread.status === 'INTERESTED' && (
                <div className="px-8 pb-4">
                  <motion.div 
                    initial={{ height: 'auto', opacity: 1 }}
                    className="gemini-glow bg-blue-600/5 border border-blue-500/20 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-500/10 bg-blue-500/10">
                      <div className="flex items-center space-x-2">
                        <Sparkles size={12} className="text-blue-400 fill-blue-400" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.1em]">Gemini AI Agent Draft</span>
                      </div>
                      <button onClick={() => setIsGeminiExpanded(!isGeminiExpanded)} className="text-slate-500 hover:text-white">
                        {isGeminiExpanded ? <MoreHorizontal size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                    
                    {isGeminiExpanded && (
                      <div className="p-4">
                        <p className="text-[11px] text-slate-200 italic font-medium leading-relaxed mb-4 border-l-2 border-blue-500/40 pl-3">
                          "Hi {selectedThread.name.split(' ')[0]}, that sounds perfect. I've blocked out Tuesday at 10 AM for a demo. Should I send a calendar invite to this address?"
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors flex items-center group">
                            APPLY DRAFT <CheckCircle2 size={12} className="ml-1.5 group-hover:scale-110 transition-transform" />
                          </button>
                          <button className="text-[10px] font-black uppercase text-slate-500 hover:text-slate-300">Regenerate</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Input Footer */}
              <div className="p-6 pt-2 border-t border-white/5 bg-slate-950/40">
                <div className="relative group">
                  <textarea 
                    placeholder="Draft your response..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-blue-500/50 text-slate-200 resize-none transition-all placeholder-slate-700 shadow-inner"
                  ></textarea>
                  <div className="absolute right-4 bottom-4 flex space-x-2">
                    <button className="bg-white text-black hover:bg-slate-200 px-6 py-2.5 rounded-xl transition-all shadow-xl active:scale-95 flex items-center space-x-2 font-black text-xs">
                      <span>Send Reply</span>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UniboxView;
