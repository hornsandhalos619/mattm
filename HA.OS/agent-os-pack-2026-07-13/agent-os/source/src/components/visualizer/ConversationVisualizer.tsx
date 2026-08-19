"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";

type VisualizerMode = "fluid" | "waves" | "particles" | "ripple";

export default function ConversationVisualizer({
  mode = "fluid",
  accent = "#60a5fa",
  size = 200,
  className = ""
}: {
  mode?: VisualizerMode;
  accent?: string;
  size?: number;
  className?: string;
}) {
  const { audioData, isListening, isSpeaking } = useAudioAnalyzer();
  const containerRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Fluid simulation parameters
  const [fluidPoints, setFluidPoints] = useState<Array<{x: number; y: number; vx: number; vy: number; targetY: number}>>([]);
  
  useEffect(() => {
    // Initialize fluid points
    const pointCount = Math.max(8, Math.floor(size / 20));
    const points = Array.from({ length: pointCount }, (_, i) => {
      const x = (i / (pointCount - 1)) * size;
      return { 
        x, 
        y: size / 2, 
        vx: 0, 
        vy: 0, 
        targetY: size / 2 
      };
    });
    setFluidPoints(points);
  }, [size]);
  
  useEffect(() => {
    const animate = () => {
      if (!containerRef.current) return;
      
      const ctx = containerRef.current.getContext("2d");
      if (!ctx) return;
      
      // Clear with transparency for trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, size, size);
      
      // Update fluid points based on audio
      if (audioData.length > 0) {
        const amplitude = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
        const normalizedAmplitude = Math.min(amplitude * 10, 1); // 0-1 range
        
        // Apply audio influence to fluid points
        fluidPoints.forEach((point, index) => {
          // Create wave-like motion based on position and audio
          const waveOffset = Math.sin((index / fluidPoints.length) * Math.PI * 2 + performance.now() * 0.001) * 10;
          const audioInfluence = normalizedAmplitude * 20 * Math.sin(index * 0.5);
          
          point.targetY = size / 2 + waveOffset + audioInfluence - (normalizedAmplitude * 30);
          
          // Spring physics for fluid motion
          const springForce = (point.targetY - point.y) * 0.05;
          point.vy += springForce;
          point.vy *= 0.92; // damping
          point.y += point.vy;
          
          // Gentle horizontal drift
          point.vx += (Math.sin(point.y * 0.1 + performance.now() * 0.002) * 0.02);
          point.vx *= 0.98;
          point.x += point.vx;
          
          // Keep points within bounds
          if (point.x < 0) { point.x = 0; point.vx *= -0.5; }
          if (point.x > size) { point.x = size; point.vx *= -0.5; }
          if (point.y < 0) { point.y = 0; point.vy *= -0.5; }
          if (point.y > size) { point.y = size; point.vy *= -0.5; }
        });
      }
      
      // Draw fluid visualization
      switch (mode) {
        case "fluid":
          drawFluid(ctx, fluidPoints, accent, size);
          break;
        case "waves":
          drawWaves(ctx, fluidPoints, accent, size, audioData);
          break;
        case "particles":
          drawParticles(ctx, fluidPoints, accent, size, audioData);
          break;
        case "ripple":
          drawRipple(ctx, fluidPoints, accent, size, audioData, isListening, isSpeaking);
          break;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [audioData, fluidPoints, mode, accent, size, isListening, isSpeaking]);
  
  return (
    <div className={className}>
      <canvas
        ref={containerRef}
        width={size}
        height={size}
        className="block"
        style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: "50%",
          boxShadow: `0 0 30px -5px ${accent}`,
          border: `1px solid ${accent}20`
        }}
      />
    </div>
  );
}

function drawFluid(ctx: CanvasRenderingContext2D, points: Array<{x: number; y: number; vx: number; vy: number; targetY: number}>, accent: string, size: number) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  // Create smooth curve through points
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  
  // Curve to last point and close path
  ctx.quadraticCurveTo(
    points[points.length - 1].x,
    points[points.length - 1].y,
    points[0].x,
    points[0].y
  );
  
  // Create gradient
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, `${accent}30`);
  gradient.addColorStop(0.5, `${accent}40`);
  gradient.addColorStop(1, `${accent}10`);
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Outer glow
  ctx.strokeStyle = `${accent}40`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawWaves(ctx: CanvasRenderingContext2D, points: Array<{x: number; y: number; vx: number; vy: number; targetY: number}>, accent: string, size: number, audioData: Float32Array) {
  ctx.beginPath();
  ctx.moveTo(0, size/2);
  
  // Draw multiple waves based on audio frequencies
  const waveCount = 3;
  for (let w = 0; w < waveCount; w++) {
    const offset = (w / waveCount) * Math.PI * 2;
    const amplitude = 10 + (w * 15);
    
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const progress = i / (points.length - 1);
      const x = progress * size;
      const audioIndex = Math.floor((progress * audioData.length) / waveCount) % audioData.length;
      const audioInfluence = audioData[audioIndex] * amplitude * 0.5;
      const wave = Math.sin(progress * Math.PI * 2 + performance.now() * 0.005 + offset) * audioInfluence;
      const y = size/2 + points[i].y - size/2 + wave;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `${accent}${(w + 1) * 20}`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, points: Array<{x: number; y: number; vx: number; vy: number; targetY: number}>, accent: string, size: number, audioData: Float32Array) {
  // Draw particles at fluid points
  const particleCount = Math.max(5, Math.floor(audioData.length / 20));
  
  for (let i = 0; i < particleCount; i++) {
    const index = Math.floor((i / particleCount) * points.length);
    const point = points[index];
    
    const audioIndex = Math.floor((i / particleCount) * audioData.length) % audioData.length;
    const audioInfluence = Math.abs(audioData[audioIndex]);
    
    const radius = 2 + audioInfluence * 8;
    const opacity = 0.3 + audioInfluence * 0.7;
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `${accent}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
  }
  
  // Connect particles with lines
  ctx.beginPath();
  for (let i = 0; i < particleCount - 1; i++) {
    const index1 = Math.floor((i / particleCount) * points.length);
    const index2 = Math.floor(((i + 1) / particleCount) * points.length);
    const point1 = points[index1];
    const point2 = points[index2];
    
    const audioIndex1 = Math.floor((i / particleCount) * audioData.length) % audioData.length;
    const audioIndex2 = Math.floor(((i + 1) / particleCount) * audioData.length) % audioData.length;
    const avgInfluence = (Math.abs(audioData[audioIndex1]) + Math.abs(audioData[audioIndex2])) / 2;
    
    ctx.strokeStyle = `${accent}${Math.floor(avgInfluence * 100).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 1;
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
  }
  ctx.stroke();
}

function drawRipple(ctx: CanvasRenderingContext2D, points: Array<{x: number; y: number; vx: number; vy: number; targetY: number}>, accent: string, size: number, audioData: Float32Array, isListening: boolean, isSpeaking: boolean) {
  // Draw central pulse when listening/speaking
  if (isListening || isSpeaking) {
    const pulseSize = (isSpeaking ? 0.8 : 0.4) + (Math.sin(performance.now() * 0.01) * 0.2);
    const radius = (size / 2) * pulseSize;
    
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, radius);
    gradient.addColorStop(0, `${accent}40`);
    gradient.addColorStop(0.7, `${accent}20`);
    gradient.addColorStop(1, `${accent}00`);
    
    ctx.beginPath();
    ctx.arc(size/2, size/2, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Draw fluid base
  drawFluid(ctx, points, accent, size);
}
