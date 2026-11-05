import React, { useEffect, useState, useRef } from 'react';

export const InteractiveBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isHovering) setIsHovering(true);
    };

    const handlePointerLeave = () => {
      setIsHovering(false);
    };

    // Smooth lerp update for buttery 60fps cursor follower
    const updateMotion = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      setMousePos({ x: Math.round(currentX), y: Math.round(currentY) });
      animationFrameId = requestAnimationFrame(updateMotion);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    animationFrameId = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-20 select-none"
    >
      {/* BASE DEEPEST LAYER: Clean light tone with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50" />

      {/* TECHNICAL GRID LAYER (Deepest layer graph paper / engineering grid) */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* SECONDARY FINER SUB-GRID FOR HIGH-END TECHNICAL PRECISION */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '12px 12px',
        }}
      />

      {/* INTERACTIVE MOUSE SPOTLIGHT LAYER (Follows cursor across the grid) */}
      {mousePos && (
        <>
          {/* Broad subtle radial ambient illumination */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isHovering ? 1 : 0.4,
              background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.09), rgba(56, 189, 248, 0.04) 40%, transparent 75%)`,
            }}
          />

          {/* Focused interactive grid spotlight highlighting the grid cells near cursor */}
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: isHovering ? 0.9 : 0.2,
              background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.14), transparent 80%)`,
              maskImage: `
                radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)
              `,
              WebkitMaskImage: `
                radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)
              `,
            }}
          />

          {/* Micro cursor center aura */}
          <div
            className="absolute w-40 h-40 rounded-full blur-2xl transition-transform duration-75"
            style={{
              left: `${mousePos.x - 80}px`,
              top: `${mousePos.y - 80}px`,
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.22) 0%, transparent 70%)',
              opacity: isHovering ? 1 : 0,
            }}
          />
        </>
      )}

      {/* TOP AMBIENT SOFT LIGHTS */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

