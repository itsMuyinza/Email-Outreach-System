
import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  BarChart2, 
  Settings, 
  Inbox, 
  Zap, 
  ShieldCheck, 
  LayoutDashboard,
  PlusCircle,
  Bell,
  Layout,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsView from './components/Analytics';
import UniboxView from './components/Unibox';
import CampaignWizard from './components/CampaignWizard';
import CRMView from './components/CRM';
import AIAgentsView from './components/AIAgents';

type View = 'DASHBOARD' | 'ACCOUNTS' | 'CAMPAIGNS' | 'UNIBOX' | 'CRM' | 'SETTINGS' | 'AI_AGENTS';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={18} className={active ? 'text-violet-400' : 'group-hover:text-violet-400 transition-colors'} />
      <span className="font-medium text-sm tracking-tight">{label}</span>
    </div>
    {active && (
      <motion.div 
        layoutId="activeIndicator"
        className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
      />
    )}
  </button>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#020617] font-sans text-gray-100">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col z-20 relative m-3 rounded-2xl shadow-2xl bg-slate-950/40 backdrop-blur-xl">
        <div className="flex items-center space-x-2.5 mb-8 px-4 pt-4">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/40">
            <Zap size={20} className="text-white fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white">MyOutreach</h1>
            <p className="text-[9px] uppercase tracking-widest text-violet-400 font-bold">Cold OS v1.0</p>
          </div>
        </div>
        
        <nav className="flex-1 px-2 space-y-1.5 overflow-y-auto scrollbar-hide">
          <SidebarItem 
            icon={LayoutDashboard} label="Dashboard" 
            active={currentView === 'DASHBOARD'} 
            onClick={() => setCurrentView('DASHBOARD')} 
          />
          <SidebarItem 
            icon={Mail} label="Campaigns" 
            active={currentView === 'CAMPAIGNS'} 
            onClick={() => setCurrentView('CAMPAIGNS')} 
          />
          <SidebarItem 
            icon={Bot} label="AI Workforce" 
            active={currentView === 'AI_AGENTS'} 
            onClick={() => setCurrentView('AI_AGENTS')} 
          />
          <SidebarItem 
            icon={Inbox} label="Unibox" 
            active={currentView === 'UNIBOX'} 
            onClick={() => setCurrentView('UNIBOX')} 
          />
          <SidebarItem 
            icon={Layout} label="CRM" 
            active={currentView === 'CRM'} 
            onClick={() => setCurrentView('CRM')} 
          />
          <SidebarItem 
            icon={Users} label="Sender Pool" 
            active={currentView === 'ACCOUNTS'} 
            onClick={() => setCurrentView('ACCOUNTS')} 
          />
        </nav>

        <div className="p-3 mt-auto space-y-3">
          <div className="glass rounded-xl p-3 bg-violet-600/5 border border-violet-500/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400">Reputation: 98%</span>
              <ShieldCheck size={12} className="text-violet-400" />
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[98%] bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            </div>
          </div>
          <SidebarItem icon={Settings} label="Settings" active={currentView === 'SETTINGS'} onClick={() => setCurrentView('SETTINGS')} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="h-16 flex justify-between items-center px-8 border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold tracking-tight text-white capitalize">
              {currentView.replace('_', ' ').toLowerCase()}
            </h2>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Automation Live</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-fuchsia-500 rounded-full border border-slate-950" />
            </button>
            <button 
              onClick={() => setCurrentView('CAMPAIGNS')}
              className="bg-white text-black hover:bg-slate-200 transition-all px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 shadow-xl shadow-white/5"
            >
              <PlusCircle size={16} />
              <span>New Campaign</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentView === 'DASHBOARD' && <div className="p-8 overflow-y-auto h-full scrollbar-hide"><AnalyticsView /></div>}
              {currentView === 'CAMPAIGNS' && <div className="p-8 overflow-y-auto h-full scrollbar-hide"><CampaignWizard /></div>}
              {currentView === 'AI_AGENTS' && <div className="p-8 overflow-y-auto h-full scrollbar-hide"><AIAgentsView /></div>}
              {currentView === 'UNIBOX' && <UniboxView />}
              {currentView === 'CRM' && <CRMView />}
              {currentView === 'ACCOUNTS' && <div className="flex items-center justify-center h-full text-slate-600 font-medium">Sender Pool Analytics Coming Soon</div>}
              {currentView === 'SETTINGS' && <div className="flex items-center justify-center h-full text-slate-600 font-medium">System Configuration Coming Soon</div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
