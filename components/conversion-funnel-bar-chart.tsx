"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FunnelStage {
	stage: string;
	leads: number;
}

interface ConversionFunnelBarChartProps {
	data: FunnelStage[];
}

export function ConversionFunnelBarChart({ data }: ConversionFunnelBarChartProps) {
	return (
		<Card className="bg-white border border-gray-200">
			<CardHeader>
				<CardTitle className="text-gray-900">Conversion Funnel</CardTitle>
				<p className="text-sm text-gray-600 mt-1">Lead flow from initial contact to closed deals</p>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
						<XAxis type="number" stroke="#6b7280" style={{ fontSize: "12px" }} domain={[0, "dataMax"]} />
						<YAxis
							dataKey="stage"
							type="category"
							stroke="#6b7280"
							style={{ fontSize: "12px" }}
							width={110}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "#ffffff",
								border: "1px solid #e5e7eb",
								borderRadius: "6px",
								boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
							}}
							formatter={(value: number) => [`${value.toLocaleString()} Leads`, "Leads"]}
						/>
						<Bar dataKey="leads" fill="#6366f1" radius={[0, 4, 4, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
