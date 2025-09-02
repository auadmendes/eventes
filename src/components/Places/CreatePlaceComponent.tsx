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
  const imageUrl = watch("image");

  const onSubmit = async (data: NewPlace) => {
    try {
      setLoading(true);
      setSuccess("");
      await createPlace(data);
      setSuccess("Local criado com sucesso!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar o local.");
    } finally {
      setLoading(false);
    }
  };

  const mapValueToOption = (value: string | undefined) =>
    value ? { value, label: value } : null;

  return (
    <form
      className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-semibold mb-4">Criar Local</h2>

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

      {/* Category Select */}
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

      {/* City Select */}
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

      {/* Neighborhood Select */}
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




      <input
        {...register("link")}
        placeholder="Link"
        className="w-full border rounded px-3 py-2"
      />

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
