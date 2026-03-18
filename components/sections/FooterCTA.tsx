"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Zap, ShieldCheck, Banknote, Headphones, MessageCircle, Download, Lock, FileText } from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRUST = [
  { Icon: Zap,         text: "تفعيل خلال 24 ساعة" },
  { Icon: ShieldCheck, text: "مخاطرة صفر" },
  { Icon: Banknote,    text: "1,000 ريال فوري" },
  { Icon: Headphones,  text: "دعم مخصص" },
] as const;

const LINKS = [
  { Icon: MessageCircle, label: "واتساب مباشر" },
  { Icon: Download,      label: "تحميل التطبيق" },
  { Icon: Lock,          label: "سياسة الخصوصية" },
  { Icon: FileText,      label: "شروط الاستخدام" },
] as const;

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FooterCTA() {
  return (
    <section dir="rtl" className="relative overflow-hidden">
      {/* Main CTA area - light warm */}
      <div className="relative bg-gradient-to-b from-orange-50 to-amber-50/50 py-24 px-5 text-center overflow-hidden">
        {/* Bg glow top */}
        <div className="pointer-events-none absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-orange-300/20 blur-[100px]" />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(234,88,12,0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 80%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
              <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">ابدأ الآن</span>
              <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-4"
              style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
            >
              هل أنت مستعد لتكون
              <br />
              <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
                وجهة الحي القادمة؟
              </span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-stone-500 text-base leading-relaxed mb-10 max-w-lg mx-auto">
              الوقت لا ينتظر، والمنافسة في حي طويق ونمار في أوجّها. لا تدع السيولة
              المحتجزة أو العمولات المرتفعة تقف في طريق طموحك.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeUp} className="mb-10">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: "0 16px 48px rgba(234,88,12,0.40)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-white font-black text-[14px] sm:text-[16px] text-center border-0 cursor-pointer relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #C44A0A 0%, #EA580C 45%, #F0850A 100%)",
                  boxShadow: "0 6px 30px rgba(234,88,12,0.38)",
                }}
              >
                {/* Shine */}
                <motion.span
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)" }}
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="text-balance">سجّل الآن واستلم الـ 1,000 ريال التأسيسية</span>
                <ArrowLeft className="w-5 h-5 stroke-[2.5] flex-shrink-0" />
              </motion.button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={stagger(0.07)}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10"
            >
              {TRUST.map(({ Icon, text }, i) => (
                <div key={text} className="flex items-center gap-2">
                  <motion.div
                    variants={scaleIn}
                    className="flex items-center gap-2 text-[13px] text-stone-500 font-medium"
                  >
                    <div className="w-6 h-6 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-orange-500 stroke-[2.2]" />
                    </div>
                    {text}
                  </motion.div>
                  {i < TRUST.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-orange-300 mx-1" />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-200/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-300" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-200/60" />
            </motion.div>

            {/* Links */}
            <motion.div
              variants={stagger(0.06)}
              className="flex flex-wrap items-center justify-center gap-6 mb-8"
            >
              {LINKS.map(({ Icon, label }) => (
                <motion.button
                  key={label}
                  variants={fadeUp}
                  whileHover={{ color: "#EA580C", y: -1 }}
                  className="flex items-center gap-1.5 text-[12px] text-stone-400 font-medium cursor-pointer border-0 bg-transparent transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  {label}
                </motion.button>
              ))}
            </motion.div>

            {/* Social */}
            <motion.div variants={stagger(0.07)} className="flex items-center justify-center gap-3">
              {["𝕏", "◉", "✆", "♪"].map((g, i) => (
                <motion.button
                  key={i}
                  variants={scaleIn}
                  whileHover={{ scale: 1.15, y: -2, borderColor: "rgba(234,88,12,0.4)", color: "#EA580C" }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-400 text-sm flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                >
                  {g}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="bg-white border-t border-stone-100 px-5 py-5"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <span
            className="text-[15px] font-black bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            شلّة للمطاعم
          </span>
          <span className="text-[11px] text-stone-400">© 2025 جميع الحقوق محفوظة</span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span>🇸🇦</span>
            المملكة العربية السعودية
          </span>
        </div>
      </motion.div>
    </section>
  );
}