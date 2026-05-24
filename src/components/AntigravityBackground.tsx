"use client";

import React, { useEffect, useRef } from 'react';

const COLORS = [
  "rgba(123, 110, 246, {a})", // Violet: #7B6EF6 (Primary)
  "rgba(94, 234, 212, {a})",  // Cyan: #5eead4 (Data/Geo)
  "rgba(123, 110, 246, {a})", // Violet
  "rgba(94, 234, 212, {a})"   // Cyan
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseOpacity: number;
}

interface Spacecraft {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  color: string;
  type: string;
  angle: number;
  rotationSpeed: number;
}

const SPACECRAFTS = [
  { label: "ISS (ZARYA)", speed: 0.1, type: "iss" },
  { label: "VOYAGER-1", speed: 0.05, type: "voyager" },
  { label: "CHANDRAYAAN-3", speed: 0.08, type: "chandrayaan" },
  { label: "JAMES WEBB", speed: 0.06, type: "jwst" }
];

export default function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const spacecraftsRef = useRef<Spacecraft[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const CONNECTION_DISTANCE = 150;
  const MOUSE_REPEL_RADIUS = 200;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by making canvas opaque if we draw background, but we need it transparent.
    if (!ctx) return;
    
    // Actually we need alpha: true for transparent overlay
    const ctxTransparent = canvas.getContext('2d');
    if (!ctxTransparent) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Adjust density based on screen size (fewer particles = cleaner look)
      const particleCount = Math.floor((width * height) / 12000);
      const particles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] || COLORS[0],
          baseOpacity: Math.random() * 0.5 + 0.1,
        });
      }
      particlesRef.current = particles;

      // Init Spacecrafts
      const spacecrafts: Spacecraft[] = SPACECRAFTS.map(sc => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() > 0.5 ? 1 : -1) * sc.speed,
        vy: (Math.random() - 0.5) * 0.05,
        label: sc.label,
        color: sc.type === 'iss' || sc.type === 'jwst' ? COLORS[0] : COLORS[1], // Mix Violet and Cyan
        type: sc.type,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      }));
      spacecraftsRef.current = spacecrafts;
    };

    const animate = () => {
      ctxTransparent.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse interaction (gentle repel)
        const dx = mx - p.x;
        const dy = my - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < MOUSE_REPEL_RADIUS) {
          const force = (MOUSE_REPEL_RADIUS - distToMouse) / MOUSE_REPEL_RADIUS;
          p.x -= (dx / distToMouse) * force * 2;
          p.y -= (dy / distToMouse) * force * 2;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            ctxTransparent.beginPath();
            ctxTransparent.strokeStyle = p.color.replace('{a}', opacity.toString());
            ctxTransparent.lineWidth = 0.5;
            ctxTransparent.moveTo(p.x, p.y);
            ctxTransparent.lineTo(p2.x, p2.y);
            ctxTransparent.stroke();
          }
        }

        // Draw particle
        ctxTransparent.beginPath();
        ctxTransparent.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctxTransparent.fillStyle = p.color.replace('{a}', p.baseOpacity.toString());
        ctxTransparent.fill();
      }

      // Draw Spacecrafts
      const spacecrafts = spacecraftsRef.current;
      for (let i = 0; i < spacecrafts.length; i++) {
        const sc = spacecrafts[i];
        
        sc.x += sc.vx;
        sc.y += sc.vy;

        // Wrap
        if (sc.x < -100) sc.x = width + 100;
        if (sc.x > width + 100) sc.x = -100;
        if (sc.y < -100) sc.y = height + 100;
        if (sc.y > height + 100) sc.y = -100;

        // Spacecraft Rotation Update
        sc.angle += sc.rotationSpeed;

        // Draw Tracker Box/Brackets
        ctxTransparent.strokeStyle = sc.color.replace('{a}', '0.4');
        ctxTransparent.lineWidth = 1;
        ctxTransparent.strokeRect(sc.x - 12, sc.y - 12, 24, 24);

        // Save context for rotation
        ctxTransparent.save();
        ctxTransparent.translate(sc.x, sc.y);
        ctxTransparent.rotate(sc.angle);
        ctxTransparent.strokeStyle = sc.color.replace('{a}', '0.8');
        ctxTransparent.fillStyle = sc.color.replace('{a}', '0.3');
        ctxTransparent.lineWidth = 1.5;
        ctxTransparent.beginPath();

        // Draw Blueprint Wireframes
        if (sc.type === "iss") {
          // Central truss
          ctxTransparent.moveTo(-15, 0); ctxTransparent.lineTo(15, 0);
          // Solar panels left
          ctxTransparent.strokeRect(-12, -8, 4, 16);
          ctxTransparent.strokeRect(-17, -8, 4, 16);
          // Solar panels right
          ctxTransparent.strokeRect(8, -8, 4, 16);
          ctxTransparent.strokeRect(13, -8, 4, 16);
          // Central modules
          ctxTransparent.strokeRect(-3, -3, 6, 6);
          ctxTransparent.strokeRect(-1, 3, 2, 5); // Radiator
        } else if (sc.type === "voyager") {
          // Antenna dish
          ctxTransparent.arc(0, -5, 6, Math.PI, 0);
          ctxTransparent.lineTo(0, 0);
          ctxTransparent.lineTo(-6, -5);
          // Main body decagon
          ctxTransparent.strokeRect(-3, 0, 6, 6);
          // RTG Boom
          ctxTransparent.moveTo(-3, 3); ctxTransparent.lineTo(-12, 10);
          // Magnetometer Boom
          ctxTransparent.moveTo(3, 3); ctxTransparent.lineTo(18, -2);
        } else if (sc.type === "chandrayaan") {
          // Lander body
          ctxTransparent.strokeRect(-5, -5, 10, 8);
          // 4 Legs
          ctxTransparent.moveTo(-5, 3); ctxTransparent.lineTo(-8, 8);
          ctxTransparent.moveTo(-3, 3); ctxTransparent.lineTo(-2, 8);
          ctxTransparent.moveTo(3, 3); ctxTransparent.lineTo(2, 8);
          ctxTransparent.moveTo(5, 3); ctxTransparent.lineTo(8, 8);
          // Solar panel
          ctxTransparent.strokeRect(-10, -3, 5, 4);
          ctxTransparent.strokeRect(5, -3, 5, 4);
        } else if (sc.type === "jwst") {
          // Sunshield (diamond)
          ctxTransparent.moveTo(0, 10); ctxTransparent.lineTo(15, 0);
          ctxTransparent.lineTo(0, -4); ctxTransparent.lineTo(-15, 0);
          ctxTransparent.closePath();
          // Primary Mirror (Hexagon approximation)
          ctxTransparent.moveTo(-4, -2); ctxTransparent.lineTo(4, -2);
          ctxTransparent.lineTo(6, -6); ctxTransparent.lineTo(4, -10);
          ctxTransparent.lineTo(-4, -10); ctxTransparent.lineTo(-6, -6);
          ctxTransparent.closePath();
        }

        ctxTransparent.stroke();
        ctxTransparent.fill();
        ctxTransparent.restore();

        // Draw Trail line
        ctxTransparent.beginPath();
        ctxTransparent.moveTo(sc.x, sc.y);
        ctxTransparent.lineTo(sc.x - (sc.vx * 200), sc.y - (sc.vy * 200));
        ctxTransparent.strokeStyle = sc.color.replace('{a}', '0.15');
        ctxTransparent.stroke();

        // Draw Label
        ctxTransparent.font = '8px "Geist Mono", monospace';
        ctxTransparent.fillStyle = sc.color.replace('{a}', '0.6');
        ctxTransparent.textAlign = "left";
        ctxTransparent.textBaseline = "middle";
        ctxTransparent.fillText(sc.label, sc.x + 16, sc.y - 8);
        
        // Draw coordinates
        ctxTransparent.font = '6px "Geist Mono", monospace';
        ctxTransparent.fillStyle = sc.color.replace('{a}', '0.4');
        ctxTransparent.fillText(`[ ${Math.floor(sc.x)}, ${Math.floor(sc.y)} ]`, sc.x + 16, sc.y);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      {/* Background base color with subtle noise gradient - STRICT VOID #030308 */}
      <div className="fixed inset-0 bg-[#030308] z-[-2]" />
      
      {/* Soft Nebula Glowing Orbs - Strictly using muted violet/cyan at very low opacity to avoid overwhelming */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7B6EF6]/[0.03] blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#5eead4]/[0.03] blur-[150px] mix-blend-screen" />
      </div>

      {/* Canvas for Quantum / Neural Mesh */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
      />
    </>
  );
}
