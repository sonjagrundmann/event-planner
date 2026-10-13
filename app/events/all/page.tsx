import { Suspense } from "react";
import { prisma } from "../../lib/prisma";

export default function AllEventsPage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Alle Events</h1>

      <Suspense fallback={<p>Events werden geladen...</p>}>
        <EventList />
      </Suspense>
    </main>
  );
}

async function EventList() {
  const events = await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });

  if (events.length === 0) {
    return <p>Noch keine Events vorhanden.</p>;
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="rounded border p-4">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p>Ort: {event.location}</p>
          <p>Datum: {event.date.toLocaleString("de-DE")}</p>
          <p>Öffentlich: {event.isPublic ? "Ja" : "Nein"}</p>
        </li>
      ))}
    </ul>
  );
}
