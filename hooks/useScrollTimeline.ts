"use client";

import { useEffect, useRef, useState } from "react";
import { useWaterRippleController } from "@/components/WaterRippleProvider";
import { clamp, lerp } from "@/utils/math";

const IMPACT_PROGRESS = 0.92;
const DROP_START_Y = 2.3;
const DROP_IMPACT_Y = 0.04;

export const SURFACE_TOP = 92;

export interface ScrollTimelineState {
	containerRef: React.RefObject<HTMLDivElement | null>;
	impactSentinelRef: React.RefObject<HTMLDivElement | null>;
	activeIndex: number;
	fractionalIndex: number;
	dropletY: number;
	narrativeOpacity: number;
	narrativeLift: number;
	ctaReveal: number;
}

export function useScrollTimeline(stagesCount: number): ScrollTimelineState {
	const containerRef = useRef<HTMLDivElement>(null);
	const impactSentinelRef = useRef<HTMLDivElement>(null);
	const isTimelineActiveRef = useRef(false);
	const previousImpactTopRef = useRef(Number.POSITIVE_INFINITY);
	const [progress, setProgress] = useState(0);

	const { clearTimelineDrop, setMode, setTimelineDrop, triggerRipple } =
		useWaterRippleController();

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				isTimelineActiveRef.current = entry.isIntersecting;

				if (entry.isIntersecting) {
					setMode("timeline");
					return;
				}

				setMode("auto");
				clearTimelineDrop();
				previousImpactTopRef.current = Number.POSITIVE_INFINITY;
			},
			{ rootMargin: "-15% 0px -15% 0px", threshold: 0.15 },
		);

		observer.observe(container);
		return () => observer.disconnect();
	}, [clearTimelineDrop, setMode]);

	useEffect(() => {
		const container = containerRef.current;
		const impactSentinel = impactSentinelRef.current;
		if (!container || !impactSentinel) return;

		function onScroll() {
			if (!containerRef.current || !impactSentinelRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const scrolled = viewportHeight * 0.82 - rect.top;
			const total = Math.max(rect.height - viewportHeight * 0.18, 1);
			const nextProgress = clamp(scrolled / total, 0, 1);
			setProgress(nextProgress);

			const impactTop =
				impactSentinelRef.current.getBoundingClientRect().top;
			const impactThreshold = viewportHeight * 0.8;

			if (isTimelineActiveRef.current) {
				if (nextProgress < IMPACT_PROGRESS) {
					const travelProgress = clamp(
						nextProgress / IMPACT_PROGRESS,
						0,
						1,
					);
					const easedTravel = 1 - Math.pow(1 - travelProgress, 1.6);
					const dropY = lerp(DROP_START_Y, DROP_IMPACT_Y, easedTravel);
					setMode("timeline");
					setTimelineDrop(dropY, true, 0, -1);
				} else {
					setMode("auto");
					clearTimelineDrop();
				}

				if (
					impactTop <= impactThreshold &&
					previousImpactTopRef.current > impactThreshold
				) {
					triggerRipple(0, -1, 0.14);
				}
			}

			previousImpactTopRef.current = impactTop;
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		onScroll();

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			clearTimelineDrop();
			setMode("auto");
		};
	}, [clearTimelineDrop, setMode, setTimelineDrop, triggerRipple]);

	const activeIndex = clamp(
		Math.floor(progress * stagesCount),
		0,
		stagesCount - 1,
	);
	const fractionalIndex = progress * stagesCount;
	const travelProgress = clamp(progress / IMPACT_PROGRESS, 0, 1);
	const impactProgress = clamp(
		(progress - IMPACT_PROGRESS) / (1 - IMPACT_PROGRESS),
		0,
		1,
	);
	const dropletY = lerp(0, SURFACE_TOP, travelProgress);
	const narrativeOpacity = clamp(
		(progress - (IMPACT_PROGRESS - 0.03)) / 0.08,
		0,
		1,
	);
	const narrativeLift = (1 - narrativeOpacity) * 28;
	const ctaReveal = clamp((impactProgress - 0.12) / 0.35, 0, 1);

	return {
		containerRef,
		impactSentinelRef,
		activeIndex,
		fractionalIndex,
		dropletY,
		narrativeOpacity,
		narrativeLift,
		ctaReveal,
	};
}
