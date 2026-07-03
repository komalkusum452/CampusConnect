"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Get profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(profileData);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-200 p-8">

      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Campus Connect
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to your dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow transition"
        >
          Logout
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Profile Information
        </h2>

        {user && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Email Card */}
            <div className="bg-blue-50 rounded-2xl p-6 shadow">
              <p className="text-sm text-gray-500 mb-2">
                Email
              </p>

              <p className="font-semibold text-gray-800 break-all">
                {user.email}
              </p>
            </div>

            {/* Name Card */}
            <div className="bg-blue-50 rounded-2xl p-6 shadow">
              <p className="text-sm text-gray-500 mb-2">
                Name
              </p>

              <p className="font-semibold text-gray-800">
                {profile ? profile.name : "Loading..."}
              </p>
            </div>

            {/* Role Card */}
            <div className="bg-blue-50 rounded-2xl p-6 shadow">
              <p className="text-sm text-gray-500 mb-2">
                Role
              </p>

              <p className="font-semibold text-gray-800 capitalize">
                {profile ? profile.role : "Loading..."}
              </p>
            </div>

          </div>
        )}

        {/* Future Features */}
        <div className="mt-10 border-t pt-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Quick Actions
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer">
              <h4 className="font-semibold text-lg">
                📅 Events
              </h4>
              <p className="text-gray-500 text-sm mt-2">
                Browse upcoming campus events.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer">
              <h4 className="font-semibold text-lg">
                💬 Community
              </h4>
              <p className="text-gray-500 text-sm mt-2">
                Connect with students and clubs.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}