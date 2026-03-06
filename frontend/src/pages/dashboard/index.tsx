import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalStyles, PAPERS } from './essential';
import { Starfield } from './starfield';
import { AgentChip } from './agentClip';
import { DocCard } from './docCard';
import { TrackerCard } from './trackerCard';

export function DashboardPage() {
  const [trackerOpen, setTrackerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ height: '100vh', background: 'var(--deep)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <Starfield />

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      {/* Glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse,rgba(14,165,233,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-soft)',
        background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(14px)',
        flexShrink: 0, zIndex: 100, position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 36, height: 36, border: '1.5px solid var(--teal)', borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(14,165,233,0.22), inset 0 0 8px rgba(14,165,233,0.07)'
          }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 900, color: 'var(--teal)' }}>S</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 600, color: '#e2e8f0' }}>ScholarFlow</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>Autonomous Publishing</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--green)', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)',
            borderRadius: 20, padding: '0.2rem 0.55rem'
          }}>
            <span className="status-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' }} />
            Agents Online
          </div>
          {/* User chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.7rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-soft)', borderRadius: 20,
            fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', color: '#94a3b8'
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),#0369a1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.58rem', fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display',serif"
            }}>R</div>
            researcher_01
          </div>
          {/* Sign out */}
          <button className="btn-signout" onClick={() => navigate('/')} style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)', borderRadius: 3,
            padding: '0.3rem 0.65rem', cursor: 'pointer', transition: 'border-color .2s, color .2s'
          }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── SCENE ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* DOCUMENT BACKGROUND */}
        <div style={{
          position: 'absolute', inset: 0, padding: '1.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '0.85rem',
          alignContent: 'start', overflow: 'hidden',
          transition: 'filter 0.7s ease, opacity 0.7s ease',
          filter: trackerOpen ? 'blur(0px) brightness(1) saturate(1)' : 'blur(1.5px) brightness(0.55) saturate(0.7)',
          opacity: trackerOpen ? 1 : 0.75,
        }}>
          {PAPERS.map((p, i) => <DocCard key={i} paper={p} delay={i * 0.06} />)}
        </div>

        {/* FOREGROUND: two action buttons */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem', padding: '1.5rem',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: trackerOpen ? 0 : 1,
          transform: trackerOpen ? 'scale(0.94)' : 'scale(1)',
          pointerEvents: trackerOpen ? 'none' : 'auto',
        }}>
          {/* Greeting */}
          <div className="fd1" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.63rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.4rem' }}>// dashboard</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem,3.5vw,2.4rem)', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
              Good to have you back, <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Researcher.</span>
            </h1>
          </div>

          {/* Action buttons */}
          <div className="fd2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 560 }}>

            {/* UPLOAD */}
            <button className="action-btn btn-upload" style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '1.75rem 1.5rem', borderRadius: 4, cursor: 'pointer', textAlign: 'left',
              background: 'linear-gradient(140deg,#0f2744 0%,#0c1f3a 100%)',
              border: '1.5px solid rgba(14,165,233,0.35)',
              boxShadow: '0 8px 32px rgba(14,165,233,0.15), inset 0 0 30px rgba(14,165,233,0.04)',
              transition: 'transform .2s, box-shadow .25s'
            }}>
              <span style={{ fontSize: '1.8rem', marginBottom: '0.85rem' }}>📄</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.35rem' }}>// new submission</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.45rem' }}>Upload Research Paper</span>
              <span style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>Deploy agents to format, check compliance, and submit your manuscript to multiple journals automatically.</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Playfair Display',serif", fontSize: '0.82rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: 3, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff', boxShadow: '0 4px 14px rgba(14,165,233,0.3)' }}>
                Upload Paper →
              </span>
            </button>

            {/* TRACK */}
            <button className="action-btn btn-track" onClick={() => setTrackerOpen(true)} style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '1.75rem 1.5rem', borderRadius: 4, cursor: 'pointer', textAlign: 'left',
              background: 'linear-gradient(140deg,#1e1406 0%,#17110a 100%)',
              border: '1.5px solid rgba(245,158,11,0.3)',
              boxShadow: '0 8px 32px rgba(245,158,11,0.1), inset 0 0 30px rgba(245,158,11,0.03)',
              transition: 'transform .2s, box-shadow .25s'
            }}>
              <span style={{ fontSize: '1.8rem', marginBottom: '0.85rem' }}>📡</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.35rem' }}>// submissions</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.45rem' }}>Track Submissions</span>
              <span style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>Monitor real-time status of all your papers — review queues, acceptances, and revision requests.</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Playfair Display',serif", fontSize: '0.82rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: 3, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', boxShadow: '0 4px 14px rgba(245,158,11,0.25)' }}>
                View Tracker →
              </span>
            </button>

          </div>

          {/* Agent strip */}
          <div className="fd3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            <AgentChip label="Ingestion Agent" dotClass="a-dot-g" dotColor="var(--green)" glowColor="var(--green)" />
            <AgentChip label="Format Agent" dotClass="a-dot-t" dotColor="var(--teal)" glowColor="var(--teal)" />
            <AgentChip label="Submission Agent" dotClass="a-dot-o" dotColor="var(--gold)" glowColor="var(--gold)" />
            <AgentChip label="Revision Agent" dotClass="a-dot-g" dotColor="var(--green)" glowColor="var(--green)" />
          </div>
        </div>

        {/* ── TRACKER OVERLAY ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,15,30,0.82)', backdropFilter: 'blur(2px)',
          opacity: trackerOpen ? 1 : 0,
          pointerEvents: trackerOpen ? 'auto' : 'none',
          transition: 'opacity 0.6s ease',
          zIndex: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-soft)',
            background: 'rgba(10,15,30,0.7)', flexShrink: 0
          }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>// submission tracker</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9' }}>Your Research Papers</h2>
            </div>
            <button className="btn-close" onClick={() => setTrackerOpen(false)} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-soft)', borderRadius: 3,
              padding: '0.4rem 0.9rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem',
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer',
              transition: 'border-color .2s, color .2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              ← Back to Dashboard
            </button>
          </div>

          {/* Body */}
          <div className="tracker-body" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1rem' }}>
              {PAPERS.map((p, i) => <TrackerCard key={i} paper={p} delay={i * 0.06} />)}
            </div>
          </div>

          {/* Footer agents */}
          <div style={{
            padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border-soft)',
            background: 'rgba(10,15,30,0.6)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flexShrink: 0
          }}>
            <AgentChip label="Ingestion Agent" dotClass="a-dot-g" dotColor="var(--green)" glowColor="var(--green)" />
            <AgentChip label="Format & Compliance" dotClass="a-dot-t" dotColor="var(--teal)" glowColor="var(--teal)" />
            <AgentChip label="Multi-Journal Submission" dotClass="a-dot-o" dotColor="var(--gold)" glowColor="var(--gold)" />
            <AgentChip label="Revision Handler" dotClass="a-dot-g" dotColor="var(--green)" glowColor="var(--green)" />
            <AgentChip label="Notification Agent" dotClass="a-dot-t" dotColor="var(--teal)" glowColor="var(--teal)" />
          </div>
        </div>

      </div>{/* /scene */}
    </div>
  );
}
