
import React, { useState } from 'react';
import { 
  Bot, 
  Zap, 
  Settings, 
  Activity, 
  Terminal, 
  Plus, 
  X, 
  Mail, 
  MessageSquare, 
  Sparkles,
  RefreshCw,
  Power,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentConfiguration from './AgentConfiguration';

export type AgentType = 'ENGAGEMENT' | 'NEWSLETTER' | 'SALES_REPLY';
export type AgentStatus = 'ACTIVE' | 'PAUSED' | 'LEARNING';
export type AgentTone = 'FRIENDLY' | 'NEUTRAL' | 'PROFESSIONAL' | 'HUMOROUS';
export type ResponseLength = 'CONCISE' | 'STANDARD' | 'THOROUGH';

export interface InboxManagementRule {
  id: string;
  name: string;
  trigger: 'SUBJECT' | 'SENDER' | 'BODY' | 'KEYWORD';
  condition: 'CONTAINS' | 'EQUALS' | 'NOT_CONTAINS';
  value: string;
  action: 'ARCHIVE' | 'DELETE' | 'MARK_READ' | 'LABEL' | 'FORWARD' | 'MOVE_TO_FOLDER';
  actionTarget?: string; // e.g., folder name or email address
}

export interface AgentConfig {
  assignedAccountId: string | null; // The specific Inbox this agent manages
  autopilot: boolean;
  allowFollowups: boolean;
  handleOOO: boolean;
  handleObjections: boolean;
  tone: AgentTone;
  responseLength: ResponseLength;
  customGuidance: {
    style: string[];
    context: string[];
    handover: string[];
  };
  managementRules: InboxManagementRule[]; // Specific tasks
  integrations: {
    slackWebhook?: string;
    calendlyLink?: string;
    autoBook: boolean;
  };
  workingHours: { start: string; end: string };
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  stats: { actionsToday: number; successRate: number; lastActive: string };
  logs: string[];
  config: AgentConfig;
}

const DEFAULT_CONFIG: AgentConfig = {
  assignedAccountId: null,
  autopilot: true,
  allowFollowups: true,
  handleOOO: true,
  handleObjections: true,
  tone: 'PROFESSIONAL',
  responseLength: 'STANDARD',
  customGuidance: {
    style: ['Direct', 'Value-driven'],
    context: ['B2B SaaS'],
    handover: ['Meeting booked']
  },
  managementRules: [],
  integrations: {
    autoBook: true,
    calendlyLink: 'https://calendly.com/sarah-sdr'
  },
  workingHours: { start: '09:00', end: '17:00' }
};

const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sarah - Sales SDR',
    type: 'SALES_REPLY',
    status: 'ACTIVE',
    stats: { actionsToday: 24, successRate: 98.2, lastActive: 'Just now' },
    logs: [
      '[System] Sentiment: Positive detected from jeff@amazon.com',
      '[Drafting] Generated meeting proposal for Tuesday 10AM',
      '[System] Randomized delay (Human-like behavior patterns applied)'
    ],
    config: {
      ...DEFAULT_CONFIG,
      assignedAccountId: 'alex@growth.com',
      managementRules: [
        { id: 'r1', name: 'Archive Receipts', trigger: 'SUBJECT', condition: 'CONTAINS', value: 'Receipt', action: 'ARCHIVE' },
        { id: 'r2', name: 'Forward Legal', trigger: 'BODY', condition: 'CONTAINS', value: 'NDA', action: 'FORWARD', actionTarget: 'legal@company.com' }
      ]
    }
  },
  {
    id: '2',
    name: 'Engagement Bot',
    type: 'ENGAGEMENT',
    status: 'ACTIVE',
    stats: { actionsToday: 156, successRate: 99.1, lastActive: '2m ago' },
    logs: [
      '[Browser] Navigated to gmail.com',
      '[Action] Rescued 3 emails from spam',
      '[Action] Organic scroll performed'
    ],
    config: { ...DEFAULT_CONFIG, tone: 'FRIENDLY', assignedAccountId: 'alex.backup@growth.com' }
  }
];

const AIAgentsView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('1');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleSaveConfig = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    setIsConfigOpen(false);
  };

  const handleHireNew = () => {
    const newId = (Math.random() * 10000).toString();
    const newAgent: Agent = {
      id: newId,
      name: 'New Agent',
      type: 'SALES_REPLY',
      status: 'PAUSED',
      stats: { actionsToday: 0, successRate: 0, lastActive: 'Never' },
      logs: ['[System] Agent initialized.'],
      config: DEFAULT_CONFIG
    };
    setAgents([...agents, newAgent]);
    setSelectedAgentId(newId);
    setIsConfigOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter">AI Workforce</h2>
          <p className="text-slate-500 text-sm font-medium">Autonomous agents managing your outreach ecosystem</p>
        </div>
        <button 
          onClick={handleHireNew}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-violet-900/40"
        >
          <Plus size={16} />
          <span>Deploy New Agent</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Agent List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {agents.map(agent => (
            <div 
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-5 glass rounded-2xl border transition-all cursor-pointer ${
                selectedAgentId === agent.id ? 'border-violet-500/50 bg-violet-500/5 shadow-xl' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                  <Bot size={20} />
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                  agent.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  {agent.status}
                </div>
              </div>
              <h3 className="font-bold text-white mb-1">{agent.name}</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">{agent.type.replace('_', ' ')}</p>
              
              {agent.config.assignedAccountId ? (
                 <div className="flex items-center space-x-2 mb-4 bg-white/5 p-2 rounded-lg">
                    <Mail size={10} className="text-slate-400" />
                    <span className="text-[10px] font-medium text-slate-300 truncate">{agent.config.assignedAccountId}</span>
                 </div>
              ) : (
                <div className="flex items-center space-x-2 mb-4 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <ShieldAlert size={10} className="text-rose-400" />
                    <span className="text-[10px] font-bold text-rose-400">No Inbox Assigned</span>
                 </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Success</p>
                  <p className="text-sm font-black text-white">{agent.stats.successRate}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Today</p>
                  <p className="text-sm font-black text-white">{agent.stats.actionsToday}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Agent Detail / Logs */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {selectedAgent ? (
              <motion.div 
                key={selectedAgent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass rounded-3xl p-8 border border-white/5 bg-slate-950/20">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">{selectedAgent.name}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500 font-medium">Assigned to:</span>
                          <span className="text-xs text-white font-bold bg-white/10 px-2 py-0.5 rounded">
                            {selectedAgent.config.assignedAccountId || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setIsConfigOpen(true)}
                        className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all flex items-center space-x-2"
                      >
                        <Settings size={18} />
                        <span className="text-xs font-bold hidden sm:block">Configuration</span>
                      </button>
                      <button className="p-3 glass rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all"><Power size={18} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Activity size={16} className="text-violet-400 mb-2" />
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Health Score</p>
                      <p className="text-lg font-black text-white">98.4%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Zap size={16} className="text-yellow-400 mb-2" />
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Actions</p>
                      <p className="text-lg font-black text-white">{selectedAgent.stats.actionsToday}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Sparkles size={16} className="text-blue-400 mb-2" />
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Active Rules</p>
                      <p className="text-lg font-black text-white">{selectedAgent.config.managementRules.length}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center space-x-2">
                      <Terminal size={14} />
                      <span>Process Logs</span>
                    </h4>
                    <div className="bg-black/40 rounded-2xl p-6 font-mono text-[11px] space-y-2 border border-white/5 max-h-48 overflow-y-auto scrollbar-hide">
                      {selectedAgent.logs.map((log, i) => (
                        <div key={i} className="flex space-x-3">
                          <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                          <span className="text-violet-400">{log}</span>
                        </div>
                      ))}
                      <div className="flex space-x-3 items-center text-blue-400 animate-pulse">
                        <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                        <RefreshCw size={10} className="animate-spin" />
                        <span>Synthesizing next response...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 glass rounded-3xl border border-white/5 text-center space-y-4">
                <Bot size={48} className="text-slate-700" />
                <div>
                  <h3 className="text-lg font-black text-white tracking-tighter">No Agent Selected</h3>
                  <p className="text-slate-500 text-sm font-medium">Select an agent from the left to view deep analytics and configuration</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Configuration Slide-over */}
      <AnimatePresence>
        {isConfigOpen && selectedAgent && (
          <AgentConfiguration 
            agent={selectedAgent} 
            onSave={handleSaveConfig} 
            onClose={() => setIsConfigOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentsView;
