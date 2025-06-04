
"use client";

import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / 20);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const characters = katakana + latin + nums;

    // Predefined colors for the matrix rain
    const colors = [
      '#00FF00', // Green
      '#00FFFF', // Cyan
      '#0000FF', // Blue
      '#FF00FF', // Magenta
      '#FFFF00', // Yellow
    ];

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(26, 28, 33, 0.05)'; // Slightly transparent dark background to create fading effect
      ctx.fillRect(0, 0, width, height);

      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          // Randomly select a color for a new drop
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Recalculate columns, but keep existing drops array length or reset
      // For simplicity, we can just let it adjust on next draw cycles, or reset columns if needed
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Ensure it's behind other content
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    />
  );
};

export default MatrixRain;
