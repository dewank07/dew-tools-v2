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
}

export default function PaletteCard({ colors }: PaletteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Palette</CardTitle>
        <CardDescription>
          Drag the swatches on the image to pick colors
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {colors.map((color, index) => (
          <Palette key={index} hex={color.replace("#", "")} />
        ))}
      </CardContent>
    </Card>
  );
}
