interface AgentChipProps {
  label: string;
  dotClass: string;
  dotColor: string;
  glowColor: string;
}

export function AgentChip({ label, dotClass, dotColor, glowColor }: AgentChipProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.06em', color: '#64748b',
      padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-soft)', borderRadius: 20
    }}>
      <span className={dotClass} style={{ width: 4, height: 4, borderRadius: '50%', background: dotColor, boxShadow: `0 0 5px ${glowColor}`, display: 'inline-block' }} />
      {label}
    </div>
  );
}