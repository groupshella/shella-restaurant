"use client";

import { useEffect, useRef, useState } from "react";

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "⚡",
    title: "بروتوكول الساعة 49",
    desc: "نلتزم بتحويل مبيعاتك خلال 48 ساعة. تأخرنا؟ طلباتك القادمة بدون عمولة تماماً!",
    accent: "#f97316",
    accentRgb: "249,115,22",
    tag: "السيولة الفورية",
  },
  {
    icon: "💰",
    title: "رصيد التأسيس الفوري",
    desc: "نودع 1,000 ريال كاش تشغيلي في محفظتك بمجرد انضمامك. نستثمر في نجاحك قبل أن تبدأ.",
    accent: "#D4910A",
    accentRgb: "212,145,10",
    tag: "تمويل مجاني",
  },
  {
    icon: "💳",
    title: 'ثورة "قيدها"',
    desc: "العميل يطلب آجل وأنت تستلم كاشاً فوراً. نتحمل مخاطر التحصيل بالكامل عنك.",
    accent: "#E5533A",
    accentRgb: "229,83,58",
    tag: "مخاطرة صفر",
  },
  {
    icon: "🤝",
    title: "شراكة حقيقية",
    desc: "أجهزة POS ذكية، مدير حساب مخصص، وتخطيط ميداني يستهدف العملاء في قلب حيّك.",
    accent: "#14b8a6",
    accentRgb: "20,184,166",
    tag: "دعم ميداني",
  },
  {
    icon: "📈",
    title: "عمولة تحفز النجاح",
    desc: "عمولات تتقلص كلما ارتقيت في مدرج السيولة لضمان أعلى هوامش ربح في السوق.",
    accent: "#f97316",
    accentRgb: "249,115,22",
    tag: "نمو مستدام",
  },
  {
    icon: "🤖",
    title: "ذكاء اصطناعي متكامل",
    desc: "الطلب يطير من العميل للكاشير للمطبخ مباشرة، مع خط سير لحظي للسائق والعميل.",
    accent: "#0E9E82",
    accentRgb: "14,158,130",
    tag: "تقنية متقدمة",
  },
];

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  f,
  index,
  inView,
}: {
  f: (typeof features)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="feat-card"
      style={
        {
          "--accent": f.accent,
          "--accent-rgb": f.accentRgb,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(32px)",
          transition: `opacity 0.65s cubic-bezier(.16,1,.3,1) ${index * 90}ms,
                       transform 0.65s cubic-bezier(.16,1,.3,1) ${index * 90}ms`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div className="feat-top-line" />

      {/* Hover radial glow */}
      <div className="feat-hover-glow" style={{ opacity: hovered ? 1 : 0 }} />

      {/* Corner number */}
      <span className="feat-index">0{index + 1}</span>

      {/* Icon */}
      <div className="feat-icon-wrap">
        <span className="feat-icon-emoji">{f.icon}</span>
        <div className="feat-icon-ring" />
      </div>

      {/* Tag pill */}
      <span className="feat-tag">{f.tag}</span>

      {/* Text */}
      <h3 className="feat-title">{f.title}</h3>
      <p className="feat-desc">{f.desc}</p>

      {/* Bottom border glow on hover */}
      <div className="feat-bottom-glow" style={{ opacity: hovered ? 1 : 0 }} />
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
export function Features() {
  const { ref, inView } = useInView(0.1);
  const { ref: headerRef, inView: headerIn } = useInView(0.3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        /* ── Section ── */
        .feat-section {
          position: relative;
          padding: clamp(64px,10vw,120px) clamp(16px,5vw,40px);
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          overflow: hidden;
        }

        /* Subtle grid bg */
        .feat-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        /* ── Header ── */
        .feat-header {
          text-align: center;
          margin-bottom: clamp(40px,6vw,72px);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .feat-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(10px,1vw,12px);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f97316;
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s, transform 0.6s;
        }
        .feat-eyebrow.in { opacity: 1; transform: none; }
        .feat-eyebrow-line {
          width: 28px; height: 1px;
          background: linear-gradient(90deg, transparent, #f97316);
        }
        .feat-eyebrow-line.rev {
          background: linear-gradient(90deg, #f97316, transparent);
        }

        .feat-h2 {
          font-size: clamp(26px,4vw,48px);
          font-weight: 900;
          color: #fff;
          line-height: 1.18;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s 0.12s, transform 0.6s 0.12s;
        }
        .feat-h2.in { opacity: 1; transform: none; }
        .feat-h2 span {
          background: linear-gradient(130deg, #F97316, #F0A429 50%, #FB923C);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: feat-pan 4s linear infinite;
        }
        @keyframes feat-pan {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .feat-sub {
          font-size: clamp(13px,1.4vw,16px);
          color: rgba(210,185,150,0.45);
          line-height: 1.8;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s 0.22s, transform 0.6s 0.22s;
        }
        .feat-sub.in { opacity: 1; transform: none; }

        /* ── Grid ── */
        .feat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px,2vw,20px);
          max-width: 1060px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 580px)  { .feat-grid { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 900px)  { .feat-grid { grid-template-columns: repeat(3,1fr); } }

        /* ── Card ── */
        .feat-card {
          position: relative;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
          border-radius: 20px;
          padding: clamp(20px,2.5vw,28px);
          overflow: hidden;
          cursor: default;
          transition: border-color 0.3s, transform 0.3s;
        }
        .feat-card:hover {
          border-color: rgba(var(--accent-rgb), 0.35);
          transform: translateY(-5px);
        }

        .feat-top-line {
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.6), transparent);
        }

        .feat-hover-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% -10%, rgba(var(--accent-rgb),0.1), transparent 70%);
          pointer-events: none;
          transition: opacity 0.4s;
        }

        .feat-index {
          position: absolute;
          top: 18px;
          left: 20px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(var(--accent-rgb),0.3);
          letter-spacing: 0.05em;
          font-variant-numeric: tabular-nums;
        }

        .feat-icon-wrap {
          position: relative;
          width: 52px; height: 52px;
          margin-bottom: 16px;
        }
        .feat-icon-emoji {
          position: relative;
          z-index: 1;
          font-size: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          background: rgba(var(--accent-rgb), 0.1);
          border-radius: 14px;
          border: 1px solid rgba(var(--accent-rgb), 0.2);
          transition: background 0.3s;
        }
        .feat-card:hover .feat-icon-emoji {
          background: rgba(var(--accent-rgb), 0.18);
        }
        .feat-icon-ring {
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          border: 1px solid rgba(var(--accent-rgb), 0.12);
          animation: feat-ring-pulse 3s ease-in-out infinite;
        }
        @keyframes feat-ring-pulse {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.06); opacity: 0; }
        }

        .feat-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(var(--accent-rgb), 0.8);
          background: rgba(var(--accent-rgb), 0.08);
          border: 1px solid rgba(var(--accent-rgb), 0.2);
          border-radius: 6px;
          padding: 3px 10px;
          margin-bottom: 10px;
        }

        .feat-title {
          font-size: clamp(15px,1.6vw,18px);
          font-weight: 800;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .feat-desc {
          font-size: clamp(12px,1.2vw,14px);
          color: rgba(210,185,150,0.45);
          line-height: 1.8;
        }

        .feat-bottom-glow {
          position: absolute;
          bottom: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.4), transparent);
          transition: opacity 0.4s;
        }
      `}</style>

      <section className="feat-section">
        {/* Header */}
        <div ref={headerRef} className="feat-header">
          <div className={`feat-eyebrow ${headerIn ? "in" : ""}`}>
            <div className="feat-eyebrow-line rev" />
            لماذا شلّة
            <div className="feat-eyebrow-line" />
          </div>
          <h2 className={`feat-h2 ${headerIn ? "in" : ""}`}>
            حلول جذرية <span>لكل عقبة</span>
          </h2>
          <p className={`feat-sub ${headerIn ? "in" : ""}`}>
            وداعاً للآلام التي تعيق نمو مطعمك وتستنزف سيولتك
          </p>
        </div>

        {/* Cards */}
        <div ref={ref} className="feat-grid">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} inView={inView} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Features;