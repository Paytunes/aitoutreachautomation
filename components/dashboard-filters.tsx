"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Filter } from "lucide-react";
import { getCampaigns } from "@/lib/mock-api";
import type { Vertical, AICallCampaign } from "@/lib/types";

// Disposition choices constant (from backend)
const DISPOSITION_CHOICES = [
	["meeting_scheduled", "Meeting Scheduled"],
	["whatsapp_requested", "Whatsapp Requested"],
	["follow_up_needed", "Follow Up Needed"],
	["case_studies_requested", "Case Studies Requested"],
	["callback_requested", "Callback Requested"],
	["share_deck", "Share Deck"],
	["voicemail", "Voicemail"],
	["technical_issues", "Technical Issues"],
	["wrong_company", "Wrong Company"],
	["wrong_person", "Wrong Person"],
	["not_interested", "Not Interested"],
	["dnd_requested", "DND Requested"],
	["NA", "NA"],
] as const;

export interface DashboardFilters {
	verticalId?: string;
	campaignId?: string;
	disposition?: string;
}

interface DashboardFiltersProps {
	filters: DashboardFilters;
	onFiltersChange: (filters: DashboardFilters) => void;
}

// Default verticals until API is created
const DEFAULT_VERTICALS: Vertical[] = [
	{ id: "1", name: "Paytunes" },
	{ id: "2", name: "Virsora" },
];

export function DashboardFiltersComponent({ filters, onFiltersChange }: DashboardFiltersProps) {
	const [verticals, setVerticals] = useState<Vertical[]>(DEFAULT_VERTICALS);
	const [campaigns, setCampaigns] = useState<AICallCampaign[]>([]);
	const [resetKey, setResetKey] = useState(0);

	// Load campaigns on mount
	useEffect(() => {
		setCampaigns(getCampaigns());

		// TODO: Replace with API call when backend is ready
		// const fetchVerticals = async () => {
		// 	try {
		// 		const response = await fetch("/api/verticals", {
		// 			method: "GET",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 		});
		// 		if (response.ok) {
		// 			const data = await response.json();
		// 			setVerticals(data);
		// 		}
		// 	} catch (error) {
		// 		console.error("Error fetching verticals:", error);
		// 	}
		// };
		// fetchVerticals();
	}, []);

	// Filter campaigns based on selected vertical
	const filteredCampaigns = filters.verticalId
		? campaigns.filter((c) => c.vertical_id === filters.verticalId)
		: campaigns;

	const handleFilterChange = (key: keyof DashboardFilters, value: string) => {
		// If value is empty string, set to undefined
		const filterValue = value && value.trim() !== "" ? value : undefined;
		const newFilters = { ...filters, [key]: filterValue };

		// If vertical changes, reset campaign filter
		if (key === "verticalId") {
			newFilters.campaignId = undefined;
		}

		onFiltersChange(newFilters);
	};

	const clearFilters = () => {
		onFiltersChange({});
		setResetKey((prev) => prev + 1); // Force re-render of Select components
	};

	const hasActiveFilters = filters.verticalId || filters.campaignId || filters.disposition;

	return (
		<Card className="bg-card border-border">
			<CardContent className="pt-6">
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
					<div className="flex items-center gap-2 text-sm font-medium text-foreground">
						<Filter className="w-4 h-4" />
						<span>Filters:</span>
					</div>

					<div className="flex flex-wrap gap-3 flex-1">
						{/* Vertical Filter */}
						<Select
							key={`vertical-${resetKey}`}
							value={filters.verticalId}
							onValueChange={(value) => handleFilterChange("verticalId", value)}
						>
							<SelectTrigger className="w-[180px] h-9">
								<SelectValue placeholder="All Verticals" />
							</SelectTrigger>
							<SelectContent>
								{verticals.map((vertical) => (
									<SelectItem key={vertical.id} value={vertical.id}>
										{vertical.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Campaign Filter */}
						<Select
							key={`campaign-${resetKey}`}
							value={filters.campaignId}
							onValueChange={(value) => handleFilterChange("campaignId", value)}
						>
							<SelectTrigger className="w-[200px] h-9">
								<SelectValue placeholder="All Campaigns" />
							</SelectTrigger>
							<SelectContent>
								{filteredCampaigns.map((campaign) => (
									<SelectItem key={campaign.id} value={campaign.id}>
										{campaign.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Disposition Filter */}
						<Select
							key={`disposition-${resetKey}`}
							value={filters.disposition}
							onValueChange={(value) => handleFilterChange("disposition", value)}
						>
							<SelectTrigger className="w-[180px] h-9">
								<SelectValue placeholder="All Dispositions" />
							</SelectTrigger>
							<SelectContent>
								{DISPOSITION_CHOICES.map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Clear Filters Button */}
						{hasActiveFilters && (
							<Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
								<X className="w-4 h-4 mr-1" />
								Clear
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
