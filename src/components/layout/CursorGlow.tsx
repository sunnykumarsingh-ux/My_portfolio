import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const visible = useRef(false);
  const rafId = useRef(0);
  const current = useRef({ x: -200, y: -200 });

  const { theme } = useTheme();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible.current && glowRef.current) {
        glowRef.current.style.opacity = "1";
        visible.current = true;
      }
    };

    const onLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
        visible.current = false;
      }
    };

    const animate = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.15;
      current.current.y += (pos.current.y - current.current.y) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const gradient =
    theme === "dark"
      ? "radial-gradient(circle, rgba(145,94,255,0.15) 0%, rgba(145,94,255,0.06) 30%, transparent 70%)"
      : "radial-gradient(circle, rgba(109,40,217,0.10) 0%, rgba(109,40,217,0.04) 30%, transparent 70%)";

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 500,
        height: 500,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        background: gradient,
        transition: "opacity 0.3s ease, background 0.3s ease",
        willChange: "transform",
      }}
    />
  );
};

export default CursorGlow;
