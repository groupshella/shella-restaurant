function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <label className="text-[13px] font-semibold text-stone-700 flex items-center gap-1 mb-1.5">
        {text}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
    );
  }
  export default Label;