"use client";

import { Header } from "@/components/Header";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { CreateServiceInput, UsefulLink } from "@/types/services";
import { createService } from "@/actions/services";
import { getProfile } from "@/actions/users";
import Image from "next/image";
import { services } from "@/utils/services";

export default function CreateServicePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<{ id: string; name: string; email: string; image: string } | null>(null);

  const [form, setForm] = useState<CreateServiceInput | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLinks, setShowLinks] = useState(false);

  // 🔹 Load profile & redirect if missing
useEffect(() => {
  if (!isLoaded) return;
  if (!user) {
    router.push("/sign-in");
    return;
  }

  (async () => {
    const p = await getProfile(user.id); // fetch profile from DB
    if (!p) {
      router.push("/Profile");
      return;
    }

    // set profile state including image
    setProfile({
    id: p.id,
    name: p.name || user.fullName || "",
    email: user.primaryEmailAddress?.emailAddress || "",
    image: p.image || user.imageUrl || "",
    });


    // initialize form with profile image
    setForm({
      userId: p.id,
      city: "",
      neighborhood: "",
      title: "",
      description: "",
      services: [],
      mainService: "", // ← add this
      email: user.primaryEmailAddress?.emailAddress || "",
      phone: "",
      showPhone: false,
      links: [],
      image: p.image || user.imageUrl || "",
    });



    setProfileLoaded(true);
  })();
}, [isLoaded, user, router]);


  const updateField = <K extends keyof CreateServiceInput>(
    field: K,
    value: CreateServiceInput[K]
  ) => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, [field]: value }));
  };


  // 🔹 Useful links handlers
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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form) return;
  setLoading(true);

  try {
    // Ensure main service is first
    const servicesToSave = [
      form.services[0], // primary service
      ...(form.services.slice(1).filter(s => s !== form.services[0])) // additional services
    ];

    await createService({ ...form, services: servicesToSave });
    setMessage("✅ Serviço criado com sucesso!");

    // reset form but keep user info
    setForm({
      userId: profile!.id,
      city: "",
      neighborhood: "",
      title: "",
      description: "",
      services: [], // reset
      mainService: "", // ← add this
      email: profile!.email,
      phone: "",
      showPhone: false,
      links: [],
      image: "", // reset
    });

  } catch (err) {
    console.error(err);
    setMessage("❌ Erro ao criar serviço.");
  } finally {
    setLoading(false);
  }
};

  if (!profileLoaded || !form) return <p>Carregando...</p>; // wait for profile

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row mt-16 justify-center">
        <main className="p-6 mb-16 md:mb-0 w-full max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Cadastrar Serviço</h1>

          {/* 🔹 Show user info */}
          {/* <div className="mb-4 border p-3 rounded bg-gray-50">
            <p>
              <strong>Nome:</strong> {profile!.name}
            </p>
            <p>
              <strong>Email:</strong> {profile!.email}
            </p>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <input
              type="text"
              placeholder="Título"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex flex-col gap-2">
                <label className="font-semibold">Serviço principal</label>
                <select
                    value={form.services[0] || "Todos"} // first service is primary
                    onChange={(e) => updateField("services", [e.target.value])} // store as array
                    className="w-full border p-2 rounded"
                >
                    {services.map((service) => (
                    <option key={service} value={service}>
                        {service}
                    </option>
                    ))}
                </select>
            </div>


            <div className="w-full flex">    
                <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full border p-2 rounded"
                rows={4}
                />
                {form.image && (
                    <div className="max-w-sm">
                    <Image
                        src={form.image}
                        alt="Imagem do serviço"
                        width={200}
                        height={300}
                        className="rounded border"
                    />
                </div>
            )}
            </div>

            {/* --- Image input --- */}
            <div className="flex flex-col gap-2">
            <input
                type="url"
                disabled
                placeholder="URL da imagem do serviço"
                value={form.image || ""}
                onChange={(e) => updateField("image", e.target.value)}
                className="w-full border p-2 rounded disabled:bg-gray-400"
            />

            </div>

            <input
                type="text"
                disabled
                placeholder="Nome"
                value={profile!.name}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full border p-2 rounded disabled:bg-gray-400"
                required
            />
            <input
                type="text"
                disabled
                placeholder="Email"
                value={profile!.email}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full border p-2 rounded disabled:bg-gray-400"
                required
            />

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cidade"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-1/2 border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Bairro"
                value={form.neighborhood}
                onChange={(e) => updateField("neighborhood", e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
            </div>

            <input
            type="text"
            placeholder="Serviços adicionais (separados por vírgula)"
            value={form.services.slice(1).join(", ")}
            onChange={(e) =>
                updateField("services", [form.services[0], ...e.target.value.split(",").map(s => s.trim())])
            }
            className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Telefone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full border p-2 rounded"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.showPhone}
                onChange={(e) => updateField("showPhone", e.target.checked)}
              />
              Mostrar telefone no perfil
            </label>

            {/* --- Useful Links section --- */}
            <div className="border p-3 rounded">
              <button
                type="button"
                onClick={() => setShowLinks((s) => !s)}
                className="text-blue-600 font-semibold mb-2"
              >
                {showLinks ? "Ocultar Links" : "Adicionar Links Úteis"}
              </button>

              {showLinks && (
                <div className="space-y-3">
                  {(form.links || []).map((link, index) => (
                    <div
                      key={index}
                      className="flex flex-col w-full sm:flex-row gap-2 items-start sm:items-center"
                    >
                      <input
                        type="text"
                        placeholder="Título"
                        value={link.title}
                        onChange={(e) =>
                          handleLinkChange(index, "title", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(index, "url", e.target.value)
                        }
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
                    + Adicionar Link
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Salvando..." : "Criar Serviço"}
            </button>
          </form>

          {message && <p className="mt-4">{message}</p>}
        </main>
      </div>
    </div>
  );
}
