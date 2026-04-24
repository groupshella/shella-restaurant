import { useCallback, useEffect, useRef, useState } from "react";
import Label from "./Label";
import { AlertCircle, ImageIcon, X } from "lucide-react";

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
  export default FileUpload;