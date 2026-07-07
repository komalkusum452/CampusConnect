"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  useEffect(() => {
    fetchEvents();
     checkAdmin();
  }, []);

  const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    alert(error.message);
    return;
  }

  const updatedEvents = await Promise.all(
    data.map(async (event) => {
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id);

      return {
        ...event,
        registrations: count || 0,
      };
    })
  );

  setEvents(updatedEvents);
};
const checkAdmin = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (data?.role === "admin") {
    setIsAdmin(true);
  }
};

  const today = new Date().toISOString().split("T")[0];

  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today);

 const EventCard = ({ event }) => {

  const remaining = event.capacity - event.registrations;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">

      <img
        src={event.poster_url}
        alt={event.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">

        <h2 className="text-2xl font-bold">
          {event.title}
        </h2>

        <div className="mt-3 flex gap-2 flex-wrap">

          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
            {event.category}
          </span>

          {remaining > 0 ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              👥 {remaining} Slots Left
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              FULL
            </span>
          )}

        </div>

        <p className="mt-4">
          📅 {event.date}
        </p>

        <p className="mt-2">
          🕒 {event.start_time} - {event.end_time}
        </p>

        <p className="mt-2">
          📍 {event.venue}
        </p>

        <Link
          href={`/events/${event.id}`}
          className="inline-block mt-5 text-blue-600 font-semibold hover:underline"
        >
          View Details →
        </Link>

      </div>

    </div>
  );
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200 p-8">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          📅 Events
        </h1>

        {isAdmin && (
  <Link
    href="/events/create"
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold"
  >
    + Create Event
  </Link>
)}


<div className="mb-8">

  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="bg-white border rounded-lg p-3 w-60 shadow-sm"
  >
    <option value="all">All Categories</option>
    <option value="technical">Technical</option>
    <option value="academic">Academic</option>
    <option value="cultural">Cultural</option>
    <option value="sports">Sports</option>
    <option value="general">General</option>
  </select>

</div>
      </div>

      <h2 className="text-2xl font-bold mb-5">
        Upcoming Events
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {upcoming
  .filter(
    (event) =>
      categoryFilter === "all" ||
      event.category === categoryFilter
  )
  .map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-5">
        Past Events
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       {past
  .filter(
    (event) =>
      categoryFilter === "all" ||
      event.category === categoryFilter
  )
  .map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

    </div>
  );
}