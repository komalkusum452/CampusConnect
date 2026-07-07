"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch notices + check admin
  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setNotices(data);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Pin / Unpin
  const handleTogglePin = async (id, currentPinned) => {
    const { error } = await supabase
      .from("notices")
      .update({
        pinned: !currentPinned,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchNotices();
  };

  // Delete
  const handleDeleteNotice = async (id) => {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchNotices();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            📢 Notice Board
          </h1>

          <p className="text-gray-600 mt-2">
            Stay updated with the latest campus announcements
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            "all",
            "academic",
            "hostel",
            "sports",
            "cultural",
            "admin",
            "general",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium transition
                ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Notice Cards */}
        <div className="space-y-6">
          {notices
            .filter((notice) =>
              selectedCategory === "all"
                ? true
                : notice.category === selectedCategory
            )
            .map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                {/* Title */}
                <div className="flex items-center gap-2">
                  {notice.pinned && (
                    <span className="text-yellow-500 text-xl">📌</span>
                  )}

                  <h2 className="text-2xl font-bold text-gray-800">
                    {notice.title}
                  </h2>
                </div>

                {/* Category */}
                <div className="mt-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {notice.category}
                  </span>
                </div>

                {/* Read More */}
                <Link
                  href={`/notices/${notice.id}`}
                  className="inline-block mt-5 text-blue-600 font-semibold hover:text-blue-800"
                >
                  Click to read more →
                </Link>

                {/* Date */}
                <div className="mt-6 text-sm text-gray-500">
                  📅 {new Date(notice.created_at).toLocaleDateString()}
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          handleTogglePin(notice.id, notice.pinned)
                        }
                        className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition font-medium"
                      >
                        {notice.pinned ? "📌 Unpin" : "📌 Pin"}
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this notice?"
                            )
                          ) {
                            handleDeleteNotice(notice.id);
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition font-medium"
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}