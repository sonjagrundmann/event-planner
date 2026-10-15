
import "dotenv/config";

if (process.env.VERCEL_ENV === "production") {
  console.log("Production erkannt. Seeding wird übersprungen.");
  process.exit(0);
}

async function main() {
  const { prisma } = await import("../app/lib/prisma");

  const count = await prisma.event.count();

  if (count > 0) {
    console.log("Events existieren bereits. Keine neuen Events angelegt.");
    return;
  }

  await prisma.event.createMany({
    data: [
      {
        title: "Sommerfest",
        location: "Kapstadt",
        date: new Date("2027-01-15T16:00:00"),
        isPublic: true,
      },
      {
        title: "Coding Workshop",
        location: "Online",
        date: new Date("2027-02-10T10:00:00"),
        isPublic: true,
      },
      {
        title: "Privates Treffen",
        location: "Stellenbosch",
        date: new Date("2027-03-05T18:00:00"),
        isPublic: false,
      },
    ],
  });

  console.log("Beispiel-Events wurden angelegt.");
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