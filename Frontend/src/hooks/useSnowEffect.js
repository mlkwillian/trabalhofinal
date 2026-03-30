import { useEffect } from "react";

export const useSnowEffect = (canvasRef, active) => {
  

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    let animId = null;
    let running = true;

    const spawn = () => ({
      x: Math.random() * canvas.width, y: -10,
      r: Math.random() * 2.8 + 0.8,
      speed: Math.random() * 0.9 + 0.3,
      drift: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.03,
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (active && Math.random() < 0.3) particles.push(spawn());
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speed; p.x += p.drift; p.spin += p.spinSpeed;
        if (p.y > canvas.height + 10) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        if (p.r > 1.8) {
          ctx.strokeStyle = "#bae6fd"; ctx.lineWidth = 0.6;
          for (let a = 0; a < 6; a++) {
            ctx.save(); ctx.rotate(a * Math.PI / 3);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -p.r * 2.8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -p.r * 1.2); ctx.lineTo(-p.r * 0.7, -p.r * 1.8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -p.r * 1.2); ctx.lineTo(p.r * 0.7, -p.r * 1.8); ctx.stroke();
            ctx.restore();
          }
        } else {
          ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "#bae6fd"; ctx.fill();
        }
        ctx.restore();
      }
      if (running || particles.length > 0) animId = requestAnimationFrame(draw);
    };

    if (active) draw();
    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, canvasRef]);
};
