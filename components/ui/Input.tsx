import { Eye, EyeOff } from "lucide-react";
import Label from "./Label";
import { ChangeEvent, useState } from "react";

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
  export default Input;