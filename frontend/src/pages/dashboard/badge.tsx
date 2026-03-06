/* ── Status Badge (small inline) ── */
function Badge({ paper }) {
  const sc = STATUS_CONFIG[paper.status];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:"0.3rem",
      fontFamily:"'JetBrains Mono',monospace", fontSize:"0.56rem", letterSpacing:"0.08em", textTransform:"uppercase",
      padding:"0.15rem 0.45rem", borderRadius:20,
      background:sc.badgeBg, color:sc.badgeColor, border:`1px solid ${sc.badgeBorder}`
    }}>
      <span style={{ width:4, height:4, borderRadius:"50%", background:"currentColor", display:"inline-block" }}/>
      {paper.statusLabel}
    </span>
  );
}