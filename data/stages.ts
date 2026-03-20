export interface Stage {
	label: string;
	detail: string;
}

export const STAGES: Stage[] = [
	{ label: "Investor Relations", detail: "10,000+ investor touchpoints coordinated across Japan, APAC & Europe" },
	{ label: "Market Data", detail: "Low-latency TSE order book ingestion via Activ and Flex Arrowhead" },
	{ label: "Business Intelligence", detail: "Natural language → KDB/Q for real-time analytics on trading desks" },
	{ label: "Order Management", detail: "FIX engine with pre-trade risk checks and multi-venue order routing" },
	{ label: "Smart Order Router", detail: "¥600B+ average daily turnover routed for best execution across venues" },
	{ label: "Dark Pool", detail: "CrossFinder matching engine serving market makers and retail flow" },
	{ label: "Invoicing", detail: "Automated metered, subscription & ad-hoc billing with PDF dispatch" },
	{ label: "Clearing & Settlement", detail: "Canton-based distributed ledger for atomic, final post-trade settlement" },
];
