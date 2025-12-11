"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TranscriptMessage {
  speaker: string
  text: string
}

interface CallTranscriptProps {
  messages?: TranscriptMessage[]
}

export function CallTranscript({ messages }: CallTranscriptProps) {
  const defaultMessages: TranscriptMessage[] = [
    {
      speaker: "AI Agent",
      text: "Hello, is this Mr. Gupta from HDFC Bank?",
    },
    {
      speaker: "Prospect",
      text: "Yes, this is Amit. Who's calling?",
    },
    {
      speaker: "AI Agent",
      text: "Hi Amit! I'm calling from Oriserve regarding our Metro Advertising solutions. Do you have a moment to discuss how we can help increase your brand visibility?",
    },
    {
      speaker: "Prospect",
      text: "Actually, we've been looking at advertising options. What do you have?",
    },
  ]

  const transcript = messages || defaultMessages

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Call Transcript</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {transcript.map((message, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  message.speaker === "AI Agent"
                    ? "bg-blue-500/10 text-blue-700 border-blue-500/30"
                    : "bg-gray-500/10 text-gray-700 border-gray-500/30"
                }
              >
                {message.speaker}
              </Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed pl-12">{message.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
