import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Palette from "./palette";

interface Swatch {
  id: string;
  x: number;
  y: number;
  hex: string;
}

interface PaletteCardProps {
  swatches: Swatch[];
  onDeleteSwatch?: (swatchId: string) => void;
}

export default function PaletteCard({
  swatches,
  onDeleteSwatch,
}: PaletteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Palette</CardTitle>
        <CardDescription>Palette for the image</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {swatches.length > 0 ? (
          swatches.map((swatch) => (
            <Palette
              key={swatch.id}
              hex={swatch.hex}
              onDelete={() => onDeleteSwatch?.(swatch.id)}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">
            Click on the image to add color swatches
          </div>
        )}
      </CardContent>
    </Card>
  );
}
