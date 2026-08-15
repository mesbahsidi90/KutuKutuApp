import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkoutSubmissionSchema } from "@/lib/payment/order-validation";
import { createPendingOrder } from "@/lib/payment/create-pending-order";
import { registerOrder } from "@/lib/payment/satim";

// Starts checkout: creates a pending_payment order with server-recomputed
// prices, registers it with SATIM's hosted payment page, and returns the
// URL to redirect the customer to. No card data passes through this route
// or anywhere else in this app -- SATIM's own hosted page collects it.
export async function POST(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "ar";
  if (!["ar", "en", "fr"].includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsed = checkoutSubmissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout submission", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  let pendingOrder;
  try {
    pendingOrder = await createPendingOrder(parsed.data, locale as "ar" | "en" | "fr");
  } catch (err) {
    console.error("payment/initiate: failed to create pending order", err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const callbackUrl = `${appUrl}/api/payment/callback?orderId=${pendingOrder.orderId}&locale=${locale}`;

  try {
    const { gatewayOrderId, formUrl } = await registerOrder({
      orderNumber: pendingOrder.orderNumber,
      amountDzd: pendingOrder.total,
      returnUrl: callbackUrl,
      failUrl: callbackUrl,
      description: `KutuKutu order ${pendingOrder.orderNumber}`,
      language: locale as "ar" | "en" | "fr",
    });

    const supabase = await createClient();
    await supabase
      .from("orders")
      .update({ payment_reference: gatewayOrderId })
      .eq("id", pendingOrder.orderId);

    return NextResponse.json({ formUrl });
  } catch (err) {
    console.error("payment/initiate: SATIM registration failed", err);
    return NextResponse.json({ error: "Payment gateway unavailable" }, { status: 502 });
  }
}
