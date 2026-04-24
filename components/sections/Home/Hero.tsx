"use client";

import { useRef, useCallback, useState, useEffect } from "react";
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
  ArrowLeft,
  Zap,
  Shield,
  TrendingUp,
  Trophy,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// ─── Animation tokens ─────────────────────────────────────────────────────────
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring" as const, stiffness: 400, damping: 28 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 220, damping: 26 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_EXPO } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_EXPO } },
};

const stagger = (s = 0.09, d = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: s, delayChildren: d } },
});

// ─── Motion counter ───────────────────────────────────────────────────────────
function Counter({
  to,
  prefix = "",
  suffix = "",
  reduced,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { mv.set(to); return; }
    const c = animate(mv, to, { duration: 1.4, ease: "easeOut" });
    return c.stop;
  }, [inView, to, mv, reduced]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

// ─── Typewriter gradient text ─────────────────────────────────────────────────
const PHRASES = ["قبل ما تبيع!", "في 49 ساعة!", "بدون مخاطرة!", "مع شلّة!"];

function Typewriter({ reduced }: { reduced: boolean }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(reduced ? PHRASES[0] : "");
  const [del, setDel] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const target = PHRASES[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!del && text.length < target.length)
      t = setTimeout(() => setText(target.slice(0, text.length + 1)), 65);
    else if (!del && text.length === target.length)
      t = setTimeout(() => setDel(true), 2400);
    else if (del && text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), 38);
    else { setDel(false); setIdx((i) => (i + 1) % PHRASES.length); }
    return () => clearTimeout(t);
  }, [text, del, idx, reduced]);

  useEffect(() => {
    const i = setInterval(() => setBlink((b) => !b), 520);
    return () => clearInterval(i);
  }, []);

  return (
    <span className="tw-wrap">
      <span className="tw-text">{text}</span>
      <span className="tw-cursor" style={{ opacity: blink ? 1 : 0 }} />
    </span>
  );
}

// ─── Parallax orbs ────────────────────────────────────────────────────────────
function ParallaxOrbs({ sRef }: { sRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -38]);
  return (
    <>
      <motion.div aria-hidden className="porb porb-a" style={{ y: y1 }} />
      <motion.div aria-hidden className="porb porb-b" style={{ y: y2 }} />
    </>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const WORDS = ["كاش", "مبيعاتك", "في", "جيبك.."];

const STATS = [
  { Icon: Zap,        to: 49, suffix: "",  label: "ساعة تحويل",    color: "#EA580C" },
  { Icon: TrendingUp, to: 1,  prefix: "", suffix: "K", label: "ريال ترحيبي", color: "#B45309" },
  { Icon: Shield,     to: 0,  suffix: "%", label: "مخاطرة قيدها",  color: "#059669" },
  { Icon: Trophy,     to: 1,  prefix: "#", label: "شريك المطاعم",  color: "#7C3AED" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const sRef = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());

  // Magnetic CTA
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left - r.width / 2) * 0.22);
    my.set((e.clientY - r.top - r.height / 2) * 0.22);
  }, [mx, my, reduced]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const wordVar = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 32, rotateX: -10 },
        visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.62, ease: EASE_EXPO } },
      };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:ital,wght@0,700;1,700&display=swap');

        /* ─── Section ─────────────────────────────────── */
        .h-root {
          position: relative;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(100px,14vh,160px) clamp(20px,5vw,48px) clamp(80px,12vh,130px);
          overflow: hidden;
          background: #FAFAF7;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
        }

        /* Warm dot grid */
        .h-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(160,100,20,0.11) 1px, transparent 1px);
          background-size: 30px 30px;
          mask-image: radial-gradient(ellipse 72% 62% at 50% 50%, black 25%, transparent 78%);
          pointer-events: none; z-index: 0;
        }

        /* ─── Floating blobs ───────────────────────────── */
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none; z-index: 0;
        }
        .blob-1 {
          width: 480px; height: 400px; top: -80px; left: -60px;
          background: radial-gradient(circle, rgba(234,88,12,0.14) 0%, transparent 68%);
          animation: bfl 15s ease-in-out infinite;
        }
        .blob-2 {
          width: 380px; height: 360px; bottom: -50px; right: -50px;
          background: radial-gradient(circle, rgba(180,83,9,0.10) 0%, transparent 68%);
          animation: bfl 19s ease-in-out infinite reverse;
        }
        .blob-3 {
          width: 240px; height: 240px; top: 38%; left: 62%;
          background: radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 68%);
          animation: bfl 23s ease-in-out infinite 4s;
        }
        .blob-4 {
          width: 190px; height: 190px; top: 22%; left: 18%;
          background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 68%);
          animation: bfl 17s ease-in-out infinite 2s reverse;
        }
        @keyframes bfl {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(18px,-22px) scale(1.05); }
          66%      { transform: translate(-14px,15px) scale(0.96); }
        }

        /* ─── Parallax orbs ────────────────────────────── */
        .porb {
          position: absolute; border-radius: 50%;
          pointer-events: none; z-index: 0; filter: blur(52px);
        }
        .porb-a {
          width: 320px; height: 320px; top: 14%; left: 4%;
          background: radial-gradient(circle, rgba(234,88,12,0.16) 0%, transparent 62%);
        }
        .porb-b {
          width: 260px; height: 260px; bottom: 18%; right: 6%;
          background: radial-gradient(circle, rgba(180,83,9,0.13) 0%, transparent 62%);
        }

        /* ─── Content ─────────────────────────────────── */
        .h-content {
          position: relative; z-index: 10;
          max-width: 800px; width: 100%; margin: 0 auto;
          perspective: 1000px;
        }

        /* ─── Food pill ──────────────────────────────── */
        .food-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 16px 6px 8px; border-radius: 99px;
          background: linear-gradient(135deg, #FFF7EE, #FEF3E6);
          border: 1.5px solid rgba(234,88,12,0.2);
          color: #B84010; font-size: 12px; font-weight: 700;
          margin-bottom: 12px;
          box-shadow: 0 2px 12px rgba(234,88,12,0.1);
        }
        .food-emoji {
          font-size: 18px;
          animation: wob 3.2s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes wob {
          0%,100% { transform: rotate(0); }
          25%      { transform: rotate(-9deg); }
          75%      { transform: rotate(9deg); }
        }

        /* ─── Badge ──────────────────────────────────── */
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 18px; border-radius: 99px;
          background: #fff;
          border: 1.5px solid rgba(234,88,12,0.22);
          color: #C44A0A;
          font-size: clamp(11px,1.1vw,13px); font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: clamp(20px,3vw,32px);
          box-shadow: 0 2px 14px rgba(234,88,12,0.1), 0 1px 0 #fff inset;
          position: relative; overflow: hidden;
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #EA580C; flex-shrink: 0; position: relative;
        }
        .badge-dot::after {
          content: '';
          position: absolute; inset: -3px; border-radius: 50%;
          background: rgba(234,88,12,0.28);
          animation: ping 1.9s ease-in-out infinite;
        }
        @keyframes ping {
          0%   { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        /* ─── Headline ───────────────────────────────── */
        .h1 {
          font-family: 'Amiri', serif;
          font-size: clamp(42px, 6.8vw, 82px);
          font-weight: 700; font-style: italic;
          line-height: 1.1; letter-spacing: -0.01em;
          color: #1C1208;
          margin-bottom: clamp(14px,2vw,22px);
        }
        .words { display: flex; flex-wrap: wrap; justify-content: center; gap: 0 0.22em; }
        .word { display: inline-block; }

        /* ─── Typewriter ─────────────────────────────── */
        .tw-wrap { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 12px; }
        .tw-text {
          background: linear-gradient(128deg, #EA580C 0%, #C47A0A 48%, #EA580C 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: tpan 3.8s linear infinite;
          filter: drop-shadow(0 1px 10px rgba(234,88,12,0.22));
        }
        @keyframes tpan {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .tw-cursor {
          display: inline-block; width: 3px; height: 0.78em;
          background: linear-gradient(to bottom, #EA580C, #C47A0A);
          border-radius: 2px; vertical-align: middle; transition: opacity 0.12s;
        }

        /* ─── Sub ────────────────────────────────────── */
        .sub {
          font-size: clamp(14px,1.5vw,18px);
          color: #6B5540; line-height: 1.82; max-width: 560px;
          margin: 0 auto clamp(30px,4vw,46px); font-weight: 400;
        }

        /* ─── CTA group ──────────────────────────────── */
        .ctas {
          display: flex; flex-direction: column;
          gap: 12px; align-items: center; justify-content: center;
        }
        @media (min-width: 500px) { .ctas { flex-direction: row; } }

        .btn-p {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center;
          justify-content: center; gap: 10px;
          min-height: 54px; padding: 0 clamp(22px,3vw,36px);
          border-radius: 14px;
          background: linear-gradient(135deg, #C44A0A 0%, #EA580C 48%, #F0850A 100%);
          color: #fff; font-family: 'Tajawal', sans-serif;
          font-size: clamp(13px,1.4vw,16px); font-weight: 800;
          border: none; cursor: pointer; letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(234,88,12,0.38), 0 1px 0 rgba(255,255,255,0.2) inset;
          width: 100%; white-space: nowrap;
        }
        @media (min-width: 500px) { .btn-p { width: auto; } }
        .btn-p-shine {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
        }

        .btn-s {
          display: inline-flex; align-items: center;
          justify-content: center; gap: 8px;
          min-height: 54px; padding: 0 clamp(20px,3vw,30px);
          border-radius: 14px;
          background: #fff; border: 1.5px solid rgba(26,18,8,0.11);
          color: #3D2A18; font-family: 'Tajawal', sans-serif;
          font-size: clamp(13px,1.4vw,16px); font-weight: 600;
          cursor: pointer; width: 100%; white-space: nowrap;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        @media (min-width: 500px) { .btn-s { width: auto; } }

        /* ─── Divider ────────────────────────────────── */
        .divider {
          display: flex; align-items: center; gap: 14px;
          margin: clamp(28px,4vw,44px) auto; max-width: 280px;
        }
        .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(160,100,20,0.18), transparent);
        }
        .divider-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #EA580C; opacity: 0.45;
        }

        /* ─── Stats ──────────────────────────────────── */
        .stats {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: clamp(10px,1.8vw,16px);
        }
        @media (min-width: 560px) { .stats { grid-template-columns: repeat(4,1fr); } }

        .stat {
          background: #fff;
          border: 1.5px solid rgba(26,18,8,0.07);
          border-radius: 18px;
          padding: clamp(16px,2vw,24px) clamp(12px,1.5vw,18px);
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          position: relative; overflow: hidden; cursor: default;
        }
        /* Top color bar */
        .stat::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 55%; height: 2.5px;
          background: var(--sc); border-radius: 0 0 4px 4px; opacity: 0.75;
        }
        .stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 8px;
          background: color-mix(in srgb, var(--sc) 12%, transparent);
        }
        .stat-icon svg { width: 16px; height: 16px; color: var(--sc); stroke-width: 2.2; }
        .stat-num {
          font-size: clamp(26px,3.2vw,36px); font-weight: 900;
          line-height: 1.05; margin-bottom: 4px;
          font-variant-numeric: tabular-nums; color: var(--sc);
        }
        .stat-lbl {
          font-size: clamp(10px,1vw,12px); color: #9A7A55;
          font-weight: 500; letter-spacing: 0.02em;
        }

        /* ─── Scroll cue ─────────────────────────────── */
        .scue {
          position: absolute; bottom: clamp(20px,4vh,36px);
          left: 50%; transform: translateX(-50%);
          z-index: 10;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          color: #C4A070; font-size: 10px; letter-spacing: 0.12em;
          font-family: 'Tajawal', sans-serif;
          animation: scaim 2.8s ease-in-out infinite;
        }
        @keyframes scaim {
          0%,100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
          50%      { transform: translateX(-50%) translateY(7px); opacity: 1; }
        }
        .scue-mouse {
          width: 20px; height: 32px;
          border: 1.5px solid rgba(180,83,9,0.3);
          border-radius: 10px;
          display: flex; align-items: flex-start;
          justify-content: center; padding-top: 5px;
        }
        .scue-dot {
          width: 3px; height: 7px;
          background: linear-gradient(to bottom, #EA580C, transparent);
          border-radius: 2px;
          animation: sdot 2.8s ease-in-out infinite;
        }
        @keyframes sdot {
          0%,100% { transform: translateY(0); opacity: 1; }
          50%      { transform: translateY(9px); opacity: 0.12; }
        }

        /* ─── Side lines ─────────────────────────────── */
        .sline {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 1px; height: 170px;
          background: linear-gradient(to bottom, transparent, rgba(234,88,12,0.16), transparent);
          z-index: 2;
        }
        .sline::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 5px; height: 5px; border-radius: 50%;
          background: #EA580C; box-shadow: 0 0 9px rgba(234,88,12,0.55);
        }
        .sline-l { left: clamp(16px,4vw,52px); }
        .sline-r { right: clamp(16px,4vw,52px); }
      `}</style>

      <section ref={sRef} className="h-root">
        {/* Background blobs */}
        <div aria-hidden>
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
        </div>

        {/* Scroll-linked parallax orbs */}
        <ParallaxOrbs sRef={sRef} />

        {/* Side decorative lines */}
        <div className="sline sline-l" />
        <div className="sline sline-r" />

        {/* ── Main content ── */}
        <motion.div
          className="h-content"
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          animate="visible"
        >
          {/* Food pill */}
          <motion.div variants={fadeUp}>
            <div className="food-pill">
              <span className="food-emoji">🍽️</span>
              <span>منصة المطاعم الأولى في السعودية</span>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp}>
         
          </motion.div>

          {/* Headline — word-by-word stagger */}
          <motion.h1
            className="h1"
            variants={stagger(0.065, 0)}
            initial="hidden"
            animate="visible"
          >
            <span className="words">
              {WORDS.map((w, i) => (
                <motion.span key={`${w}-${i}`} className="word" variants={wordVar}>
                  {w}
                </motion.span>
              ))}
            </span>
            <br />
            <Typewriter reduced={reduced} />
          </motion.h1>

          {/* Sub */}
          <motion.p className="sub" variants={fadeUp}>
            انضم إلى شلّه، شريك النمو الأول للمطاعم في السعودية. رصيد تشغيلي
            فوري وتدفق السيولة خلال 49 ساعة فقط، بميزة "قيدها" الحصرية.
          </motion.p>

          {/* CTAs */}
          <motion.div className="ctas" variants={fadeUp}>
            {/* Magnetic primary */}
            <Link
              href="/partner"
              className="btn-p"
           
            >
              <motion.span
                className="btn-p-shine"
                initial={{ x: "-120%" }}
                whileHover={reduced ? {} : { x: "120%", transition: { duration: 0.55, ease: EASE_EXPO } }}
              
              />
              <span>ادخل تفاصيل مطعمك الآن</span>
              <ArrowLeft size={15} strokeWidth={2.5} />
            </Link>

            {/* Secondary */}
            <motion.button
              className="btn-s"
              whileHover={
                reduced ? {} : {
                  y: -2,
                  borderColor: "rgba(234,88,12,0.28)",
                  boxShadow: "0 4px 18px rgba(234,88,12,0.09)",
                  transition: SPRING_SOFT,
                }
              }
              whileTap={reduced ? {} : { scale: 0.97 }}
            >
              <span>اعرف أكثر عن قيدها</span>
              <ChevronDown size={15} strokeWidth={2.2} />
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div className="divider" variants={fadeUp}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line" />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats"
            variants={stagger(0.09, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {STATS.map(({ Icon, to, prefix, suffix, label, color }) => (
              <motion.div
                key={label}
                className="stat"
                style={{ "--sc": color } as React.CSSProperties}
                variants={scaleIn}
                whileHover={
                  reduced ? {} : {
                    y: -5,
                    boxShadow: "0 8px 28px rgba(0,0,0,0.09)",
                    borderColor: `${color}25`,
                    transition: SPRING,
                  }
                }
              >
                <div className="stat-icon">
                  <Icon />
                </div>
                <div className="stat-num">
                  <Counter to={to} prefix={prefix} suffix={suffix} reduced={reduced} />
                </div>
                <div className="stat-lbl">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <div className="scue">
          <div className="scue-mouse">
            <div className="scue-dot" />
          </div>
          <span>اسكرول</span>
        </div>
      </section>
    </>
  );
}