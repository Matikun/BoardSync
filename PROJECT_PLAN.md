# 📌 BoardSync — Project Roadmap & Progress Tracker

## 🎯 Goal

Build a **real-time collaborative Kanban board** (like Trello) with:

- Drag & drop cards between columns
- Real-time sync between multiple users (WebSockets)
- Clean, modern **dark theme UI**
- Optional extras: inline editing, presence, undo/redo, DB persistence

This project is designed as a **portfolio piece** to demonstrate skills in:

- React + TypeScript
- State management (Zustand)
- Real-time features (WebSockets/Socket.IO)
- Optimistic UI patterns
- Component architecture & performance optimization

---

## ✅ Progress So Far

- [x] Initialized project with **Vite + React + TypeScript**
- [x] Configured **Tailwind v4** (dark theme working)
- [x] Basic **board + columns + cards** layout
- [x] **Drag & Drop** working with `@dnd-kit/core`
- [x] Dark theme design (board/columns/cards contrast)
- [x] **Zustand** integrated for global state management
- [x] Card moves now update Zustand store only on drop (no lag during drag)
- [x] Optimized drag performance by using local state (via DnD Kit) for drag position
- [x] **Backend (Express + Socket.IO)** set up for REST API and real-time sync
- [x] **CORS** enabled for frontend-backend communication
- [x] **Drag overlay animation** working (see Board.tsx for implementation)
- [x] Real-time card movement and sync is fully functional
- [x] Backend and frontend are integrated via REST and Socket.IO

---

## 🔜 Next Steps

1. **State Management**

   - [x] Integrate Zustand store
   - [x] Persist card moves in global state
   - [x] Ensure drag events update Zustand cleanly (only update on drop, not on every drag event)

2. **Real-Time Sync**

   - [x] Create Node.js WebSocket server (Socket.IO)
   - [x] Connect frontend to server
   - [x] Broadcast card moves to all clients

3. **UX Enhancements**

   - [x] Smooth drag animations & drop placeholders (DragOverlay)
   - [ ] Inline card editing (title/description)
   - [ ] Optimistic UI (instant move, rollback if server fails)

4. **Extra Features (Optional, Portfolio Polish)**
   - [ ] Undo/Redo of moves
   - [ ] User presence (avatars per card/column)
   - [ ] Persist board state in DB (Supabase/Firebase/Turso)
   - [ ] Light/Dark mode toggle

---

## 🗂️ Project Structure (Current)

src/
├── components/
│ ├── Board.tsx
│ ├── Column.tsx
│ └── Card.tsx
├── store/
│ └── BoardStore.ts
├── data/
│ └── initialBoard.ts
├── types.ts
backend/
├── src/
│ └── server.js

---

## 🤖 Agent/Dev Notes

- Always update this file after completing a step
- If asking an AI agent for help, share this file so it knows the **current context**
- Keep PRs small and tied to checklist items
- Focus on **clean, reusable components** — this is a **portfolio project**

---

## 📅 Roadmap Estimate

- **Week 1**: Core board + drag & drop ✅
- **Week 2**: Zustand + WebSocket/Socket.IO integration (real-time) ✅
- **Week 3**: Polishing + optional features for portfolio
