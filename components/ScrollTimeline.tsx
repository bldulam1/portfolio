"use client";

import { SURFACE_TOP, useScrollTimeline } from "@/hooks/useScrollTimeline";
import { lerp } from "@/utils/math";
import type { Stage } from "@/data/stages";

export default function ScrollTimeline({ stages }: { stages: Stage[] }) {
	const {
		containerRef,
		impactSentinelRef,
		activeIndex,
		fractionalIndex,
		dropletY,
		narrativeOpacity,
		narrativeLift,
		ctaReveal,
	} = useScrollTimeline(stages.length);

	return (
		<div ref={containerRef} className="relative py-8">
			<div className="relative space-y-0">
				<div
					className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
					style={{ height: `${dropletY}%` }}
				>
					<div
						className="absolute inset-0 mx-auto w-px"
						style={{
							background:
								"linear-gradient(to bottom, rgba(251,191,36,0.05) 0%, rgba(251,191,36,0.3) 60%, rgba(251,191,36,0.5) 100%)",
						}}
					/>
					<div
						className="absolute inset-0 mx-auto"
						style={{
							width: 6,
							left: "50%",
							transform: "translateX(-50%)",
							background:
								"linear-gradient(to bottom, rgba(251,191,36,0.0) 0%, rgba(251,191,36,0.08) 50%, rgba(251,191,36,0.15) 100%)",
							filter: "blur(4px)",
						}}
					/>
				</div>

				<div
					className="absolute left-1/2 w-px -translate-x-1/2"
					style={{
						top: `${dropletY}%`,
						height: `${Math.max(0, SURFACE_TOP - dropletY)}%`,
						background:
							"linear-gradient(to bottom, rgba(113,113,122,0.15) 0%, rgba(113,113,122,0.05) 100%)",
					}}
				/>

				<div
					className="pointer-events-none absolute left-1/2 -translate-x-1/2"
					style={{
						top: `${SURFACE_TOP}%`,
						width: 72,
						height: 1,
						background:
							"linear-gradient(90deg, transparent, rgba(244,244,245,0.28), transparent)",
						boxShadow: "0 0 24px rgba(245,158,11,0.12)",
					}}
				/>

				{stages.map((stage, index) => {
					const isPassed = index < activeIndex;
					const isActive = index === activeIndex;
					const isLeft = index % 2 === 0;
					const proximity = Math.max(
						0,
						1 - Math.abs(fractionalIndex - index) / 1.5,
					);

					return (
						<div
							key={stage.label}
							className={`flex items-center gap-4 py-7 transition-all duration-700 ${
								isLeft ? "flex-row" : "flex-row-reverse"
							}`}
						>
							<div
								className={`flex-1 transition-all duration-700 ${
									isLeft ? "text-right" : "text-left"
								}`}
							>
								<p
									className={`text-sm font-medium transition-all duration-700 ${
										isActive
											? "text-amber-300"
											: isPassed
												? "text-zinc-400"
												: "text-zinc-700"
									}`}
									style={
										proximity > 0.1
											? {
													textShadow: `0 0 ${20 * proximity}px rgba(251,191,36,${0.3 * proximity})`,
												}
											: undefined
									}
								>
									{stage.label}
								</p>
								<p
									className={`mt-1 text-[11px] font-mono transition-all duration-700 ${
										isActive
											? "max-h-10 text-amber-500/50 opacity-100"
											: isPassed
												? "max-h-10 text-zinc-600 opacity-100"
												: "max-h-0 overflow-hidden text-zinc-800 opacity-0"
									}`}
								>
									{stage.detail}
								</p>
							</div>

							<div className="relative flex w-8 shrink-0 items-center justify-center">
								<div
									className="absolute h-px transition-all duration-700"
									style={{
										width:
											proximity > 0.1 ? 16 + 16 * proximity : isPassed ? 16 : 0,
										opacity:
											proximity > 0.1
												? 0.15 + 0.45 * proximity
												: isPassed
													? 0.12
													: 0,
										background: `linear-gradient(to right, transparent, rgba(251,191,36,${0.3 + 0.3 * proximity}), transparent)`,
										filter: proximity > 0.5 ? "blur(1px)" : "none",
									}}
								/>
								{(isPassed || proximity > 0.1) && (
									<div
										className="rounded-full transition-all duration-700"
										style={{
											width: 4 + 4 * proximity,
											height: 4 + 4 * proximity,
											backgroundColor: `rgba(251,191,36,${0.15 + 0.65 * proximity})`,
											boxShadow: `0 0 ${4 + 10 * proximity}px ${1 + 3 * proximity}px rgba(251,191,36,${0.1 + 0.35 * proximity})`,
										}}
									/>
								)}
							</div>

							<div className="flex-1" />
						</div>
					);
				})}
			</div>

			<div className="-mx-6 mt-8 overflow-hidden md:-mx-[calc((100vw-48rem)/2+1.5rem)]">
				<div className="relative h-screen">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(to_t,rgba(8,8,10,0.92),rgba(8,8,10,0.35),transparent)]" />

					<div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-24 text-center">
						<div
							style={{
								opacity: narrativeOpacity,
								transform: `translateY(${narrativeLift}px) scale(${lerp(0.96, 1, narrativeOpacity)})`,
								transition: "opacity 500ms ease, transform 700ms ease",
							}}
						>
							<p className="mb-6 text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
								Brendon Dulam
							</p>

							<h3 className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-tight">
								<span className="text-zinc-500">Build the next </span>
								<span
									className="italic text-white"
									style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
								>
									ripple
								</span>
								<br />
								<span className="text-zinc-500">with me</span>
							</h3>

							<p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-zinc-500">
								Open to roles &amp; collaborations
							</p>

							<div
								style={{
									opacity: ctaReveal,
									transform: `translateY(${(1 - ctaReveal) * 16}px)`,
									transition: "opacity 400ms ease, transform 400ms ease",
								}}
							>
								<a
									href="mailto:brendondulam06@gmail.com"
									className="pointer-events-auto inline-block rounded-sm bg-amber-500 px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-amber-400"
								>
									Contact Me ↗
								</a>
							</div>
						</div>

						<div
							className="mt-16"
							style={{
								opacity: ctaReveal,
								transform: `translateY(${(1 - ctaReveal) * 12}px)`,
								transition:
									"opacity 500ms ease 120ms, transform 500ms ease 120ms",
							}}
						>
							<div className="mx-auto h-px w-10 bg-zinc-800" />

							<div className="mt-5 flex justify-center gap-8 text-sm font-mono text-zinc-600">
								<a
									href="mailto:brendondulam06@gmail.com"
									className="pointer-events-auto transition-colors hover:text-amber-400"
								>
									email
								</a>
								<a
									href="https://linkedin.com/in/bldulam1"
									target="_blank"
									rel="noopener noreferrer"
									className="pointer-events-auto transition-colors hover:text-amber-400"
								>
									linkedin
								</a>
							</div>
						</div>
					</div>

					<div
						ref={impactSentinelRef}
						className="pointer-events-none absolute inset-x-0 bottom-[18vh] h-px"
					/>
				</div>
			</div>
		</div>
	);
}
