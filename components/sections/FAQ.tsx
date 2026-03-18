"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Zap, ShieldCheck, Rocket, Settings, MessageCircle, ArrowLeft } from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    Icon: Lightbulb,
    q: "لماذا تتقاضى شلّة عمولة أقل من الجميع؟",
    a: "نؤمن بالنمو التشاركي. تقليل العمولات يعني زيادة مبيعاتك واستدامة مشروعك. نحن نربح عندما تربح أنت — هذا هو سر نجاحنا المشترك.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    Icon: Zap,
    q: "كيف أضمن استلام مستحقاتي خلال 48 ساعة؟",
    a: 'هذا "التزام الساعة 49" الموثق في ميثاقنا. نظامنا المالي مربوط آلياً بحسابك البنكي. تأخرنا عن الساعة 49؟ طلباتك القادمة بدون عمولة تماماً.',
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    Icon: ShieldCheck,
    q: 'هل أنا مسؤول عن تحصيل مبالغ "قيدها"؟',
    a: "أبداً. مخاطرة الائتمان وملاحقة التحصيل هي مسؤوليتنا بنسبة 100%. أنت تستلم حقك كاشاً وفوراً بمجرد خروج الطلب، ونحن نتكفل بالباقي.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    Icon: Rocket,
    q: "ماذا أحتاج للبدء فعلياً؟",
    a: "5 دقائق فقط! جهّز سجلك التجاري (أو وثيقة العمل الحر)، الهوية الوطنية، وصورة الآيبان. مدير حسابك سيتولى تفعيل كل شيء لك فوراً.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    Icon: Settings,
    q: "هل يمكنني إيقاف الطلبات وقت الذروة؟",
    a: "نعم، بكل سهولة! من خلال جهاز الـ POS يمكنك إيقاف المتجر مؤقتاً أو تفعيل وضع 'مشغول' للحفاظ على جودة خدمتك وتقييمك.",
    color: "text-stone-600",
    bg: "bg-stone-50",
    border: "border-stone-200",
  },
] as const;

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { Icon } = faq;
  return (
    <motion.div
      variants={fadeUp}
      className={`
        relative rounded-2xl border bg-white overflow-hidden shadow-sm
        transition-all duration-300
        ${isOpen ? "border-orange-300 shadow-orange-100" : "border-stone-200 hover:border-stone-300"}
      `}
    >
      {/* Right accent bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 right-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Question */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 p-5 text-right cursor-pointer"
      >
        <motion.div
          className={`w-9 h-9 rounded-xl ${faq.bg} border ${faq.border} flex items-center justify-center flex-shrink-0 transition-colors duration-200`}
          animate={{ background: isOpen ? undefined : undefined }}
        >
          <Icon className={`w-4 h-4 ${faq.color} stroke-[2.2]`} />
        </motion.div>

        <span className={`flex-1 text-[14px] font-bold leading-snug ${isOpen ? "text-orange-700" : "text-stone-800"} transition-colors`}>
          {faq.q}
        </span>

        <motion.div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            isOpen ? "bg-orange-50 border-orange-200 text-orange-500" : "bg-stone-50 border-stone-200 text-stone-400"
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pr-[calc(20px+36px+12px)]">
              <div className="h-px bg-stone-100 mb-4" />
              <p className="text-[13px] text-stone-500 leading-[1.85]">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section dir="rtl" className="relative bg-stone-50 py-24 px-5 overflow-hidden">
      {/* Vertical lines bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(234,88,12,0.04) 0px, rgba(234,88,12,0.04) 1px, transparent 1px, transparent 80px)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-3">
            <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">الأسئلة الشائعة</span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            شفافية{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              مطلقة
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-500 text-base">
            لديك استفسارات؟ نحن هنا للإجابة بكل وضوح
          </motion.p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="flex flex-col gap-3"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-8 relative rounded-2xl border border-orange-200 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm overflow-hidden"
        >
          <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          <p className="text-[14px] font-bold text-stone-700 leading-relaxed">
            لم تجد إجابتك؟{" "}
            <span className="text-orange-500">تواصل مع مدير حسابك مباشرة</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-orange-500 to-amber-500 text-white font-bold text-[13px] shadow-md shadow-orange-200 border-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 stroke-[2.2]" />
            واتساب مباشر
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}