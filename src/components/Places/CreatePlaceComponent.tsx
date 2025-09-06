"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { createPlace, NewPlace } from "@/actions/places";
import { categories, cities, neighborhoods } from "@/utils/place_categories";
import Image from "next/image";

export default function CreatePlaceComponent() {
  const { register, handleSubmit, control, reset, watch } = useForm<NewPlace>({
    defaultValues: {
      ticket_required: false,
      wheelchair_accessible: false,
      pet_friendly: false,
      published: true,
      category: "",
      city: "",
      neighborhood: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const imageUrl = watch("image");

  const onSubmit = async (data: NewPlace) => {
    try {
      setLoading(true);
      setSuccess("");
      await createPlace({ ...data, links }); // include links in payload
      setSuccess("Local criado com sucesso!");
      reset();
      setLinks([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar o local.");
    } finally {
      setLoading(false);
    }
  };

  const mapValueToOption = (value: string | undefined) =>
    value ? { value, label: value } : null;

  const handleLinkChange = (index: number, field: "title" | "url", value: string) => {
    setLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addLink = () => setLinks((prev) => [...prev, { title: "", url: "" }]);
  const removeLink = (index: number) =>
    setLinks((prev) => prev.filter((_, i) => i !== index));

  return (
    <form
      className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-semibold mb-4">Criar Local</h2>

      {/* --- Existing Inputs --- */}
      <input
        {...register("place_name", { required: true })}
        placeholder="Nome do Local"
        className="w-full border rounded px-3 py-2"
      />
      <input
        {...register("short_description", { required: true })}
        placeholder="Descrição Curta"
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        {...register("description")}
        placeholder="Descrição Completa"
        className="w-full border rounded px-3 py-2"
      />

      {/* Category, City, Neighborhood */}
      <Controller
        name="category"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            options={categories.map((c) => ({ value: c, label: c }))}
            value={mapValueToOption(field.value)}
            onChange={(val: SingleValue<{ value: string; label: string }>) =>
              field.onChange(val?.value ?? "")
            }
            placeholder="Categoria"
          />
        )}
      />
      <Controller
        name="city"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            options={cities.map((c) => ({ value: c, label: c }))}
            value={mapValueToOption(field.value)}
            onChange={(val: SingleValue<{ value: string; label: string }>) =>
              field.onChange(val?.value ?? "")
            }
            placeholder="Cidade"
          />
        )}
      />
      <Controller
        name="neighborhood"
        control={control}
        render={({ field }) => (
          <Select
            options={neighborhoods.map((n) => ({ value: n, label: n }))}
            value={mapValueToOption(field.value)}
            onChange={(val: SingleValue<{ value: string; label: string }>) =>
              field.onChange(val?.value ?? "")
            }
            placeholder="Bairro"
          />
        )}
      />

      {/* Address, Location, Image */}
      <input
        {...register("address")}
        placeholder="Endereço"
        className="w-full border rounded px-3 py-2"
      />
      <input
        {...register("location")}
        placeholder="Localização (lat,lng)"
        className="w-full border rounded px-3 py-2"
      />
      <div>
        <input
          {...register("image")}
          placeholder="URL da Imagem"
          className="w-full border rounded px-3 py-2"
        />
        <div className="mt-2 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Preview"
              width={450}
              height={250}
              className="object-cover rounded border w-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          ) : (
            <Image
              src="https://placehold.co/600x400/png"
              alt="Placeholder"
              width={450}
              height={250}
              className="object-cover rounded border w-full"
            />
          )}
        </div>
      </div>

      {/* --- Links Section --- */}
      <div className="border p-3 rounded space-y-2">
        <button
          type="button"
          onClick={addLink}
          className="px-3 py-1 bg-green-600 text-white rounded mb-2"
        >
          + Adicionar Link
        </button>

        {links.map((link, idx) => (
          <div key={idx} className="flex flex-col w-full sm:flex-row gap-2 items-start sm:items-center">
            <input
              type="text"
              placeholder="Título"
              value={link.title}
              onChange={(e) => handleLinkChange(idx, "title", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => removeLink(idx)}
              className="px-2 py-1 bg-red-500 text-white rounded mt-2 sm:mt-0 w-full md:w-14 h-10"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Ticket / Accessibility / Pet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("ticket_required")} />
          Entrada com ticket?
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("wheelchair_accessible")} />
          Acessível para cadeirantes
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("pet_friendly")} />
          Pet Friendly
        </label>
      </div>

      <input
        {...register("tags", {
          setValueAs: (v: string) => v.split(",").map((t) => t.trim()),
        })}
        placeholder="Tags (separadas por vírgula)"
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Criar Local"}
      </button>

      {success && <p className="text-green-600 mt-2">{success}</p>}
    </form>
  );
}
