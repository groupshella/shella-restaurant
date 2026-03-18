"use client";

import { motion } from "framer-motion";
import { MonitorSmartphone, Star, Tv2, Target, Car, ArrowLeft } from "lucide-react";
import { fadeUp, scaleIn, stagger, VIEWPORT } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ITEMS = [
  {
    Icon: MonitorSmartphone,
    title: "أجهزة POS الذكية",
    desc: "جهاز متطور يُنظّم مبيعاتك، يراقب مخزونك، ويُظهر عداد الكاش لحظة بلحظة.",
    tag: "مركز القيادة",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    tagStyle: "bg-orange-50 text-orange-700 border-orange-200",
    featured: true,
  },
  {
    Icon: Star,
    title: "الستاندات الذهبية العملاقة",
    desc: "ستاند 180 سم بتصميم فاخر يُخبر كل من يدخل أنك شريك معتمد في شلّة.",
    tag: "هوية الفخامة",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
    featured: false,
  },
  {
    Icon: Tv2,
    title: "شاشات LED المتنقلة",
    desc: "فريقنا يجوب الشوارع بشاشات تبرز عروض مطعمك ويجلب العملاء لبابك.",
    tag: "قوات الاكتساح",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    tagStyle: "bg-red-50 text-red-700 border-red-200",
    featured: false,
  },
  {
    Icon: Target,
    title: "استراتيجية البطاقات الذهبية",
    desc: "بطاقات VIP مخملية داخل أكياس الطلبات لاستقطاب عملاء المنافسين.",
    tag: "حصان طروادة",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    tagStyle: "bg-teal-50 text-teal-700 border-teal-200",
    featured: false,
  },
  {
    Icon: Car,
    title: 'فواحات "رائحة شلّة"',
    desc: "هدايا عطرية للسيارات تحمل شعارك لتبقى في ذاكرة العميل طوال اليوم.",
    tag: "التواجد الذهني",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    tagStyle: "bg-orange-50 text-orange-700 border-orange-200",
    featured: false,
  },
] as const;

// ─── Arsenal Card ─────────────────────────────────────────────────────────────
function ArsenalCard({
  item,
  index,
}: {
  item: (typeof ITEMS)[number];
  index: number;
}) {
  const { Icon } = item;
  return (
    <motion.div
      variants={index % 2 === 0
        ? { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
        : { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
      }
      whileHover={{
        y: -5,
        borderColor: "rgba(234,88,12,0.35)",
        transition: { type: "spring", stiffness: 380, damping: 24 },
      }}
      className={`
        relative rounded-2xl border bg-white p-6 shadow-sm cursor-default overflow-hidden
        ${item.featured ? "border-orange-300 ring-1 ring-orange-200" : "border-stone-200"}
      `}
    >
      {/* Top line */}
      <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />

      {/* Number */}
      <span className="absolute top-4 left-4 text-[11px] font-bold text-stone-200 tabular-nums">
        0{index + 1}
      </span>

      {/* Icon */}
      <motion.div
        className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mb-3 mt-1`}
        whileHover={{ scale: 1.08, rotate: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      >
        <Icon className={`w-5 h-5 ${item.color} stroke-[2.2]`} />
      </motion.div>

      {/* Tag */}
      <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border mb-2.5 ${item.tagStyle}`}>
        {item.tag}
      </span>

      {/* Content */}
      <h3 className="text-[15px] font-bold text-stone-800 leading-snug mb-2">{item.title}</h3>
      <p className="text-[13px] text-stone-500 leading-relaxed mb-4">{item.desc}</p>

      {/* Arrow (always visible, animates on hover) */}
      <motion.div
        className="text-orange-400 text-sm font-bold"
        initial={{ opacity: 0, x: 6 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        ←
      </motion.div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Arsenal() {
  return (
    <section dir="rtl" className="relative bg-white py-24 px-5 overflow-hidden">
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(234,88,12,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />
      {/* Top glow */}
      <div className="pointer-events-none absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-300/[0.06] blur-[80px]" />

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
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">الترسانة الميدانية</span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            نحن معك{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              في الشارع
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
            لسنا مجرد تطبيق على الشاشة.. نحن أمام مطعمك، في سيارات عملائك، وفي قلب حيّك
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={stagger(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {ITEMS.map((item, i) => (
            <ArsenalCard key={item.title} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}