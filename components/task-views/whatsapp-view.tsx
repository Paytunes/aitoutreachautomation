"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Phone, Paperclip, X, FileText } from "lucide-react"
import type { TaskView } from "@/lib/types"

interface WhatsAppViewProps {
	task: TaskView
}

export function WhatsAppView({ task }: WhatsAppViewProps) {
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
					<CardTitle className="text-foreground">WhatsApp Message</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="whatsapp-number" className="text-foreground">
							Phone Number (WhatsApp)
						</Label>
						<div className="relative">
							<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<input
								id="whatsapp-number"
								type="tel"
								placeholder="+1 555 123 4567"
								className="w-full px-3 py-2 pl-10 rounded-md border border-border bg-background text-foreground"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Include country code (e.g., +1 for USA, +91 for India)
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="whatsapp-message" className="text-foreground">
							Message Content
						</Label>
						<Textarea
							id="whatsapp-message"
							placeholder="Type your WhatsApp message here..."
							className="bg-background border-border text-foreground min-h-40"
							defaultValue="Hi [Name],

Thank you for your interest in our services. I wanted to follow up on our conversation.

[Your message here]

Looking forward to hearing from you!

Best regards,
[Your Name]"
						/>
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<p>Character count: 0 / 4096</p>
							<p>Supports emojis and formatting</p>
						</div>
					</div>
					
					<div className="space-y-2 pt-2">
						<label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background text-foreground cursor-pointer hover:bg-muted transition-colors w-fit">
							<Paperclip className="w-4 h-4" />
							<span className="text-sm">Attach File / Media</span>
							<input type="file" multiple className="hidden" onChange={handleFileChange} />
						</label>
						{attachments.length > 0 && (
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
					<CardTitle className="text-foreground">Message Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="p-4 rounded-lg border border-border bg-green-50 dark:bg-green-950/20">
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
								<MessageSquare className="w-4 h-4 text-white" />
							</div>
							<div className="flex-1">
								<div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
									<p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
										Preview of your message will appear here...
									</p>
								</div>
								<p className="text-xs text-muted-foreground mt-2">WhatsApp message preview</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-3">
				<Button className="bg-green-600 hover:bg-green-700 text-white">
					<MessageSquare className="w-4 h-4 mr-2" />
					Send WhatsApp Message
				</Button>
				<Button variant="outline" className="border-border text-foreground hover:bg-muted">
					Save as Draft
				</Button>
			</div>
		</div>
	)
}


