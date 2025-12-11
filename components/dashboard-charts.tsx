"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

interface DashboardChartsProps {
	campaignData: Array<{ name: string; total_calls: number; answered_calls: number; converted_calls: number }>;
	dispositionData: Array<{ name: string; value: number; fill: string }>;
	taskStatusData: Array<{ name: string; count: number; fill: string }>;
}

export function DashboardCharts({ campaignData, dispositionData, taskStatusData }: DashboardChartsProps) {
	return (
		<>
			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Call Volume by Campaign */}
				<Card className="bg-card border-border">
					<CardHeader>
						<CardTitle className="text-foreground">Call Volume by Campaign</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={campaignData} margin={{ top: 16, right: 16, left: 8, bottom: 32 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
								<XAxis
									dataKey="name"
									stroke="hsl(var(--color-muted-foreground))"
									style={{ fontSize: "12px" }}
								/>
								<YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--color-card))",
										border: "1px solid hsl(var(--color-border))",
									}}
								/>
								<Legend
									verticalAlign="top"
									align="center"
									iconType="circle"
									formatter={(value: string) => (
										<span style={{ color: "hsl(var(--color-foreground))" }}>{value}</span>
									)}
								/>
								<Bar dataKey="total_calls" stackId="calls" fill="#6366f1" name="Total Calls" />
								<Bar dataKey="answered_calls" stackId="calls" fill="#22c55e" name="Answered" />
								<Bar dataKey="converted_calls" stackId="calls" fill="#f59e0b" name="Converted" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Call Dispositions */}
				<Card className="bg-card border-border">
					<CardHeader>
						<CardTitle className="text-foreground">Call Dispositions</CardTitle>
					</CardHeader>
					<CardContent className="flex justify-center">
						<ResponsiveContainer width="100%" height={300}>
							{/*
								Generate random bright colors so each Pie chart slice is colorful.
								If "entry.fill" is not present, generate a random hsl color.
							*/}
							<PieChart>
								<Pie
									data={dispositionData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={(entry) => `${entry.name}: ${entry.value}%`}
									outerRadius={80}
									dataKey="value"
								>
									{dispositionData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.fill} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Task Status Chart */}
			<div className="grid grid-cols-1 gap-6">
				<Card className="bg-card border-border">
					<CardHeader>
						<CardTitle className="text-foreground">Task Status Overview</CardTitle>
					</CardHeader>
					<CardContent className="flex justify-center">
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={taskStatusData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={(entry: any) => `${entry.name}: ${entry.count}`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="count"
								>
									{taskStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.fill} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
