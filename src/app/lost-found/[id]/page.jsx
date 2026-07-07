"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function LostFoundDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
    fetchItem();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const fetchItem = async () => {
    const { data, error } = await supabase
      .from("lost_found")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setItem(data);
  };

  const markResolved = async () => {
    const { error } = await supabase
      .from("lost_found")
      .update({
        resolved: true,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchItem();
  };

  const deleteItem = async () => {
    if (!confirm("Delete this item?")) return;

    const { error } = await supabase
      .from("lost_found")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/lost-found");
  };

  if (!item) {
    return (
      <h1 className="text-center mt-20 text-2xl">
        Loading...
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">

          <Link
            href="/lost-found"
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back
          </Link>

          <h1 className="text-4xl font-bold mt-4">
            {item.title}
          </h1>

          <div className="flex gap-3 mt-4">

            <span
              className={`px-4 py-2 rounded-full font-medium ${
                item.type === "lost"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {item.type.toUpperCase()}
            </span>

            {item.resolved && (
              <span className="px-4 py-2 rounded-full bg-green-300 text-gray-700">
                RESOLVED
              </span>
            )}

          </div>

          <p className="mt-5 text-lg">
            📍 <b>Location:</b> {item.location}
          </p>

          <p className="mt-6 leading-8 whitespace-pre-wrap">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {item.tags?.split(",").map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>

          <p className="mt-6 text-gray-500">
            Posted on{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>

          {user?.id === item.user_id && (
            <div className="flex gap-4 mt-8">

              {!item.resolved && (
                <button
                  onClick={markResolved}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  ✅ Mark Resolved
                </button>
              )}

              <button
                onClick={deleteItem}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                🗑 Delete
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}