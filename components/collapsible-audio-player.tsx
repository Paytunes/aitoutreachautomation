"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioPlayer } from "@/components/audio-player";
import { ChevronDown, Volume2 } from "lucide-react";

interface CollapsibleAudioPlayerProps {
	audioUrl?: string;
	duration?: number;
	callSummary?: string;
}

export function CollapsibleAudioPlayer({ audioUrl, duration = 202, callSummary }: CollapsibleAudioPlayerProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (!audioUrl) {
		return null;
	}

	return (
		<Card className="bg-card border-border">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Volume2 className="w-4 h-4 text-muted-foreground" />
								<CardTitle className="text-foreground text-base">Call Recording</CardTitle>
							</div>
							<ChevronDown
								className={`w-4 h-4 text-muted-foreground transition-transform ${
									isOpen ? "transform rotate-180" : ""
								}`}
							/>
						</div>
					</CardHeader>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CardContent className="pt-0">
						<AudioPlayer duration={duration} src={audioUrl} />
						{callSummary && (
							<div className="mt-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 max-h-60 overflow-y-auto">
								<p className="text-sm font-bold text-foreground mb-2">Call Summary</p>
								<p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
									{callSummary}
								</p>
							</div>
						)}
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
