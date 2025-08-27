"use client";

import { Event } from "../envents/EventCard";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/utils/categories";

interface EditEventPopupProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: Event) => Promise<void>; // make it async
}

export default function EditEventPopup({ event, isOpen, onClose, onSave }: EditEventPopupProps) {
  const [formData, setFormData] = useState<Event | null>(event);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleChange = (key: keyof Event, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await onSave(formData); // wait for server action
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          disabled={isSaving}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Edit Event</h2>

        {/* Title */}
        <label className="block mb-2">
          Title:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Date */}
        <label className="block mb-2">
          Date:
          <input
            type="date"
            className="w-full border rounded p-2"
            value={formData.date.split("T")[0]}
            onChange={(e) => handleChange("date", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Location */}
        <label className="block mb-2">
          Location:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Distances */}
        <label className="block mb-2">
          Distances:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.distances || ""}
            onChange={(e) => handleChange("distances", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Category */}
        <label className="block mb-2">
          Category:
          <select
            className="w-full border rounded p-2"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            disabled={isSaving}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        {/* Font/Site */}
        <label className="block mb-2">
          Font/Site:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.font}
            onChange={(e) => handleChange("font", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Image URL */}
        <label className="block mb-2">
          Image URL:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            disabled={isSaving}
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            disabled={isSaving}
          >
            {isSaving && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
