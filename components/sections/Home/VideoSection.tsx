"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize2,
  RotateCcw, ChevronLeft, ChevronRight,
  Smartphone, Star, ArrowLeft,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring" as const, stiffness: 380, damping: 26 };
const VP = { once: true, margin: "-60px" } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = (s = 0.09, d = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: s, delayChildren: d } },
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA — video tabs
// ─────────────────────────────────────────────────────────────────────────────
interface VideoTab {
  id: string;
  label: string;
  caption: string;
  desc: string;
  /** Replace with your real video URLs */
  src: string;
  poster: string;
  badge: string;
  badgeColor: string;
}

const VIDEOS: VideoTab[] = [
  {
    id: "qaidha",
    label: "ميزة قيدها",
    caption: "بع الآن، استلم كاشك فوراً",
    desc: "شاهد كيف تتحوّل كل طلبية آجل إلى كاش فوري في حسابك — دون أي مخاطرة أو انتظار.",
    src: "/videos/video2.mp4",          // ← ضع رابط الفيديو هنا
    poster: "",       // ← ضع صورة الغلاف هنا
    badge: "حصري",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "pos",
    label: "جهاز POS",
    caption: "مركز قيادة مطعمك",
    desc: "عداد الكاش اللحظي، إدارة الطلبات، تتبع المخزون — كل شيء في شاشة واحدة.",
    src: "/videos/video1.mp4",
    poster: "",
    badge: "ذكي",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "dashboard",
    label: "لوحة التحكم",
    caption: "إحصائيات لحظية دقيقة",
    desc: "قرارات أذكى، أرباح أعلى — تقارير مبيعاتك الكاملة في لمحة واحدة.",
    src: "",
    poster: "",
    badge: "تحليلات",
    badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: video controls
// ─────────────────────────────────────────────────────────────────────────────
function useVideoControls(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset on source change
  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setBuffered(0);
  }, [src]);

  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 2800);
  }, [playing]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    startHideTimer();
  }, [startHideTimer]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else           { v.pause(); setPlaying(false); setShowControls(true); }
    startHideTimer();
  }, [startHideTimer]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const seek = useCallback((pct: number) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = pct * duration;
    setProgress(pct);
  }, [duration]);

  const restart = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
    setProgress(0);
    startHideTimer();
  }, [startHideTimer]);

  const fullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime   = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    const onMeta   = () => setDuration(v.duration);
    const onBuf    = () => {
      if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
    };
    const onEnd    = () => { setPlaying(false); setShowControls(true); };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("progress", onBuf);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("progress", onBuf);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => { return () => { if (hideTimer.current) clearTimeout(hideTimer.current); }; }, []);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return {
    videoRef, playing, muted, progress, duration, buffered,
    showControls, revealControls, togglePlay, toggleMute, seek, restart, fullscreen, fmt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PHONE FRAME + VIDEO PLAYER
// ─────────────────────────────────────────────────────────────────────────────
function PhonePlayer({ tab }: { tab: VideoTab }) {
  const {
    videoRef, playing, muted, progress, duration, buffered,
    showControls, revealControls, togglePlay, toggleMute, seek, restart, fullscreen, fmt,
  } = useVideoControls(tab.src);

  const hasSrc = !!tab.src;

  return (
    <div className="relative mx-auto select-none"
      style={{ width: "min(280px, 75vw)" }}>

      {/* ── Phone shell ── */}
      <div className="relative rounded-[44px] bg-stone-900 p-[10px] shadow-2xl shadow-black/40"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset" }}>

        {/* Side buttons */}
        <div className="absolute -right-[3px] top-[88px] w-[3px] h-8 rounded-l-sm bg-stone-700" />
        <div className="absolute -right-[3px] top-[132px] w-[3px] h-10 rounded-l-sm bg-stone-700" />
        <div className="absolute -left-[3px] top-[110px] w-[3px] h-14 rounded-r-sm bg-stone-700" />

        {/* Screen */}
        <div className="relative rounded-[36px] overflow-hidden bg-black aspect-[9/19.5]">

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-[90px] h-[28px] bg-stone-900 rounded-b-[18px] flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-stone-800 border border-stone-700" />
            <div className="w-8 h-1.5 rounded-full bg-stone-800" />
          </div>

          {/* Status bar */}
          <div className="absolute top-[32px] left-0 right-0 z-20 flex items-center justify-between px-5 text-[9px] font-semibold text-white/70">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="currentColor" className="opacity-80">
                <rect x="0" y="5" width="2" height="3" rx="0.5" />
                <rect x="3" y="3" width="2" height="5" rx="0.5" />
                <rect x="6" y="1" width="2" height="7" rx="0.5" />
                <rect x="9" y="0" width="2" height="8" rx="0.5" />
              </svg>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor" className="opacity-80">
                <path d="M5 1.5a4.5 4.5 0 014.5 4.5H.5A4.5 4.5 0 015 1.5z" />
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="w-4 h-2 rounded-[2px] border border-white/50 p-[1px]">
                  <div className="h-full w-[70%] bg-white/80 rounded-[1px]" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Video / Placeholder ── */}
          {hasSrc ? (
            <video
              ref={videoRef}
              src={tab.src}
              poster={tab.poster || undefined}
              muted={muted}
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              onClick={togglePlay}
              onMouseMove={revealControls}
              onTouchStart={revealControls}
            />
          ) : (
            /* Placeholder when no video src */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-stone-800 to-stone-900 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-orange-300" strokeWidth={1.8} />
              </div>
              <p className="text-[11px] text-stone-400 text-center px-4 leading-relaxed">
                {tab.caption}
                <br />
                <span className="text-[10px] text-stone-500">أضف رابط الفيديو في VIDEOS</span>
              </p>
            </div>
          )}

          {/* ── Overlay controls ── */}
          <AnimatePresence>
            {(showControls || !playing) && hasSrc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 z-10 flex flex-col justify-between"
                onClick={togglePlay}
              >
                {/* Top gradient */}
                <div className="h-20 bg-gradient-to-b from-black/60 to-transparent" />

                {/* Centre play button */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={SPRING}
                >
                  <div
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl"
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  >
                    {playing
                      ? <Pause className="w-6 h-6 text-white" strokeWidth={2.5} />
                      : <Play  className="w-6 h-6 text-white fill-white ml-0.5" strokeWidth={0} />}
                  </div>
                </motion.div>

                {/* Bottom bar */}
                <div
                  className="px-3 pb-3 bg-gradient-to-t from-black/70 to-transparent"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Progress */}
                  <div className="relative h-1 rounded-full bg-white/20 mb-2.5 cursor-pointer"
                    onClick={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      seek((e.clientX - rect.left) / rect.width);
                    }}>
                    {/* Buffered */}
                    <div className="absolute top-0 left-0 h-full rounded-full bg-white/30 transition-all"
                      style={{ width: `${buffered * 100}%` }} />
                    {/* Played */}
                    <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all"
                      style={{ width: `${progress * 100}%` }} />
                    {/* Thumb */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow"
                      style={{ left: `calc(${progress * 100}% - 6px)` }} />
                  </div>

                  {/* Time + buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={togglePlay}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        {playing
                          ? <Pause className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          : <Play  className="w-3.5 h-3.5 text-white fill-white ml-px" strokeWidth={0} />}
                      </button>
                      <button onClick={toggleMute}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        {muted
                          ? <VolumeX className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                          : <Volume2 className="w-3.5 h-3.5 text-white" strokeWidth={2} />}
                      </button>
                      <span className="text-[9px] text-white/70 tabular-nums">
                        {fmt(progress * duration)} / {fmt(duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={restart}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <RotateCcw className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      </button>
                      <button onClick={fullscreen}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-20 h-1 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Phone reflection */}
      <div className="absolute -bottom-6 left-[10%] right-[10%] h-8 rounded-full bg-black/20 blur-xl pointer-events-none" />

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 -left-3 z-10"
      >
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold shadow-md bg-white ${tab.badgeColor}`}>
          <Star className="w-3 h-3 fill-current" />
          {tab.badge}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────
export default function VideoSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax on the phone
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const prev = () => setActiveIdx(i => (i - 1 + VIDEOS.length) % VIDEOS.length);
  const next = () => setActiveIdx(i => (i + 1) % VIDEOS.length);

  const tab = VIDEOS[activeIdx];

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative bg-stone-900 py-20 sm:py-28 px-5 overflow-hidden"
    >
      {/* ── Background decoration ── */}
      {/* Warm radial glow */}
      <div className="pointer-events-none absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-orange-500/[0.08] blur-[100px]" />
      {/* Diagonal lines */}
      <div className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)" }} />
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-400">شاهد بنفسك</span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            تجربة شلّة{" "}
            <span className="bg-gradient-to-l from-orange-400 to-amber-400 bg-clip-text text-transparent">
              بين يديك
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-400 text-base max-w-md mx-auto leading-relaxed">
            اكتشف كيف تُحوّل شلّة مطعمك إلى ماكينة مبيعات لا تتوقف
          </motion.p>
        </motion.div>

        {/* ── Main content: phone + text ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Phone — centered on mobile, right-aligned on desktop */}
          <motion.div
            className="flex justify-center lg:justify-end order-first lg:order-last"
            style={{ y: phoneY }}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <PhonePlayer tab={tab} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Text + tabs */}
          <motion.div
            className="flex flex-col gap-8"
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {/* Tab pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {VIDEOS.map((v, i) => (
                <motion.button
                  key={v.id}
                  onClick={() => setActiveIdx(i)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  className={`
                    px-4 py-2 rounded-full text-[13px] font-bold border transition-all duration-200
                    ${i === activeIdx
                      ? "bg-gradient-to-l from-orange-500 to-amber-500 text-white border-transparent shadow-md shadow-orange-900/30"
                      : "bg-white/5 text-stone-400 border-white/10 hover:border-white/20 hover:text-stone-300"
                    }
                  `}
                >
                  {v.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Caption + description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.38, ease: EASE }}
                className="space-y-4"
              >
                <h3
                  className="text-2xl sm:text-3xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
                >
                  {tab.caption}
                </h3>
                <p className="text-stone-400 text-[15px] leading-[1.85]">{tab.desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* Feature bullets */}
            <motion.ul variants={stagger(0.07)} className="space-y-3">
              {[
                "واجهة عربية سلسة وسريعة الاستجابة",
                "تحديثات لحظية بدون تأخير",
                "متوافق مع جميع أجهزة الجوال",
                "إشعارات فورية لكل طلب جديد",
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-center gap-3 text-[14px] text-stone-300"
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA row */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.a
                href="#register"
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 12px 36px rgba(234,88,12,0.35)" }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-bold text-[14px] border-0 cursor-pointer no-underline"
                style={{ background: "linear-gradient(135deg, #C44A0A 0%, #EA580C 45%, #F0850A 100%)", boxShadow: "0 4px 20px rgba(234,88,12,0.35)" }}
              >
                <Smartphone className="w-4 h-4" strokeWidth={2.2} />
                جرّب التطبيق الآن
              </motion.a>
              <motion.a
                href="#features"
                whileHover={{ borderColor: "rgba(234,88,12,0.4)", color: "#fdba74" }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-stone-400 font-semibold text-[14px] border border-white/10 hover:bg-white/5 transition-colors cursor-pointer no-underline"
              >
                اعرف المزيد
                <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Navigation arrows + dots ── */}
        <motion.div
          className="flex items-center justify-center gap-5 mt-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        >
          <motion.button
            onClick={prev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            aria-label="السابق"
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-stone-400 hover:border-orange-400/40 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </motion.button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {VIDEOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`تبديل إلى ${VIDEOS[i].label}`}
                className="transition-all duration-300"
              >
                <motion.div
                  animate={{
                    width: i === activeIdx ? 24 : 8,
                    backgroundColor: i === activeIdx ? "#F97316" : "rgba(255,255,255,0.2)",
                  }}
                  className="h-2 rounded-full"
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </button>
            ))}
          </div>

          <motion.button
            onClick={next}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            aria-label="التالي"
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-stone-400 hover:border-orange-400/40 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </motion.div>

     
      </div>
    </section>
  );
}