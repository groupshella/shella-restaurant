import Label from "./Label";

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
  export default PhoneField;