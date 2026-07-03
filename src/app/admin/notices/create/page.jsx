"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CreateNoticePage()
{  
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("academic");
    const [pinned, setPinned] = useState(false);

    const handleSubmit = async () => {
    const {
    data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
    alert("You must be logged in.");
    return;
    }

    const { error } = await supabase
    .from("notices")
    .insert([
    {
      title,
      content,
      category,
      pinned,
      created_by: user.id,
    },
  ]);

   if (error) {
   alert(error.message);
   return;
   }
alert("Notice published successfully!");
};
   return (
  <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Create Notice
      </h1>

      <div className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Notice Title
          </label>

          <input
            type="text"
            placeholder="Enter notice title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Notice Content
          </label>

          <textarea
            placeholder="Enter notice content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="academic">Academic</option>
            <option value="hostel">Hostel</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="admin">Admin</option>
            <option value="general">General</option>
          </select>
        </div>

        <label className="flex items-center gap-3 text-gray-700">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="h-5 w-5 accent-blue-600"
          />
          Pin this notice
        </label>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Publish Notice
        </button>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">
          Preview
        </h2>

        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          <p>
            <span className="font-semibold">Title:</span> {title || "-"}
          </p>

          <p>
            <span className="font-semibold">Content:</span> {content || "-"}
          </p>

          <p>
            <span className="font-semibold">Category:</span> {category}
          </p>

          <p>
            <span className="font-semibold">Pinned:</span>{" "}
            {pinned ? "Yes 📌" : "No"}
          </p>
        </div>
      </div>
    </div>
  </div>
);
}