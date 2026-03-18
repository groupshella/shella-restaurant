"use client";

import { motion } from "framer-motion";
import { Rocket, Flame, Gem, Crown, Check, ArrowLeft } from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    Icon: Rocket,
    label: "التأسيس",
    amount: "1,000",
    desc: "خطوتك الأولى نحو النجاح",
    features: ["جهاز POS ذكي", "تفعيل قيدها", "رصيد تشغيلي فوري"],
    step: "01",
    highlight: false,
    color: "text-orange-500",
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-200",
    amountColor: "text-orange-500",
    checkColor: "text-orange-500",
  },
  {
    Icon: Flame,
    label: "الانطلاق",
    amount: "2,500",
    desc: "توسّع وكسر حواجز السوق",
    features: ["أولوية الظهور", "حملة تسويقية", "زيادة الرصيد"],
    step: "02",
    highlight: false,
    color: "text-amber-500",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-200",
    amountColor: "text-amber-500",
    checkColor: "text-amber-500",
  },
  {
    Icon: Gem,
    label: "التمكين",
    amount: "5,000",
    desc: "شريك موثوق بمزايا استثنائية",
    features: ["سداد الموردين", "تصوير احترافي", "رصيد موسّع"],
    step: "03",
    highlight: true,
    color: "text-white",
    iconBg: "bg-white/20",
    iconBorder: "border-white/30",
    amountColor: "text-white",
    checkColor: "text-white",
  },
  {
    Icon: Crown,
    label: "النخبة",
    amount: "10,000",
    desc: "قمة الشراكة والهيمنة السوقية",
    features: ["أقل عمولة بالمملكة", "دعم إعلاني VIP", "شاشات LED متنقلة"],
    step: "04",
    highlight: false,
    color: "text-yellow-600",
    iconBg: "bg-yellow-50",
    iconBorder: "border-yellow-200",
    amountColor: "text-yellow-600",
    checkColor: "text-yellow-600",
  },
] as const;

// ─── Tier Card ────────────────────────────────────────────────────────────────
function TierCard({ t, index }: { t: (typeof TIERS)[number]; index: number }) {
  const { Icon } = t;

  if (t.highlight) {
    return (
      <motion.div
        variants={scaleIn}
        whileHover={{ y: -7, scale: 1.02, transition: { type: "spring", stiffness: 380, damping: 24 } }}
        className="relative rounded-2xl overflow-hidden cursor-default"
        style={{
          background: "linear-gradient(135deg, #C44A0A 0%, #EA580C 45%, #F0850A 100%)",
          boxShadow: "0 12px 40px rgba(234,88,12,0.35)",
        }}
      >
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        {/* Top glow line */}
        <div className="absolute top-0 left-[15%] right-[15%] h-px bg-white/40" />

        {/* Popular badge */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white/25 text-white px-2.5 py-1 rounded-full border border-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            الأكثر شيوعاً
          </span>
        </div>

        <div className="relative z-10 p-6 pt-10">
          <span className="text-[11px] font-bold text-white/50 tabular-nums">{t.step}</span>

          <div className={`w-12 h-12 rounded-xl ${t.iconBg} ${t.iconBorder} border flex items-center justify-center mt-2 mb-3`}>
            <Icon className={`w-5 h-5 ${t.color} stroke-[2.2]`} />
          </div>

          <p className="text-[11px] font-bold tracking-widest uppercase text-white/70 mb-1">{t.label}</p>
          <p className="text-sm text-white/60 mb-3">{t.desc}</p>

          <div className="flex items-baseline gap-1.5 mb-5">
            <span className="text-3xl font-black text-white tabular-nums">{t.amount}</span>
            <span className="text-sm text-white/60 font-semibold">ريال</span>
          </div>

          <div className="h-px bg-white/20 mb-4" />

          <ul className="space-y-2.5">
            {t.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13px] text-white/80">
                <Check className={`w-4 h-4 ${t.checkColor} flex-shrink-0 stroke-[2.5]`} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 380, damping: 24 } }}
      className="relative rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
    >
      <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <span className="text-[11px] font-bold text-stone-300 tabular-nums">{t.step}</span>

      <div className={`w-12 h-12 rounded-xl ${t.iconBg} ${t.iconBorder} border flex items-center justify-center mt-2 mb-3`}>
        <Icon className={`w-5 h-5 ${t.color} stroke-[2.2]`} />
      </div>

      <p className={`text-[11px] font-bold tracking-widest uppercase mb-1 ${t.color}`}>{t.label}</p>
      <p className="text-sm text-stone-400 mb-3">{t.desc}</p>

      <div className="flex items-baseline gap-1.5 mb-5">
        <span className={`text-3xl font-black tabular-nums ${t.amountColor}`}>{t.amount}</span>
        <span className="text-sm text-stone-400 font-semibold">ريال</span>
      </div>

      <div className="h-px bg-stone-100 mb-4" />

      <ul className="space-y-2.5">
        {t.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[13px] text-stone-500">
            <Check className={`w-4 h-4 ${t.checkColor} flex-shrink-0 stroke-[2.5]`} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Tiers() {
  return (
    <section dir="rtl" className="relative bg-stone-50 py-24 px-5 overflow-hidden">
      {/* Diagonal lines bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(234,88,12,0.04) 60px, rgba(234,88,12,0.04) 61px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-3">
            <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">مدرج السيولة</span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            رحلتك من التأسيس{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              إلى النخبة
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-500 text-base">
            طموحك لا سقف له.. ونحن ندفعه بالكاش والتمويل
          </motion.p>
        </motion.div>

        {/* Progress track */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <div className="relative h-0.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-orange-400 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <div className="flex justify-between mt-2 px-0.5">
            {TIERS.map((t) => (
              <span key={t.label} className="text-[10px] text-stone-400 font-semibold">{t.label}</span>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {TIERS.map((t, i) => (
            <TierCard key={t.label} t={t} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}