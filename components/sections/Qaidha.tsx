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
const roles = [
  {
    icon: "🍽️",
    role: "أنت (المطعم)",
    desc: "تبيع الوجبة وتستلم قيمتها كاملة فور خروج الطلب. لا ديون، لا انتظار.",
    accent: "#f97316",
    accentRgb: "249,115,22",
    step: "01",
    highlight: true,
  },
  {
    icon: "📱",
    role: "الزبون",
    desc: "يطلب الآن ويسدد مع الراتب. يحصل على وجبته بكل راحة وبسعر منافس.",
    accent: "#E5533A",
    accentRgb: "229,83,58",
    step: "02",
    highlight: false,
  },
  {
    icon: "🛡️",
    role: "شلّة",
    desc: "نتحمل 100% من المسؤولية القانونية والمالية وعمليات التحصيل.",
    accent: "#14b8a6",
    accentRgb: "20,184,166",
    step: "03",
    highlight: false,
  },
];

// Flow steps for the animated diagram
const FLOW_STEPS = [
  { label: "العميل يطلب", sub: "بنظام الآجل", icon: "📱" },
  { label: "شلّة تضمن", sub: "الدفع فوراً", icon: "🛡️" },
  { label: "أنت تستلم", sub: "كاش في حسابك", icon: "💰" },
];

// ─── Animated flow diagram ─────────────────────────────────────────────────
function FlowDiagram({ inView }: { inView: boolean }) {
  return (
    <div className="qaidha-flow">
      {FLOW_STEPS.map((step, i) => (
        <div key={step.label} className="qaidha-flow-item-wrap">
          <div
            className="qaidha-flow-node"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.8)",
              transition: `opacity 0.5s ${0.3 + i * 0.15}s, transform 0.5s ${0.3 + i * 0.15}s cubic-bezier(.34,1.56,.64,1)`,
            }}
          >
            <div className="qaidha-flow-icon">{step.icon}</div>
            <div className="qaidha-flow-label">{step.label}</div>
            <div className="qaidha-flow-sub">{step.sub}</div>
          </div>

          {/* Arrow between nodes */}
          {i < FLOW_STEPS.length - 1 && (
            <div
              className="qaidha-flow-arrow"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ${0.45 + i * 0.15}s`,
              }}
            >
              <div className="qaidha-flow-arrow-line" />
              <div className="qaidha-flow-arrow-dot" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({
  r,
  index,
  inView,
}: {
  r: (typeof roles)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="qaidha-role-card"
      style={
        {
          "--accent": r.accent,
          "--accent-rgb": r.accentRgb,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(28px)",
          transition: `opacity 0.65s ${0.1 + index * 0.12}s cubic-bezier(.16,1,.3,1),
                       transform 0.65s ${0.1 + index * 0.12}s cubic-bezier(.16,1,.3,1)`,
          borderColor: r.highlight
            ? `rgba(${r.accentRgb},0.45)`
            : `rgba(255,200,140,0.08)`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top glow */}
      {r.highlight && <div className="qaidha-card-top-glow" />}

      {/* Hover radial */}
      <div
        className="qaidha-card-hover-bg"
        style={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Step badge */}
      <span className="qaidha-step-badge">{r.step}</span>

      {/* Icon */}
      <div className="qaidha-role-icon-wrap">
        <div className="qaidha-role-icon">{r.icon}</div>
        {r.highlight && <div className="qaidha-role-icon-pulse" />}
      </div>

      {/* Role label */}
      <div className="qaidha-role-name">{r.role}</div>

      {/* Desc */}
      <p className="qaidha-role-desc">{r.desc}</p>

      {/* Connector dot for middle card */}
      {index === 1 && (
        <div className="qaidha-center-badge">⚡ محور العملية</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Qaidha() {
  const { ref: headerRef, inView: headerIn } = useInView(0.3);
  const { ref: cardsRef, inView: cardsIn } = useInView(0.1);
  const { ref: flowRef, inView: flowIn } = useInView(0.3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        /* ── Section ── */
        .qaidha-section {
          position: relative;
          padding: clamp(64px,10vw,120px) clamp(16px,5vw,40px);
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          overflow: hidden;
        }

        /* Big ambient glow behind section */
        .qaidha-section::before {
          content: '';
          position: absolute;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 500px;
          background: radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Horizontal scan line */
        .qaidha-section::after {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.08), transparent);
          pointer-events: none;
        }

        /* ── Header ── */
        .qaidha-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto clamp(40px,6vw,70px);
          position: relative;
          z-index: 2;
        }

        .qaidha-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px;
          border-radius: 99px;
          border: 1px solid rgba(249,115,22,0.35);
          background: rgba(249,115,22,0.08);
          color: #fdba74;
          font-size: clamp(11px,1.1vw,13px);
          font-weight: 600;
          margin-bottom: clamp(16px,2vw,24px);
          letter-spacing: 0.02em;
          backdrop-filter: blur(8px);
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .qaidha-badge.in { opacity: 1; transform: none; }

        .qaidha-h2 {
          font-size: clamp(26px,4.5vw,52px);
          font-weight: 900;
          color: #fff;
          line-height: 1.16;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .qaidha-h2.in { opacity: 1; transform: none; }

        .qaidha-gradient-text {
          background: linear-gradient(130deg, #F97316 0%, #F0A429 40%, #FB923C 80%, #F97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: q-pan 4s linear infinite;
          filter: drop-shadow(0 0 16px rgba(249,115,22,0.4));
        }
        @keyframes q-pan {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .qaidha-sub {
          font-size: clamp(13px,1.4vw,16px);
          color: rgba(210,185,150,0.45);
          line-height: 1.85;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s 0.2s, transform 0.6s 0.2s;
        }
        .qaidha-sub.in { opacity: 1; transform: none; }

        /* ── Flow diagram ── */
        .qaidha-flow-wrap {
          max-width: 680px;
          margin: 0 auto clamp(48px,6vw,72px);
          position: relative;
          z-index: 2;
        }
        .qaidha-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: nowrap;
        }
        .qaidha-flow-item-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }
        .qaidha-flow-node {
          flex: 1;
          min-width: 0;
          text-align: center;
          padding: clamp(14px,2vw,20px) clamp(8px,1.5vw,14px);
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 16px;
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .qaidha-flow-node::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent);
        }
        .qaidha-flow-icon {
          font-size: clamp(20px,3vw,28px);
          margin-bottom: 6px;
          display: block;
        }
        .qaidha-flow-label {
          font-size: clamp(12px,1.3vw,14px);
          font-weight: 800;
          color: #fff;
          margin-bottom: 3px;
        }
        .qaidha-flow-sub {
          font-size: clamp(10px,1vw,12px);
          color: rgba(249,115,22,0.7);
          font-weight: 600;
        }

        .qaidha-flow-arrow {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          padding: 0 6px;
          position: relative;
        }
        .qaidha-flow-arrow-line {
          width: clamp(20px,3vw,40px);
          height: 1px;
          background: linear-gradient(90deg, rgba(249,115,22,0.4), rgba(249,115,22,0.7));
          position: relative;
        }
        .qaidha-flow-arrow-line::after {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 6px; height: 6px;
          background: rgba(249,115,22,0.6);
          border-radius: 50%;
          animation: flow-pulse 2s ease-in-out infinite;
        }
        .qaidha-flow-arrow-dot {
          width: 0; height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-right: 7px solid rgba(249,115,22,0.7);
        }
        @keyframes flow-pulse {
          0%,100% { left: 0; opacity: 1; }
          100%     { left: 100%; opacity: 0; }
        }

        /* ── Role Cards grid ── */
        .qaidha-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px,2vw,20px);
          max-width: 900px;
          margin: 0 auto clamp(36px,5vw,56px);
          position: relative;
          z-index: 2;
        }
        @media (min-width: 560px) {
          .qaidha-cards-grid { grid-template-columns: repeat(3,1fr); }
        }

        .qaidha-role-card {
          position: relative;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
          border-radius: 20px;
          padding: clamp(20px,2.5vw,30px) clamp(16px,2vw,24px);
          text-align: center;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s;
          cursor: default;
        }
        .qaidha-role-card:hover {
          transform: translateY(-6px);
          border-color: rgba(var(--accent-rgb),0.45) !important;
        }

        .qaidha-card-top-glow {
          position: absolute;
          top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.7), transparent);
        }
        .qaidha-card-hover-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(var(--accent-rgb),0.1), transparent 70%);
          pointer-events: none;
          transition: opacity 0.4s;
        }

        .qaidha-step-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(var(--accent-rgb),0.5);
          letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
        }

        .qaidha-role-icon-wrap {
          position: relative;
          width: 60px; height: 60px;
          margin: 0 auto clamp(10px,1.5vw,16px);
        }
        .qaidha-role-icon {
          width: 60px; height: 60px;
          border-radius: 18px;
          background: rgba(var(--accent-rgb),0.1);
          border: 1px solid rgba(var(--accent-rgb),0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          position: relative;
          z-index: 1;
          transition: background 0.3s;
        }
        .qaidha-role-card:hover .qaidha-role-icon {
          background: rgba(var(--accent-rgb),0.18);
        }
        .qaidha-role-icon-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 22px;
          border: 1px solid rgba(249,115,22,0.2);
          animation: role-ring 2.8s ease-in-out infinite;
        }
        @keyframes role-ring {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.1); opacity: 0; }
        }

        .qaidha-role-name {
          font-size: clamp(11px,1.1vw,12px);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(var(--accent-rgb),0.9);
          margin-bottom: 10px;
        }

        .qaidha-role-desc {
          font-size: clamp(12px,1.2vw,14px);
          color: rgba(210,185,150,0.45);
          line-height: 1.8;
        }

        .qaidha-center-badge {
          display: inline-block;
          margin-top: 14px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(229,83,58,0.8);
          background: rgba(229,83,58,0.1);
          border: 1px solid rgba(229,83,58,0.25);
          border-radius: 6px;
          padding: 3px 10px;
          letter-spacing: 0.05em;
        }

        /* ── Summary box ── */
        .qaidha-summary {
          max-width: 700px;
          margin: 0 auto clamp(36px,5vw,52px);
          padding: clamp(20px,2.5vw,30px) clamp(20px,3vw,36px);
          background: rgba(249,115,22,0.05);
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 20px;
          text-align: center;
          position: relative;
          z-index: 2;
          backdrop-filter: blur(10px);
          overflow: hidden;
        }
        .qaidha-summary::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent);
        }
        .qaidha-summary-text {
          font-size: clamp(14px,1.6vw,18px);
          font-weight: 700;
          color: #fff;
          line-height: 1.7;
        }
        .qaidha-summary-text em {
          font-style: normal;
          background: linear-gradient(130deg, #F97316, #F0A429);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── CTA ── */
        .qaidha-cta-wrap {
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .qaidha-cta-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 54px;
          padding: 0 clamp(24px,3.5vw,40px);
          border-radius: 14px;
          background: linear-gradient(135deg, #EA6C0A, #F97316 40%, #F0A429);
          color: #fff;
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(13px,1.4vw,16px);
          font-weight: 800;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 30px rgba(249,115,22,0.4), 0 0 0 1px rgba(249,115,22,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .qaidha-cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%);
          pointer-events: none;
        }
        .qaidha-cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 40px rgba(249,115,22,0.55), 0 0 0 1px rgba(249,115,22,0.45);
        }
        .qaidha-cta-btn:active { transform: scale(0.98); }
      `}</style>

      <section className="qaidha-section">
        {/* ── Header ── */}
        <div ref={headerRef} className="qaidha-header">
          <div className={`qaidha-badge ${headerIn ? "in" : ""}`}>
            <span style={{ fontSize: "16px" }}>💳</span>
            ميزة حصرية — قيدها
          </div>
          <h2 className={`qaidha-h2 ${headerIn ? "in" : ""}`}>
            بع بالآجل..{" "}
            <span className="qaidha-gradient-text">واستلم كاشك فوراً</span>
          </h2>
          <p className={`qaidha-sub ${headerIn ? "in" : ""}`}>
            البيع والربح عندك.. والمخاطرة والتحصيل علينا
          </p>
        </div>

        {/* ── Flow Diagram ── */}
        <div ref={flowRef} className="qaidha-flow-wrap">
          <FlowDiagram inView={flowIn} />
        </div>

        {/* ── Role Cards ── */}
        <div ref={cardsRef} className="qaidha-cards-grid">
          {roles.map((r, i) => (
            <RoleCard key={r.role} r={r} index={i} inView={cardsIn} />
          ))}
        </div>

        {/* ── Summary callout ── */}
        <div className="qaidha-summary">
          <p className="qaidha-summary-text">
            أنت تركز على <em>جودة طبخك وإرضاء زبائنك</em>،
            ونحن نتولى تحويل كل طلب <em>"آجل"</em> إلى <em>"كاش"</em> في حسابك.
          </p>
        </div>

        {/* ── CTA ── */}
        <div className="qaidha-cta-wrap">
          <button className="qaidha-cta-btn">
            <span>اعرف أكثر عن قيدها</span>
            <span style={{ fontSize: "18px", opacity: 0.9 }}>←</span>
          </button>
        </div>
      </section>
    </>
  );
}

export default Qaidha;