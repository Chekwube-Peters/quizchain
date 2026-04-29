// import { calculatePoints } from "../src/lib/utils.js";

// In-memory game state (use Redis in production)
const rooms = new Map();
const timers = new Map();

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function calcPoints(timeSpent, timeLimit, basePoints = 1000) {
  const timeRatio = Math.max(0, 1 - timeSpent / (timeLimit * 1000));
  const speedBonus = Math.round(basePoints * 0.5 * timeRatio);
  return Math.round(basePoints * 0.5 + speedBonus);
}

export function createRoom(code, quiz, hostSocketId) {
  const room = {
    code,
    hostSocketId,
    status: "WAITING",
    currentQuestionIndex: -1,
    quiz,
    players: new Map(),
    answers: new Map(),
    timerStart: null,
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code) {
  return rooms.get(code);
}

export function addPlayer(code, socketId, player) {
  const room = rooms.get(code);
  if (!room) return null;
  room.players.set(socketId, {
    ...player,
    socketId,
    score: 0,
    totalTime: 0,
    streakCount: 0,
    isConnected: true,
    joinedAt: Date.now(),
  });
  return room;
}

export function removePlayer(code, socketId) {
  const room = rooms.get(code);
  if (!room) return null;
  const player = room.players.get(socketId);
  if (player) {
    player.isConnected = false;
  }
  return room;
}

export function getPlayers(code) {
  const room = rooms.get(code);
  if (!room) return [];
  return Array.from(room.players.values())
    .filter((p) => p.isConnected)
    .map((p, _, arr) => ({
      ...p,
      rank: 0,
    }));
}

export function getSortedLeaderboard(code) {
  const room = rooms.get(code);
  if (!room) return [];

  return Array.from(room.players.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.totalTime - b.totalTime;
    })
    .map((p, i) => ({
      rank: i + 1,
      id: p.id,
      socketId: p.socketId,
      nickname: p.nickname,
      avatar: p.avatar,
      score: p.score,
      totalTime: p.totalTime,
      streakCount: p.streakCount,
      correctAnswers: p.correctAnswers || 0,
      walletAddress: p.walletAddress,
    }));
}

export function startQuestion(code) {
  const room = rooms.get(code);
  if (!room) return null;

  room.currentQuestionIndex++;
  room.status = "ACTIVE";
  room.answers = new Map();
  room.timerStart = Date.now();

  const question = room.quiz.questions[room.currentQuestionIndex];
  if (!question) return null;

  return {
    question: {
      id: question.id,
      text: question.text,
      options: question.options,
      points: question.points,
      timeLimit: question.timeLimit,
      order: question.order,
    },
    questionIndex: room.currentQuestionIndex,
    totalQuestions: room.quiz.questions.length,
    timeLimit: question.timeLimit,
  };
}

export function submitAnswer(code, socketId, data) {
  const room = rooms.get(code);
  if (!room || room.status !== "ACTIVE") return null;

  if (room.answers.has(socketId)) return null;

  const question = room.quiz.questions[room.currentQuestionIndex];
  if (!question || question.id !== data.questionId) return null;

  const player = room.players.get(socketId);
  if (!player) return null;

  const isCorrect = data.selectedIndex === question.correctIndex;
  let pointsEarned = 0;
  let streakBonus = 0;

  if (isCorrect) {
    pointsEarned = calcPoints(data.timeSpent, question.timeLimit, question.points);
    player.streakCount++;
    if (player.streakCount >= 3) {
      streakBonus = Math.round(pointsEarned * 0.1);
    }
    player.correctAnswers = (player.correctAnswers || 0) + 1;
  } else {
    player.streakCount = 0;
  }

  const totalPoints = pointsEarned + streakBonus;
  player.score += totalPoints;
  player.totalTime += data.timeSpent;

  room.answers.set(socketId, {
    selectedIndex: data.selectedIndex,
    isCorrect,
    timeSpent: data.timeSpent,
    pointsEarned: totalPoints,
  });

  return {
    participantId: player.id,
    questionId: data.questionId,
    selectedIndex: data.selectedIndex,
    isCorrect,
    correctIndex: question.correctIndex,
    pointsEarned: totalPoints,
    streakBonus,
    newScore: player.score,
    timeSpent: data.timeSpent,
    explanation: question.explanation,
  };
}

export function endQuestion(code) {
  const room = rooms.get(code);
  if (!room) return null;

  const question = room.quiz.questions[room.currentQuestionIndex];
  const leaderboard = getSortedLeaderboard(code);

  return {
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    scores: leaderboard,
  };
}

export function isLastQuestion(code) {
  const room = rooms.get(code);
  if (!room) return true;
  return room.currentQuestionIndex >= room.quiz.questions.length - 1;
}

export function endRoom(code) {
  const room = rooms.get(code);
  if (!room) return null;

  room.status = "ENDED";
  const leaderboard = getSortedLeaderboard(code);

  // Clean up timer
  const timer = timers.get(code);
  if (timer) {
    clearTimeout(timer);
    timers.delete(code);
  }

  // Keep room for 1 hour for results viewing
  setTimeout(() => rooms.delete(code), 3600000);

  return { leaderboard, roomCode: code };
}

export function setTimer(code, timer) {
  const existing = timers.get(code);
  if (existing) clearTimeout(existing);
  timers.set(code, timer);
}

export function clearTimer(code) {
  const timer = timers.get(code);
  if (timer) {
    clearTimeout(timer);
    timers.delete(code);
  }
}

export function getAllConnectedPlayers(code) {
  const room = rooms.get(code);
  if (!room) return [];
  return Array.from(room.players.values()).filter((p) => p.isConnected);
}

export function getAllRoomCodes() {
  return Array.from(rooms.keys());
}
