import { getCallAuditById, getActionables } from "@/lib/mock-api";
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

	// Get all actionables (all 5 actionables)
	const allActionables = getActionables();

	// Get recommended actionables (the ones in audit.actionables)
	const recommendedActionableIds = audit.actionables || [];

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
					{/* Lead Information */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-4">
							<CardTitle className="text-foreground text-base">Lead Information</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-5">
								{/* Personal Information */}
								<div>
									<p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
										Personal Information
									</p>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="flex items-start gap-3">
											<User className="w-5 h-5 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Lead Name</p>
												<Link
													href={`/crm/leads/${audit.lead.id}`}
													className="text-base font-medium text-foreground hover:text-primary transition-colors underline"
												>
													{audit.lead.name}
												</Link>
											</div>
										</div>
										{audit.lead.job_title && (
											<div className="flex items-start gap-3">
												<Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">Job Title</p>
													<p className="text-base font-medium text-foreground">
														{audit.lead.job_title}
													</p>
												</div>
											</div>
										)}
										<div className="flex items-start gap-3">
											<Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Phone Number</p>
												<p className="text-base font-medium text-foreground font-mono">
													{audit.phone_number}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-3">
											<Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Email</p>
												<p className="text-base font-medium text-foreground">
													{audit.lead.email || "—"}
												</p>
											</div>
										</div>
										{audit.email_captured !== undefined && (
											<div className="flex items-start gap-3">
												<Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">Email Captured</p>
													<p className="text-base font-medium text-foreground">
														{audit.email_captured ? "Yes" : "No"}
													</p>
												</div>
											</div>
										)}
										<div className="flex items-start gap-3">
											<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Call Date</p>
												<p className="text-base font-medium text-foreground">
													{formatDate(audit.created_at)}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Company Information */}
								{(audit.lead.company ||
									audit.lead.company_type ||
									audit.lead.company_zone ||
									audit.lead.company_solution ||
									audit.lead.company_nickname ||
									audit.is_company_name_wrong !== undefined) && (
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
											Company Information
										</p>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{audit.lead.company && (
												<div className="flex items-start gap-3">
													<Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
													<div className="flex-1">
														<p className="text-sm text-muted-foreground">Company Name</p>
														<p className="text-base font-medium text-foreground">
															{audit.lead.company}
														</p>
													</div>
												</div>
											)}
											{audit.is_company_name_wrong !== undefined && (
												<div className="flex items-start gap-3">
													<AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-sm text-muted-foreground">
															Is Company Name Wrong
														</p>
														<p className="text-base font-medium text-foreground">
															{audit.is_company_name_wrong ? "Yes" : "No"}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_type && (
												<div className="flex items-start gap-3">
													<Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-sm text-muted-foreground">Type</p>
														<p className="text-base font-medium text-foreground">
															{audit.lead.company_type}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_zone && (
												<div className="flex items-start gap-3">
													<MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-sm text-muted-foreground">Zone</p>
														<p className="text-base font-medium text-foreground">
															{audit.lead.company_zone}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_solution && (
												<div className="flex items-start gap-3">
													<Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-sm text-muted-foreground">Solution</p>
														<p className="text-base font-medium text-foreground">
															{formatSolutionName(audit.lead.company_solution)}
														</p>
													</div>
												</div>
											)}
											{audit.lead.company_nickname && (
												<div className="flex items-start gap-3">
													<Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-sm text-muted-foreground">Nickname</p>
														<p className="text-base font-medium text-foreground">
															{audit.lead.company_nickname}
														</p>
													</div>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Call Recording */}
					<Card className="bg-card border-border">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-foreground text-base">Call Recording</CardTitle>
							<Badge variant="outline" className="text-xs">
								Call ID: {audit.call_id}
							</Badge>
						</CardHeader>
						<CardContent className="pt-0">
							<AudioPlayer duration={audit.call_duration || 202} src={audit.call_url} />
							{audit.call_summary && (
								<div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 max-h-40 overflow-y-auto">
									<p className="text-sm font-semibold text-foreground mb-2">Call Summary</p>
									<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
										{audit.call_summary}
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-5">
					{/* Actionable Items */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-3">
							<CardTitle className="text-foreground text-base">Actionable Items</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<ActionablesSection
								actionables={allActionables}
								auditId={audit.id}
								leadName={audit.lead.name}
								recommendedActionableIds={recommendedActionableIds}
							/>
						</CardContent>
					</Card>

					{/* Review & Disposition */}
					<DispositionSelector
						defaultDisposition={defaultDisposition}
						// Fixes type error by mapping readonly tuples to mutable ones
						dispositionChoices={DISPOSITION_CHOICES.map((d) => [d[0], d[1]]) as [string, string][]}
						auditId={audit.id}
					/>

					{/* Call Details */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-4">
							<CardTitle className="text-foreground text-base">Call Details</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<Phone className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Call Status</p>
										<p className="text-sm font-medium text-foreground">
											{audit.call_status || "—"}
										</p>
									</div>
								</div>
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
									{audit.voicemail_detected ? (
										<CheckCircle2 className="w-5 h-5 text-blue-600" />
									) : (
										<XCircle className="w-5 h-5 text-gray-400" />
									)}
									<div>
										<p className="text-sm text-muted-foreground">Voicemail</p>
										<p className="text-sm font-medium text-foreground">
											{audit.voicemail_detected ? "Detected" : "Not Detected"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Call Duration</p>
										<p className="text-sm font-medium text-foreground">
											{audit.call_duration
												? `${Math.round(audit.call_duration / 60)}m ${
														audit.call_duration % 60
												  }s`
												: "—"}
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
