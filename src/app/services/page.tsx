"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { deleteService, getServices, updateService } from "@/actions/services";
import type { Service } from "@/types/services";
import ServiceCard from "@/components/ServiceCard";
import { servicescategories } from "@/utils/services";
import { Header } from "@/components/Header";
import { useUser } from "@clerk/nextjs";
import { getProfile } from "@/actions/users";


export default function ServicesPage() {
  const { user } = useUser();
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [profile, setProfile] = useState<{ id: string; role?: string } | null>(
    null
  );

  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
    setFiltered(data);
  };

  const loadProfile = async () => {
    if (!user?.id) return;
    const dbProfile = await getProfile(user.id); // passing Clerk ID
    setProfile(dbProfile);
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    loadProfile();
  }, [user]);

  useEffect(() => {
    let filteredServices = services;

    if (search) {
      filteredServices = filteredServices.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filteredServices = filteredServices.filter((s) =>
        selectedCategories.includes(s.mainService)
      );
    }

    setFiltered(filteredServices);
  }, [search, selectedCategories, services]);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6 mt-16">
        <h1 className="text-2xl font-bold mb-4">Serviços Disponíveis</h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border p-2 rounded"
          />

          <div className="w-full md:w-1/2">
            <Select
              isMulti
              isSearchable={false}
              options={servicescategories.map((c) => ({ value: c, label: c }))}
              value={servicescategories
                .filter((c) => selectedCategories.includes(c))
                .map((c) => ({ value: c, label: c }))}
              onChange={(selected) =>
                setSelectedCategories(selected.map((s) => s.value))
              }
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.filter((s) => s.isValidated).map((service) => {
            const isOwner = profile?.id === service.userId;
            const isAdmin = profile?.role === "admin";
            const canEdit = isOwner || isAdmin;

            return (
              <ServiceCard
                key={service.id}
                service={service}
                onUpdate={
                  canEdit
                    ? async (updatedService) => {
                        await updateService(updatedService);
                        await loadServices();
                      }
                    : undefined
                }
                onDelete={
                  canEdit
                    ? async (serviceId) => {
                        await deleteService(serviceId);
                        await loadServices();
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
