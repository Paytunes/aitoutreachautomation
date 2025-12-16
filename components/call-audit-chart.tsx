"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CallAuditChartProps {
	interestLevel: number;
	callDuration: number;
	disposition: string;
}

export function CallAuditChart({ interestLevel }: CallAuditChartProps) {
	const safeLevel = Math.max(0, Math.min(10, interestLevel || 0));
	const pct = (safeLevel / 10) * 100;

	return (
		<div className="w-full">
			<Card className="bg-card border-border">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium text-foreground">Interest Level</CardTitle>
				</CardHeader>
				<CardContent className="pt-0 space-y-2">
					<div className="flex items-center gap-3">
						<div className="w-full bg-muted rounded h-2">
							<div className="bg-primary rounded h-2" style={{ width: `${pct}%` }} />
						</div>
						<span className="text-sm font-medium text-foreground">{safeLevel}/10</span>
					</div>
					<p className="text-xs text-muted-foreground">Interest score based on call analysis</p>
				</CardContent>
			</Card>
		</div>
	);
}
