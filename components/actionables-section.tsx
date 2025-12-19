"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getUnifiedItems } from "@/lib/mock-api";
import type { Actionable } from "@/lib/types";

interface ActionablesSectionProps {
	actionables: Actionable[];
	auditId: string;
	leadName: string;
	recommendedActionableIds?: string[];
	allowCreateTasks?: boolean; // Allow creating new tasks (default: true)
	currentUserId?: string; // Current user ID for navigation
}

export function ActionablesSection({ 
	actionables, 
	auditId, 
	leadName,
	recommendedActionableIds = [],
	allowCreateTasks = true,
	currentUserId
}: ActionablesSectionProps) {
	const router = useRouter();
	const { toast } = useToast();
	// Auto-select recommended actionables on mount
	const [selectedActionables, setSelectedActionables] = useState<string[]>(recommendedActionableIds);
	// Store selected preference for each actionable: { actionableId: preferenceValue }
	const [selectedPreferences, setSelectedPreferences] = useState<Record<string, string>>({});
	const [isCreatingTasks, setIsCreatingTasks] = useState(false);

	// Filter to only show active actionables
	const activeActionables = actionables.filter((a) => a.is_active);

	const toggleActionable = (id: string) => {
		setSelectedActionables((prev) => {
			if (prev.includes(id)) {
				// Deselecting - remove preference if it exists
				const newPreferences = { ...selectedPreferences };
				delete newPreferences[id];
				setSelectedPreferences(newPreferences);
				return prev.filter((a) => a !== id);
			} else {
				// Selecting - if it has preferences, we'll require one to be selected
				return [...prev, id];
			}
		});
	};

	const handlePreferenceChange = (actionableId: string, preferenceValue: string) => {
		setSelectedPreferences((prev) => ({
			...prev,
			[actionableId]: preferenceValue,
		}));
	};

	const handleCreateTasks = async () => {
		if (selectedActionables.length === 0) return;

		// Validate that all selected actionables with preferences have a preference selected
		// Note: "no_preference" is a valid selection, so we allow it
		const actionablesWithPreferences = selectedActionables.filter((id) => {
			const actionable = actionables.find((a) => a.id === id);
			return actionable && actionable.preference && actionable.preference.length > 0;
		});

		const missingPreferences = actionablesWithPreferences.filter((id) => !selectedPreferences[id] || selectedPreferences[id] === "");
		if (missingPreferences.length > 0) {
			toast({
				variant: "destructive",
				title: "Preference Required",
				description: "Please select a preference (or 'No Preference') for all selected actionables that have preferences.",
			});
			return;
		}

		setIsCreatingTasks(true);
		try {
			const selectedActionableObjects = selectedActionables.map((id) => {
				const actionable = actionables.find((a) => a.id === id);
				return {
					...actionable,
					selectedPreference: selectedPreferences[id] || null,
				};
			});

			console.log("[v0] Creating tasks for actionables:", {
				auditId,
				leadName,
				actionables: selectedActionableObjects,
			});

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			// After creating tasks, navigate to next item if currentUserId is provided
			if (currentUserId) {
				const result = await getUnifiedItems(1, 1000, {
					employee_id: currentUserId,
				});
				// Sort by created_at ascending (oldest first) - but getUnifiedItems already sorts descending
				// So we need to reverse it to get oldest first
				const sortedItems = [...result.data].reverse();

				// Find current audit index
				const currentIndex = sortedItems.findIndex((item) => item.id === auditId);
				const nextItem = currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : null;

				if (nextItem) {
					// Navigate to next item
					router.push(`/tasks/${nextItem.id}`);
				} else {
					// No next item, just show success message
					setSelectedActionables([]);
					setSelectedPreferences({});
					setIsCreatingTasks(false);
					toast({
						title: "Success",
						description: `Successfully created ${selectedActionables.length} task(s)!`,
					});
				}
			} else {
				// No currentUserId provided, just reset and show message
				setSelectedActionables([]);
				setSelectedPreferences({});
				setIsCreatingTasks(false);
				toast({
					title: "Success",
					description: `Successfully created ${selectedActionables.length} task(s)!`,
				});
			}
		} catch (error) {
			console.error("[v0] Error creating tasks:", error);
			setIsCreatingTasks(false);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to create tasks. Please try again.",
			});
		}
	};

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-x-2 gap-y-1 max-h-[500px] overflow-y-auto pr-2">
				{activeActionables.map((actionable) => {
					const isRecommended = recommendedActionableIds.includes(actionable.id);
					const isSelected = selectedActionables.includes(actionable.id);
					const hasPreferences = actionable.preference && actionable.preference.length > 0;
					const selectedPreference = selectedPreferences[actionable.id];

					return (
						<div key={actionable.id} className={`space-y-1 ${hasPreferences && isSelected ? "col-span-2" : ""}`}>
							<div className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
								<Checkbox
									id={actionable.id}
									checked={isSelected}
									onCheckedChange={() => toggleActionable(actionable.id)}
									className="mt-1 shrink-0"
								/>
								<div className="flex-1 min-w-0">
									<label htmlFor={actionable.id} className="text-sm text-foreground cursor-pointer flex items-center justify-between gap-2">
										<span className="truncate">{actionable.name}</span>
										{isRecommended && (
											<Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/30 shrink-0">
												Recommended
											</Badge>
										)}
									</label>
									{/* Show preferences when actionable is selected and has preferences */}
									{isSelected && hasPreferences && (
										<div className="mt-2 ml-0">
											<RadioGroup
												value={selectedPreference || ""}
												onValueChange={(value) => handlePreferenceChange(actionable.id, value)}
												className="space-y-1.5"
											>
												{actionable.preference!.map((pref) => (
													<div key={pref} className="flex items-center space-x-2">
														<RadioGroupItem value={pref} id={`${actionable.id}-${pref}`} />
														<Label
															htmlFor={`${actionable.id}-${pref}`}
															className="text-xs text-muted-foreground cursor-pointer font-normal"
														>
															{pref}
														</Label>
													</div>
												))}
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="no_preference" id={`${actionable.id}-no_preference`} />
													<Label
														htmlFor={`${actionable.id}-no_preference`}
														className="text-xs text-muted-foreground cursor-pointer font-normal"
													>
														No Preference
													</Label>
												</div>
											</RadioGroup>
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{allowCreateTasks && (
				<div className="flex flex-col gap-2 pt-3">
					<Button
						onClick={handleCreateTasks}
						disabled={isCreatingTasks || selectedActionables.length === 0}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-9"
					>
						{isCreatingTasks ? "Creating Tasks..." : "Verify & Create Tasks"}
					</Button>
				</div>
			)}
		</div>
	);
}
