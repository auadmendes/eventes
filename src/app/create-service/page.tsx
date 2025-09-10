"use client";

import { Header } from "@/components/Header";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import type { CreateServiceInput, UsefulLink } from "@/types/services";
import { createService } from "@/actions/services"; // Your local function
import { getProfile } from "@/actions/users"; // Your local function
import { servicescategories } from "@/utils/services";

export default function CreateServicePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<{ id: string; name: string; email: string; image: string } | null>(null);
  const [form, setForm] = useState<CreateServiceInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLinks, setShowLinks] = useState(false);
  const [showImages, setShowImages] = useState(false);

  // Load profile
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }

    (async () => {
      const p = await getProfile(user.id);
      if (!p) {
        router.push("/Profile");
        return;
      }

      setProfile({
        id: p.id,
        name: p.name || user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        image: p.image || user.imageUrl || "",
      });

      setForm({
        userId: p.id,
        city: "",
        userName: p.name || user.fullName || "",
        neighborhood: "",
        title: "",
        description: "",
        services: [],
        mainService: "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "",
        showPhone: false,
        links: [],
        image: p.image || user.imageUrl || "",
        images: [],
        instagram: "",
        facebook: "",
        website: "",
        whatsapp: "",
      });

      setProfileLoaded(true);
    })();
  }, [isLoaded, user, router]);

  const updateField = <K extends keyof CreateServiceInput>(field: K, value: CreateServiceInput[K]) => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, [field]: value }));
  };

  // Links
  const addLink = () => updateField("links", [...(form?.links || []), { title: "", url: "" }]);
  const removeLink = (index: number) => {
    const updated = [...(form?.links || [])];
    updated.splice(index, 1);
    updateField("links", updated);
  };

  const handleLinkChange = (index: number, field: keyof UsefulLink, value: string) => {
    const updated = [...(form?.links || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("links", updated);
  };

  // Additional images
  const addImage = () => {
    if (!form) return;
    if ((form.images || []).length >= 3) return;
    updateField("images", [...(form.images || []), ""]);
  };

  const removeImage = (index: number) => {
    const updated = [...(form?.images || [])];
    updated.splice(index, 1);
    updateField("images", updated);
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...(form?.images || [])];
    updated[index] = value;
    updateField("images", updated);
  };

  // Social links
  const handleSocialChange = (field: "instagram" | "facebook" | "website" | "whatsapp", value: string) => {
    updateField(field, value);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (!form.services[0]) {
      setMessage("❌ Por favor, selecione o serviço principal.");
      return;
    }

    setLoading(true);

    try {
      const preparedForm: CreateServiceInput = {
        ...form,
        mainService: form.services[0],
        services: [
          form.services[0],
          ...(form.services.slice(1).filter(s => s && s !== form.services[0]))
        ],
        images: form.images || [],
        links: form.links || [],
        instagram: form.instagram || "",
        facebook: form.facebook || "",
        website: form.website || "",
        whatsapp: form.whatsapp || "",
      };

      await createService(preparedForm);

      setMessage("✅ Serviço criado com sucesso!");

      // Reset form but keep user info
      setForm({
        userId: profile!.id,
        userName: profile!.name || user?.fullName || "",
        city: "",
        neighborhood: "",
        title: "",
        description: "",
        services: [],
        mainService: "",
        email: profile!.email,
        phone: "",
        showPhone: false,
        links: [],
        image: profile!.image || "",
        images: [],
        instagram: "",
        facebook: "",
        website: "",
        whatsapp: "",
      });

    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao criar serviço.");
    } finally {
      setLoading(false);
    }
  };

  if (!profileLoaded || !form) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row mt-16 justify-center">
        <main className="p-6 mb-16 md:mb-0 w-full max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Cadastrar Serviço</h1>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Prefilled Name & Email */}
            <input type="text" placeholder="Nome" value={profile!.name} disabled className="w-full border p-2 rounded bg-gray-100" />
            <input type="text" placeholder="Email" value={profile!.email} disabled className="w-full border p-2 rounded bg-gray-100" />

            {/* Title */}
            <input type="text" placeholder="Título do serviço" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="w-full border p-2 rounded" required />

            {/* Main Service */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Serviço principal</label>
              <select value={form.services[0] || ""} onChange={(e) => updateField("services", [e.target.value, ...form.services.slice(1)])} className="w-full border p-2 rounded" required>
                <option value="">Selecione</option>
                {servicescategories.map((service: string) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Services */}
            <input type="text" placeholder="Serviços adicionais (separados por vírgula)" value={form.services.slice(1).join(", ")} onChange={(e) => updateField("services", [form.services[0], ...e.target.value.split(",").map(s => s.trim())])} className="w-full border p-2 rounded" />

            {/* Description */}
            <textarea placeholder="Descrição" value={form.description} onChange={(e) => updateField("description", e.target.value)} className="w-full border p-2 rounded" rows={4} />

            {/* Main Image */}
            <input type="url" placeholder="URL da imagem principal" value={form.image} onChange={(e) => updateField("image", e.target.value)} className="w-full border p-2 rounded" />
            {form.image && (<div className="max-w-sm mb-2"><Image src={form.image} alt="Imagem principal" width={200} height={200} className="rounded border" /></div>)}

            {/* Additional Images */}
            <div className="border p-3 rounded">
              <button type="button" onClick={() => setShowImages((s) => !s)} className="text-blue-600 font-semibold mb-2">
                {showImages ? "Ocultar Imagens" : "Adicionar até 3 imagens"}
              </button>
              {showImages && (
                <div className="space-y-2">
                  {form.images?.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="url" placeholder="URL da imagem" value={img} onChange={(e) => handleImageChange(idx, e.target.value)} className="border p-2 rounded w-full" />
                      <button type="button" onClick={() => removeImage(idx)} className="px-2 py-1 bg-red-500 text-white rounded">✕</button>
                    </div>
                  ))}
                  {(form.images?.length ?? 0) < 3 && (
                    <button type="button" onClick={addImage} className="px-3 py-1 bg-green-600 text-white rounded">+ Adicionar Imagem</button>
                  )}
                </div>
              )}
            </div>

            {/* Useful Links */}
            <div className="border p-3 rounded">
              <button type="button" onClick={() => setShowLinks((s) => !s)} className="text-blue-600 font-semibold mb-2">
                {showLinks ? "Ocultar Links" : "Adicionar Links Úteis"}
              </button>
              {showLinks && (
                <div className="space-y-3">
                  {(form.links || []).map((link, index) => (
                    <div key={index} className="flex flex-col w-full sm:flex-row gap-2 items-start sm:items-center">
                      <input type="text" placeholder="Título" value={link.title} onChange={(e) => handleLinkChange(index, "title", e.target.value)} className="border p-2 rounded w-full" />
                      <input type="url" placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(index, "url", e.target.value)} className="border p-2 rounded w-full" />
                      <button type="button" onClick={() => removeLink(index)} className="px-2 py-1 bg-red-500 text-white rounded mt-2 sm:mt-0 w-full md:w-14 h-10">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={addLink} className="px-3 py-1 bg-green-600 text-white rounded">+ Adicionar Link</button>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="border p-3 rounded space-y-2">
              <h3 className="font-semibold mb-2">Redes Sociais</h3>
              <input type="url" placeholder="Instagram" value={form.instagram || ""} onChange={(e) => handleSocialChange("instagram", e.target.value)} className="w-full border p-2 rounded" />
              <input type="url" placeholder="Facebook" value={form.facebook || ""} onChange={(e) => handleSocialChange("facebook", e.target.value)} className="w-full border p-2 rounded" />
              <input type="url" placeholder="Website" value={form.website || ""} onChange={(e) => handleSocialChange("website", e.target.value)} className="w-full border p-2 rounded" />
              <input type="text" placeholder="WhatsApp" value={form.whatsapp || ""} onChange={(e) => handleSocialChange("whatsapp", e.target.value)} className="w-full border p-2 rounded" />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <input type="text" placeholder="Telefone" value={form.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className="w-full border p-2 rounded" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.showPhone} onChange={(e) => updateField("showPhone", e.target.checked)} />
                Mostrar telefone no perfil
              </label>
            </div>

            {/* City & Neighborhood */}
            <div className="flex gap-2">
              <input type="text" placeholder="Cidade" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-1/2 border p-2 rounded" required />
              <input type="text" placeholder="Bairro" value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} className="w-1/2 border p-2 rounded" />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Salvando..." : "Criar Serviço"}</button>

            {/* Message */}
            {message && <p className="mt-4">{message}</p>}
          </form>
        </main>
      </div>
    </div>
  );
}
