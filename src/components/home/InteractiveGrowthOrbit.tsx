'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  Code2,
  Bot,
  TrendingUp,
  Palette,
  Zap,
  Shield,
  ArrowUpRight,
  Sparkles,
  Rocket,
  Globe,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import ScheduleCallModal from '@/components/ScheduleCallModal';
import type { OrbitConfig } from '@/types';
import { defaultOrbitConfig } from '@/data/orbitConfig';

interface OrbitalNode {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  glow: string;
  angle: number; // in degrees
  distance: number; // in px
  size: 'sm' | 'md' | 'lg';
  delay: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Code2,
  Bot,
  TrendingUp,
  Palette,
  Zap,
  Shield,
  Sparkles,
  Rocket,
  Globe,
};

const DEFAULT_ICONS = [Code2, Bot, TrendingUp, Palette, Zap, Shield];

const NODE_LAYOUT = [
  { angle: 320, distance: 175, delay: '0s', size: 'lg' as const },
  { angle: 45, distance: 180, delay: '1.2s', size: 'lg' as const },
  { angle: 140, distance: 185, delay: '2.4s', size: 'md' as const },
  { angle: 220, distance: 170, delay: '0.8s', size: 'md' as const },
  { angle: 95, distance: 125, delay: '1.8s', size: 'sm' as const },
  { angle: 270, distance: 130, delay: '3s', size: 'sm' as const },
];

interface InteractiveGrowthOrbitProps {
  config?: OrbitConfig;
}

export function InteractiveGrowthOrbit({ config }: InteractiveGrowthOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<OrbitalNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollScale, setScrollScale] = useState(1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const mouseRafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  const rawNodes = config?.nodes && config.nodes.length > 0 ? config.nodes : defaultOrbitConfig.nodes;

  const activeNodes: OrbitalNode[] = useMemo(() => {
    return rawNodes.map((n, i) => {
      const layout = NODE_LAYOUT[i % NODE_LAYOUT.length];
      const IconComp = (n.icon && ICON_MAP[n.icon]) || DEFAULT_ICONS[i % DEFAULT_ICONS.length];
      return {
        id: n.id || `node-${i}`,
        label: n.label,
        sub: n.sub,
        icon: IconComp,
        color: n.color || '#38bdf8',
        glow: `${n.color || '#38bdf8'}66`,
        angle: layout.angle,
        distance: layout.distance,
        size: n.size || layout.size,
        delay: layout.delay,
      };
    });
  }, [rawNodes]);

  // 3D Mouse parallax tilt handler with requestAnimationFrame throttling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    mouseRafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = clientX - centerX;
      const mouseY = clientY - centerY;

      // Normalised tilt (max ±14deg)
      const tiltX = -(mouseY / (rect.height / 2)) * 14;
      const tiltY = (mouseX / (rect.width / 2)) * 14;

      setRotate({ x: tiltX, y: tiltY });
      setCursorPos({ x: mouseX, y: mouseY });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    setRotate({ x: 0, y: 0 });
    setHoveredNode(null);
  }, []);

  // Scroll expansion effect with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        scrollRafRef.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scale = 1 + Math.min(scrollY / 800, 0.25);
          setScrollScale(scale);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    };
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
            {/* Core Orb Container — Centered with Pure White Background */}
            <div
              className="relative w-20 h-20 rounded-2xl p-1.5 flex items-center justify-center bg-white shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.7)]"
            >
              {/* Outer Pulsing Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 opacity-40 blur-md group-hover:opacity-80 transition-opacity animate-pulse-dot" />

              {/* Exact Brand Logo Emblem Centered on White */}
              <div className="relative z-10 w-full h-full flex items-center justify-center bg-white rounded-xl">
                <Image
                  src="/brand-logo-mark.png"
                  alt="Growmybiz24 Core"
                  width={60}
                  height={60}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Core Label */}
            <div className="mt-2 text-center">
              <span
                className="text-white font-extrabold text-xs tracking-wider uppercase block"
                style={{ fontFamily: SYNE_FONT }}
              >
                {config?.centerLabel || 'Growmybiz24'}
              </span>
              {config?.centerSubtitle && (
                <span className="text-white/40 text-[9px] font-medium block mt-0.5">
                  {config.centerSubtitle}
                </span>
              )}
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
                const targetX = 250 + Math.cos(rad) * hoveredNode.distance;
                const targetY = 250 + Math.sin(rad) * hoveredNode.distance;
                return (
                  <>
                    <line
                      x1="250"
                      y1="250"
                      x2={targetX}
                      y2={targetY}
                      stroke={hoveredNode.color}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                      opacity="0.8"
                    />
                    <circle cx={targetX} cy={targetY} r="4" fill={hoveredNode.color} />
                  </>
                );
              })()}
            </svg>
          )}

          {/* ── 3D FLOATING ORBITAL NODES ── */}
          {activeNodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * node.distance;
            const y = Math.sin(rad) * node.distance;
            const isHovered = hoveredNode?.id === node.id;

            // Size presets
            const sizeClasses = {
              sm: 'p-2 sm:p-2.5 min-w-[90px]',
              md: 'p-2.5 sm:p-3 min-w-[110px]',
              lg: 'p-3 sm:p-3.5 min-w-[130px]',
            }[node.size];

            const IconComponent = node.icon;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setIsModalOpen(true)}
                className={`absolute cursor-pointer transition-all duration-300 group ${sizeClasses} rounded-2xl flex items-center gap-2.5 z-30`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, ${isHovered ? '60px' : '20px'}) scale(${
                    isHovered ? 1.15 : 1
                  })`,
                  background: isHovered
                    ? 'rgba(15, 28, 49, 0.95)'
                    : 'rgba(15, 28, 49, 0.75)',
                  border: `1px solid ${isHovered ? node.color : 'rgba(255, 255, 255, 0.12)'}`,
                  boxShadow: isHovered
                    ? `0 12px 30px ${node.glow}, 0 0 20px ${node.glow}`
                    : '0 8px 24px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(12px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Node Icon Badge */}
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12"
                  style={{
                    background: `${node.color}22`,
                    border: `1px solid ${node.color}55`,
                  }}
                >
                  <IconComponent size={14} style={{ color: node.color }} />
                </div>

                {/* Node Text Content */}
                <div className="flex flex-col text-left pr-1 min-w-0">
                  <span
                    className="font-bold text-white text-xs sm:text-[13px] tracking-tight leading-none group-hover:text-white transition-colors truncate"
                    style={{ fontFamily: SYNE_FONT }}
                  >
                    {node.label}
                  </span>
                  <span
                    className="text-[10px] sm:text-[11px] font-medium leading-tight mt-1 truncate"
                    style={{ color: node.color }}
                  >
                    {node.sub}
                  </span>
                </div>

                {/* Micro Hover Indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto shrink-0">
                  <ArrowUpRight size={10} style={{ color: node.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Scheduling Popup when clicking central core or any node */}
      <ScheduleCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default InteractiveGrowthOrbit;
