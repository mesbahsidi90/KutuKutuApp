export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cib" | "edahabia";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  order_message: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: string;
  recipient_lat: number | null;
  recipient_lng: number | null;
  hide_identity: boolean;
  note_to_store: string | null;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  estimated_delivery_at: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  shape_id: string;
  flavor_id: string;
  color_hex: string;
  design_id: string | null;
  message_text: string | null;
  photo_print_url: string | null;
  photo_print_fee: number;
  additional_instructions: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  preview_front_url: string | null;
  preview_top_url: string | null;
  preview_sliced_url: string | null;
}

export interface OrderAddon {
  id: string;
  order_id: string;
  addon_id: string;
  quantity: number;
  unit_price: number;
}
