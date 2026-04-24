"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Store,
  MapPin,
  Briefcase,
  Phone,
  Hash,
  GitBranch,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import usePartnerForm from "@/hooks/usePartnerForm";
import { fadeUp, SPRING, stagger, VP } from "@/lib/animations";
import SectionDivider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import PhoneField from "@/components/ui/PhoneField";
import MapSection from "@/components/ui/MapSection";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/SelectInput";
import Toast from "@/components/ui/Toast";

// ─── Static options ────────────────────────────────────────────────────────────
const POSITIONS = [
  { value: "مالك", label: "مالك" },
  { value: "مدير", label: "مدير" },
  { value: "مفوّض", label: "مفوّض" },
  { value: "شريك", label: "شريك" },
  { value: "أخرى", label: "أخرى" },
];

const ACTIVITY_TYPES = [
  { value: "مطعم", label: "مطعم" },
  { value: "مقهى", label: "مقهى / كافيه" },
  { value: "بقالة", label: "بقالة / سوبرماركت" },
  { value: "صيدلية", label: "صيدلية" },
  { value: "حلويات", label: "حلويات ومخبوزات" },
  { value: "وجبات سريعة", label: "وجبات سريعة" },
  { value: "أخرى", label: "أخرى" },
];

const BRANCHES = [
  { value: "1", label: "فرع واحد" },
  { value: "2", label: "فرعان" },
  { value: "3-5", label: "من 3 إلى 5 فروع" },
  { value: "6-10", label: "من 6 إلى 10 فروع" },
  { value: "+10", label: "أكثر من 10 فروع" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function PartnerFormSection() {
  const {
    form,
    setForm,
    submitting,
    notif,
    setNotif,
    onChange,
    onSubmit,
    onReset,
  } = usePartnerForm();
  console.log(form)

  return (
    <section
      dir="rtl"
      className="relative bg-white py-20 px-5 overflow-hidden"
    >
      {/* Decorative dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(234,88,12,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          className="text-center mb-14"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">
              انضم إلينا
            </span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}
          >
            سجّل منشأتك{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">
              الآن
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-stone-500 text-base max-w-md mx-auto"
          >
            أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة
          </motion.p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ────────── FORM ────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <form
              onSubmit={onSubmit}
              noValidate
              className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8"
            >
              {/* Personal info */}
              <div>
                <SectionDivider title="بيانات مقدم الطلب" icon={User} />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="اسم مقدم الطلب"
                    name="applicant_name"
                    placeholder="الاسم الكامل"
                    value={form.applicant_name}
                    onChange={onChange}
                    required
                    disabled={submitting}
                    icon={User}
                  />
                  <Select
                    label="المنصب"
                    name="position"
                    options={POSITIONS}
                    value={form.position}
                    onChange={onChange}
                    required
                    disabled={submitting}
                    placeholder="اختر المنصب"
                  />
                  <PhoneField
                    label="رقم التواصل"
                    value={form.phone}
                    onChange={(phone) => setForm((p) => ({ ...p, phone }))}
                    required
                    disabled={submitting}
                  />
                  <Input
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={onChange}
                    disabled={submitting}
                    icon={Mail}
                  />
                </div>
              </div>

              {/* Store info */}
              <div>
                <SectionDivider title="بيانات المنشأة" icon={Store} />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Select
                    label="نوع النشاط"
                    name="activity_type"
                    options={ACTIVITY_TYPES}
                    value={form.activity_type}
                    onChange={onChange}
                    required
                    disabled={submitting}
                    placeholder="اختر نوع النشاط"
                  />
                  <Input
                    label="اسم المنشأة"
                    name="store_name"
                    placeholder="الاسم التجاري الكامل"
                    value={form.store_name}
                    onChange={onChange}
                    required
                    disabled={submitting}
                    icon={Store}
                  />
                  <Input
                    label="الرقم الموحد للمنشأة"
                    name="unified_number"
                    placeholder="10xxxxxxxx"
                    value={form.unified_number}
                    onChange={onChange}
                    required
                    disabled={submitting}
                    icon={Hash}
                  />
                  <Select
                    label="عدد الفروع"
                    name="branches"
                    options={BRANCHES}
                    value={form.branches}
                    onChange={onChange}
                    required
                    disabled={submitting}
                    placeholder="اختر عدد الفروع"
                  />
                </div>
              </div>

              {/* Map */}
              <div>
                <SectionDivider title="الموقع الجغرافي" icon={MapPin} />
                <MapSection
                  form={form}
                  setForm={setForm}
                  setNotif={setNotif}
                />
              </div>

              {/* Terms */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <Checkbox
                  checked={form.agreed}
                  onChange={onChange}
                  name="agreed"
                  label="أوافق على جميع"
                  href="/terms"
                  linkText="الشروط والأحكام"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onReset}
                  disabled={submitting}
                  className="flex-1 sm:flex-none sm:w-auto px-8 py-3 rounded-xl border border-stone-200 bg-white text-stone-500 font-semibold text-[14px] hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-300"
                >
                  إعادة ضبط
                </button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={submitting ? {} : { scale: 1.02, y: -1 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                  transition={SPRING}
                  className="flex-1 sm:flex-none sm:w-auto px-10 py-3 rounded-xl bg-gradient-to-l from-orange-500 to-amber-500 text-white font-bold text-[14px] shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={2.5} />
                      إرسال الطلب
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* ────────── SIDEBAR ────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            className="space-y-5 lg:sticky lg:top-24"
          >
            {/* Steps card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Sparkles
                  className="w-4 h-4 text-orange-400"
                  strokeWidth={2.2}
                />
                خطوات التسجيل
              </h3>
              {[
                { n: "01", t: "أكمل البيانات", d: "بيانات مقدم الطلب والمنشأة" },
                { n: "02", t: "حدد الموقع", d: "عبر GPS أو الخريطة" },
                { n: "03", t: "وافق على الشروط", d: "اقرأ ثم وافق" },
                { n: "04", t: "انطلق!", d: "استقبل أول طلب اليوم" },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className={`flex items-start gap-3 ${i < 3 ? "mb-4" : ""}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-orange-500">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-stone-700">
                      {s.t}
                    </p>
                    <p className="text-[11px] text-stone-400">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-5">
              <h3 className="text-[13px] font-bold text-stone-700 mb-3">
                لماذا شلّة؟
              </h3>
              {[
                "تفعيل خلال 24 ساعة",
                "1,000 ريال رصيد ترحيبي",
                "مخاطرة صفر مع قيدها",
                "مدير حساب مخصص",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 mb-2 last:mb-0">
                  <CheckCircle2
                    className="w-4 h-4 text-orange-400 flex-shrink-0"
                    strokeWidth={2.2}
                  />
                  <span className="text-[12px] text-stone-600">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Toast
        notif={notif}
        onClose={() => setNotif((p) => ({ ...p, isVisible: false }))}
      />
    </section>
  );
}

export default PartnerFormSection;