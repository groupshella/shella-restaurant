// app/api/partner/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";


export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse body ──────────────────────────────────────────────────────────
    const body = await request.json();

    const {
      applicant_name,
      position,
      activity_type,
      store_name,
      unified_number,
      phone,
      email,
      branches,
      latitude,
      longitude,
      maps_link,
      location,
      timestamp,
    } = body;

    // ── 2. Validate required fields ────────────────────────────────────────────
    const missing = [
      !applicant_name && "applicant_name",
      !position       && "position",
      !activity_type  && "activity_type",
      !store_name     && "store_name",
      !unified_number && "unified_number",
      !phone          && "phone",
      !latitude       && "latitude",
      !longitude      && "longitude",
      !location   &&"location",
    ].filter(Boolean);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", fields: missing },
        { status: 400 }
      );
    }

    // ── 3. Validate env vars ───────────────────────────────────────────────────
    const clientEmail  = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey   = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error("Missing Google Sheets env vars");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // ── 4. Auth ────────────────────────────────────────────────────────────────
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        // Vercel stores \n as literal \\n — fix it
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // ── 5. Format timestamp (Riyadh timezone) ─────────────────────────────────
    const formattedTime = new Date(timestamp ?? Date.now()).toLocaleString(
      "ar-SA",
      {
        timeZone: "Asia/Riyadh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

    // ── 6. Build maps link if not provided ────────────────────────────────────
    const mapsUrl =
      maps_link ||
      (latitude && longitude
        ? `https://maps.google.com/?q=${latitude},${longitude}`
        : "");

    // ── 7. Append row ──────────────────────────────────────────────────────────
    //  Columns: A–L  (12 columns)
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Partners!A:M",           // ← sheet tab name
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            applicant_name,   // A — اسم مقدم الطلب
            position,         // B — المنصب
            activity_type,    // C — نوع النشاط
            store_name,       // D — اسم المنشأة
            unified_number,   // E — الرقم الموحد
            phone,            // F — رقم التواصل
            email ?? "",      // G — البريد الإلكتروني
            branches ?? "1",// H — عدد الفروع
            location,  //
            latitude,         // I — خط العرض
            longitude,        // J — خط الطول
            mapsUrl,          // K — رابط الخريطة
            formattedTime,    // L — التاريخ والوقت
          ],
        ],
      },
    });

    console.log("Partner registered:", { applicant_name, phone, store_name });

    return NextResponse.json({
      success: true,
      message: "تم حفظ بيانات المنشأة بنجاح",
    });

  } catch (error: any) {
    console.error("Sheets error:", error?.message ?? error);

    if (error?.message?.includes("Unable to parse")) {
      return NextResponse.json(
        { error: "Invalid Google credentials format" },
        { status: 500 }
      );
    }

    if (error?.message?.includes("not found")) {
      return NextResponse.json(
        {
          error:
            "Google Sheet not found — make sure the sheet is shared with the service account",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save. Please try again." },
      { status: 500 }
    );
  }
}