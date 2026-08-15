import { getReadyMadeCakesByCategory } from "@/lib/supabase/queries/ready-made-cakes";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { ReadyMadeSection } from "@/components/home/ReadyMadeSection";

export const revalidate = 60;

export default async function HomePage() {
  const groups = await getReadyMadeCakesByCategory();

  return (
    <div>
      <WelcomeBanner />
      {groups.map((group) => (
        <ReadyMadeSection key={group.category} category={group.category} cakes={group.cakes} />
      ))}
    </div>
  );
}
