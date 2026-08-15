import {
  getActiveShapes,
  getActiveFlavors,
  getActiveColors,
  getActiveDesigns,
  getReadyMadeCakeById,
} from "@/lib/supabase/queries/catalog";
import { CustomizationFlow } from "@/components/customization/CustomizationFlow";
import type { CustomizationDraft } from "@/types/customization";

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ readyMade?: string }>;
}) {
  const { readyMade } = await searchParams;

  const [shapes, flavors, colors, designs, readyMadeCake] = await Promise.all([
    getActiveShapes(),
    getActiveFlavors(),
    getActiveColors(),
    getActiveDesigns(),
    readyMade ? getReadyMadeCakeById(readyMade) : Promise.resolve(null),
  ]);

  const initialSelection: Partial<CustomizationDraft> | null = readyMadeCake
    ? {
        shapeId: readyMadeCake.shape_id,
        flavorId: readyMadeCake.flavor_id,
        colorHex: readyMadeCake.color_hex,
        designId: readyMadeCake.design_id,
      }
    : null;

  return (
    <CustomizationFlow
      shapes={shapes}
      flavors={flavors}
      colors={colors}
      designs={designs}
      initialSelection={initialSelection}
    />
  );
}
