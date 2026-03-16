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

const items = [
  {
    icon: "📟",
    title: "أجهزة POS الذكية",
    desc: "جهاز متطور يُنظّم مبيعاتك، يراقب مخزونك، ويُظهر عداد الكاش لحظة بلحظة.",
    accent: "#f97316",
    accentRgb: "249,115,22",
    tag: "مركز القيادة",
    featured: true,
  },
  {
    icon: "🌟",
    title: "الستاندات الذهبية العملاقة",
    desc: "ستاند 180 سم بتصميم فاخر يُخبر كل من يدخل أنك شريك معتمد في شلّة.",
    accent: "#D4910A",
    accentRgb: "212,145,10",
    tag: "هوية الفخامة",
    featured: false,
  },
  {
    icon: "🎒",
    title: "شاشات LED المتنقلة",
    desc: "فريقنا يجوب الشوارع بشاشات تبرز عروض مطعمك ويجلب العملاء لبابك.",
    accent: "#E5533A",
    accentRgb: "229,83,58",
    tag: "قوات الاكتساح",
    featured: false,
  },
  {
    icon: "🎯",
    title: "استراتيجية البطاقات الذهبية",
    desc: "بطاقات VIP مخملية تُوضع داخل أكياس الطلبات لاستقطاب عملاء المنافسين.",
    accent: "#14b8a6",
    accentRgb: "20,184,166",
    tag: "حصان طروادة",
    featured: false,
  },
  {
    icon: "🚗",
    title: 'فواحات "رائحة شلّة"',
    desc: "هدايا عطرية للسيارات تحمل شعارك لتبقى في ذاكرة العميل طوال اليوم.",
    accent: "#fb923c",
    accentRgb: "251,146,60",
    tag: "التواجد الذهني",
    featured: false,
  },
];

function ArsenalCard({
  item,
  index,
  inView,
}: {
  item: (typeof items)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="arsenal-card"
      data-featured={item.featured ? "true" : "false"}
      style={
        {
          "--accent": item.accent,
          "--accent-rgb": item.accentRgb,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
          transition: `opacity 0.6s ${index * 80}ms cubic-bezier(.16,1,.3,1),
                       transform 0.6s ${index * 80}ms cubic-bezier(.16,1,.3,1)`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="arsenal-card-top-line" />
      <div className="arsenal-hover-bg" style={{ opacity: hovered ? 1 : 0 }} />

      {/* Number badge */}
      <span className="arsenal-num">0{index + 1}</span>

      {/* Icon */}
      <div className="arsenal-icon-wrap">
        <span className="arsenal-icon">{item.icon}</span>
      </div>

      {/* Tag */}
      <span className="arsenal-tag">{item.tag}</span>

      {/* Title + desc */}
      <h3 className="arsenal-title">{item.title}</h3>
      <p className="arsenal-desc">{item.desc}</p>

      {/* Arrow on hover */}
      <div className="arsenal-arrow" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(6px)" }}>
        ←
      </div>

      <div className="arsenal-bottom-line" />
    </div>
  );
}

export function Arsenal() {
  const { ref: hdrRef, inView: hdrIn } = useInView(0.3);
  const { ref: gridRef, inView: gridIn } = useInView(0.08);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        .arsenal-section {
          position: relative;
          padding: clamp(64px,10vw,120px) clamp(16px,5vw,40px);
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          overflow: hidden;
        }
        /* Dot pattern overlay */
        .arsenal-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(249,115,22,0.08) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%);
          pointer-events: none;
        }
        .arsenal-section::after {
          content: '';
          position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse at center, rgba(249,115,22,0.06), transparent 70%);
          pointer-events: none;
        }

        /* ── Header ── */
        .arsenal-header {
          text-align: center;
          max-width: 640px; margin: 0 auto clamp(40px,6vw,72px);
          position: relative; z-index: 2;
        }
        .arsenal-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: clamp(10px,1vw,12px); font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f97316; margin-bottom: 14px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .arsenal-eyebrow.in { opacity: 1; transform: none; }
        .arsenal-eyebrow-line {
          width: 28px; height: 1px;
          background: linear-gradient(90deg, transparent, #f97316);
        }
        .arsenal-eyebrow-line.rev { background: linear-gradient(90deg, #f97316, transparent); }

        .arsenal-h2 {
          font-size: clamp(26px,4vw,48px); font-weight: 900;
          color: #fff; line-height: 1.18; letter-spacing: -0.02em;
          margin-bottom: 12px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .arsenal-h2.in { opacity: 1; transform: none; }
        .arsenal-h2 em {
          font-style: normal;
          background: linear-gradient(130deg,#F97316,#F0A429 50%,#FB923C);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: apan 4s linear infinite;
        }
        @keyframes apan { 0%{background-position:0% center}100%{background-position:200% center} }

        .arsenal-sub {
          font-size: clamp(13px,1.4vw,16px); color: rgba(210,185,150,0.45); line-height: 1.8;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.6s 0.2s, transform 0.6s 0.2s;
        }
        .arsenal-sub.in { opacity: 1; transform: none; }

        /* ── Grid — 2 col on tablet, asymmetric on desktop ── */
        .arsenal-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px,1.8vw,18px);
          max-width: 1060px; margin: 0 auto;
          position: relative; z-index: 2;
        }
        @media (min-width: 560px) { .arsenal-grid { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 900px) {
          .arsenal-grid {
            grid-template-columns: repeat(3,1fr);
            grid-template-rows: auto auto;
          }
          .arsenal-card[data-featured="true"] {
            grid-column: span 1;
          }
        }

        /* ── Card ── */
        .arsenal-card {
          position: relative;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
          border-radius: 20px;
          padding: clamp(20px,2.5vw,28px) clamp(16px,2vw,22px);
          overflow: hidden; cursor: default;
          transition: transform 0.3s cubic-bezier(.16,1,.3,1), border-color 0.3s;
        }
        .arsenal-card:hover {
          transform: translateY(-6px);
          border-color: rgba(var(--accent-rgb),0.4);
        }
        .arsenal-card[data-featured="true"] {
          border-color: rgba(249,115,22,0.3);
          background: rgba(249,115,22,0.04);
        }

        .arsenal-card-top-line {
          position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.6), transparent);
        }
        .arsenal-hover-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(var(--accent-rgb),0.09), transparent 70%);
          pointer-events: none; transition: opacity 0.4s;
        }

        .arsenal-num {
          position: absolute; top: 16px; left: 16px;
          font-size: 11px; font-weight: 700;
          color: rgba(var(--accent-rgb),0.3); letter-spacing: 0.06em;
        }

        .arsenal-icon-wrap {
          margin-bottom: 14px; margin-top: 8px;
        }
        .arsenal-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(var(--accent-rgb),0.1);
          border: 1px solid rgba(var(--accent-rgb),0.2);
          font-size: 26px;
          transition: background 0.3s, transform 0.3s;
        }
        .arsenal-card:hover .arsenal-icon {
          background: rgba(var(--accent-rgb),0.18);
          transform: scale(1.05) rotate(-3deg);
        }

        .arsenal-tag {
          display: inline-block;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(var(--accent-rgb),0.8);
          background: rgba(var(--accent-rgb),0.08);
          border: 1px solid rgba(var(--accent-rgb),0.2);
          border-radius: 6px; padding: 3px 10px;
          margin-bottom: 10px;
        }

        .arsenal-title {
          font-size: clamp(14px,1.5vw,17px); font-weight: 800;
          color: #fff; line-height: 1.3; margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .arsenal-desc {
          font-size: clamp(12px,1.2vw,13px); color: rgba(210,185,150,0.45);
          line-height: 1.8; margin-bottom: 14px;
        }

        .arsenal-arrow {
          font-size: 16px; color: rgba(var(--accent-rgb),0.8);
          transition: opacity 0.3s, transform 0.3s;
          line-height: 1;
        }

        .arsenal-bottom-line {
          position: absolute; bottom: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.25), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .arsenal-card:hover .arsenal-bottom-line { opacity: 1; }
      `}</style>

      <section className="arsenal-section">
        <div ref={hdrRef} className="arsenal-header">
          <div className={`arsenal-eyebrow ${hdrIn ? "in" : ""}`}>
            <div className="arsenal-eyebrow-line rev" />
            الترسانة الميدانية
            <div className="arsenal-eyebrow-line" />
          </div>
          <h2 className={`arsenal-h2 ${hdrIn ? "in" : ""}`}>
            نحن معك <em>في الشارع</em>
          </h2>
          <p className={`arsenal-sub ${hdrIn ? "in" : ""}`}>
            لسنا مجرد تطبيق على الشاشة.. نحن أمام مطعمك، في سيارات عملائك، وفي قلب حيّك
          </p>
        </div>

        <div ref={gridRef} className="arsenal-grid">
          {items.map((item, i) => (
            <ArsenalCard key={item.title} item={item} index={i} inView={gridIn} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Arsenal;