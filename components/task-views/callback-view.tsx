"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Calendar, Clock, User } from "lucide-react"
import type { TaskView } from "@/lib/types"

interface CallbackViewProps {
	task: TaskView
}

export function CallbackView({ task }: CallbackViewProps) {
	return (
		<div className="space-y-6">
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Schedule Callback</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="callback-date" className="text-foreground">
								Preferred Date
							</Label>
							<div className="relative">
								<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<input
									id="callback-date"
									type="date"
									className="w-full px-3 py-2 pl-10 rounded-md border border-border bg-background text-foreground"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="callback-time" className="text-foreground">
								Preferred Time
							</Label>
							<div className="relative">
								<Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<input
									id="callback-time"
									type="time"
									className="w-full px-3 py-2 pl-10 rounded-md border border-border bg-background text-foreground"
								/>
							</div>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="timezone" className="text-foreground">
							Timezone
						</Label>
						<Select>
							<SelectTrigger className="bg-background border-border text-foreground">
								<SelectValue placeholder="Select timezone" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="est">Eastern Time (EST)</SelectItem>
								<SelectItem value="cst">Central Time (CST)</SelectItem>
								<SelectItem value="mst">Mountain Time (MST)</SelectItem>
								<SelectItem value="pst">Pacific Time (PST)</SelectItem>
								<SelectItem value="ist">India Standard Time (IST)</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone-number" className="text-foreground">
							Phone Number to Call
						</Label>
						<div className="relative">
							<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<input
								id="phone-number"
								type="tel"
								placeholder="+1 (555) 123-4567"
								className="w-full px-3 py-2 pl-10 rounded-md border border-border bg-background text-foreground"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="call-purpose" className="text-foreground">
							Call Purpose / Notes
						</Label>
						<Textarea
							id="call-purpose"
							placeholder="Add notes about what to discuss during the callback..."
							className="bg-background border-border text-foreground min-h-24"
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Contact Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
							<User className="w-5 h-5 text-muted-foreground" />
							<div>
								<p className="text-sm font-semibold text-foreground">Lead Name</p>
								<p className="text-sm text-muted-foreground">From call audit data</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
							<Phone className="w-5 h-5 text-muted-foreground" />
							<div>
								<p className="text-sm font-semibold text-foreground">Phone Number</p>
								<p className="text-sm text-muted-foreground">From call audit data</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Reminder Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between p-3 rounded-lg border border-border">
						<div>
							<p className="text-sm font-semibold text-foreground">Set Reminder</p>
							<p className="text-xs text-muted-foreground">Get notified before the callback time</p>
						</div>
						<input type="checkbox" className="w-4 h-4" defaultChecked />
					</div>
					<div className="space-y-2">
						<Label htmlFor="reminder-time" className="text-foreground">
							Remind me (minutes before)
						</Label>
						<Select defaultValue="15">
							<SelectTrigger className="bg-background border-border text-foreground">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5 minutes</SelectItem>
								<SelectItem value="15">15 minutes</SelectItem>
								<SelectItem value="30">30 minutes</SelectItem>
								<SelectItem value="60">1 hour</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-3">
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">
					<Phone className="w-4 h-4 mr-2" />
					Schedule Callback
				</Button>
				<Button variant="outline" className="border-border text-foreground hover:bg-muted">
					Save as Draft
				</Button>
			</div>
		</div>
	)
}


