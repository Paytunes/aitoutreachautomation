"use client";

import { useState, useEffect } from "react";
import { getCallAudits, getCampaigns, getDispositions } from "@/lib/mock-api";
import type { CallAuditView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, ArrowUp, ArrowDown, ArrowUpDown, X } from "lucide-react";

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

type SortColumn = "call_id" | "lead" | "campaign" | "phone" | "duration" | "disposition" | "interest" | "status";
type SortDirection = "asc" | "desc";

interface SortConfig {
	column: SortColumn;
	direction: SortDirection;
}

export default function CallAuditsPage() {
	const [allAudits, setAllAudits] = useState<CallAuditView[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [campaignFilter, setCampaignFilter] = useState("");
	const [dispositionFilter, setDispositionFilter] = useState("");
	const [campaigns, setCampaigns] = useState<ReturnType<typeof getCampaigns>>([]);
	const [dispositions, setDispositions] = useState<string[]>([]);

	// Sort states - default sort on Duration descending
	const [sorts, setSorts] = useState<SortConfig[]>([{ column: "duration", direction: "desc" }]);

	const limit = 10;

	// Load filters data
	useEffect(() => {
		setCampaigns(getCampaigns());
		setDispositions(getDispositions());
	}, []);

	// Load all audits (for proper sorting across all data)
	useEffect(() => {
		const loadAudits = async () => {
			setLoading(true);
			// Load a large number to get all audits for sorting
			const result = await getCallAudits(1, 1000, {
				campaign_id: campaignFilter || undefined,
				disposition: dispositionFilter || undefined,
			});
			setAllAudits(result.data);
			setTotal(result.total);
			setLoading(false);
		};
		loadAudits();
	}, [campaignFilter, dispositionFilter]);

	// Filter by search query
	const filteredAudits = allAudits.filter(
		(audit) =>
			audit.lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			audit.call_id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Apply sorting
	const sortedAudits = [...filteredAudits].sort((a, b) => {
		for (const sort of sorts) {
			let comparison = 0;

			switch (sort.column) {
				case "call_id":
					comparison = a.call_id.localeCompare(b.call_id);
					break;
				case "lead":
					comparison = a.lead.name.localeCompare(b.lead.name);
					break;
				case "campaign":
					comparison = a.campaign.name.localeCompare(b.campaign.name);
					break;
				case "phone":
					comparison = a.phone_number.localeCompare(b.phone_number);
					break;
				case "duration":
					const durationA = a.call_duration || 0;
					const durationB = b.call_duration || 0;
					comparison = durationA - durationB;
					break;
				case "disposition":
					const dispA = getDispositionLabel(a.dispositions);
					const dispB = getDispositionLabel(b.dispositions);
					comparison = dispA.localeCompare(dispB);
					break;
				case "interest":
					const interestA = a.interest_level || 0;
					const interestB = b.interest_level || 0;
					comparison = interestA - interestB;
					break;
				case "status":
					const statusA = a.call_status || "";
					const statusB = b.call_status || "";
					comparison = statusA.localeCompare(statusB);
					break;
			}

			if (comparison !== 0) {
				return sort.direction === "asc" ? comparison : -comparison;
			}
		}
		return 0;
	});

	// Apply pagination after sorting
	const totalFiltered = sortedAudits.length;
	const totalPages = Math.ceil(totalFiltered / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedAudits = sortedAudits.slice(startIndex, endIndex);

	// Handle column sort click - single column sorting only
	const handleSort = (column: SortColumn, e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		setSorts((prevSorts) => {
			const existingSort = prevSorts.find((s) => s.column === column);

			if (existingSort) {
				// Column is already sorted - cycle direction: desc -> asc -> desc
				if (existingSort.direction === "desc") {
					// Change to asc (single column only)
					return [{ column, direction: "asc" }];
				} else {
					// Change back to desc (single column only)
					return [{ column, direction: "desc" }];
				}
			} else {
				// New column - add as single sort (asc first)
				return [{ column, direction: "asc" }];
			}
		});
		setPage(1); // Reset to first page when sorting changes
	};

	// Get sort icon for a column
	const getSortIcon = (column: SortColumn) => {
		const sort = sorts.find((s) => s.column === column);
		if (!sort) return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
		return sort.direction === "asc" ? (
			<ArrowUp className="w-4 h-4 text-primary" />
		) : (
			<ArrowDown className="w-4 h-4 text-primary" />
		);
	};

	// Remove a specific sort
	const removeSort = (column: SortColumn, e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		setSorts((prevSorts) => {
			const newSorts = prevSorts.filter((s) => s.column !== column);
			// If no sorts remain, restore default duration sort
			if (newSorts.length === 0) {
				return [{ column: "duration", direction: "desc" }];
			}
			return newSorts;
		});
		setPage(1); // Reset to first page when sort is removed
	};

	const getDispositionColor = (disposition?: string) => {
		switch (disposition) {
			case "meeting_scheduled":
				return "bg-green-500/10 text-green-700 border-green-500/30";
			case "whatsapp_requested":
				return "bg-blue-500/10 text-blue-700 border-blue-500/30";
			case "follow_up_needed":
				return "bg-amber-500/10 text-amber-700 border-amber-500/30";
			case "case_studies_requested":
				return "bg-purple-500/10 text-purple-700 border-purple-500/30";
			case "callback_requested":
				return "bg-cyan-500/10 text-cyan-700 border-cyan-500/30";
			case "share_deck":
				return "bg-indigo-500/10 text-indigo-700 border-indigo-500/30";
			case "voicemail":
				return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30";
			case "technical_issues":
				return "bg-orange-500/10 text-orange-700 border-orange-500/30";
			case "wrong_company":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "wrong_person":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "not_interested":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "dnd_requested":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "NA":
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
			default:
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
		}
	};

	const getCallStatusColor = (status?: string) => {
		switch (status) {
			case "ANSWERED":
				return "bg-green-500/10 text-green-700 border-green-500/30";
			case "NO ANSWER":
				return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30";
			case "BUSY":
				return "bg-orange-500/10 text-orange-700 border-orange-500/30";
			case "FAILED":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "NA":
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
			default:
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
		}
	};

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Filters Card */}
			<Card className="bg-card border-border">
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
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
						<div className="w-full">
							<Select
								value={campaignFilter || "all"}
								onValueChange={(value) => {
									setCampaignFilter(value === "all" ? "" : value);
									setPage(1);
								}}
							>
								<SelectTrigger className="bg-background text-foreground border-border w-full">
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
						</div>

						{/* Disposition Filter */}
						<div className="w-full">
							<Select
								value={dispositionFilter || "all"}
								onValueChange={(value) => {
									setDispositionFilter(value === "all" ? "" : value);
									setPage(1);
								}}
							>
								<SelectTrigger className="bg-background text-foreground border-border w-full">
									<SelectValue placeholder="Filter by disposition" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Dispositions</SelectItem>
									{dispositions.map((disposition) => (
										<SelectItem key={disposition} value={disposition}>
											{getDispositionLabel(disposition)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Reset Button */}
						<Button
							onClick={() => {
								setSearchQuery("");
								setCampaignFilter("");
								setDispositionFilter("");
								setPage(1);
								setSorts([{ column: "duration", direction: "desc" }]);
							}}
							variant="outline"
							className="border-border text-foreground hover:bg-muted w-full sm:w-auto"
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
						Call Audits ({totalFiltered}{" "}
						{searchQuery || campaignFilter || dispositionFilter ? `filtered` : ""} of {total})
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
								<p className="text-muted-foreground">No call audits found</p>
							</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow className="border-border">
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("call_id", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Call ID
													{getSortIcon("call_id")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("lead", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Lead
													{getSortIcon("lead")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("campaign", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Campaign
													{getSortIcon("campaign")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("phone", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Phone
													{getSortIcon("phone")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("duration", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Duration
													{getSortIcon("duration")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("disposition", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Disposition
													{getSortIcon("disposition")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("interest", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Interest
													{getSortIcon("interest")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={(e) => handleSort("status", e)}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left cursor-pointer"
												>
													Call Status
													{getSortIcon("status")}
												</button>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{paginatedAudits.map((audit) => (
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
														className={getCallStatusColor(audit.call_status)}
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
