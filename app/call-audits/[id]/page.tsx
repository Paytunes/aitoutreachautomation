import { getCallAuditById, getActionables, getRecommendedActionables, DISPOSITION_CHOICES } from "@/lib/mock-api";
import { ActionablesSection } from "@/components/actionables-section";
import { AudioPlayer } from "@/components/audio-player";
import { AIInsightsCard } from "@/components/ai-insights-card";
import { DispositionSelector } from "@/components/disposition-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ArrowLeft,
	Phone,
	Calendar,
	User,
	Building2,
	Clock,
	CheckCircle2,
	XCircle,
	Globe,
	Briefcase,
	Users,
	MapPin,
	Tag,
	Mail,
	AlertCircle,
} from "lucide-react";

export default async function CallAuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const audit = await getCallAuditById(id);

	if (!audit) {
		return (
			<div className="flex-1 space-y-6 p-6 lg:p-10">
				<Button asChild variant="ghost" className="text-foreground hover:bg-muted">
					<Link href="/call-audits">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Call Audits
					</Link>
				</Button>
				<div className="flex items-center justify-center h-96">
					<p className="text-muted-foreground text-lg">Call audit not found</p>
				</div>
			</div>
		);
	}

	// Get all actionables
	const allActionables = getActionables();

	// Get recommended actionables based on call audit properties
	const recommendedActionableIds = getRecommendedActionables(audit);

	// Find the matching disposition value from choices
	const defaultDisposition = audit.dispositions
		? DISPOSITION_CHOICES.find(([value]) => value === audit.dispositions)?.[0] ||
		  DISPOSITION_CHOICES.find(([, label]) => label === audit.dispositions)?.[0]
		: undefined;

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Format solution name for display
	const formatSolutionName = (solution?: string) => {
		if (!solution) return "—";
		return solution
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div className="flex-1 p-6 overflow-auto h-full">
			{/* Back Button */}
			<Button asChild variant="ghost" className="text-foreground hover:bg-muted mb-4">
				<Link href="/call-audits">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Call Audits
				</Link>
			</Button>

			{/* Main Content: Two Equal Columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-5">
					{/* Call Recording */}
					<Card className="bg-card border-border">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-foreground text-base">Call Recording</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<AudioPlayer duration={audit.call_duration || 202} src={audit.call_url} />
							{audit.call_summary && (
								<div className="mt-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 max-h-60 overflow-y-auto">
									<p className="text-sm font-bold text-foreground mb-2">Call Summary</p>
									<p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
										{audit.call_summary}
									</p>
								</div>
							)}
						</CardContent>
					</Card>
					{/* Lead Information - Compact */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-2">
							<CardTitle className="text-foreground text-sm">Lead Information</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-3">
								{/* Personal Information */}
								<div>
									<p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
										Personal Information
									</p>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
										<div className="flex items-start gap-2">
											<User className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
											<div className="min-w-0">
												<p className="text-xs text-muted-foreground">Lead Name</p>
												<p className="text-xs font-medium text-foreground truncate">
													{audit.lead.name}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
											<div className="min-w-0">
												<p className="text-xs text-muted-foreground">Phone</p>
												<p className="text-xs font-medium text-foreground font-mono truncate">
													{audit.phone_number}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
											<div className="min-w-0">
												<p className="text-xs text-muted-foreground">Email</p>
												<p className="text-xs font-medium text-foreground truncate">
													{audit.lead.email || "—"}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Company Information */}
								{(audit.lead.company ||
									audit.lead.company_type ||
									audit.lead.company_zone ||
									audit.campaign.solution ||
									audit.lead.company_solution ||
									audit.lead.company_nickname ||
									audit.is_company_name_wrong !== undefined) && (
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
											Company Information
										</p>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											{audit.lead.company && (
												<div className="flex items-start gap-2">
													<Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
													<div className="min-w-0 flex-1">
														<p className="text-xs text-muted-foreground">Company</p>
														<p className="text-xs font-medium text-foreground truncate">
															{audit.lead.company}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_type && (
												<div className="flex items-start gap-2">
													<Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
													<div className="min-w-0">
														<p className="text-xs text-muted-foreground">Type</p>
														<p className="text-xs font-medium text-foreground truncate">
															{audit.lead.company_type}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_zone && (
												<div className="flex items-start gap-2">
													<MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
													<div className="min-w-0">
														<p className="text-xs text-muted-foreground">Zone</p>
														<p className="text-xs font-medium text-foreground truncate">
															{audit.lead.company_zone}
														</p>
													</div>
												</div>
											)}
											{audit.campaign.solution && (
												<div className="flex items-start gap-2">
													<Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
													<div className="min-w-0">
														<p className="text-xs text-muted-foreground">Call Solution</p>
														<p className="text-xs font-medium text-foreground truncate">
															{formatSolutionName(audit.campaign.solution)}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_solution && (
												<div className="flex items-start gap-2 col-span-2 md:col-span-3">
													<Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
													<div className="min-w-0 flex-1">
														<p className="text-xs text-muted-foreground">
															Suggested Solution
														</p>
														<div className="flex flex-wrap gap-1 mt-0.5">
															{audit.lead.company_solution
																.split(",")
																.map((solution, idx, arr) => (
																	<span
																		key={idx}
																		className="text-xs font-medium text-foreground"
																	>
																		{formatSolutionName(solution.trim())}
																		{idx < arr.length - 1 && (
																			<span className="text-muted-foreground mx-0.5">
																				,
																			</span>
																		)}
																	</span>
																))}
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-5">
					{/* Actionable Items */}
					{/* Review & Disposition */}
					<DispositionSelector
						defaultDisposition={defaultDisposition}
						// Fixes type error by mapping readonly tuples to mutable ones
						dispositionChoices={DISPOSITION_CHOICES.map((d) => [d[0], d[1]]) as [string, string][]}
						auditId={audit.id}
					/>
					<Card className="bg-card border-2 border-primary/20 shadow-lg">
						<CardHeader className="pb-3 border-b border-primary/10">
							<CardTitle className="text-foreground text-lg font-bold">Actionable Items</CardTitle>
						</CardHeader>
						<CardContent className="pt-4">
							<ActionablesSection
								actionables={allActionables}
								auditId={audit.id}
								leadName={audit.lead.name}
								recommendedActionableIds={recommendedActionableIds}
							/>
						</CardContent>
					</Card>

					{/* Call Details */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-4">
							<CardTitle className="text-foreground text-base">Call Details</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									{audit.rpc_verified ? (
										<CheckCircle2 className="w-5 h-5 text-green-600" />
									) : (
										<XCircle className="w-5 h-5 text-red-600" />
									)}
									<div>
										<p className="text-sm text-muted-foreground">RPC Verified</p>
										<p className="text-sm font-medium text-foreground">
											{audit.rpc_verified ? "Verified" : "Not Verified"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Tag className="w-5 h-5 text-muted-foreground" />
									<div className="flex flex-col gap-1">
										<p className="text-sm text-muted-foreground">Interest</p>
										<div className="flex items-center gap-2">
											<div className="w-20 bg-muted rounded h-2">
												<div
													className="bg-primary rounded h-2"
													style={{ width: `${((audit.interest_level || 0) / 10) * 100}%` }}
												/>
											</div>
											<span className="text-sm font-medium text-foreground">
												{audit.interest_level || 0}/10
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
