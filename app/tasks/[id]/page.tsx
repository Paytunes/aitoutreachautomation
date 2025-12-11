import { getTaskById } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock, User, CheckCircle2, AlertCircle } from "lucide-react"
import { MeetingInviteView } from "@/components/task-views/meeting-invite-view"
import { CaseStudiesDeckView } from "@/components/task-views/case-studies-deck-view"
import { CallbackView } from "@/components/task-views/callback-view"
import { CrmUpdateView } from "@/components/task-views/crm-update-view"
import { WhatsAppView } from "@/components/task-views/whatsapp-view"

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await getTaskById(id)

  if (!task) {
    return (
      <div className="flex-1 space-y-6 p-6 lg:p-10">
        <Button asChild variant="ghost" className="text-foreground hover:bg-muted">
          <Link href="/tasks">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground text-lg">Task not found</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/30"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 border-blue-500/30"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  // Determine task type based on actionable name
  const getTaskType = (actionableName: string): string => {
    const name = actionableName.toLowerCase()
    if (name.includes("meeting") || name.includes("invite")) {
      return "meeting-invite"
    }
    if (name.includes("case study") || name.includes("deck") || name.includes("document")) {
      return "case-studies-deck"
    }
    if (name.includes("callback") || name.includes("call back") || name.includes("follow-up call")) {
      return "callback"
    }
    if (name.includes("crm") || name.includes("update lead") || name.includes("lead data")) {
      return "crm-update"
    }
    if (name.includes("whatsapp") || name.includes("whats app") || name.includes("text")) {
      return "whatsapp"
    }
    return "default"
  }

  const taskType = getTaskType(task.actionable.name)

  const renderTaskView = () => {
    switch (taskType) {
      case "meeting-invite":
        return <MeetingInviteView task={task} />
      case "case-studies-deck":
        return <CaseStudiesDeckView task={task} />
      case "callback":
        return <CallbackView task={task} />
      case "crm-update":
        return <CrmUpdateView task={task} />
      case "whatsapp":
        return <WhatsAppView task={task} />
      default:
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-muted/50 border border-border">
                <p className="text-foreground leading-relaxed">
                  {task.description || "No additional details available for this task."}
                </p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-10">
      {/* Header with back button */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="text-foreground hover:bg-muted mb-4">
            <Link href="/tasks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{task.actionable.name}</h1>
          <p className="text-muted-foreground">Task ID: {task.id}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(task.task_status)}>
          {task.task_status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Section */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(task.task_status)}
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <Badge variant="outline" className={getStatusColor(task.task_status)}>
                      {task.task_status.charAt(0).toUpperCase() + task.task_status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Assigned Employee */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="text-lg font-semibold text-foreground">{task.employee.name}</p>
                    <p className="text-sm text-muted-foreground">{task.employee.email}</p>
                  </div>
                </div>
              </div>

              {/* Actionable */}
              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-2">Related Actionable</p>
                <div className="p-4 rounded-md border border-border bg-muted/50">
                  <p className="font-semibold text-foreground">{task.actionable.name}</p>
                  {task.actionable.description && (
                    <p className="text-sm text-muted-foreground mt-2">{task.actionable.description}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground mb-3">Description</p>
                  <div className="p-4 rounded-md bg-muted/50 border border-border">
                    <p className="text-foreground leading-relaxed">{task.description}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Created
                    </p>
                    <p className="text-foreground font-medium">
                      {new Date(task.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.created_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last Updated
                    </p>
                    <p className="text-foreground font-medium">
                      {new Date(task.updated_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.updated_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Type Specific View */}
          {renderTaskView()}

          {/* Activity/Comments Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Activity & Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <p className="text-muted-foreground text-sm">No comments yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Comments and activity will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                <Badge variant="outline" className={getStatusColor(task.task_status)}>
                  {task.task_status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Priority</p>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  Normal
                </Badge>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Assigned</p>
                <p className="text-sm font-medium text-foreground">{task.employee.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/tasks">Back to Tasks</Link>
              </Button>
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
                Update Status
              </Button>
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
                Add Comment
              </Button>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Related</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/call-audits"
                className="flex items-center justify-between p-2 rounded hover:bg-muted text-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">View Call Audits</span>
                <span className="text-xs">→</span>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-between p-2 rounded hover:bg-muted text-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">View Dashboard</span>
                <span className="text-xs">→</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
