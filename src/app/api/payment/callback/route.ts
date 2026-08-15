import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getOrderStatus } from "@/lib/payment/satim";

// SATIM redirects the customer's browser here after they leave the hosted
// payment page. The redirect itself is never trusted -- the actual result
// always comes from an independent server-to-server call to SATIM's
// getOrderStatus endpoint before the order is marked paid. Uses the
// service-role client because a guest checkout has no session to satisfy
// the owner-only RLS update policy; the trust boundary here is the
// verified SATIM call above, not row ownership.
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  const locale = request.nextUrl.searchParams.get("locale") ?? "ar";

  if (!orderId) {
    return NextResponse.redirect(new URL(`/${locale}/checkout?paymentFailed=1`, request.url));
  }

  const supabase = createServiceRoleClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, payment_reference")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || !order.payment_reference) {
    return NextResponse.redirect(new URL(`/${locale}/checkout?paymentFailed=1`, request.url));
  }

  try {
    const result = await getOrderStatus(order.payment_reference);

    if (result.status === "paid") {
      await supabase
        .from("orders")
        .update({ status: "confirmed", payment_status: "paid" })
        .eq("id", order.id);

      return NextResponse.redirect(
        new URL(`/${locale}/confirmation?order=${order.order_number}`, request.url)
      );
    }

    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);

    return NextResponse.redirect(new URL(`/${locale}/checkout?paymentFailed=1`, request.url));
  } catch (err) {
    console.error("payment/callback: SATIM status check failed", err);
    return NextResponse.redirect(new URL(`/${locale}/checkout?paymentFailed=1`, request.url));
  }
}
