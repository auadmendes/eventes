"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/utils/categories";
import { Place } from "@/types/place";
import { CollapsibleSection } from "../CollapseSection";
import { cities, neighborhoods } from "@/utils/place_categories";

interface EditPlacePopupProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlace: Place) => Promise<void>;
}

export default function EditPlacePopup({
  place,
  isOpen,
  onClose,
  onSave,
}: EditPlacePopupProps) {
  const [formData, setFormData] = useState<Place | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Collapsible sections
  const [showImage, setShowImage] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showTags, setShowTags] = useState(false);

  //const [initialPlaceId, setInitialPlaceId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && place) {
      setFormData({
        ...place,
        place_name: place.place_name || "",
        short_description: place.short_description || "",
        description: place.description || "",
        link: place.link || "",
        address: place.address || "",
        city: place.city || "",
        neighborhood: place.neighborhood || "",
        category: place.category || categories[0],
        image: place.image || "",
        tags: place.tags || [],
        wheelchair_accessible: place.wheelchair_accessible ?? false,
        pet_friendly: place.pet_friendly ?? false,
        ticket_required: place.ticket_required ?? false,
      });
    }
  }, [isOpen, place]);


  if (!isOpen || !formData) return null;

  const handleChange = (key: keyof Place, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  // const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const tagsArray = e.target.value.split(",").map(t => t.trim());
  //   setFormData(prev => prev ? { ...prev, tags: tagsArray } : null);
  // };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose(); // close popup after saving
    } catch (error) {
      console.error("Error saving place:", error);
    } finally {
      setIsSaving(false);
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          disabled={isSaving}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Edit Place</h2>

        {/* Place name */}
        <label className="block mb-2">
          Name:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.place_name}
            onChange={(e) => handleChange("place_name", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* City Select */}
        <label className="block mb-2">
          City:
          <select
            className="w-full border rounded p-2"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={isSaving}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Neighborhood Select */}
        <label className="block mb-2">
          Neighborhood:
          <select
            className="w-full border rounded p-2"
            value={formData.neighborhood || ""}
            onChange={(e) => handleChange("neighborhood", e.target.value)}
            disabled={isSaving}
          >
            <option value="">Select neighborhood</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>


        

        {/* Address */}
        <label className="block mb-2">
          Address:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Collapsible: Description */}
        <CollapsibleSection
          title="Description"
          isOpen={showDescription}
          onToggle={() => setShowDescription(!showDescription)}
        >
          <textarea
            className="w-full border rounded p-2"
            value={formData.short_description || ""}
            onChange={(e) => handleChange("short_description", e.target.value)}
            disabled={isSaving}
            rows={2}
            placeholder="Short description"
          />
          <textarea
            className="w-full border rounded p-2 mt-2"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={isSaving}
            rows={4}
            placeholder="Full description"
          />
        </CollapsibleSection>

        {/* Collapsible: Image */}
        <CollapsibleSection
          title="Image"
          isOpen={showImage}
          onToggle={() => setShowImage(!showImage)}
        >
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            disabled={isSaving}
            placeholder="Image URL"
          />
        </CollapsibleSection>

        {/* Collapsible: Link */}
        <CollapsibleSection
          title="Link"
          isOpen={showLink}
          onToggle={() => setShowLink(!showLink)}
        >
          <input
            type="url"
            className="w-full border rounded p-2"
            value={formData.link || ""}
            onChange={(e) => handleChange("link", e.target.value)}
            disabled={isSaving}
            placeholder="Website or booking link"
          />
        </CollapsibleSection>

        {/* Collapsible: Tags */}
        <CollapsibleSection
          title="Tags"
          isOpen={showTags}
          onToggle={() => setShowTags(!showTags)}
        >
        <input
          type="text"
          className="w-full border rounded p-2"
          value={formData.tags?.join(", ") || ""}
          onChange={(e) =>
            setFormData(prev => prev ? { ...prev, tags: e.target.value.split(",").map(t => t.trim()) } : null)
          }
          placeholder="tag1, tag2, tag3"
        />
        </CollapsibleSection>

        {/* Checkboxes */}
        <div className="flex flex-col gap-2 my-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.wheelchair_accessible}
              onChange={(e) =>
                handleChange("wheelchair_accessible", e.target.checked)
              }
              disabled={isSaving}
            />
            Wheelchair Accessible
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.pet_friendly}
              onChange={(e) =>
                handleChange("pet_friendly", e.target.checked)
              }
              disabled={isSaving}
            />
            Pet Friendly
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.ticket_required}
              onChange={(e) =>
                handleChange("ticket_required", e.target.checked)
              }
              disabled={isSaving}
            />
            Ticket Required
          </label>
        </div>

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full bg-blue-600 text-white rounded-lg py-2 mt-4 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
