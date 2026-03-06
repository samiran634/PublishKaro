/* ── Global styles injected at runtime ── */
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Sans+3:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --deep:#0a0f1e; --navy:#111827; --panel:#0f1729; --card:#131d31;
    --teal:#0ea5e9; --gold:#f59e0b; --green:#4ade80;
    --muted:#64748b; --border:rgba(14,165,233,0.18); --border-soft:rgba(255,255,255,0.07);
  }

  * { box-sizing:border-box; margin:0; padding:0; }

  body { font-family:'Source Sans 3',sans-serif; background:var(--deep); color:#e2e8f0; }

  .star { position:absolute; border-radius:50%; background:#fff; animation:twinkle var(--dur,3s) ease-in-out infinite var(--delay,0s); }
  @keyframes twinkle { 0%,100%{opacity:.07;} 50%{opacity:.5;} }

  .status-dot { animation:blink 1.5s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.2;} }

  .a-dot-g { animation:blink 2s ease-in-out infinite; }
  .a-dot-t { animation:blink 2s ease-in-out infinite 0.5s; }
  .a-dot-o { animation:blink 2s ease-in-out infinite 1s; }

  @keyframes cardIn  { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
  @keyframes tCardIn { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  .doc-card { animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .doc-card:hover { border-color:rgba(14,165,233,0.35)!important; box-shadow:0 6px 24px rgba(0,0,0,0.4)!important; transform:translateY(-2px); }

  .tracker-card { animation: tCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
  .tracker-card:hover { border-color:rgba(14,165,233,0.35)!important; box-shadow:0 8px 28px rgba(0,0,0,0.45)!important; transform:translateY(-2px); }

  .fd1{animation:fadeUp .5s cubic-bezier(0.22,1,0.36,1) .05s both;}
  .fd2{animation:fadeUp .5s cubic-bezier(0.22,1,0.36,1) .12s both;}
  .fd3{animation:fadeUp .5s cubic-bezier(0.22,1,0.36,1) .2s  both;}

  .action-btn::after {
    content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
    transition:left .55s; pointer-events:none;
  }
  .action-btn:hover::after { left:140%; }
  .btn-upload:hover { transform:translateY(-3px)!important; box-shadow:0 16px 48px rgba(14,165,233,0.28)!important; border-color:rgba(14,165,233,0.65)!important; }
  .btn-track:hover  { transform:translateY(-3px)!important; box-shadow:0 16px 48px rgba(245,158,11,0.22)!important;  border-color:rgba(245,158,11,0.6)!important; }

  .btn-signout:hover { border-color:rgba(248,113,113,0.4)!important; color:#f87171!important; }
  .btn-close:hover   { border-color:rgba(14,165,233,0.4)!important; color:#7dd3fc!important; }

  .tracker-body::-webkit-scrollbar { width:4px; }
  .tracker-body::-webkit-scrollbar-track { background:transparent; }
  .tracker-body::-webkit-scrollbar-thumb { background:rgba(14,165,233,0.2); border-radius:2px; }
`;

/* ── Types ── */
export interface Paper {
  title: string;
  authors: string;
  venue: string;
  status: 'review' | 'accepted' | 'submit' | 'revision';
  statusLabel: string;
  progress: number;
  icon: string;
}

export interface StatusConfig {
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  fillStart: string;
  fillEnd: string;
}

/* ── Dummy paper data ── */
export const PAPERS: Paper[] = [
  { title: "Neural Architectures for Low-Resource NLP Tasks", authors: "Sharma et al.", venue: "ACL 2025", status: "review", statusLabel: "Under Review", progress: 60, icon: "📄" },
  { title: "Quantum-Classical Hybrid Optimization in Drug Discovery", authors: "Patel, Singh", venue: "Nature Comp. Sci.", status: "accepted", statusLabel: "Accepted", progress: 100, icon: "🧬" },
  { title: "Federated Learning with Differential Privacy Guarantees", authors: "Kim et al.", venue: "NeurIPS 2025", status: "submit", statusLabel: "Submitted", progress: 40, icon: "🔐" },
  { title: "Climate Modeling via Transformer-Based Spatiotemporal Networks", authors: "Gupta, Chen", venue: "ICML 2025", status: "revision", statusLabel: "Revision Req.", progress: 75, icon: "🌍" },
  { title: "Robustness of Vision-Language Models Under Distribution Shift", authors: "Mehta et al.", venue: "CVPR 2025", status: "review", statusLabel: "Under Review", progress: 55, icon: "👁️" },
  { title: "Explainable AI for Clinical Decision Support Systems", authors: "Rao, Williams", venue: "Lancet Digital", status: "submit", statusLabel: "Submitted", progress: 30, icon: "🏥" },
  { title: "Graph Neural Networks for Protein Interaction Prediction", authors: "Zhao et al.", venue: "Bioinformatics", status: "accepted", statusLabel: "Accepted", progress: 100, icon: "🔬" },
  { title: "Self-Supervised Contrastive Learning for Satellite Imagery", authors: "Nair, López", venue: "IGARSS 2025", status: "review", statusLabel: "Under Review", progress: 65, icon: "🛰️" },
];

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  review: { badgeBg: "rgba(245,158,11,0.12)", badgeColor: "#fcd34d", badgeBorder: "rgba(245,158,11,0.22)", fillStart: "#f59e0b", fillEnd: "#fbbf24" },
  accepted: { badgeBg: "rgba(74,222,128,0.1)", badgeColor: "#86efac", badgeBorder: "rgba(74,222,128,0.2)", fillStart: "#4ade80", fillEnd: "#86efac" },
  submit: { badgeBg: "rgba(14,165,233,0.1)", badgeColor: "#7dd3fc", badgeBorder: "rgba(14,165,233,0.2)", fillStart: "#0ea5e9", fillEnd: "#38bdf8" },
  revision: { badgeBg: "rgba(248,113,113,0.1)", badgeColor: "#fca5a5", badgeBorder: "rgba(248,113,113,0.2)", fillStart: "#f87171", fillEnd: "#fca5a5" },
};