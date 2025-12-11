"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, User, Mail, Phone, Building2, Tag } from "lucide-react"
import type { TaskView } from "@/lib/types"

interface CrmUpdateViewProps {
	task: TaskView
}

export function CrmUpdateView({ task }: CrmUpdateViewProps) {
	return (
		<div className="space-y-6">
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Lead Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="lead-name" className="text-foreground">
								Lead Name *
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="lead-name"
									placeholder="John Smith"
									className="bg-background border-border text-foreground pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lead-email" className="text-foreground">
								Email Address
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="lead-email"
									type="email"
									placeholder="john.smith@example.com"
									className="bg-background border-border text-foreground pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lead-phone" className="text-foreground">
								Phone Number
							</Label>
							<div className="relative">
								<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="lead-phone"
									type="tel"
									placeholder="+1 (555) 123-4567"
									className="bg-background border-border text-foreground pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lead-company" className="text-foreground">
								Company Name
							</Label>
							<div className="relative">
								<Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="lead-company"
									placeholder="Acme Corporation"
									className="bg-background border-border text-foreground pl-10"
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Lead Status & Classification</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="lead-status" className="text-foreground">
								Lead Status
							</Label>
							<Select>
								<SelectTrigger className="bg-background border-border text-foreground">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="new">New</SelectItem>
									<SelectItem value="contacted">Contacted</SelectItem>
									<SelectItem value="qualified">Qualified</SelectItem>
									<SelectItem value="proposal">Proposal Sent</SelectItem>
									<SelectItem value="negotiation">Negotiation</SelectItem>
									<SelectItem value="won">Won</SelectItem>
									<SelectItem value="lost">Lost</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lead-stage" className="text-foreground">
								Sales Stage
							</Label>
							<Select>
								<SelectTrigger className="bg-background border-border text-foreground">
									<SelectValue placeholder="Select stage" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="prospecting">Prospecting</SelectItem>
									<SelectItem value="qualification">Qualification</SelectItem>
									<SelectItem value="needs-analysis">Needs Analysis</SelectItem>
									<SelectItem value="value-proposition">Value Proposition</SelectItem>
									<SelectItem value="id-decision-makers">ID Decision Makers</SelectItem>
									<SelectItem value="perception-analysis">Perception Analysis</SelectItem>
									<SelectItem value="proposal">Proposal</SelectItem>
									<SelectItem value="negotiation">Negotiation</SelectItem>
									<SelectItem value="closed-won">Closed Won</SelectItem>
									<SelectItem value="closed-lost">Closed Lost</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="lead-tags" className="text-foreground">
							Tags
						</Label>
						<div className="relative">
							<Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="lead-tags"
								placeholder="e.g., hot-lead, enterprise, follow-up"
								className="bg-background border-border text-foreground pl-10"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Separate multiple tags with commas
						</p>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Additional Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="lead-notes" className="text-foreground">
							Notes / Comments
						</Label>
						<Textarea
							id="lead-notes"
							placeholder="Add any additional notes or comments about this lead..."
							className="bg-background border-border text-foreground min-h-32"
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="lead-value" className="text-foreground">
								Estimated Deal Value
							</Label>
							<Input
								id="lead-value"
								type="number"
								placeholder="50000"
								className="bg-background border-border text-foreground"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lead-probability" className="text-foreground">
								Win Probability (%)
							</Label>
							<Input
								id="lead-probability"
								type="number"
								min="0"
								max="100"
								placeholder="75"
								className="bg-background border-border text-foreground"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">CRM Integration</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
						<Database className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-semibold text-foreground">Connected CRM</p>
							<p className="text-sm text-muted-foreground">Salesforce / HubSpot / Custom CRM</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-3">
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">
					<Database className="w-4 h-4 mr-2" />
					Update CRM
				</Button>
				<Button variant="outline" className="border-border text-foreground hover:bg-muted">
					Save as Draft
				</Button>
			</div>
		</div>
	)
}


