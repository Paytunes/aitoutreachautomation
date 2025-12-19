"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { updateTaskNotes } from "@/lib/mock-api";

interface TaskNotesEditorProps {
	taskId: string;
	initialNotes?: string;
}

export function TaskNotesEditor({ taskId, initialNotes = "" }: TaskNotesEditorProps) {
	const [notes, setNotes] = useState<string>(initialNotes);
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const handleNotesChange = (value: string) => {
		setNotes(value);
		setHasChanges(value !== initialNotes);
	};

	const handleSave = async () => {
		if (!hasChanges) return;

		setIsSaving(true);
		try {
			await updateTaskNotes(taskId, notes);
			// Update initial notes to current value after successful save
			setHasChanges(false);
		} catch (error) {
			console.error("[v0] Error saving notes:", error);
			alert("Failed to save notes. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Card className="bg-card border-border">
			<CardHeader className="pb-3">
				<CardTitle className="text-foreground text-base">Notes</CardTitle>
				<p className="text-xs text-muted-foreground mt-1">Add or update notes for this task</p>
			</CardHeader>
			<CardContent className="pt-0 space-y-3">
				<Textarea
					value={notes}
					onChange={(e) => handleNotesChange(e.target.value)}
					placeholder="Add notes about this task..."
					className="min-h-32 resize-y"
				/>
				{/* Save Button */}
				<div className="min-h-[2.25rem]">
					{hasChanges ? (
						<Button
							onClick={handleSave}
							disabled={isSaving}
							className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-9"
						>
							{isSaving ? (
								<>Saving...</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Notes
								</>
							)}
						</Button>
					) : (
						<div className="h-9" aria-hidden />
					)}
				</div>
			</CardContent>
		</Card>
	);
}

