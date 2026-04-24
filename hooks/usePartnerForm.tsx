import { Notif } from "@/components/ui/Toast";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PartnerFormData {
  applicant_name: string;   // اسم مقدم الطلب
  position: string;         // المنصب
  activity_type: string;    // نوع النشاط
  store_name: string;       // اسم المنشأة
  unified_number: string;   // الرقم الموحد
  phone: string;            // رقم التواصل
  email: string;            // البريد الإلكتروني
  branches: string;         // عدد الفروع
  latitude: string;         // الموقع — خط العرض
  longitude: string; 
  location:string;       // الموقع
  agreed: boolean;
}

const INITIAL: PartnerFormData = {
  applicant_name: "",
  position: "",
  activity_type: "",
  store_name: "",
  unified_number: "",
  phone: "",
  email: "",
  branches: "1",
  latitude: "",
  longitude: "",
  location:"",
  agreed: false,
};
 
function validatePartnerForm(form: PartnerFormData): string | null {
  if (!form.applicant_name.trim()) return "يرجى إدخال اسم مقدم الطلب";
  if (!form.position.trim()) return "يرجى إدخال المنصب";
  if (!form.activity_type.trim()) return "يرجى اختيار نوع النشاط";
  if (!form.store_name.trim()) return "يرجى إدخال اسم المنشأة";
  if (!form.unified_number.trim()) return "يرجى إدخال الرقم الموحد";
  if (!/^\d{10}$/.test(form.unified_number.trim())) return "الرقم الموحد يجب أن يتكون من 10 أرقام";
  if (!form.phone.trim()) return "يرجى إدخال رقم التواصل";
  if (!/^\d{9,10}$/.test(form.phone.trim())) return "رقم التواصل غير صحيح";
  if (!form.email.trim()) return "يرجى إدخال البريد الإلكتروني";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "صيغة البريد الإلكتروني غير صحيحة";
  if (!form.branches.trim()) return "يرجى إدخال عدد الفروع";
  if (!form.agreed) return "يرجى الموافقة على الشروط والأحكام";
  if (!form.latitude || !form.longitude) return "يرجى تحديد الموقع الجغرافي على الخريطة";

  const lat = Number(form.latitude);
  const lng = Number(form.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return "إحداثيات الموقع غير صحيحة";
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return "إحداثيات الموقع خارج النطاق المسموح";

  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
function usePartnerForm() {
  const [form, setForm] = useState<PartnerFormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [notif, setNotif] = useState<Notif>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked =
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : undefined;
      setForm((p) => ({
        ...p,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationError = validatePartnerForm(form);
      if (validationError) {
        setNotif({
          message: validationError,
          type: "error",
          isVisible: true,
        });
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/partner/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicant_name: form.applicant_name,
            position: form.position,
            activity_type: form.activity_type,
            store_name: form.store_name,
            unified_number: form.unified_number,
            phone: form.phone,
            email: form.email,
            branches: form.branches,
            latitude: form.latitude,
            longitude: form.longitude,
            location:form.location,
            maps_link: `https://maps.google.com/?q=${form.latitude},${form.longitude}`,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? "Server error");
        }

        setNotif({
          message: "تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً 🎉",
          type: "success",
          isVisible: true,
        });
        setForm(INITIAL);
      } catch (err: any) {
        setNotif({
          message:
            err?.message ?? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
          type: "error",
          isVisible: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form]
  );

  const onReset = useCallback(() => setForm(INITIAL), []);

  return {
    form,
    setForm,
    submitting,
    notif,
    setNotif,
    onChange,
    onSubmit,
    onReset,
  };
}

export default usePartnerForm;