"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { upsertProfile, getProfile } from "@/actions/users";
import { Header } from "@/components/Header";

interface ApiError {
  message: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profile = await getProfile(user.id);
        if (profile) {
          setName(profile.name || user.fullName || "");
          setCity(profile.city || "");
          setBio(profile.bio || "");
          setProfileExists(true);
        } else {
          setName(user.fullName || "");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.primaryEmailAddress?.emailAddress) {
      setMessage("❌ Email not found");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await upsertProfile({
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name,
        city,
        bio,
        image: user.imageUrl,
      });
      setMessage("✅ Profile saved!");
      setProfileExists(true);
    } catch (err: unknown) {
      console.error("Error saving profile:", err);

      if ((err as ApiError).message) {
        setMessage(`❌ Error: ${(err as ApiError).message}`);
      } else {
        setMessage("❌ An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!user;

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Profile</h1>

        {!isLoggedIn && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
            You need to <SignInButton mode="modal">log in</SignInButton> to create or edit your profile.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={user?.primaryEmailAddress?.emailAddress || ""}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              className="w-full border rounded p-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>

          <button
            type="submit"
            disabled={!isLoggedIn || loading}
            className={`px-4 py-2 rounded ${
              !isLoggedIn
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Saving..."
              : profileExists
              ? "Save Changes"
              : "Create your Profile"}
          </button>
        </form>

        {message && <p className="mt-4">{message}</p>}
      </main>
    </>
  );
}
