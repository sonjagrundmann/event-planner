"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !location || !date) {
    throw new Error("Bitte alle Pflichtfelder ausfüllen.");
  }

  await prisma.event.create({
    data: {
      title,
      location,
      date: new Date(date),
      isPublic,
    },
  });

revalidatePath("/events");
redirect("/events?success=1");
}