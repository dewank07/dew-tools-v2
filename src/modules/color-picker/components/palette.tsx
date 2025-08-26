import { Copy, Palette as PaletteIcon, Check, Trash } from "lucide-react";
import { useState } from "react";

interface PaletteProps {
  hex: string;
  index: number;
  onColorChange?: (index: number, newColor: string) => void;
  onDelete?: (index: number) => void;
}

export default function Palette({
  hex,
  index,
  onColorChange,
  onDelete,
}: PaletteProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const getTextColor = (hexColor: string): string => {
    // Remove # if present
    const cleanHex = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Calculate luminance using WCAG formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light backgrounds, white for dark
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const textColor = getTextColor(hex);

  const handleCopy = () => {
    navigator.clipboard.writeText(`#${hex}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (onColorChange) {
      onColorChange(index, newColor);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(index);
    }
  };

  const openColorPicker = () => {
    setShowColorPicker(true);
  };

  return (
    <div
      className="w-full h-28 p-3 rounded-md"
      style={{ backgroundColor: `#${hex}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-end gap-2">
        <PaletteIcon
          className="size-4 cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: textColor }}
          onClick={openColorPicker}
        />
        <Trash
          className="size-4 cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: textColor }}
          onClick={handleDelete}
        />
      </div>

      {/* Hidden color picker input */}
      <input
        type="color"
        value={`#${hex}`}
        onChange={handleColorChange}
        style={{
          display: showColorPicker ? "block" : "none",
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
        ref={(input) => {
          if (showColorPicker && input) {
            input.click();
            setShowColorPicker(false);
          }
        }}
      />
      <div className="flex flex-col items-start group">
        <div className="text-sm font-medium" style={{ color: textColor }}>
          Hex
        </div>
        <div className="uppercase flex items-center gap-2 hover:cursor-pointer">
          <div className="text-sm font-mono" style={{ color: textColor }}>
            #{hex}
          </div>
          {isCopied ? (
            <Check className="size-3" style={{ color: textColor }} />
          ) : (
            <Copy
              className={`size-3 cursor-pointer transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{ color: textColor }}
              onClick={handleCopy}
            />
          )}
        </div>
      </div>
    </div>
  );
}
