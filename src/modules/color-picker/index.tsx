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
import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaletteCard from "./components/palette-card";
import DraggableSwatch from "./components/DraggableSwatch";
import ZoomPicker from "./components/ZoomPicker";

const ColorPicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("image");
  const [swatchColors, setSwatchColors] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [_isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomPicker, setZoomPicker] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    center: { x: 0, y: 0 },
  });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImage(content);
      setImageLoaded(false); // Reset image loaded state
    };
    reader.readAsDataURL(file);

    input.value = "";
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleSwatchColorChange = useCallback((id: number, color: string) => {
    setSwatchColors((prev) => {
      const newColors = [...prev];
      newColors[id] = color;
      return newColors;
    });
  }, []);

  // Use simple initial positions - the swatches will self-position when image loads
  const initialSwatchPositions = [
    { x: 20, y: 20 },
    { x: 80, y: 20 },
    { x: 20, y: 80 },
    { x: 80, y: 80 },
  ];

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
                <div ref={containerRef} className="relative mb-5">
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Uploaded image"
                    className="max-w-full max-h-full object-contain"
                    onLoad={handleImageLoad}
                  />

                  {/* Draggable Swatches */}
                  {swatchColors.map((color, index) => (
                    <DraggableSwatch
                      key={index}
                      id={index}
                      initialColor={color}
                      initialPosition={initialSwatchPositions[index]}
                      onColorChange={handleSwatchColorChange}
                      imageRef={imageRef}
                      containerRef={containerRef}
                      imageLoaded={imageLoaded}
                      onDragStart={(position) => {
                        setIsDragging(true);
                        setZoomPicker({
                          visible: true,
                          position: {
                            x: position.x + 60,
                            y: position.y - 75,
                          },
                          center: { x: position.x + 12, y: position.y + 12 },
                        });
                      }}
                      onDrag={(position) => {
                        const containerRect =
                          containerRef.current?.getBoundingClientRect();
                        if (containerRect) {
                          let zoomX = position.x + 60;
                          let zoomY = position.y - 75;

                          // Keep zoom picker within bounds
                          if (zoomX + 150 > containerRect.width)
                            zoomX = position.x - 210;
                          if (zoomY < 0) zoomY = position.y + 60;

                          setZoomPicker({
                            visible: true,
                            position: { x: zoomX, y: zoomY },
                            center: {
                              x: position.x + 12,
                              y: position.y + 12,
                            },
                          });
                        }
                      }}
                      onDragEnd={() => {
                        setIsDragging(false);
                        setZoomPicker((prev) => ({
                          ...prev,
                          visible: false,
                        }));
                      }}
                    />
                  ))}

                  {/* Zoom Picker */}
                  <ZoomPicker
                    isVisible={zoomPicker.visible}
                    position={zoomPicker.position}
                    imageRef={imageRef}
                    zoomCenter={zoomPicker.center}
                  />
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
        {image && <PaletteCard colors={swatchColors} />}
      </div>
    </div>
  );
};

export default ColorPicker;
