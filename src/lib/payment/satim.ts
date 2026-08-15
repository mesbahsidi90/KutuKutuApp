import "server-only";

// SATIM is the shared payment gateway behind both CIB and Edahabia cards in
// Algeria. It follows the common "hosted payment page" pattern also used by
// several other bank gateways: register an order server-to-server, redirect
// the customer's browser to SATIM's own hosted page to enter card details
// (never our servers/frontend), then confirm the result server-to-server
// before trusting it. Card data never touches this codebase.
//
// VERIFY BEFORE GOING LIVE: the endpoint paths and field names below
// (register.do / confirmOrder.do / getOrderStatusExtended.do, and the
// orderStatus codes) follow the standard shape of this class of gateway,
// but SATIM's exact merchant API contract should be confirmed against the
// documentation SATIM provides during merchant onboarding once real
// SATIM_MERCHANT_ID / SATIM_MERCHANT_PASSWORD / SATIM_TERMINAL_ID
// credentials are issued. This adapter is the one place to correct field
// names if they differ.

interface SatimCredentials {
  baseUrl: string;
  userName: string;
  password: string;
}

function getCredentials(): SatimCredentials {
  const baseUrl = process.env.SATIM_API_BASE_URL;
  const userName = process.env.SATIM_MERCHANT_ID;
  const password = process.env.SATIM_MERCHANT_PASSWORD;
  if (!baseUrl || !userName || !password) {
    throw new Error("SATIM payment gateway is not configured (missing env vars)");
  }
  return { baseUrl, userName, password };
}

export interface RegisterOrderParams {
  orderNumber: string;
  amountDzd: number;
  returnUrl: string;
  failUrl: string;
  description: string;
  language: "ar" | "en" | "fr";
}

export interface RegisterOrderResult {
  gatewayOrderId: string;
  formUrl: string;
}

export async function registerOrder(params: RegisterOrderParams): Promise<RegisterOrderResult> {
  const { baseUrl, userName, password } = getCredentials();

  const body = new URLSearchParams({
    userName,
    password,
    orderNumber: params.orderNumber,
    // SATIM amounts are in the smallest currency unit (centimes).
    amount: String(Math.round(params.amountDzd * 100)),
    currency: "012", // DZD ISO 4217 numeric code
    returnUrl: params.returnUrl,
    failUrl: params.failUrl,
    description: params.description,
    language: params.language,
  });

  const response = await fetch(`${baseUrl}/payment/rest/register.do`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`SATIM register.do failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    orderId?: string;
    formUrl?: string;
    errorCode?: string;
    errorMessage?: string;
  };

  if (!data.orderId || !data.formUrl) {
    throw new Error(data.errorMessage ?? "SATIM register.do returned no order/form URL");
  }

  return { gatewayOrderId: data.orderId, formUrl: data.formUrl };
}

export type SatimOrderStatus = "paid" | "declined" | "pending" | "cancelled";

export interface OrderStatusResult {
  status: SatimOrderStatus;
  amountDzd: number;
}

// SATIM's numeric orderStatus codes for this gateway family:
// 0 registered-not-paid, 1 pre-authorized, 2 fully paid, 3 cancelled,
// 4 refunded, 5 ACS-authentication initiated, 6 declined.
function mapOrderStatus(code: number): SatimOrderStatus {
  if (code === 2) return "paid";
  if (code === 3 || code === 4) return "cancelled";
  if (code === 6) return "declined";
  return "pending";
}

// Always call this server-to-server to confirm a payment before marking an
// order as paid -- never trust the browser's return-URL redirect alone,
// since query parameters can be replayed or forged by a client.
export async function getOrderStatus(gatewayOrderId: string): Promise<OrderStatusResult> {
  const { baseUrl, userName, password } = getCredentials();

  const body = new URLSearchParams({ userName, password, orderId: gatewayOrderId });

  const response = await fetch(`${baseUrl}/payment/rest/getOrderStatusExtended.do`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`SATIM getOrderStatusExtended.do failed with status ${response.status}`);
  }

  const data = (await response.json()) as { orderStatus?: number; amount?: number };
  if (data.orderStatus === undefined) {
    throw new Error("SATIM getOrderStatusExtended.do returned no orderStatus");
  }

  return {
    status: mapOrderStatus(data.orderStatus),
    amountDzd: (data.amount ?? 0) / 100,
  };
}
