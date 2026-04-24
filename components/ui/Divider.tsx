  
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
  export default SectionDivider;