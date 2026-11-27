'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Scissors,
  Plus,
  Trash2,
  Play,
  Download,
  Loader2,
  FileText,
  RefreshCw,
  XCircle,
  RotateCcw,
  Archive,
  Save,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
  Tag,
  Hash,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ClipItem {
  id: string;
  title: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  cropMode: 'center' | 'manual';
  cropOffsetRatio: number;
  subtitleStyle: {
    enabled: boolean;
    fontSize: number;
    primaryColor: string;
    position: 'bottom' | 'center' | 'top';
  };
  brandText?: string;
  logoAssetId?: string;
  status: 'draft' | 'queued' | 'processing' | 'ready' | 'failed';
  jobId?: string;
  outputAssetId?: string;
  thumbnailAssetId?: string;
  error?: string;
}

interface ClippingSessionData {
  _id: string;
  title: string;
  projectId: string;
  sourceAssetId: string;
  sourceMetadata?: {
    durationSec?: number;
    width?: number;
    height?: number;
    fps?: number;
    videoCodec?: string | null;
    audioCodec?: string | null;
    sizeBytes?: number;
  };
  transcript?: {
    modelUsed?: string;
    language?: string;
    text?: string;
    segments?: Array<{ id: number; start: number; end: number; text: string }>;
    srtAssetId?: string;
    vttAssetId?: string;
  };
  clips: ClipItem[];
}

interface JobRecord {
  _id: string;
  type: string;
  status: string;
  progress: number;
  currentStage: string;
  error?: { message?: string } | null;
}

interface AISuggestionItem {
  title: string;
  startSec: number;
  endSec: number;
  hook?: string;
  caption?: string;
  hashtags?: string[];
  seoKeywords?: string[];
  reason: string;
}

export default function ClippingStudioWorkspacePage() {
  const params = useParams();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<ClippingSessionData | null>(null);
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [workerHealthy, setWorkerHealthy] = useState<boolean>(false);
  const [logoAssets, setLogoAssets] = useState<Array<{ _id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionItem[]>([]);
  const [aiMeta, setAiMeta] = useState<{
    generationId?: string;
    source?: string;
    promptPreview?: string;
    status?: string;
  } | null>(null);
  const [manualJsonInput, setManualJsonInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [showManualImport, setShowManualImport] = useState(false);

  const handleSuggestMoments = async (mode: 'local_free' | 'manual_assisted' = 'local_free') => {
    setError(null);
    setSuggesting(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'clip_moment_analysis',
          executionMode: mode,
          clippingSessionId: sessionId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to suggest clip moments');
      const gen = json.data?.generation;
      const list = Array.isArray(json.data?.output?.suggestions) ? json.data.output.suggestions : [];
      setAiSuggestions(list);
      setAiMeta({
        generationId: gen?._id,
        source: gen?.recommendationSource || json.data?.recommendationSource || 'rule_based',
        promptPreview: gen?.promptPreview,
        status: gen?.status,
      });
      setMessage(json.data?.output?.summary || `Generated ${list.length} clip suggestion(s).`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSuggesting(false);
    }
  };

  const handleImportManualSuggestions = async () => {
    if (!aiMeta?.generationId || !manualJsonInput.trim()) return;
    setError(null);
    try {
      const res = await fetch('/api/ai/history', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: aiMeta.generationId,
          manualJsonText: manualJsonInput,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to import structured AI response');
      const list = Array.isArray(json.data?.output?.suggestions) ? json.data.output.suggestions : [];
      setAiSuggestions(list);
      setAiMeta({
        generationId: json.data._id,
        source: 'manual_imported',
        promptPreview: json.data.promptPreview,
        status: 'completed',
      });
      setManualJsonInput('');
      setMessage(`Imported ${list.length} structured clip recommendation(s).`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadData = useCallback(async (quiet = false) => {
    if (!sessionId) return;
    if (!quiet) setLoading(true);
    try {
      const [sessRes, healthRes, logosRes] = await Promise.all([
        fetch(`/api/clipping/${sessionId}`, { cache: 'no-store' }),
        fetch('/api/jobs/health', { cache: 'no-store' }),
        quiet ? Promise.resolve(null) : fetch('/api/assets?category=image', { cache: 'no-store' }),
      ]);

      if (sessRes.ok) {
        const sj = await sessRes.json();
        setSession(sj.data);
        if (!quiet) setClips(sj.data?.clips || []);
        else {
          // Merge server status/outputAssetId into local clips without wiping unsaved edits
          setClips((prev) => {
            const serverMap = new Map<string, ClipItem>(
              (sj.data?.clips || []).map((c: ClipItem) => [c.id, c])
            );
            return prev.length === 0
              ? sj.data?.clips || []
              : prev.map((local) => {
                  const srv = serverMap.get(local.id);
                  return srv
                    ? {
                        ...local,
                        status: srv.status,
                        jobId: srv.jobId,
                        outputAssetId: srv.outputAssetId,
                        thumbnailAssetId: srv.thumbnailAssetId,
                        error: srv.error,
                      }
                    : local;
                });
          });
        }
        setJobs(sj.jobs || []);
        if (!quiet && sj.aiRecommendation) {
          const rec = sj.aiRecommendation;
          setAiMeta({
            generationId: rec._id,
            source: rec.recommendationSource || 'rule_based',
            promptPreview: rec.promptPreview,
            status: rec.status,
          });
          if (Array.isArray(rec.output?.suggestions)) {
            setAiSuggestions(rec.output.suggestions);
          }
        }
      } else if (!quiet) {
        const errJson = await sessRes.json().catch(() => ({}));
        setError(errJson.error || 'Clipping session not found');
      }

      if (healthRes.ok) {
        const hj = await healthRes.json();
        setWorkerHealthy(Boolean(hj.healthy));
      }

      if (logosRes && logosRes.ok) {
        const lj = await logosRes.json();
        setLogoAssets(
          (lj.data || []).filter(
            (a: any) =>
              Boolean(a.objectKey) &&
              !(Array.isArray(a.tags) && a.tags.includes('generated-thumbnail')) &&
              !/\((Cover|Thumbnail)\)\.jpg$/i.test(a.name || '') &&
              !/^Frame \d+$/i.test(a.name || '')
          )
        );
      }
    } catch (err: any) {
      if (!quiet) setError(err.message || 'Failed to load workspace');
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadData(false);
    }, 0);
    return () => clearTimeout(t);
  }, [loadData]);

  // Poll every 2s while any job is active
  const hasActiveJob = jobs.some((j) =>
    ['QUEUED', 'PROCESSING', 'RETRY_SCHEDULED', 'CANCELLING'].includes(j.status)
  );
  useEffect(() => {
    if (!hasActiveJob) return;
    const t = setInterval(() => loadData(true), 2000);
    return () => clearInterval(t);
  }, [hasActiveJob, loadData]);

  const saveClipsToServer = async (nextClips: ClipItem[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clipping/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clips: nextClips }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save clips');
      setSession(json.data);
      setMessage('Clip configuration saved.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addClip = (start = 0, end?: number, label?: string) => {
    const maxDur = session?.sourceMetadata?.durationSec || 60;
    const safeStart = Math.max(0, Number(start.toFixed(1)));
    const safeEnd = Math.min(maxDur, Math.max(safeStart + 2, Number((end ?? safeStart + 5).toFixed(1))));
    const next: ClipItem = {
      id: `clip-${crypto.randomUUID().slice(0, 8)}-${clips.length + 1}`,
      title: label || `Clip ${clips.length + 1}`,
      startSec: safeStart,
      endSec: safeEnd,
      durationSec: Number((safeEnd - safeStart).toFixed(1)),
      cropMode: 'center',
      cropOffsetRatio: 0.5,
      subtitleStyle: { enabled: true, fontSize: 18, primaryColor: '#FFFFFF', position: 'bottom' },
      brandText: '',
      logoAssetId: '',
      status: 'draft',
    };
    setClips([...clips, next]);
  };

  const updateClip = (id: string, patch: Partial<ClipItem>) => {
    setClips((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const merged = { ...c, ...patch };
        merged.durationSec = Math.max(0.5, Number((merged.endSec - merged.startSec).toFixed(1)));
        return merged;
      })
    );
  };

  const handleTranscribe = async (force = false) => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/clipping/${sessionId}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force, model: 'base' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to start transcription');
      setMessage(json.reused ? 'Reused existing transcript.' : 'Transcription job queued.');
      await loadData(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerate = async (clipId?: string) => {
    setError(null);
    setMessage(null);
    await saveClipsToServer(clips);
    try {
      const res = await fetch(`/api/clipping/${sessionId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clipId ? { clipId } : {}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to queue clip generation');
      setMessage(clipId ? 'Clip render queued.' : `${json.jobs?.length || 0} clips queued sequentially.`);
      await loadData(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJobAction = async (jobId: string, action: 'cancel' | 'retry') => {
    try {
      await fetch(`/api/jobs/${jobId}/${action}`, { method: 'POST' });
      await loadData(true);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <div className="text-sm text-white font-semibold">{error || 'Clipping session not found'}</div>
        <Link href="/clipping" className="text-xs text-[#818cf8] underline">
          Back to Clipping Studio
        </Link>
      </div>
    );
  }

  const readyClips = clips.filter((c) => c.status === 'ready' && c.outputAssetId);
  const queuedCount = jobs.filter((j) => ['QUEUED', 'RETRY_SCHEDULED', 'SCHEDULED'].includes(j.status)).length;
  const completedCount = jobs.filter((j) => j.status === 'COMPLETED').length;
  const failedCount = jobs.filter((j) => j.status === 'FAILED').length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/clipping"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-white truncate">{session.title}</h1>
            <div className="text-[11px] text-[#71717a] font-mono flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 ${workerHealthy ? 'text-[#10b981]' : 'text-amber-400'}`}>
                <Cpu className="w-3 h-3" /> {workerHealthy ? 'Worker Online' : 'Worker Offline (start npm run worker)'}
              </span>
              {session.sourceMetadata?.durationSec && (
                <span>• {session.sourceMetadata.durationSec.toFixed(1)}s • {session.sourceMetadata.width}×{session.sourceMetadata.height}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => saveClipsToServer(clips)}
            disabled={saving}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Clips</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={clips.length === 0}
            className="px-3.5 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Generate All ({clips.length})</span>
          </button>

          {readyClips.length > 0 && (
            <a
              href={`/api/clipping/${session._id}/download-zip`}
              className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black text-xs font-bold flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download ZIP ({readyClips.length})</span>
            </a>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
        )}
        {message && (
          <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-xs text-[#10b981]">{message}</div>
        )}

        {/* Top Row: Source Video + Transcript */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Source Video Preview</span>
              <span className="text-[#71717a] font-mono">
                {session.sourceMetadata?.videoCodec || 'video'} / {session.sourceMetadata?.fps || 30}fps
              </span>
            </div>
            <video
              src={`/api/assets/${session.sourceAssetId}/media`}
              controls
              className="w-full max-h-[300px] rounded-xl bg-black border border-white/[0.08]"
            />
          </div>

          <div className="lg:col-span-6 p-5 rounded-2xl bg-[#121215] border border-white/[0.08] flex flex-col space-y-3">
            {/* Header row: title + generate transcript button */}
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#818cf8]" />
                <span>Transcript (faster-whisper)</span>
              </div>
              <button
                type="button"
                onClick={() => handleTranscribe(Boolean(session.transcript?.srtAssetId))}
                className="px-3 py-1.5 rounded-lg bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-[#818cf8] text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{session.transcript?.srtAssetId ? 'Re-Transcribe' : 'Generate Transcript'}</span>
              </button>
            </div>

            {/* ── AI Suggest Buttons (only when transcript exists) ── */}
            {session.transcript?.segments && session.transcript.segments.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={suggesting}
                  onClick={() => handleSuggestMoments('local_free')}
                  className="px-3 py-1.5 rounded-lg bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] text-xs font-semibold flex items-center gap-1.5"
                >
                  {suggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>AI Suggest Moments</span>
                </button>
                <button
                  type="button"
                  disabled={suggesting}
                  onClick={() => handleSuggestMoments('manual_assisted')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#e4e4e7] text-xs font-semibold"
                >
                  Manual AI Prompt
                </button>
                <Link
                  href="/ai-assistant"
                  className="px-2.5 py-1.5 rounded-lg bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#818cf8] text-xs font-semibold flex items-center gap-1 ml-auto"
                >
                  <ExternalLink className="w-3 h-3" />
                  AI Script Lab
                </Link>
              </div>
            )}

            {/* ── Manual AI Prompt Import ── always accessible, not gated on status ── */}
            <div className="p-3 rounded-xl bg-[#09090b] border border-white/[0.1] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#a5b4fc] font-mono">
                  Manual AI Prompt Import
                </span>
                <button
                  type="button"
                  onClick={() => setShowManualImport((p) => !p)}
                  className="text-[11px] text-[#818cf8] hover:text-white underline flex items-center gap-1"
                >
                  {showManualImport ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showManualImport ? 'Hide' : 'Show'}
                </button>
              </div>
              {showManualImport && (
                <>
                  {aiMeta?.status === 'awaiting_manual_import' && aiMeta.promptPreview && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#71717a]">
                        <span>Copy this prompt into ChatGPT / Gemini / Claude, then paste back the JSON:</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(aiMeta.promptPreview || '')}
                          className="underline hover:text-white text-[#818cf8]"
                        >
                          Copy Prompt
                        </button>
                      </div>
                      <pre className="text-[10px] text-[#a1a1aa] max-h-28 overflow-y-auto whitespace-pre-wrap font-mono bg-[#121215] rounded-lg p-2">
                        {aiMeta.promptPreview}
                      </pre>
                    </div>
                  )}
                  <textarea
                    rows={3}
                    value={manualJsonInput}
                    onChange={(e) => setManualJsonInput(e.target.value)}
                    placeholder={'Paste JSON response: {"summary":"...","suggestions":[{"title":"...","startSec":0,"endSec":20,"hook":"...","caption":"...","hashtags":["#clip"],"seoKeywords":["clip"],"reason":"..."}]}'}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleImportManualSuggestions}
                    disabled={!manualJsonInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-[#6366f1] disabled:opacity-50 text-white text-xs font-bold"
                  >
                    Import AI Response
                  </button>
                </>
              )}
            </div>

            {/* ── AI Recommendation Cards ── */}
            {aiSuggestions.length > 0 && (
              <div className="p-3 rounded-xl bg-[#10b981]/5 border border-[#10b981]/20 space-y-3">
                {/* Header with source badge */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#10b981] uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Clip Recommendations ({aiSuggestions.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Source type badge — clearly distinguished */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        aiMeta?.source === 'llm_generated'
                          ? 'bg-[#6366f1] text-white'
                          : aiMeta?.source === 'manual_imported'
                          ? 'bg-[#f59e0b] text-black'
                          : 'bg-white/[0.08] text-[#a1a1aa]'
                      }`}
                    >
                      {aiMeta?.source === 'llm_generated'
                        ? '⚡ LLM-Generated'
                        : aiMeta?.source === 'manual_imported'
                        ? '📋 Manual AI Import'
                        : '🔍 Rule-Based (Local)'}
                    </span>
                    {/* Raw JSON toggle */}
                    <button
                      type="button"
                      onClick={() => setShowRawJson((p) => !p)}
                      className="text-[10px] text-[#71717a] hover:text-white underline"
                    >
                      {showRawJson ? 'Cards' : 'Raw JSON'}
                    </button>
                  </div>
                </div>

                {/* Rule-based disclaimer */}
                {(aiMeta?.source === 'rule_based' || !aiMeta?.source) && (
                  <div className="text-[10px] text-[#71717a] bg-black/30 rounded-lg px-2.5 py-1.5">
                    These suggestions were generated by local rule-based heuristics applied to your Whisper transcript.
                    They are <strong className="text-[#a1a1aa]">not LLM-generated</strong>. For genuine AI recommendations,
                    use the <strong className="text-[#818cf8]">Manual AI Prompt</strong> workflow above.
                  </div>
                )}

                {showRawJson ? (
                  <pre className="text-[10px] text-[#a1a1aa] overflow-x-auto whitespace-pre-wrap font-mono max-h-56 bg-black/40 rounded-lg p-2">
                    {JSON.stringify(aiSuggestions, null, 2)}
                  </pre>
                ) : (
                  <div className="space-y-2">
                    {aiSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-[#09090b] p-3 rounded-xl border border-white/[0.06] space-y-2 text-xs"
                      >
                        {/* Title + timestamps + Add button */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-semibold">{s.title}</div>
                            <div className="text-[10px] text-[#818cf8] font-mono mt-0.5">
                              {s.startSec.toFixed(1)}s → {s.endSec.toFixed(1)}s
                              &nbsp;·&nbsp;{(s.endSec - s.startSec).toFixed(1)}s
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addClip(s.startSec, s.endSec, s.title.slice(0, 40))}
                            className="px-2.5 py-1 rounded-md bg-[#10b981] hover:bg-[#059669] text-black font-bold text-[11px] shrink-0 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Clip
                          </button>
                        </div>

                        {/* Hook */}
                        {s.hook && (
                          <div className="text-[11px] text-[#e4e4e7] bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                            <span className="text-[#71717a] mr-1">🎣 Hook:</span>
                            {s.hook}
                          </div>
                        )}

                        {/* Caption */}
                        {s.caption && (
                          <div className="text-[11px] text-[#a1a1aa]">
                            <span className="text-[#71717a] mr-1">📝 Caption:</span>
                            {s.caption}
                          </div>
                        )}

                        {/* Hashtags + SEO keywords */}
                        {(s.hashtags?.length || s.seoKeywords?.length) ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {s.hashtags?.map((h, hi) => (
                              <span key={hi} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#6366f1]/10 text-[#a5b4fc] text-[10px] font-mono">
                                <Hash className="w-2.5 h-2.5" />{h.replace('#', '')}
                              </span>
                            ))}
                            {s.seoKeywords?.map((k, ki) => (
                              <span key={ki} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981] text-[10px] font-mono">
                                <Tag className="w-2.5 h-2.5" />{k}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {/* Reason */}
                        {s.reason && (
                          <div className="text-[10px] text-[#52525b] flex items-start gap-1">
                            <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                            {s.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── No suggestions yet nudge ── */}
            {aiSuggestions.length === 0 && session.transcript?.segments && session.transcript.segments.length > 0 && (
              <div className="text-[11px] text-[#52525b] border border-dashed border-white/[0.08] rounded-xl px-3 py-2 text-center">
                Click <strong className="text-[#10b981]">AI Suggest Moments</strong> to auto-detect clip-worthy segments from your transcript.
              </div>
            )}

            {session.transcript?.segments && session.transcript.segments.length > 0 ? (
              <div className="flex-1 max-h-[260px] overflow-y-auto space-y-2 pr-1">
                {session.transcript.segments.map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => addClip(seg.start, seg.end, `Clip ${clips.length + 1}`)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#09090b] hover:bg-white/[0.04] border border-white/[0.06] text-xs transition-colors"
                  >
                    <span className="text-[#818cf8] font-mono mr-2">
                      [{seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s]
                    </span>
                    <span className="text-[#e4e4e7]">{seg.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px] border border-dashed border-white/[0.08] rounded-xl px-4 py-6 space-y-2">
                <FileText className="w-6 h-6 text-[#52525b]" />
                <div className="text-xs font-semibold text-[#71717a]">No transcript yet</div>
                <p className="text-[11px] text-[#52525b] max-w-xs">
                  Click <span className="text-[#818cf8]">&ldquo;Generate Transcript&rdquo;</span> to run Whisper locally.
                  For short clips (&lt; 15 s) or non-speech video, Whisper may return no segments — add timestamps manually using the Clips Queue below.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Row: Clip Builder */}
        <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Clips Queue ({clips.length})</h2>
            <button
              type="button"
              onClick={() => addClip(0, 5)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Clip</span>
            </button>
          </div>

          {clips.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#71717a] border border-dashed border-white/[0.08] rounded-xl">
              Click &ldquo;Add Clip&rdquo; or click any transcript segment above to create a clip.
            </div>
          ) : (
            <div className="space-y-4">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="p-4 rounded-xl bg-[#09090b] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
                >
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={clip.title}
                        onChange={(e) => updateClip(clip.id, { title: e.target.value })}
                        className="flex-1 bg-[#121215] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                      />
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.06] text-[#a1a1aa] uppercase">
                        {clip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[#71717a] block mb-1">Start (sec)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={clip.startSec}
                          onChange={(e) => updateClip(clip.id, { startSec: Number(e.target.value) })}
                          className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717a] block mb-1">End (sec)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={clip.endSec}
                          onChange={(e) => updateClip(clip.id, { endSec: Number(e.target.value) })}
                          className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717a] block mb-1">Duration</label>
                        <div className="px-2.5 py-1.5 rounded-lg bg-[#121215] border border-white/[0.06] text-[#10b981] font-mono">
                          {clip.durationSec.toFixed(1)}s
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[#71717a] block mb-1">9:16 Crop</label>
                        <select
                          value={clip.cropMode}
                          onChange={(e) => updateClip(clip.id, { cropMode: e.target.value as 'center' | 'manual' })}
                          className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-2 py-1.5 text-white"
                        >
                          <option value="center">Center Crop</option>
                          <option value="manual">Manual Offset</option>
                        </select>
                      </div>

                      {clip.cropMode === 'manual' && (
                        <div>
                          <label className="text-[10px] text-[#71717a] block mb-1">
                            Offset ({Math.round(clip.cropOffsetRatio * 100)}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={clip.cropOffsetRatio}
                            onChange={(e) => updateClip(clip.id, { cropOffsetRatio: Number(e.target.value) })}
                            className="w-full accent-[#6366f1]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] text-[#71717a] block mb-1">Subtitles</label>
                        <select
                          value={clip.subtitleStyle.enabled ? clip.subtitleStyle.position : 'off'}
                          onChange={(e) =>
                            updateClip(clip.id, {
                              subtitleStyle: {
                                ...clip.subtitleStyle,
                                enabled: e.target.value !== 'off',
                                position: (e.target.value === 'off' ? 'bottom' : e.target.value) as any,
                              },
                            })
                          }
                          className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-2 py-1.5 text-white"
                        >
                          <option value="bottom">Bottom</option>
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="off">Disabled</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#71717a] block mb-1">Subtitle Size & Color</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="12"
                            max="36"
                            value={clip.subtitleStyle.fontSize}
                            onChange={(e) =>
                              updateClip(clip.id, {
                                subtitleStyle: { ...clip.subtitleStyle, fontSize: Number(e.target.value) },
                              })
                            }
                            className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-2 py-1.5 text-white font-mono"
                          />
                          <input
                            type="color"
                            aria-label="Subtitle color"
                            value={clip.subtitleStyle.primaryColor || '#FFFFFF'}
                            onChange={(e) =>
                              updateClip(clip.id, {
                                subtitleStyle: { ...clip.subtitleStyle, primaryColor: e.target.value },
                              })
                            }
                            className="h-8 w-9 shrink-0 cursor-pointer rounded-lg border border-white/[0.08] bg-[#121215] p-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={clip.brandText || ''}
                        onChange={(e) => updateClip(clip.id, { brandText: e.target.value })}
                        placeholder="Optional brand watermark text..."
                        className="bg-[#121215] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <select
                        value={clip.logoAssetId || ''}
                        onChange={(e) => updateClip(clip.id, { logoAssetId: e.target.value })}
                        className="bg-[#121215] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white"
                      >
                        <option value="">No Brand Logo Overlay</option>
                        {logoAssets.map((l) => (
                          <option key={l._id} value={l._id}>
                            Logo: {l.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleGenerate(clip.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        <span>{clip.status === 'ready' ? 'Regenerate Clip' : 'Generate Clip'}</span>
                      </button>

                      {clip.outputAssetId && (
                        <a
                          href={`/api/assets/${clip.outputAssetId}/media?download=1`}
                          className="px-3 py-1.5 rounded-lg bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download MP4</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setClips(clips.filter((c) => c.id !== clip.id))}
                        className="ml-auto p-1.5 rounded-lg text-[#71717a] hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Clip Preview Column */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    {clip.outputAssetId ? (
                      <video
                        src={`/api/assets/${clip.outputAssetId}/media`}
                        poster={clip.thumbnailAssetId ? `/api/assets/${clip.thumbnailAssetId}/media` : undefined}
                        controls
                        className="w-[180px] h-[320px] rounded-xl bg-black border border-white/[0.12] object-cover"
                      />
                    ) : (
                      <div className="w-[180px] h-[320px] rounded-xl border border-dashed border-white/[0.1] flex flex-col items-center justify-center text-[11px] text-[#52525b] text-center p-4">
                        <Scissors className="w-5 h-5 mb-2" />
                        <span>1080×1920 preview will appear after generation</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Row: Real-Time Background Job Queue */}
        <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-white">Background Job Queue</span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#a1a1aa]">Queued: {queuedCount}</span>
              <span className="text-[#10b981] inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed: {completedCount}
              </span>
              <span className="text-red-400">Failed: {failedCount}</span>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-xs text-[#71717a] py-3">No background jobs triggered for this project yet.</div>
          ) : (
            <div className="space-y-2">
              {jobs.map((j) => (
                <div
                  key={j._id}
                  className="p-3 rounded-xl bg-[#09090b] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white font-mono">
                      {j.type} • <span className="text-[#818cf8]">{j.status}</span> ({j.progress}%)
                    </div>
                    <div className="text-[11px] text-[#71717a]">
                      {j.error?.message || j.currentStage}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {['QUEUED', 'PROCESSING', 'RETRY_SCHEDULED', 'SCHEDULED'].includes(j.status) && (
                      <button
                        type="button"
                        onClick={() => handleJobAction(j._id, 'cancel')}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Cancel
                      </button>
                    )}
                    {['FAILED', 'CANCELLED'].includes(j.status) && (
                      <button
                        type="button"
                        onClick={() => handleJobAction(j._id, 'retry')}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-[11px] font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

