"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface CallAuditChartProps {
	interestLevel: number;
	callDuration: number;
	disposition: string;
}

export function CallAuditChart({ interestLevel, callDuration, disposition }: CallAuditChartProps) {
	// Prepare data for the donut chart showing interest level breakdown
	const interestData = [
		{
			name: "Interest Level",
			value: interestLevel,
			fill: "#6366f1", // Indigo
		},
		{
			name: "Remaining",
			value: 10 - interestLevel,
			fill: "#f3f4f6", // Very light gray for remaining portion (appears empty)
		},
	];

	return (
		<div className="w-full">
			{/* Interest Level Donut Chart */}
			<Card className="bg-card border-border">
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-foreground">Interest Level</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={120}>
						<PieChart>
							<Pie
								data={interestData}
								cx="50%"
								cy="50%"
								innerRadius={30}
								outerRadius={45}
								startAngle={90}
								endAngle={-270}
								dataKey="value"
							>
								{interestData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.fill} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
					<div className="text-center mt-1">
						<p className="text-xl font-bold text-foreground">{interestLevel}/10</p>
						<p className="text-xs text-muted-foreground">Interest Score</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
