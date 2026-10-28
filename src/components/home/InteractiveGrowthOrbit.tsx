'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Code2,
  Bot,
  TrendingUp,
  Palette,
  Zap,
  Shield,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallModal from '@/components/ScheduleCallModal';

interface OrbitalNode {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  glow: string;
  // Polar coordinates for initial layout
  angle: number; // in degrees
  distance: number; // in px
  size: 'sm' | 'md' | 'lg';
  delay: string;
}

const orbitalNodes: OrbitalNode[] = [
  {
    id: 'web-apps',
    label: 'Next.js & Apps',
    sub: 'Sub-800ms Velocity',
    icon: Code2,
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    angle: 320,
    distance: 175,
    size: 'lg',
    delay: '0s',
  },
  {
    id: 'ai-agents',
    label: 'AI Agents',
    sub: '75% Intake Auto',
    icon: Bot,
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.4)',
    angle: 45,
    distance: 180,
    size: 'lg',
    delay: '1.2s',
  },
  {
    id: 'growth-scale',
    label: '+320% ROAS',
    sub: 'Performance Ads',
    icon: TrendingUp,
    color: '#34d399',
    glow: 'rgba(52, 211, 153, 0.4)',
    angle: 140,
    distance: 185,
    size: 'md',
    delay: '2.4s',
  },
  {
    id: 'ui-ux',
    label: 'UI/UX Design',
    sub: 'Figma Systems',
    icon: Palette,
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.4)',
    angle: 220,
    distance: 170,
    size: 'md',
    delay: '0.8s',
  },
  {
    id: 'mvp-sprint',
    label: '14-Day MVP',
    sub: 'Live to Market',
    icon: Zap,
    color: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.35)',
    angle: 95,
    distance: 125,
    size: 'sm',
    delay: '1.8s',
  },
  {
    id: 'cloud-scale',
    label: '99.98% Uptime',
    sub: 'Supabase Cloud',
    icon: Shield,
    color: '#2dd4bf',
    glow: 'rgba(45, 212, 191, 0.35)',
    angle: 270,
    distance: 130,
    size: 'sm',
    delay: '3s',
  },
];

/**
 * InteractiveGrowthOrbit
 * An open, boxless 3D kinetic interactive space that dynamically reacts
 * to mouse hover (3D parallax, tilt, magnetic glow) and page scroll.
 */
export default function InteractiveGrowthOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<OrbitalNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollScale, setScrollScale] = useState(1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // 3D Mouse parallax tilt handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Normalised tilt (max ±16deg)
    const tiltX = -(mouseY / (rect.height / 2)) * 14;
    const tiltY = (mouseX / (rect.width / 2)) * 14;

    setRotate({ x: tiltX, y: tiltY });
    setCursorPos({ x: mouseX, y: mouseY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
    setHoveredNode(null);
  }, []);

  // Scroll expansion effect
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      // Gently expand and tilt down as user scrolls down the first 400px
      const scale = 1 + Math.min(scrollY / 800, 0.25);
      setScrollScale(scale);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[500px] h-[480px] lg:h-[520px] flex items-center justify-center select-none"
        style={{ perspective: 1000 }}
      >
        {/* ── 3D Tilting Stage ── */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${scrollScale})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Ambient Cosmic Core Backlight */}
          <div
            className="absolute w-[360px] h-[360px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-60"
            style={{
              background: hoveredNode
                ? `radial-gradient(circle, ${hoveredNode.color}66 0%, rgba(59,130,246,0.15) 50%, transparent 75%)`
                : 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 45%, transparent 70%)',
            }}
          />

          {/* ── Concentric Rotating Gyroscope Rings ── */}
          {/* Outer Ring */}
          <div
            className="absolute w-[420px] h-[420px] rounded-full border border-white/[0.06] pointer-events-none animate-spin-slow"
            style={{
              borderStyle: 'dashed',
              borderWidth: '1.5px',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          />

          {/* Middle Glowing Ring */}
          <div
            className="absolute w-[300px] h-[300px] rounded-full pointer-events-none transition-colors duration-500"
            style={{
              border: `1px solid ${hoveredNode ? hoveredNode.color + '55' : 'rgba(71,123,219,0.25)'}`,
              boxShadow: hoveredNode ? `0 0 30px ${hoveredNode.color}22` : '0 0 20px rgba(71,123,219,0.10)',
              transform: 'rotate(25deg)',
            }}
          />

          {/* Inner Fast Particle Ring */}
          <div
            className="absolute w-[200px] h-[200px] rounded-full border border-cyan-400/20 pointer-events-none"
            style={{
              borderTopColor: '#00d2ff',
              borderRightColor: 'transparent',
              borderBottomColor: '#a855f7',
              borderLeftColor: 'transparent',
              animation: 'spin-slow 25s linear infinite reverse',
            }}
          />

          {/* ── CENTRAL KINETIC CORE (Emblem with interactive pulse) ── */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="relative z-20 group cursor-pointer flex flex-col items-center justify-center p-4 rounded-3xl transition-transform duration-300 hover:scale-110"
            style={{
              transform: 'translateZ(40px)',
            }}
            title="Click to schedule discovery"
          >
            {/* Core Orb Container */}
            <div
              className="relative w-24 h-24 rounded-3xl p-1.5 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]"
              style={{
                background: 'linear-gradient(135deg, rgba(15,28,49,0.95), rgba(8,15,28,0.98))',
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
            >
              {/* Outer Pulsing Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-600 opacity-40 blur-md group-hover:opacity-80 transition-opacity animate-pulse-dot" />

              {/* Exact Brand Logo Emblem */}
              <img
                src="/growmybizz-logo.png"
                alt="Growmybizz Core"
                className="relative z-10 w-full h-full object-contain rounded-2xl drop-shadow-[0_4px_16px_rgba(59,130,246,0.5)]"
              />
            </div>

            {/* Core Label */}
            <div className="mt-2.5 text-center">
              <span
                className="text-white font-extrabold text-xs tracking-wider uppercase block"
                style={{ fontFamily: SYNE_FONT }}
              >
                Growmybizz
              </span>
              <span className="text-[10px] text-cyan-400/90 font-mono flex items-center justify-center gap-1 mt-0.5">
                <Sparkles size={9} />
                <span>Interactive Orbit</span>
              </span>
            </div>
          </div>

          {/* ── DYNAMIC LASER BEAM (draws to hovered node) ── */}
          {hoveredNode && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-15"
              style={{ transform: 'translateZ(20px)' }}
            >
              {(() => {
                const rad = (hoveredNode.angle * Math.PI) / 180;
                const x2 = 250 + Math.cos(rad) * hoveredNode.distance;
                const y2 = 250 + Math.sin(rad) * hoveredNode.distance;
                return (
                  <>
                    <line
                      x1="250"
                      y1="250"
                      x2={x2}
                      y2={y2}
                      stroke={hoveredNode.color}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="opacity-70 animate-pulse"
                    />
                    <circle cx={x2} cy={y2} r="4" fill={hoveredNode.color} />
                  </>
                );
              })()}
            </svg>
          )}

          {/* ── FLOATING ORBITAL SATELLITE NODES ── */}
          {orbitalNodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            // Center is (250, 250) in 500x500 box
            const x = Math.cos(rad) * node.distance;
            const y = Math.sin(rad) * node.distance;
            const Icon = node.icon;
            const isHovered = hoveredNode?.id === node.id;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onClick={() => setIsModalOpen(true)}
                className="absolute cursor-pointer transition-all duration-300"
                style={{
                  transform: `translate3d(${x}px, ${y}px, ${isHovered ? 60 : 20}px) scale(${isHovered ? 1.15 : 1})`,
                  transformStyle: 'preserve-3d',
                  zIndex: isHovered ? 40 : 25,
                }}
              >
                {/* Floating pill capsule */}
                <div
                  className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all duration-300 shadow-xl"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, rgba(15,28,49,0.98), rgba(20,36,62,0.95))'
                      : 'linear-gradient(135deg, rgba(15,28,49,0.85), rgba(10,18,32,0.90))',
                    border: `1.5px solid ${isHovered ? node.color : 'rgba(255,255,255,0.12)'}`,
                    boxShadow: isHovered
                      ? `0 12px 32px rgba(0,0,0,0.6), 0 0 28px ${node.glow}`
                      : '0 8px 24px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(12px)',
                    animation: `float-slow 6s ease-in-out infinite`,
                    animationDelay: node.delay,
                  }}
                >
                  {/* Icon badge */}
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12"
                    style={{
                      background: `linear-gradient(135deg, ${node.color}33, ${node.color}15)`,
                      border: `1px solid ${node.color}66`,
                    }}
                  >
                    <Icon size={14} style={{ color: node.color }} />
                  </div>

                  {/* Text details */}
                  <div className="leading-tight">
                    <p className="text-white font-bold text-xs whitespace-nowrap flex items-center gap-1">
                      <span>{node.label}</span>
                      <ArrowUpRight
                        size={11}
                        className={`transition-opacity ${isHovered ? 'opacity-100 text-white' : 'opacity-0'}`}
                      />
                    </p>
                    <p
                      className="text-[10px] font-medium whitespace-nowrap"
                      style={{ color: isHovered ? node.color : 'rgba(255,255,255,0.45)' }}
                    >
                      {node.sub}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Interactive Stardust Particles reacting to mouse ── */}
          <div
            className="absolute w-2 h-2 rounded-full bg-cyan-400 blur-[1px] pointer-events-none transition-all duration-300"
            style={{
              transform: `translate3d(${cursorPos.x * 0.35 + 80}px, ${cursorPos.y * 0.35 - 90}px, 30px)`,
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 blur-[1px] pointer-events-none transition-all duration-500"
            style={{
              transform: `translate3d(${cursorPos.x * -0.25 - 120}px, ${cursorPos.y * -0.25 + 100}px, 20px)`,
            }}
          />
        </div>

        {/* Floating Hint below the orbit */}
        <div className="absolute -bottom-2 inset-x-0 text-center pointer-events-none">
          <span className="text-[11px] text-white/35 font-mono inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Hover nodes &amp; tilt with cursor · Click to explore
          </span>
        </div>
      </div>

      {/* Discovery Modal */}
      <ScheduleCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
