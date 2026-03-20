import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    const columns = Math.floor(canvas.width / (isDark ? 15 : 20));
    const drops: number[] = new Array(columns).fill(1);
    const chars = isDark ? "01ABCDEF" : "01";

    // Floating locks
    const locks = Array.from({ length: isDark ? 12 : 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: isDark ? 15 + Math.random() * 25 : 20 + Math.random() * 20,
      speedX: (Math.random() - 0.5) * (isDark ? 0.3 : 0.2),
      speedY: (Math.random() - 0.5) * (isDark ? 0.3 : 0.2),
      opacity: isDark ? 0.4 + Math.random() * 0.4 : 0.3 + Math.random() * 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Particles
    const particles = Array.from({ length: isDark ? 50 : 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (isDark ? 2 : 1.5) + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Circuit lines for light mode
    const circuits = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 50 + Math.random() * 100,
      angle: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1,
    }));

    // Connection lines between locks
    const drawConnections = () => {
      for (let i = 0; i < locks.length; i++) {
        for (let j = i + 1; j < locks.length; j++) {
          const dx = locks[i].x - locks[j].x;
          const dy = locks[i].y - locks[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < (isDark ? 300 : 250)) {
            const opacity = (1 - distance / (isDark ? 300 : 250)) * (isDark ? 0.3 : 0.15);
            
            if (isDark) {
              const gradient = ctx.createLinearGradient(
                locks[i].x, locks[i].y, locks[j].x, locks[j].y
              );
              gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(145, 94, 255, ${opacity})`);
              gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity})`);
              ctx.strokeStyle = gradient;
            } else {
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            }
            
            ctx.lineWidth = isDark ? 1 : 1.5;
            ctx.beginPath();
            ctx.moveTo(locks[i].x, locks[i].y);
            ctx.lineTo(locks[j].x, locks[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Draw lock icon
    const drawLock = (x: number, y: number, size: number, baseOpacity: number, pulse: number) => {
      const opacity = baseOpacity + Math.sin(pulse) * 0.2;
      
      ctx.save();
      ctx.translate(x, y);
      
      if (isDark) {
        // Dark mode - neon glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(0, 255, 255, ${opacity})`;
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
      } else {
        // Light mode - glassmorphism style
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(59, 130, 246, ${opacity * 0.5})`;
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.15})`;
      }
      
      ctx.lineWidth = 2;

      // Lock body
      ctx.fillRect(-size / 2, 0, size, size * 0.8);
      ctx.strokeRect(-size / 2, 0, size, size * 0.8);

      // Lock shackle
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.35, Math.PI, 0);
      ctx.stroke();

      // Keyhole
      ctx.shadowBlur = isDark ? 10 : 5;
      ctx.fillStyle = isDark ? `rgba(145, 94, 255, ${opacity})` : `rgba(37, 99, 235, ${opacity})`;
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
        ctx.fillStyle = isDark ? "#00ffff" : "#3b82f6";
        ctx.shadowBlur = isDark ? 5 : 3;
        ctx.shadowColor = isDark ? "#00ffff" : "#3b82f6";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // Draw circuit lines for light mode
    const drawCircuits = () => {
      if (!isDark) {
        circuits.forEach((circuit) => {
          ctx.save();
          ctx.strokeStyle = `rgba(59, 130, 246, 0.2)`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          
          const endX = circuit.x + Math.cos(circuit.angle) * circuit.length;
          const endY = circuit.y + Math.sin(circuit.angle) * circuit.length;
          
          ctx.beginPath();
          ctx.moveTo(circuit.x, circuit.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Moving dot on circuit
          const dotPos = (Date.now() / 1000 * circuit.speed) % 1;
          const dotX = circuit.x + Math.cos(circuit.angle) * circuit.length * dotPos;
          const dotY = circuit.y + Math.sin(circuit.angle) * circuit.length * dotPos;
          
          ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        });
      }
    };

    const animate = () => {
      // Background based on theme
      if (isDark) {
        // Dark theme - deep blue gradient
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#050814");
        bgGradient.addColorStop(0.3, "#0a0f2e");
        bgGradient.addColorStop(0.7, "#0d1428");
        bgGradient.addColorStop(1, "#050814");
        ctx.fillStyle = bgGradient;
      } else {
        // Light theme - clean white with subtle blue tint
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#f8fafc");
        bgGradient.addColorStop(0.5, "#f1f5f9");
        bgGradient.addColorStop(1, "#e2e8f0");
        ctx.fillStyle = bgGradient;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circuits (light mode only)
      drawCircuits();

      // Draw binary rain
      ctx.font = isDark ? "12px monospace" : "14px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * (isDark ? 15 : 20);
        
        const fadeGradient = ctx.createLinearGradient(0, y - 20, 0, y);
        fadeGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        
        if (isDark) {
          fadeGradient.addColorStop(1, `rgba(0, 255, 150, ${Math.random() * 0.6 + 0.2})`);
        } else {
          fadeGradient.addColorStop(1, `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})`);
        }
        
        ctx.fillStyle = fadeGradient;
        ctx.fillText(char, i * (isDark ? 15 : 20), y);

        if (y > canvas.height && Math.random() > (isDark ? 0.985 : 0.99)) {
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
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
};

export default CyberBackground;
