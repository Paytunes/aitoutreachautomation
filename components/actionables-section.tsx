"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Actionable } from "@/lib/types";

interface ActionablesSectionProps {
	actionables: Actionable[];
	auditId: string;
	leadName: string;
	recommendedActionableIds?: string[];
}

export function ActionablesSection({ 
	actionables, 
	auditId, 
	leadName,
	recommendedActionableIds = []
}: ActionablesSectionProps) {
	// Auto-select recommended actionables on mount
	const [selectedActionables, setSelectedActionables] = useState<string[]>(recommendedActionableIds);
	const [isCreatingTasks, setIsCreatingTasks] = useState(false);

	const toggleActionable = (id: string) => {
		setSelectedActionables((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
	};

	const handleCreateTasks = async () => {
		if (selectedActionables.length === 0) return;

		setIsCreatingTasks(true);
		try {
			const selectedActionableObjects = selectedActionables.map((id) => actionables.find((a) => a.id === id));

			console.log("[v0] Creating tasks for actionables:", {
				auditId,
				leadName,
				actionables: selectedActionableObjects,
			});

			setTimeout(() => {
				setSelectedActionables([]);
				setIsCreatingTasks(false);
				alert(`Successfully created ${selectedActionables.length} task(s)!`);
			}, 500);
		} catch (error) {
			console.error("[v0] Error creating tasks:", error);
			setIsCreatingTasks(false);
		}
	};

	return (
		<div className="space-y-3">
			<div className="space-y-2 max-h-64 overflow-y-auto pr-2">
				{actionables.map((actionable) => {
					const isRecommended = recommendedActionableIds.includes(actionable.id);
					return (
						<div
							key={actionable.id}
							className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
						>
							<Checkbox
								id={actionable.id}
								checked={selectedActionables.includes(actionable.id)}
								onCheckedChange={() => toggleActionable(actionable.id)}
								className="mt-1"
							/>
							<label htmlFor={actionable.id} className="text-sm text-foreground cursor-pointer flex-1 flex items-center justify-between gap-2">
								<span>{actionable.name}</span>
								{isRecommended && (
									<Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/30">
										Recommended
									</Badge>
								)}
							</label>
						</div>
					);
				})}
			</div>

			<div className="flex flex-col gap-2 pt-3">
				<Button
					onClick={handleCreateTasks}
					disabled={isCreatingTasks || selectedActionables.length === 0}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-9"
				>
					{isCreatingTasks ? "Creating Tasks..." : "Verify & Create Tasks"}
				</Button>
			</div>
		</div>
	);
}
