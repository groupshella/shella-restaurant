"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  animate,
  useReducedMotion,
} from "framer-motion";
import {
  EASE_OUT_EXPO,
  SPRING_SNAPPY,
  staggerContainer,
  staggerItemFadeUp,
  staggerItemScaleIn,
} from "@/lib/animations";

// ─── Star / Particle Canvas (no Framer Motion; requestAnimationFrame only) ───
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf: number;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      phase: number;
      speed: number;
    }

    const count = Math.min(Math.floor((W * H) / 8000), 180);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));

    interface Orb {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      fill: string;
    }
    const orbs: Orb[] = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      r: Math.random() * 180 + 100,
      fill: i % 2 === 0 ? "rgba(249,115,22,0.10)" : "rgba(212,145,10,0.07)",
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      orbs.forEach((o) => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.fill);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const a =
          p.alpha * (0.5 + 0.5 * Math.sin(t * p.speed * 60 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,210,160,${a})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Scroll-linked parallax orbs (DOM; useTransform) ─────────────────────────
function ParallaxOrbs({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -55]);

  return (
    <>
      <motion.div
        aria-hidden
        className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          left: "12%",
          top: "25%",
          y: y1,
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          right: "8%",
          top: "50%",
          y: y2,
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(212,145,10,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          left: "50%",
          top: "70%",
          x: "-50%",
          y: y3,
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />
    </>
  );
}

// ─── Typewriter + gradient text with motion-driven background-position ───────
const PHRASES = [
  "قبل ما تبيع!",
  "في 49 ساعة فقط!",
  "بدون مخاطرة!",
  "مع شريكك شلّة!",
];

function TypewriterText({ reducedMotion }: { reducedMotion: boolean }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  const progress = useMotionValue(0);
  const backgroundPosition = useTransform(
    progress,
    [0, 1],
    ["0% center", "200% center"]
  );

  useEffect(() => {
    if (reducedMotion) return;
    const controls = animate(progress, [0, 1], {
      duration: 4,
      repeat: Infinity,
      ease: "linear",
    });
    return controls.stop;
  }, [progress, reducedMotion]);

  useEffect(() => {
    const target = PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        60
      );
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        35
      );
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIdx]);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      className="hero-gradient-text"
      style={{
        backgroundPosition: reducedMotion ? "0% center" : backgroundPosition,
      }}
    >
      {displayed}
      <span
        style={{
          opacity: blink ? 1 : 0,
          transition: "opacity 0.1s",
          display: "inline-block",
          width: "3px",
          height: "0.85em",
          background: "linear-gradient(135deg,#F97316,#F0A429)",
          borderRadius: "2px",
          marginRight: "4px",
          verticalAlign: "middle",
        }}
      />
    </motion.span>
  );
}

// ─── Framer Motion counter (useMotionValue + useTransform + animate) ───────────
function MotionCountUp({
  target,
  prefix = "",
  reducedMotion,
}: {
  target: string;
  prefix?: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const display = useTransform(rounded, (v) => {
    if (target.endsWith("%")) return `${v}%`;
    if (target.endsWith("K")) return `${v}K`;
    if (prefix) return `${prefix}${v}`;
    return String(v);
  });

  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  const isNum = !Number.isNaN(num);

  useEffect(() => {
    if (!inView || !isNum || reducedMotion) {
      if (reducedMotion && isNum) count.set(num);
      return;
    }
    const controls = animate(count, num, {
      duration: 1.4,
      ease: "easeOut",
    });
    return controls.stop;
  }, [inView, num, isNum, count, reducedMotion]);

  if (!isNum) {
    return <span ref={ref}>{target}</span>;
  }

  return (
    <motion.span ref={ref} style={{ display: "inline-block" }}>
      <motion.span style={{ display: "inline-block" }}>{display}</motion.span>
    </motion.span>
  );
}

// ─── Scroll cue (CSS animation only; no Framer on this) ───────────────────────
function ScrollCue() {
  return (
    <div className="hero-scroll-cue">
      <div className="hero-scroll-mouse">
        <div className="hero-scroll-dot" />
      </div>
      <span>اسكرول</span>
    </div>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────
const H1_LINE1_WORDS = [ "مبيعاتك", "في", "جيبك.."];
const STATS = [
  { num: "49", label: "ساعة كحد أقصى", icon: "⚡" },
  { num: "1K", label: "ريال ترحيبي", icon: "💰" },
  { num: "0%", label: "مخاطرة قيدها", icon: "🛡️" },
  { num: "1", label: "شريك المطاعم", icon: "🏆", prefix: "#" },
];

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const reducedMotion = Boolean(prefersReduced);

  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reducedMotion) return;
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.25);
      y.set((e.clientY - cy) * 0.25);
    },
    [x, y, reducedMotion]
  );
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const containerVariants = staggerContainer(0.09, 0.1);
  const itemVariants = reducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : staggerItemFadeUp;
  const wordItemVariants = reducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      };
  const line1ContainerVariants = reducedMotion
    ? { hidden: {}, visible: {} }
    : staggerContainer(0.06, 0.12);
  const statVariants = reducedMotion
    ? { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } }
    : staggerItemScaleIn;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        .hero-root {
          position: relative;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(80px,12vh,140px) clamp(16px,5vw,40px) clamp(60px,10vh,120px);
          overflow: hidden;
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
        }

        .hero-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.35;
        }

        .hero-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #0D0A07 100%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 780px;
          width: 100%;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 99px;
          border: 1px solid rgba(249,115,22,0.35);
          background: rgba(249,115,22,0.08);
          color: #fdba74;
          font-size: clamp(11px,1.2vw,13px);
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: clamp(20px,3vw,32px);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .hero-badge-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.12), transparent);
          pointer-events: none;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 8px #f97316;
          flex-shrink: 0;
        }

        .hero-h1 {
          font-size: clamp(32px, 5.5vw, 64px);
          font-weight: 900;
          line-height: 1.18;
          color: #fff;
          margin-bottom: clamp(12px,2vw,20px);
          letter-spacing: -0.02em;
        }
        .hero-h1 .hero-line1-words { display: block; }
        .hero-h1 .hero-line1-words span { margin-right: 0.12em; }
        .hero-h1 .hero-line2 { display: block; margin-top: 4px; }
        .hero-gradient-text {
          background: linear-gradient(130deg, #F97316 0%, #F0A429 45%, #FB923C 75%, #F97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(249,115,22,0.45));
        }

        .hero-sub {
          font-size: clamp(13px,1.5vw,17px);
          color: rgba(235,210,175,0.65);
          line-height: 1.85;
          max-width: 560px;
          margin: 0 auto clamp(28px,4vw,44px);
          font-weight: 400;
        }

        .hero-ctas {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 480px) { .hero-ctas { flex-direction: row; } }

        .hero-btn-primary {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 52px;
          padding: 0 clamp(20px,3vw,32px);
          border-radius: 14px;
          background: linear-gradient(135deg, #EA6C0A 0%, #F97316 40%, #F0A429 100%);
          color: #fff;
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(13px,1.3vw,15px);
          font-weight: 800;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(249,115,22,0.4), 0 0 0 1px rgba(249,115,22,0.3);
          white-space: nowrap;
          width: 100%;
        }
        @media (min-width: 480px) { .hero-btn-primary { width: auto; } }
        .hero-btn-primary .hero-btn-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.15) 45%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 clamp(20px,3vw,28px);
          border-radius: 14px;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.12);
          color: rgba(235,210,175,0.85);
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(13px,1.3vw,15px);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          backdrop-filter: blur(10px);
          width: 100%;
          white-space: nowrap;
        }
        @media (min-width: 480px) { .hero-btn-secondary { width: auto; } }
        .hero-btn-secondary:hover {
          background: rgba(249,115,22,0.08);
          border-color: rgba(249,115,22,0.3);
          color: #fdba74;
        }

        .hero-divider {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, transparent, rgba(249,115,22,0.3), transparent);
          margin: clamp(24px,3.5vw,40px) auto;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px,1.5vw,16px);
        }
        @media (min-width: 600px) { .hero-stats { grid-template-columns: repeat(4, 1fr); } }

        .hero-stat {
          position: relative;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
          border-radius: 16px;
          padding: clamp(14px,2vw,22px) clamp(10px,1.5vw,16px);
          text-align: center;
          backdrop-filter: blur(10px);
          overflow: hidden;
          cursor: default;
        }
        .hero-stat::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.08), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .hero-stat:hover { border-color: rgba(249,115,22,0.35); }
        .hero-stat:hover::before { opacity: 1; }

        .hero-stat-icon {
          font-size: 18px;
          margin-bottom: 6px;
          display: block;
          filter: grayscale(0.3);
        }
        .hero-stat-num {
          font-size: clamp(22px,3vw,32px);
          font-weight: 900;
          background: linear-gradient(130deg, #F97316, #F0A429);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin-bottom: 4px;
          font-variant-numeric: tabular-nums;
        }
        .hero-stat-label {
          font-size: clamp(10px,1vw,12px);
          color: rgba(210,185,150,0.45);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .hero-scroll-cue {
          position: absolute;
          bottom: clamp(20px,4vh,36px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(190,165,130,0.30);
          font-size: 11px;
          letter-spacing: 0.1em;
          font-family: 'Tajawal', sans-serif;
          animation: scroll-bob 2.5s ease-in-out infinite;
        }
        @keyframes scroll-bob {
          0%,100% { transform: translateX(-50%) translateY(0); opacity:0.5; }
          50%      { transform: translateX(-50%) translateY(6px); opacity:1; }
        }
        .hero-scroll-mouse {
          width: 22px; height: 34px;
          border: 1.5px solid rgba(249,115,22,0.3);
          border-radius: 11px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 6px;
        }
        .hero-scroll-dot {
          width: 3px; height: 7px;
          background: linear-gradient(to bottom, #f97316, transparent);
          border-radius: 2px;
          animation: scroll-dot 2.5s ease-in-out infinite;
        }
        @keyframes scroll-dot {
          0%,100% { transform: translateY(0); opacity:1; }
          50%      { transform: translateY(8px); opacity:0.2; }
        }

        .hero-line-left, .hero-line-right {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 200px;
          background: linear-gradient(to bottom, transparent, rgba(249,115,22,0.2), transparent);
          z-index: 2;
        }
        .hero-line-left  { left: clamp(16px,4vw,60px); }
        .hero-line-right { right: clamp(16px,4vw,60px); }
        .hero-line-left::before, .hero-line-right::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 10px #f97316;
        }
      `}</style>

      <section ref={sectionRef} className="hero-root">
        <ParticleField />
        <ParallaxOrbs sectionRef={sectionRef} />

        <div className="hero-line-left" />
        <div className="hero-line-right" />

        <motion.div
          className="hero-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="hero-badge">
              {!reducedMotion && (
                <motion.span
                  className="hero-badge-shine"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />
              )}
              <motion.span
                className="hero-badge-dot"
                animate={
                  reducedMotion
                    ? {}
                    : {
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.7, 1],
                        transition: {
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
              />
              المنصة الأسهل في السعودية
            </span>
          </motion.div>

          {/* Headline: line 1 word-by-word (stagger 0.06s), line 2 typewriter with gradient */}
          <motion.h1
            className="hero-h1"
            variants={itemVariants}
          >
            <motion.span
              className="hero-line1-words "
              variants={line1ContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {H1_LINE1_WORDS.map((word, i) => (
                <motion.span  key={`${word}-${i}`} variants={wordItemVariants}>
                  {word} <span className="mx-0.5"></span>
                </motion.span>
              ))}
            </motion.span>
            <span className="hero-line2">
              <motion.span
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <TypewriterText reducedMotion={reducedMotion} />
              </motion.span>
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p className="hero-sub" variants={itemVariants}>
            انضم إلى شلّه، شريك النمو الأول للمطاعم في السعودية. رصيد تشغيلي
            فوري وتدفق السيولة خلال 49 ساعة فقط، بميزة "قيدها" الحصرية.
          </motion.p>

          {/* CTA: primary magnetic + shimmer, secondary hover */}
          <motion.div className="hero-ctas" variants={itemVariants}>
            <motion.button
              ref={btnRef}
              className="hero-btn-primary"
              style={{ x, y }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              whileHover={
                reducedMotion
                  ? {}
                  : {
                      scale: 1.03,
                      y: -4,
                      boxShadow:
                        "0 8px 36px rgba(249,115,22,0.55), 0 0 0 1px rgba(249,115,22,0.45)",
                      transition: SPRING_SNAPPY,
                    }
              }
              whileTap={reducedMotion ? {} : { scale: 0.97 }}
              transition={SPRING_SNAPPY}
            >
              <motion.span
                className="hero-btn-shine"
                initial={{ x: "-100%" }}
                whileHover={
                  reducedMotion
                    ? {}
                    : {
                        x: "100%",
                        transition: {
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }
                }
                style={{ willChange: "transform" }}
              />
              <span>ابدأ مبيعاتك</span>
              <span style={{ fontSize: "11px", opacity: 0.85, fontWeight: 600 }}>
                ← استلم 1,000 ريال
              </span>
            </motion.button>
            <motion.button
              className="hero-btn-secondary"
              whileHover={reducedMotion ? {} : { y: -2, scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
              transition={SPRING_SNAPPY}
            >
              اعرف أكثر عن قيدها
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-divider"
            variants={itemVariants}
          />

          {/* Stats: scale + opacity entrance, Framer counter */}
          <motion.div
            className="hero-stats"
            variants={staggerContainer(0.09, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                className="hero-stat"
                variants={statVariants}
                whileHover={
                  reducedMotion ? {} : { y: -3, transition: SPRING_SNAPPY }
                }
              >
                <span className="hero-stat-icon">{s.icon}</span>
                <div className="hero-stat-num">
                  <MotionCountUp
                    target={s.num}
                    prefix={s.prefix}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div className="hero-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <ScrollCue />
      </section>
    </>
  );
}
