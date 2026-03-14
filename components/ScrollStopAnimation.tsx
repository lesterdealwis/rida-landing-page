"use client"

import { useEffect, useRef, useState } from "react"

// ── CONFIGURATION ──────────────────────────────────────────
const FRAME_COUNT = 120

const CARDS = [
  {
    number: "01",
    title: "Break Free from PPO Chains",
    desc: "Over 95% of dental practices are locked into PPO contracts that haven't kept pace with inflation. You're losing 42-45% of revenue to write-offs every year.",
    statNumber: "42%",
    statLabel: "Average revenue lost to PPO write-offs",
    show: 0.10,
    hide: 0.28,
  },
  {
    number: "02",
    title: "Know Your Numbers",
    desc: "Our free PPO Calculator reveals exactly how much you're leaving on the table. Most practices discover they're losing $250K+ annually — money that should be yours.",
    statNumber: "$250K+",
    statLabel: "Typical annual loss per practice",
    show: 0.30,
    hide: 0.48,
  },
  {
    number: "03",
    title: "Proven Roadmap to Independence",
    desc: "349+ podcast episodes, expert-led courses, and a step-by-step strategy used by thousands of practices across all 50 states to successfully reduce insurance dependence.",
    statNumber: "349+",
    statLabel: "Hours of expert guidance",
    show: 0.50,
    hide: 0.68,
  },
  {
    number: "04",
    title: "Join 10,000+ Who Made the Leap",
    desc: "A thriving community of dental professionals sharing wins, strategies, and real-time support. You're not alone in this journey — 31.8% of US dentists are actively dropping PPOs.",
    statNumber: "10,000+",
    statLabel: "Dental professionals in the movement",
    show: 0.72,
    hide: 0.92,
  },
]
// ─────────────────────────────────────────────────────────────

const HOLD_MS = 600
const SNAP_ZONE = 0.04

export function ScrollStopAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const [cardIdx, setCardIdx] = useState(-1)
  const frames = useRef<HTMLImageElement[]>([])
  const curFrame = useRef(-1)
  const snapped = useRef<boolean[]>(CARDS.map(() => false))
  const snapping = useRef(false)
  const snapTimeout = useRef<number>(0)

  // Preload all frames
  useEffect(() => {
    let n = 0
    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `/scroll-stop/frames/frame_${String(i).padStart(4, "0")}.jpg`
      const tick = () => {
        n++
        setLoadPct(Math.round((n / FRAME_COUNT) * 100))
        if (n === FRAME_COUNT) { frames.current = imgs; setLoaded(true) }
      }
      img.onload = tick; img.onerror = tick; imgs.push(img)
    }
  }, [])

  function draw(index: number) {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext("2d"); if (!ctx) return
    const img = frames.current[index]
    if (!img?.complete || !img.naturalWidth) return
    const cw = c.width, ch = c.height
    if (!cw || !ch) return
    ctx.clearRect(0, 0, cw, ch)
    const ir = img.naturalWidth / img.naturalHeight
    const cr = cw / ch
    let dw: number, dh: number
    if (window.innerWidth > 768) {
      if (cr > ir) { dw = cw; dh = cw / ir } else { dh = ch; dw = ch * ir }
    } else {
      const z = 1.2
      if (cr > ir) { dh = ch * z; dw = dh * ir } else { dw = cw * z; dh = dw / ir }
    }
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }

  function sizeCanvas() {
    const c = canvasRef.current; if (!c) return
    const dpr = window.devicePixelRatio || 1
    c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr
    c.style.width = window.innerWidth + "px"; c.style.height = window.innerHeight + "px"
    if (curFrame.current >= 0) draw(curFrame.current)
  }

  useEffect(() => {
    if (!loaded) return
    sizeCanvas(); curFrame.current = 0; draw(0)
    window.addEventListener("resize", sizeCanvas)
    return () => window.removeEventListener("resize", sizeCanvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    let ticking = false
    const blockWheel = (e: WheelEvent) => { if (snapping.current) e.preventDefault() }
    const blockTouch = (e: TouchEvent) => { if (snapping.current) e.preventDefault() }
    const blockKey = (e: KeyboardEvent) => {
      if (snapping.current && ["ArrowDown", "ArrowUp", " ", "PageDown", "PageUp"].includes(e.key))
        e.preventDefault()
    }
    window.addEventListener("wheel", blockWheel, { passive: false })
    window.addEventListener("touchmove", blockTouch, { passive: false })
    window.addEventListener("keydown", blockKey)

    const onScroll = () => {
      if (ticking) return; ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const sec = sectionRef.current; if (!sec) return
        const rect = sec.getBoundingClientRect()
        const scrollH = sec.offsetHeight - window.innerHeight
        if (scrollH <= 0) return
        const progress = Math.min(1, Math.max(0, -rect.top / scrollH))
        const fi = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT))
        if (fi !== curFrame.current) { curFrame.current = fi; draw(fi) }
        let activeCard = -1
        for (let i = 0; i < CARDS.length; i++) {
          if (progress >= CARDS[i].show && progress <= CARDS[i].hide) { activeCard = i; break }
        }
        setCardIdx(activeCard)
        if (!snapping.current) {
          for (let i = 0; i < CARDS.length; i++) {
            const entering = progress >= CARDS[i].show && progress < CARDS[i].show + SNAP_ZONE
            if (entering && !snapped.current[i]) {
              snapped.current[i] = true; snapping.current = true
              clearTimeout(snapTimeout.current)
              snapTimeout.current = window.setTimeout(() => { snapping.current = false }, HOLD_MS)
              break
            }
            if (progress < CARDS[i].show - 0.02) snapped.current[i] = false
          }
        }
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("wheel", blockWheel)
      window.removeEventListener("touchmove", blockTouch)
      window.removeEventListener("keydown", blockKey)
      clearTimeout(snapTimeout.current); snapping.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  return (
    <section ref={sectionRef} className="relative z-[2]" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black" style={{ zIndex: 2 }}>

        {/* Loading screen */}
        {!loaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-[3px] text-white/50 mb-4">
                Loading Experience
              </p>
              <div className="w-[200px] h-[3px] bg-white/[0.08] rounded mx-auto overflow-hidden">
                <div
                  className="h-full rounded transition-[width] duration-200"
                  style={{ width: `${loadPct}%`, background: "#F5C400" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Frame canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Annotation cards */}
        {CARDS.map((card, i) => (
          <div
            key={card.number}
            style={{
              position: "absolute",
              bottom: "8vh",
              left: "5vw",
              maxWidth: 380,
              background: "rgba(2, 4, 10, 0.88)",
              border: "1px solid rgba(245, 196, 0, 0.15)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 60px rgba(245,196,0,0.05)",
              borderRadius: 20,
              padding: 28,
              zIndex: 10,
              opacity: i === cardIdx ? 1 : 0,
              transform: i === cardIdx ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: i === cardIdx ? "auto" as const : "none" as const,
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#F5C400", marginBottom: 8, letterSpacing: "0.15em" }}>
              {card.number}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
              {card.title}
            </h3>
            <p
              className="hidden md:block"
              style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 20 }}
            >
              {card.desc}
            </p>
            <div className="hidden md:block" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "#F5C400", fontFamily: "var(--font-dm-mono, monospace)" }}>
                {card.statNumber}
              </span>
              <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, letterSpacing: "0.03em" }}>
                {card.statLabel}
              </span>
            </div>
          </div>
        ))}

        {/* Scroll progress indicator */}
        {loaded && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[3px] text-white/25 font-mono">
              Scroll to explore
            </span>
            <div className="w-[60px] h-[2px] rounded bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded transition-[width] duration-100"
                style={{ width: `${cardIdx >= 0 ? ((cardIdx + 1) / CARDS.length) * 100 : 0}%`, background: "#F5C400" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
