import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/utils/categories";
import { sites } from "@/utils/places";
import { Event } from "@/types/event";
import { CollapsibleSection } from "../CollapseSection";

interface EditEventPopupProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: Event) => Promise<void>;
}

export default function EditEventPopup({
  event,
  isOpen,
  onClose,
  onSave,
}: EditEventPopupProps) {
  const [formData, setFormData] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Collapsible sections state
  const [showImage, setShowImage] = useState(false);
  const [showDistances, setShowDistances] = useState(false);
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        title: event.title || "",
        link: event.link || "",
        location: event.location || "",
        distances: event.distances || "",
        category: event.category || categories[0],
        font: event.font || sites[0],
        image: event.image || "",
        description: event.description || "",
        highlighted: event.highlighted ?? false,
        end_date: event.end_date ?? null,
      });
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleChange = (key: keyof Event, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const payload: Event = {
        ...formData,
        date: formData.date.includes("T")
          ? formData.date
          : `${formData.date}T00:00:00Z`,
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reusable collapsible section component


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

        {/* Description */}
        <label className="block mb-2">
          Description:
          <textarea
            className="w-full border rounded p-2"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={isSaving}
            rows={4}
          />
        </label>

        {/* Collapsible Sections */}
        <CollapsibleSection
          title="Link"
          isOpen={showLink}
          onToggle={() => setShowLink(!showLink)}
        >
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            disabled={isSaving}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Distances"
          isOpen={showDistances}
          onToggle={() => setShowDistances(!showDistances)}
        >
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.distances || ""}
            onChange={(e) => handleChange("distances", e.target.value)}
            disabled={isSaving}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Image"
          isOpen={showImage}
          onToggle={() => setShowImage(!showImage)}
        >
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            disabled={isSaving}
          />
        </CollapsibleSection>

        {/* Category & Font */}
        <div className="flex gap-4 mb-2">
          <label className="block w-1/2">
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

          <label className="block w-1/2">
            Font/Site:
            <select
              className="w-full border rounded p-2"
              value={formData.font}
              onChange={(e) => handleChange("font", e.target.value)}
              disabled={isSaving}
            >
              {sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </label>
        </div>

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
