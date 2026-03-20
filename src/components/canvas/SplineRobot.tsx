import { useEffect, useRef } from "react";

const SplineRobot = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create spline-viewer element
    const splineViewer = document.createElement("spline-viewer");
    splineViewer.setAttribute(
      "url",
      "https://prod.spline.design/D4APYzN2QEc70veP/scene.splinecode"
    );
    splineViewer.style.width = "100%";
    splineViewer.style.height = "100%";

    container.appendChild(splineViewer);

    return () => {
      container.removeChild(splineViewer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default SplineRobot;
