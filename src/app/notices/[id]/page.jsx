"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function NoticePage() {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setNotice(data);
    };

    if (id) {
      fetchNotice();
    }
  }, [id]);

  const handleSummarize = async () => {
    setLoading(true);

    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: notice.content,
      }),
    });

    const data = await response.json();

    setSummary(data.summary);

    setLoading(false);
  };

  if (!notice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200">
        <h1 className="text-2xl font-semibold text-gray-700">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/notices"
          className="inline-block mb-6 text-blue-700 hover:text-blue-900 font-semibold"
        >
          ← Back to Notice Board
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h1 className="text-4xl font-bold text-gray-800">
            {notice.title}
          </h1>

          <div className="mt-4 flex gap-3 items-center flex-wrap">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {notice.category}
            </span>

            {notice.pinned && (
              <span className="text-yellow-500 font-semibold">
                📌 Pinned
              </span>
            )}
          </div>

          <p className="mt-4 text-gray-500">
            📅 {new Date(notice.created_at).toLocaleDateString()}
          </p>

          <div className="mt-6">
            <button
              onClick={handleSummarize}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
            >
              ✨ Summarize
            </button>
          </div>

          {loading && (
            <p className="mt-4 text-purple-600 font-medium animate-pulse">
              ✨ Summarizing...
            </p>
          )}

          {summary && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                ✨ AI Summary
              </h3>

              <p className="text-gray-700 whitespace-pre-wrap leading-7">
                {summary}
              </p>
            </div>
          )}

          <hr className="my-8" />

          <div className="text-gray-700 leading-8 whitespace-pre-wrap">
            {notice.content}
          </div>

        </div>
      </div>
    </div>
  );
}