// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const board = await prisma.board.create({
    data: {
      title: "Project Board",
      columns: {
        create: [
          {
            title: "Todo",
            cards: {
              create: [{ title: "First Task" }, { title: "Second Task" }],
            },
          },
          {
            title: "In Progress",
          },
          {
            title: "Done",
          },
        ],
      },
    },
    include: {
      columns: { include: { cards: true } },
    },
  });

  console.log("Board seeded:", JSON.stringify(board, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed ❌", e);
    await prisma.$disconnect();
    process.exit(1);
  });
