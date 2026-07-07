"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function LostFoundPage() {
  const [items, setItems] = useState([]);

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("lost_found")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setItems(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        🔍 Lost & Found
      </h1>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="all">All Items</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items
          .filter((item) => {
            const typeOk =
              typeFilter === "all" || item.type === typeFilter;

            const statusOk =
              statusFilter === "all" ||
              (statusFilter === "resolved"
                ? item.resolved
                : !item.resolved);

            return typeOk && statusOk;
          })
          .map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  📍 {item.location}
                </p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === "lost"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>

                  {item.resolved && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-300 text-gray-700">
                      RESOLVED
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags?.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/lost-found/${item.id}`}
                  className="inline-block mt-5 text-blue-600 font-semibold hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}