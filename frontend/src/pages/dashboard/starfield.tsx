/* ── Starfield ── */
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    for (let i = 0; i < 130; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const sz = Math.random() * 2 + 0.3;
      s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--dur:${2+Math.random()*5}s;--delay:${Math.random()*6}s;opacity:${0.07+Math.random()*0.35};`;
      c.appendChild(s);
    }
    return () => { c.innerHTML = ""; };
  }, []);
  return <div ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }} />;
}