import Link from "next/link";
import { Zap, Shield, Globe, Bell, Check, MessageSquare, Terminal, BarChart3, Send } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			{/* Navigation */}
			<nav className="h-16 border-b border-[#dfe1e5] sticky top-0 bg-white z-50">
				<div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 font-semibold text-lg text-[#222222]">
						<Image src="/logo.png" alt="UptimeGuard Logo" width={32} height={32} />
						<span>UptimeGuard</span>
					</Link>
					<div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#707579]">
						<a href="#features" className="text-[#222222]">Features</a>
						<a href="#pricing" className="text-[#222222]">Pricing</a>
						<Link href="/login" className="text-[#222222]">Login</Link>
						<Link href="/signup" className="btn-tg-primary py-2 px-5 text-sm">Start Monitoring</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="py-20">
				<div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e3f2fd] text-[#0088cc] text-xs font-semibold mb-6">
							<span className="w-1.5 h-1.5 rounded-full bg-[#0088cc]"></span>
							V1.0 NOW LIVE
						</div>
						<h1 className="text-5xl font-bold leading-tight mb-5 text-[#222222]">
							Website Uptime Monitor
						</h1>
						<p className="text-base text-[#707579] mb-8 max-w-lg leading-relaxed">
							Monitor your websites and APIs with instant alerts delivered through Telegram. Manage your entire infrastructure without leaving your favorite messenger.
						</p>
						<div className="flex flex-wrap gap-3">
							<Link href="/signup" className="btn-tg-primary h-12 px-8 text-base">Get Started for Free</Link>
							<Link href="https://t.me/your_bot" className="btn-tg-secondary h-12 px-8 text-base">
								<Send size={18} /> View Demo Bot
							</Link>
						</div>
					</div>

					{/* Telegram Chat UI */}
					<div className="relative">
						<div className="bg-[#f4f4f5] p-3 rounded-2xl border border-[#dfe1e5]">
							<div className="bg-[#0088cc] p-4 rounded-xl text-white flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
									U
								</div>
								<div>
									<div className="text-sm font-semibold">UptimeGuard Bot</div>
									<div className="text-xs opacity-70">online</div>
								</div>
							</div>
							<div className="p-3 space-y-3 bg-white rounded-xl min-h-[320px]">
								<div className="bg-[#f4f4f5] p-3 rounded-xl rounded-tl-sm max-w-[85%] text-sm">
									<div className="font-semibold mb-1">🚨 Monitor Alert</div>
									<div className="text-[#707579] space-y-0.5">
										<div>Target: <code className="text-xs bg-white px-1.5 py-0.5 rounded">api.production.com</code></div>
										<div>Status: <span className="text-[#e53935] font-semibold">DOWN</span></div>
										<div>Error: 502 Bad Gateway</div>
									</div>
								</div>
								<div className="bg-[#effdde] p-3 rounded-xl rounded-tr-sm max-w-[70%] ml-auto text-sm font-medium">
									/status api.production.com
								</div>
								<div className="bg-[#f4f4f5] p-3 rounded-xl rounded-tl-sm max-w-[85%] text-sm">
									<div className="font-semibold mb-1">✅ Current Status</div>
									<div className="text-[#707579] space-y-0.5">
										<div>Uptime: 99.98%</div>
										<div>Latency: 42ms</div>
										<div>Last checked: Just now</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Trust Bar */}
			{/* Trust Bar */}
			<section className="py-12 bg-white">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{[
							{
								icon: (
									<svg className="w-8 h-8 text-[#0088cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								),
								title: "Global Edge",
								description: "12 locations worldwide"
							},
							{
								icon: (
									<svg className="w-8 h-8 text-[#0088cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								),
								title: "SSL Secure",
								description: "256-bit encryption"
							},
							{
								icon: (
									<svg className="w-8 h-8 text-[#0088cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								),
								title: "24/7 Monitoring",
								description: "Always watching"
							},
							{
								icon: (
									<svg className="w-8 h-8 text-[#0088cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
									</svg>
								),
								title: "Instant Alerts",
								description: "Real-time notifications"
							}
						].map((item, index) => (
							<div key={index} className="text-center p-4 bg-white rounded-xl border border-[#f0f0f0] hover:shadow-sm transition-all">
								<div className="w-12 h-12 bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-3">
									{item.icon}
								</div>
								<h4 className="font-semibold text-[#222222] mb-1">{item.title}</h4>
								<p className="text-sm text-[#707579]">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="mb-12">
						<h2 className="text-3xl font-bold text-[#222222] mb-3">Enterprise-grade monitoring</h2>
						<p className="text-base text-[#707579]">Precision tools built for developers who value speed and reliability.</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6">
						<FeatureCard
							icon={<Globe size={22} />}
							title="Multi-Region Checks"
							desc="Verify uptime from 8 global nodes to eliminate false positives and track regional latency."
						/>
						<FeatureCard
							icon={<Terminal size={22} />}
							title="Telegram Commands"
							desc="Add, pause, or check status of monitors using simple chat commands. No dashboard required."
						/>
						<FeatureCard
							icon={<Shield size={22} />}
							title="SSL Certificate Tracking"
							desc="Get notified 30, 7, and 1 day before SSL certificates expire to prevent downtime."
						/>
						<FeatureCard
							icon={<BarChart3 size={22} />}
							title="Performance Insights"
							desc="Detailed response time charts help you identify slow-performing endpoints before they break."
						/>
						<FeatureCard
							icon={<Bell size={22} />}
							title="Smart Escalation"
							desc="Define custom alert rules. Notify different Telegram groups based on incident severity."
						/>
						<FeatureCard
							icon={<Zap size={22} />}
							title="15s Intervals"
							desc="For mission-critical apps, Business plan offers high-frequency checks every 15 seconds."
						/>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-20 bg-[#fafafa]">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-[#222222] mb-3">Transparent Pricing</h2>
						<p className="text-base text-[#707579]">Choose the plan that fits your infrastructure scale.</p>
					</div>

					<div className="bg-white border border-[#dfe1e5] rounded-2xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-[#dfe1e5] bg-[#fafafa]">
										<th className="p-5 text-left font-semibold text-sm text-[#222222] min-w-[160px]">Features</th>
										<th className="p-5 text-center font-semibold text-sm text-[#222222] min-w-[120px]">Free</th>
										<th className="p-5 text-center font-semibold text-sm text-[#222222] min-w-[120px]">Starter</th>
										<th className="p-5 text-center font-semibold text-sm text-[#222222] min-w-[120px]">Pro</th>
										<th className="p-5 text-center font-semibold text-sm text-[#222222] min-w-[120px]">Business</th>
									</tr>
								</thead>
								<tbody>
									<PriceRow label="Monitors" values={["5", "25", "100", "500+"]} />
									<PriceRow label="Check Interval" values={["5 min", "2 min", "30 sec", "15 sec"]} />
									<PriceRow label="Telegram Alerts" values={["Basic", "Full", "Priority", "Unlimited"]} />
									<PriceRow label="SSL Monitoring" values={[false, true, true, true]} />
									<PriceRow label="Team Members" values={["1", "3", "10", "Unlimited"]} />
									<PriceRow label="API Access" values={[false, false, true, true]} />
									<tr className="border-t-2 border-[#dfe1e5] bg-[#fafafa]">
										<td className="p-5 font-semibold text-sm">Monthly Price</td>
										<td className="p-5 text-center">
											<div className="text-2xl font-bold text-[#222222]">$0</div>
										</td>
										<td className="p-5 text-center">
											<div className="text-2xl font-bold text-[#222222]">$6</div>
										</td>
										<td className="p-5 text-center">
											<div className="text-2xl font-bold text-[#222222]">$18</div>
										</td>
										<td className="p-5 text-center">
											<div className="text-2xl font-bold text-[#222222]">$45+</div>
										</td>
									</tr>
									<tr className="border-t border-[#dfe1e5]">
										<td className="p-5"></td>
										<td className="p-5 text-center">
											<Link href="/signup" className="inline-flex items-center justify-center bg-[#f4f4f5] text-[#0088cc] px-5 py-2 rounded-lg font-medium text-sm">
												Join Free
											</Link>
										</td>
										<td className="p-5 text-center">
											<Link href="/signup" className="inline-flex items-center justify-center bg-[#0088cc] text-white px-5 py-2 rounded-lg font-medium text-sm">
												Start Starter
											</Link>
										</td>
										<td className="p-5 text-center">
											<Link href="/signup" className="inline-flex items-center justify-center bg-[#f4f4f5] text-[#0088cc] px-5 py-2 rounded-lg font-medium text-sm">
												Go Pro
											</Link>
										</td>
										<td className="p-5 text-center">
											<Link href="/signup" className="inline-flex items-center justify-center bg-[#f4f4f5] text-[#0088cc] px-5 py-2 rounded-lg font-medium text-sm">
												Contact Sales
											</Link>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[#fafafa] border-t border-[#dfe1e5]">
				<div className="max-w-6xl mx-auto px-6 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div className="space-y-4">
							<Link href="/" className="flex items-center gap-2 font-semibold text-[#222222] text-lg">
								<Image src="/logo.png" alt="UptimeGuard Logo" width={32} height={32} />
								<span>UptimeGuard</span>
							</Link>
							<p className="text-sm text-[#707579] max-w-xs">Professional infrastructure monitoring delivered directly to Telegram.</p>
						</div>

						<div>
							<h4 className="font-semibold text-[#222222] mb-4">Product</h4>
							<ul className="space-y-2 text-sm text-[#707579]">
								<li><a href="#features" className="hover:text-[#0088cc]">Features</a></li>
								<li><a href="#pricing" className="hover:text-[#0088cc]">Pricing</a></li>
								<li><a href="/signup" className="hover:text-[#0088cc]">Sign Up</a></li>
								<li><a href="/login" className="hover:text-[#0088cc]">Login</a></li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold text-[#222222] mb-4">Resources</h4>
							<ul className="space-y-2 text-sm text-[#707579]">
								<li><a href="#" className="hover:text-[#0088cc]">Documentation</a></li>
								<li><a href="#" className="hover:text-[#0088cc]">API Status</a></li>
								<li><a href="#" className="hover:text-[#0088cc]">Guides</a></li>
								<li><a href="#" className="hover:text-[#0088cc]">Blog</a></li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold text-[#222222] mb-4">Company</h4>
							<ul className="space-y-2 text-sm text-[#707579]">
								<li><a href="#" className="hover:text-[#0088cc]">About Us</a></li>
								<li><a href="#" className="hover:text-[#0088cc]">Contact</a></li>
								<li><a href="#" className="hover:text-[#0088cc]">Terms of Service</a></li>
								<li><a href="#" className="hover:text-[#0088cc]">Privacy Policy</a></li>
							</ul>
						</div>
					</div>

					<div className="pt-8 border-t border-[#dfe1e5] flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-[#9ca3af]">© 2026 NovaLabs. All rights reserved.</p>
						<div className="flex items-center gap-4">
							<a href="#" className="text-[#9ca3af] hover:text-[#0088cc]">
								<span className="sr-only">Twitter</span>
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
								</svg>
							</a>
							<a href="#" className="text-[#9ca3af] hover:text-[#0088cc]">
								<span className="sr-only">GitHub</span>
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
								</svg>
							</a>
							<a href="https://t.me/your_bot" className="text-[#9ca3af] hover:text-[#0088cc]">
								<span className="sr-only">Telegram</span>
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.35-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({ icon, title, desc }: any) {
	return (
		<div className="p-6 rounded-xl border border-[#dfe1e5] bg-white">
			<div className="text-[#0088cc] mb-4 p-2.5 bg-[#e3f2fd] w-fit rounded-lg">
				{icon}
			</div>
			<h3 className="font-semibold text-base mb-2 text-[#222222]">{title}</h3>
			<p className="text-[#707579] text-sm leading-relaxed">{desc}</p>
		</div>
	);
}

function PriceRow({ label, values }: any) {
	return (
		<tr className="border-b border-[#dfe1e5]">
			<td className="p-5 text-sm text-[#707579]">{label}</td>
			{values.map((v: any, i: number) => (
				<td key={i} className="p-5 text-center text-sm font-medium">
					{typeof v === 'boolean' ? (
						v ? (
							<Check className="mx-auto text-[#31b545]" size={16} />
						) : (
							<span className="text-[#dfe1e5]">—</span>
						)
					) : (
						<span className="text-[#222222]">{v}</span>
					)}
				</td>
			))}
		</tr>
	);
}