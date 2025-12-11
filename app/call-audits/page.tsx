"use client";

import { useState, useEffect } from "react";
import { getCallAudits, getCampaigns } from "@/lib/mock-api";
import type { CallAuditView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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

export default function CallAuditsPage() {
	const [audits, setAudits] = useState<CallAuditView[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [campaignFilter, setCampaignFilter] = useState("");
	const [dispositionFilter, setDispositionFilter] = useState("");
	const [campaigns, setCampaigns] = useState<ReturnType<typeof getCampaigns>>([]);

	const limit = 10;

	// Load filters data
	useEffect(() => {
		setCampaigns(getCampaigns());
	}, []);

	// Load audits
	useEffect(() => {
		const loadAudits = async () => {
			setLoading(true);
			const result = await getCallAudits(page, limit, {
				campaign_id: campaignFilter || undefined,
				disposition: dispositionFilter || undefined,
			});
			setAudits(result.data);
			setTotal(result.total);
			setLoading(false);
		};
		loadAudits();
	}, [page, campaignFilter, dispositionFilter]);

	// Filter by search query
	const filteredAudits = audits.filter(
		(audit) =>
			audit.lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			audit.call_id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(total / limit);

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

	return (
		<div className="flex-1 space-y-6 p-6 lg:p-10">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Call Audits</h1>
				<p className="text-muted-foreground">Review and manage call audit records</p>
			</div>

			{/* Filters Card */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Filters</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{/* Search Input */}
						<div className="relative">
							<Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search by name or call ID..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
								className="pl-10 bg-background text-foreground border-border"
							/>
						</div>

						{/* Campaign Filter */}
						<Select
							value={campaignFilter}
							onValueChange={(value) => {
								setCampaignFilter(value);
								setPage(1);
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

						{/* Disposition Filter */}
						<Select
							value={dispositionFilter}
							onValueChange={(value) => {
								setDispositionFilter(value === "all" ? "" : value);
								setPage(1);
							}}
						>
							<SelectTrigger className="bg-background text-foreground border-border">
								<SelectValue placeholder="Filter by disposition" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Dispositions</SelectItem>
								{DISPOSITION_CHOICES.map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Reset Button */}
						<Button
							onClick={() => {
								setSearchQuery("");
								setCampaignFilter("");
								setDispositionFilter("");
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
						Call Audits ({filteredAudits.length} of {total})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">Loading...</p>
							</div>
						) : filteredAudits.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">No call audits found</p>
							</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow className="border-border">
											<TableHead className="text-foreground">Call ID</TableHead>
											<TableHead className="text-foreground">Lead</TableHead>
											<TableHead className="text-foreground">Campaign</TableHead>
											<TableHead className="text-foreground">Phone</TableHead>
											<TableHead className="text-foreground">Duration</TableHead>
											<TableHead className="text-foreground">Disposition</TableHead>
											<TableHead className="text-foreground">Interest</TableHead>
											<TableHead className="text-foreground">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredAudits.map((audit) => (
											<TableRow key={audit.id} className="border-border hover:bg-muted/50">
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
												<TableCell className="text-sm font-mono">
													{audit.phone_number}
												</TableCell>
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
															audit.call_status === "completed"
																? "bg-green-500/10 text-green-700 border-green-500/30"
																: "bg-gray-500/10 text-gray-700 border-gray-500/30"
														}
													>
														{audit.call_status || "—"}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								{/* Pagination */}
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
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
