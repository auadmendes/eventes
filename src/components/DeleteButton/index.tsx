"use client";
import { useState } from "react";



interface DeleteButtonProps {
  id: string; // generic id for event or place
  onDelete?: (id: string) => void;
  deleteAction: (id: string) => Promise<void>; // function to call to delete
  label?: string; // optional button label
}

export default function DeleteButton({ id, onDelete, deleteAction, label }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleClick() {
    if (!confirm(`Are you sure you want to delete this ${label || "item"}?`)) return;

    setIsDeleting(true);
    try {
      await deleteAction(id);
      if (onDelete) onDelete(id);
      alert(`${label || "Item"} deleted successfully`);
    } catch (err) {
      console.error(err);
      alert(`Failed to delete ${label || "item"}`);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className="flex items-center justify-center p-2 text-xs text-red-500 hover:text-white hover:bg-red-500 rounded transition"
    >
      {isDeleting ? `Deleting...` : `Delete ${label || ""}`}
    </button>
  );
}
