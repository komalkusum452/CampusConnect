"use client";

import { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function EventDetailPage() {

  const { id } = useParams();
  const router=useRouter();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registrations, setRegistrations] = useState(0);

  useEffect(() => {
     initialize();
  }, []);

  const initialize = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);

  await fetchEvent();

  if (user) {
    checkRegistration(user.id);
  }

  countRegistrations();
};
const checkRegistration = async (userId) => {
  const { data } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("event_id", id)
    .eq("user_id", userId);

  setRegistered(data.length > 0);
};

const countRegistrations = async () => {
  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  setRegistrations(count || 0);
};
const handleRSVP = async () => {
  if (!user) {
    alert("Please login first.");
    return;
  }

  if (registered) {
    await supabase
      .from("event_registrations")
      .delete()
      .eq("event_id", id)
      .eq("user_id", user.id);

    setRegistered(false);
  } else {
    if (registrations >= event.capacity) {
      alert("Event is full.");
      return;
    }

    await supabase.from("event_registrations").insert([
      {
        event_id: id,
        user_id: user.id,
      },
    ]);

    setRegistered(true);
  }

  countRegistrations();
};
  const fetchEvent = async () => {

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setEvent(data);
  };

  if (!event) {
    return (
      <div className="p-10 text-center text-xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 p-10">
       <div className="mb-6">
  <button
    onClick={() => router.back()}
    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium transition"
  >
    ← Back
  </button>
</div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        <img
          src={event.poster_url}
          alt={event.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">

          <h1 className="text-4xl font-bold">
            {event.title}
          </h1>

          <p className="mt-6 text-gray-700 leading-8">
            {event.description}
          </p>
                    <div className="mt-8 space-y-4 text-lg">

            <p>
              📅 <span className="font-semibold">Date:</span> {event.date}
            </p>

            <p>
              🕒 <span className="font-semibold">Time:</span>{" "}
              {event.start_time} - {event.end_time}
            </p>

            <p>
              📍 <span className="font-semibold">Venue:</span> {event.venue}
            </p>

            <p>
              🏷 <span className="font-semibold">Category:</span>{" "}
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                {event.category}
              </span>
            </p>

            <p>
  👥 <span className="font-semibold">Slots:</span>{" "}
  {registrations} / {event.capacity}
</p>

          </div>

          <div className="flex justify-center mt-10">

            <button
  onClick={handleRSVP}
  className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
    registered
      ? "bg-red-600 hover:bg-red-700"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {registered ? "Cancel Registration" : "Register"}
</button>

          </div>

        </div>

      </div>

    </div>

  );
}