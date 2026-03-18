"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Store, MapPin, Upload,
  X, CheckCircle2, AlertCircle, Info, ChevronDown,
  Loader2, Navigation, Search, Image as ImageIcon,
  Eye, EyeOff, Target, Truck, Lightbulb, History,
  DollarSign, BarChart3, ArrowLeft, Sparkles,
  Send, Bell,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring" as const, stiffness: 400, damping: 28 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
const stagger = (s = 0.08, d = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: s, delayChildren: d } },
});
const VP = { once: true, margin: "-60px" } as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface PartnerFormData {
  f_name: string; l_name: string; phone: string; email: string;
  password: string; zoneId: string; moduleId: string; store_name: string;
  address: string; latitude: string; longitude: string;
  logo: File | null; cover_photo: File | null; agreed: boolean;
}
interface Zone { id: number; name: string; }
interface Module { id: number; module_name?: string; name?: string; }
interface Notif { message: string; type: "success" | "error" | "info"; isVisible: boolean; }

const INITIAL: PartnerFormData = {
  f_name: "", l_name: "", phone: "", email: "", password: "",
  zoneId: "", moduleId: "", store_name: "", address: "",
  latitude: "", longitude: "", logo: null, cover_photo: null, agreed: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: registration
// ─────────────────────────────────────────────────────────────────────────────
function usePartnerReg() {
  const [form, setForm] = useState<PartnerFormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [notif, setNotif] = useState<Notif>({ message: "", type: "info", isVisible: false });

  const zones: Zone[] = [
    { id: 1, name: "طويق" }, { id: 2, name: "نمار" },
    { id: 3, name: "العليا" }, { id: 4, name: "الملز" },
  ];
  const modules: Module[] = [
    { id: 1, name: "مطعم" }, { id: 2, name: "بقالة" },
    { id: 3, name: "صيدلية" }, { id: 4, name: "أخرى" },
  ];

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const onFile = useCallback((name: string, file: File | null) => {
    setForm(p => ({ ...p, [name]: file }));
  }, []);

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      setNotif({ message: "يرجى تحديد موقع المتجر على الخريطة", type: "error", isVisible: true });
      return;
    }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1800)); // replace with real API
      setNotif({ message: "تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً 🎉", type: "success", isVisible: true });
      setForm(INITIAL);
    } catch {
      setNotif({ message: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.", type: "error", isVisible: true });
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  const onReset = useCallback(() => setForm(INITIAL), []);

  return { form, setForm, zones, modules, submitting, notif, setNotif, onChange, onFile, onSubmit, onReset };
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: map
// ─────────────────────────────────────────────────────────────────────────────
function useMap(
  setForm: React.Dispatch<React.SetStateAction<PartnerFormData>>,
  setNotif: React.Dispatch<React.SetStateAction<Notif>>,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [center] = useState({ lat: 24.7136, lng: 46.6753 });
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);

  // Lazy-load Maps SDK once
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!key) return; // no key → fallback UI
    if ((window as any).google?.maps) { setReady(true); return; }
    const existing = document.querySelector('script[data-gmap="1"]');
    if (existing) { existing.addEventListener("load", () => setReady(true)); return; }
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=ar`;
    s.async = true; s.defer = true; s.dataset.gmap = "1";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);

  // Mount map after SDK ready
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;
    const G = (window as any).google.maps;
    const map = new G.Map(mapRef.current, {
      center, zoom: 13,
      streetViewControl: false, mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });
    mapInstance.current = map;

    map.addListener("click", (e: any) => {
      const lat = +e.latLng.lat().toFixed(6);
      const lng = +e.latLng.lng().toFixed(6);
      placeMarker(map, { lat, lng });
      setMarkerPos({ lat, lng });
      setForm(p => ({ ...p, latitude: String(lat), longitude: String(lng) }));
    });
  }, [ready, center, setForm]);

  const placeMarker = (map: any, pos: { lat: number; lng: number }) => {
    const G = (window as any).google.maps;
    if (markerRef.current) markerRef.current.setMap(null);
    markerRef.current = new G.Marker({
      position: pos, map,
      animation: G.Animation.DROP,
      icon: {
        path: G.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#EA580C",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2.5,
      },
    });
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setNotif({ message: "المتصفح لا يدعم تحديد الموقع", type: "error", isVisible: true });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: +coords.latitude.toFixed(6), lng: +coords.longitude.toFixed(6) };
        if (mapInstance.current) {
          mapInstance.current.panTo(pos);
          mapInstance.current.setZoom(15);
          placeMarker(mapInstance.current, pos);
        }
        setMarkerPos(pos);
        setForm(p => ({ ...p, latitude: String(pos.lat), longitude: String(pos.lng) }));
      },
      () => setNotif({ message: "فشل في تحديد موقعك 😢", type: "error", isVisible: true })
    );
  }, [setForm, setNotif]);

  return { mapRef, ready, markerPos, getCurrentLocation };
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL UI ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-5 mt-2">
      <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-orange-500" strokeWidth={2.2} />
      </div>
      <span className="text-[14px] font-bold text-stone-800">{title}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-stone-200 to-stone-200" />
    </div>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="text-[13px] font-semibold text-stone-700 flex items-center gap-1 mb-1.5">
      {text}
      {required && <span className="text-red-400 text-xs">*</span>}
    </label>
  );
}

function Input({
  label, name, type = "text", placeholder, value, onChange,
  required, disabled, icon: Icon, helperText,
}: {
  label: string; name: string; type?: string; placeholder?: string;
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; disabled?: boolean; icon?: React.ElementType; helperText?: string;
}) {
  const [show, setShow] = useState(false);
  const isPwd = type === "password";
  return (
    <div>
      <Label text={label} required={required} />
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4 text-stone-350" strokeWidth={2} />
          </div>
        )}
        <input
          name={name} type={isPwd ? (show ? "text" : "password") : type}
          placeholder={placeholder} value={value} onChange={onChange}
          required={required} disabled={disabled} dir="auto"
          className={`
            w-full rounded-xl border border-stone-200 bg-white text-stone-800 text-[14px]
            placeholder:text-stone-400 py-3 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400
            hover:border-stone-300 disabled:opacity-50 disabled:bg-stone-50
            ${Icon ? "pr-10" : "pr-4"} ${isPwd ? "pl-10" : "pl-4"}
          `}
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helperText && <p className="text-[11px] text-stone-400 mt-1">{helperText}</p>}
    </div>
  );
}

function PhoneField({
  label, value, onChange, required, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      <div className="flex">
        <div className="flex items-center gap-1.5 px-3 py-3 rounded-r-xl border border-stone-200 bg-stone-50 text-stone-600 text-[13px] font-semibold flex-shrink-0 select-none">
          <span>🇸🇦</span><span>+966</span>
        </div>
        <input
          type="tel" placeholder="5X XXX XXXX" value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
          required={required} disabled={disabled} dir="ltr"
          className="
            flex-1 min-w-0 rounded-l-xl border border-r-0 border-stone-200 bg-white
            text-stone-800 text-[14px] px-4 py-3 placeholder:text-stone-400
            focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400
            hover:border-stone-300 transition-all disabled:opacity-50
          "
        />
      </div>
    </div>
  );
}

function Select({
  label, name, options, value, onChange, required, disabled, placeholder, helperText,
}: {
  label: string; name: string;
  options: { value: string; label: string }[];
  value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean; disabled?: boolean; placeholder?: string; helperText?: string;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      <div className="relative">
        <select
          name={name} value={value} onChange={onChange}
          required={required} disabled={disabled}
          className="
            w-full appearance-none rounded-xl border border-stone-200 bg-white
            text-stone-800 text-[14px] pr-10 pl-4 py-3 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400
            hover:border-stone-300 transition-all disabled:opacity-50 disabled:bg-stone-50
          "
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" strokeWidth={2} />
      </div>
      {helperText && <p className="text-[11px] text-stone-400 mt-1">{helperText}</p>}
    </div>
  );
}

function FileUpload({
  label, name, file, onChange, accept = "image/*", required, maxMB = 4,
}: {
  label: string; name: string; file: File | null;
  onChange: (name: string, f: File | null) => void;
  accept?: string; required?: boolean; maxMB?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const process = useCallback((f: File) => {
    setErr(null);
    if (f.size > maxMB * 1024 * 1024) { setErr(`الحجم الأقصى ${maxMB} ميغابايت`); return; }
    setPreview(URL.createObjectURL(f));
    onChange(name, f);
  }, [maxMB, name, onChange]);

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null); setErr(null); onChange(name, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex-1 min-w-0">
      <Label text={label} required={required} />
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) process(f); }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        className={`
          relative flex flex-col items-center justify-center gap-2 min-h-[130px]
          rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden
          transition-all duration-200 p-4 text-center select-none
          ${drag ? "border-orange-400 bg-orange-50/60" : preview ? "border-orange-300" : "border-stone-200 bg-stone-50 hover:border-orange-300 hover:bg-orange-50/20"}
          ${err ? "border-red-300 bg-red-50/20" : ""}
        `}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button type="button" onClick={clear}
                className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                <X className="w-4 h-4 text-stone-700" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-orange-400" strokeWidth={1.8} />
            </div>
            <p className="text-[12px] font-medium text-stone-500">
              اسحب أو <span className="text-orange-500 font-bold">اختر صورة</span>
            </p>
            <p className="text-[10px] text-stone-400">PNG، JPG حتى {maxMB} MB</p>
          </>
        )}
      </div>
      {err && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{err}</p>}
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) process(f); }} />
    </div>
  );
}

function Checkbox({
  checked, onChange, label, name, href, linkText, required,
}: {
  checked: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string; name: string; href?: string; linkText?: string; required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <div className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} required={required} className="sr-only peer" />
        <div className="w-5 h-5 rounded-md border-2 border-stone-300 bg-white peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all duration-200 flex items-center justify-center">
          {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-[13px] text-stone-600 leading-relaxed mt-0.5">
        {label}{" "}
        {href && linkText && (
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="text-orange-500 font-semibold hover:underline">{linkText}</a>
        )}
      </span>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP SECTION (fixed, self-contained)
// ─────────────────────────────────────────────────────────────────────────────
function MapSection({
  form, setForm, setNotif,
}: {
  form: PartnerFormData;
  setForm: React.Dispatch<React.SetStateAction<PartnerFormData>>;
  setNotif: React.Dispatch<React.SetStateAction<Notif>>;
}) {
  const { mapRef, ready, markerPos, getCurrentLocation } = useMap(setForm, setNotif);
  const hasKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {hasKey && (
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              placeholder="ابحث عن موقع في الخريطة..."
              className="w-full rounded-xl border border-stone-200 bg-white text-[13px] text-stone-800 placeholder:text-stone-400 pr-10 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-all"
              dir="rtl"
            />
          </div>
        )}
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white text-[13px] font-semibold hover:bg-sky-600 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
        >
          <Navigation className="w-4 h-4" strokeWidth={2.5} />
          موقعي الحالي
        </button>
      </div>

      {/* Map / fallback */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100" style={{ height: "360px" }}>
        {hasKey ? (
          <>
            {!ready && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-50 z-10">
                <Loader2 className="w-7 h-7 text-orange-400 animate-spin" strokeWidth={2} />
                <p className="text-[13px] text-stone-500">جاري تحميل الخريطة...</p>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full" />
          </>
        ) : (
          /* Fallback: manual coord entry */
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-orange-400" strokeWidth={1.8} />
            </div>
            <p className="text-[13px] font-semibold text-stone-600 text-center">
              أدخل إحداثيات المتجر يدوياً
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <Input label="خط العرض" name="latitude" placeholder="24.7136"
                value={form.latitude}
                onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))} required />
              <Input label="خط الطول" name="longitude" placeholder="46.6753"
                value={form.longitude}
                onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))} required />
            </div>
          </div>
        )}

        {/* Coords badge */}
        {(markerPos || (form.latitude && form.longitude)) && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-emerald-200 shadow-sm text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            {markerPos?.lat ?? form.latitude}, {markerPos?.lng ?? form.longitude}
          </div>
        )}
      </div>

      <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-orange-400 flex-shrink-0" />
        انقر على الخريطة لتحديد موقع المتجر بدقة، أو استخدم زر "موقعي الحالي"
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
const TOAST = {
  success: { Icon: CheckCircle2, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", title: "تم بنجاح" },
  error:   { Icon: AlertCircle,  bg: "bg-red-50",     border: "border-red-200",     text: "text-red-500",     title: "خطأ" },
  info:    { Icon: Info,         bg: "bg-sky-50",      border: "border-sky-200",     text: "text-sky-500",     title: "تنبيه" },
};

function Toast({ notif, onClose }: { notif: Notif; onClose: () => void }) {
  useEffect(() => {
    if (!notif.isVisible) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [notif.isVisible, onClose]);

  const cfg = TOAST[notif.type];
  const { Icon } = cfg;

  return (
    <AnimatePresence>
      {notif.isVisible && notif.message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-32px)] max-w-sm"
          role="alert"
        >
          <div className={`relative flex items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-black/10 overflow-hidden ${cfg.bg} ${cfg.border}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.text}`} strokeWidth={2.2} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-stone-800 mb-0.5">{cfg.title}</p>
              <p className="text-[12px] text-stone-600 leading-relaxed">{notif.message}</p>
            </div>
            <button onClick={onClose}
              className="w-6 h-6 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5 text-stone-400" />
            </button>
            <div className={`absolute bottom-0 left-0 h-0.5 rounded-full ${cfg.text} opacity-30`}
              style={{ width: "100%", animation: "toast-shrink 5s linear forwards" }} />
          </div>
          <style>{`@keyframes toast-shrink{from{width:100%}to{width:0}}`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT 1 — PartnerBenefits
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT 2 — PartnerFormSection (form + newsletter combined)
// ─────────────────────────────────────────────────────────────────────────────
export function PartnerFormSection() {
  const { form, setForm, zones, modules, submitting, notif, setNotif, onChange, onFile, onSubmit, onReset } = usePartnerReg();
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubDone(true);
    setEmail("");
    setTimeout(() => setSubDone(false), 4000);
  };

  return (
    <section dir="rtl" className="relative bg-white py-20 px-5 overflow-hidden">
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(rgba(234,88,12,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div className="text-center mb-14"
          variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-3">
            <div className="w-7 h-px bg-gradient-to-l from-orange-400 to-transparent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500">انضم إلينا</span>
            <div className="w-7 h-px bg-gradient-to-r from-orange-400 to-transparent" />
          </motion.div>
          <motion.h2 variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'Amiri', serif", fontStyle: "italic" }}>
            سجّل مطعمك{" "}
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 bg-clip-text text-transparent">الآن</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-stone-500 text-base max-w-md mx-auto">
            أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة
          </motion.p>
        </motion.div>

        {/* Two-column layout: form left, sidebar right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── FORM ── */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
            <form onSubmit={onSubmit} noValidate
              className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">

              {/* Personal */}
              <div>
                <SectionDivider title="المعلومات الشخصية" icon={User} />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input label="الاسم الأول" name="f_name" placeholder="أدخل الاسم الأول"
                    value={form.f_name} onChange={onChange} required disabled={submitting} icon={User} />
                  <Input label="اسم العائلة" name="l_name" placeholder="أدخل اسم العائلة"
                    value={form.l_name} onChange={onChange} required disabled={submitting} icon={User} />
                  <PhoneField label="رقم الهاتف" value={form.phone}
                    onChange={phone => setForm(p => ({ ...p, phone }))} required disabled={submitting} />
                  <Input label="البريد الإلكتروني" name="email" type="email" placeholder="example@email.com"
                    value={form.email} onChange={onChange} required disabled={submitting} icon={Mail} />
                  <Input label="كلمة المرور" name="password" type="password" placeholder="8 أحرف على الأقل"
                    value={form.password} onChange={onChange} required disabled={submitting} icon={Lock} />
                </div>
              </div>

              {/* Store */}
              <div>
                <SectionDivider title="معلومات المتجر" icon={Store} />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Select label="المنطقة" name="zoneId"
                    options={zones.map(z => ({ value: String(z.id), label: z.name }))}
                    value={form.zoneId} onChange={onChange} required disabled={submitting}
                    placeholder="اختر المنطقة" helperText="منطقة التوصيل الخاصة بمتجرك" />
                  <Select label="نوع المتجر" name="moduleId"
                    options={modules.map(m => ({ value: String(m.id), label: m.module_name ?? m.name ?? "" }))}
                    value={form.moduleId} onChange={onChange} required
                    disabled={!form.zoneId || submitting}
                    placeholder={!form.zoneId ? "اختر المنطقة أولاً" : "اختر نوع المتجر"}
                    helperText="نوع عملك (مطعم، بقالة، إلخ)" />
                  <Input label="اسم المتجر" name="store_name" placeholder="أدخل اسم المتجر"
                    value={form.store_name} onChange={onChange} required disabled={submitting} icon={Store} />
                  <Input label="عنوان المتجر" name="address" placeholder="أدخل العنوان الكامل"
                    value={form.address} onChange={onChange} required disabled={submitting} icon={MapPin} />
                </div>
              </div>

              {/* Images */}
              <div>
                <SectionDivider title="صور المتجر" icon={Upload} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <FileUpload label="شعار المتجر" name="logo" file={form.logo} onChange={onFile} required maxMB={4} />
                  <FileUpload label="صورة الغلاف" name="cover_photo" file={form.cover_photo} onChange={onFile} maxMB={4} />
                </div>
              </div>

              {/* Map */}
              <div>
                <SectionDivider title="الموقع الجغرافي" icon={MapPin} />
                <MapSection form={form} setForm={setForm} setNotif={setNotif} />
              </div>

              {/* Terms */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <Checkbox checked={form.agreed} onChange={onChange} name="agreed"
                  label="أوافق على جميع" href="/terms" linkText="الشروط والأحكام" required />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button type="button" onClick={onReset} disabled={submitting}
                  className="flex-1 sm:flex-none sm:w-auto px-8 py-3 rounded-xl border border-stone-200 bg-white text-stone-500 font-semibold text-[14px] hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-300">
                  إعادة ضبط
                </button>
                <motion.button type="submit" disabled={submitting}
                  whileHover={submitting ? {} : { scale: 1.02, y: -1 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                  transition={SPRING}
                  className="flex-1 sm:flex-none sm:w-auto px-10 py-3 rounded-xl bg-gradient-to-l from-orange-500 to-amber-500 text-white font-bold text-[14px] shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400 flex items-center justify-center gap-2">
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />جاري الإرسال...</>
                    : <><Send className="w-4 h-4" strokeWidth={2.5} />إرسال الطلب</>}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* ── SIDEBAR ── */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}
            className="space-y-5 lg:sticky lg:top-24">

            {/* Steps card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" strokeWidth={2.2} />
                خطوات التسجيل
              </h3>
              {[
                { n: "01", t: "أكمل البيانات", d: "فردية ومعلومات المتجر" },
                { n: "02", t: "ارفع الصور", d: "الشعار وصورة الغلاف" },
                { n: "03", t: "حدد الموقع", d: "على الخريطة بدقة" },
                { n: "04", t: "انطلق!", d: "استقبل أول طلب اليوم" },
              ].map((s, i) => (
                <div key={s.n} className={`flex items-start gap-3 ${i < 3 ? "mb-4" : ""}`}>
                  <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-orange-500">{s.n}</div>
                  <div>
                    <p className="text-[13px] font-bold text-stone-700">{s.t}</p>
                    <p className="text-[11px] text-stone-400">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-5">
              <h3 className="text-[13px] font-bold text-stone-700 mb-3">لماذا شلّة؟</h3>
              {[
                "تفعيل خلال 24 ساعة",
                "1,000 ريال رصيد ترحيبي",
                "مخاطرة صفر مع قيدها",
                "مدير حساب مخصص",
              ].map(t => (
                <div key={t} className="flex items-center gap-2 mb-2 last:mb-0">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" strokeWidth={2.2} />
                  <span className="text-[12px] text-stone-600">{t}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-orange-400" strokeWidth={2.2} />
                <h3 className="text-[14px] font-bold text-stone-800">النشرة الإخبارية</h3>
              </div>
              <p className="text-[12px] text-stone-500 mb-3 leading-relaxed">
                اشترك للحصول على آخر الأخبار والعروض المميزة
              </p>
              <AnimatePresence mode="wait">
                {subDone ? (
                  <motion.div key="done"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 py-2 text-[13px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                    تم الاشتراك بنجاح!
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubscribe} className="flex gap-2">
                    <input type="email" placeholder="example@email.com" value={email}
                      onChange={e => setEmail(e.target.value)} required
                      className="flex-1 min-w-0 rounded-xl border border-stone-200 bg-stone-50 text-[13px] text-stone-800 placeholder:text-stone-400 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-all"
                      dir="ltr" />
                    <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[13px] font-bold shadow-sm shadow-orange-200 border-0 cursor-pointer">
                      اشترك
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <Toast notif={notif} onClose={() => setNotif(p => ({ ...p, isVisible: false }))} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT — Full Partner Page
// ─────────────────────────────────────────────────────────────────────────────
export default function PartnerPage() {
  return (
    <main className="bg-white min-h-screen" dir="rtl">
      <PartnerBenefits />
      <PartnerFormSection />
    </main>
  );
}