const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(cors({ origin: "*" }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
const prisma = new PrismaClient();

app.use(express.json());

// REST endpoint to get board data from Prisma/Postgres
app.get("/api/board", async (req, res) => {
  try {
    const board = await prisma.board.findFirst({
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
      },
    });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

// Move card REST endpoint (simplified for Prisma)
// so im getting an 500 error what is wrong with my server?
app.post("/api/move-card", async (req, res) => {
  const { cardId, toColumnId, toIndex } = req.body;
  try {
    // Update the card's columnId
    await prisma.card.update({
      where: { id: cardId },
      data: { columnId: toColumnId },
    });
    // (Optional: handle ordering if you add a position field)
    res.json({ success: true });
    io.emit("card-moved", { cardId, toColumnId, toIndex });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to move card" });
  }
});

// Socket.IO event
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("move-card", async (data) => {
    const { cardId, toColumnId, toIndex } = data;
    try {
      await prisma.card.update({
        where: { id: cardId },
        data: { columnId: toColumnId },
      });
      io.emit("card-moved", { cardId, toColumnId, toIndex });
    } catch (error) {
      // Optionally handle error
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
