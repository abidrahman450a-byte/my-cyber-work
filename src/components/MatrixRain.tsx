import React, { useEffect, useRef } from "react";

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set full screen size
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const columns = Math.floor(width / 18);
    const drops = Array(columns).fill(1);
    const charList = "01010101010101ABCDEF0123456789X%#$@&*^+-=~{}[]|<>?;:".split("");

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.09)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(0, 255, 102, 0.35)"; // Neon Green Matrix Letters
      ctx.font = "12px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = charList[Math.floor(Math.random() * charList.length)];
        const x = i * 18;
        const y = drops[i] * 12;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30 w-full h-full"
    />
  );
};
