"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createEventService,
  updateEventService,
  deleteEventService,
  deleteAllEventsService,
} from "./service";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !location || !date) {
    throw new Error("Bitte alle Pflichtfelder ausfüllen.");
  }

  await createEventService({
    title,
    location,
    date: new Date(date),
    isPublic,
  });

  revalidatePath("/events");
  redirect("/events?success=1");
}

export async function deleteEvent(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Ungültige Event-ID");
  }

  await deleteEventService(id);
  revalidatePath("/events");
}

export async function updateEvent(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const isPublic = formData.get("isPublic") === "on";

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Ungültige Event-ID");
  }

  if (!title || !location || !date) {
    throw new Error("Bitte alle Pflichtfelder ausfüllen.");
  }

  await updateEventService(id, {
    title,
    location,
    date: new Date(date),
    isPublic,
  });

  revalidatePath("/events");
}

export async function deleteAllEvents() {
  await deleteAllEventsService();
  revalidatePath("/events");
}

