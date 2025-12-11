import { getCallAuditById, getActionables } from "@/lib/mock-api";
import { ActionablesSection } from "@/components/actionables-section";
import { AudioPlayer } from "@/components/audio-player";
import { AIInsightsCard } from "@/components/ai-insights-card";
import { CallAuditChart } from "@/components/call-audit-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Phone, Calendar, User, Building2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

	const actionableObjects = audit.actionables
		.map((id) => getActionables().find((a) => a.id === id))
		.filter(Boolean) as any[];

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

	return (
		<div className="flex-1 space-y-6 p-6 lg:p-10">
			{/* Header */}
			<div className="space-y-4">
				<Button asChild variant="ghost" className="text-foreground hover:bg-muted">
					<Link href="/call-audits">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Call Audits
					</Link>
				</Button>
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<h1 className="text-3xl font-bold text-foreground">Call Audit Details</h1>
						<p className="text-muted-foreground">Review and manage call interaction details</p>
					</div>
					<Badge
						variant="secondary"
						className="bg-blue-500/10 text-blue-700 border-blue-500/30 text-sm px-3 py-1"
					>
						{audit.campaign.name}
					</Badge>
				</div>
			</div>

			{/* Main Content: Two Equal Columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-6">
					{/* Lead Information */}
					<Card className="bg-card border-border">
						<CardHeader>
							<CardTitle className="text-foreground">Lead Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-start gap-3">
									<User className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">Lead Name</p>
										<p className="text-base font-semibold text-foreground">{audit.lead.name}</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">Phone Number</p>
										<p className="text-base font-semibold text-foreground font-mono">
											{audit.phone_number}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">Email</p>
										<p className="text-base font-semibold text-foreground">
											{audit.lead.email || "—"}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="text-sm text-muted-foreground">Call Date</p>
										<p className="text-base font-semibold text-foreground">
											{formatDate(audit.created_at)}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Call Recording */}
					<Card className="bg-card border-border">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-foreground">Call Recording</CardTitle>
							<Badge variant="outline" className="text-xs">
								Call ID: {audit.call_id}
							</Badge>
						</CardHeader>
						<CardContent>
							<AudioPlayer duration={audit.call_duration || 202} />
							{audit.call_summary && (
								<div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 max-h-48 overflow-y-auto">
									<p className="text-sm font-semibold text-foreground mb-3">Call Summary</p>
									<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
										{audit.call_summary}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Interest Level Chart */}
					<CallAuditChart
						interestLevel={audit.interest_level || 0}
						callDuration={audit.call_duration || 0}
						disposition={audit.dispositions || ""}
					/>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Actionable Items */}
					{actionableObjects && actionableObjects.length > 0 ? (
						<Card className="bg-card border-border">
							<CardHeader className="pb-3">
								<CardTitle className="text-foreground text-lg">Actionable Items</CardTitle>
								<p className="text-xs text-muted-foreground mt-1">
									Create tasks from detected actionables
								</p>
							</CardHeader>
							<CardContent>
								<ActionablesSection
									actionables={actionableObjects}
									auditId={audit.id}
									leadName={audit.lead.name}
								/>
							</CardContent>
						</Card>
					) : (
						<Card className="bg-card border-border">
							<CardHeader>
								<CardTitle className="text-foreground">Actionable Items</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									No actionable items found for this call.
								</p>
							</CardContent>
						</Card>
					)}

					{/* Review & Disposition */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-3">
							<CardTitle className="text-foreground text-lg">Review & Disposition</CardTitle>
							<p className="text-xs text-muted-foreground mt-1">Verify AI analysis and set disposition</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Disposition Dropdown */}
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
									Select Disposition
								</label>
								<Select defaultValue={defaultDisposition}>
									<SelectTrigger className="bg-background border-border text-foreground h-10">
										<SelectValue placeholder="Select Disposition" />
									</SelectTrigger>
									<SelectContent>
										{DISPOSITION_CHOICES.map(([value, label]) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Notes Section */}
							{audit.notes && (
								<div>
									<label className="text-sm font-medium text-foreground mb-2 block">Notes</label>
									<div className="rounded-lg border border-border bg-muted/30 p-3">
										<p className="text-sm text-muted-foreground whitespace-pre-line">
											{audit.notes}
										</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Call Status */}
					<Card className="bg-card border-border">
						<CardHeader>
							<CardTitle className="text-foreground">Call Status</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									{audit.rpc_verified ? (
										<CheckCircle2 className="w-5 h-5 text-green-600" />
									) : (
										<XCircle className="w-5 h-5 text-red-600" />
									)}
									<div>
										<p className="text-sm text-muted-foreground">RPC Verified</p>
										<p className="text-sm font-semibold text-foreground">
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
										<p className="text-sm font-semibold text-foreground">
											{audit.voicemail_detected ? "Detected" : "Not Detected"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Call Duration</p>
										<p className="text-sm font-semibold text-foreground">
											{audit.call_duration
												? `${Math.round(audit.call_duration / 60)}m ${
														audit.call_duration % 60
												  }s`
												: "—"}
										</p>
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
