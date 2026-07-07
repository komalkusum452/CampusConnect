"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateEvent() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("technical");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [capacity, setCapacity] = useState("");
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  checkAdmin();
}, []);

const checkAdmin = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/events");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data?.role !== "admin") {
    router.push("/events");
    return;
  }
  setLoading(false);
};
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents refreshing of page
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!poster) {
      alert("Please choose a poster.");
      return;
    }

    const fileName = `${Date.now()}-${poster.name}`;

    const { error: uploadError } = await supabase.storage
      .from("event_posters")
      .upload(fileName, poster);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("event_posters")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("events")
      .insert([
        {
          title,
          description,
          venue,
          category,
          date,
          start_time: startTime,
          end_time: endTime,
          capacity: Number(capacity),
          poster_url: publicUrl,
          created_by: user.id,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Event created successfully!");

    router.push("/events");
  };
  
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 flex justify-center items-center p-8">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl"
      >

        <h1 className="flex justify-center text-3xl font-bold mb-6">
          Create Event
        </h1>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 h-32"
          required
        />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          required
        />
                <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        >
          <option value="technical">Technical</option>
          <option value="academic">Academic</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="general">General</option>
        </select>

        <div className="grid grid-cols-2 gap-4 mb-4">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border rounded-lg p-3"
            required
          />

        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded-lg p-3"
            required
          />

        </div>
 <input
  type="file"
  accept="image/*"
  onChange={(e) => setPoster(e.target.files[0])}
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
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
        >
          Create Event
        </button>

      </form>

    </div>
  );
}