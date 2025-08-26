import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Palette from "./palette";

interface PaletteCardProps {
  colors: string[];
  onColorChange?: (index: number, newColor: string) => void;
  onDeleteColor?: (index: number) => void;
  ids?: Array<string | number>;
}

export default function PaletteCard({
  colors,
  onColorChange,
  onDeleteColor,
  ids,
}: PaletteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Palette</CardTitle>
        <CardDescription>
          Drag the swatches on the image to pick colors
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div
              key={ids ? ids[index] : index}
              className="transition-all duration-300 ease-out"
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <Palette
                hex={color.replace("#", "")}
                index={index}
                onColorChange={onColorChange}
                onDelete={onDeleteColor}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
