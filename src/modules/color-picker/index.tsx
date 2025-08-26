"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Image, Palette, Trash, Upload, RotateCcw } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaletteCard from "./components/palette-card";
import DraggableSwatch from "./components/draggable-swatch";

const ColorPicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("image");
  const [swatchColors, setSwatchColors] = useState<string[]>(["", "", "", ""]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPickerMode, setIsPickerMode] = useState(false);
  const [customSwatchPositions, setCustomSwatchPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

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

  const handleColorChange = useCallback((index: number, color: string) => {
    setSwatchColors((prev) => {
      const newColors = [...prev];
      newColors[index] = color;
      return newColors;
    });
  }, []);

  const handleDeletePaletteColor = useCallback((index: number) => {
    setSwatchColors((prev) => {
      const newColors = [...prev];
      newColors.splice(index, 1);
      return newColors;
    });
  }, []);

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isPickerMode || !containerRef.current || !imageRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - containerRect.left;
      const clickY = e.clientY - containerRect.top;

      // Ensure click is within image bounds
      if (
        clickX < 0 ||
        clickY < 0 ||
        clickX > containerRect.width ||
        clickY > containerRect.height
      ) {
        return;
      }

      // Create new swatch at click position
      const newSwatchIndex = swatchColors.length;

      // Store the click position for the new swatch (offset by half swatch size for centering)
      setCustomSwatchPositions((prev) => ({
        ...prev,
        [newSwatchIndex]: { x: clickX - 12, y: clickY - 12 },
      }));

      setSwatchColors((prev) => [...prev, ""]);

      // Exit picker mode after creating swatch
      setIsPickerMode(false);
      setActiveTab("image");
    },
    [isPickerMode, swatchColors.length]
  );

  // Generate initial positions for swatches
  const getInitialSwatchPosition = useCallback(
    (index: number) => {
      // If there's a custom position for this swatch (from clicking), use it
      if (customSwatchPositions[index]) {
        return customSwatchPositions[index];
      }

      // For the first 4 swatches, use predetermined positions
      const basePositions = [
        { x: 20, y: 20 },
        { x: 80, y: 20 },
        { x: 20, y: 80 },
        { x: 80, y: 80 },
      ];

      if (index < basePositions.length) {
        return basePositions[index];
      }

      // For additional swatches, generate positions in a grid pattern
      const row = Math.floor((index - 4) / 4);
      const col = (index - 4) % 4;
      return {
        x: 20 + col * 60,
        y: 120 + row * 60,
      };
    },
    [customSwatchPositions]
  );

  return (
    <div className="container p-4 space-y-6">
      <h1 className="text-2xl font-bold">Color Picker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card className="bg-sidebar">
          <CardHeader>
            <CardTitle>Color Picker</CardTitle>
            <CardDescription>Pick a color and get the hex code</CardDescription>
          </CardHeader>
          <CardContent>
            {image ? (
              <>
                <div
                  ref={containerRef}
                  className={`relative mb-5 ${
                    isPickerMode ? "cursor-crosshair" : ""
                  }`}
                  onClick={handleImageClick}
                >
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
                      initialPosition={getInitialSwatchPosition(index)}
                      onColorChange={handleColorChange}
                      imageRef={imageRef}
                      containerRef={containerRef}
                      imageLoaded={imageLoaded}
                      onDragStart={() => {
                        setIsDragging(true);
                      }}
                      onDragEnd={() => {
                        setIsDragging(false);
                      }}
                    />
                  ))}
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value);
                    if (value === "picker") {
                      setIsPickerMode(true);
                    } else {
                      setIsPickerMode(false);
                    }
                  }}
                >
                  <TabsList className="grid w-fit grid-cols-3 px-5 gap-3 mx-auto bg-white shadow-lg rounded-lg justify-end">
                    <TabsTrigger value="image">
                      <Image className="size-5" />
                    </TabsTrigger>
                    <TabsTrigger value="picker">
                      <Palette className="size-5" />
                    </TabsTrigger>
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
                          <RotateCcw className="size-5" />
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
          <PaletteCard
            colors={swatchColors}
            onColorChange={handleColorChange}
            onDeleteColor={handleDeletePaletteColor}
          />
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
