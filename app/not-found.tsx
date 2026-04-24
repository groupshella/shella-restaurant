// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-stone-50"
    >
      <section className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white/90 backdrop-blur-sm shadow-lg shadow-stone-200/50 p-6 sm:p-10 text-center">
        <span className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs sm:text-sm font-semibold text-orange-600 mb-4">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-3">
          الصفحة غير متوفرة حالياً
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-7 mb-6">
          هذه الصفحة غير متاحة الآن، وسنضيفها قريباً بتجربة حديثة تجمع بين
          واجهة مستخدم عصرية وتجربة استخدام ممتازة ومتجاوبة مع جميع الأجهزة.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-l from-orange-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 hover:shadow-lg transition-all"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/partner"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-all"
          >
            استكشف صفحة الشركاء
          </Link>
        </div>
      </section>
    </main>
  )
}
