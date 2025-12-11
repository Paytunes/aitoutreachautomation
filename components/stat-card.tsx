import { Card, CardContent } from "@/components/ui/card"
import type React from "react"

interface StatCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  trend?: { value: number; positive: boolean }
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
            {trend && (
              <p className={`text-xs mt-3 font-medium ${trend.positive ? "text-green-600" : "text-red-600"}`}>
                {trend.positive ? "↑" : "↓"} {trend.value}% from last month
              </p>
            )}
          </div>
          {icon && <div className="text-gray-400 flex-shrink-0">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
