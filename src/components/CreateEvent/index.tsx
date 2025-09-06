"use client";

import { useState } from "react";
import type { NewEvent, UsefulLink } from "@/types/event";
import { createEvent } from "@/actions/events";
import Image from "next/image";
import { categories } from "@/utils/categories";
import { sites } from "@/utils/places";

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import DatePicker from "react-date-picker";

export default function CreateEvent() {
  const [isSaving, setIsSaving] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const [form, setForm] = useState<NewEvent>({
    link: "",
    title: "",
    date: "",
    end_date: null,
    UF: "ES",
    category: "",
    font: "",
    image: "",
    location: "",
    distances: "",
    extra: [],
    links: [], // ✅ initialize links
  });

  function formatLocalDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createEvent(form);
      // Clear all fields
      setForm({
        link: "",
        title: "",
        date: "",
        end_date: null,
        UF: "",
        category: "",
        font: "",
        image: "",
        location: "",
        distances: "",
        description: "",
        extra: [],
        links: [],
      });
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(field: keyof NewEvent, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLinkChange(index: number, field: keyof UsefulLink, value: string) {
    setForm((prev) => {
      const updatedLinks = [...(prev.links || [])];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return { ...prev, links: updatedLinks };
    });
  }

  function addLink() {
    setForm((prev) => ({
      ...prev,
      links: [...(prev.links || []), { title: "", url: "" }],
    }));
  }

  function removeLink(index: number) {
    setForm((prev) => {
      const updatedLinks = [...(prev.links || [])];
      updatedLinks.splice(index, 1);
      return { ...prev, links: updatedLinks };
    });
  }

  const selectedDate = form.date ? new Date(form.date + 'T00:00') : null;
  const selectedEndDate = form.end_date ? new Date(form.end_date + 'T00:00') : null;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Criar evento</h1>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl">
        <input
          type="text"
          placeholder="Título"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="border p-2 rounded"
          disabled={isSaving}
        />

        {/* <div className="flex gap-2"> */}
          <label htmlFor="">
            Início
            <DatePicker
              value={selectedDate}
              onChange={(value) => {
                const date: Date | null = Array.isArray(value) ? value[0] ?? null : value;
                if (date) updateField("date", formatLocalDate(date));
                else updateField("date", "");
              }}
              disabled={isSaving}
              format="dd/MM/yyyy"
              dayPlaceholder="dd/mm/yyyy"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label htmlFor="">
            Fim
            <DatePicker
              value={selectedEndDate}
              onChange={(value) => {
                const date: Date | null = Array.isArray(value) ? value[0] ?? null : value;
                if (date) {
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, "0");
                  const dd = String(date.getDate()).padStart(2, "0");
                  updateField("end_date", `${yyyy}-${mm}-${dd}`);
                } else {
                  updateField("end_date", "");
                }
              }}
              disabled={isSaving}
              format="dd/MM/yyyy"
              dayPlaceholder="dd/mm/yyyy"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        {/* </div> */}

        <input
          type="text"
          placeholder="Local"
          value={form.location ?? ""}
          onChange={(e) => updateField("location", e.target.value)}
          disabled={isSaving}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Link"
          value={form.link}
          onChange={(e) => updateField("link", e.target.value)}
          disabled={isSaving}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="UF"
          value={form.UF}
          onChange={(e) => updateField("UF", e.target.value)}
          disabled={isSaving}
          className="border p-2 rounded"
        />

        <textarea
          className="w-full border rounded p-2"
          value={form.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          disabled={isSaving}
          rows={4}
        />

        <label className="block mb-2">
          Category:
          <select
            className="w-full border rounded p-2"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            disabled={isSaving}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Criador:
          <select
            className="w-full border rounded p-2"
            value={form.font || ""}
            onChange={(e) => updateField("font", e.target.value)}
            disabled={isSaving}
          >
            {sites.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <input
          type="text"
          placeholder="Imagem (URL)"
          value={form.image}
          onChange={(e) => updateField("image", e.target.value)}
          disabled={isSaving}
          className="border p-2 rounded"
        />

        <div className="mt-2 w-full">
          {form.image ? (
            <Image
              src={form.image}
              alt="Preview"
              width={450}
              height={250}
              className="object-cover rounded border w-full"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150"; }}
            />
          ) : (
            <Image
              src="https://placehold.co/600x400/png"
              alt="Placeholder"
              width={150}
              height={250}
              className="object-cover rounded border w-full"
            />
          )}
        </div>

        {/* --- Useful Links section --- */}
        <div className="border p-3 rounded">
          <button
            type="button"
            onClick={() => setShowLinks((s) => !s)}
            className="text-blue-600 font-semibold mb-2"
          >
            {showLinks ? "Hide Links" : "Add Useful Links"}
          </button>

          {showLinks && (
            <div className="space-y-3">
              {(form.links || []).map((link, index) => (
                <div key={index} className="flex flex-col w-full sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    placeholder="Title"
                    value={link.title}
                    onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded mt-2 sm:mt-0 w-full md:w-14 h-10"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                + Add Link
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          disabled={isSaving}
        >
          {isSaving && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          Criar evento
        </button>
      </form>
    </div>
  );
}
