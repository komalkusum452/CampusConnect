"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CreateLostFoundPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("lost");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first.");
    return;
  }

  if (!image) {
    alert("Please choose an image.");
    return;
  }

  const fileName = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("lost_found_images")
    .upload(fileName, image);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("lost_found_images")
    .getPublicUrl(fileName);

  // Generate AI tags
const aiResponse = await fetch("/api/generate-tags", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title,
    description,
  }),
});

const aiData = await aiResponse.json();

// Save item
const { error } = await supabase.from("lost_found").insert([
  {
    title,
    description,
    type,
    location,
    image_url: publicUrl,
    tags: aiData.tags,
    user_id: user.id,
  },
]);

if (error) {
  alert(error.message);
  return;
}

alert("Item posted successfully!");

setTitle("");
setDescription("");
setLocation("");
setType("lost");
setImage(null);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Lost & Found
        </h1>

        <input
          type="text"
          placeholder="Item title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <textarea
          placeholder="Describe the item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 h-32"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
  className="
    w-full
    file:bg-blue-600
    file:text-white
    file:px-4
    file:py-2
    file:rounded-lg
    file:border-0
    file:cursor-pointer
    file:hover:bg-blue-700
    file:mr-4
    border
    rounded-lg
    p-2
  "
/>
<br />
<br />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Post Item
        </button>

      </div>
    </div>
  );
}