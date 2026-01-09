
import React, { useState } from 'react';
import { X, Upload, Check, ChevronRight, Building, User, FileText, Settings } from 'lucide-react';
import { Opportunity } from '../types';

interface ClientOnboardingProps {
  onClose: () => void;
  onComplete: (newClient: Opportunity) => void;
}

const ClientOnboarding: React.FC<ClientOnboardingProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      companyName: '',
      industry: 'Tech',
      size: '51-500',
      projectName: '',
      budget: '',
      contactName: '',
      contactRole: '',
      contactEmail: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);

  const handleSubmit = () => {
      const newClient: Opportunity = {
          id: `new-${Date.now()}`,
          companyName: formData.companyName,
          logoShort: formData.companyName.substring(0, 2).toUpperCase(),
          amount: Number(formData.budget) || 0,
          stage: 'Discovery',
          contacts: [{
              name: formData.contactName,
              role: formData.contactRole,
              title: formData.contactRole,
              email: formData.contactEmail,
              type: 'Decision Maker'
          }],
          projectDetails: {
              name: formData.projectName,
              budgetTotal: Number(formData.budget) || 0,
              budgetSpent: 0,
              timelineStart: new Date().toISOString().split('T')[0],
              timelineEnd: 'TBD',
              statusDescription: 'Onboarding'
          },
          nextAction: 'Initial Setup',
          nextActionDate: 'Today',
          sentiment: 'Neutral',
          isGhost: false,
          lastUpdated: 'Just now',
          probability: 20,
          files: [],
          automation: { level: 'Manual', autoApprove: [], requireApproval: [] },
          tasks: [],
          interactions: [],
          messages: []
      };
      onComplete(newClient);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-2xl bg-bgCard border border-border rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-bgElevated">
                <div>
                    <h2 className="font-sans text-xl font-bold text-white">Client Onboarding</h2>
                    <p className="text-xs text-textSecondary uppercase tracking-widest">Step {step} of 4</p>
                </div>
                <button onClick={onClose} className="text-textSecondary hover:text-white"><X size={24}/></button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-bgDark">
                <div 
                    className="h-full bg-accentCyan transition-all duration-500"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-bgElevated rounded-lg text-white"><Building size={24} /></div>
                            <h3 className="text-lg font-bold text-white">Company Profile</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Company Name</label>
                                <input name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white focus:border-accentCyan outline-none" placeholder="e.g. Acme Corp" autoFocus />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Industry</label>
                                    <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white outline-none">
                                        <option>Tech</option>
                                        <option>Finance</option>
                                        <option>Healthcare</option>
                                        <option>Retail</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Size</label>
                                    <select name="size" value={formData.size} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white outline-none">
                                        <option>1-50</option>
                                        <option>51-500</option>
                                        <option>500-5000</option>
                                        <option>5000+</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-bgElevated rounded-lg text-white"><FileText size={24} /></div>
                            <h3 className="text-lg font-bold text-white">Project Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Project Name</label>
                                <input name="projectName" value={formData.projectName} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white focus:border-accentCyan outline-none" placeholder="e.g. AI Transformation" />
                            </div>
                            <div>
                                <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Estimated Budget ($)</label>
                                <input name="budget" type="number" value={formData.budget} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white focus:border-accentCyan outline-none" placeholder="100000" />
                            </div>
                            <div className="p-6 border-2 border-dashed border-border rounded-xl text-center hover:border-accentCyan/50 transition-colors cursor-pointer">
                                <Upload className="mx-auto text-textSecondary mb-2" size={24} />
                                <p className="text-sm text-textSecondary">Upload Client Logo (Optional)</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-bgElevated rounded-lg text-white"><User size={24} /></div>
                            <h3 className="text-lg font-bold text-white">Primary Contact</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Full Name</label>
                                <input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white focus:border-accentCyan outline-none" placeholder="e.g. Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Role / Title</label>
                                <input name="contactRole" value={formData.contactRole} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white focus:border-accentCyan outline-none" placeholder="e.g. CTO" />
                            </div>
                            <div>
                                <label className="block text-xs text-textSecondary uppercase font-bold mb-2">Email</label>
                                <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-bgDark border border-border p-3 rounded-xl text-white focus:border-accentCyan outline-none" placeholder="jane@company.com" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 text-center pt-8">
                         <div className="w-20 h-20 bg-accentGreen/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accentGreen border border-accentGreen">
                             <Check size={40} />
                         </div>
                         <h3 className="text-2xl font-bold text-white">Ready to Launch</h3>
                         <p className="text-textSecondary max-w-sm mx-auto">
                             {formData.companyName} will be added to the Fortylaunch dashboard. AI agents will begin monitoring for interaction data.
                         </p>
                         <div className="p-4 bg-bgElevated rounded-xl text-left border border-border mt-6">
                             <div className="flex items-center gap-2 mb-2 text-white font-bold"><Settings size={16}/> Configuration</div>
                             <p className="text-xs text-textSecondary">✓ Phone & Video Recording Enabled</p>
                             <p className="text-xs text-textSecondary">✓ Email Tracking Enabled</p>
                             <p className="text-xs text-textSecondary">✓ AI Summaries Active</p>
                         </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex justify-between bg-bgElevated">
                <button onClick={step === 1 ? onClose : () => setStep(step - 1)} className="px-6 py-3 rounded-xl hover:bg-white/10 text-textSecondary transition-colors font-bold">
                    {step === 1 ? 'Cancel' : 'Back'}
                </button>
                <button 
                    onClick={step === 4 ? handleSubmit : handleNext}
                    className="px-8 py-3 rounded-xl bg-white text-bgDark font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    {step === 4 ? 'Complete Setup' : 'Next Step'} <ChevronRight size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ClientOnboarding;
