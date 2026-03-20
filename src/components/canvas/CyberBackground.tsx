import { useEffect, useRef } from "react";

const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Binary rain columns
    const columns = Math.floor(canvas.width / 15);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "01ABCDEF";

    // Floating locks with neon glow
    const locks = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 15 + Math.random() * 25,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: 0.4 + Math.random() * 0.4,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Particles
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Connection lines between locks
    const drawConnections = () => {
      for (let i = 0; i < locks.length; i++) {
        for (let j = i + 1; j < locks.length; j++) {
          const dx = locks[i].x - locks[j].x;
          const dy = locks[i].y - locks[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 300) {
            const opacity = (1 - distance / 300) * 0.3;
            const gradient = ctx.createLinearGradient(
              locks[i].x, locks[i].y, locks[j].x, locks[j].y
            );
            gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(145, 94, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(locks[i].x, locks[i].y);
            ctx.lineTo(locks[j].x, locks[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Draw lock icon with neon glow
    const drawLock = (x: number, y: number, size: number, baseOpacity: number, pulse: number) => {
      const opacity = baseOpacity + Math.sin(pulse) * 0.2;
      
      ctx.save();
      ctx.translate(x, y);
      
      // Neon glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(0, 255, 255, ${opacity})`;
      
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
      ctx.lineWidth = 2;

      // Lock body
      ctx.fillRect(-size / 2, 0, size, size * 0.8);
      ctx.strokeRect(-size / 2, 0, size, size * 0.8);

      // Lock shackle
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.35, Math.PI, 0);
      ctx.stroke();

      // Keyhole with glow
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(145, 94, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(0, size * 0.4, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw particles
    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#00ffff";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      
      // Create gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, "#050814");
      bgGradient.addColorStop(0.3, "#0a0f2e");
      bgGradient.addColorStop(0.7, "#0d1428");
      bgGradient.addColorStop(1, "#050814");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw binary rain
      ctx.font = "12px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * 15;
        
        // Gradient opacity based on position
        const fadeGradient = ctx.createLinearGradient(0, y - 20, 0, y);
        fadeGradient.addColorStop(0, "rgba(0, 255, 150, 0)");
        fadeGradient.addColorStop(1, `rgba(0, 255, 150, ${Math.random() * 0.6 + 0.2})`);
        
        ctx.fillStyle = fadeGradient;
        ctx.fillText(char, i * 15, y);

        if (y > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      drawParticles();

      // Update and draw locks
      locks.forEach((lock) => {
        lock.x += lock.speedX;
        lock.y += lock.speedY;
        lock.pulse += lock.pulseSpeed;

        // Bounce off edges
        if (lock.x < 0 || lock.x > canvas.width) lock.speedX *= -1;
        if (lock.y < 0 || lock.y > canvas.height) lock.speedY *= -1;

        drawLock(lock.x, lock.y, lock.size, lock.opacity, lock.pulse);
      });

      drawConnections();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
};

export default CyberBackground;
