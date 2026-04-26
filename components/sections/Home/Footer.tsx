"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Twitter, Youtube } from "lucide-react";
import { fadeUp, stagger, VIEWPORT } from "@/lib/animations";

const NAV_LINKS = [
  { label: "الرئيسية", href: "#" },
  { label: "لماذا شلّة", href: "#features" },
  { label: 'ميزة "قيدها"', href: "#qaidha" },
  { label: "مدرج السيولة", href: "#tiers" },
  { label: "الترسانة الميدانية", href: "#arsenal" },
  { label: "الأسئلة الشائعة", href: "#faq" },
] as const;

const CONTACT = [
  { Icon: MapPin, text: "مدينه الرياض، مجمع ليسن فيالي، مبنى 13" },
  { Icon: Phone,  text: "0599966674" },
  { Icon: Mail,   text: "info@shellafood.com" },
] as const;


export default function Footer() {
  return (
    <footer dir="rtl" className="bg-stone-900 text-stone-300 px-5 pt-16 pb-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* Brand */}
          <motion.div variants={fadeUp}>
            <h3
              className="text-2xl font-black text-white mb-3"
              style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
            >
              شلّة
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed mb-5">
              شريك النمو الأول للمطاعم في السعودية. سيولة فورية، تمويل حقيقي، وميزة قيدها الحصرية.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-orange-400 hover:border-orange-500/40 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2]" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[12px] font-bold tracking-[0.15em] uppercase text-stone-500 mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-stone-400 hover:text-orange-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-orange-400 transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[12px] font-bold tracking-[0.15em] uppercase text-stone-500 mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              {CONTACT.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-stone-400">
                  <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-orange-400 stroke-[2]" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-stone-600">© 2025 شلّة للمطاعم. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            {["سياسة الخصوصية", "شروط الاستخدام"].map((t) => (
              <a key={t} href="#" className="text-[11px] text-stone-600 hover:text-orange-400 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}