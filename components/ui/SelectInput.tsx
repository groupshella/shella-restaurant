import { ChevronDown } from "lucide-react";
import Label from "./Label";
import { ChangeEvent } from "react";

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
  export default Select;