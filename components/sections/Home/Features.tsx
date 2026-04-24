"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Banknote,
  CreditCard,
  Handshake,
  TrendingUp,
  Bot,
} from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: Zap,
    title: "بروتوكول الساعة 49",
    desc: "نلتزم بتحويل مبيعاتك خلال 48 ساعة. تأخرنا؟ طلباتك القادمة بدون عمولة تماماً!",
    tag: "السيولة الفورية",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200/60",
    tagColor: "bg-orange-50 text-orange-700 border-orange-200",
    topBar: "from-orange-400/0 via-orange-400/60 to-orange-400/0",
  },
  {
    Icon: Banknote,
    title: "رصيد التأسيس الفوري",
    desc: "نودع 1,000 ريال كاش تشغيلي في محفظتك بمجرد انضمامك. نستثمر في نجاحك قبل أن تبدأ.",
    tag: "تمويل مجاني",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    topBar: "from-amber-400/0 via-amber-400/60 to-amber-400/0",
  },
  {
    Icon: CreditCard,
    title: 'ثورة "قيدها"',
    desc: "العميل يطلب آجل وأنت تستلم كاشاً فوراً. نتحمل مخاطر التحصيل بالكامل عنك.",
    tag: "مخاطرة صفر",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200/60",
    tagColor: "bg-red-50 text-red-700 border-red-200",
    topBar: "from-red-400/0 via-red-400/60 to-red-400/0",
  },
  {
    Icon: Handshake,
    title: "شراكة حقيقية",
    desc: "أجهزة POS ذكية، مدير حساب مخصص، وتخطيط ميداني يستهدف العملاء في قلب حيّك.",
    tag: "دعم ميداني",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200/60",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    topBar: "from-teal-400/0 via-teal-400/60 to-teal-400/0",
  },
  {
    Icon: TrendingUp,
    title: "عمولة تحفز النجاح",
    desc: "عمولات تتقلص كلما ارتقيت في مدرج السيولة لضمان أعلى هوامش ربح في السوق.",
    tag: "نمو مستدام",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200/60",
    tagColor: "bg-orange-50 text-orange-700 border-orange-200",
    topBar: "from-orange-400/0 via-orange-400/60 to-orange-400/0",
  },
  {
    Icon: Bot,
    title: "ذكاء اصطناعي متكامل",
    desc: "الطلب يطير من العميل للكاشير للمطبخ مباشرة، مع خط سير لحظي للسائق والعميل.",
    tag: "تقنية متقدمة",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    topBar: "from-emerald-400/0 via-emerald-400/60 to-emerald-400/0",
  },
] as const;

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  f,
  index,
}: {
  f: (typeof FEATURES)[number];
  index: number;
}) {
  const { Icon } = f;

  return (
    <motion.div
      variants={scaleIn}
      whileHover={
        typeof window !== "undefined" && window.innerWidth > 768
          ? { y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }
          : {}
      }
      className={`
        relative rounded-2xl border bg-white
        p-4 sm:p-5 lg:p-6
        overflow-hidden cursor-default
        shadow-sm hover:shadow-md
        transition-shadow duration-300
        flex flex-col gap-0
        min-h-[180px] sm:min-h-[200px]
        ${f.border}
      `}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r ${f.topBar}`}
      />

      {/* Index — top-left in RTL layout means visually top-right */}
      <span className="absolute top-3 left-3 text-[10px] font-bold text-stone-300 tabular-nums select-none">
        0{index + 1}
      </span>

      {/* Icon + pulse ring */}
      <div className="relative mb-3 mt-1 self-start">
        <div
          className={`
            w-10 h-10 sm:w-11 sm:h-11
            rounded-xl ${f.bg} border ${f.border}
            flex items-center justify-center
            shrink-0
          `}
        >
          <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${f.color} stroke-[2.2]`} />
        </div>
        <div
          className={`absolute inset-[-4px] rounded-[18px] border ${f.border} opacity-40`}
          style={{ animation: "ring-pulse 3s ease-in-out infinite" }}
        />
      </div>

      {/* Tag */}
      <span
        className={`
          inline-block self-start
          text-[9px] sm:text-[10px] font-bold tracking-widest uppercase
          px-2 py-[3px] rounded-md border mb-2
          ${f.tagColor}
        `}
      >
        {f.tag}
      </span>

      {/* Title */}
      <h3 className="text-sm sm:text-[15px] font-bold text-stone-800 leading-snug mb-1.5">
        {f.title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed">
        {f.desc}
      </p>

      <style>{`
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: .4 }
          50%       { transform: scale(1.07); opacity: 0 }
        }
      `}</style>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Features() {
  return (
    <section
      dir="rtl"
      className="relative bg-stone-50 py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(160,100,20,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-6xl xl:max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          variants={stagger(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <div className="w-6 sm:w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">
              لماذا شلّة
            </span>
            <div className="w-6 sm:w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-black text-stone-900 leading-tight mb-3"
            style={{
              fontFamily: "'Amiri', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
            }}
          >
            حلول جذرية{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              لكل عقبة
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-stone-500 text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed px-2"
          >
            وداعاً للآلام التي تعيق نمو مطعمك وتستنزف سيولتك
          </motion.p>
        </motion.div>

        {/* ── Grid ──
            Mobile  (<640px):  1 column
            sm–md  (640–1023): 2 columns
            lg+    (1024px+):  3 columns
        */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}