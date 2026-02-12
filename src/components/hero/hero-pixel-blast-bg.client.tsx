"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

import PixelBlast from "@/components/PixelBlast";

type HeroPixelBlastBackgroundProps = {
  className?: string;
};

export function HeroPixelBlastBackground({
  className = "",
}: HeroPixelBlastBackgroundProps) {
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    const canUseWebglRenderer = (): boolean => {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

      if (!context) return false;

      try {
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          canvas,
        });
        renderer.dispose();
        return true;
      } catch {
        return false;
      }
    };

    const media = window.matchMedia(
      "(max-width: 768px), (prefers-reduced-motion: reduce)",
    );

    const applyPreference = () => {
      setUseFallback(media.matches || !canUseWebglRenderer());
    };

    applyPreference();
    media.addEventListener("change", applyPreference);

    return () => {
      media.removeEventListener("change", applyPreference);
    };
  }, []);

  if (useFallback) {
    return (
      <div
        className={`absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_0%,rgba(16,185,129,0.35)_0%,rgba(15,23,42,0.92)_52%,rgba(2,6,23,1)_100%)] ${className}`}
      />
    );
  }

  return (
    <PixelBlast
      antialias={false}
      autoPauseOffscreen
      className={`absolute inset-0 ${className}`}
      color="#2dd4bf"
      edgeFade={0.18}
      enableRipples
      liquid={false}
      noiseAmount={0.05}
      patternDensity={0.94}
      patternScale={1.8}
      pixelSize={2.8}
      pixelSizeJitter={0.25}
      rippleIntensityScale={1.1}
      speed={0.44}
      transparent
      variant="diamond"
    />
  );
}
