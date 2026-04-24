"use client";

import { PartnerBenefits } from "../sections/Partner/PartnerBenefits";
import PartnerFormSection from "../sections/Partner/PartnerFormSection";

export interface PartnerFormData {
  f_name: string; l_name: string; phone: string; email: string;
  password: string; zoneId: string; moduleId: string; store_name: string;
  address: string; latitude: string; longitude: string;
  logo: File | null; cover_photo: File | null; agreed: boolean;
}

export default function PartnerPage() {
  return (
    <main className="bg-white min-h-screen" dir="rtl">
      <PartnerBenefits />
      <PartnerFormSection />
    </main>
  );
}