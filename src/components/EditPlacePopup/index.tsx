"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/utils/categories";
import { Place } from "@/types/place";
import { CollapsibleSection } from "../CollapseSection";
import { City, Neighborhood } from "@/types/city";
import { getCities, getNeighborhoods } from "@/actions/city";

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
  const [showLinks, setShowLinks] = useState(false);
  const [cityNeighborhoods, setCityNeighborhoods] = useState(false);

  // Cities / neighborhoods
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  // Sync formData when popup opens
  useEffect(() => {
    if (isOpen && place) {
      setFormData({
        ...place,
        place_name: place.place_name || "",
        short_description: place.short_description || "",
        description: place.description || "",
        link: place.link || "",
        links: place.links || [],
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

  // Load all cities once
  useEffect(() => {
    (async () => {
      const citiesData = await getCities();
      setCities(citiesData);
    })();
  }, []);

  // When editing, pre-fill city + neighborhood
  useEffect(() => {
    if (place) {
      setSelectedCity(place.city || null);
      setSelectedNeighborhood(place.neighborhood || null);
    }
  }, [place]);

  // Load neighborhoods when city changes
  useEffect(() => {
    if (!selectedCity) {
      setNeighborhoods([]);
      setSelectedNeighborhood(null);
      return;
    }
    (async () => {
      const data = await getNeighborhoods(selectedCity);
      setNeighborhoods(data);
    })();
  }, [selectedCity]);

  // ---------- handlers ----------
  const handleChange = (key: keyof Place, value: Place[keyof Place]) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving place:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkChange = (index: number, field: "title" | "url", value: string) => {
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

  // ---------- render ----------
  if (!isOpen || !formData) return null;

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

        {/* City & Neighborhood */}
        <CollapsibleSection
          title="Cidade e Bairro"
          isOpen={cityNeighborhoods}
          onToggle={() => setCityNeighborhoods(!cityNeighborhoods)}
        >
          {/* City Select */}
          <select
            className="w-full border rounded p-2"
            value={selectedCity || ""}
            onChange={(e) => {
              const city = cities.find((c) => c.id === e.target.value);
              setSelectedCity(city ? city.id : null);
              handleChange("city", city ? city.name : ""); // ✅ save name/title, not ID
            }}
            disabled={isSaving}
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Neighborhood Select */}
          <select
            className="w-full border rounded p-2"
            value={selectedNeighborhood || ""}
            onChange={(e) => {
              const neighborhood = neighborhoods.find((n) => n.id === e.target.value);
              setSelectedNeighborhood(neighborhood ? neighborhood.id : null);
              handleChange("neighborhood", neighborhood ? neighborhood.name : ""); // ✅ save name/title
            }}
            disabled={isSaving || !selectedCity}
          >
            <option value="">Select neighborhood</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </CollapsibleSection>

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

        {/* Description */}
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

        {/* Useful Links */}
        <CollapsibleSection
          title="Useful Links"
          isOpen={showLinks}
          onToggle={() => setShowLinks(!showLinks)}
        >
          <div className="space-y-4">
            {(formData.links || []).map((link, index) => (
              <div key={index} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                  className="border p-2 rounded w-full"
                  disabled={isSaving}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                  className="border p-2 rounded w-full"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded w-full"
                  disabled={isSaving}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 bg-green-600 text-white rounded w-full"
              disabled={isSaving}
            >
              + Add Link
            </button>
          </div>
        </CollapsibleSection>

        {/* Image */}
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

        {/* Link */}
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

        {/* Tags */}
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
              setFormData((prev) =>
                prev ? { ...prev, tags: e.target.value.split(",").map((t) => t.trim()) } : null
              )
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
              onChange={(e) => handleChange("wheelchair_accessible", e.target.checked)}
              disabled={isSaving}
            />
            Wheelchair Accessible
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.pet_friendly}
              onChange={(e) => handleChange("pet_friendly", e.target.checked)}
              disabled={isSaving}
            />
            Pet Friendly
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.ticket_required}
              onChange={(e) => handleChange("ticket_required", e.target.checked)}
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
