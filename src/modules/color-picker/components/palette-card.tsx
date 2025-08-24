import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Palette from "./palette";

export default function PaletteCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Palette</CardTitle>
        <CardDescription>Palette for the image</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Palette hex="d86868" />
        <Palette hex="d1d2d3" />
        <Palette hex="000000" />
      </CardContent>
    </Card>
  );
}
