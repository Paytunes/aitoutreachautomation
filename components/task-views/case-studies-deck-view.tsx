"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Mail, Upload, Link as LinkIcon } from "lucide-react"
import type { TaskView } from "@/lib/types"

interface CaseStudiesDeckViewProps {
	task: TaskView
}

export function CaseStudiesDeckView({ task }: CaseStudiesDeckViewProps) {
	return (
		<div className="space-y-6">
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Select Documents to Send</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
							<Checkbox id="case-study-1" className="mt-1" />
							<div className="flex-1">
								<Label htmlFor="case-study-1" className="text-foreground cursor-pointer">
									Case Study: Enterprise Success Story
								</Label>
								<p className="text-xs text-muted-foreground mt-1">
									PDF - 2.4 MB - Last updated: Nov 15, 2024
								</p>
							</div>
							<FileText className="w-5 h-5 text-muted-foreground" />
						</div>
						<div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
							<Checkbox id="case-study-2" className="mt-1" />
							<div className="flex-1">
								<Label htmlFor="case-study-2" className="text-foreground cursor-pointer">
									Case Study: SMB Growth Case
								</Label>
								<p className="text-xs text-muted-foreground mt-1">
									PDF - 1.8 MB - Last updated: Nov 20, 2024
								</p>
							</div>
							<FileText className="w-5 h-5 text-muted-foreground" />
						</div>
						<div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
							<Checkbox id="product-deck" className="mt-1" />
							<div className="flex-1">
								<Label htmlFor="product-deck" className="text-foreground cursor-pointer">
									Product Overview Deck
								</Label>
								<p className="text-xs text-muted-foreground mt-1">
									PDF - 3.2 MB - Last updated: Dec 1, 2024
								</p>
							</div>
							<FileText className="w-5 h-5 text-muted-foreground" />
						</div>
						<div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
							<Checkbox id="pricing-sheet" className="mt-1" />
							<div className="flex-1">
								<Label htmlFor="pricing-sheet" className="text-foreground cursor-pointer">
									Pricing Sheet 2024
								</Label>
								<p className="text-xs text-muted-foreground mt-1">
									PDF - 856 KB - Last updated: Nov 28, 2024
								</p>
							</div>
							<FileText className="w-5 h-5 text-muted-foreground" />
						</div>
					</div>

					<div className="pt-4 border-t border-border">
						<Button variant="outline" className="border-border text-foreground hover:bg-muted">
							<Upload className="w-4 h-4 mr-2" />
							Upload Custom Document
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Email Content</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email-subject" className="text-foreground">
							Email Subject
						</Label>
						<input
							id="email-subject"
							type="text"
							defaultValue="Case Studies and Product Deck - [Company Name]"
							className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email-body" className="text-foreground">
							Email Body
						</Label>
						<Textarea
							id="email-body"
							defaultValue="Hi [Name],

As discussed, please find attached the case studies and product deck for your review.

Looking forward to your feedback.

Best regards,
[Your Name]"
							className="bg-background border-border text-foreground min-h-32"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="custom-link" className="text-foreground">
							Custom Link (Optional)
						</Label>
						<div className="relative">
							<LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<input
								id="custom-link"
								type="url"
								placeholder="https://..."
								className="w-full px-3 py-2 pl-10 rounded-md border border-border bg-background text-foreground"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Recipient Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
						<Mail className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-semibold text-foreground">Email will be sent to:</p>
							<p className="text-sm text-muted-foreground">Lead's email address from CRM</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-3">
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">
					<Mail className="w-4 h-4 mr-2" />
					Send Documents
				</Button>
				<Button variant="outline" className="border-border text-foreground hover:bg-muted">
					Save as Draft
				</Button>
			</div>
		</div>
	)
}


