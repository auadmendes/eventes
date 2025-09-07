"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllUsers, toggleAdmin, isAdmin } from "@/actions/users";
import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
  getNeighborhoods,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
} from "@/actions/city";

import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [allowed, setAllowed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [neighborhoodName, setNeighborhoodName] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Check admin access
  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      const ok = await isAdmin(
        user.id,
        user.primaryEmailAddress?.emailAddress || ""
      );
      setAllowed(ok);
      if (ok) {
        const usersData = await getAllUsers();
        setUsers(usersData);
        const citiesData = await getCities();
        setCities(citiesData);
      }
    })();
  }, [user, isLoaded]);

  const handleToggleAdmin = async (id: string, isAdminFlag: boolean) => {
    setLoading(true);
    try {
      await toggleAdmin(id, !isAdminFlag);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isAdmin: !isAdminFlag } : u))
      );
    } finally {
      setLoading(false);
    }
  };

    const handleAddCity = async () => {
    if (!cityName.trim()) return;

    try {
        'use server';
        const newCity = await createCity(cityName.trim()); // runs on server
        setCities(prev => [...prev, newCity]); // update client state
        setCityName("");
    } catch (err) {
        console.error(err);
    }
    };



    const handleDeleteCity = async (id: string) => {
    try {
        await deleteCity(id);
        await refreshCities();
    } catch (err) {
        console.error("Failed to delete city:", err);
    }
    };

    const handleUpdateCity = async (id: string, name: string) => {
        const updated = await updateCity(id, name);
        setCities((prev) => prev.map((c) => (c.id === id ? updated : c)));
    };

  // --- Neighborhood CRUD ---
  const handleAddNeighborhood = async () => {
    if (!neighborhoodName.trim() || !selectedCity) return;
    const newNeighborhood = await createNeighborhood(selectedCity, neighborhoodName.trim());
    setNeighborhoods((prev) => [...prev, newNeighborhood]);
    setNeighborhoodName("");
  };

  const handleDeleteNeighborhood = async (id: string) => {
    await deleteNeighborhood(id);
        setNeighborhoods((prev) => prev.filter((n) => n.id !== id));
    };

  const handleUpdateNeighborhood = async (id: string, name: string) => {
    const updated = await updateNeighborhood(id, name);
    setNeighborhoods((prev) => prev.map((n) => (n.id === id ? updated : n)));
  };

  const refreshCities = async () => {
        const citiesData = await getCities();
        setCities(citiesData);
    };

    useEffect(() => {
        if (!selectedCity) return;
        (async () => {
            const data = await getNeighborhoods(selectedCity);
            setNeighborhoods(data);
        })();
    }, [selectedCity]);


  if (!isLoaded) return <p className="text-center mt-10">⏳ Loading...</p>;
  if (!allowed) return <p className="text-center mt-10">🚫 Access Denied</p>;

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 p-4 border-r border-gray-200">
          <Menu />
        </aside>
        <main className="flex-1 flex flex-col mt-8 px-4">
          {/* Users Table */}
          <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-6 border rounded-lg shadow mb-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
            <div className="overflow-y-auto max-h-80 border rounded">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-white dark:bg-gray-900">
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Admin</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2">{u.name || "—"}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.isAdmin ? "✅ Yes" : "❌ No"}</td>
                      <td className="p-2">
                        <button
                          disabled={loading}
                          onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                          className={`px-3 py-1 rounded transition ${
                            u.isAdmin
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cities Management */}
          <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-6 border rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Cities</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="New city"
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={handleAddCity}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              >
                Add City
              </button>
            </div>
            <ul className="max-h-60 overflow-y-auto border rounded">
              {cities.map((c) => (
                <li key={c.id} className="flex justify-between items-center p-2 border-b">
                  <span>{c.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCity(c.id, prompt("Update city name", c.name) || c.name)}
                      className="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCity(c.id)}
                      className="bg-red-600 text-white px-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Neighborhood Management */}
          <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-6 border rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Neighborhoods</h2>
            <div className="flex gap-2 mb-4">
              <select
                value={selectedCity || ""}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={neighborhoodName}
                onChange={(e) => setNeighborhoodName(e.target.value)}
                placeholder="New neighborhood"
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={handleAddNeighborhood}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              >
                Add Neighborhood
              </button>
            </div>
            <ul className="max-h-60 overflow-y-auto border rounded">
              {neighborhoods.map((n) => (
                <li key={n.id} className="flex justify-between items-center p-2 border-b">
                  <span>{n.name} ({n.city?.name || "Unknown"})</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateNeighborhood(n.id, prompt("Update neighborhood name", n.name) || n.name)
                      }
                      className="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNeighborhood(n.id)}
                      className="bg-red-600 text-white px-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4 shadow-md">
        <Menu />
      </nav>
    </div>
  );
}
