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

const faqs = [
  {
    q: "لماذا تتقاضى شلّة عمولة أقل من الجميع؟",
    a: "نؤمن بالنمو التشاركي. تقليل العمولات يعني زيادة مبيعاتك واستدامة مشروعك. نحن نربح عندما تربح أنت — هذا هو سر نجاحنا المشترك.",
    icon: "💡",
  },
  {
    q: "كيف أضمن استلام مستحقاتي خلال 48 ساعة؟",
    a: 'هذا "التزام الساعة 49" الموثق في ميثاقنا. نظامنا المالي مربوط آلياً بحسابك البنكي. تأخرنا عن الساعة 49؟ طلباتك القادمة بدون عمولة تماماً.',
    icon: "⚡",
  },
  {
    q: 'هل أنا مسؤول عن تحصيل مبالغ "قيدها"؟',
    a: "أبداً. مخاطرة الائتمان وملاحقة التحصيل هي مسؤوليتنا بنسبة 100%. أنت تستلم حقك كاشاً وفوراً بمجرد خروج الطلب، ونحن نتكفل بالباقي.",
    icon: "🛡️",
  },
  {
    q: "ماذا أحتاج للبدء فعلياً؟",
    a: "5 دقائق فقط! جهّز سجلك التجاري (أو وثيقة العمل الحر)، الهوية الوطنية، وصورة الآيبان. مدير حسابك سيتولى تفعيل كل شيء لك فوراً.",
    icon: "🚀",
  },
  {
    q: "هل يمكنني إيقاف الطلبات وقت الذروة؟",
    a: "نعم، بكل سهولة! من خلال جهاز الـ POS يمكنك إيقاف المتجر مؤقتاً أو تفعيل وضع 'مشغول' للحفاظ على جودة خدمتك وتقييمك.",
    icon: "⚙️",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
  inView,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  inView: boolean;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(isOpen ? answerRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className="faq-item"
      data-open={isOpen ? "true" : "false"}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ${index * 80}ms cubic-bezier(.16,1,.3,1),
                     transform 0.55s ${index * 80}ms cubic-bezier(.16,1,.3,1)`,
      }}
    >
      {/* Left accent bar */}
      <div className="faq-accent-bar" />

      {/* Question row */}
      <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <div className="faq-q-left">
          <span className="faq-icon">{faq.icon}</span>
          <span className="faq-q-text">{faq.q}</span>
        </div>
        <div className={`faq-chevron ${isOpen ? "open" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Answer — smooth height transition */}
      <div
        className="faq-answer-wrap"
        style={{ height: `${height}px`, transition: "height 0.38s cubic-bezier(.16,1,.3,1)" }}
      >
        <div ref={answerRef} className="faq-answer">
          {faq.a}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref: hdrRef, inView: hdrIn } = useInView(0.3);
  const { ref: listRef, inView: listIn } = useInView(0.08);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        .faq-section {
          position: relative;
          padding: clamp(64px,10vw,120px) clamp(16px,5vw,40px);
          background: #0D0A07;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          overflow: hidden;
        }
        /* subtle vertical lines bg */
        .faq-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(
              90deg,
              rgba(249,115,22,0.04) 0px,
              rgba(249,115,22,0.04) 1px,
              transparent 1px,
              transparent 80px
            );
          pointer-events: none;
        }

        /* ── Header ── */
        .faq-header {
          text-align: center;
          max-width: 560px; margin: 0 auto clamp(36px,5vw,64px);
          position: relative; z-index: 2;
        }
        .faq-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: clamp(10px,1vw,12px); font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #f97316; margin-bottom: 14px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .faq-eyebrow.in { opacity: 1; transform: none; }
        .faq-eyebrow-line {
          width: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, #f97316);
        }
        .faq-eyebrow-line.rev { background: linear-gradient(90deg, #f97316, transparent); }

        .faq-h2 {
          font-size: clamp(26px,4vw,48px); font-weight: 900;
          color: #fff; line-height: 1.18; letter-spacing: -0.02em;
          margin-bottom: 10px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .faq-h2.in { opacity: 1; transform: none; }
        .faq-h2 em {
          font-style: normal;
          background: linear-gradient(130deg,#F97316,#F0A429 50%,#FB923C);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: fpan 4s linear infinite;
        }
        @keyframes fpan { 0%{background-position:0% center}100%{background-position:200% center} }

        .faq-sub {
          font-size: clamp(13px,1.4vw,16px); color: rgba(210,185,150,0.45); line-height: 1.8;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.6s 0.2s, transform 0.6s 0.2s;
        }
        .faq-sub.in { opacity: 1; transform: none; }

        /* ── List ── */
        .faq-list {
          max-width: 680px; margin: 0 auto;
          position: relative; z-index: 2;
          display: flex; flex-direction: column; gap: clamp(10px,1.5vw,14px);
        }

        /* ── Item ── */
        .faq-item {
          position: relative;
          background: rgba(255,190,120,0.04);
          border: 1px solid rgba(255,200,140,0.08);
          border-radius: 18px;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
          padding-right: 0;
        }
        .faq-item[data-open="true"] {
          border-color: rgba(249,115,22,0.35);
          box-shadow: 0 0 24px rgba(249,115,22,0.08);
          background: rgba(249,115,22,0.04);
        }
        .faq-item:hover:not([data-open="true"]) {
          border-color: rgba(249,115,22,0.2);
        }

        /* Left accent bar */
        .faq-accent-bar {
          position: absolute; top: 0; right: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, transparent, rgba(249,115,22,0.5), transparent);
          opacity: 0; transition: opacity 0.3s;
          border-radius: 0 18px 18px 0;
        }
        .faq-item[data-open="true"] .faq-accent-bar { opacity: 1; }

        /* Question button */
        .faq-question {
          width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          padding: clamp(16px,2vw,20px) clamp(16px,2.5vw,24px);
          background: none; border: none; cursor: pointer;
          text-align: right; font-family: 'Tajawal', sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .faq-q-left {
          display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;
        }
        .faq-icon {
          font-size: 18px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(249,115,22,0.08);
          border: 1px solid rgba(249,115,22,0.15);
          transition: background 0.3s;
        }
        .faq-item[data-open="true"] .faq-icon {
          background: rgba(249,115,22,0.14);
        }
        .faq-q-text {
          font-size: clamp(13px,1.4vw,15px); font-weight: 700;
          color: #fff; line-height: 1.4; text-align: right;
        }

        /* Chevron */
        .faq-chevron {
          flex-shrink: 0;
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(249,115,22,0.6);
          background: rgba(249,115,22,0.06);
          border: 1px solid rgba(249,115,22,0.15);
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), color 0.2s, background 0.2s;
        }
        .faq-chevron.open {
          transform: rotate(180deg);
          color: #f97316;
          background: rgba(249,115,22,0.12);
        }

        /* Answer */
        .faq-answer-wrap { overflow: hidden; }
        .faq-answer {
          padding: 0 clamp(16px,2.5vw,24px) clamp(16px,2vw,20px);
          padding-right: clamp(16px,2.5vw,24px);
          /* Align with question text (icon 36px + gap 12px + padding) */
          padding-right: calc(clamp(16px,2.5vw,24px) + 36px + 12px);
          font-size: clamp(12px,1.3vw,14px);
          color: rgba(210,185,150,0.5);
          line-height: 1.85;
          border-top: 1px solid rgba(255,200,140,0.06);
          padding-top: 14px;
        }

        /* ── Bottom CTA ── */
        .faq-cta {
          max-width: 680px; margin: clamp(28px,4vw,44px) auto 0;
          padding: clamp(20px,2.5vw,28px) clamp(20px,3vw,36px);
          background: rgba(249,115,22,0.04);
          border: 1px solid rgba(249,115,22,0.18);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
          position: relative; z-index: 2;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s 0.5s, transform 0.6s 0.5s;
          backdrop-filter: blur(8px);
          overflow: hidden;
        }
        .faq-cta.in { opacity: 1; transform: none; }
        .faq-cta::before {
          content: '';
          position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent);
        }
        .faq-cta-text {
          font-size: clamp(13px,1.4vw,15px); font-weight: 700;
          color: rgba(255,255,255,0.8); line-height: 1.5;
        }
        .faq-cta-text span { color: #f97316; }
        .faq-cta-btn {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 8px;
          min-height: 44px; padding: 0 clamp(16px,2vw,24px);
          border-radius: 11px;
          background: linear-gradient(135deg,#EA6C0A,#F97316 40%,#F0A429);
          color: #fff; font-family: 'Tajawal',sans-serif;
          font-size: clamp(12px,1.2vw,14px); font-weight: 800;
          border: none; cursor: pointer;
          box-shadow: 0 3px 16px rgba(249,115,22,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .faq-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(249,115,22,0.55);
        }
      `}</style>

      <section className="faq-section">
        {/* Header */}
        <div ref={hdrRef} className="faq-header">
          <div className={`faq-eyebrow ${hdrIn ? "in" : ""}`}>
            <div className="faq-eyebrow-line rev" />
            الأسئلة الشائعة
            <div className="faq-eyebrow-line" />
          </div>
          <h2 className={`faq-h2 ${hdrIn ? "in" : ""}`}>
            شفافية <em>مطلقة</em>
          </h2>
          <p className={`faq-sub ${hdrIn ? "in" : ""}`}>
            لديك استفسارات؟ نحن هنا للإجابة بكل وضوح
          </p>
        </div>

        {/* FAQ list */}
        <div ref={listRef} className="faq-list">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              inView={listIn}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`faq-cta ${listIn ? "in" : ""}`}>
          <p className="faq-cta-text">
            لم تجد إجابتك؟ <span>تواصل مع مدير حسابك مباشرة</span>
          </p>
          <button className="faq-cta-btn">
            واتساب مباشر ←
          </button>
        </div>
      </section>
    </>
  );
}

export default FAQ;