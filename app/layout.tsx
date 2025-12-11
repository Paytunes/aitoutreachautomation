import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { RoleProvider } from "@/lib/role-context";
import { RoleRedirect } from "@/components/role-redirect";
import { getUserTypeFromToken } from "@/lib/auth";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "v0 App",
	description: "Created with v0",
	generator: "v0.app",
	icons: {
		icon: [
			{
				url: "/icon-light-32x32.png",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon-dark-32x32.png",
				media: "(prefers-color-scheme: dark)",
			},
			{
				url: "/icon.svg",
				type: "image/svg+xml",
			},
		],
		apple: "/apple-icon.png",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Get user type from token
	const userType = await getUserTypeFromToken();

	return (
		<html lang="en">
			<body className={`font-sans antialiased`}>
				<RoleProvider initialRole={userType || "sales_ops"}>
					<RoleRedirect />
					<div className="flex min-h-screen bg-background overflow-hidden">
						<Sidebar userType={userType} />
						<div className="flex-1 flex flex-col lg:pl-64">
							<TopNav />
							<main className="flex-1 overflow-auto">{children}</main>
						</div>
					</div>
					<Analytics />
				</RoleProvider>
			</body>
		</html>
	);
}
