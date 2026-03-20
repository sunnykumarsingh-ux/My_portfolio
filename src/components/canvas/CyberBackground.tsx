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
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "01";

    // Floating locks
    const locks = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 20 + Math.random() * 30,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0.3 + Math.random() * 0.4,
    }));

    // Connection lines between locks
    const drawConnections = () => {
      ctx.strokeStyle = "rgba(0, 150, 255, 0.15)";
      ctx.lineWidth = 1;

      for (let i = 0; i < locks.length; i++) {
        for (let j = i + 1; j < locks.length; j++) {
          const dx = locks[i].x - locks[j].x;
          const dy = locks[i].y - locks[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            ctx.beginPath();
            ctx.moveTo(locks[i].x, locks[i].y);
            ctx.lineTo(locks[j].x, locks[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Draw lock icon
    const drawLock = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = `rgba(0, 200, 255, ${opacity})`;
      ctx.fillStyle = `rgba(0, 150, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 2;

      // Lock body
      ctx.fillRect(-size / 2, 0, size, size * 0.8);
      ctx.strokeRect(-size / 2, 0, size, size * 0.8);

      // Lock shackle
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, Math.PI, 0);
      ctx.stroke();

      // Keyhole
      ctx.fillStyle = `rgba(0, 200, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(0, size * 0.4, size * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      // Semi-transparent clear for trail effect
      ctx.fillStyle = "rgba(10, 15, 30, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw binary rain
      ctx.fillStyle = "#0a0f1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const opacity = Math.random() * 0.5 + 0.2;
        ctx.fillStyle = `rgba(0, 255, 150, ${opacity})`;
        ctx.fillText(char, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Update and draw locks
      locks.forEach((lock) => {
        lock.x += lock.speedX;
        lock.y += lock.speedY;

        // Bounce off edges
        if (lock.x < 0 || lock.x > canvas.width) lock.speedX *= -1;
        if (lock.y < 0 || lock.y > canvas.height) lock.speedY *= -1;

        drawLock(lock.x, lock.y, lock.size, lock.opacity);
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
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #1a1f3e 50%, #0d1321 100%)" }}
    />
  );
};

export default CyberBackground;
