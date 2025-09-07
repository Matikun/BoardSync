const express = require("express");
const cors = require("cors"); // <-- Add this line
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: "*" })); // <-- Add this line
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());

// In-memory board data
const board = {
  columns: {
    "col-1": { id: "col-1", title: "Todo", cardIds: ["c1", "c2"] },
    "col-2": { id: "col-2", title: "In Progress", cardIds: [] },
    "col-3": { id: "col-3", title: "Done", cardIds: [] },
  },
  cards: {
    c1: { id: "c1", title: "First Task" },
    c2: { id: "c2", title: "Second Task" },
  },
};

// REST endpoint to get board data
app.get("/api/board", (req, res) => {
  res.json(board);
});

// Move card REST endpoint
app.post("/api/move-card", (req, res) => {
  const { cardId, toColumnId, toIndex } = req.body;
  // Find the column containing the card
  const fromColumnId = Object.keys(board.columns).find((colId) =>
    board.columns[colId].cardIds.includes(cardId)
  );
  if (!fromColumnId) return res.status(400).json({ error: "Card not found" });

  // Remove card from old column
  board.columns[fromColumnId].cardIds = board.columns[
    fromColumnId
  ].cardIds.filter((id) => id !== cardId);
  // Insert card into new column
  board.columns[toColumnId].cardIds.splice(toIndex, 0, cardId);

  res.json({ success: true, board });
  // Broadcast to other clients
  io.emit("card-moved", { cardId, fromColumnId, toColumnId, toIndex });
});

// Socket.IO event
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("move-card", (data) => {
    // Optionally update board state here if you want real-time sync
    const { cardId, toColumnId, toIndex } = data;
    const fromColumnId = Object.keys(board.columns).find((colId) =>
      board.columns[colId].cardIds.includes(cardId)
    );
    if (fromColumnId) {
      board.columns[fromColumnId].cardIds = board.columns[
        fromColumnId
      ].cardIds.filter((id) => id !== cardId);
      board.columns[toColumnId].cardIds.splice(toIndex, 0, cardId);
      io.emit("card-moved", { cardId, fromColumnId, toColumnId, toIndex });
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
