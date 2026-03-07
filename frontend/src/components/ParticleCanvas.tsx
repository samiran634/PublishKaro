import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

export function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: -9999, y: -9999 });
    const animFrame = useRef<number>(0);

    const COLORS = ['#7c6ef7', '#a78bfa', '#38bdf8', '#818cf8', '#c084fc', '#e0d9ff'];

    const spawnParticles = useCallback((x: number, y: number) => {
        const count = 3;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 1.2;
            const maxLife = 60 + Math.random() * 80;
            particles.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife,
                size: 1.5 + Math.random() * 2.5,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
        }
        if (particles.current.length > 400) {
            particles.current.splice(0, particles.current.length - 400);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const onMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            spawnParticles(e.clientX, e.clientY);
        };
        window.addEventListener('mousemove', onMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current = particles.current.filter(p => p.life > 0);

            for (const p of particles.current) {
                const alpha = (p.life / p.maxLife) * 0.75;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.97;
                p.vy *= 0.97;
                p.vy -= 0.015;
                p.life -= 1;
            }

            animFrame.current = requestAnimationFrame(draw);
        };
        animFrame.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animFrame.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
        };
    }, [spawnParticles]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
