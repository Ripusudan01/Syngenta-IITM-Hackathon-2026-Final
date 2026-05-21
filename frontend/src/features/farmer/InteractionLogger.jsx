// src/features/farmer/InteractionLogger.jsx
import { useState } from 'react';
import { ClipboardCopy, AlertOctagon, CheckCircle, HelpCircle } from 'lucide-react';

export default function InteractionLogger({ onSaveLog }) {
  const [interactionType, setInteractionType] = useState('Routine Crop Audit');
  const [sentiment, setSentiment] = useState('STABLE');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const newLog = {
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      interaction_type: interactionType,
      sentiment: sentiment,
      notes: notes
    };

    // Trigger state lifting pipeline up to App.jsx
    if (onSaveLog) {
      onSaveLog(newLog);
    }

    // Trigger micro-UX success state flash
    setShowSuccess(true);
    setNotes('');
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <ClipboardCopy className="w-4 h-4 text-[#00875A]" /> Ground-Truth Field Agent Logger
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Commit real-time agronomic observations into the centralized farmer memory network.
        </p>
      </div>

      {showSuccess ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
          <div className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Operational Matrix Synced Successfully
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 leading-relaxed">
            → Farmer memory timeline updated with current observations.<br />
            → Dynamic district threat score recalculation executed.<br />
            → If panic indicators were flagged, failover SMS protocols initialized.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Interaction Type Selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Interaction Context Matrix
              </label>
              <select
                value={interactionType}
                onChange={(e) => setInteractionType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#00875A] transition-all"
              >
                <option value="Routine Crop Audit">Routine Crop Audit</option>
                <option value="Pest Threat Assessment">Pest Threat Assessment</option>
                <option value="Disease Outbreak Record">Disease Outbreak Record</option>
                <option value="Champion Onboarding Sync">Champion Onboarding Sync</option>
              </select>
            </div>

            {/* Sentiment Matrix Target Selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Territory Panic Evaluation
              </label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-black outline-none transition-all ${
                  sentiment === 'PANIC' 
                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="STABLE">🟢 STABLE / SECURE OPERATIONAL STATE</option>
                <option value="ANXIOUS">🟡 ANXIOUS / RUMOR INFECTION WINDOW</option>
                <option value="PANIC">🚨 PANIC / CRITICAL THREAT ENVIRONMENT</option>
              </select>
            </div>
          </div>

          {/* Notes Input Field Area */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Observations, Field Queries, or Diagnostic Summary
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide clean local insights (e.g., Blast Disease identified in sector 4B, crop protection supply allocated...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-[#00875A] focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!notes.trim()}
            className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              notes.trim()
                ? 'bg-[#00875A] hover:bg-[#00704a] text-white font-extrabold cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed font-medium'
            }`}
          >
            {sentiment === 'PANIC' && <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />}
            Commit Operational Log Block
          </button>
        </form>
      )}
    </div>
  );
}