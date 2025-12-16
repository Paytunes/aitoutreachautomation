"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskActionsProps {
	taskId: string;
	initialStatus: string;
}

const STATUS_OPTIONS = ["todo", "in-progress", "completed", "on-hold", "cancelled"] as const;

// Format task status to Title Case
const formatTaskStatus = (status: string): string => {
	return status
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export function TaskActions({ taskId, initialStatus }: TaskActionsProps) {
	const normalized = STATUS_OPTIONS.includes(initialStatus as any) ? initialStatus : "todo";
	const [status, setStatus] = useState<string>(normalized);
	const [isSaving, setIsSaving] = useState(false);
	const [justSaved, setJustSaved] = useState(false);

	const handleSave = () => {
		setIsSaving(true);
		setJustSaved(false);
		// Simulate save
		setTimeout(() => {
			setIsSaving(false);
			setJustSaved(true);
			setTimeout(() => setJustSaved(false), 1500);
		}, 700);
	};

	return (
		<div className="space-y-3">
			<p className="text-sm text-muted-foreground">Quick actions for this task.</p>
			<div className="space-y-2">
				<p className="text-xs text-muted-foreground">Status</p>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{STATUS_OPTIONS.map((option) => (
							<SelectItem key={option} value={option}>
								{formatTaskStatus(option)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col gap-2">
				<Button
					className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? "Updating..." : "Update Status"}
				</Button>
				<Button
					variant="outline"
					asChild
					className="w-full border-border text-foreground hover:bg-muted bg-transparent"
				>
					<Link href="/tasks">Back to Tasks</Link>
				</Button>
			</div>
			{justSaved && <p className="text-xs text-green-600">Status updated for task {taskId}.</p>}
		</div>
	);
}
