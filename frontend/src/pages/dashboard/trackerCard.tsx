import type { Paper } from './essential';
import { STATUS_CONFIG } from './essential';
import { Badge } from './badge';

export function TrackerCard({ paper, delay }: { paper: Paper; delay: number }) {
  const sc = STATUS_CONFIG[paper.status];
  return (
    <div className="tracker-card" style={{
      background: 'var(--card)', border: '1px solid var(--border-soft)', borderRadius: 4,
      padding: '1.25rem', transition: 'border-color .25s, box-shadow .25s, transform .2s',
      animationDelay: `${delay}s`
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{paper.icon}</span>
        <Badge paper={paper} />
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.2rem', lineHeight: 1.3 }}>{paper.title}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.65rem' }}>{paper.authors}</div>
      {/* Progress bar */}
      <div style={{ marginBottom: '0.7rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
          <span>Pipeline Progress</span><span>{paper.progress}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 2, width: `${paper.progress}%`, background: `linear-gradient(90deg,${sc.fillStart},${sc.fillEnd})`, transition: 'width 1s ease' }} />
        </div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'var(--muted)' }}>{paper.venue}</div>
    </div>
  );
}