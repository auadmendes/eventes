"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toggleHighlight } from "@/actions/events";


interface HighlightButtonProps {
  eventId: string;
  highlighted: boolean;
}

export default function HighlightButton({ eventId, highlighted }: HighlightButtonProps) {
  const [isHighlighted, setIsHighlighted] = useState(highlighted);

  async function handleClick() {
    const updated = await toggleHighlight(eventId); // call server action
    setIsHighlighted(updated?.highlighted ?? false);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 transition ${
        isHighlighted ? "text-yellow-500" : "text-gray-600 hover:text-yellow-400"
      }`}
    >
      <Star size={18} fill={isHighlighted ? "currentColor" : "none"} />
      {/* <span className="text-xs">Highlight</span> */}
    </button>
  );
}
