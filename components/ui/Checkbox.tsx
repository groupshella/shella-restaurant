import { CheckCircle2 } from "lucide-react";
import { ChangeEvent } from "react";

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
  export default Checkbox;