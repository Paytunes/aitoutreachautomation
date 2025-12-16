"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Mail, Upload, Link as LinkIcon, X } from "lucide-react"
import type { TaskView } from "@/lib/types"

interface CaseStudiesDeckViewProps {
	task: TaskView
}

export function CaseStudiesDeckView({ task }: CaseStudiesDeckViewProps) {
	const [attachments, setAttachments] = useState<File[]>([])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || [])
		if (files.length) {
			setAttachments((prev) => [...prev, ...files])
			event.target.value = ""
		}
	}

	const removeAttachment = (name: string) => {
		setAttachments((prev) => prev.filter((file) => file.name !== name))
	}

	return (
		<div className="space-y-6">
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

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label className="text-foreground">Attachments</Label>
							<label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background text-foreground cursor-pointer hover:bg-muted transition-colors">
								<Upload className="w-4 h-4" />
								<span className="text-sm">Upload files</span>
								<input
									type="file"
									multiple
									className="hidden"
									onChange={handleFileChange}
								/>
							</label>
						</div>
						{attachments.length === 0 ? (
							<p className="text-sm text-muted-foreground">No attachments added.</p>
						) : (
							<div className="flex flex-wrap gap-2">
								{attachments.map((file) => (
									<div
										key={file.name}
										className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/50"
									>
										<FileText className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm text-foreground">{file.name}</span>
										<button
											type="button"
											onClick={() => removeAttachment(file.name)}
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}
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


