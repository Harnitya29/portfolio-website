"use client";

import React, { useEffect, useRef } from 'react';

// Particle colors: muted cyan, white, and dim green
const COLORS = [
  'rgba(167, 243, 208, {a})', // muted cyan/green-ish (tailwind emerald-200)
  'rgba(255, 255, 255, {a})', // white
  'rgba(52, 211, 153, {a})', // dim green (tailwind emerald-400)
];

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  speed: number;
}

export default function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const touchRef = useRef({ x: -1000, y: -1000 });
  
  // Repel configurations
  const REPEL_RADIUS = 150;
  const REPEL_FORCE = 0.5;
  const RETURN_SPEED = 0.05;
  const TARGET_FPS = 60;
  const FRAME_MIN_TIME = (1000 / 60) * (60 / TARGET_FPS) - (1000 / 60) * 0.5;

  let lastTime = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;

      // Base particle count calculated by screen area
      let particleCount = Math.floor((width * height) / 8000);
      
      // Halve particles on low-end devices
      if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        particleCount = Math.floor(particleCount / 2);
      }

      const particles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1; // 1px - 3px
        const o = Math.random() * 0.6 + 0.2; // 0.2 - 0.8
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: 0,
          vy: 0,
          radius,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] || COLORS[0],
          opacity: o,
          baseOpacity: o,
          speed: (Math.random() * 0.5 + 0.1) * (1 / radius), // Smaller ones move slightly faster
        });
      }
      
      particlesRef.current = particles;
    };

    const drawParticles = (time: number) => {
      if (!canvas || !ctx) return;
      
      // FPS Capping
      if (time - lastTime < FRAME_MIN_TIME) {
        animationRef.current = requestAnimationFrame(drawParticles);
        return;
      }
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const particles = particlesRef.current;
      
      // Use the closest interaction point (mouse or touch)
      let interactionX = -1000;
      let interactionY = -1000;

      if (touchRef.current.x !== -1000) {
        interactionX = touchRef.current.x;
        interactionY = touchRef.current.y;
      } else if (mouseRef.current.x !== -1000) {
        interactionX = mouseRef.current.x;
        interactionY = mouseRef.current.y;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;

        // Normal drifting motion (upwards with slight horizontal oscillation)
        p.baseY -= p.speed;
        p.baseX += Math.sin(time * 0.001 + i) * 0.3 * p.speed;

        // Reset if it goes off top
        if (p.baseY + p.radius < 0) {
          p.baseY = height + p.radius;
          p.baseX = Math.random() * width;
          p.x = p.baseX;
          p.y = p.baseY;
          p.vx = 0;
          p.vy = 0;
        }

        // Wrap horizontally
        if (p.baseX > width + p.radius) p.baseX = -p.radius;
        if (p.baseX < -p.radius) p.baseX = width + p.radius;

        // Antigravity / Repel logic
        const dx = interactionX - p.x;
        const dy = interactionY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS) {
          // Push away
          const angle = Math.atan2(dy, dx);
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx -= Math.cos(angle) * force * REPEL_FORCE;
          p.vy -= Math.sin(angle) * force * REPEL_FORCE;
        }

        // Drift back to base position
        p.vx += (p.baseX - p.x) * RETURN_SPEED;
        p.vy += (p.baseY - p.y) * RETURN_SPEED;

        // Apply velocities with dampening
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy *= 0.9;

        // Fade out near the top
        let currentOpacity = p.baseOpacity;
        if (p.y < height * 0.2) {
          currentOpacity = Math.max(0, p.baseOpacity * (p.y / (height * 0.2)));
        }
        
        // Render
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('{a}', currentOpacity.toString());
        ctx.fill();
        ctx.closePath();
      }

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    // Event Handlers
    const handleResize = () => initParticles();
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      touchRef.current = { x: -1000, y: -1000 }; // Prioritize mouse if used
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        touchRef.current = { x: touch.clientX, y: touch.clientY };
        mouseRef.current = { x: -1000, y: -1000 }; // Prioritize touch if used
      }
    };

    const handleTouchEnd = () => {
      touchRef.current = { x: -1000, y: -1000 };
    };

    // Bind events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // Initial setup
    initParticles();
    animationRef.current = requestAnimationFrame(drawParticles);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform'
      }}
      aria-hidden="true"
    />
  );
}
