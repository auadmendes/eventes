"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { createPlace, NewPlace } from "@/actions/places";
import { categories } from "@/utils/place_categories";
import Image from "next/image";
import { getCities, getNeighborhoods } from "@/actions/city";
import { City, Neighborhood } from "@/types/city";

export default function CreatePlaceComponent() {
  const { register, handleSubmit, control, reset, watch, setValue } = useForm<NewPlace>({
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

  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  const imageUrl = watch("image");

  // Load cities on mount
  useEffect(() => {
    (async () => {
      const citiesData = await getCities();
      setCities(citiesData);
    })();
  }, []);

  // Load neighborhoods when city changes
  useEffect(() => {
    if (!selectedCity) {
      setNeighborhoods([]);
      setSelectedNeighborhood(null);
      setValue("neighborhood", "");
      return;
    }

    (async () => {
      try {
        const data = await getNeighborhoods(selectedCity);
        setNeighborhoods(data);
        setSelectedNeighborhood(null);
        setValue("neighborhood", "");
      } catch (err) {
        console.error("Erro ao carregar bairros:", err);
        setNeighborhoods([]);
        setSelectedNeighborhood(null);
        setValue("neighborhood", "");
      }
    })();
  }, [selectedCity, setValue]);

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
  const removeLink = (index: number) => setLinks((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (data: NewPlace) => {
    if (!selectedCity || !selectedNeighborhood) {
      alert("Selecione uma cidade e um bairro!");
      return;
    }

    const cityObj = cities.find(c => c.id === selectedCity);
    const neighborhoodObj = neighborhoods.find(n => n.id === selectedNeighborhood);

    try {
      setLoading(true);
      setSuccess("");
      await createPlace({
        ...data,
        links,
        city: cityObj ? cityObj.name : "",
        neighborhood: neighborhoodObj ? neighborhoodObj.name : "",
      });
      setSuccess("Local criado com sucesso!");
      reset();
      setLinks([]);
      setSelectedCity(null);
      setSelectedNeighborhood(null);
      setNeighborhoods([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar o local.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <form className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold mb-4">Criar Local</h2>

      {/* --- Basic Inputs --- */}
      <input {...register("place_name", { required: true })} placeholder="Nome do Local" className="w-full border rounded px-3 py-2" />
      <input {...register("short_description", { required: true })} placeholder="Descrição Curta" className="w-full border rounded px-3 py-2" />
      <textarea {...register("description")} placeholder="Descrição Completa" className="w-full border rounded px-3 py-2" />

      {/* --- Category --- */}
      <Controller
        name="category"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            options={categories.map((c) => ({ value: c, label: c }))}
            value={mapValueToOption(field.value)}
            onChange={(val: SingleValue<{ value: string; label: string }>) => field.onChange(val?.value ?? "")}
            placeholder="Categoria"
          />
        )}
      />

{/* --- City --- */}
<label>
  Cidade
  <select
    value={selectedCity || ""}
    onChange={async (e) => {
      const cityId = e.target.value;
      setSelectedCity(cityId || null);

      // Fetch neighborhoods for this city ID
      if (cityId) {
        try {
          const data = await getNeighborhoods(cityId);
          setNeighborhoods(data);
          setSelectedNeighborhood(""); // reset neighborhood when city changes
        } catch (err) {
          console.error("Erro ao carregar bairros:", err);
          setNeighborhoods([]);
          setSelectedNeighborhood("");
        }
      } else {
        setNeighborhoods([]);
        setSelectedNeighborhood("");
      }
    }}
    className="border p-2 rounded w-full"
  >
    <option value="">Selecione a cidade</option>
    {cities.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ))}
  </select>
</label>

{/* --- Neighborhood --- */}
<label>
  Bairro
  <select
    value={selectedNeighborhood || ""}
    onChange={(e) => setSelectedNeighborhood(e.target.value || "")} // store ID
    disabled={!selectedCity}
    className="border p-2 rounded w-full"
  >
    <option value="">Selecione o bairro</option>
    {neighborhoods.map((n) => (
      <option key={n.id} value={n.id}>
        {n.name}
      </option>
    ))}
  </select>
</label>



      {/* --- Address & Location --- */}
      <input {...register("address")} placeholder="Endereço" className="w-full border rounded px-3 py-2" />
      <input {...register("location")} placeholder="Localização (lat,lng)" className="w-full border rounded px-3 py-2" />

      {/* --- Image --- */}
      <input {...register("image")} placeholder="URL da Imagem" className="w-full border rounded px-3 py-2" />
      <div className="mt-2 w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt="Preview" width={450} height={250} className="object-cover rounded border w-full" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150"; }} />
        ) : (
          <Image src="https://placehold.co/600x400/png" alt="Placeholder" width={450} height={250} className="object-cover rounded border w-full" />
        )}
      </div>

      {/* --- Links --- */}
      <div className="border p-3 rounded space-y-2">
        <button type="button" onClick={addLink} className="px-3 py-1 bg-green-600 text-white rounded mb-2">+ Adicionar Link</button>
        {links.map((link, idx) => (
          <div key={idx} className="flex flex-col w-full sm:flex-row gap-2 items-start sm:items-center">
            <input type="text" placeholder="Título" value={link.title} onChange={(e) => handleLinkChange(idx, "title", e.target.value)} className="border p-2 rounded w-full" />
            <input type="url" placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(idx, "url", e.target.value)} className="border p-2 rounded w-full" />
            <button type="button" onClick={() => removeLink(idx)} className="px-2 py-1 bg-red-500 text-white rounded mt-2 sm:mt-0 w-full md:w-14 h-10">✕</button>
          </div>
        ))}
      </div>

      {/* --- Accessibility / Ticket / Pet --- */}
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

      {/* --- Tags --- */}
      <input {...register("tags", { setValueAs: (v: string) => v.split(",").map((t) => t.trim()) })} placeholder="Tags (separadas por vírgula)" className="w-full border rounded px-3 py-2" />

      {/* --- Submit --- */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
        {loading ? "Salvando..." : "Criar Local"}
      </button>

      {success && <p className="text-green-600 mt-2">{success}</p>}
    </form>
  );
}
