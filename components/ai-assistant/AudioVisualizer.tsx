"use client";

import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  onAmplitudeChange?: (amplitude: number) => void;
  barCount?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioElement,
  isPlaying,
  onAmplitudeChange,
  barCount = 24,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Web Audio API graph connected to the HTMLAudioElement
  useEffect(() => {
    if (!audioElement) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const audioCtx = audioContextRef.current;

      // Ensure single connection from MediaElement
      if (!sourceNodeRef.current && audioElement) {
        try {
          sourceNodeRef.current = audioCtx.createMediaElementSource(audioElement);
        } catch {
          // If already connected in a prior render or re-mount
        }
      }

      if (!analyserRef.current) {
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        if (sourceNodeRef.current) {
          sourceNodeRef.current.connect(analyser);
          analyser.connect(audioCtx.destination);
        }
      }
    } catch (err) {
      console.warn("[AudioVisualizer] Web Audio API initialization:", err);
    }

    return () => {
      // Don't close AudioContext immediately if it might be reused, but stop animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  // Handle Playback & Visualizer Animation Frame
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      onAmplitudeChange?.(0);
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // Resume AudioContext if suspended by browser autoplay policy
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      analyser.getByteFrequencyData(dataArray);

      // Compute average amplitude (0 to 1) for avatar pulsating
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength / 255;
      onAmplitudeChange?.(avg);

      // Render futuristic equalizer bars on canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / barCount) * 0.7;
      const spacing = (width / barCount) * 0.3;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] || 0;
        const percent = value / 255;
        const barHeight = Math.max(3, percent * height * 0.95);

        const x = i * (barWidth + spacing);
        const y = height - barHeight;

        // Gradient: cyan to blue to violet
        const gradient = ctx.createLinearGradient(x, y, x, height);
        gradient.addColorStop(0, "#00f0ff");
        gradient.addColorStop(0.5, "#3b82f6");
        gradient.addColorStop(1, "#8b5cf6");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = percent > 0.4 ? 8 : 2;

        // Rounded bar cap
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, barCount, onAmplitudeChange]);

  // Clean up AudioContext on full unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={160}
        height={32}
        className="w-full h-8 opacity-90 select-none"
        aria-hidden="true"
      />
    </div>
  );
};
