"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.12) {
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

const tiers = [
  {
    emoji: "🚀",
    label: "التأسيس",
    amount: "1,000",
    amountNum: 1000,
    desc: "خطوتك الأولى نحو النجاح",
    features: ["جهاز POS ذكي", "تفعيل قيدها", "رصيد تشغيلي فوري"],
    accent: "#f97316",
    accentRgb: "249,115,22",
    highlight: false,
    step: "01",
  },
  {
    emoji: "🔥",
    label: "الانطلاق",
    amount: "2,500",
    amountNum: 2500,
    desc: "توسّع وكسر حواجز السوق",
    features: ["أولوية الظهور", "حملة تسويقية", "زيادة الرصيد"],
    accent: "#fb923c",
    accentRgb: "251,146,60",
    highlight: false,
    step: "02",
  },
  {
    emoji: "💎",
    label: "التمكين",
    amount: "5,000",
    amountNum: 5000,
    desc: "شريك موثوق بمزايا استثنائية",
    features: ["سداد الموردين", "تصوير احترافي", "رصيد موسّع"],
    accent: "#f97316",
    accentRgb: "249,115,22",
    highlight: true,
    step: "03",
  },
  {
    emoji: "👑",
    label: "النخبة",
    amount: "10,000",
    amountNum: 10000,
    desc: "قمة الشراكة والهيمنة السوقية",
    features: ["أقل عمولة بالمملكة", "دعم إعلاني VIP", "شاشات LED متنقلة"],
    accent: "#D4910A",
    accentRgb: "212,145,10",
    highlight: false,
    step: "04",
  },
];

function TierCard({
  t,
  index,
  inView,
}: {
  t: (typeof tiers)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="tier-card"
      data-highlight={t.highlight ? "true" : "false"}
      style={
        {
          "--accent": t.accent,
          "--accent-rgb": t.accentRgb,
          opacity: inView ? 1 : 0,
          transform: inView
            ? "translateY(0) scale(1)"
            : "translateY(36px) scale(0.96)",
          transition: `opacity 0.65s ${index * 100}ms cubic-bezier(.16,1,.3,1),
                       transform 0.65s ${index * 100}ms cubic-bezier(.16,1,.3,1)`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent beam */}
      <div className="tier-top-beam" />

      {/* Hover bg */}
      <div className="tier-hover-bg" style={{ opacity: hovered ? 1 : 0 }} />

      {/* Popular badge */}
      {t.highlight && (
        <div className="tier-popular-badge">
          <span className="tier-popular-dot" />
          الأكثر شيوعاً
        </div>
      )}

      {/* Step */}
      <span className="tier-step">{t.step}</span>

      {/* Emoji */}
      <div className="tier-emoji-wrap">
        <span className="tier-emoji">{t.emoji}</span>
        {t.highlight && <div className="tier-emoji-ring" />}
      </div>

      {/* Label + desc */}
      <div className="tier-label">{t.label}</div>
      <div className="tier-desc">{t.desc}</div>

      {/* Amount */}
      <div className="tier-amount-row">
        <span className="tier-amount">{t.amount}</span>
        <span className="tier-currency">ريال</span>
      </div>

      {/* Divider */}
      <div className="tier-divider" />

      {/* Features */}
      <ul className="tier-features">
        {t.features.map((f, fi) => (
          <li key={f} className="tier-feature-item"
            style={{ transitionDelay: `${inView ? fi * 60 + index * 100 + 200 : 0}ms` }}>
            <span className="tier-check">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button className="tier-btn">
        {t.highlight ? "ابدأ الآن ←" : "اختر هذه الشريحة"}
      </button>

      {/* Bottom glow on highlighted */}
      {t.highlight && <div className="tier-bottom-glow" />}
    </div>
  );
}

export function Tiers() {
  const { ref: hdrRef, inView: hdrIn } = useInView(0.3);
  const { ref: gridRef, inView: gridIn } = useInView(0.08);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        .tiers-section {
          position: relative;
          padding: clamp(64px,10vw,120px) clamp(16px,5vw,40px);
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          overflow: hidden;
        }

        /* Diagonal gradient lines bg */
        .tiers-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 60px,
              rgba(249,115,22,0.018) 60px,
              rgba(249,115,22,0.018) 61px
            );
          pointer-events: none;
        }

        /* Centre glow */
        .tiers-section::after {
          content: '';
          position: absolute;
          bottom: -100px; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(ellipse at center, rgba(249,115,22,0.07), transparent 65%);
          pointer-events: none;
        }

        /* ── Header ── */
        .tiers-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto clamp(40px,6vw,68px);
          position: relative;
          z-index: 2;
        }
        .tiers-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: clamp(10px,1vw,12px); font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f97316; margin-bottom: 14px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .tiers-eyebrow.in { opacity: 1; transform: none; }
        .tiers-eyebrow-line {
          width: 28px; height: 1px;
          background: linear-gradient(90deg, transparent, #f97316);
        }
        .tiers-eyebrow-line.rev { background: linear-gradient(90deg, #f97316, transparent); }

        .tiers-h2 {
          font-size: clamp(26px,4vw,48px); font-weight: 900;
          color: #fff; line-height: 1.18; letter-spacing: -0.02em;
          margin-bottom: 12px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .tiers-h2.in { opacity: 1; transform: none; }
        .tiers-h2 em {
          font-style: normal;
          background: linear-gradient(130deg,#F97316,#F0A429 50%,#FB923C);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: tpan 4s linear infinite;
        }
        @keyframes tpan {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .tiers-sub {
          font-size: clamp(13px,1.4vw,16px); color: rgba(210,185,150,0.45); line-height: 1.8;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.6s 0.2s, transform 0.6s 0.2s;
        }
        .tiers-sub.in { opacity: 1; transform: none; }

        /* Progress track */
        .tiers-track {
          max-width: 860px; margin: 0 auto clamp(36px,5vw,56px);
          position: relative; z-index: 2;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.6s 0.3s, transform 0.6s 0.3s;
        }
        .tiers-track.in { opacity: 1; transform: none; }
        .tiers-track-line {
          height: 2px;
          background: linear-gradient(90deg,
            rgba(249,115,22,0.8) 0%,
            rgba(212,145,10,0.8) 33%,
            rgba(249,115,22,1) 66%,
            rgba(212,145,10,0.6) 100%
          );
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }
        .tiers-track-line::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: track-shine 3s ease-in-out infinite;
        }
        @keyframes track-shine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .tiers-track-dots {
          display: flex; justify-content: space-between;
          margin-top: -5px; padding: 0 2px;
        }
        .tiers-track-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 8px rgba(249,115,22,0.7);
          position: relative;
        }
        .tiers-track-dot::after {
          content: attr(data-label);
          position: absolute; top: 16px; left: 50%;
          transform: translateX(-50%);
          font-size: 10px; font-weight: 700; color: rgba(249,115,22,0.6);
          white-space: nowrap; letter-spacing: 0.05em;
        }

        /* ── Grid ── */
        .tiers-grid {
          display: grid; grid-template-columns: 1fr;
          gap: clamp(12px,2vw,18px);
          max-width: 1060px; margin: 0 auto;
          position: relative; z-index: 2;
        }
        @media (min-width: 560px) { .tiers-grid { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 960px) { .tiers-grid { grid-template-columns: repeat(4,1fr); } }

        /* ── Card ── */
        .tier-card {
          position: relative;
          border-radius: 22px;
          padding: clamp(20px,2.5vw,28px) clamp(16px,2vw,22px);
          overflow: hidden;
          cursor: default;
          transition: transform 0.3s cubic-bezier(.16,1,.3,1), border-color 0.3s;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
        }
        .tier-card[data-highlight="true"] {
          background: rgba(249,115,22,0.06);
          border: 1.5px solid rgba(249,115,22,0.5);
          box-shadow: 0 0 40px rgba(249,115,22,0.15), inset 0 1px 0 rgba(249,115,22,0.2);
        }
        .tier-card:hover { transform: translateY(-7px); }
        .tier-card:not([data-highlight="true"]):hover {
          border-color: rgba(var(--accent-rgb),0.35);
        }

        .tier-top-beam {
          position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.7), transparent);
        }
        .tier-hover-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(var(--accent-rgb),0.1), transparent 70%);
          pointer-events: none; transition: opacity 0.4s;
        }

        .tier-popular-badge {
          display: inline-flex; align-items: center; gap: 5px;
          position: absolute; top: 14px; right: 14px;
          font-size: 10px; font-weight: 700;
          background: linear-gradient(135deg,#ea580c,#f97316);
          color: #fff; padding: 4px 10px; border-radius: 99px;
          box-shadow: 0 2px 10px rgba(249,115,22,0.4);
          letter-spacing: 0.03em;
        }
        .tier-popular-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.8);
          animation: pop-dot 1.6s ease-in-out infinite;
        }
        @keyframes pop-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }

        .tier-step {
          position: absolute; top: 16px; left: 16px;
          font-size: 11px; font-weight: 700;
          color: rgba(var(--accent-rgb),0.35);
          letter-spacing: 0.06em; font-variant-numeric: tabular-nums;
        }

        .tier-emoji-wrap {
          position: relative; width: 52px; height: 52px;
          margin-bottom: clamp(10px,1.5vw,14px);
          margin-top: clamp(8px,1vw,12px);
        }
        .tier-emoji {
          width: 52px; height: 52px; border-radius: 15px;
          background: rgba(var(--accent-rgb),0.1);
          border: 1px solid rgba(var(--accent-rgb),0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; position: relative; z-index: 1;
          transition: background 0.3s;
        }
        .tier-card:hover .tier-emoji { background: rgba(var(--accent-rgb),0.18); }
        .tier-emoji-ring {
          position: absolute; inset: -5px; border-radius: 19px;
          border: 1px solid rgba(249,115,22,0.25);
          animation: emoji-ring 3s ease-in-out infinite;
        }
        @keyframes emoji-ring {
          0%,100% { transform:scale(1); opacity:0.6; }
          50%      { transform:scale(1.08); opacity:0; }
        }

        .tier-label {
          font-size: clamp(10px,1vw,11px); font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(var(--accent-rgb),0.75); margin-bottom: 4px;
        }
        .tier-desc {
          font-size: clamp(11px,1.1vw,12px); color: rgba(210,185,150,0.45);
          line-height: 1.6; margin-bottom: clamp(12px,1.5vw,16px);
        }

        .tier-amount-row {
          display: flex; align-items: baseline; gap: 6px;
          margin-bottom: clamp(12px,1.5vw,18px);
        }
        .tier-amount {
          font-size: clamp(26px,3vw,34px); font-weight: 900;
          background: linear-gradient(130deg,#F97316,#F0A429);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; line-height: 1; letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .tier-currency {
          font-size: 13px; font-weight: 600;
          color: rgba(210,185,150,0.45);
        }

        .tier-divider {
          height: 1px; margin-bottom: clamp(12px,1.5vw,16px);
          background: linear-gradient(90deg, rgba(var(--accent-rgb),0.3), rgba(255,200,140,0.06), transparent);
        }

        .tier-features { list-style: none; margin-bottom: clamp(16px,2vw,22px); }
        .tier-feature-item {
          display: flex; align-items: center; gap: 8px;
          font-size: clamp(11px,1.1vw,13px); color: rgba(210,185,150,0.6);
          padding: 5px 0;
          border-bottom: 1px solid rgba(255,200,140,0.06);
          opacity: 0; transform: translateX(8px);
          transition: opacity 0.4s, transform 0.4s;
        }
        .tier-feature-item.visible { opacity: 1; transform: none; }
        .tier-check {
          color: rgba(var(--accent-rgb),1); font-weight: 800;
          font-size: 13px; flex-shrink: 0;
          text-shadow: 0 0 8px rgba(var(--accent-rgb),0.5);
        }

        .tier-btn {
          width: 100%; min-height: 44px; border-radius: 12px;
          font-family: 'Tajawal',sans-serif;
          font-size: clamp(12px,1.2vw,14px); font-weight: 800;
          cursor: pointer; transition: all 0.2s; border: none;
          letter-spacing: 0.02em;
        }
        .tier-card[data-highlight="true"] .tier-btn {
          background: linear-gradient(135deg,#EA6C0A,#F97316 40%,#F0A429);
          color: #fff;
          box-shadow: 0 4px 20px rgba(249,115,22,0.45);
        }
        .tier-card[data-highlight="true"] .tier-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(249,115,22,0.6);
        }
        .tier-card:not([data-highlight="true"]) .tier-btn {
          background: rgba(255,190,120,0.05);
          border: 1px solid rgba(var(--accent-rgb),0.25);
          color: rgba(var(--accent-rgb),0.85);
        }
        .tier-card:not([data-highlight="true"]) .tier-btn:hover {
          background: rgba(var(--accent-rgb),0.1);
          border-color: rgba(var(--accent-rgb),0.45);
        }

        .tier-bottom-glow {
          position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent);
        }
      `}</style>

      <section className="tiers-section">
        {/* Header */}
        <div ref={hdrRef} className="tiers-header">
          <div className={`tiers-eyebrow ${hdrIn ? "in" : ""}`}>
            <div className="tiers-eyebrow-line rev" />
            مدرج السيولة
            <div className="tiers-eyebrow-line" />
          </div>
          <h2 className={`tiers-h2 ${hdrIn ? "in" : ""}`}>
            رحلتك من التأسيس <em>إلى النخبة</em>
          </h2>
          <p className={`tiers-sub ${hdrIn ? "in" : ""}`}>
            طموحك لا سقف له.. ونحن ندفعه بالكاش والتمويل
          </p>
        </div>

        {/* Progress track */}
        <div ref={hdrRef} className={`tiers-track ${hdrIn ? "in" : ""}`}>
          <div className="tiers-track-line" />
          <div className="tiers-track-dots">
            {tiers.map((t) => (
              <div key={t.label} className="tiers-track-dot" data-label={t.label} />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="tiers-grid">
          {tiers.map((t, i) => (
            <TierCard key={t.label} t={t} index={i} inView={gridIn} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Tiers;