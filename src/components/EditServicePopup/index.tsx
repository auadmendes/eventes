"use client";

import { useState, useEffect } from "react";
import { X, MessageCircleWarning } from "lucide-react";
import type { Service } from "@/types/services";
import { CollapsibleSection } from "../CollapseSection";

interface EditServicePopupProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedService: Service) => Promise<void>;
  onDelete?: (serviceId: string) => Promise<void>;
}

export default function EditServicePopup({
  service,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EditServicePopupProps) {
  const [formData, setFormData] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  useEffect(() => {
    if (isOpen && service) {
      setFormData({ ...service });
    }
  }, [isOpen, service]);

  if (!isOpen || !formData) return null;

  const handleChange = <K extends keyof Service>(key: K, value: Service[K]) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleLinkChange = (index: number, field: "title" | "url", value: string) => {
    if (!formData) return;
    const updatedLinks = [...(formData.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData({ ...formData, links: updatedLinks });
  };

  const addLink = () => {
    if (!formData) return;
    setFormData({ ...formData, links: [...(formData.links || []), { title: "", url: "" }] });
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
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData || !onDelete) return;
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsSaving(true);
    try {
      await onDelete(formData.id);
      onClose();
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-auto p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          disabled={isSaving}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Edit Service</h2>

        <div className="flex items-center gap-2 rounded-md p-3 bg-orange-200/30 border border-orange-400 mb-4">
          <MessageCircleWarning />
          <span>
            Ao editar seu anúncio a validação pelo time <strong>Pocando</strong> será necessário novamente!
          </span>
        </div>

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

        {/* Description */}
        <label className="block mb-2">
          Description:
          <textarea
            className="w-full border rounded p-2"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={isSaving}
            rows={4}
          />
        </label>

        {/* Collapsible: Location */}
        <CollapsibleSection
          title="Location"
          isOpen={showLocation}
          onToggle={() => setShowLocation(!showLocation)}
        >
          <label className="block mb-2">
            City:
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              disabled={isSaving}
            />
          </label>

          <label className="block mb-2">
            Neighborhood:
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.neighborhood || ""}
              onChange={(e) => handleChange("neighborhood", e.target.value)}
              disabled={isSaving}
            />
          </label>
        </CollapsibleSection>

        {/* Collapsible: Social Media */}
        <CollapsibleSection
          title="Social Media"
          isOpen={showSocial}
          onToggle={() => setShowSocial(!showSocial)}
        >
          <label className="block mb-2">
            WhatsApp:
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.whatsapp || ""}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              disabled={isSaving}
            />
          </label>

          <label className="block mb-2">
            Facebook:
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.facebook || ""}
              onChange={(e) => handleChange("facebook", e.target.value)}
              disabled={isSaving}
            />
          </label>

          <label className="block mb-2">
            Instagram:
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.instagram || ""}
              onChange={(e) => handleChange("instagram", e.target.value)}
              disabled={isSaving}
            />
          </label>
        </CollapsibleSection>

        {/* Phone & ShowPhone */}
        <label className="block mb-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showPhone || false}
            onChange={(e) => handleChange("showPhone", e.target.checked)}
            disabled={isSaving}
          />
          Show Phone
        </label>
        {formData.showPhone && (
          <input
            type="text"
            className="w-full border rounded p-2 mb-2"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={isSaving}
            placeholder="Phone number"
          />
        )}

        {/* Links */}
        <CollapsibleSection
          title="Links"
          isOpen={showLinks}
          onToggle={() => setShowLinks(!showLinks)}
        >
          <div className="space-y-2">
            {(formData.links || []).map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  className="border p-2 rounded w-full"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                  disabled={isSaving}
                />
                <input
                  type="url"
                  placeholder="URL"
                  className="border p-2 rounded w-full"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  disabled={isSaving}
                >
                  Remove
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

        {/* Image */}
        <label className="block mb-2">
          Image URL:
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            disabled={isSaving}
          />
        </label>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSaving}
          >
            Cancel
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isSaving}
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isSaving ? "Saving..." : "Solicitar validação"}
          </button>
        </div>
      </div>
    </div>
  );
}
