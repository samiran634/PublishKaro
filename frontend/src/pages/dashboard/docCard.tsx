/* ── Doc card (background layer) ── */
function DocCard({ paper, delay }) {
  return (
    <div className="doc-card" style={{
      background:"var(--card)", border:"1px solid var(--border-soft)", borderRadius:4,
      padding:"0.85rem", cursor:"pointer", transition:"border-color .25s, box-shadow .25s, transform .2s",
      animationDelay:`${delay}s`
    }}>
      <div style={{ fontSize:"1.4rem", marginBottom:"0.5rem" }}>{paper.icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.78rem", fontWeight:600, color:"#e2e8f0", marginBottom:"0.3rem", lineHeight:1.3 }}>{paper.title}</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"var(--muted)", marginBottom:"0.5rem" }}>{paper.authors}</div>
      <Badge paper={paper} />
    </div>
  );
}