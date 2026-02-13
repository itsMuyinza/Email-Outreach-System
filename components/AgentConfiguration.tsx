
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Settings, 
  MessageSquare, 
  Zap, 
  Plus, 
  Trash2, 
  Check, 
  Mail, 
  Globe, 
  Clock, 
  Bot,
  BrainCircuit,
  LayoutTemplate,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Agent, AgentConfig, InboxManagementRule } from './AIAgents';

interface AgentConfigurationProps {
  agent: Agent;
  onSave: (updatedAgent: Agent) => void;
  onClose: () => void;
}

type ConfigTab = 'BEHAVIOR' | 'INBOX_TASKS' | 'GUIDANCE';

const MOCK_ACCOUNTS = [
  'alex@growth.com',
  'alex.backup@growth.com',
  'sales@company.com',
  'support@company.com'
];

const AgentConfiguration: React.FC<AgentConfigurationProps> = ({ agent, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('BEHAVIOR');
  const [config, setConfig] = useState<AgentConfig>(agent.config);
  const [agentName, setAgentName] = useState(agent.name);
  
  // Rule Builder State
  const [newRule, setNewRule] = useState<Partial<InboxManagementRule>>({
    trigger: 'SUBJECT',
    condition: 'CONTAINS',
    action: 'ARCHIVE',
    value: ''
  });

  const handleSave = () => {
    onSave({ ...agent, name: agentName, config });
  };

  const addRule = () => {
    if (!newRule.value) return;
    const rule: InboxManagementRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Rule ${config.managementRules.length + 1}`,
      trigger: newRule.trigger as any,
      condition: newRule.condition as any,
      value: newRule.value,
      action: newRule.action as any,
      actionTarget: newRule.actionTarget
    };
    setConfig({ ...config, managementRules: [...config.managementRules, rule] });
    setNewRule({ trigger: 'SUBJECT', condition: 'CONTAINS', action: 'ARCHIVE', value: '' });
  };

  const removeRule = (id: string) => {
    setConfig({ ...config, managementRules: config.managementRules.filter(r => r.id !== id) });
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-2xl glass bg-slate-950/95 border-l border-white/10 z-[150] flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <input 
              value={agentName} 
              onChange={(e) => setAgentName(e.target.value)}
              className="bg-transparent text-lg font-black text-white focus:outline-none border-b border-transparent focus:border-violet-500/50 transition-all w-full"
            />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Agent Configuration</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onClose} className="p-2 glass rounded-lg text-slate-500 hover:text-white transition-all"><X size={18} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-6">
        {[
          { id: 'BEHAVIOR', label: 'Identity & Assign', icon: Settings },
          { id: 'INBOX_TASKS', label: 'Inbox Management', icon: Filter },
          { id: 'GUIDANCE', label: 'Knowledge Base', icon: BrainCircuit },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ConfigTab)}
            className={`flex items-center space-x-2 px-6 py-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-violet-500 text-white' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        
        {/* BEHAVIOR TAB */}
        {activeTab === 'BEHAVIOR' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Assignment Section */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
               <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center space-x-2">
                  <Mail size={14} /> <span>Inbox Assignment</span>
               </h3>
               <p className="text-xs text-slate-400">Select the specific sender account this agent is responsible for managing.</p>
               <div className="relative">
                  <select 
                    value={config.assignedAccountId || ''}
                    onChange={(e) => setConfig({ ...config, assignedAccountId: e.target.value })}
                    className="w-full glass bg-slate-900 p-4 rounded-xl border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                  >
                    <option value="">Select an Inbox...</option>
                    {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                  </select>
                  <ChevronRight className="absolute right-4 top-4 text-slate-600 pointer-events-none" size={16} />
               </div>
            </div>

            {/* General Toggles */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center space-x-2">
                <Zap size={14} /> <span>Core Functions</span>
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: 'autopilot', label: 'Autopilot Mode', desc: 'Agent takes actions without manual approval.' },
                  { key: 'allowFollowups', label: 'Auto Follow-ups', desc: 'Send bumps if no reply received in 3 days.' },
                  { key: 'handleOOO', label: 'Handle OOO', desc: 'Detect Out of Office and reschedule tasks.' },
                  { key: 'handleObjections', label: 'Handle Objections', desc: 'Attempt to overcome soft rejections automatically.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setConfig({ ...config, [item.key]: !config[item.key as keyof AgentConfig] })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${config[item.key as keyof AgentConfig] ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config[item.key as keyof AgentConfig] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tone Selector */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Communication Tone</h3>
              <div className="grid grid-cols-4 gap-2">
                {['FRIENDLY', 'NEUTRAL', 'PROFESSIONAL', 'HUMOROUS'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setConfig({ ...config, tone: t as any })}
                    className={`p-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                      config.tone === t ? 'bg-violet-600/20 border-violet-500 text-white' : 'border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INBOX TASKS TAB */}
        {activeTab === 'INBOX_TASKS' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="glass p-6 rounded-2xl border-white/5 bg-blue-500/5">
                <h3 className="text-sm font-bold text-white mb-2">Inbox Management Rules</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Define specific "If This, Then That" rules for your agent to keep the inbox organized. 
                  These run automatically on every incoming email.
                </p>
             </div>

             {/* Rule Builder */}
             <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Create New Rule</h3>
                <div className="grid grid-cols-12 gap-3">
                   <div className="col-span-3">
                      <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">If Trigger</label>
                      <select 
                        value={newRule.trigger}
                        onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value as any })}
                        className="w-full bg-slate-900 p-2.5 rounded-lg border border-white/10 text-xs text-white outline-none"
                      >
                         <option value="SUBJECT">Subject</option>
                         <option value="SENDER">Sender</option>
                         <option value="BODY">Body</option>
                      </select>
                   </div>
                   <div className="col-span-3">
                      <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Condition</label>
                      <select 
                        value={newRule.condition}
                        onChange={(e) => setNewRule({ ...newRule, condition: e.target.value as any })}
                        className="w-full bg-slate-900 p-2.5 rounded-lg border border-white/10 text-xs text-white outline-none"
                      >
                         <option value="CONTAINS">Contains</option>
                         <option value="EQUALS">Equals</option>
                         <option value="NOT_CONTAINS">Does Not Contain</option>
                      </select>
                   </div>
                   <div className="col-span-6">
                      <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Value</label>
                      <input 
                        value={newRule.value}
                        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                        placeholder="e.g. Invoice, Receipt, Newsletter"
                        className="w-full bg-slate-900 p-2.5 rounded-lg border border-white/10 text-xs text-white outline-none"
                      />
                   </div>
                </div>
                
                <div className="grid grid-cols-12 gap-3 pt-2 border-t border-white/5">
                   <div className="col-span-4">
                      <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Then Perform Action</label>
                      <select 
                        value={newRule.action}
                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value as any })}
                        className="w-full bg-slate-900 p-2.5 rounded-lg border border-white/10 text-xs text-white outline-none"
                      >
                         <option value="ARCHIVE">Archive Email</option>
                         <option value="DELETE">Delete Email</option>
                         <option value="MARK_READ">Mark as Read</option>
                         <option value="LABEL">Apply Label</option>
                         <option value="FORWARD">Forward To...</option>
                         <option value="MOVE_TO_FOLDER">Move to Folder...</option>
                      </select>
                   </div>
                   {(newRule.action === 'FORWARD' || newRule.action === 'LABEL' || newRule.action === 'MOVE_TO_FOLDER') && (
                     <div className="col-span-5">
                        <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Target</label>
                        <input 
                          value={newRule.actionTarget || ''}
                          onChange={(e) => setNewRule({ ...newRule, actionTarget: e.target.value })}
                          placeholder={newRule.action === 'FORWARD' ? 'email@address.com' : 'Folder Name'}
                          className="w-full bg-slate-900 p-2.5 rounded-lg border border-white/10 text-xs text-white outline-none"
                        />
                     </div>
                   )}
                   <div className="col-span-3 flex items-end">
                      <button 
                        onClick={addRule}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center space-x-2"
                      >
                         <Plus size={14} /> <span>Add Rule</span>
                      </button>
                   </div>
                </div>
             </div>

             {/* Existing Rules List */}
             <div className="space-y-3">
                {config.managementRules.map((rule) => (
                  <div key={rule.id} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                     <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/5 rounded-lg text-slate-400">
                           <LayoutTemplate size={16} />
                        </div>
                        <div className="flex flex-col">
                           <div className="flex items-center space-x-2 text-xs font-bold text-white">
                              <span className="text-slate-500 uppercase text-[10px]">IF</span>
                              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400">{rule.trigger}</span>
                              <span className="text-slate-600">{rule.condition.toLowerCase().replace('_', ' ')}</span>
                              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white">"{rule.value}"</span>
                           </div>
                           <div className="flex items-center space-x-2 text-xs font-bold text-white mt-1">
                              <span className="text-slate-500 uppercase text-[10px]">THEN</span>
                              <span className="text-emerald-400">{rule.action.replace('_', ' ')}</span>
                              {rule.actionTarget && <span className="text-slate-400">({rule.actionTarget})</span>}
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => removeRule(rule.id)}
                        className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                ))}
                {config.managementRules.length === 0 && (
                   <div className="text-center p-8 border-2 border-dashed border-white/5 rounded-2xl text-slate-600">
                      <p className="text-xs font-bold uppercase tracking-widest">No active rules</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* GUIDANCE TAB */}
        {activeTab === 'GUIDANCE' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             {['style', 'context', 'handover'].map((section) => (
                <div key={section} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                   <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">{section} Guidelines</h3>
                   <div className="flex flex-wrap gap-2">
                      {(config.customGuidance[section as keyof typeof config.customGuidance] as string[]).map((tag, idx) => (
                         <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 flex items-center space-x-2 group">
                            <span>{tag}</span>
                            <button 
                              onClick={() => {
                                const newArr = [...(config.customGuidance[section as keyof typeof config.customGuidance] as string[])];
                                newArr.splice(idx, 1);
                                setConfig({ ...config, customGuidance: { ...config.customGuidance, [section]: newArr } });
                              }}
                              className="text-slate-600 hover:text-rose-400"
                            >
                               <X size={10} />
                            </button>
                         </span>
                      ))}
                      <button 
                        onClick={() => {
                           const val = prompt(`Add new ${section} rule:`);
                           if (val) {
                              const newArr = [...(config.customGuidance[section as keyof typeof config.customGuidance] as string[]), val];
                              setConfig({ ...config, customGuidance: { ...config.customGuidance, [section]: newArr } });
                           }
                        }}
                        className="bg-violet-600/10 border border-violet-500/30 text-violet-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-violet-600 hover:text-white transition-all flex items-center space-x-1"
                      >
                         <Plus size={10} /> <span>Add</span>
                      </button>
                   </div>
                </div>
             ))}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl flex justify-between items-center">
        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium">
          <Clock size={12} />
          <span>Last edited just now</span>
        </div>
        <div className="flex space-x-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center space-x-2 shadow-xl shadow-violet-900/40 transition-all">
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentConfiguration;
