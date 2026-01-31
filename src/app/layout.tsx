import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "UptimeGuard - Telegram Monitor",
	description: "Professional infrastructure monitoring delivered directly to Telegram.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-white text-black antialiased selection:bg-[#3390ec] selection:text-white">
				{children}
			</body>
		</html>
	);
}