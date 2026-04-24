"use client";

import { motion } from "framer-motion";
import { ClipboardList, FileText, Tablet, Rocket } from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    Icon: ClipboardList,
    num: "01",
    title: "سجّل بياناتك",
    desc: "املأ النموذج في دقيقتين فقط وانضم لشبكة شلّة.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    connector: true,
  },
  {
    Icon: FileText,
    num: "02",
    title: "جهّز وثائقك",
    desc: "سجل تجاري، هوية وطنية، آيبان، وقائمة الطعام.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    connector: true,
  },
  {
    Icon: Tablet,
    num: "03",
    title: "استلم جهازك",
    desc: "نزودك بجهاز POS مثبّت عليه نظام شلّة الكامل.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    connector: true,
  },
  {
    Icon: Rocket,
    num: "04",
    title: "انطلق!",
    desc: "استقبل أول طلب واستمتع برؤية مشروعك يزدهر.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    connector: false,
  },
] as const;

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Steps() {
  return (
    <section dir="rtl" className="relative bg-white py-24 px-5 overflow-hidden">
      {/* Warm dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(160,100,20,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-3">
            <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">كيف تصبح شريكاً</span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            4 خطوات{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              وتنطلق
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-500 text-base">
            بساطة الإجراءات.. وسرعة التفعيل
          </motion.p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {STEPS.map((step, i) => {
            const { Icon } = step;
            return (
              <motion.div
                key={step.num}
                variants={scaleIn}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connector line (hidden on last) */}
                {step.connector && (
                  <div className="hidden lg:block absolute top-[26px] left-[-50%] w-full h-px bg-gradient-to-l from-stone-200 via-orange-200 to-stone-200 z-0" />
                )}

                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`
                    relative z-10 w-14 h-14 rounded-2xl ${step.bg} border-2 ${step.border}
                    flex items-center justify-center mb-4 shadow-sm
                  `}
                >
                  <Icon className={`w-6 h-6 ${step.color} stroke-[2]`} />

                  {/* Number badge */}
                  <div className={`
                    absolute -top-2 -right-2 w-5 h-5 rounded-full
                    flex items-center justify-center text-[9px] font-black
                    bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-sm
                  `}>
                    {i + 1}
                  </div>
                </motion.div>

                <h3 className="text-[15px] font-bold text-stone-800 mb-1.5">{step.title}</h3>
                <p className="text-[13px] text-stone-500 leading-relaxed max-w-[160px]">{step.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            التفعيل خلال 24 ساعة من استلام الوثائق
          </div>
        </motion.div>
      </div>
    </section>
  );
}