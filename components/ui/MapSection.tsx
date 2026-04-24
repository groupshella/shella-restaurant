"use client";

import {
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { PartnerFormData } from "@/hooks/usePartnerForm";
import { Notif } from "@/components/ui/Toast";
import useMap from "@/hooks/useMapHook";

interface Props {
  form: PartnerFormData;
  setForm: React.Dispatch<React.SetStateAction<PartnerFormData>>;
  setNotif: React.Dispatch<React.SetStateAction<Notif>>;
}

function MapSection({ form, setForm, setNotif }: Props) {
  const { mapCenter, mapZoom, markerPos, selectFromMap, getCurrentLocation } =
    useMap(setForm, setNotif);

  const [mapLoaded, setMapLoaded] = useState(false);

  // Read key at runtime so the component never crashes when the key is absent
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";
  const hasKey = apiKey.length > 0;

  const fallbackCoords = useMemo(() => {
    if (!form.latitude || !form.longitude) return null;
    return { lat: Number(form.latitude), lng: Number(form.longitude) };
  }, [form.latitude, form.longitude]);

  const onMapClick = useCallback(
    (event: MapMouseEvent) => {
      const latLng = event.detail.latLng;
      if (!latLng) return;
      selectFromMap(latLng.lat, latLng.lng);
    },
    [selectFromMap]
  );

  const coordsReady =
    markerPos || (form.latitude && form.longitude);

  return (
    <div className="space-y-3">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {hasKey && (
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="ابحث عن موقع في الخريطة..."
              className="w-full rounded-xl border border-stone-200 bg-white text-[13px] text-stone-800
                         placeholder:text-stone-400 pr-10 pl-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-all"
              dir="rtl"
            />
          </div>
        )}

        {/* GPS button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                     bg-sky-500 text-white text-[13px] font-semibold
                     hover:bg-sky-600 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
        >
          <Navigation className="w-4 h-4" strokeWidth={2.5} />
          موقعي الحالي
        </button>
      </div>

      {/* Map area */}
      <div
        className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100"
        style={{ height: "360px" }}
      >
        {hasKey ? (
          <>
            {/* Loading overlay */}
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-50 z-10">
                <Loader2
                  className="w-7 h-7 text-orange-400 animate-spin"
                  strokeWidth={2}
                />
                <p className="text-[13px] text-stone-500">
                  جاري تحميل الخريطة...
                </p>
              </div>
            )}

            <APIProvider apiKey={apiKey} language="ar">
              <Map
                className="w-full h-full"
                center={mapCenter}
                zoom={mapZoom}
                onClick={onMapClick}
                onTilesLoaded={() => setMapLoaded(true)}
                disableDefaultUI
                clickableIcons={false}
                gestureHandling="greedy"
              >
                {markerPos && <Marker position={markerPos} />}
              </Map>
            </APIProvider>
          </>
        ) : (
          /* Fallback: manual coordinate entry when no API key */
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-orange-400" strokeWidth={1.8} />
            </div>
            <p className="text-[13px] font-semibold text-stone-600 text-center">
              أدخل إحداثيات المتجر يدوياً
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-stone-500 font-medium">
                  خط العرض
                </label>
                <input
                  type="text"
                  name="latitude"
                  placeholder="24.7136"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, latitude: e.target.value }))
                  }
                  className="rounded-xl border border-stone-200 bg-white text-[13px] text-stone-800
                             px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-all"
                  dir="ltr"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-stone-500 font-medium">
                  خط الطول
                </label>
                <input
                  type="text"
                  name="longitude"
                  placeholder="46.6753"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, longitude: e.target.value }))
                  }
                  className="rounded-xl border border-stone-200 bg-white text-[13px] text-stone-800
                             px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Coordinates badge — shown once location is set */}
        {coordsReady && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-emerald-200 shadow-sm text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            {markerPos?.lat ?? fallbackCoords?.lat},{" "}
            {markerPos?.lng ?? fallbackCoords?.lng}
          </div>
        )}
      </div>

      <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-orange-400 flex-shrink-0" />
        انقر على الخريطة لتحديد موقع المتجر بدقة، أو استخدم زر "موقعي الحالي"
      </p>

      {form.location && (
        <div className="rounded-xl border border-orange-200 bg-orange-50/50 px-3 py-2.5">
          <p className="text-[11px] text-stone-500 mb-1">الموقع </p>
          <p className="text-[13px] font-semibold text-stone-700">{form.location}</p>
        </div>
      )}
    </div>
  );
}

export default MapSection;