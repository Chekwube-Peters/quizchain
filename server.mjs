import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import * as gameManager from "./server/gameManager.mjs";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ─── HOST JOINS ROOM ─────────────────────────────────────
    socket.on("room:host", ({ code, quiz }) => {
      const existing = gameManager.getRoom(code);
      if (existing) {
        socket.join(code);
        socket.data.roomCode = code;
        socket.data.isHost = true;
        socket.emit("room:host-joined", { room: { ...existing, players: gameManager.getPlayers(code) } });
        return;
      }

      const room = gameManager.createRoom(code, quiz, socket.id);
      socket.join(room.code);
      socket.data.roomCode = room.code;
      socket.data.isHost = true;
      socket.emit("room:host-joined", { room: { ...room, players: [] } });
      console.log(`[Room] Host created room: ${room.code} (stored as: "${code}")`);
    });

    // ─── PLAYER JOINS ROOM ───────────────────────────────────
    socket.on("room:join", ({ code, nickname, walletAddress }) => {
      const allCodes = gameManager.getAllRoomCodes();
      console.log(`[Join] "${nickname}" → "${code}" | rooms in memory: [${allCodes.join(", ") || "none"}]`);
      const room = gameManager.getRoom(code);
      if (!room) {
        socket.emit("room:error", "Room not found. Check the code and try again.");
        return;
      }
      if (room.status === "ENDED") {
        socket.emit("room:error", "This quiz has already ended.");
        return;
      }

      const player = {
        id: socket.id,
        nickname: nickname.trim().slice(0, 20),
        avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(nickname)}&backgroundColor=0f172a`,
        score: 0,
        totalTime: 0,
        streakCount: 0,
        isConnected: true,
        walletAddress,
      };

      const updatedRoom = gameManager.addPlayer(code, socket.id, player);
      socket.join(code);
      socket.data.roomCode = code;
      socket.data.participantId = socket.id;
      socket.data.isHost = false;

      socket.emit("room:joined", {
        participantId: socket.id,
        player,
        room: {
          code: updatedRoom.code,
          status: updatedRoom.status,
          quiz: {
            title: updatedRoom.quiz.title,
            category: updatedRoom.quiz.category,
            difficulty: updatedRoom.quiz.difficulty,
            totalQuestions: updatedRoom.quiz.questions.length,
          },
        },
      });

      // Notify host and other players
      io.to(code).emit("player:joined", player);
      io.to(code).emit("room:players-update", gameManager.getPlayers(code));
      console.log(`[Room] Player ${nickname} joined room: ${code}`);
    });

    // ─── HOST: START QUIZ ────────────────────────────────────
    socket.on("host:start", ({ roomCode }) => {
      if (!socket.data.isHost) return;
      const room = gameManager.getRoom(roomCode);
      if (!room || room.status !== "WAITING") return;

      io.to(roomCode).emit("room:status", "ACTIVE");
      startNextQuestion(io, roomCode);
    });

    // ─── HOST: NEXT QUESTION ─────────────────────────────────
    socket.on("host:next", ({ roomCode }) => {
      if (!socket.data.isHost) return;
      gameManager.clearTimer(roomCode);
      advanceQuestion(io, roomCode);
    });

    // ─── PLAYER: SUBMIT ANSWER ───────────────────────────────
    socket.on("quiz:answer", ({ questionId, selectedIndex, timeSpent }) => {
      const code = socket.data.roomCode;
      if (!code) return;

      const result = gameManager.submitAnswer(code, socket.id, {
        questionId,
        selectedIndex,
        timeSpent,
      });

      if (result) {
        socket.emit("quiz:answer-result", result);

        // Check if all players answered
        const allPlayers = gameManager.getAllConnectedPlayers(code);
        const room = gameManager.getRoom(code);
        if (room && room.answers && room.answers.size >= allPlayers.length) {
          gameManager.clearTimer(code);
          setTimeout(() => endCurrentQuestion(io, code), 500);
        }
      }
    });

    // ─── HOST: END QUIZ ──────────────────────────────────────
    socket.on("host:end", ({ roomCode }) => {
      if (!socket.data.isHost) return;
      gameManager.clearTimer(roomCode);
      const result = gameManager.endRoom(roomCode);
      if (result) {
        io.to(roomCode).emit("quiz:end", result);
      }
    });

    // ─── DISCONNECT ──────────────────────────────────────────
    socket.on("disconnect", () => {
      const code = socket.data.roomCode;
      if (code) {
        if (!socket.data.isHost) {
          gameManager.removePlayer(code, socket.id);
          io.to(code).emit("player:left", socket.id);
          io.to(code).emit("room:players-update", gameManager.getPlayers(code));
        }
      }
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  // ─── GAME FLOW HELPERS ──────────────────────────────────────

  function startNextQuestion(io, roomCode) {
    const data = gameManager.startQuestion(roomCode);
    if (!data) {
      const result = gameManager.endRoom(roomCode);
      if (result) io.to(roomCode).emit("quiz:end", result);
      return;
    }

    io.to(roomCode).emit("quiz:question", data);
    console.log(`[Game] Question ${data.questionIndex + 1}/${data.totalQuestions} for room: ${roomCode}`);

    // Auto-end question after timeLimit
    const autoEndTimer = setTimeout(() => {
      endCurrentQuestion(io, roomCode);
    }, (data.timeLimit + 1) * 1000);

    gameManager.setTimer(roomCode, autoEndTimer);
  }

  function endCurrentQuestion(io, roomCode) {
    const endData = gameManager.endQuestion(roomCode);
    if (!endData) return;

    io.to(roomCode).emit("quiz:question-end", endData);

    // Show results for 4 seconds, then next question or end
    setTimeout(() => {
      if (gameManager.isLastQuestion(roomCode)) {
        const result = gameManager.endRoom(roomCode);
        if (result) {
          io.to(roomCode).emit("quiz:end", result);
          io.to(roomCode).emit("room:status", "ENDED");
        }
      } else {
        advanceQuestion(io, roomCode);
      }
    }, 4000);
  }

  function advanceQuestion(io, roomCode) {
    startNextQuestion(io, roomCode);
  }

  httpServer.listen(port, () => {
    console.log(`\n🚀 QuizChain Server running on http://${hostname}:${port}\n`);
  });
});
