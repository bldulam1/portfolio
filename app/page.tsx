import FadeIn from "@/components/FadeIn";
import ScrollTimeline from "@/components/ScrollTimeline";
import { STAGES } from "@/data/stages";

export default function Home() {
  return (
    <div className="min-h-screen text-[#f5f5f5]">

      {/* ═══════════════════════════════════════════════════════
          HERO — Full-screen ripple. Minimal text. Let the
          visual carry the metaphor.
          ═══════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        {/* Gradient overlay — ensures text readability */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(to_t,rgba(8,8,10,0.92),rgba(8,8,10,0.35),transparent)]" />

        {/* Text — centered at bottom third */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-24 px-6 text-center">
          <FadeIn>
            <p className="text-zinc-500 text-xs font-mono tracking-[0.2em] uppercase mb-6">
              Brendon Dulam
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-tight mb-4">
              Democratizing finance,
              <br />
              <span className="text-amber-400">one system at a time.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed mb-8">
              Tiny drops create ripples. Each system I build
              expands access to financial markets.
            </p>
          </FadeIn>

          <FadeIn delay={450}>
            <a
              href="#journey"
              className="px-5 py-2 text-sm font-medium text-black transition-colors rounded-sm bg-amber-500 hover:bg-amber-400"
            >
              See the Ripple →
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE JOURNEY — Stages as concentric ripple rings.
          Minimal text. The metaphor does the work.
          ═══════════════════════════════════════════════════════ */}
      <section id="journey" className="px-6 py-32 max-w-3xl mx-auto scroll-mt-10">
        <FadeIn>
          <p className="text-center text-zinc-500 text-sm mb-20">
            From the first investor touchpoint to settlement —<br />
            every stage of the trading lifecycle.
          </p>
        </FadeIn>

        <ScrollTimeline stages={STAGES} />
      </section>

    </div>
  );
}
