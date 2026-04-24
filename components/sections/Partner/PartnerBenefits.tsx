'use client' ;
import { Target,CheckCircle2,DollarSign,Truck,BarChart3,Lightbulb,History, ArrowLeft } from "lucide-react";
import {motion} from 'framer-motion';
import { fadeUp, scaleIn, SPRING, stagger, VP } from "@/lib/animations";
const BENEFITS = [
    { Icon: Target,    href: "/BenefitPage",           title: "فرصة استثنائية لشركاء شلّة",   desc: "انطلق بأعمالك نحو القمة مع باقة نمو متكاملة بقيمة 5,400 ريال — مجاناً بالكامل!",       color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", tag: "حصري" },
    { Icon: CheckCircle2, href: "/PointOfSale",        title: "حدود متجرك الآن حدود المملكة", desc: "انطلق بمنتجاتك إلى كل مدينة وقرية في المملكة عبر شبكة شلّة الواسعة.",              color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-200",   tag: "نطاق واسع" },
    { Icon: DollarSign, href: "/AddToMoney",           title: "ضاعف أرباحك وزد مبيعاتك",     desc: "انضم إلى عالم متاجر شلّة اليوم واستمتع بأدوات النمو المتكاملة.",                    color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  tag: "أرباح أعلى" },
    { Icon: Truck,      href: "/ShippingPage",         title: "وداعاً لقلق الشحن",            desc: "مرحباً بعصر جديد من الثقة والسرعة الفائقة مع نظام توصيل شلّة الذكي.",               color: "text-sky-600",    bg: "bg-sky-50",    border: "border-sky-200",    tag: "سريع" },
    { Icon: BarChart3,  href: "/SaleStatisticsPage",  title: "إحصائيات البيع الذكية",        desc: "بوصلتك الدقيقة نحو قرارات أذكى وأرباح أعلى — تقارير لحظية شاملة.",                 color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", tag: "تحليلات" },
    { Icon: Lightbulb,  href: "/CreativityWrokePage", title: "إبداع في إدارة عملك",          desc: "يمكنك إدارة كل شيء من التطبيق — القائمة، الطلبات، العروض، والعملاء.",              color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", tag: "ذكي" },
    { Icon: History,    href: "/ManagmentOperationPage", title: "إدارة العمليات بفعالية",   desc: "تنبيهات فورية بالطلبات الجديدة وإدارة كاملة لسير العمل من مكان واحد.",              color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", tag: "فوري" },
  ] as const;
  
 
export function PartnerBenefits() {
    return (
      <section dir="rtl" className="relative bg-stone-50 py-20 px-5 overflow-hidden">
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(rgba(160,100,20,0.09) 1px, transparent 1px)", backgroundSize: "30px 30px", maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 20%, transparent 80%)" }} />
  
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-14"
            variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VP}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-3">
              <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">لماذا شلّة</span>
              <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
            </motion.div>
            <motion.h2 variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
              style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}>
              فوائد الانضمام كشريك{" "}
              <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">في شلّة</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
              منظومة متكاملة تضمن نموّك وتُحرّر وقتك لما يهمّ — طبخك وعملاؤك
            </motion.p>
          </motion.div>
  
          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={stagger(0.07, 0.1)} initial="hidden" whileInView="visible" viewport={VP}>
            {BENEFITS.map((b) => {
              const { Icon } = b;
              return (
                <motion.a
                  key={b.title}
                  href={b.href}
                  variants={scaleIn}
                  whileHover={{ y: -5, transition: SPRING }}
                  className={`
                    relative rounded-2xl border bg-white p-5 shadow-sm
                    hover:shadow-md transition-shadow duration-300 cursor-pointer
                    block no-underline group overflow-hidden
                    ${b.border}
                  `}
                >
                  {/* Top bar */}
                  <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
  
                  {/* Tag */}
                  <span className={`inline-block text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md border mb-3 ${b.bg} ${b.border} ${b.color}`}>
                    {b.tag}
                  </span>
  
                  {/* Icon */}
                  <motion.div
                    className={`w-11 h-11 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center mb-3`}
                    whileHover={{ rotate: -4, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Icon className={`w-5 h-5 ${b.color}`} strokeWidth={2.1} />
                  </motion.div>
  
                  <h3 className="text-[14px] font-bold text-stone-800 leading-snug mb-1.5">{b.title}</h3>
                  <p className="text-[12px] text-stone-500 leading-relaxed">{b.desc}</p>
  
                  {/* Arrow */}
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>اعرف أكثر</span>
                    <ArrowLeft className="w-3 h-3" strokeWidth={2.5} />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>
    );
  }
  