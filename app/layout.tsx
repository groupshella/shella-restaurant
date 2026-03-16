import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "شلّة | شريك النمو الأول للمطاعم في السعودية",
  description: "انضم إلى شلّه. رصيد تشغيلي فوري وتدفق السيولة خلال 49 ساعة فقط.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-arabic antialiased`}>
        {children}
      </body>
    </html>
  );
}
