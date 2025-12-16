"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, CheckCircle2 } from "lucide-react";
import type { TaskView } from "@/lib/types";

interface CrmUpdateViewProps {
	task: TaskView;
}

export function CrmUpdateView({ task }: CrmUpdateViewProps) {
	const [isCompleting, setIsCompleting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	const lead = task.call_audit?.lead;
	const leadId = lead?.id;

	const handleMarkComplete = async () => {
		setIsCompleting(true);
		// TODO: Replace with actual API call to update task status
		console.log("[v0] Marking task as complete:", task.id);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 700));

		setIsCompleting(false);
		setIsCompleted(true);
	};

	return (
		<div className="space-y-6">
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">CRM Update</CardTitle>
					<p className="text-sm text-muted-foreground mt-1">
						Edit lead data in your CRM app, then mark this task as complete
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					{leadId ? (
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
								<Database className="w-5 h-5 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">Lead in CRM</p>
									<p className="text-sm text-muted-foreground">
										{lead?.name || "Lead"} - ID: {leadId}
									</p>
								</div>
							</div>
							<Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
								<Link href={`/crm/leads/${leadId}`} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="w-4 h-4 mr-2" />
									Open Lead in CRM
								</Link>
							</Button>
						</div>
					) : (
						<div className="p-4 rounded-lg border border-border bg-muted/30">
							<p className="text-sm text-muted-foreground">
								No lead information available for this task.
							</p>
						</div>
					)}
				</CardContent>
			</Card>

		</div>
	);
}
