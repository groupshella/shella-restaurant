import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";
import {AnimatePresence, motion} from 'framer-motion';
export interface Notif { message: string; type: "success" | "error" | "info"; isVisible: boolean; }
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
  export default Toast;