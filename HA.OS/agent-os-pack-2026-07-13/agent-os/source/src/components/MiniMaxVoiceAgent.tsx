"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Mic, PhoneOff, Send, Loader2 } from "lucide-react";
import ConversationVisualizer from "@/components/visualizer/ConversationVisualizer";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";

// Simplified MiniMax voice agent for testing
export default function MiniMaxVoiceAgent({ accent = "#60a5fa" }: { accent?: string }) {
  const [active, setActive] = useState(false);
  const [stage, setStage] = useState<"idle" | "listening" | "speaking">("idle");
  const [typed, setTyped] = useState("");
  const [err, setErr] = useState("");
  // Stub: chat turns aren't wired up yet — keep an empty list so the empty state renders.
  const turns: { role: string; text: string }[] = [];
  const { audioData, isListening, isSpeaking } = useAudioAnalyzer();

  const activeRef = useRef(false);

  function setStageS(s: "idle" | "listening" | "speaking") { 
    setStage(s); 
  }

  useEffect(() => {
    // Privacy: end call when tab goes to background
    const onVis = () => { if (document.hidden && activeRef.current) endCall(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function pickMime(): string {
    const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
    for (const c of cands) { 
      try { 
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) 
          return c; 
      } catch { /* */ } 
    }
    return "";
  }

  async function startCall() {
    setErr("");
    let stream: MediaStream;
    try { 
      stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
    }
    catch { 
      setErr("Microphone blocked — click the 🎤 in your browser's address bar to Allow, or type below."); 
      return; 
    }
    activeRef.current = true; 
    setActive(true);
    beginListen();
  }

  function endCall() {
    activeRef.current = false; 
    setActive(false);
    // Cleanup would go here in full version
    setStageS("idle");
  }

  // Simplified audio processing - just use the hook data
  useEffect(() => {
    if (audioData && active) {
      // In a full implementation, this would drive the visualization
      // For now, we just note that audio is being processed
    }
  }, [audioData, active]);

  async function beginListen() {
    if (!activeRef.current) return;
    setErr("");
    setStageS("listening");
    // In full version: set up MediaRecorder, silence detection, etc.
    // For demo, simulate after 2 seconds
    setTimeout(() => {
      if (activeRef.current) {
        setStageS("speaking");
        setTimeout(() => {
          if (activeRef.current) {
            setStageS("listening");
          }
        }, 3000);
      }
    }, 2000);
  }

  function sendTyped() {
    const t = typed.trim();
    if (!t) return;
    setTyped("");
    // In full version: send to backend for processing
    setErr("Message sent: " + t);
    setStageS("speaking");
    setTimeout(() => {
      setStageS("listening");
    }, 2000);
  }

  const statusText =
    !active ? "Tap to start — then just talk (no Chrome speech needed)"
    : stage === "listening" ? "Listening… start speaking"
    : stage === "speaking" ? "MiniMax is speaking…"
    : "Your turn…";

  return (
    <div className="panel p-6 flex flex-col" style={{ height: "min(72vh, 760px)" }}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center w-9 h-9 rounded-xl" style={{ background: `${accent}2e`, color: accent }}><Mic size={17} /></div>
          <div>
            <div className="text-sm font-medium" style={{ color: accent }}>MiniMax Voice Agent</div>
            <div className="text-[11px] text-[var(--fg-dimmer)]">Your mic → MiniMax transcribes → M3 replies → MiniMax voice</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Voice selection would go here */}
        </div>
      </div>

      <div className="scroll flex-1 min-h-0 overflow-y-auto py-3 space-y-3">
        {/* Chat history would go here */}
        {turns.length === 0 && (
          <div className="h-full grid place-items-center text-center text-[var(--fg-dim)]">
            <div>
              <ConversationVisualizer mode="fluid" accent={accent} size={120} className="mx-auto mb-4" />
              <p className="text-sm">Tap the orb, allow the mic, and just talk.</p>
              <p className="text-[12px] text-[var(--fg-dimmer)] mt-1">It records, MiniMax transcribes & replies out loud. Pause when you finish a sentence.</p>
            </div>
          </div>
        )}
        {/* Messages would map here */}
      </div>

      <div className="pt-3 border-t border-[var(--panel-border)]">
        <div className="flex items-center justify-center mb-2.5">
          <button onClick={active ? endCall : startCall}
            className="mm-orb-btn" data-on={active ? "1" : "0"} data-s={stage} style={{ "--a": accent } as CSSProperties}
            title={active ? "Tap to end" : "Tap to start — then just talk"}>
            {active ? <PhoneOff size={22} /> : <Mic size={24} />}
          </button>
        </div>
        <div className="text-center text-[12.5px] mb-1" style={{ color: active ? "#34d399" : accent }}>
          {active && <span style={{ color: "#34d399" }}>● </span>}{statusText}
        </div>
        {err && <div className="text-center text-[11.5px] mb-2" style={{ color: "#f0a3b4" }}>{err}</div>}
        <div className="flex gap-2 items-end">
          <input value={typed} onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendTyped(); } }}
            placeholder="…or type to talk (works without a mic)"
            className="flex-1 bg-[rgba(0,0,0,0.25)] border rounded-xl px-3.5 py-2.5 text-[14px] outline-none"
            style={{ borderColor: "var(--panel-border)", color: "var(--fg)" }} />
          <button onClick={sendTyped} disabled={!typed.trim()}
            className="px-3.5 h-[44px] rounded-xl flex items-center gap-1.5 text-sm transition disabled:opacity-40"
            style={{ background: `${accent}24`, border: `1px solid ${accent}55`, color: accent }}><Send size={15} /></button>
        </div>
      </div>

      <style jsx>{`
        .mm-orb, .mm-orb-btn { width: 84px; height: 84px; border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--a) 60%, white), var(--a) 75%);
          box-shadow: 0 0 50px -8px var(--a); display: grid; place-items: center; color: #fff; border: none; cursor: pointer; transition: transform .15s; }
        .mm-orb { width: 64px; height: 64px; }
        .mm-orb-btn:hover { transform: scale(1.06); }
        .mm-orb-btn[data-s="listening"], .mm-orb[data-on="1"] { animation: mm-ring 1.6s infinite; }
        .mm-orb-btn[data-s="speaking"] { animation: mm-ring 0.7s infinite; }
        @keyframes mm-ring { 0%{box-shadow:0 0 0 0 color-mix(in srgb, var(--a) 50%, transparent)} 70%{box-shadow:0 0 0 22px transparent} 100%{box-shadow:0 0 0 0 transparent} }
      `}</style>
    </div>
  );
}