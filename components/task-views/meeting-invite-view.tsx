"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, User, Mail, MapPin } from "lucide-react"
import type { TaskView } from "@/lib/types"

interface MeetingInviteViewProps {
	task: TaskView
}

export function MeetingInviteView({ task }: MeetingInviteViewProps) {
	return (
		<div className="space-y-6">
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Meeting Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="meeting-title" className="text-foreground">
								Meeting Title
							</Label>
							<Input
								id="meeting-title"
								placeholder="e.g., Product Demo with John Smith"
								className="bg-background border-border text-foreground"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="meeting-date" className="text-foreground">
								Meeting Date
							</Label>
							<div className="relative">
								<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="meeting-date"
									type="date"
									className="bg-background border-border text-foreground pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="meeting-time" className="text-foreground">
								Meeting Time
							</Label>
							<div className="relative">
								<Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="meeting-time"
									type="time"
									className="bg-background border-border text-foreground pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="meeting-duration" className="text-foreground">
								Duration (minutes)
							</Label>
							<Input
								id="meeting-duration"
								type="number"
								placeholder="30"
								className="bg-background border-border text-foreground"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="meeting-location" className="text-foreground">
							Location / Meeting Link
						</Label>
						<div className="relative">
							<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="meeting-location"
								placeholder="Zoom link, Google Meet, or physical address"
								className="bg-background border-border text-foreground pl-10"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="attendees" className="text-foreground">
							Attendees
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="attendees"
								placeholder="Email addresses (comma separated)"
								className="bg-background border-border text-foreground pl-10"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="meeting-notes" className="text-foreground">
							Meeting Notes / Agenda
						</Label>
						<Textarea
							id="meeting-notes"
							placeholder="Add agenda items or notes for the meeting..."
							className="bg-background border-border text-foreground min-h-24"
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Email Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 p-4 rounded-lg border border-border bg-muted/30">
						<div className="flex items-center gap-2 mb-4">
							<Mail className="w-4 h-4 text-muted-foreground" />
							<p className="text-sm font-semibold text-foreground">Email will be sent to:</p>
						</div>
						<p className="text-sm text-muted-foreground">
							Subject: Meeting Invitation - [Meeting Title]
						</p>
						<p className="text-sm text-muted-foreground mt-2">
							The meeting invitation will include all the details above and be sent to the
							attendees.
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-3">
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">
					Send Meeting Invite
				</Button>
				<Button variant="outline" className="border-border text-foreground hover:bg-muted">
					Save as Draft
				</Button>
			</div>
		</div>
	)
}


