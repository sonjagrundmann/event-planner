import { prisma } from "../lib/prisma";

export async function createEventService(data: {
  title: string;
  location: string;
  date: Date;
  isPublic: boolean;
}) {
  return prisma.event.create({
    data,
  });
}

export async function getAllEventsService() {
  return prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });
}

export async function updateEventService(
  id: number,
  data: {
    title: string;
    location: string;
    date: Date;
    isPublic: boolean;
  }
) {
  return prisma.event.update({
    where: { id },
    data,
  });
}

export async function deleteEventService(id: number) {
  return prisma.event.delete({
    where: { id },
  });
}

export async function deleteAllEventsService() {
  return prisma.event.deleteMany();
}
