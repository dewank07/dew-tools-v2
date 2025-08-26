"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Image,
  Palette,
  Trash,
  Upload,
  RotateCcw,
  ImageIcon,
  FileImage,
  MousePointer,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [customSwatchPositions, setCustomSwatchPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = (input: HTMLInputElement | File) => {
    let file: File | null = null;

    if (input instanceof File) {
      file = input;
    } else {
      file = input.files?.[0] || null;
    }

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.warn("Invalid file type:", file.type);
      alert("Please select a valid image file (JPG, PNG, GIF, WebP, etc.).");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert("File size is too large. Please select an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImage(content);
      setImageLoaded(false); // Reset image loaded state
    };
    reader.readAsDataURL(file);

    // Clear input value if it's an input element
    if (!(input instanceof File)) {
      input.value = "";
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Drag and drop handlers with better event management
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;

    // Only set drag over if we have files
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure we maintain drag over state
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;

    // Only remove drag over when we've left all elements
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset drag state
    dragCounterRef.current = 0;
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleFileUpload(imageFile);
    }
  }, []);

  // Paste handler for Ctrl+V
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image/"));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        handleFileUpload(file);
      }
    }
  }, []);

  // Add paste event listener and global drag prevention
  useEffect(() => {
    document.addEventListener("paste", handlePaste);

    // Prevent default drag behavior on the entire document when no image is loaded
    const preventDragDefaults = (e: DragEvent) => {
      if (!image) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add global drag event listeners when no image is loaded
    if (!image) {
      document.addEventListener("dragover", preventDragDefaults);
      document.addEventListener("drop", preventDragDefaults);
    }

    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("dragover", preventDragDefaults);
      document.removeEventListener("drop", preventDragDefaults);
    };
  }, [handlePaste, image]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className=" w-full mx-auto">
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
                    className="max-w-full max-h-[90%] object-contain"
                    onLoad={handleImageLoad}
                    draggable={false}
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
              <div
                className={`relative min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-300 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 scale-[1.02]"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Upload Icon with Animation */}
                <div
                  className={`mb-6 p-6 rounded-full transition-all duration-300 ${
                    isDragOver ? "bg-blue-100 scale-110" : "bg-gray-100"
                  }`}
                >
                  <ImageIcon
                    className={`size-12 transition-colors duration-300 ${
                      isDragOver ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                </div>

                {/* Main Content */}
                <div className="text-center space-y-4 max-w-sm">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Upload an Image
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    Drag and drop your image here, or click to browse files
                  </p>

                  {/* Upload Button */}
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
                    className="mt-4"
                    size="lg"
                  >
                    <Upload className="size-4 mr-2" />
                    Choose Image
                  </Button>

                  {/* Alternative Methods */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                      Or press Ctrl+V to paste an image
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileImage className="size-3" />
                        JPG, PNG, GIF
                      </span>
                      <span>•</span>
                      <span>Max 10MB</span>
                    </div>
                  </div>
                </div>

                {/* Drag Overlay */}
                {isDragOver && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm border-2 border-blue-400">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
                      <Upload className="size-8 text-blue-500" />
                    </div>
                    <div className="text-blue-600 font-semibold text-xl mb-2">
                      Drop your image here
                    </div>
                    <div className="text-blue-500 text-sm">
                      Release to upload
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {image && (
          <div className="animate-in slide-in-from-right-4 duration-500 ease-out">
            <PaletteCard
              colors={swatchColors}
              onColorChange={handleColorChange}
              onDeleteColor={handleDeletePaletteColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
