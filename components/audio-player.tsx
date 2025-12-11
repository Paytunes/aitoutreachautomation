"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
	duration?: number;
}

// Simple seeded random function for consistent waveform
function seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

export function AudioPlayer({ duration = 202 }: AudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Generate consistent bar heights using seeded random
	const barHeights = useMemo(() => {
		const bars = 80;
		const heights: number[] = [];
		for (let i = 0; i < bars; i++) {
			heights.push(seededRandom(i * 0.1) * 0.7 + 0.3); // Values between 0.3 and 1.0
		}
		return heights;
	}, []);

	// Generate waveform visualization
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Get actual canvas dimensions
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const bars = barHeights.length;

		// Set canvas internal size to match display size (with device pixel ratio for crisp rendering)
		const dpr = window.devicePixelRatio || 1;
		const displayWidth = width;
		const displayHeight = height;

		if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
			canvas.width = displayWidth * dpr;
			canvas.height = displayHeight * dpr;
			ctx.scale(dpr, dpr);
		}

		// Fill background with light gray
		ctx.fillStyle = "#f3f4f6"; // Light gray background
		ctx.fillRect(0, 0, displayWidth, displayHeight);

		const barWidth = displayWidth / bars - 2; // Slight gap between bars
		const playedWidth = (currentTime / duration) * displayWidth;

		// Draw all bars
		for (let i = 0; i < bars; i++) {
			const x = (i / bars) * displayWidth + 1; // Add small margin
			const barHeight = barHeights[i] * displayHeight * 0.7; // Use 70% of height
			const y = (displayHeight - barHeight) / 2;

			// Determine if this bar is in the played portion
			const barEnd = x + barWidth;
			const isPlayed = barEnd <= playedWidth;

			// Colors: light purple/blue for unplayed, darker purple/blue for played
			if (isPlayed) {
				// Darker purple/blue for played portion
				ctx.fillStyle = "#6366f1"; // Indigo-500
			} else {
				// Light purple/blue for unplayed portion
				ctx.fillStyle = "#a5b4fc"; // Indigo-300
			}

			// Draw the bar with rounded corners effect
			ctx.fillRect(x, y, barWidth, barHeight);
		}
	}, [currentTime, duration, barHeights]);

	// Simulate playback when playing
	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentTime((prev) => {
				if (prev >= duration) {
					setIsPlaying(false);
					return duration;
				}
				return prev + 0.1;
			});
		}, 100);

		return () => clearInterval(interval);
	}, [isPlaying, duration]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4 bg-muted rounded-lg p-4">
				<Button size="icon" variant="ghost" className="flex-shrink-0" onClick={() => setIsPlaying(!isPlaying)}>
					{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
				</Button>
				<div className="flex-1 min-w-0 bg-gray-100 rounded">
					<canvas ref={canvasRef} width={400} height={50} className="w-full h-full" />
				</div>
				<Button size="icon" variant="ghost" className="flex-shrink-0">
					<Volume2 className="w-5 h-5" />
				</Button>
			</div>
			<div className="flex justify-between text-sm text-muted-foreground px-1">
				<span>{formatTime(currentTime)}</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>
	);
}
