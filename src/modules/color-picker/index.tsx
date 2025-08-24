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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaletteCard from "./components/palette-card";

const ColorPicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("image");

  const handleFileUpload = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImage(content);
    };
    reader.readAsDataURL(file);

    input.value = "";
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
                <img
                  src={image}
                  alt="Uploaded image"
                  className="max-w-full max-h-full object-contain mb-5"
                />
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
        <PaletteCard />
        
      </div>
    </div>
  );
};

export default ColorPicker;
