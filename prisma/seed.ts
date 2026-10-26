import "dotenv/config";

if (process.env.VERCEL_ENV === "production") {
  console.log("Production erkannt. Seeding wird übersprungen.");
  process.exit(0);
}

async function main() {
  const { prisma } = await import("../app/lib/prisma");

  // Authors anlegen oder vorhandene wiederverwenden
  const authorData = [
    { name: "Anna Müller", email: "anna@example.com" },
    { name: "Max Schmidt", email: "max@example.com" },
    { name: "Lisa Weber", email: "lisa@example.com" },
    { name: "Tom Fischer", email: "tom@example.com" },
    { name: "Sophie Meyer", email: "sophie@example.com" },
  ];

  for (const author of authorData) {
    await prisma.author.upsert({
      where: { email: author.email },
      update: { name: author.name },
      create: author,
    });
  }

  console.log("Authors sind vorhanden.");

  const count = await prisma.event.count();

  if (count > 0) {
    console.log(
      "Events existieren bereits. Vorhandene Events bleiben erhalten.",
    );
    return;
  }

  const anna = await prisma.author.findUniqueOrThrow({
    where: { email: "anna@example.com" },
  });

  const max = await prisma.author.findUniqueOrThrow({
    where: { email: "max@example.com" },
  });

  const lisa = await prisma.author.findUniqueOrThrow({
    where: { email: "lisa@example.com" },
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Sommerfest",
        location: "Kapstadt",
        date: new Date("2027-01-15T16:00:00"),
        isPublic: true,
        authorId: anna.id,
      },
      {
        title: "Coding Workshop",
        location: "Online",
        date: new Date("2027-02-10T10:00:00"),
        isPublic: true,
        authorId: max.id,
      },
      {
        title: "Privates Treffen",
        location: "Stellenbosch",
        date: new Date("2027-03-05T18:00:00"),
        isPublic: false,
        authorId: lisa.id,
      },
      {
        title: "Web Development Meetup",
        location: "Cape Town",
        date: new Date("2027-04-20T14:00:00"),
        isPublic: true,
        authorId: anna.id,
      },
      {
        title: "Geburtstagsfeier",
        location: "Paarl",
        date: new Date("2027-05-12T19:00:00"),
        isPublic: false,
        authorId: max.id,
      },
    ],
  });

  console.log("Beispiel-Events mit Authors wurden angelegt.");
}

main()
  .catch((error) => {
    console.error("Fehler beim Seeding:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("../app/lib/prisma");
    await prisma.$disconnect();
  });