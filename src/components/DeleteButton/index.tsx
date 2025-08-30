"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/actions/events";

interface DeleteButtonProps {
  eventId: string;
  onDeleted?: () => void; // optional callback after deletion
}

export default function DeleteButton({ eventId, onDeleted }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleClick() {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      if (onDeleted) onDeleted(); // notify parent to remove from list
      alert("Event deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className="flex items-center justify-center p-2"
    >
      {/* <Trash2 size={18} /> */}
      <span className="text-xs">{isDeleting ? "Deleting..." : "Deletar evento"}</span>
    </button>
  );
}
