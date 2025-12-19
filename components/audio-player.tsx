"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
	duration?: number;
	src?: string;
}

// Simple seeded random function for consistent waveform
function seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

export function AudioPlayer({ duration = 202, src }: AudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [resolvedDuration, setResolvedDuration] = useState(duration);
	const [useSimulatedPlayback, setUseSimulatedPlayback] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
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

	// Attach audio element when src is provided
	useEffect(() => {
		if (!src || src.trim() === "") {
			audioRef.current = null;
			setResolvedDuration(duration);
			setCurrentTime(0);
			setUseSimulatedPlayback(true);
			return;
		}

		setUseSimulatedPlayback(false); // Try real audio first
		const audio = new Audio(src);
		audioRef.current = audio;
		setCurrentTime(0); // Reset time when new audio is loaded

		const handleLoaded = () => {
			if (!isNaN(audio.duration) && audio.duration > 0) {
				setResolvedDuration(audio.duration);
			}
		};

		const handleError = () => {
			// Silently fall back to simulated playback for invalid/mock audio URLs
			setIsPlaying(false);
			setCurrentTime(0);
			setUseSimulatedPlayback(true); // Fall back to simulated playback
		};

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};
		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		audio.addEventListener("loadedmetadata", handleLoaded);
		audio.addEventListener("error", handleError);
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.pause();
			audio.removeEventListener("loadedmetadata", handleLoaded);
			audio.removeEventListener("error", handleError);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [src, duration]);

	// Generate waveform visualization
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Get actual canvas dimensions
		const rect = canvas.getBoundingClientRect();
		const width = rect.width || 400;
		const height = rect.height || 50;
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
		const playedWidth = resolvedDuration > 0 ? (currentTime / resolvedDuration) * displayWidth : 0;

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
		// barHeights is stable (memoized with empty deps) so we don't need it in deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime, resolvedDuration]);

	// Playback (real audio if src and valid, otherwise simulated)
	useEffect(() => {
		// Use simulated playback if no src, or if we've determined audio won't work
		const shouldUseSimulated = !src || !src.trim() || useSimulatedPlayback || !audioRef.current;

		if (!shouldUseSimulated && audioRef.current) {
			const audio = audioRef.current;
			if (isPlaying) {
				// Try to play the audio
				const playPromise = audio.play();
				if (playPromise !== undefined) {
					playPromise.catch(() => {
						// Silently fall back to simulated playback if audio fails to play
						setUseSimulatedPlayback(true);
					});
				}
			} else {
				audio.pause();
			}
			// Don't return here - let timeupdate events from audio element handle currentTime updates
			return;
		}

		// Simulated playback when no src or when audio fails (for demo purposes)
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentTime((prev) => {
				if (prev >= resolvedDuration) {
					setIsPlaying(false);
					return resolvedDuration;
				}
				return prev + 0.1;
			});
		}, 100);

		return () => clearInterval(interval);
	}, [isPlaying, resolvedDuration, src, useSimulatedPlayback]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handlePlayPause = () => {
		setIsPlaying((prev) => !prev);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4 bg-muted rounded-lg p-4">
				<Button
					type="button"
					variant="default"
					className="flex-shrink-0 !h-16 !w-16 rounded-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer touch-manipulation"
					onClick={handlePlayPause}
					aria-label={isPlaying ? "Pause audio" : "Play audio"}
				>
					{isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
				</Button>
				<div 
					className="flex-1 min-w-0 bg-gray-100 rounded cursor-pointer" 
					onClick={handlePlayPause}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handlePlayPause();
						}
					}}
					aria-label={isPlaying ? "Pause audio" : "Play audio"}
				>
					<canvas ref={canvasRef} width={400} height={50} className="w-full h-full pointer-events-none" />
				</div>
				<Button size="icon" variant="ghost" className="flex-shrink-0">
					<Volume2 className="w-5 h-5" />
				</Button>
			</div>
			<div className="flex justify-between text-sm text-muted-foreground px-1">
				<span>{formatTime(currentTime)}</span>
				<span>{formatTime(resolvedDuration)}</span>
			</div>
		</div>
	);
}
