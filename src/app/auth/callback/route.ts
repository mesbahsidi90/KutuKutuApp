import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

// Magic-link sign-in lands here with a PKCE `code`, which we exchange for a
// session (this sets the auth cookies), then send the customer back to
// their account page.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(`/${locale}/account`, request.url));
}
