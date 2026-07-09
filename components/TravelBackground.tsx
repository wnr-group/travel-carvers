'use client';

import { useEffect, useRef } from 'react';

export default function TravelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create twinkling stars
    const stars: { x: number; y: number; size: number; alpha: number; twinkleSpeed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.twinkleSpeed *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Dark navy to purple gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900" />

      {/* Subtle lighter gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-slate-900/60" />

      {/* Twinkling stars canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle nebula effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />

      {/* Seven Wonders Textures - Scattered across background */}
      <div className="absolute inset-0 overflow-hidden opacity-8">
        {/* Great Wall of China */}
        <div className="absolute top-10 left-5 text-8xl opacity-60 blur-sm">🏯</div>

        {/* Taj Mahal */}
        <div className="absolute top-32 right-10 text-9xl opacity-50 blur-sm">🕌</div>

        {/* Colosseum */}
        <div className="absolute bottom-20 left-16 text-8xl opacity-60 blur-sm">🏛️</div>

        {/* Christ the Redeemer */}
        <div className="absolute top-1/2 left-10 text-7xl opacity-50 blur-sm">⛪</div>

        {/* Petra */}
        <div className="absolute bottom-40 right-20 text-8xl opacity-55 blur-sm">🏜️</div>

        {/* Machu Picchu */}
        <div className="absolute top-1/3 right-24 text-7xl opacity-50 blur-sm">⛰️</div>

        {/* Chichen Itza */}
        <div className="absolute bottom-1/3 left-1/4 text-8xl opacity-55 blur-sm">🗿</div>

        {/* Additional decorative elements */}
        <div className="absolute top-3/4 right-1/3 text-6xl opacity-40 blur-sm">🌍</div>
        <div className="absolute top-1/4 left-1/2 text-5xl opacity-45 blur-sm">✈️</div>
      </div>

      {/* Floating travel elements in subtle colors */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 text-purple-300 text-6xl">✈</div>
        <div className="absolute top-40 right-20 text-indigo-300 text-5xl">🧭</div>
        <div className="absolute bottom-32 left-20 text-slate-300 text-5xl">🗺</div>
        <div className="absolute bottom-20 right-32 text-purple-400 text-4xl">📍</div>
        <div className="absolute top-1/2 right-10 text-indigo-400 text-5xl">⛰</div>
      </div>
    </div>
  );
}
