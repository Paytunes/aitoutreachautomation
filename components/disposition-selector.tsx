"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

interface DispositionSelectorProps {
	defaultDisposition?: string;
	dispositionChoices: readonly [string, string][];
	auditId: string;
	compact?: boolean;
}

export function DispositionSelector({ defaultDisposition, dispositionChoices, auditId, compact = false }: DispositionSelectorProps) {
	const [selectedDisposition, setSelectedDisposition] = useState<string | undefined>(defaultDisposition);
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const handleDispositionChange = (value: string) => {
		setSelectedDisposition(value);
		setHasChanges(value !== defaultDisposition);
	};

	const handleSave = async () => {
		if (!selectedDisposition || !hasChanges) return;

		setIsSaving(true);
		try {
			// TODO: Replace with actual API call
			console.log("[v0] Saving disposition:", {
				auditId,
				disposition: selectedDisposition,
			});

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Update default to current value after successful save
			setHasChanges(false);
			alert(`Disposition saved successfully!`);
		} catch (error) {
			console.error("[v0] Error saving disposition:", error);
			alert("Failed to save disposition. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	// Compact version for inline use in header
	if (compact) {
		return (
			<div className="flex items-center gap-2">
				<Select value={selectedDisposition || ""} onValueChange={handleDispositionChange}>
					<SelectTrigger className="bg-background border-border text-foreground h-9 w-48">
						<SelectValue placeholder="Select disposition" />
					</SelectTrigger>
					<SelectContent>
						{dispositionChoices.map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{hasChanges && (
					<Button
						onClick={handleSave}
						disabled={isSaving}
						size="sm"
						className="bg-primary hover:bg-primary/90 text-white font-medium h-9"
					>
						{isSaving ? (
							<>Saving...</>
						) : (
							<>
								<Save className="w-4 h-4 mr-1" />
								Save
							</>
						)}
					</Button>
				)}
			</div>
		);
	}

	// Full card version
	return (
		<Card className="bg-card border-border">
			<CardHeader className="pb-3">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="text-foreground text-base">Review & Disposition</CardTitle>
						<p className="text-xs text-muted-foreground mt-1">Verify AI analysis and set disposition</p>
					</div>
					<Select value={selectedDisposition || ""} onValueChange={handleDispositionChange}>
						<SelectTrigger className="bg-background border-border text-foreground h-10 w-full sm:w-56">
							<SelectValue placeholder="Select disposition" />
						</SelectTrigger>
						<SelectContent>
							{dispositionChoices.map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{/* Save Button - keep height consistent to avoid layout jump */}
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
									Save Disposition
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
