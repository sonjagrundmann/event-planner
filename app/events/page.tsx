import { Suspense } from "react";
import clsx from "clsx";
import {
  createEvent,
  deleteEvent,
  updateEvent,
  deleteAllEvents,
} from "./actions";
import { getAllEventsService } from "./service";
import { connection } from "next/server";

export default function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <Suspense fallback={null}>
        <SuccessMessage searchParams={searchParams} />
      </Suspense>

      <h1 className="mb-6 text-3xl font-bold">Events erstellen</h1>

      <form
        action={createEvent}
        className="space-y-4 rounded-xl border bg-white p-6 shadow-md"
      >
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
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
          <label htmlFor="location" className="mb-1 block font-medium">
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
          <label htmlFor="date" className="mb-1 block font-medium">
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
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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

  const events = await getAllEventsService();

  return (
    <>
      <h2 className="mb-4 mt-10 text-2xl font-bold">Alle Events</h2>

      <form action={deleteAllEvents} className="mb-6">
        <button
          type="submit"
          className="rounded bg-red-800 px-4 py-2 text-white hover:bg-red-900"
        >
          Alle Events löschen
        </button>
      </form>

      {events.length === 0 ? (
        <p>Noch keine Events vorhanden.</p>
      ) : (
        <ul className="space-y-5">
          {events.map((event) => {
            const isPast = new Date(event.date) < new Date();

            return (
              <li
                key={event.id}
                className={clsx(
                  "rounded-xl border bg-white p-6 shadow-md transition-shadow hover:shadow-lg",
                  event.isPublic ? "border-green-500" : "border-gray-300",
                  isPast && "bg-gray-100 opacity-70",
                )}
              >
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  {event.title}
                </h3>

                <span
                  className={clsx(
                    "inline-block rounded-full px-3 py-1 text-sm font-semibold",
                    event.isPublic
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700",
                  )}
                >
                  {event.isPublic ? "Public" : "Private"}
                </span>

                <div className="mt-3 space-y-1 text-gray-600">
                  <p>
                    <span className="font-semibold">Ort:</span> {event.location}
                  </p>

                  <p>
                    <span className="font-semibold">Datum:</span>{" "}
                    {event.date.toLocaleString("de-DE")}
                  </p>
                </div>

                {isPast && (
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    Vergangen
                  </p>
                )}

                <form action={deleteEvent} className="mt-4">
                  <input type="hidden" name="id" value={event.id} />

                  <button
                    type="submit"
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </form>

                <form
                  action={updateEvent}
                  className="mt-4 space-y-3 border-t pt-4"
                >
                  <input type="hidden" name="id" value={event.id} />

                  <div>
                    <label
                      htmlFor={`title-${event.id}`}
                      className="mb-1 block font-medium"
                    >
                      Titel bearbeiten
                    </label>
                    <input
                      id={`title-${event.id}`}
                      name="title"
                      type="text"
                      defaultValue={event.title}
                      required
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`location-${event.id}`}
                      className="mb-1 block font-medium"
                    >
                      Ort bearbeiten
                    </label>
                    <input
                      id={`location-${event.id}`}
                      name="location"
                      type="text"
                      defaultValue={event.location}
                      required
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`date-${event.id}`}
                      className="mb-1 block font-medium"
                    >
                      Datum und Uhrzeit bearbeiten
                    </label>
                    <input
                      id={`date-${event.id}`}
                      name="date"
                      type="datetime-local"
                      defaultValue={new Date(
                        event.date.getTime() -
                          event.date.getTimezoneOffset() * 60_000,
                      )
                        .toISOString()
                        .slice(0, 16)}
                      required
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id={`isPublic-${event.id}`}
                      name="isPublic"
                      type="checkbox"
                      defaultChecked={event.isPublic}
                    />
                    <label htmlFor={`isPublic-${event.id}`}>
                      Öffentliches Event
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Änderungen speichern
                  </button>
                </form>
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
