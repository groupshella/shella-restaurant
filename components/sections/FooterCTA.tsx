"use client";

import { useEffect, useRef, useState } from "react";

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

// Animated particle ring around the CTA button
function ButtonRing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width = 500;
    const H = canvas.height = 120;
    const cx = W / 2, cy = H / 2;

    const dots = Array.from({ length: 28 }, (_, i) => ({
      angle: (i / 28) * Math.PI * 2,
      r: Math.random() * 1.2 + 0.4,
      speed: (Math.random() - 0.5) * 0.004,
      alpha: Math.random() * 0.6 + 0.2,
      orbitR: 200 + Math.random() * 12,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.angle += d.speed;
        const x = cx + Math.cos(d.angle) * d.orbitR;
        const y = cy + Math.sin(d.angle) * (d.orbitR * 0.22);
        if (x < 0 || x > W || y < 4 || y > H - 4) return;
        const dist = Math.abs(d.angle % (Math.PI * 2));
        const fade = Math.sin(dist) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${d.alpha * fade * 0.7})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
        width: "500px",
        height: "120px",
        opacity: 0.8,
      }}
    />
  );
}

const LINKS = [
  { label: "واتساب مباشر", icon: "💬" },
  { label: "تحميل التطبيق", icon: "📲" },
  { label: "سياسة الخصوصية", icon: "🔒" },
  { label: "شروط الاستخدام", icon: "📄" },
];

const SOCIAL = [
  { label: "X", glyph: "𝕏" },
  { label: "Instagram", glyph: "◉" },
  { label: "WhatsApp", glyph: "✆" },
  { label: "TikTok", glyph: "♪" },
];

export function FooterCTA() {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        /* ── Section ── */
        .fcta-section {
          position: relative;
          padding: clamp(80px,12vw,140px) clamp(16px,5vw,40px) 0;
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          overflow: hidden;
          text-align: center;
        }

        /* Large radial glow */
        .fcta-glow-top {
          position: absolute;
          top: -60px; left: 50%; transform: translateX(-50%);
          width: clamp(400px,80vw,900px);
          height: clamp(300px,50vw,600px);
          background: radial-gradient(ellipse at center,
            rgba(212,145,10,0.10) 0%,
            rgba(212,145,10,0.04) 40%,
            transparent 70%
          );
          pointer-events: none; z-index: 0;
        }
        /* Second smaller, sharper glow */
        .fcta-glow-center {
          position: absolute;
          top: 30%; left: 50%; transform: translate(-50%,-50%);
          width: 400px; height: 300px;
          background: radial-gradient(ellipse at center,
            rgba(212,145,10,0.07) 0%, transparent 65%
          );
          pointer-events: none; z-index: 0;
        }
        /* Noise grain */
        .fcta-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.25; pointer-events: none; z-index: 1;
        }

        /* ── Content ── */
        .fcta-content {
          position: relative; z-index: 2;
          max-width: 720px; margin: 0 auto;
        }

        /* ── Eyebrow ── */
        .fcta-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: clamp(10px,1vw,12px); font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #f97316; margin-bottom: clamp(14px,2vw,20px);
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .fcta-eyebrow.in { opacity: 1; transform: none; }
        .fcta-eyebrow-line {
          width: 32px; height: 1px;
          background: linear-gradient(90deg, transparent, #f97316);
        }
        .fcta-eyebrow-line.rev { background: linear-gradient(90deg, #f97316, transparent); }

        /* ── Headline ── */
        .fcta-h2 {
          font-size: clamp(28px,5vw,58px);
          font-weight: 900; line-height: 1.14;
          letter-spacing: -0.025em; color: #fff;
          margin-bottom: clamp(14px,2vw,22px);
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.65s 0.1s, transform 0.65s 0.1s;
        }
        .fcta-h2.in { opacity: 1; transform: none; }
        .fcta-h2 em {
          font-style: normal; display: block;
          background: linear-gradient(130deg, #F97316 0%, #F0A429 40%, #FB923C 75%, #F97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fcta-pan 4s linear infinite;
          filter: drop-shadow(0 0 24px rgba(249,115,22,0.45));
        }
        @keyframes fcta-pan {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* ── Sub ── */
        .fcta-sub {
          font-size: clamp(13px,1.5vw,17px);
          color: rgba(210,185,150,0.45); line-height: 1.85;
          max-width: 480px; margin: 0 auto clamp(28px,4vw,44px);
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.6s 0.2s, transform 0.6s 0.2s;
        }
        .fcta-sub.in { opacity: 1; transform: none; }

        /* ── CTA Button wrap ── */
        .fcta-btn-wrap {
          position: relative;
          display: inline-block;
          margin-bottom: clamp(36px,5vw,56px);
          opacity: 0; transform: translateY(16px) scale(0.97);
          transition: opacity 0.65s 0.3s, transform 0.65s 0.3s cubic-bezier(.16,1,.3,1);
        }
        .fcta-btn-wrap.in { opacity: 1; transform: none; }

        .fcta-btn {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center;
          justify-content: center; gap: 10px;
          min-height: 58px;
          padding: 0 clamp(28px,4vw,52px);
          border-radius: 16px;
          background: linear-gradient(135deg, #c2460a 0%, #F97316 35%, #F0A429 65%, #FB923C 100%);
          background-size: 200% auto;
          color: #fff;
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(14px,1.5vw,17px); font-weight: 900;
          border: none; cursor: pointer;
          letter-spacing: 0.01em;
          box-shadow:
            0 4px 32px rgba(249,115,22,0.5),
            0 0 0 1px rgba(249,115,22,0.4),
            inset 0 1px 0 rgba(255,255,255,0.2);
          transition: transform 0.25s cubic-bezier(.16,1,.3,1),
                      box-shadow 0.25s,
                      background-position 0.4s;
          animation: fcta-btn-shift 4s linear infinite;
        }
        @keyframes fcta-btn-shift {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        /* Glass sheen */
        .fcta-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%);
          border-radius: inherit; pointer-events: none;
        }
        /* Shimmer sweep */
        .fcta-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%; bottom: 0;
          width: 60%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: fcta-shimmer 3.5s ease-in-out infinite 1s;
        }
        @keyframes fcta-shimmer {
          0%   { left: -60%; }
          100% { left: 140%; }
        }
        .fcta-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow:
            0 10px 44px rgba(249,115,22,0.65),
            0 0 0 1px rgba(249,115,22,0.55),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .fcta-btn:active { transform: scale(0.98); }

        .fcta-btn-icon {
          font-size: 20px; transition: transform 0.25s;
        }
        .fcta-btn:hover .fcta-btn-icon { transform: translateX(-4px); }

        /* ── Trust row ── */
        .fcta-trust {
          display: flex; align-items: center; justify-content: center;
          gap: clamp(16px,3vw,32px); flex-wrap: wrap;
          margin-bottom: clamp(32px,4vw,52px);
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.5s 0.45s, transform 0.5s 0.45s;
        }
        .fcta-trust.in { opacity: 1; transform: none; }
        .fcta-trust-item {
          display: flex; align-items: center; gap: 7px;
          font-size: clamp(11px,1.1vw,13px); color: rgba(210,185,150,0.45);
          white-space: nowrap;
        }
        .fcta-trust-item span:first-child { font-size: 14px; }
        .fcta-trust-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(249,115,22,0.35);
        }

        /* ── Divider ── */
        .fcta-divider {
          max-width: 640px; margin: 0 auto clamp(24px,3.5vw,40px);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,200,140,0.08), transparent);
          opacity: 0; transition: opacity 0.5s 0.5s;
        }
        .fcta-divider.in { opacity: 1; }

        /* ── Links row ── */
        .fcta-links {
          display: flex; align-items: center; justify-content: center;
          gap: clamp(16px,3vw,32px); flex-wrap: wrap;
          margin-bottom: clamp(24px,3vw,36px);
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.5s 0.55s, transform 0.5s 0.55s;
        }
        .fcta-links.in { opacity: 1; transform: none; }
        .fcta-link {
          display: flex; align-items: center; gap: 6px;
          font-size: clamp(11px,1.2vw,13px); font-weight: 500;
          color: rgba(190,165,130,0.35);
          cursor: pointer; transition: color 0.2s;
          text-decoration: none; background: none; border: none;
          font-family: 'Tajawal', sans-serif;
          padding: 6px 0;
        }
        .fcta-link:hover { color: #f97316; }
        .fcta-link span:first-child { font-size: 13px; }

        /* ── Social row ── */
        .fcta-socials {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 0;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.5s 0.65s, transform 0.5s 0.65s;
        }
        .fcta-socials.in { opacity: 1; transform: none; }
        .fcta-social-btn {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
          color: rgba(210,185,150,0.5);
          font-size: 14px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
          font-family: 'Tajawal', sans-serif;
        }
        .fcta-social-btn:hover {
          background: rgba(249,115,22,0.1);
          border-color: rgba(249,115,22,0.3);
          color: #f97316;
          transform: translateY(-2px);
        }

        /* ── Footer bar ── */
        .fcta-bar {
          margin-top: clamp(32px,4vw,52px);
          border-top: 1px solid rgba(255,200,140,0.06);
          padding: clamp(16px,2vw,24px) clamp(16px,5vw,40px);
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          opacity: 0; transition: opacity 0.5s 0.7s;
        }
        .fcta-bar.in { opacity: 1; }
        .fcta-bar-brand {
          font-size: clamp(14px,1.5vw,16px); font-weight: 900;
          background: linear-gradient(130deg,#F97316,#F0A429);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fcta-bar-copy {
          font-size: clamp(10px,1vw,12px); color: rgba(190,165,130,0.30);
        }
        .fcta-bar-region {
          font-size: clamp(10px,1vw,12px); color: rgba(190,165,130,0.30);
          display: flex; align-items: center; gap: 6px;
        }
      `}</style>

      <section className="fcta-section">
        <div className="fcta-glow-top" />
        <div className="fcta-glow-center" />

        <div ref={ref} className="fcta-content">
          {/* Eyebrow */}
          <div className={`fcta-eyebrow ${inView ? "in" : ""}`}>
            <div className="fcta-eyebrow-line rev" />
            ابدأ الآن
            <div className="fcta-eyebrow-line" />
          </div>

          {/* Headline */}
          <h2 className={`fcta-h2 ${inView ? "in" : ""}`}>
            هل أنت مستعد لتكون
            <em>وجهة الحي القادمة؟</em>
          </h2>

          {/* Sub */}
          <p className={`fcta-sub ${inView ? "in" : ""}`}>
            الوقت لا ينتظر، والمنافسة في حي طويق ونمار في أوجّها.
            لا تدع السيولة المحتجزة أو العمولات المرتفعة تقف في طريق طموحك.
          </p>

          {/* CTA Button */}
          <div
            className={`fcta-btn-wrap ${inView ? "in" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered && <ButtonRing />}
            <button className="fcta-btn">
              <span>سجّل الآن واستلم الـ 1,000 ريال التأسيسية</span>
              <span className="fcta-btn-icon">←</span>
            </button>
          </div>

          {/* Trust row */}
          <div className={`fcta-trust ${inView ? "in" : ""}`}>
            {[
              { icon: "⚡", text: "تفعيل خلال 24 ساعة" },
              { icon: "🛡️", text: "مخاطرة صفر" },
              { icon: "💰", text: "1,000 ريال فوري" },
              { icon: "📞", text: "دعم مخصص" },
            ].map((t, i, arr) => (
              <div key={t.text} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className="fcta-trust-item">
                  <span>{t.icon}</span>
                  <span>{t.text}</span>
                </div>
                {i < arr.length - 1 && <div className="fcta-trust-dot" />}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className={`fcta-divider ${inView ? "in" : ""}`} />

          {/* Links */}
          <div className={`fcta-links ${inView ? "in" : ""}`}>
            {LINKS.map((l) => (
              <button key={l.label} className="fcta-link">
                <span>{l.icon}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          {/* Social */}
          <div className={`fcta-socials ${inView ? "in" : ""}`}>
            {SOCIAL.map((s) => (
              <button key={s.label} className="fcta-social-btn" title={s.label}>
                {s.glyph}
              </button>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className={`fcta-bar ${inView ? "in" : ""}`}>
          <span className="fcta-bar-brand">شلّة للمطاعم</span>
          <span className="fcta-bar-copy">© 2025 جميع الحقوق محفوظة</span>
          <span className="fcta-bar-region">
            <span>🇸🇦</span>
            المملكة العربية السعودية
          </span>
        </div>
      </section>
    </>
  );
}

export default FooterCTA;