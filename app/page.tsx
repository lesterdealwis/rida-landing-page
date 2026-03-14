"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ScrollStopAnimation } from "@/components/ScrollStopAnimation";

/* ────────────────────────────────────────────
   Intersection Observer hook for scroll animations
   ──────────────────────────────────────────── */
function useScrollAnimate() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".animate-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ────────────────────────────────────────────
   Counter animation hook
   ──────────────────────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, prefix, duration]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("scrolled", window.scrollY > 20);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: "rgba(2, 4, 10, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <a href="/" aria-label="RID Academy home">
          <Image src="/rida-logo.png" alt="RIDA — Reducing Insurance Dependence Academy" width={140} height={48} className="h-10 w-auto" priority />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {["Tools", "Learn", "Podcast", "Community", "About"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
          <a
            href="#join"
            className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(245,196,0,0.3)]"
          >
            Join Free
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════
   HERO SECTION — Text + CTA (video is in ScrollStopAnimation)
   ════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(245,196,0,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,180,166,0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/8 px-4 py-1.5 font-mono text-xs font-medium tracking-wider text-gold uppercase">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          Reducing Insurance Dependence
        </div>

        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
          Stop Losing{" "}
          <span className="gradient-text">42%</span> of Your Revenue to PPO Write-Offs
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 lg:text-xl">
          Join 10,000+ dental practice owners breaking free from PPO
          dependence. Free tools, expert guidance, and a movement that&apos;s
          changing dentistry.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#tools"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,196,0,0.3)]"
          >
            Get Instant Analysis (Free)
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-8 py-4 text-base font-semibold text-white/80 transition-all hover:border-white/30 hover:text-white"
          >
            See How It Works
          </a>
        </div>

        {/* Scroll hint pointing to the scroll-stop animation below */}
        <div className="mt-16 flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[3px] text-white/25">
            Scroll to experience
          </span>
          <svg
            className="h-5 w-5 animate-bounce text-gold/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TRUST BAR
   ════════════════════════════════════════════ */
function TrustBar() {
  return (
    <section className="border-b border-white/4 py-8">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-4 text-xs tracking-wider text-white/30 uppercase">
          Featured alongside leaders in dental practice management
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-white/25">
          {["Thriving Dentist", "Dental Intel", "Veritas", "BoomCloud", "ADCPA"].map(
            (name) => (
              <span key={name} className="transition-colors hover:text-white/40">
                {name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PROBLEM SECTION
   ════════════════════════════════════════════ */
function ProblemSection() {
  return (
    <section id="problem" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="animate-in text-center">
          <span className="inline-flex items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral-light">
            The Problem
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            The Dental Insurance System Is{" "}
            <span className="text-coral">Broken</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/50">
            Over 95% of dental practices are locked into PPO plans that
            haven&apos;t kept pace with inflation. You&apos;re working harder
            than ever while insurance companies dictate your fees.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              value: "42-45%",
              desc: "Average revenue lost to PPO write-offs",
              source: "Based on analysis of 1,000+ dental practices",
            },
            {
              value: "$250K+",
              desc: "Typical annual loss for a single-doctor practice",
              source: "Industry research on $1M+ practices",
            },
            {
              value: "95%",
              desc: "Of practices still dependent on PPO plans",
              source: "Based on ADA practice survey data",
            },
          ].map((stat) => (
            <div
              key={stat.value}
              className="animate-in glass-card rounded-2xl p-8 text-center transition-colors hover:border-coral/20"
            >
              <div className="font-mono text-4xl font-extrabold text-coral">
                {stat.value}
              </div>
              <p className="mt-2 text-sm font-medium text-white/70">{stat.desc}</p>
              <p className="mt-1 text-xs text-white/30">{stat.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TOOLS SECTION
   ════════════════════════════════════════════ */
function ToolsSection() {
  const tools = [
    {
      icon: "$",
      color: "coral",
      title: "PPO Write-Off Calculator",
      desc: "See exactly how much revenue you're losing to PPO write-offs each year.",
      badge: "Most Popular",
      badgeColor: "bg-coral/10 text-coral-light",
    },
    {
      icon: "✓",
      color: "teal",
      title: "Insurance Independence Scorecard",
      desc: "Answer 15 questions and get a personalized readiness score with a step-by-step roadmap.",
      badge: "Assessment",
      badgeColor: "bg-teal/10 text-teal-light",
    },
    {
      icon: "⟳",
      color: "navy",
      title: "Revenue Impact Simulator",
      desc: "Model what happens to your revenue when you drop 1, 2, or 3 PPO plans.",
      badge: "Simulator",
      badgeColor: "bg-white/5 text-white/60",
    },
    {
      icon: "◆",
      color: "gold",
      title: "Membership Plan Pricing",
      desc: "Find optimal pricing for your in-house membership plan based on your market.",
      badge: "Calculator",
      badgeColor: "bg-gold/10 text-gold",
    },
  ];

  return (
    <section id="tools" className="border-t border-white/4 bg-white/[0.01] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="animate-in text-center">
          <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-light">
            Free Tools
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Know Your Numbers Before You Act
          </h2>
          <p className="mt-3 text-white/50">
            Interactive tools to make confident decisions about your PPO
            relationships.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="animate-in group glass-card flex cursor-pointer flex-col rounded-2xl p-8 transition-all hover:border-gold/20 hover:shadow-[0_0_40px_rgba(245,196,0,0.06)]"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${
                  tool.color === "coral"
                    ? "bg-coral/15 text-coral"
                    : tool.color === "teal"
                      ? "bg-teal/15 text-teal"
                      : tool.color === "gold"
                        ? "bg-gold/15 text-gold"
                        : "bg-white/8 text-white/70"
                }`}
              >
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{tool.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                {tool.desc}
              </p>
              <span
                className={`mt-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${tool.badgeColor}`}
              >
                {tool.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   HOW IT WORKS
   ════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Assess Your Current Situation",
      desc: "Use our free calculators to understand exactly how much you're losing to PPO write-offs and how ready your practice is for the transition.",
      color: "bg-teal",
    },
    {
      num: 2,
      title: "Learn the Strategy",
      desc: "Access 349+ podcast episodes, summit presentations, and expert articles covering every aspect of the transition.",
      color: "bg-teal",
    },
    {
      num: 3,
      title: "Build Your Plan",
      desc: "Use our Revenue Impact Simulator and templates to create a customized transition plan. Know which plans to drop first.",
      color: "bg-teal",
    },
    {
      num: 4,
      title: "Execute with Support",
      desc: "Join our community of 10,000+ practice owners. Get real-time advice, share wins, and learn from those who've already made the leap.",
      color: "bg-teal",
    },
    {
      num: 5,
      title: "Get Certified",
      desc: "Complete the RID Certification program, earn CE credits, and display the RID Certified Practice badge.",
      color: "bg-gold",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="animate-in text-center">
          <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            The RID Roadmap
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your Path to Insurance Independence
          </h2>
          <p className="mt-3 text-white/50">
            A proven, step-by-step approach used by thousands of dental
            practices across the US.
          </p>
        </div>

        <div className="mt-14 space-y-8">
          {steps.map((step) => (
            <div key={step.num} className="animate-in flex gap-5">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${step.color} text-lg font-extrabold text-black`}
              >
                {step.num}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/50">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PODCAST SECTION
   ════════════════════════════════════════════ */
function PodcastSection() {
  return (
    <section id="learn" className="border-t border-white/4 bg-white/[0.01] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="animate-in flex flex-wrap items-center gap-12">
          <div className="min-w-[300px] flex-1">
            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
              349+ Episodes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
              Less Insurance Dependence Podcast
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              Co-hosted by Gary Takacs and Naren Arulrajah, the most
              comprehensive podcast dedicated to helping dental practices reduce
              insurance dependence.
            </p>
            <p className="mt-3 text-sm text-white/40">
              Every episode comes with full show notes, key takeaways,
              timestamps, and related articles.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-lg bg-teal px-5 py-2.5 text-sm font-bold text-black transition-all hover:-translate-y-0.5"
              >
                Browse Episodes
              </a>
              <a
                href="#"
                className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-white/30"
              >
                Apple Podcasts
              </a>
              <a
                href="#"
                className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-white/30"
              >
                Spotify
              </a>
            </div>
          </div>

          <div className="glass-card w-72 shrink-0 rounded-2xl p-8 text-center">
            <div className="mb-3 text-5xl">🎙</div>
            <h3 className="text-lg font-bold text-white">Latest Episode</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
              &quot;The Math That Changed Everything: Why 31.8% of Dentists Are
              Dropping PPOs in 2026&quot;
            </p>
            <p className="mt-2 text-xs text-white/40">
              New episodes weekly featuring dentists who&apos;ve successfully
              transitioned.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════ */
function Testimonials() {
  const testimonials = [
    {
      quote:
        "We dropped our first PPO 18 months ago. Our revenue dipped for two months, then surpassed our previous levels. We kept 87% of those patients. I wish we'd done it sooner.",
      author: "Dr. Sarah Martinez",
      practice: "Lone Star Family Dental, Austin TX",
      detail: "8-chair practice, 18 years in business",
    },
    {
      quote:
        "The PPO calculator was the wake-up call. I was losing $312,000 per year to write-offs. After following the RID roadmap, I've recovered $240,000 of that in the first year.",
      author: "Dr. James Richardson",
      practice: "Dental Wellness Group, Columbus OH",
      detail: "5-chair solo practice, 22 years",
    },
    {
      quote:
        "We transitioned our perio and implant practice to 100% fee-for-service. Revenue is up 34%, and we can now invest in the latest technology without worrying about insurance rates.",
      author: "Dr. Marcus Chen",
      practice: "Elite Periodontal Specialists, Portland OR",
      detail: "6-chair specialty practice, 15 years",
    },
  ];

  return (
    <section id="community" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="animate-in text-center">
          <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-light">
            Success Stories
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Practices That Made the Leap
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="animate-in glass-card flex flex-col rounded-2xl p-8"
            >
              <div className="mb-4 text-2xl text-gold/40">&ldquo;</div>
              <p className="flex-1 text-sm leading-relaxed text-white/60">
                {t.quote}
              </p>
              <div className="mt-6 border-t border-white/6 pt-4">
                <p className="text-sm font-bold text-white">{t.author}</p>
                <p className="text-xs text-teal-light">{t.practice}</p>
                <p className="text-xs text-white/30">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CTA / JOIN
   ════════════════════════════════════════════ */
function CTASection() {
  return (
    <section
      id="join"
      className="relative overflow-hidden py-28"
      style={{
        background:
          "linear-gradient(135deg, #0F2B46 0%, #1A3D5C 50%, #008F84 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(245,196,0,0.1), transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to Practice on Your Terms?
        </h2>
        <p className="mt-4 text-lg text-white/70">
          Join RID Academy for free. Get instant access to all calculators,
          courses, and our community of 10,000+ dental professionals.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md flex-wrap gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="min-w-[200px] flex-1 rounded-xl border border-white/20 bg-black/20 px-5 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-gold/50"
          />
          <button
            type="submit"
            className="rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(245,196,0,0.35)]"
          >
            Join Free →
          </button>
        </form>
        <p className="mt-3 text-xs text-white/50">
          Free forever. No credit card required. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   ABOUT / FOUNDERS
   ════════════════════════════════════════════ */
function FoundersSection() {
  return (
    <section id="about" className="border-t border-white/4 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="animate-in text-center">
          <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            Founded By
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            The Team Behind RID Academy
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <div className="animate-in glass-card rounded-2xl p-8">
            <div
              className="mb-6 flex h-20 items-center justify-center rounded-xl text-2xl font-extrabold text-white"
              style={{
                background: "linear-gradient(135deg, #0F2B46, #1A3D5C)",
              }}
            >
              NA
            </div>
            <h3 className="text-xl font-bold text-white">Naren Arulrajah</h3>
            <p className="mt-1 text-sm font-semibold text-teal">
              CEO & Founder, Ekwa Marketing
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Digital marketing visionary serving 1,000+ dental practices across
              all 50 states. Co-host of the Less Insurance Dependence Podcast
              with 349+ episodes.
            </p>
          </div>

          <div className="animate-in glass-card rounded-2xl p-8">
            <div
              className="mb-6 flex h-20 items-center justify-center rounded-xl text-2xl font-extrabold text-white"
              style={{
                background: "linear-gradient(135deg, #FF6B35, #FF8A5C)",
              }}
            >
              GT
            </div>
            <h3 className="text-xl font-bold text-white">Gary Takacs</h3>
            <p className="mt-1 text-sm font-semibold text-coral">
              Founder of Thriving Dentist
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Creator of the #1 dental podcast, co-owner of a thriving dental
              practice, and coach to 2,200+ dental practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/6 bg-black/40 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/rida-logo.png" alt="RIDA — Reducing Insurance Dependence Academy" width={160} height={55} className="h-12 w-auto" />
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              The Reducing Insurance Dependence Academy. Empowering dental
              practice owners to achieve financial independence.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-white/60">Tools</h4>
            <ul className="space-y-2 text-sm text-white/35">
              <li className="transition-colors hover:text-white/60">PPO Write-Off Calculator</li>
              <li className="transition-colors hover:text-white/60">Readiness Scorecard</li>
              <li className="transition-colors hover:text-white/60">Revenue Simulator</li>
              <li className="transition-colors hover:text-white/60">Membership Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-white/60">Learn</h4>
            <ul className="space-y-2 text-sm text-white/35">
              <li className="transition-colors hover:text-white/60">Articles & Guides</li>
              <li className="transition-colors hover:text-white/60">Annual Summit</li>
              <li className="transition-colors hover:text-white/60">Resources</li>
              <li className="transition-colors hover:text-white/60">Glossary</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-white/60">Company</h4>
            <ul className="space-y-2 text-sm text-white/35">
              <li className="transition-colors hover:text-white/60">About RID Academy</li>
              <li className="transition-colors hover:text-white/60">Community</li>
              <li className="transition-colors hover:text-white/60">Podcast</li>
              <li className="transition-colors hover:text-white/60">Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/6 pt-8 text-xs text-white/25">
          <span>&copy; 2026 RID Academy. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="transition-colors hover:text-white/40">Privacy Policy</span>
            <span className="transition-colors hover:text-white/40">Terms of Use</span>
            <span className="transition-colors hover:text-white/40">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════ */
export default function Home() {
  useScrollAnimate();

  return (
    // ⚠️ No overflow-x-hidden here — it breaks sticky positioning for scroll-stop
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Text hero */}
      <HeroSection />

      {/* Apple-style scroll-driven video animation */}
      <ScrollStopAnimation />

      {/* Rest of page */}
      <main className="relative z-10">
        <TrustBar />
        <ProblemSection />
        <ToolsSection />
        <HowItWorks />
        <PodcastSection />
        <Testimonials />
        <FoundersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
