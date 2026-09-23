"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type SparklesCoreProps = {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string | string[];
};

export function SparklesCore({
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.8,
  particleDensity = 400,
  className,
  particleColor = ["#f15a22", "#075794"],
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;

    const colors = Array.isArray(particleColor)
      ? particleColor
      : [particleColor];

    const particleCount = Math.min(
      300,
      Math.max(80, Math.round(particleDensity / 3)),
    );

    const particles = Array.from({ length: particleCount }, () => ({
      x: 0,
      y: 0,
      size: 0,
      speed: 0,
      opacity: 0,
      color: colors[0],
    }));

    const reset = (
      particle: (typeof particles)[number],
      initial = false,
    ) => {
      particle.x = Math.random() * width;
      particle.y = initial ? Math.random() * height : height + Math.random() * 14;
      particle.size = minSize + Math.random() * (maxSize - minSize);
      particle.speed = 0.12 + Math.random() * 0.38;
      particle.opacity = 0.25 + Math.random() * 0.75;
      particle.color = colors[Math.floor(Math.random() * colors.length)];
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.forEach((p) => reset(p, true));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -6) reset(p);

        context.globalAlpha =
          p.opacity *
          Math.min(1, p.y / 28) *
          Math.min(1, (height - p.y) / 28);
        context.fillStyle = p.color;
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw();
    } else {
      context.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        context.globalAlpha = p.opacity;
        context.fillStyle = p.color;
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [maxSize, minSize, particleColor, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block", className)}
      style={{ background }}
      aria-hidden="true"
    />
  );
}

export default SparklesCore;
