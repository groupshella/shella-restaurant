"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Store, Smartphone, ShieldCheck, ArrowLeft } from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const FLOW = [
  { Icon: Smartphone, label: "العميل يطلب", sub: "بنظام الآجل", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200" },
  { Icon: ShieldCheck, label: "شلّة تضمن",  sub: "الدفع فوراً",   color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
  { Icon: Store,       label: "أنت تستلم", sub: "كاش في حسابك", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
] as const;

const ROLES = [
  {
    Icon: Store,
    role: "أنت (المطعم)",
    desc: "تبيع الوجبة وتستلم قيمتها كاملة فور خروج الطلب. لا ديون، لا انتظار.",
    step: "01",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    ringColor: "ring-orange-200",
    highlight: true,
  },
  {
    Icon: Smartphone,
    role: "الزبون",
    desc: "يطلب الآن ويسدد مع الراتب. يحصل على وجبته بكل راحة وبسعر منافس.",
    step: "02",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    ringColor: "ring-sky-200",
    highlight: false,
  },
  {
    Icon: ShieldCheck,
    role: "شلّة",
    desc: "نتحمل 100% من المسؤولية القانونية والمالية وعمليات التحصيل.",
    step: "03",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    ringColor: "ring-teal-200",
    highlight: false,
  },
] as const;

// ─── Flow diagram ─────────────────────────────────────────────────────────────
function FlowDiagram() {
  return (
    <div className="overflow-x-auto pb-2">
      <motion.div
        className="flex items-center justify-center gap-0 mb-14 min-w-max mx-auto"
        variants={stagger(0.15, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {FLOW.map((step, i) => {
          const { Icon } = step;
          return (
            <div key={step.label} className="flex items-center">
              <motion.div
                variants={scaleIn}
                className={`
                  relative text-center px-4 py-4 rounded-2xl border bg-white shadow-sm
                  flex-1 min-w-0
                  ${step.border}
                `}
              >
              {/* Top accent */}
              <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-40" />

              <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${step.color} stroke-[2.2]`} />
              </div>
              <p className="text-[13px] font-bold text-stone-800">{step.label}</p>
              <p className="text-[11px] text-orange-500 font-semibold mt-0.5">{step.sub}</p>
            </motion.div>

            {/* Arrow connector */}
            {i < FLOW.length - 1 && (
              <motion.div
                variants={fadeUp}
                className="flex items-center px-1.5 sm:px-3"
              >
                <div className="relative flex items-center">
                  <div className="w-6 sm:w-10 h-px bg-gradient-to-l from-orange-300 to-orange-100" />
                  {/* Animated dot */}
                  <div
                    className="absolute w-1.5 h-1.5 rounded-full bg-orange-400"
                    style={{ animation: "flow-dot 2s ease-in-out infinite", right: 0 }}
                  />
                  <ArrowLeft className="w-3 h-3 text-orange-400 flex-shrink-0" strokeWidth={2.5} />
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
        <style>{`@keyframes flow-dot{0%{right:100%;opacity:1}100%{right:0%;opacity:0}}`}</style>
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Qaidha() {
  return (
    <section dir="rtl" className="relative bg-white py-24 px-5 overflow-hidden">
      {/* Bg glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-400/[0.06] blur-[80px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-xs font-bold tracking-wide mb-5">
              <CreditCardIcon />
              ميزة حصرية — قيدها
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            بع بالآجل..{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              واستلم كاشك فوراً
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-500 text-base max-w-lg mx-auto leading-relaxed">
            البيع والربح عندك.. والمخاطرة والتحصيل علينا
          </motion.p>
        </motion.div>

        {/* Flow */}
        <FlowDiagram />

        {/* Role Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {ROLES.map((r) => {
            const { Icon } = r;
            return (
              <motion.div
                key={r.role}
                variants={scaleIn}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 380, damping: 24 } }}
                className={`
                  relative rounded-2xl border bg-white p-5 text-center shadow-sm
                  ${r.border}
                  ${r.highlight ? "ring-2 " + r.ringColor : ""}
                `}
              >
                {/* Top bar */}
                {r.highlight && (
                  <div className="absolute top-0 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
                )}

                <span className="absolute top-3 left-3 text-[10px] font-bold text-stone-300 tabular-nums">
                  {r.step}
                </span>

                <div className={`w-14 h-14 rounded-2xl ${r.bg} border ${r.border} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${r.color} stroke-[2]`} />
                </div>

                <p className={`text-[11px] font-bold tracking-widest uppercase mb-2 ${r.color}`}>
                  {r.role}
                </p>
                <p className="text-[13px] text-stone-500 leading-relaxed">{r.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative rounded-2xl border border-orange-200 bg-orange-50/60 px-6 py-5 text-center mb-8 overflow-hidden"
        >
          <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          <p className="text-[15px] font-bold text-stone-700 leading-relaxed">
            أنت تركز على{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              جودة طبخك وإرضاء زبائنك
            </span>
            {" "}، ونحن نحوّل كل طلب{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              "آجل"
            </span>
            {" "}إلى{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              "كاش"
            </span>
            {" "}في حسابك.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 30px rgba(234,88,12,0.35)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-l from-orange-500 to-amber-500 text-white font-bold text-[15px] shadow-lg shadow-orange-200 cursor-pointer border-0"
          >
            <span>اعرف أكثر عن قيدها</span>
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// tiny inline icon
function CreditCardIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
}