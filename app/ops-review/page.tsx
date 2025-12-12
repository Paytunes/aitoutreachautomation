"use client";

import { useState, useEffect, useMemo } from "react";
import { getCallAudits, getCampaigns } from "@/lib/mock-api";
import type { CallAuditView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, AlertCircle, TrendingUp } from "lucide-react";
import { useRole } from "@/lib/role-context";

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

// Helper function to get disposition label from value
const getDispositionLabel = (value?: string): string => {
	if (!value) return "—";
	const choice = DISPOSITION_CHOICES.find(([val]) => val === value);
	return choice ? choice[1] : value;
};

export default function OpsReviewQueuePage() {
	const [allAudits, setAllAudits] = useState<CallAuditView[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [campaignFilter, setCampaignFilter] = useState("");
	const [campaigns, setCampaigns] = useState<ReturnType<typeof getCampaigns>>([]);
	const { role } = useRole();

	const limit = 10;

	// Load filters data
	useEffect(() => {
		setCampaigns(getCampaigns());
	}, []);

	// Load all audits for filtering
	useEffect(() => {
		const loadAudits = async () => {
			setLoading(true);
			// Load a large number to get all audits for executive review
			const result = await getCallAudits(1, 1000, {
				campaign_id: campaignFilter || undefined,
			});
			setAllAudits(result.data);
			setLoading(false);
		};
		loadAudits();
	}, [campaignFilter]);

	// Filter audits for executive review queue
	// Priority: High interest level (>=7), positive dispositions, or pending actionables
	const reviewQueueAudits = useMemo(() => {
		const negativeDispositions = ["not_interested", "wrong_company", "wrong_person", "dnd_requested"];
		
		return allAudits.filter((audit) => {
			// High interest level calls
			const hasHighInterest = (audit.interest_level || 0) >= 7;
			
			// Positive dispositions (not negative ones)
			const hasPositiveDisposition =
				audit.dispositions &&
				!negativeDispositions.includes(audit.dispositions) &&
				audit.dispositions !== "NA";
			
			// Has pending actionables
			const hasPendingActions = audit.actionables && audit.actionables.length > 0;
			
			// Include if high interest OR (positive disposition AND has pending actions)
			return hasHighInterest || (hasPositiveDisposition && hasPendingActions);
		});
	}, [allAudits]);

	// Filter by search query
	const filteredAudits = reviewQueueAudits.filter(
		(audit) =>
			audit.lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			audit.call_id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Pagination
	const totalPages = Math.ceil(filteredAudits.length / limit);
	const start = (page - 1) * limit;
	const end = start + limit;
	const paginatedAudits = filteredAudits.slice(start, end);

	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [searchQuery, campaignFilter]);

	const getDispositionColor = (disposition?: string) => {
		switch (disposition) {
			case "Interested":
				return "bg-green-500/10 text-green-700 border-green-500/30";
			case "Not Interested":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "Warm Lead":
				return "bg-blue-500/10 text-blue-700 border-blue-500/30";
			case "Claim Processed":
				return "bg-purple-500/10 text-purple-700 border-purple-500/30";
			default:
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
		}
	};

	const getPriorityBadge = (audit: CallAuditView) => {
		const interestLevel = audit.interest_level || 0;
		if (interestLevel >= 8) {
			return (
				<Badge className="bg-red-500/10 text-red-700 border-red-500/30">
					<AlertCircle className="w-3 h-3 mr-1" />
					High Priority
				</Badge>
			);
		} else if (interestLevel >= 7) {
			return (
				<Badge className="bg-orange-500/10 text-orange-700 border-orange-500/30">
					<TrendingUp className="w-3 h-3 mr-1" />
					Medium Priority
				</Badge>
			);
		}
		return null;
	};

	return (
		<div className="flex-1 space-y-6 p-6 lg:p-10">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Ops Review Queue</h1>
				<p className="text-muted-foreground">
					High-priority call audits requiring executive review and attention
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total in Queue</p>
								<p className="text-2xl font-bold text-foreground">{filteredAudits.length}</p>
							</div>
							<AlertCircle className="w-8 h-8 text-primary" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">High Priority</p>
								<p className="text-2xl font-bold text-foreground">
									{filteredAudits.filter((a) => (a.interest_level || 0) >= 8).length}
								</p>
							</div>
							<TrendingUp className="w-8 h-8 text-red-500" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">With Actionables</p>
								<p className="text-2xl font-bold text-foreground">
									{filteredAudits.filter((a) => a.actionables && a.actionables.length > 0).length}
								</p>
							</div>
							<AlertCircle className="w-8 h-8 text-blue-500" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters Card */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Filters</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{/* Search Input */}
						<div className="relative">
							<Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search by name or call ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-background text-foreground border-border"
							/>
						</div>

						{/* Campaign Filter */}
						<Select
							value={campaignFilter}
							onValueChange={(value) => {
								setCampaignFilter(value === "all" ? "" : value);
							}}
						>
							<SelectTrigger className="bg-background text-foreground border-border">
								<SelectValue placeholder="Filter by campaign" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Campaigns</SelectItem>
								{campaigns.map((campaign) => (
									<SelectItem key={campaign.id} value={campaign.id}>
										{campaign.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Reset Button */}
						<Button
							onClick={() => {
								setSearchQuery("");
								setCampaignFilter("");
								setPage(1);
							}}
							variant="outline"
							className="border-border text-foreground hover:bg-muted"
						>
							Reset Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Table Card */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">
						Review Queue ({filteredAudits.length} {filteredAudits.length === 1 ? "item" : "items"})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">Loading...</p>
							</div>
						) : paginatedAudits.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">No items in review queue</p>
							</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow className="border-border">
											<TableHead className="text-foreground">Priority</TableHead>
											<TableHead className="text-foreground">Call ID</TableHead>
											<TableHead className="text-foreground">Lead</TableHead>
											<TableHead className="text-foreground">Campaign</TableHead>
											<TableHead className="text-foreground">Duration</TableHead>
											<TableHead className="text-foreground">Disposition</TableHead>
											<TableHead className="text-foreground">Interest</TableHead>
											<TableHead className="text-foreground">Actionables</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{paginatedAudits.map((audit) => (
											<TableRow key={audit.id} className="border-border hover:bg-muted/50">
												<TableCell>
													{getPriorityBadge(audit) || (
														<span className="text-xs text-muted-foreground">—</span>
													)}
												</TableCell>
												<TableCell className="font-mono text-sm">
													<Link
														href={`/call-audits/${audit.id}`}
														className="text-primary hover:underline"
													>
														{audit.call_id}
													</Link>
												</TableCell>
												<TableCell className="text-sm">{audit.lead.name}</TableCell>
												<TableCell className="text-sm">{audit.campaign.name}</TableCell>
												<TableCell className="text-sm">
													{audit.call_duration
														? `${(audit.call_duration / 60).toFixed(1)}m`
														: "—"}
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={getDispositionColor(audit.dispositions)}
													>
														{getDispositionLabel(audit.dispositions)}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<div className="w-20 bg-muted rounded h-2">
															<div
																className="bg-primary rounded h-2"
																style={{
																	width: `${
																		((audit.interest_level || 0) / 10) * 100
																	}%`,
																}}
															/>
														</div>
														<span className="text-sm font-medium">
															{audit.interest_level || 0}/10
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={
															audit.actionables && audit.actionables.length > 0
																? "bg-blue-500/10 text-blue-700 border-blue-500/30"
																: "bg-gray-500/10 text-gray-700 border-gray-500/30"
														}
													>
														{audit.actionables?.length || 0} actionables
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
										<p className="text-sm text-muted-foreground">
											Page {page} of {totalPages}
										</p>
										<div className="flex gap-2">
											<Button
												onClick={() => setPage(Math.max(1, page - 1))}
												disabled={page === 1}
												variant="outline"
												size="sm"
												className="border-border text-foreground hover:bg-muted disabled:opacity-50"
											>
												<ChevronLeft className="w-4 h-4 mr-1" />
												Previous
											</Button>
											<Button
												onClick={() => setPage(Math.min(totalPages, page + 1))}
												disabled={page === totalPages}
												variant="outline"
												size="sm"
												className="border-border text-foreground hover:bg-muted disabled:opacity-50"
											>
												Next
												<ChevronRight className="w-4 h-4 ml-1" />
											</Button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

