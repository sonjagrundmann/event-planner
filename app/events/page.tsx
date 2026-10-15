import { Suspense } from "react";
import { createEvent } from "./actions";
import { prisma } from "../lib/prisma";
import { connection } from "next/server";

export default function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  return (
    <main className="mx-auto max-w-xl p-8">
      <Suspense fallback={null}>
        <SuccessMessage searchParams={searchParams} />
      </Suspense>

      <h1 className="mb-6 text-3xl font-bold">
        Events erstellen ✨ Preview Test
      </h1>

      <form action={createEvent} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block">
            Titel
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block">
            Ort
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block">
            Datum und Uhrzeit
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input id="isPublic" name="isPublic" type="checkbox" />
          <label htmlFor="isPublic">Öffentliches Event</label>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Event speichern
        </button>
      </form>

      <Suspense fallback={<p className="mt-10">Events werden geladen...</p>}>
        <PublicEvents />
      </Suspense>
    </main>
  );
}

async function PublicEvents() {
  await connection();

  const events = await prisma.event.findMany({
    where: {
      isPublic: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <>
      <h2 className="mb-4 mt-10 text-2xl font-bold">Öffentliche Events</h2>

      {events.length === 0 ? (
        <p>Noch keine öffentlichen Events vorhanden.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => {
            const isPast = new Date(event.date) < new Date();

            return (
              <li
                key={event.id}
                className={`rounded border p-4 ${
                  isPast ? "bg-gray-100 opacity-70" : ""
                }`}
              >
                <h3 className="font-bold">{event.title}</h3>

                <p>Ort: {event.location}</p>

                <p>Datum: {event.date.toLocaleString("de-DE")}</p>

                {isPast && (
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    Vergangen
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

async function SuccessMessage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;

  if (params.success !== "1") {
    return null;
  }

  return (
    <p className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
      🎉 Dein Event wurde erfolgreich gespeichert!
    </p>
  );
}
