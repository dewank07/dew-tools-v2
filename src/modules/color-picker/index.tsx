"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Palette, Trash, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaletteCard from "./components/palette-card";

interface Swatch {
  id: string;
  x: number;
  y: number;
  hex: string;
}

const ColorPicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("image");
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [draggedSwatch, setDraggedSwatch] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImage(content);
      setSwatches([]); // Clear swatches when new image is loaded
    };
    reader.readAsDataURL(file);

    input.value = "";
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Set canvas size to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on canvas
        ctx.drawImage(img, 0, 0);

        // Add 4 default swatches
        const canvasRect = canvas.getBoundingClientRect();
        const defaultPositions = [
          { x: canvas.width * 0.2, y: canvas.height * 0.2 },
          { x: canvas.width * 0.8, y: canvas.height * 0.2 },
          { x: canvas.width * 0.2, y: canvas.height * 0.8 },
          { x: canvas.width * 0.8, y: canvas.height * 0.8 },
        ];

        const defaultSwatches = defaultPositions.map((pos, index) => {
          const hex = getColorAtPosition(pos.x, pos.y);
          return {
            id: `default-${index}`,
            x: pos.x,
            y: pos.y,
            hex: hex.replace("#", ""),
          };
        });

        setSwatches(defaultSwatches);
      };
      img.src = image;
    }
  }, [image]);

  const getColorAtPosition = (x: number, y: number): string => {
    if (!canvasRef.current) return "#000000";

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "#000000";

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
      .toString(16)
      .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
  };

  const constrainToCanvas = (x: number, y: number) => {
    if (!canvasRef.current) return { x, y };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: Math.max(0, Math.min(x, rect.width)),
      y: Math.max(0, Math.min(y, rect.height)),
    };
  };

  const updateZoomCanvas = (x: number, y: number) => {
    if (!canvasRef.current || !zoomCanvasRef.current) return;

    const canvas = canvasRef.current;
    const zoomCanvas = zoomCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const zoomCtx = zoomCanvas.getContext("2d");

    if (!ctx || !zoomCtx) return;

    const zoomSize = 60;
    const zoomScale = 8;
    zoomCanvas.width = zoomSize;
    zoomCanvas.height = zoomSize;

    // Get source coordinates relative to actual canvas dimensions
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const sourceX = x * scaleX;
    const sourceY = y * scaleY;

    // Extract and zoom the area around cursor
    const sourceSize = zoomSize / zoomScale;
    const sourceLeft = sourceX - sourceSize / 2;
    const sourceTop = sourceY - sourceSize / 2;

    try {
      const imageData = ctx.getImageData(
        sourceLeft,
        sourceTop,
        sourceSize,
        sourceSize
      );

      // Create temporary canvas for scaling
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCanvas.width = sourceSize;
      tempCanvas.height = sourceSize;
      tempCtx.putImageData(imageData, 0, 0);

      // Scale up to zoom canvas
      zoomCtx.imageSmoothingEnabled = false;
      zoomCtx.drawImage(
        tempCanvas,
        0,
        0,
        sourceSize,
        sourceSize,
        0,
        0,
        zoomSize,
        zoomSize
      );

      // Draw crosshair
      zoomCtx.strokeStyle = "#fff";
      zoomCtx.lineWidth = 1;
      zoomCtx.setLineDash([2, 2]);

      // Vertical line
      zoomCtx.beginPath();
      zoomCtx.moveTo(zoomSize / 2, 0);
      zoomCtx.lineTo(zoomSize / 2, zoomSize);
      zoomCtx.stroke();

      // Horizontal line
      zoomCtx.beginPath();
      zoomCtx.moveTo(0, zoomSize / 2);
      zoomCtx.lineTo(zoomSize, zoomSize / 2);
      zoomCtx.stroke();

      // Center square
      zoomCtx.setLineDash([]);
      zoomCtx.strokeStyle = "#ff0000";
      zoomCtx.lineWidth = 2;
      zoomCtx.strokeRect(zoomSize / 2 - 2, zoomSize / 2 - 2, 4, 4);
    } catch (error) {
      // Handle edge cases where getImageData might fail
      console.log("Zoom update failed:", error);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !containerRef.current || draggedSwatch) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate position relative to the container
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const { x, y } = constrainToCanvas(rawX, rawY);

    // Get the color at this position
    const hex = getColorAtPosition(x, y);

    // Add new swatch
    const newSwatch: Swatch = {
      id: Date.now().toString(),
      x,
      y,
      hex: hex.replace("#", ""),
    };

    setSwatches((prev) => [...prev, newSwatch]);
  };

  const handleSwatchMouseDown = (e: React.MouseEvent, swatchId: string) => {
    e.stopPropagation();
    setDraggedSwatch(swatchId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const { x, y } = constrainToCanvas(rawX, rawY);

    // Update cursor position and zoom
    setCursorPosition({ x, y });
    updateZoomCanvas(x, y);

    if (draggedSwatch) {
      // Update swatch position
      setSwatches((prev) =>
        prev.map((swatch) =>
          swatch.id === draggedSwatch
            ? {
                ...swatch,
                x,
                y,
                hex: getColorAtPosition(x, y).replace("#", ""),
              }
            : swatch
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedSwatch(null);
  };

  const removeSwatch = (swatchId: string) => {
    setSwatches((prev) => prev.filter((swatch) => swatch.id !== swatchId));
  };

  return (
    <div className="container p-4 space-y-6">
      <h1 className="text-2xl font-bold">Color Picker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Color Picker</CardTitle>
            <CardDescription>Pick a color and get the hex code</CardDescription>
          </CardHeader>
          <CardContent>
            {image ? (
              <>
                <div
                  ref={containerRef}
                  className="mb-5 relative"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => {
                    handleMouseUp();
                    setShowZoom(false);
                    setCursorPosition(null);
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-96 object-contain border rounded cursor-crosshair"
                    onClick={handleCanvasClick}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  {swatches.map((swatch) => (
                    <div
                      key={swatch.id}
                      className="absolute w-6 h-6 border-2 border-white shadow-lg rounded-full cursor-move hover:border-gray-300 transition-colors"
                      style={{
                        left: swatch.x - 12,
                        top: swatch.y - 12,
                        backgroundColor: `#${swatch.hex}`,
                      }}
                      onMouseDown={(e) => handleSwatchMouseDown(e, swatch.id)}
                    />
                  ))}

                  {/* Zoom View */}
                  {showZoom && cursorPosition && (
                    <div
                      className="absolute pointer-events-none z-10"
                      style={{
                        left: cursorPosition.x + 20,
                        top: cursorPosition.y - 40,
                        transform:
                          cursorPosition.x > 300
                            ? "translateX(-100px)"
                            : "none",
                      }}
                    >
                      <div className="bg-white border-2 border-gray-300 rounded-full p-1 shadow-lg">
                        <canvas
                          ref={zoomCanvasRef}
                          className="rounded-full"
                          width={60}
                          height={60}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="picker">Picker</TabsTrigger>
                    <DropdownMenu
                      onOpenChange={(open) => {
                        if (open) setActiveTab("reset");
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <TabsTrigger
                          value="reset"
                          onMouseDown={() => setActiveTab("reset")}
                        >
                          Reset
                        </TabsTrigger>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = () => {
                              handleFileUpload(input);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="mr-2 size-4" />
                          <span>New Image</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setImage(null)}>
                          <Trash className="mr-2 size-4" />
                          <span>Clear All Colors</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TabsList>

                  <TabsContent value="image"></TabsContent>

                  <TabsContent value="picker"></TabsContent>

                  <TabsContent value="reset"></TabsContent>
                </Tabs>
              </>
            ) : (
              <Button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    handleFileUpload(input);
                  };
                  input.click();
                }}
              >
                <Upload className="size-3" />
                Pick an image
              </Button>
            )}
          </CardContent>
        </Card>
        {image && (
          <PaletteCard swatches={swatches} onDeleteSwatch={removeSwatch} />
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
