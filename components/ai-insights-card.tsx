"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface AIInsight {
  title: string
  description: string
}

interface AIInsightsCardProps {
  insights?: AIInsight[]
}

export function AIInsightsCard({ insights }: AIInsightsCardProps) {
  const defaultInsights: AIInsight[] = [
    {
      title: "AI Detected Interest Signal",
      description: "Prospect expressed interest in Metro Ads and requested case studies",
    },
  ]

  const data = insights || defaultInsights

  return (
    <div className="space-y-3">
      {data.map((insight, idx) => (
        <Card key={idx} className="bg-card border-2 border-blue-500/30 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm mb-1">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
