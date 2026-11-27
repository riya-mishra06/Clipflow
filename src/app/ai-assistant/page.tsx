'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Zap,
  History,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import UniversalInput from '@/components/UniversalInput';
import { UniversalInputItem } from '@/lib/inputDetector';

interface GenerationRecord {
  _id: string;
  taskType: string;
  provider: string;
  aiModel: string;
  mode: string;
  analysisCoverage: string;
  estimatedCostUsd: number;
  status: string;
  promptPreview?: string;
  output: Record<string, unknown> | null;
  createdAt: string;
}

export default function AIAssistantPage() {
  const [inputs, setInputs] = useState<UniversalInputItem[]>([]);
  const [promptText, setPromptText] = useState('');
  const [taskType, setTaskType] = useState<
    'multimodal_analysis' | 'hook_generation' | 'document_analysis' | 'website_analysis' | 'caption_seo'
  >('multimodal_analysis');
  const [platform, setPlatform] = useState('Instagram Reels & TikTok');
  const [executionMode, setExecutionMode] = useState<'local_free' | 'manual_assisted' | 'direct_api'>('local_free');
  const [approvedPaid, setApprovedPaid] = useState(false);

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<GenerationRecord | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [manualPaste, setManualPaste] = useState('');
  const [copied, setCopied] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/ai/history', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setHistory(json.data || []);
      }
    } catch {}
  };

  useEffect(() => {
    const t = setTimeout(() => void loadHistory(), 0);
    return () => clearTimeout(t);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRunning(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          executionMode,
          approvedPaidExecution: approvedPaid,
          promptText,
          platform,
          inputs,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI analysis failed');
      setLatest(json.data.generation);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || 'AI request failed');
    } finally {
      setRunning(false);
    }
  };

  const handleManualImport = async () => {
    if (!latest || !manualPaste.trim()) return;
    setError(null);
    try {
      const res = await fetch('/api/ai/history', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId: latest._id, manualJsonText: manualPaste }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to import manual response');
      setLatest(json.data);
      setManualPaste('');
      await loadHistory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyPromptPack = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-[#818cf8]">Phase 07 • Central AI Orchestrator</span>
            <h1 className="text-sm font-bold text-white tracking-tight">Multimodal AI & Universal Input Studio</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <UniversalInput
            items={inputs}
            onChange={setInputs}
            multiple
            promptText={promptText}
            onPromptTextChange={setPromptText}
            title="Universal Multimodal Inputs (Files, URLs, Prompts & Vault)"
          />

          <form onSubmit={handleAnalyze} className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-[#a1a1aa] block mb-1">AI Task</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-white"
                >
                  <option value="multimodal_analysis">Multimodal Analysis</option>
                  <option value="hook_generation">Viral Hook Generation</option>
                  <option value="document_analysis">Document / Script Analysis</option>
                  <option value="website_analysis">Product / Website Analysis</option>
                  <option value="caption_seo">Caption & SEO Pack</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#a1a1aa] block mb-1">Target Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-white"
                >
                  <option value="Instagram Reels & TikTok">Instagram Reels & TikTok</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="Multi-Platform">Multi-Platform</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#a1a1aa] block mb-1">Execution Mode</label>
                <select
                  value={executionMode}
                  onChange={(e) => setExecutionMode(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-white"
                >
                  <option value="local_free">Local Free ($0.00)</option>
                  <option value="manual_assisted">Manual Assisted Prompt Pack ($0.00)</option>
                  <option value="direct_api">Live Gemini API (Approval Required)</option>
                </select>
              </div>
            </div>

            {executionMode === 'direct_api' && (
              <label className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approvedPaid}
                  onChange={(e) => setApprovedPaid(e.target.checked)}
                  className="accent-amber-400"
                />
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>I approve external Gemini API usage (video inputs send extracted keyframes + transcript, not raw video).</span>
              </label>
            )}

            <button
              type="submit"
              disabled={running || (inputs.length === 0 && !promptText.trim())}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>{running ? 'Running AI Orchestrator...' : 'Run Multimodal AI Analysis'}</span>
            </button>
          </form>

          {latest && (
            <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles className="w-4 h-4 text-[#818cf8]" />
                  <span>Orchestrator Output</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#a5b4fc]">{latest.provider}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981]">{latest.analysisCoverage}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[#a1a1aa]">
                    ${latest.estimatedCostUsd.toFixed(4)}
                  </span>
                </div>
              </div>

              {latest.status === 'awaiting_manual_import' && latest.promptPreview && (
                <div className="space-y-2 p-3 rounded-xl bg-[#09090b] border border-white/[0.08]">
                  <div className="flex items-center justify-between text-[11px] text-[#a1a1aa]">
                    <span>Manual Prompt Pack (copy into ChatGPT / Gemini web)</span>
                    <button
                      type="button"
                      onClick={() => copyPromptPack(latest.promptPreview!)}
                      className="text-[#818cf8] hover:text-white flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] text-[#d4d4d8] whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">
                    {latest.promptPreview}
                  </pre>
                  <textarea
                    rows={3}
                    value={manualPaste}
                    onChange={(e) => setManualPaste(e.target.value)}
                    placeholder="Paste JSON or text response from your external AI subscription here..."
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleManualImport}
                    className="px-3 py-1.5 rounded-lg bg-[#10b981] text-black text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Manual AI Output</span>
                  </button>
                </div>
              )}

              <pre className="p-3 rounded-xl bg-[#09090b] border border-white/[0.06] text-xs text-[#e4e4e7] whitespace-pre-wrap overflow-x-auto max-h-72 font-mono">
                {JSON.stringify(latest.output, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
            <h2 className="text-xs font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#818cf8]" />
              <span>AI Generation History ({history.length})</span>
            </h2>
            {history.length === 0 ? (
              <div className="text-xs text-[#71717a] py-6 text-center">
                No AI generations persisted yet. Run an analysis on the left.
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {history.map((g) => (
                  <button
                    key={g._id}
                    type="button"
                    onClick={() => setLatest(g)}
                    className="w-full text-left p-3 rounded-xl bg-[#09090b] hover:border-[#6366f1]/50 border border-white/[0.06] space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{g.taskType}</span>
                      <span className="text-[10px] font-mono text-[#10b981]">{g.provider}</span>
                    </div>
                    <div className="text-[10px] text-[#71717a] font-mono flex items-center justify-between">
                      <span>{g.analysisCoverage}</span>
                      <span>${g.estimatedCostUsd.toFixed(4)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
