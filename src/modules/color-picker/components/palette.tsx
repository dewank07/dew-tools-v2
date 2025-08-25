import { Copy, Palette as PaletteIcon, Check, Trash } from "lucide-react";
import { useState } from "react";

interface PaletteProps {
  hex: string;
  onDelete?: () => void;
}

export default function Palette({ hex, onDelete }: PaletteProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`#${hex}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <div
      className="w-full h-28 p-3 rounded-md"
      style={{ backgroundColor: `#${hex}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-end gap-2">
        <PaletteIcon className="size-4 text-white" />
        <Trash
          className="size-4 text-white cursor-pointer hover:text-red-200 transition-colors"
          onClick={onDelete}
        />
      </div>
      <div className="flex flex-col items-start group">
        <div className="">Hex</div>
        <div className="uppercase flex items-center gap-2 hover:cursor-pointer">
          <div className="text-white">#{hex}</div>
          {isCopied ? (
            <Check className="size-3 text-white" />
          ) : (
            <Copy
              className={`size-3 text-white cursor-pointer transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              onClick={handleCopy}
            />
          )}
        </div>
      </div>
    </div>
  );
}
