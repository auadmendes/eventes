import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = React.memo(function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="mb-2 border rounded">
      <button
        type="button"
        className="w-full flex justify-between items-center p-2 font-medium"
        onClick={onToggle}
      >
        {title} {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="p-2 border-t">{children}</div>}
    </div>
  );
});
