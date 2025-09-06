import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/utils/categories";
import { sites } from "@/utils/places";
import { Event, UsefulLink } from "@/types/event";
import { CollapsibleSection } from "../CollapseSection";
import DatePicker from "react-datepicker";

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

  const [showImage, setShowImage] = useState(false);
  const [showDistances, setShowDistances] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        links: event.links || [],
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

  const handleChange = <K extends keyof Event>(key: K, value: Event[K]) => {
    setFormData({ ...formData, [key]: value });
  };


  // --- Links management ---
  const handleLinkChange = (index: number, field: keyof UsefulLink, value: string) => {
    if (!formData) return;
    const updatedLinks = [...(formData.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData({ ...formData, links: updatedLinks });
  };

  const addLink = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      links: [...(formData.links || []), { title: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    if (!formData) return;
    const updatedLinks = [...(formData.links || [])];
    updatedLinks.splice(index, 1);
    setFormData({ ...formData, links: updatedLinks });
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const payload: Event = {
        ...formData,
        date: formData.date.includes("T") ? formData.date : `${formData.date}T00:00:00Z`,
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
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
        <label className="flex flex-col mb-2">
          Date:
          <DatePicker
            selected={
              formData.date
                ? (() => {
                    const [y, m, d] = formData.date.split("T")[0].split("-");
                    return new Date(Number(y), Number(m) - 1, Number(d));
                  })()
                : null
            }
            onChange={(date: Date | null) =>
              handleChange("date", date ? date.toISOString().split("T")[0] : "")
            }
            dateFormat="dd/MM/yyyy"
            className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Selecione a data"
            disabled={isSaving}
          />
        </label>

        {/* End Date */}
        <label className="flex flex-col mb-2">
          End Date:
          <DatePicker
            selected={
              formData.end_date
                ? (() => {
                    const [y, m, d] = formData.end_date.split("T")[0].split("-");
                    return new Date(Number(y), Number(m) - 1, Number(d));
                  })()
                : null
            }
            onChange={(date: Date | null) =>
              handleChange("end_date", date ? date.toISOString().split("T")[0] : "")
            }
            dateFormat="dd/MM/yyyy"
            className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Selecione a data final"
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

        {/* Links Section */}
        <CollapsibleSection
          title="Useful Links"
          isOpen={showLinks}
          onToggle={() => setShowLinks(!showLinks)}
        >
          <div className="space-y-3">
            {(formData.links || []).map((link, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                  className="border p-2 rounded flex-1"
                  disabled={isSaving}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                  className="border p-2 rounded flex-1"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded mt-2 sm:mt-0"
                  disabled={isSaving}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 bg-green-600 text-white rounded"
              disabled={isSaving}
            >
              + Add Link
            </button>
          </div>
        </CollapsibleSection>

        {/* Distances & Image */}
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
                <option key={cat} value={cat}>{cat}</option>
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
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Buttons */}
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
