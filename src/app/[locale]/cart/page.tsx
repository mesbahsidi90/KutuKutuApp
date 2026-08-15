import { getActiveAddons } from "@/lib/supabase/queries/catalog";
import { CartPageContent } from "@/components/cart/CartPageContent";

export default async function CartPage() {
  const addons = await getActiveAddons();
  return <CartPageContent addons={addons} />;
}
