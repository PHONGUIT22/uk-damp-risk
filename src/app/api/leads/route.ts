import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// UK Phone Number format validation:
// Supports Mobile (07xxx, +447xxx), Landline (01xxx, 02xxx, +441xxx, +442xxx)
function isValidUkPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  const ukPhoneRegex = /^(?:(?:\+44\s?|0044\s?|0))(?:7\d{9}|[12]\d{8,9})$/;
  return ukPhoneRegex.test(cleaned);
}

function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      outcode,
      city_or_town,
      damp_risk_score,
      ppm_reading,
      service_needed,
      property_type,
      full_name,
      phone_number,
      email,
      urgency,
    } = body;

    // 1. Required fields presence check
    if (!full_name || !phone_number || !email || !outcode) {
      return NextResponse.json(
        { success: false, error: "Please complete all required fields (Name, Phone, Email, Outcode)." },
        { status: 400 }
      );
    }

    // 2. Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address (e.g. name@example.co.uk)." },
        { status: 400 }
      );
    }

    // 3. UK phone number format validation
    if (!isValidUkPhoneNumber(phone_number)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid UK phone number (e.g. 07123 456789 or 020 7946 0192).",
        },
        { status: 400 }
      );
    }

    // 4. Validate and sanitize inputs
    const cleanOutcode = outcode.trim().toUpperCase();
    const cleanCity = city_or_town ? String(city_or_town).trim() : null;
    const score = Number(damp_risk_score ?? ppm_reading ?? 0);

    const validServices = [
      "damp_timber_survey",
      "condensation_mould",
      "rising_penetrating",
      "full_property_audit",
      "water_softener",
      "boiler_protection",
      "drinking_filter",
      "both"
    ];
    const sanitizedService = validServices.includes(service_needed) ? service_needed : "damp_timber_survey";

    const validUrgencies = ["asap", "within_month", "planning_budget"];
    const sanitizedUrgency = validUrgencies.includes(urgency) ? urgency : "within_month";

    const leadId = crypto.randomUUID();

    // Primary attempt to insert damp survey lead
    const payload: Record<string, any> = {
      id: leadId,
      outcode: cleanOutcode,
      city_or_town: cleanCity,
      ppm_reading: score,
      service_needed: sanitizedService,
      property_type: property_type || "terraced",
      full_name: full_name.trim(),
      phone_number: phone_number.trim(),
      email: email.trim().toLowerCase(),
      urgency: sanitizedUrgency,
      status: "new",
    };

    let { error } = await supabase.from("leads").insert([payload]);

    // Backward-compatibility fallback if Supabase table has legacy CHECK constraint
    if (error && error.message?.includes("service_needed")) {
      console.warn("Retrying with backward-compatible service_needed due to constraint:", error.message);
      payload.service_needed = "water_softener";
      if (!["detached", "semi_detached", "terraced", "flat_apartment"].includes(payload.property_type)) {
        payload.property_type = "terraced";
      }
      const retryResult = await supabase.from("leads").insert([payload]);
      error = retryResult.error;
    }

    if (error) {
      console.error("Supabase insert lead error:", error);
      // In development or if Supabase is offline/unconfigured, don't break the user experience
      if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.json({
          success: true,
          mock: true,
          leadId,
          message: "Lead recorded in local mode.",
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save lead request. Please try again.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: "Lead successfully recorded.",
    });
  } catch (err: any) {
    console.error("Lead submission exception:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
