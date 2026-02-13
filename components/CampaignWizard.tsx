
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  Pause, 
  MoreHorizontal, 
  Plus, 
  Eye, 
  Zap, 
  Clock, 
  Settings, 
  Users, 
  Mail, 
  Check, 
  X,
  Calendar,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Save,
  Rocket,
  Upload,
  UserPlus,
  FileSpreadsheet,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { spinText } from '../utils/spintax';
import CampaignAnalytics from './CampaignAnalytics';

type Tab = 'ANALYTICS' | 'LEADS' | 'SEQUENCES' | 'SCHEDULE' | 'OPTIONS';

interface Lead {
  id: string;
  email: string;
  firstName?: string;
  company?: string;
  status: 'READY' | 'SENT' | 'BOUNCED' | 'REPLIED';
}

interface Variant {
  id: string;
  subject: string;
  body: string;
}

interface Step {
  id: number;
  delay: number;
  variants: Variant[];
}

interface Campaign {
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  leads: Lead[];
  steps: Step[];
  schedule: {
    name: string;
    startTime: string;
    endTime: string;
    timezone: string;
    days: string[];
  };
  options: {
    stopOnReply: boolean;
    trackOpens: boolean;
    trackLinks: boolean;
    textOnly: boolean;
    dailyLimit: number;
  };
}

const CampaignWizard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('SEQUENCES');
  const [selectedStepId, setSelectedStepId] = useState(1);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState({ subject: '', body: '' });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadInputMode, setLeadInputMode] = useState<'SELECT' | 'MANUAL'>('SELECT');
  const [manualLead, setManualLead] = useState({ email: '', firstName: '', company: '' });
  const [leadsSearch, setLeadsSearch] = useState('');
  
  // Interactive Sequence States
  const [editingDelayStepId, setEditingDelayStepId] = useState<number | null>(null);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [campaign, setCampaign] = useState<Campaign>({
    name: "Growth Strategy Q1",
    status: 'PAUSED',
    leads: [],
    steps: [
      { 
        id: 1, 
        delay: 0, 
        variants: [{ id: 'v1', subject: "{Hi|Hello|Hey} {{firstName}}, {quick question|question for you}", body: "{I hope you are doing well.|Hope you're having a {great|good|productive} week.}\n\nI was looking at {{company}} and noticed..." }] 
      }
    ],
    schedule: {
      name: "Default business hours",
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      timezone: "Eastern Time (US & Canada)",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    options: {
      stopOnReply: true,
      trackOpens: true,
      trackLinks: true,
      textOnly: false,
      dailyLimit: 50
    }
  });

  // Derived active state
  const activeStep = useMemo(() => campaign.steps.find(s => s.id === selectedStepId) || campaign.steps[0], [campaign.steps, selectedStepId]);
  const activeVariant = useMemo(() => activeStep.variants[selectedVariantIdx] || activeStep.variants[0], [activeStep, selectedVariantIdx]);

  // Sequence Handlers
  const addStep = () => {
    const nextId = Math.max(0, ...campaign.steps.map(s => s.id)) + 1;
    const newStep: Step = { 
      id: nextId, 
      delay: 2, 
      variants: [{ id: `v${Date.now()}`, subject: "Re: {{subject}}", body: "" }] 
    };
    setCampaign(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    setSelectedStepId(nextId);
    setSelectedVariantIdx(0);
  };

  const deleteStep = (stepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (campaign.steps.length <= 1) return;
    setCampaign(prev => {
      const filtered = prev.steps.filter(s => s.id !== stepId);
      if (selectedStepId === stepId) setSelectedStepId(filtered[0].id);
      return { ...prev, steps: filtered };
    });
  };

  const addVariant = (stepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCampaign(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId 
        ? { ...s, variants: [...s.variants, { id: `v${Date.now()}`, subject: s.variants[0].subject, body: "" }] } 
        : s)
    }));
  };

  const deleteVariant = (stepId: number, variantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCampaign(prev => ({
      ...prev,
      steps: prev.steps.map(s => {
        if (s.id !== stepId) return s;
        if (s.variants.length <= 1) return s;
        const filtered = s.variants.filter(v => v.id !== variantId);
        if (activeVariant.id === variantId) setSelectedVariantIdx(0);
        return { ...s, variants: filtered };
      })
    }));
  };

  const updateVariantValue = (field: 'subject' | 'body', value: string) => {
    setCampaign(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === selectedStepId 
        ? { ...s, variants: s.variants.map((v, i) => i === selectedVariantIdx ? { ...v, [field]: value } : v) } 
        : s)
    }));
  };

  const updateStepDelay = (stepId: number, delay: number) => {
    setCampaign(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, delay } : s)
    }));
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = bodyRef.current;
    if (!textarea) {
      updateVariantValue('body', (activeVariant.body || '') + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentBody = activeVariant.body || '';
    const newBody = currentBody.substring(0, start) + text + currentBody.substring(end);
    updateVariantValue('body', newBody);
    
    // Reset focus and cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleSave = () => {
    setSaveStatus('SAVING');
    console.log("Campaign Saved:", JSON.stringify(campaign, null, 2));
    setTimeout(() => {
      setSaveStatus('SAVED');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
    }, 1000);
  };

  // Filtered Leads logic
  const filteredLeads = useMemo(() => {
    return campaign.leads.filter(l => 
      l.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      (l.firstName && l.firstName.toLowerCase().includes(leadsSearch.toLowerCase())) ||
      (l.company && l.company.toLowerCase().includes(leadsSearch.toLowerCase()))
    );
  }, [campaign.leads, leadsSearch]);

  // Preview Logic
  useEffect(() => {
    if (isPreviewMode) {
      const step = campaign.steps.find(s => s.id === selectedStepId);
      const variant = step?.variants[selectedVariantIdx];
      if (variant) {
        const updatePreview = () => {
          setPreviewContent({
            subject: spinText(variant.subject || '<Empty subject>').replace(/{{firstName}}/g, 'John').replace(/{{company}}/g, 'Acme Corp'),
            body: spinText(variant.body || 'Start typing here...').replace(/{{firstName}}/g, 'John').replace(/{{company}}/g, 'Acme Corp')
          });
        };
        updatePreview();
        const timer = setInterval(updatePreview, 2000);
        return () => clearInterval(timer);
      }
    }
  }, [isPreviewMode, selectedStepId, selectedVariantIdx, campaign.steps]);

  const simulateCSVUpload = () => {
    const mockLeads: Lead[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      email: `${['steve', 'bill', 'elon', 'mark', 'jeff', 'satya', 'sundar', 'tim', 'jensen', 'sam', 'jack', 'larry'][i]}@${['apple', 'microsoft', 'tesla', 'meta', 'amazon', 'microsoft', 'google', 'apple', 'nvidia', 'openai', 'twitter', 'google'][i]}.com`,
      firstName: ['Steve', 'Bill', 'Elon', 'Mark', 'Jeff', 'Satya', 'Sundar', 'Tim', 'Jensen', 'Sam', 'Jack', 'Larry'][i],
      company: ['Apple', 'Microsoft', 'Tesla', 'Meta', 'Amazon', 'Microsoft', 'Google', 'Apple', 'NVIDIA', 'OpenAI', 'X', 'Alphabet'][i],
      status: 'READY'
    }));
    setCampaign(prev => ({ ...prev, leads: [...prev.leads, ...mockLeads] }));
    setIsLeadModalOpen(false);
  };

  const handleManualLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLead.email) return;
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      ...manualLead,
      status: 'READY'
    };
    setCampaign(prev => ({ ...prev, leads: [newLead, ...prev.leads] }));
    setManualLead({ email: '', firstName: '', company: '' });
    setIsLeadModalOpen(false);
  };

  const deleteLead = (id: string) => {
    setCampaign(prev => ({ ...prev, leads: prev.leads.filter(l => l.id !== id) }));
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <input 
            value={campaign.name}
            onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
            className="bg-transparent text-xl font-bold focus:outline-none border-b border-transparent focus:border-blue-500/50 px-1 text-white"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-full px-3 py-1.5 space-x-2">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-slate-300">{campaign.leads.length}</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
              campaign.status === 'ACTIVE' 
              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
              : 'bg-white/5 text-white border-white/10'
            }`}
            onClick={() => setCampaign({ ...campaign, status: campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' })}
          >
            {campaign.status === 'ACTIVE' ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            <span>{campaign.status === 'ACTIVE' ? 'Pause campaign' : 'Resume campaign'}</span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Tabs Sub-Navigation */}
      <div className="flex items-center space-x-8 border-b border-white/5 mb-6">
        {(['ANALYTICS', 'LEADS', 'SEQUENCES', 'SCHEDULE', 'OPTIONS'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold tracking-tight transition-all relative ${
              activeTab === tab ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            {activeTab === tab && (
              <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-hidden min-h-0 flex flex-col relative">
        <AnimatePresence mode="wait">
          {activeTab === 'ANALYTICS' && (
            <div className="h-full">
              <CampaignAnalytics />
            </div>
          )}

          {activeTab === 'SEQUENCES' && (
            <motion.div 
              key="sequences"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex h-full gap-6 overflow-hidden"
            >
              {/* Left Sidebar: Steps */}
              <div className="w-80 flex-shrink-0 flex flex-col space-y-4 overflow-y-auto scrollbar-hide pb-20">
                {campaign.steps.map((step, sIdx) => (
                  <div key={step.id} className="space-y-4">
                    {sIdx > 0 && (
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-px h-6 bg-white/10" />
                        {editingDelayStepId === step.id ? (
                          <input 
                            autoFocus
                            type="number"
                            value={step.delay}
                            onChange={(e) => updateStepDelay(step.id, parseInt(e.target.value) || 0)}
                            onBlur={() => setEditingDelayStepId(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingDelayStepId(null)}
                            className="bg-slate-900 text-white text-[10px] font-black w-12 text-center rounded border border-blue-500/50 outline-none"
                          />
                        ) : (
                          <div 
                            onClick={() => setEditingDelayStepId(step.id)}
                            className="text-[10px] font-black uppercase text-slate-500 bg-white/5 px-2 py-0.5 rounded hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            Wait {step.delay} days
                          </div>
                        )}
                        <div className="w-px h-6 bg-white/10" />
                      </div>
                    )}
                    <div 
                      onClick={() => setSelectedStepId(step.id)}
                      className={`glass rounded-xl p-4 cursor-pointer transition-all border ${
                        selectedStepId === step.id ? 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-500/5' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-300">Step {sIdx + 1}</span>
                        <div className="flex space-x-1">
                           <button 
                            onClick={(e) => deleteStep(step.id, e)}
                            className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
                           >
                            <Trash2 size={12} />
                           </button>
                        </div>
                      </div>
                      
                      {step.variants.map((v, vIdx) => (
                        <div 
                          key={v.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedStepId(step.id); setSelectedVariantIdx(vIdx); }}
                          className={`p-3 rounded-lg text-xs border mb-2 last:mb-0 transition-all flex justify-between items-center group/v ${
                            selectedStepId === step.id && selectedVariantIdx === vIdx 
                            ? 'bg-slate-900 border-blue-500/40 text-white' 
                            : 'bg-black/20 border-white/5 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span className="truncate flex-1">{v.subject || '<Empty subject>'}</span>
                          <button 
                            onClick={(e) => deleteVariant(step.id, v.id, e)}
                            className="p-1 opacity-0 group-hover/v:opacity-100 text-slate-500 hover:text-rose-500 transition-all"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}

                      <button 
                        onClick={(e) => addVariant(step.id, e)}
                        className="w-full mt-2 py-2 border border-dashed border-white/10 rounded-lg text-[10px] font-bold text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center space-x-1"
                      >
                        <Plus size={12} />
                        <span>Add variant</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addStep}
                  className="w-full py-4 glass rounded-xl border border-white/5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus size={14} />
                  <span>Add step</span>
                </button>
              </div>

              {/* Right Pane: Editor */}
              <div className="flex-1 flex flex-col glass rounded-2xl border border-white/5 overflow-hidden bg-slate-950/20 mb-20">
                <div className="p-6 space-y-6 flex flex-col flex-1">
                  {/* Subject Line */}
                  <div className="flex items-center space-x-4 border-b border-white/5 pb-4">
                    <span className="text-sm font-bold text-slate-500 w-16">Subject</span>
                    <input 
                      placeholder="Your subject"
                      value={activeVariant.subject || ''}
                      onChange={(e) => updateVariantValue('subject', e.target.value)}
                      className="bg-transparent text-sm font-medium text-white flex-1 focus:outline-none"
                    />
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`p-2 rounded-lg transition-all flex items-center space-x-2 text-xs font-bold ${
                          isPreviewMode ? 'bg-blue-600 text-white' : 'glass text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye size={14} />
                        <span>Preview</span>
                      </button>
                      <button className="p-2 glass rounded-lg text-slate-400 hover:text-blue-400 transition-all">
                        <Zap size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Body Text Area / Preview */}
                  <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                      {isPreviewMode ? (
                        <motion.div 
                          key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-blue-600/5 backdrop-blur-sm p-8 overflow-y-auto scrollbar-hide text-slate-200 text-sm leading-relaxed whitespace-pre-wrap rounded-xl border border-blue-500/20 shadow-inner italic"
                        >
                          <div className="text-[10px] font-black uppercase text-blue-400 mb-4 flex items-center space-x-2">
                            <Sparkles size={12} className="fill-blue-400" />
                            <span>Live Spintax Preview (Simulated John Doe)</span>
                          </div>
                          <div className="font-bold text-white mb-4 border-b border-white/5 pb-2">{previewContent.subject}</div>
                          {previewContent.body || 'Nothing to preview yet. Start typing your sequence!'}
                        </motion.div>
                      ) : (
                        <textarea 
                          ref={bodyRef}
                          value={activeVariant.body || ''}
                          onChange={(e) => updateVariantValue('body', e.target.value)}
                          placeholder="Start typing here... Tip: use {A|B} for Spintax and {{firstName}} for variables."
                          className="w-full h-full bg-transparent text-sm text-slate-300 leading-relaxed focus:outline-none resize-none scrollbar-hide"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Editor Footer Toolbar */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-2 relative">
                      <button 
                        onClick={() => insertTextAtCursor('{{scheduling_link}}')}
                        className="text-slate-500 hover:text-blue-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg tooltip"
                        title="Insert Scheduling Link"
                      >
                        <Calendar size={18} />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setIsVariablesOpen(!isVariablesOpen)}
                          className={`text-slate-500 hover:text-yellow-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg ${isVariablesOpen ? 'bg-white/5 text-yellow-400' : ''}`}
                          title="Insert Variables"
                        >
                          <Zap size={18} />
                        </button>
                        <AnimatePresence>
                          {isVariablesOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="absolute bottom-full left-0 mb-2 glass bg-slate-900 border border-white/10 rounded-xl overflow-hidden min-w-[120px] shadow-2xl z-50"
                            >
                              {[
                                { label: 'First Name', tag: '{{firstName}}' },
                                { label: 'Last Name', tag: '{{lastName}}' },
                                { label: 'Company', tag: '{{company}}' },
                                { label: 'City', tag: '{{city}}' },
                                { label: 'Unsubscribe Link', tag: '{{unsubscribe_link}}' }
                              ].map(v => (
                                <button 
                                  key={v.tag}
                                  onClick={() => { insertTextAtCursor(v.tag); setIsVariablesOpen(false); }}
                                  className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                  {v.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {saveStatus !== 'IDLE' && (
                        <span className={`text-[10px] font-black uppercase tracking-widest ${saveStatus === 'SAVED' ? 'text-emerald-500' : 'text-blue-400 animate-pulse'}`}>
                          {saveStatus === 'SAVING' ? 'Synchronizing...' : 'Draft Secured'}
                        </span>
                      )}
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Autosaved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'LEADS' && (
            <motion.div 
              key="leads"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {campaign.leads.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20 text-center"
                >
                  <div className="w-32 h-32 mb-8 flex items-center justify-center glass rounded-3xl border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                    <Users className="w-16 h-16 text-blue-500/60 relative z-10" />
                  </div>
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <span className="text-3xl">🚀</span>
                    <h3 className="text-2xl font-black text-white tracking-tighter">Your Leads Engine is Cold</h3>
                  </div>
                  <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed">
                    A campaign without leads is just a sequence of words. Import your contacts to start landing in inboxes.
                  </p>
                  <button 
                    onClick={() => { setLeadInputMode('SELECT'); setIsLeadModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center space-x-3 shadow-2xl shadow-blue-900/40 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    <Plus size={18} />
                    <span>Ignite Outreach</span>
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col h-full space-y-4">
                  <header className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Prospect Pool</span>
                        <h3 className="text-xl font-black text-white tracking-tighter">{campaign.leads.length} <span className="text-xs text-slate-600 font-bold ml-1">leads</span></h3>
                      </div>
                      <div className="h-10 w-px bg-white/5" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ready for Delivery</span>
                        <h3 className="text-xl font-black text-emerald-400 tracking-tighter">{campaign.leads.filter(l => l.status === 'READY').length}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative group">
                        <Search className="absolute left-3.5 top-3 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input 
                          type="text" 
                          placeholder="Find leads..." 
                          value={leadsSearch}
                          onChange={(e) => setLeadsSearch(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 w-64 transition-all text-white placeholder-slate-700 font-medium"
                        />
                      </div>
                      <button 
                        onClick={() => { setLeadInputMode('SELECT'); setIsLeadModalOpen(true); }}
                        className="bg-white text-black px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all hover:bg-slate-200 active:scale-95"
                      >
                        <Plus size={14} />
                        <span>Add Leads</span>
                      </button>
                    </div>
                  </header>

                  <div className="flex-1 glass border border-white/5 rounded-3xl overflow-hidden flex flex-col bg-slate-950/20 shadow-2xl relative">
                    <div className="flex-none bg-white/[0.02] border-b border-white/5">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-600 font-black uppercase tracking-[0.2em] text-[10px]">
                            <th className="px-8 py-5 w-1/3">Identity</th>
                            <th className="px-8 py-5 w-1/4">Organization</th>
                            <th className="px-8 py-5 w-1/4">Lifecycle</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide pb-24">
                      <table className="w-full text-left">
                        <tbody className="divide-y divide-white/[0.02]">
                          {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                            <tr key={lead.id} className="group hover:bg-white/[0.03] transition-colors">
                              <td className="px-8 py-4">
                                <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-sm">
                                      {lead.firstName?.charAt(0) || lead.email.charAt(0).toUpperCase()}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="font-black text-white text-sm tracking-tight">{lead.firstName || 'Unknown Lead'}</span>
                                      <span className="text-slate-500 font-medium text-[11px] truncate max-w-[200px]">{lead.email}</span>
                                   </div>
                                </div>
                              </td>
                              <td className="px-8 py-4">
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                                  {lead.company || 'Direct'}
                                </span>
                              </td>
                              <td className="px-8 py-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <div className="w-1 h-1 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-8 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                      <Copy size={16} />
                                   </button>
                                   <button 
                                      onClick={() => deleteLead(lead.id)}
                                      className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                   >
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="py-20 text-center">
                                <div className="flex flex-col items-center opacity-40">
                                   <Search size={40} className="text-slate-700 mb-4" />
                                   <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">No leads match your search criteria</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Bulk Actions Floating Bar */}
                    <AnimatePresence>
                      {filteredLeads.length > 0 && leadsSearch === '' && (
                        <motion.div 
                          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-2xl border-white/10 flex items-center space-x-6 z-20 shadow-2xl"
                        >
                           <div className="flex items-center space-x-2">
                              <Filter size={14} className="text-blue-500" />
                              <span className="text-[10px] font-black uppercase text-white tracking-widest">{campaign.leads.length} Total Leads</span>
                           </div>
                           <div className="w-px h-6 bg-white/10" />
                           <button className="text-[10px] font-black uppercase text-slate-500 hover:text-rose-500 transition-colors">Clean Bounces</button>
                           <button className="text-[10px] font-black uppercase text-slate-500 hover:text-blue-500 transition-colors">Export CSV</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'SCHEDULE' && (
            <motion.div 
              key="schedule"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-12 gap-8 h-full"
            >
              <div className="col-span-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                  <span>Configuration</span>
                </div>
                <div className="glass p-5 rounded-3xl border-white/5 space-y-5">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium flex items-center space-x-2"><Calendar size={14} className="text-blue-500" /> <span>Start</span></span>
                      <span className="text-white font-black uppercase text-[10px] tracking-widest">Immediate</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium flex items-center space-x-2"><Clock size={14} className="text-violet-500" /> <span>End</span></span>
                      <span className="text-white font-black uppercase text-[10px] tracking-widest">Indefinite</span>
                   </div>
                </div>
                <div className="glass p-5 rounded-3xl border border-blue-500/20 bg-blue-500/5 group hover:border-blue-500/50 transition-all cursor-pointer">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 group-hover:scale-110 transition-transform">
                        <Calendar size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Active Template</span>
                        <span className="text-sm font-black text-white">{campaign.schedule.name}</span>
                      </div>
                   </div>
                </div>
                <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-2xl">Create New Preset</button>
              </div>

              <div className="col-span-8 space-y-8 overflow-y-auto scrollbar-hide pb-20">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Schedule Name</h4>
                  <input 
                    value={campaign.schedule.name}
                    onChange={(e) => setCampaign({ ...campaign, schedule: { ...campaign.schedule, name: e.target.value } })}
                    className="w-full glass bg-slate-900/50 p-5 rounded-2xl border-white/10 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Daily Delivery Window</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="glass p-5 rounded-2xl border-white/5 relative group">
                       <p className="text-[9px] font-black uppercase text-slate-600 mb-1 group-focus-within:text-blue-500 transition-colors">Morning Start</p>
                       <select className="bg-transparent text-sm font-black text-white focus:outline-none w-full appearance-none cursor-pointer">
                          <option>{campaign.schedule.startTime}</option>
                          <option>08:00 AM</option>
                          <option>10:00 AM</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-5 bottom-6 text-slate-700 pointer-events-none" />
                    </div>
                    <div className="glass p-5 rounded-2xl border-white/5 relative group">
                       <p className="text-[9px] font-black uppercase text-slate-600 mb-1 group-focus-within:text-blue-500 transition-colors">Evening Cut-off</p>
                       <select className="bg-transparent text-sm font-black text-white focus:outline-none w-full appearance-none cursor-pointer">
                          <option>{campaign.schedule.endTime}</option>
                          <option>05:00 PM</option>
                          <option>08:00 PM</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-5 bottom-6 text-slate-700 pointer-events-none" />
                    </div>
                    <div className="glass p-5 rounded-2xl border-white/5 relative group">
                       <p className="text-[9px] font-black uppercase text-slate-600 mb-1 group-focus-within:text-blue-500 transition-colors">Recipient Zone</p>
                       <select className="bg-transparent text-[11px] font-black text-white focus:outline-none w-full appearance-none truncate cursor-pointer">
                          <option>{campaign.schedule.timezone}</option>
                          <option>GMT+0 London</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-5 bottom-6 text-slate-700 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Sequence Operating Days</h4>
                  <div className="flex flex-wrap gap-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                      <label key={day} className="flex items-center space-x-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          campaign.schedule.days.includes(day) ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-900/40' : 'border-white/10 group-hover:border-blue-500/50'
                        }`}>
                          {campaign.schedule.days.includes(day) && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${campaign.schedule.days.includes(day) ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`}>{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'OPTIONS' && (
            <motion.div 
              key="options"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6 pb-24 overflow-y-auto scrollbar-hide h-full"
            >
              {/* Account Selection */}
              <div className="glass p-8 rounded-3xl border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="flex items-center space-x-6">
                  <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tighter">Sender Pool Selection</h4>
                    <p className="text-xs text-slate-500 font-medium">Auto-rotate across internal domains to boost health</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                   <select className="glass bg-[#0f172a] p-4 rounded-2xl border-white/10 text-xs font-black uppercase tracking-widest text-white focus:outline-none min-w-[200px] appearance-none cursor-pointer">
                      <option>All Internal Accounts</option>
                      <option>alex@domain1.com</option>
                      <option>john@domain2.com</option>
                   </select>
                </div>
              </div>

              {/* Toggle Cards (Stop on Reply, Open Tracking, etc) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Stop on Reply */}
                 <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-sm font-black text-white uppercase tracking-widest">Stop on Reply</h4>
                       <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${campaign.options.stopOnReply ? 'bg-emerald-500' : 'bg-slate-800'}`} onClick={() => setCampaign({...campaign, options: {...campaign.options, stopOnReply: !campaign.options.stopOnReply}})}>
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${campaign.options.stopOnReply ? 'left-6' : 'left-1'}`} />
                       </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Recommended for direct sales outreach to prevent awkward multiple pings.</p>
                 </div>

                 {/* Open Tracking */}
                 <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-sm font-black text-white uppercase tracking-widest">Open Tracking</h4>
                       <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${campaign.options.trackOpens ? 'bg-blue-500' : 'bg-slate-800'}`} onClick={() => setCampaign({...campaign, options: {...campaign.options, trackOpens: !campaign.options.trackOpens}})}>
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${campaign.options.trackOpens ? 'left-6' : 'left-1'}`} />
                       </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">May slightly lower deliverability on some providers. Use with dedicated pixels.</p>
                 </div>
              </div>

              {/* Daily Limit Slider-like Input */}
              <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tighter">Throttle Control</h4>
                      <p className="text-xs text-slate-500 font-medium">Max volume to push daily for this specific campaign</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-900/50 p-4 rounded-2xl border border-white/10">
                       <input 
                          type="number" 
                          value={campaign.options.dailyLimit}
                          onChange={(e) => setCampaign({ ...campaign, options: { ...campaign.options, dailyLimit: parseInt(e.target.value) } })}
                          className="bg-transparent text-xl font-black text-white text-center focus:outline-none w-16"
                       />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Per Account</span>
                    </div>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min((campaign.options.dailyLimit / 200) * 100, 100)}%` }} />
                 </div>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center space-x-3 glass px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 border-blue-500/20 hover:bg-blue-500/5 transition-all shadow-xl"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${showAdvancedOptions ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`} />
                  <span>{showAdvancedOptions ? 'Hide' : 'Show'} Engine Variables</span>
                  {showAdvancedOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {showAdvancedOptions && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="glass p-8 rounded-3xl border-white/5 bg-blue-500/5">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Internal Footprint Randomization</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      The Outreach Engine will automatically vary send times by +/- 15 minutes and rotate between 3 distinct SMTP clusters to maintain domain health. Spintax variations are required for A/B testing logic to engage.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Footer Actions */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex space-x-4 pointer-events-auto glass p-2.5 rounded-3xl border-white/10 bg-slate-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-white/5">
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'SAVING'}
              className="flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              {saveStatus === 'SAVING' ? <Sparkles size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saveStatus === 'SAVED' ? 'Secured' : 'Save Progress'}</span>
            </button>
            <button className="flex items-center space-x-3 px-12 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-900/50 transition-all hover:-translate-y-1 active:scale-95 group">
              <Rocket size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Fire Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal - Refined Design */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-2xl rounded-[40px] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col bg-[#020617]"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-white tracking-tighter">Expand Your Reach</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Add prospects to the current campaign</p>
                </div>
                <button onClick={() => setIsLeadModalOpen(false)} className="p-3 glass rounded-2xl text-slate-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              {leadInputMode === 'SELECT' ? (
                <div className="p-10 grid grid-cols-2 gap-8">
                  <button 
                    onClick={simulateCSVUpload}
                    className="flex flex-col items-start p-10 glass bg-white/[0.02] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 rounded-[32px] transition-all group relative overflow-hidden text-left"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FileSpreadsheet size={100} />
                    </div>
                    <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
                      <Upload size={28} />
                    </div>
                    <h4 className="text-lg font-black text-white mb-2">Bulk Import (CSV)</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Fastest way to import thousands of leads with custom variables.</p>
                    <div className="mt-8 flex items-center space-x-2 text-[10px] font-black uppercase text-blue-400 tracking-widest">
                       <span>Select File</span>
                       <ChevronRight size={12} />
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setLeadInputMode('MANUAL')}
                    className="flex flex-col items-start p-10 glass bg-white/[0.02] border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 rounded-[32px] transition-all group relative overflow-hidden text-left"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <UserPlus size={100} />
                    </div>
                    <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20">
                      <UserPlus size={28} />
                    </div>
                    <h4 className="text-lg font-black text-white mb-2">Manual Insertion</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Quickly add a single high-value prospect manually to the pool.</p>
                    <div className="mt-8 flex items-center space-x-2 text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                       <span>Enter Details</span>
                       <ChevronRight size={12} />
                    </div>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleManualLeadSubmit} className="p-10 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email address <span className="text-rose-500">*</span></label>
                      <input 
                        required
                        type="email"
                        value={manualLead.email}
                        onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                        placeholder="e.g. steve@apple.com"
                        className="w-full glass bg-white/[0.02] p-5 rounded-2xl border-white/10 text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-white placeholder-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                        <input 
                          value={manualLead.firstName}
                          onChange={(e) => setManualLead({ ...manualLead, firstName: e.target.value })}
                          placeholder="e.g. Steve"
                          className="w-full glass bg-white/[0.02] p-5 rounded-2xl border-white/10 text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-white placeholder-slate-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Organization</label>
                        <input 
                          value={manualLead.company}
                          onChange={(e) => setManualLead({ ...manualLead, company: e.target.value })}
                          placeholder="e.g. Apple Inc"
                          className="w-full glass bg-white/[0.02] p-5 rounded-2xl border-white/10 text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-white placeholder-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-6 pt-4">
                    <button 
                      type="button"
                      onClick={() => setLeadInputMode('SELECT')}
                      className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all bg-white/5 rounded-2xl"
                    >Back to Selection</button>
                    <button 
                      type="submit"
                      className="flex-[2] py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/40 transition-all active:scale-95"
                    >Lock In Prospect</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignWizard;
