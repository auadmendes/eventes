"use client";

import { useState } from "react";

import type { NewEvent } from "@/types/event";
import { createEvent } from "@/actions/events";
import Image from "next/image";
import { categories } from "@/utils/categories";
import { sites } from "@/utils/places";

export default function CreateEvent() {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<NewEvent>({
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
    extra: [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createEvent(form);
    alert("Event created successfully");
  }

  function updateField(field: keyof NewEvent, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={form.end_date ?? ""}
          onChange={(e) => updateField("end_date", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Local"
          value={form.location ?? ""}
          onChange={(e) => updateField("location", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="UF"
          value={form.UF}
          onChange={(e) => updateField("UF", e.target.value)}
          className="border p-2 rounded"
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
            <option key={cat} value={cat}>
                {cat}
            </option>
            ))}
        </select>
        </label>

        {/* Criadores */}
        <label className="block mb-2">
        Criador:
        <select
            className="w-full border rounded p-2"
            value={form.font || ""} // assuming organizer is the creator
            onChange={(e) => updateField("font", e.target.value)}
            disabled={isSaving}
        >
            {sites.map((c) => (
            <option key={c} value={c}>
                {c}
            </option>
            ))}
        </select>
        </label>

        <input
            type="text"
            placeholder="Imagem (URL)"
            value={form.image}
            onChange={(e) => updateField("image", e.target.value)}
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
                onError={(e) => {
                    // fallback if invalid URL
                    (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150";
                }}
                />
            ) : (
                <Image
                src="https://via.placeholder.com/150"
                alt="Placeholder"
                width={150}
                height={250}
                className="object-cover rounded border w-full"
                />
            )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Criar evento
        </button>
      </form>
    </div>
  );
}
