"use strict";

const SAVE_KEY = "projectAriseAlpha13";
const LEGACY_SAVE_KEYS = ["projectAriseAlpha12", "projectAriseAlpha11", "projectAriseSave", "projectAscensionSave"];
const VERSION = "1.3.0";
const COOLDOWN_MS = 12 * 60 * 60 * 1000;
const STREAK_WINDOW_MS = 36 * 60 * 60 * 1000;
const GUARD_WINDOW_MS = 60 * 60 * 60 * 1000;

const ranks = ["E-", "E", "E+", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S-", "S", "S+"];

const bodyInfo = {
  chest: { name: "Peito", code: "PECTORAL SYNC", description: "Movimentos de empurrar desenvolvem controle e capacidade do peito junto dos braços.", focus: "Flexões e suas progressões são a principal fonte de progresso aqui." },
  back: { name: "Costas", code: "BACK SYNC", description: "A região das costas é recrutada principalmente em puxadas, suspensões e controle escapular.", focus: "Barra fixa e Dead Hang sustentam esta progressão." },
  arms: { name: "Braços & Pegada", code: "GRIP SYNC", description: "Agrupa braços, antebraços e capacidade de segurar a barra com segurança.", focus: "Barra, Dead Hang e flexões contribuem em intensidades diferentes." },
  core: { name: "Core", code: "CORE SYNC", description: "Representa estabilidade do tronco: abdômen, lombar e controle corporal em conjunto.", focus: "Prancha é a fonte principal, mas quase todo movimento bem executado também contribui." },
  legs: { name: "Pernas", code: "LEG SYNC", description: "Força e resistência da base corporal, especialmente coxas e glúteos.", focus: "Agachamentos e cardio controlado alimentam esta região." },
  calves: { name: "Panturrilhas", code: "CALF SYNC", description: "Mostra força e resistência da panturrilha e o controle do tornozelo.", focus: "Elevação de panturrilha é o estímulo principal; cardio também contribui um pouco." },
  breath: { name: "Fôlego", code: "LUNG CAPACITY", description: "Capacidade cardiorrespiratória e tolerância a esforço contínuo. Não é um músculo isolado, por isso aparece como uma aura no tórax.", focus: "Cardio intervalado é a principal fonte de progresso de fôlego." }
};

const exercises = {
  pushup: {
    name: "Flexão",
    short: "Flexão",
    category: "PUSH",
    description: "Empurre o corpo mantendo tronco e quadril alinhados. Pare antes da técnica desmontar.",
    unit: "reps",
    sets: 3,
    minTarget: 1,
    maxTarget: 18,
    step: 1,
    xp: 20,
    essence: 4,
    body: { chest: 10, arms: 7, core: 3 },
    variations: [
      { name: "Flexão padrão", unlock: 1, baseTarget: 2 },
      { name: "Flexão pausada", unlock: 4, baseTarget: 2 },
      { name: "Flexão diamante", unlock: 7, baseTarget: 2 },
      { name: "Flexão declinada", unlock: 10, baseTarget: 2 },
      { name: "Archer assistida", unlock: 14, baseTarget: 1 }
    ]
  },
  pullup: {
    name: "Barra fixa",
    short: "Barra",
    category: "PULL",
    description: "Puxe com controle, evitando embalo. Use a variação que você consegue executar com técnica aceitável.",
    unit: "reps",
    sets: 3,
    minTarget: 1,
    maxTarget: 12,
    step: 1,
    xp: 25,
    essence: 5,
    body: { back: 12, arms: 10, core: 2 },
    variations: [
      { name: "Barra fixa", unlock: 1, baseTarget: 1 },
      { name: "Barra com pausa no topo", unlock: 4, baseTarget: 1 },
      { name: "Barra com descida lenta", unlock: 7, baseTarget: 1 },
      { name: "Chest-to-bar controlada", unlock: 11, baseTarget: 1 }
    ]
  },
  squat: {
    name: "Agachamento",
    short: "Agachamento",
    category: "LEGS",
    description: "Desça com controle e use uma amplitude confortável, mantendo os pés firmes no chão.",
    unit: "reps",
    sets: 3,
    minTarget: 4,
    maxTarget: 30,
    step: 2,
    xp: 20,
    essence: 4,
    body: { legs: 12, core: 3, breath: 2 },
    variations: [
      { name: "Agachamento padrão", unlock: 1, baseTarget: 8 },
      { name: "Agachamento pausado", unlock: 4, baseTarget: 6 },
      { name: "Agachamento tempo 3s", unlock: 7, baseTarget: 6 },
      { name: "Split squat", unlock: 10, baseTarget: 5 }
    ]
  },
  plank: {
    name: "Prancha",
    short: "Prancha",
    category: "CORE",
    description: "Mantenha abdômen e glúteos firmes, respirando normalmente e sem deixar o quadril cair.",
    unit: "seconds",
    sets: 3,
    minTarget: 10,
    maxTarget: 75,
    step: 5,
    xp: 18,
    essence: 4,
    body: { core: 14, arms: 2, breath: 1 },
    variations: [
      { name: "Prancha padrão", unlock: 1, baseTarget: 15 },
      { name: "Prancha com braços mais à frente", unlock: 4, baseTarget: 12 },
      { name: "Prancha RKC", unlock: 8, baseTarget: 10 }
    ]
  },
  calfRaise: {
    name: "Elevação de panturrilha",
    short: "Panturrilha",
    category: "LEGS",
    description: "Suba na ponta dos pés, faça uma pequena pausa no alto e desça controlando. Use apoio se precisar de equilíbrio.",
    unit: "reps",
    sets: 3,
    minTarget: 6,
    maxTarget: 35,
    step: 2,
    xp: 18,
    essence: 4,
    body: { calves: 12, legs: 4 },
    variations: [
      { name: "Elevação bilateral", unlock: 1, baseTarget: 10 },
      { name: "Elevação com pausa de 2s", unlock: 4, baseTarget: 8 },
      { name: "Elevação unilateral assistida", unlock: 8, baseTarget: 5 }
    ]
  },
  deadHang: {
    name: "Dead Hang",
    short: "Pegada",
    category: "PULL",
    description: "Fique suspenso na barra sem balançar, com pegada confortável. Encerre a série se a pegada abrir ou houver dor no ombro.",
    unit: "seconds",
    sets: 3,
    minTarget: 5,
    maxTarget: 60,
    step: 5,
    xp: 20,
    essence: 4,
    body: { arms: 13, back: 4, core: 2 },
    variations: [
      { name: "Dead Hang confortável", unlock: 1, baseTarget: 10 },
      { name: "Active Hang", unlock: 4, baseTarget: 8 },
      { name: "Scapular Hold", unlock: 8, baseTarget: 6 }
    ]
  },
  cardio: {
    name: "Cardio intervalado",
    short: "Fôlego",
    category: "CONDITIONING",
    description: "Faça marcha acelerada no lugar ou step jacks sem salto. O objetivo é acelerar a respiração sem transformar cada rodada em um sprint máximo.",
    unit: "seconds",
    sets: 4,
    minTarget: 20,
    maxTarget: 90,
    step: 5,
    xp: 22,
    essence: 4,
    body: { breath: 15, legs: 5, calves: 2 },
    variations: [
      { name: "Marcha acelerada", unlock: 1, baseTarget: 30 },
      { name: "Step jack sem salto", unlock: 4, baseTarget: 30 },
      { name: "Joelho alto controlado", unlock: 7, baseTarget: 25 },
      { name: "Polichinelo controlado", unlock: 10, baseTarget: 20 }
    ],
    safety: "Seu coração e sua respiração devem acelerar, mas mantenha controle. Pare se sentir dor, tontura ou falta de ar fora do esperado."
  }
};

const routines = {
  A: {
    name: "TREINO A",
    subtitle: "Empurrar • Pernas • Panturrilhas • Fôlego",
    exercises: ["pushup", "squat", "calfRaise", "cardio"]
  },
  B: {
    name: "TREINO B",
    subtitle: "Puxar • Core • Pegada • Fôlego",
    exercises: ["pullup", "plank", "deadHang", "cardio"]
  }
};

const masteryGroups = {
  push: { name: "PUSH", label: "Peito & empurrar", exercises: ["pushup"] },
  pull: { name: "PULL", label: "Costas & pegada", exercises: ["pullup", "deadHang"] },
  legs: { name: "LEGS", label: "Pernas & panturrilhas", exercises: ["squat", "calfRaise"] },
  core: { name: "CORE", label: "Estabilidade", exercises: ["plank"] },
  conditioning: { name: "CONDITIONING", label: "Fôlego", exercises: ["cardio"] }
};

const achievements = {
  firstStep: { icon: "⚔", name: "FIRST STEP", description: "Registre seu primeiro exercício.", xp: 15, essence: 2, test: () => player.stats.totalExercises >= 1 },
  dailyClear: { icon: "◆", name: "DAILY CLEARED", description: "Complete uma Daily Quest inteira.", xp: 25, essence: 5, test: () => player.stats.totalDailyCompletions >= 1 },
  gripSteel: { icon: "✊", name: "IRON GRIP", description: "Acumule 120 segundos de Dead Hang.", xp: 35, essence: 6, test: () => player.stats.totalDeadHangSeconds >= 120 },
  breathLit: { icon: "◈", name: "SECOND WIND", description: "Acumule 5 minutos de cardio registrado.", xp: 40, essence: 8, test: () => player.stats.totalCardioSeconds >= 300 },
  calfAwake: { icon: "▲", name: "GROUND FORCE", description: "Acumule 250 repetições de panturrilha.", xp: 35, essence: 6, test: () => player.stats.totalCalfReps >= 250 },
  streak3: { icon: "🔥", name: "MOMENTUM", description: "Alcance um streak de 3 dias.", xp: 35, essence: 6, test: () => player.streak.best >= 3 },
  streak7: { icon: "♛", name: "SEVEN DAYS", description: "Alcance um streak de 7 dias.", xp: 70, essence: 15, test: () => player.streak.best >= 7 },
  level5: { icon: "✦", name: "AWAKENING", description: "Alcance o Level 5.", xp: 50, essence: 8, test: () => player.level >= 5 },
  level10: { icon: "✧", name: "LIMIT BREAK", description: "Alcance o Level 10.", xp: 100, essence: 20, test: () => player.level >= 10 },
  fiftySessions: { icon: "☰", name: "NO EASY WAY", description: "Registre 50 exercícios.", xp: 100, essence: 20, test: () => player.stats.totalExercises >= 50 }
};

const titles = {
  awakened: { name: "THE AWAKENED", description: "O início da mudança.", test: () => true },
  king: { name: "THE KING", description: "Sete dias sem quebrar o ritmo.", test: () => player.streak.best >= 7 },
  honored: { name: "HONORED ONE", description: "Um marco reservado ao Level 10.", test: () => player.level >= 10 },
  beyondWalls: { name: "BEYOND THE WALLS", description: "Complete 20 Daily Quests.", test: () => player.stats.totalDailyCompletions >= 20 },
  chainbreaker: { name: "CHAINBREAKER", description: "Registre 60 exercícios.", test: () => player.stats.totalExercises >= 60 },
  shadowRisen: { name: "ONE WHO ROSE", description: "Alcance o Rank C-.", test: () => player.level >= 19 }
};

const shopItems = {
  themeShadowGate: { name: "Shadow Gate", type: "theme", typeLabel: "TEMA", price: 300, className: "theme-shadow-gate", description: "Roxo profundo, aura escura e brilho de portal." },
  themeKingDomain: { name: "King's Domain", type: "theme", typeLabel: "TEMA", price: 350, className: "theme-king-domain", description: "Vermelho sombrio e presença de trono." },
  themeBeyondWalls: { name: "Beyond Walls", type: "theme", typeLabel: "TEMA", price: 300, className: "theme-beyond-walls", description: "Verde militar, aço e sensação de expedição." },
  themeDevilPulse: { name: "Devil Pulse", type: "theme", typeLabel: "TEMA", price: 350, className: "theme-devil-pulse", description: "Preto, vermelho e laranja com energia caótica." },
  effectShadowRise: { name: "Shadow Rise", type: "effect", typeLabel: "LEVEL UP", price: 400, effectClass: "effect-shadow-rise", description: "Uma ascensão violeta domina a tela no Level Up." },
  effectDarkImpact: { name: "Dark Impact", type: "effect", typeLabel: "LEVEL UP", price: 450, effectClass: "effect-dark-impact", description: "Impacto escuro com contraste violeta e branco." },
  effectGroundTremor: { name: "Ground Tremor", type: "effect", typeLabel: "LEVEL UP", price: 400, effectClass: "effect-ground-tremor", description: "A interface treme como se algo gigantesco tivesse despertado." },
  effectChainBurst: { name: "Chain Burst", type: "effect", typeLabel: "LEVEL UP", price: 450, effectClass: "effect-chain-burst", description: "Explosão vermelha com linhas cortantes." }
};

const defaultVariationTargets = () => {
  const result = {};
  Object.entries(exercises).forEach(([key, exercise]) => {
    result[key] = {};
    exercise.variations.forEach((variation, index) => {
      result[key][String(index)] = variation.baseTarget;
    });
  });
  return result;
};

const defaultPlayer = () => ({
  version: VERSION,
  name: "VITANHOO",
  level: 1,
  xp: 0,
  essence: 0,
  bodyXP: { chest: 0, back: 0, arms: 0, core: 0, legs: 0, calves: 0, breath: 0 },
  skills: { pushup: 1, pullup: 1, squat: 1, plank: 1, calfRaise: 1, deadHang: 1, cardio: 1 },
  skillXP: { pushup: 0, pullup: 0, squat: 0, plank: 0, calfRaise: 0, deadHang: 0, cardio: 0 },
  variationIndex: { pushup: 0, pullup: 0, squat: 0, plank: 0, calfRaise: 0, deadHang: 0, cardio: 0 },
  variationTargets: defaultVariationTargets(),
  daily: { routineId: "A", completed: [], bonusClaimed: false, completedAt: null, nextAvailableAt: null },
  streak: { current: 0, best: 0, lastCompletedAt: null, guard: 0 },
  stats: {
    totalExercises: 0,
    totalDailyCompletions: 0,
    totalCardioSeconds: 0,
    totalDeadHangSeconds: 0,
    totalCalfReps: 0,
    totalPushupReps: 0,
    totalPullupReps: 0
  },
  achievements: [],
  equippedTitle: "awakened",
  shop: { owned: [], equippedTheme: "default", equippedEffect: "default" },
  history: []
});

let player;
let trainingQueue = [];
let trainingIndex = 0;
let singleExerciseMode = false;
let notificationTimer = null;
let pendingSystemMessages = [];
let selectedBodyZone = "chest";
let cooldownTimer = null;
let streakTimer = null;
let deferredInstallPrompt = null;

const $ = (id) => document.getElementById(id);

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateKeyOffset(key, days) {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function daysBetween(fromKey, toKey) {
  return Math.round((dateFromKey(toKey) - dateFromKey(fromKey)) / 86400000);
}

function routineIdForDate(dateKey) {
  const days = Math.floor(dateFromKey(dateKey).getTime() / 86400000);
  return days % 2 === 0 ? "A" : "B";
}

function formatToday() {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date()).replace(".", "");
}

function nextRoutineId(id) {
  return id === "A" ? "B" : "A";
}

function parseTime(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function formatDuration(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function sessionLocked() {
  const next = parseTime(player?.daily?.nextAvailableAt);
  return Boolean(player?.daily?.bonusClaimed && next && Date.now() < next);
}

function cooldownRemaining() {
  const next = parseTime(player?.daily?.nextAvailableAt);
  return next ? Math.max(0, next - Date.now()) : 0;
}

function prepareNextSessionIfReady() {
  if (!player?.daily?.bonusClaimed) return false;
  const next = parseTime(player.daily.nextAvailableAt);
  if (!next || Date.now() < next) return false;
  player.daily = {
    routineId: nextRoutineId(player.daily.routineId),
    completed: [],
    bonusClaimed: false,
    completedAt: null,
    nextAvailableAt: null
  };
  saveGame();
  return true;
}

function latestHistoryTime(history = []) {
  let latest = 0;
  history.forEach((entry) => {
    const time = parseTime(entry.timestamp);
    if (time && time > latest) latest = time;
  });
  return latest || null;
}

function xpRequired(level = player?.level || 1) {
  return 100 + ((level - 1) * 50);
}

function skillXPRequired(skillLevel) {
  return 80 + ((skillLevel - 1) * 40);
}

function bodyLevel(key) {
  return 1 + Math.floor((player.bodyXP[key] || 0) / 100);
}

function bodyProgress(key) {
  return (player.bodyXP[key] || 0) % 100;
}

function getRank() {
  const index = Math.min(ranks.length - 1, Math.floor((player.level - 1) / 3));
  return ranks[Math.max(0, index)];
}

function currentVariation(key) {
  const exercise = exercises[key];
  const index = Math.max(0, Math.min(exercise.variations.length - 1, Number(player.variationIndex[key]) || 0));
  return exercise.variations[index];
}

function currentTarget(key) {
  const index = String(player.variationIndex[key] || 0);
  const stored = Number(player.variationTargets?.[key]?.[index]);
  return Number.isFinite(stored) && stored > 0 ? stored : currentVariation(key).baseTarget;
}

function setCurrentTarget(key, value) {
  const index = String(player.variationIndex[key] || 0);
  if (!player.variationTargets[key]) player.variationTargets[key] = {};
  player.variationTargets[key][index] = value;
}

function targetText(key) {
  const exercise = exercises[key];
  return `${exercise.sets} × ${currentTarget(key)}${exercise.unit === "seconds" ? "s" : ""}`;
}

function bodyNamesForExercise(key) {
  return Object.keys(exercises[key].body).map((bodyKey) => bodyInfo[bodyKey].name);
}

function convertLegacyAttributes(attributeXP = {}) {
  const STR = Number(attributeXP.STR) || 0;
  const VIT = Number(attributeXP.VIT) || 0;
  const AGI = Number(attributeXP.AGI) || 0;
  const CON = Number(attributeXP.CON) || 0;
  return {
    chest: Math.round(STR * 0.36 + CON * 0.08),
    back: Math.round(STR * 0.36 + CON * 0.14),
    arms: Math.round(STR * 0.32 + CON * 0.18),
    core: Math.round(CON * 0.62 + VIT * 0.10),
    legs: Math.round(STR * 0.18 + VIT * 0.42 + AGI * 0.28),
    calves: Math.round(VIT * 0.16 + AGI * 0.26),
    breath: Math.round(VIT * 0.62 + AGI * 0.15)
  };
}

function deriveStatsFromHistory(history) {
  const stats = defaultPlayer().stats;
  const days = new Map();

  history.forEach((entry) => {
    stats.totalExercises += 1;
    const total = Array.isArray(entry.values) ? entry.values.reduce((sum, value) => sum + (Number(value) || 0), 0) : 0;
    if (entry.exerciseKey === "cardio") stats.totalCardioSeconds += total;
    if (entry.exerciseKey === "deadHang") stats.totalDeadHangSeconds += total;
    if (entry.exerciseKey === "calfRaise") stats.totalCalfReps += total;
    if (entry.exerciseKey === "pushup") stats.totalPushupReps += total;
    if (entry.exerciseKey === "pullup") stats.totalPullupReps += total;

    const date = new Date(entry.timestamp);
    if (!Number.isNaN(date.getTime())) {
      const dayKey = getTodayKey(date);
      if (!days.has(dayKey)) days.set(dayKey, new Set());
      if (entry.exerciseKey) days.get(dayKey).add(entry.exerciseKey);
    }
  });

  const legacySet = ["pushup", "pullup", "squat", "plank"];
  stats.totalDailyCompletions = [...days.values()].filter((set) => legacySet.every((key) => set.has(key))).length;
  return stats;
}

function sanitizePlayer(data, fromLegacy = false) {
  const base = defaultPlayer();
  if (!data || typeof data !== "object") return base;

  const history = Array.isArray(data.history) ? data.history.slice(-500) : [];
  const derivedStats = deriveStatsFromHistory(history);
  const bodyXP = data.bodyXP
    ? { ...base.bodyXP, ...data.bodyXP }
    : convertLegacyAttributes(data.attributeXP || {});

  const variationTargets = defaultVariationTargets();
  Object.keys(exercises).forEach((key) => {
    if (data.variationTargets?.[key]) {
      variationTargets[key] = { ...variationTargets[key], ...data.variationTargets[key] };
    }
  });

  if (data.targets) {
    Object.keys(data.targets).forEach((key) => {
      if (variationTargets[key] && Number.isFinite(Number(data.targets[key]))) {
        variationTargets[key]["0"] = Number(data.targets[key]);
      }
    });
  }

  const oldDaily = data.daily || {};
  const routineId = oldDaily.routineId && routines[oldDaily.routineId] ? oldDaily.routineId : "A";
  const routineKeys = routines[routineId].exercises;
  const dailyCompleted = Array.isArray(oldDaily.completed)
    ? oldDaily.completed.filter((key) => routineKeys.includes(key))
    : [];

  const legacyLastDate = data.streak?.lastCompletedDate;
  let migratedLastCompletedAt = data.streak?.lastCompletedAt || null;
  if (!migratedLastCompletedAt && legacyLastDate) {
    const sameDayEntries = history
      .map((entry) => ({ entry, time: parseTime(entry.timestamp) }))
      .filter(({ entry, time }) => time && getTodayKey(new Date(time)) === legacyLastDate);
    const latest = sameDayEntries.reduce((max, item) => Math.max(max, item.time), 0);
    migratedLastCompletedAt = new Date(latest || new Date(`${legacyLastDate}T20:00:00`).getTime()).toISOString();
  }

  let completedAt = oldDaily.completedAt || (oldDaily.bonusClaimed ? migratedLastCompletedAt : null);
  let nextAvailableAt = oldDaily.nextAvailableAt || null;
  if (oldDaily.bonusClaimed && completedAt && !nextAvailableAt) {
    nextAvailableAt = new Date(parseTime(completedAt) + COOLDOWN_MS).toISOString();
  }

  const result = {
    ...base,
    ...data,
    version: VERSION,
    name: typeof data.name === "string" ? data.name : base.name,
    level: Math.max(1, Number(data.level) || 1),
    xp: Math.max(0, Number(data.xp) || 0),
    essence: Math.max(0, Number(data.essence) || 0),
    bodyXP,
    skills: { ...base.skills, ...(data.skills || {}) },
    skillXP: { ...base.skillXP, ...(data.skillXP || {}) },
    variationIndex: { ...base.variationIndex, ...(data.variationIndex || {}) },
    variationTargets,
    daily: {
      routineId,
      completed: dailyCompleted,
      bonusClaimed: Boolean(oldDaily.bonusClaimed),
      completedAt,
      nextAvailableAt
    },
    streak: {
      ...base.streak,
      ...(data.streak || {}),
      lastCompletedAt: migratedLastCompletedAt || data.streak?.lastCompletedAt || null
    },
    stats: { ...derivedStats, ...(data.stats || {}) },
    achievements: Array.isArray(data.achievements) ? data.achievements.filter((id) => achievements[id]) : [],
    equippedTitle: titles[data.equippedTitle] ? data.equippedTitle : "awakened",
    shop: {
      owned: Array.isArray(data.shop?.owned) ? data.shop.owned.filter((id) => shopItems[id]) : [],
      equippedTheme: data.shop?.equippedTheme || "default",
      equippedEffect: data.shop?.equippedEffect || "default"
    },
    history
  };

  Object.keys(exercises).forEach((key) => {
    result.skills[key] = Math.max(1, Number(result.skills[key]) || 1);
    result.skillXP[key] = Math.max(0, Number(result.skillXP[key]) || 0);
    const maxVariation = exercises[key].variations.length - 1;
    result.variationIndex[key] = Math.max(0, Math.min(maxVariation, Number(result.variationIndex[key]) || 0));
    if (exercises[key].variations[result.variationIndex[key]].unlock > result.skills[key]) result.variationIndex[key] = 0;
  });

  return result;
}

function loadGame() {
  try {
    const current = localStorage.getItem(SAVE_KEY);
    if (current) return sanitizePlayer(JSON.parse(current));

    for (const key of LEGACY_SAVE_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const migrated = sanitizePlayer(JSON.parse(raw), true);
      localStorage.setItem(SAVE_KEY, JSON.stringify(migrated));
      pendingSystemMessages.push("SAVE ANTERIOR MIGRADO PARA A ALPHA 1.3. Level, XP, Essence, corpo, proficiências e histórico foram preservados.");
      return migrated;
    }

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || key === SAVE_KEY) continue;
      try {
        const candidate = JSON.parse(localStorage.getItem(key));
        if (candidate && typeof candidate.level === "number" && typeof candidate.xp === "number") {
          const migrated = sanitizePlayer(candidate, true);
          localStorage.setItem(SAVE_KEY, JSON.stringify(migrated));
          pendingSystemMessages.push("SAVE ANTIGO MIGRADO PARA A ALPHA 1.3.");
          return migrated;
        }
      } catch (_) {
        // Ignora valores que não sejam saves JSON.
      }
    }
  } catch (error) {
    console.warn("Não foi possível carregar o save:", error);
  }
  return defaultPlayer();
}

function saveGame() {
  try {
    player.version = VERSION;
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  } catch (error) {
    console.warn("Não foi possível salvar:", error);
  }
}

function processStreakGap() {
  const last = parseTime(player.streak.lastCompletedAt);
  if (!last || player.streak.current <= 0) return false;

  const gap = Date.now() - last;
  if (gap <= STREAK_WINDOW_MS) return false;

  if (player.streak.guard > 0 && gap <= GUARD_WINDOW_MS) {
    player.streak.guard -= 1;
    player.streak.lastCompletedAt = new Date(Date.now() - COOLDOWN_MS).toISOString();
    pendingSystemMessages.push("STREAK GUARD ATIVADO. Sua corrente recebeu uma extensão de emergência.");
  } else {
    const lost = Math.min(10, player.essence);
    player.essence -= lost;
    player.streak.current = 0;
    player.streak.lastCompletedAt = null;
    pendingSystemMessages.push(`STREAK QUEBRADO. Corrente reiniciada${lost > 0 ? ` e -${lost} Essence` : ""}.`);
  }
  saveGame();
  return true;
}

function resetDailyIfNeeded() {
  const changed = prepareNextSessionIfReady();
  if (!player.daily || !routines[player.daily.routineId]) {
    player.daily = { routineId: "A", completed: [], bonusClaimed: false, completedAt: null, nextAvailableAt: null };
    saveGame();
    return true;
  }
  return changed;
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  $(screenId).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showNotification(message) {
  const box = $("notification");
  box.textContent = `[ SYSTEM ] ${message}`;
  box.classList.add("show");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => box.classList.remove("show"), 3600);
}

function openModal(title, html) {
  $("modalTitle").textContent = title;
  $("modalContent").innerHTML = html;
  $("modalOverlay").hidden = false;
}

function closeModal() {
  $("modalOverlay").hidden = true;
}

function applyEquippedTheme() {
  const themeClasses = Object.values(shopItems).filter((item) => item.type === "theme").map((item) => item.className);
  document.body.classList.remove(...themeClasses);
  if (player.shop.equippedTheme !== "default") {
    const item = shopItems[player.shop.equippedTheme];
    if (item?.className) document.body.classList.add(item.className);
  }
}

function playLevelEffect(effectId = player.shop.equippedEffect) {
  if (!effectId || effectId === "default") return;
  const effect = shopItems[effectId];
  if (!effect?.effectClass) return;
  const layer = $("levelEffectLayer");
  layer.className = "level-effect-layer";
  void layer.offsetWidth;
  layer.classList.add(effect.effectClass);
  setTimeout(() => { layer.className = "level-effect-layer"; }, 1350);
}

function addXP(amount) {
  player.xp += Math.max(0, Math.round(amount));
  let levels = 0;
  while (player.xp >= xpRequired()) {
    player.xp -= xpRequired();
    player.level += 1;
    levels += 1;
  }
  if (levels > 0) {
    playLevelEffect();
    showNotification(`LEVEL UP. Você alcançou o nível ${player.level}.`);
  }
  return levels;
}

function addBodyXP(rewards, multiplier) {
  const gained = {};
  Object.entries(rewards).forEach(([key, value]) => {
    const amount = Math.max(0, Math.round(value * multiplier));
    player.bodyXP[key] = (player.bodyXP[key] || 0) + amount;
    gained[key] = amount;
  });
  return gained;
}

function addSkillXP(exerciseKey, amount) {
  player.skillXP[exerciseKey] = (player.skillXP[exerciseKey] || 0) + amount;
  let levels = 0;
  while (player.skillXP[exerciseKey] >= skillXPRequired(player.skills[exerciseKey])) {
    player.skillXP[exerciseKey] -= skillXPRequired(player.skills[exerciseKey]);
    player.skills[exerciseKey] += 1;
    levels += 1;
  }
  return levels;
}

function newlyUnlockedVariations(key, oldLevel, newLevel) {
  return exercises[key].variations.filter((variation) => variation.unlock > oldLevel && variation.unlock <= newLevel);
}

function progressionDecision(exerciseKey, performance, difficulty) {
  const exercise = exercises[exerciseKey];
  const current = currentTarget(exerciseKey);
  let next = current;
  let reason = "Objetivo mantido";

  if ((difficulty === "easy" && performance >= 1) || (difficulty === "normal" && performance >= 1.25)) {
    next = Math.min(exercise.maxTarget, current + exercise.step);
    if (next > current) reason = `Próximo objetivo: ${exercise.sets} × ${next}${exercise.unit === "seconds" ? "s" : ""}`;
  } else if (performance < 0.65 && difficulty === "extreme") {
    next = Math.max(exercise.minTarget, current - exercise.step);
    if (next < current) reason = `Objetivo ajustado para ${exercise.sets} × ${next}${exercise.unit === "seconds" ? "s" : ""}`;
  }

  setCurrentTarget(exerciseKey, next);
  return reason;
}

function streakBonusRate() {
  return Math.min(0.25, Math.max(0, (player.streak.current - 1) * 0.05));
}

function completeDailyQuest() {
  if (player.daily.bonusClaimed) return { completed: false, xp: 0, essence: 0 };
  const routine = routines[player.daily.routineId];
  if (!routine.exercises.every((key) => player.daily.completed.includes(key))) return { completed: false, xp: 0, essence: 0 };

  const now = Date.now();
  const last = parseTime(player.streak.lastCompletedAt);
  if (!last || player.streak.current <= 0) {
    player.streak.current = 1;
  } else if (now - last <= STREAK_WINDOW_MS) {
    player.streak.current += 1;
  } else {
    player.streak.current = 1;
  }

  player.streak.lastCompletedAt = new Date(now).toISOString();
  player.streak.best = Math.max(player.streak.best, player.streak.current);
  if (player.streak.current > 0 && player.streak.current % 7 === 0 && player.streak.guard < 1) {
    player.streak.guard = 1;
  }

  const baseXP = 50;
  const bonusXP = Math.round(baseXP * streakBonusRate());
  const totalXP = baseXP + bonusXP;
  const essence = 10;

  player.daily.bonusClaimed = true;
  player.daily.completedAt = new Date(now).toISOString();
  player.daily.nextAvailableAt = new Date(now + COOLDOWN_MS).toISOString();
  player.stats.totalDailyCompletions += 1;
  player.essence += essence;
  addXP(totalXP);

  showNotification(`SYSTEM QUEST CONCLUÍDA. +${totalXP} XP • +${essence} Essence • STREAK ${player.streak.current} • COOLDOWN 12H`);
  return { completed: true, xp: totalXP, essence };
}

function markDailyComplete(exerciseKey) {
  const routine = routines[player.daily.routineId];
  if (!routine.exercises.includes(exerciseKey)) return { completed: false, xp: 0, essence: 0 };
  if (!player.daily.completed.includes(exerciseKey)) player.daily.completed.push(exerciseKey);
  return completeDailyQuest();
}

function performanceLabel(performance) {
  if (performance >= 1.25) return "Acima do objetivo";
  if (performance >= 1) return "Objetivo concluído";
  if (performance >= 0.7) return "Bom progresso";
  return "Sessão registrada";
}

function rewardMultiplier(performance) {
  return Math.max(0.45, Math.min(1.25, performance));
}

function recordExerciseStats(key, values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  player.stats.totalExercises += 1;
  if (key === "cardio") player.stats.totalCardioSeconds += total;
  if (key === "deadHang") player.stats.totalDeadHangSeconds += total;
  if (key === "calfRaise") player.stats.totalCalfReps += total;
  if (key === "pushup") player.stats.totalPushupReps += total;
  if (key === "pullup") player.stats.totalPullupReps += total;
}

function evaluateAchievements(showToast = false) {
  const newlyUnlocked = [];
  Object.entries(achievements).forEach(([id, achievement]) => {
    if (player.achievements.includes(id) || !achievement.test()) return;
    player.achievements.push(id);
    player.essence += achievement.essence;
    addXP(achievement.xp);
    newlyUnlocked.push(id);
  });

  if (newlyUnlocked.length && showToast) {
    const first = achievements[newlyUnlocked[0]];
    showNotification(`CONQUISTA DESBLOQUEADA: ${first.name}${newlyUnlocked.length > 1 ? ` +${newlyUnlocked.length - 1}` : ""}`);
  }
  return newlyUnlocked;
}

function registerExerciseResult(exerciseKey, values, difficulty) {
  const exercise = exercises[exerciseKey];
  const targetPerSet = currentTarget(exerciseKey);
  const targetTotal = targetPerSet * exercise.sets;
  const total = values.reduce((sum, value) => sum + value, 0);
  const performance = targetTotal > 0 ? total / targetTotal : 0;
  const multiplier = rewardMultiplier(performance);

  const earnedXP = Math.max(5, Math.round(exercise.xp * multiplier));
  const earnedEssence = Math.max(1, Math.round(exercise.essence * multiplier));
  const bodyGains = addBodyXP(exercise.body, multiplier);
  const skillGained = Math.max(5, Math.round(22 * multiplier));
  const oldSkillLevel = player.skills[exerciseKey];
  const skillLevels = addSkillXP(exerciseKey, skillGained);
  const unlockedVariations = newlyUnlockedVariations(exerciseKey, oldSkillLevel, player.skills[exerciseKey]);

  addXP(earnedXP);
  player.essence += earnedEssence;
  recordExerciseStats(exerciseKey, values);

  let dailyReward = { completed: false, xp: 0, essence: 0 };
  if (performance >= 0.7) dailyReward = markDailyComplete(exerciseKey);
  const progression = progressionDecision(exerciseKey, performance, difficulty);

  player.history.push({
    id: `${Date.now()}-${exerciseKey}`,
    timestamp: new Date().toISOString(),
    exerciseKey,
    exercise: exercise.name,
    variation: currentVariation(exerciseKey).name,
    values,
    targetPerSet,
    performance,
    difficulty,
    xp: earnedXP,
    essence: earnedEssence,
    bodyGains,
    skillXP: skillGained,
    routineId: player.daily.routineId
  });
  player.history = player.history.slice(-500);

  const newAchievements = evaluateAchievements(false);
  saveGame();
  updateUI(false);

  const bodyText = Object.entries(bodyGains)
    .filter(([, gain]) => gain > 0)
    .map(([key, gain]) => `<strong>${bodyInfo[key].name} +${gain}</strong>`)
    .join(" • ");

  const variationText = unlockedVariations.length
    ? `<p class="reward-line">NOVA VARIAÇÃO DESBLOQUEADA: <strong>${unlockedVariations.map((v) => v.name).join(", ")}</strong></p>`
    : "";

  const achievementText = newAchievements.length
    ? `<p class="reward-line">CONQUISTA: <strong>${newAchievements.map((id) => achievements[id].name).join(", ")}</strong></p>`
    : "";

  const dailyText = dailyReward.completed
    ? `<p><strong>System Quest concluída:</strong> +${dailyReward.xp} XP • +${dailyReward.essence} Essence • Streak ${player.streak.current}</p>`
    : "";

  openModal(
    performanceLabel(performance),
    `<p><strong>${exercise.name}</strong> — ${currentVariation(exerciseKey).name}: ${Math.round(performance * 100)}% do objetivo atual.</p>
     <p>Recompensas: <strong>+${earnedXP} XP</strong> • <strong>+${earnedEssence} Essence</strong></p>
     <p>Seu corpo recebeu progresso em: ${bodyText}.</p>
     <p><strong>${progression}</strong>${skillLevels > 0 ? `<br>Proficiência aumentou para Lv. ${player.skills[exerciseKey]}.` : ""}</p>
     ${dailyText}${variationText}${achievementText}`
  );
}

function masteryLevel(group) {
  const levels = group.exercises.map((key) => player.skills[key] || 1);
  return Math.max(1, Math.floor(levels.reduce((sum, value) => sum + value, 0) / levels.length));
}

function bestSetForExercise(key) {
  let best = 0;
  player.history.forEach((entry) => {
    if (entry.exerciseKey !== key || !Array.isArray(entry.values)) return;
    best = Math.max(best, ...entry.values.map((value) => Number(value) || 0));
  });
  return best;
}

function unlockedTitleIds() {
  return Object.keys(titles).filter((id) => titles[id].test());
}

function updateUI(runAchievementCheck = true) {
  const sessionAdvanced = resetDailyIfNeeded();
  if (sessionAdvanced) showNotification("COOLDOWN ENCERRADO. Uma nova System Quest foi liberada.");
  if (runAchievementCheck) {
    const unlocked = evaluateAchievements(false);
    if (unlocked.length) saveGame();
  }

  applyEquippedTheme();

  $("playerName").textContent = player.name;
  $("rankValue").textContent = getRank();
  $("levelValue").textContent = player.level;
  $("essenceValue").textContent = player.essence;
  $("shopEssenceValue").textContent = player.essence;

  if (!titles[player.equippedTitle]?.test()) player.equippedTitle = "awakened";
  $("equippedTitleButton").textContent = `[ ${titles[player.equippedTitle].name} ]`;

  const needed = xpRequired();
  $("xpText").textContent = `${player.xp} / ${needed} XP`;
  $("xpBar").style.width = `${Math.min(100, (player.xp / needed) * 100)}%`;

  const routine = routines[player.daily.routineId];
  const completed = routine.exercises.filter((key) => player.daily.completed.includes(key)).length;
  const locked = sessionLocked();
  $("dailyProgress").textContent = `${completed}/${routine.exercises.length}`;
  $("routineChip").textContent = routine.name;
  $("routineTitle").textContent = routine.subtitle;
  $("streakValue").textContent = `🔥 ${player.streak.current}`;
  $("streakBonusText").textContent = `Bônus +${Math.round(streakBonusRate() * 100)}%`;
  $("streakGuardValue").textContent = player.streak.guard;

  if (locked) {
    $("dailyMessage").textContent = "Quest concluída. Recuperação em andamento — a próxima sessão libera após o cooldown mínimo.";
  } else if (player.daily.bonusClaimed) {
    $("dailyMessage").textContent = "Cooldown encerrado. Preparando a próxima quest...";
  } else {
    $("dailyMessage").textContent = `Você concluiu ${completed} de ${routine.exercises.length} missões. Para o streak, finalize a próxima quest em até 36h da anterior.`;
  }

  $("startTrainingButton").disabled = locked;
  updateCooldownUI();

  renderBodyPreview();
  renderMissions();
  renderStatus();
  renderProgression();
  renderAchievements();
  renderTitles();
  renderShop();
  renderHistory();
}

function renderBodyPreview() {
  $("bodyPreview").innerHTML = Object.keys(bodyInfo).map((key) => `
    <div class="body-mini">
      <span>${bodyInfo[key].name}</span>
      <div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(key)}%"></div></div>
      <strong>${bodyLevel(key)}</strong>
    </div>
  `).join("");
}

function renderMissions() {
  const routine = routines[player.daily.routineId];
  const locked = sessionLocked();
  $("missionsGrid").innerHTML = routine.exercises.map((key) => {
    const exercise = exercises[key];
    const done = player.daily.completed.includes(key);
    return `
      <article class="mission-card ${done ? "complete" : ""} ${locked ? "locked" : ""}">
        <div class="mission-top">
          <div><h3>${exercise.short}</h3><p>${targetText(key)}</p></div>
          <span class="status-pill">${done ? "✓ COMPLETA" : locked ? "COOLDOWN" : "PENDENTE"}</span>
        </div>
        <div class="mission-focus">${bodyNamesForExercise(key).join(" • ")}</div>
        <p>${currentVariation(key).name}</p>
        <div class="mission-reward">Base: +${exercise.xp} XP • +${exercise.essence} Essence</div>
        <button class="ghost-button mission-button" data-exercise="${key}" type="button" ${locked ? "disabled" : ""}>${locked ? "RECUPERANDO" : done ? "TREINAR NOVAMENTE" : "TREINAR"}</button>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-exercise]").forEach((button) => {
    button.addEventListener("click", () => startSingleExercise(button.dataset.exercise));
  });
}

function relatedExercisesForBody(bodyKey) {
  return Object.entries(exercises)
    .filter(([, exercise]) => Number(exercise.body?.[bodyKey]) > 0)
    .sort((a, b) => Number(b[1].body[bodyKey]) - Number(a[1].body[bodyKey]))
    .map(([key, exercise]) => ({ key, name: exercise.short, weight: exercise.body[bodyKey] }));
}

function selectBodyZone(key, scroll = false) {
  if (!bodyInfo[key]) return;
  selectedBodyZone = key;
  renderBodyMap();
  if (scroll && $("bodyMapDetail")) $("bodyMapDetail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderBodyMap() {
  const key = bodyInfo[selectedBodyZone] ? selectedBodyZone : "chest";
  const info = bodyInfo[key];
  const related = relatedExercisesForBody(key);

  document.querySelectorAll("[data-body-zone]").forEach((zone) => {
    const active = zone.dataset.bodyZone === key;
    zone.classList.toggle("active", active);
    zone.classList.toggle("muted", !active);
    zone.setAttribute("aria-pressed", active ? "true" : "false");
  });

  document.querySelectorAll("[data-body-status]").forEach((card) => {
    card.classList.toggle("selected", card.dataset.bodyStatus === key);
  });

  if ($("bodyMapDetail")) {
    $("bodyMapDetail").innerHTML = `
      <div class="sync-code">${info.code}</div>
      <h3>${info.name}</h3>
      <div class="map-level">Lv. ${bodyLevel(key)}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(key)}%"></div></div>
      <div class="map-xp">${bodyProgress(key)}/100 para o próximo nível</div>
      <p>${info.description}</p>
      <p><strong>Como evolui:</strong> ${info.focus}</p>
      <div class="body-exercise-links">${related.map((item) => `<span>${item.name}</span>`).join("")}</div>
    `;
  }
}

function bindBodyMapEvents() {
  document.querySelectorAll("[data-body-zone]").forEach((zone) => {
    zone.onclick = () => selectBodyZone(zone.dataset.bodyZone);
    zone.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectBodyZone(zone.dataset.bodyZone);
      }
    };
  });

  document.querySelectorAll("[data-body-status]").forEach((card) => {
    card.onclick = () => selectBodyZone(card.dataset.bodyStatus, true);
    card.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectBodyZone(card.dataset.bodyStatus, true);
      }
    };
  });
}

function renderStatus() {
  $("bodyStatusList").innerHTML = Object.entries(bodyInfo).map(([key, info]) => `
    <div class="attribute-detail ${selectedBodyZone === key ? "selected" : ""}" data-body-status="${key}" role="button" tabindex="0">
      <div class="attribute-detail-head">
        <strong>${info.name}</strong>
        <strong>Lv. ${bodyLevel(key)}</strong>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(key)}%"></div></div>
      <p>${info.description} ${bodyProgress(key)}/100 para o próximo nível.</p>
    </div>
  `).join("");

  $("masteryList").innerHTML = Object.values(masteryGroups).map((group) => {
    const level = masteryLevel(group);
    const names = group.exercises.map((key) => exercises[key].short).join(" + ");
    return `
      <div class="mastery-row">
        <div class="mastery-head"><span class="mastery-name">${group.name}</span><span class="mastery-level">Lv. ${level}</span></div>
        <div class="mastery-meta">${group.label} • ${names}</div>
      </div>
    `;
  }).join("");

  $("skillsList").innerHTML = Object.entries(exercises).map(([key, exercise]) => {
    const required = skillXPRequired(player.skills[key]);
    const progress = player.skillXP[key];
    const best = bestSetForExercise(key);
    return `
      <div class="skill-row">
        <div class="skill-head"><strong>${exercise.name}</strong><strong>Lv. ${player.skills[key]}</strong></div>
        <div class="skill-meta">${currentVariation(key).name} • Meta ${targetText(key)} • Melhor série ${best || "—"}${exercise.unit === "seconds" && best ? "s" : ""}</div>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (progress / required) * 100)}%"></div></div>
        <p>${progress}/${required} XP de proficiência</p>
      </div>
    `;
  }).join("");

  renderBodyMap();
  bindBodyMapEvents();
}

function renderProgression() {
  $("progressionList").innerHTML = Object.entries(exercises).map(([key, exercise]) => {
    const activeIndex = player.variationIndex[key];
    const nodes = exercise.variations.map((variation, index) => {
      const unlocked = player.skills[key] >= variation.unlock;
      const active = index === activeIndex;
      return `
        <div class="path-node ${unlocked ? "unlocked" : "locked"} ${active ? "active" : ""}">
          <strong>${variation.name}</strong>
          <small>${unlocked ? `Desbloqueada no Lv. ${variation.unlock}` : `Requer proficiência Lv. ${variation.unlock}`}</small>
          ${unlocked
            ? `<button class="equip-button" data-variation-exercise="${key}" data-variation-index="${index}" type="button" ${active ? "disabled" : ""}>${active ? "EQUIPADA" : "EQUIPAR"}</button>`
            : `<button class="equip-button" type="button" disabled>🔒 BLOQUEADA</button>`}
        </div>
      `;
    }).join("");

    return `
      <div class="progression-card">
        <div class="progression-head">
          <div><h3>${exercise.name}</h3><p>${bodyNamesForExercise(key).join(" • ")}</p></div>
          <span>PROF. LV. ${player.skills[key]}</span>
        </div>
        <div class="path-nodes">${nodes}</div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-variation-exercise]").forEach((button) => {
    button.addEventListener("click", () => equipVariation(button.dataset.variationExercise, Number(button.dataset.variationIndex)));
  });
}

function equipVariation(key, index) {
  const exercise = exercises[key];
  const variation = exercise?.variations[index];
  if (!variation || player.skills[key] < variation.unlock) return;
  player.variationIndex[key] = index;
  if (!player.variationTargets[key][String(index)]) player.variationTargets[key][String(index)] = variation.baseTarget;
  saveGame();
  updateUI(false);
  showNotification(`${variation.name.toUpperCase()} EQUIPADA.`);
}

function renderAchievements() {
  const unlockedCount = player.achievements.length;
  $("achievementSummary").textContent = `${unlockedCount}/${Object.keys(achievements).length} conquistas desbloqueadas. As recompensas são recebidas automaticamente.`;
  $("achievementsList").innerHTML = Object.entries(achievements).map(([id, achievement]) => {
    const unlocked = player.achievements.includes(id);
    return `
      <div class="achievement-card ${unlocked ? "unlocked" : ""}">
        <div class="achievement-icon">${achievement.icon}</div>
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
        <div class="reward-line">+${achievement.xp} XP • +${achievement.essence} Essence</div>
        <span class="achievement-state">${unlocked ? "✓ DESBLOQUEADA" : "BLOQUEADA"}</span>
      </div>
    `;
  }).join("");
}

function renderTitles() {
  const unlocked = new Set(unlockedTitleIds());
  $("titlesList").innerHTML = Object.entries(titles).map(([id, title]) => {
    const isUnlocked = unlocked.has(id);
    const equipped = player.equippedTitle === id;
    return `
      <div class="title-card ${isUnlocked ? "" : "locked"} ${equipped ? "equipped" : ""}">
        <div class="title-head"><span class="title-tag">[ ${title.name} ]</span><span>${equipped ? "✓" : isUnlocked ? "◆" : "🔒"}</span></div>
        <p>${title.description}</p>
        <button class="equip-button" data-title-id="${id}" type="button" ${!isUnlocked || equipped ? "disabled" : ""}>${equipped ? "EQUIPADO" : isUnlocked ? "EQUIPAR" : "BLOQUEADO"}</button>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-title-id]").forEach((button) => {
    button.addEventListener("click", () => equipTitle(button.dataset.titleId));
  });
}

function equipTitle(id) {
  if (!titles[id]?.test()) return;
  player.equippedTitle = id;
  saveGame();
  updateUI(false);
  showNotification(`TÍTULO EQUIPADO: ${titles[id].name}`);
}

function renderShop() {
  $("shopEssenceValue").textContent = player.essence;
  $("shopList").innerHTML = Object.entries(shopItems).map(([id, item]) => {
    const owned = player.shop.owned.includes(id);
    const equipped = item.type === "theme" ? player.shop.equippedTheme === id : player.shop.equippedEffect === id;
    return `
      <div class="shop-card ${owned ? "owned" : ""}">
        <div class="shop-head"><h3>${item.name}</h3><span class="shop-type">${item.typeLabel}</span></div>
        <p>${item.description}</p>
        <div class="shop-price">
          <strong>${owned ? "ADQUIRIDO" : `${item.price} Essence`}</strong>
          <div class="shop-actions">
            <button class="shop-button" data-shop-preview="${id}" type="button">PREVIEW</button>
            <button class="shop-button" data-shop-action="${id}" type="button" ${equipped ? "disabled" : ""}>${equipped ? "EQUIPADO" : owned ? "EQUIPAR" : "COMPRAR"}</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-shop-preview]").forEach((button) => {
    button.addEventListener("click", () => previewShopItem(button.dataset.shopPreview));
  });
  document.querySelectorAll("[data-shop-action]").forEach((button) => {
    button.addEventListener("click", () => buyOrEquipShopItem(button.dataset.shopAction));
  });
}

function previewShopItem(id) {
  const item = shopItems[id];
  if (!item) return;
  if (item.type === "effect") {
    playLevelEffect(id);
    return;
  }

  const allThemeClasses = Object.values(shopItems).filter((entry) => entry.type === "theme").map((entry) => entry.className);
  document.body.classList.remove(...allThemeClasses);
  document.body.classList.add(item.className);
  showNotification(`PREVIEW: ${item.name}`);
  setTimeout(applyEquippedTheme, 1800);
}

function buyOrEquipShopItem(id) {
  const item = shopItems[id];
  if (!item) return;
  const owned = player.shop.owned.includes(id);

  if (!owned) {
    if (player.essence < item.price) {
      showNotification(`ESSENCE INSUFICIENTE. Faltam ${item.price - player.essence}.`);
      return;
    }
    player.essence -= item.price;
    player.shop.owned.push(id);
    showNotification(`${item.name.toUpperCase()} ADQUIRIDO.`);
  }

  if (item.type === "theme") player.shop.equippedTheme = id;
  if (item.type === "effect") player.shop.equippedEffect = id;
  saveGame();
  updateUI(false);
  if (item.type === "effect") playLevelEffect(id);
}

function renderHistory() {
  const list = $("historyList");
  const cardioMinutes = Math.floor(player.stats.totalCardioSeconds / 60);
  $("historyHighlights").innerHTML = `
    <div class="history-highlight"><span>EXERCÍCIOS</span><strong>${player.stats.totalExercises}</strong></div>
    <div class="history-highlight"><span>DAILIES</span><strong>${player.stats.totalDailyCompletions}</strong></div>
    <div class="history-highlight"><span>BEST STREAK</span><strong>🔥 ${player.streak.best}</strong></div>
    <div class="history-highlight"><span>CARDIO TOTAL</span><strong>${cardioMinutes} min</strong></div>
  `;

  if (!player.history.length) {
    list.innerHTML = `<div class="empty-state">Nenhum treino registrado ainda. Seu primeiro resultado aparecerá aqui.</div>`;
    return;
  }

  list.innerHTML = [...player.history].reverse().map((entry) => {
    const date = new Date(entry.timestamp);
    const formatted = Number.isNaN(date.getTime()) ? "Data desconhecida" : new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
    }).format(date);

    const bodyGains = entry.bodyGains || legacyHistoryBodyGains(entry);
    const gains = Object.entries(bodyGains)
      .filter(([key, value]) => value > 0 && Boolean(bodyInfo[key]))
      .map(([key, value]) => bodyInfo[key] ? `+${value} ${bodyInfo[key].name}` : "")
      .filter(Boolean)
      .join(" • ");

    return `
      <div class="history-item">
        <div class="history-head"><strong>${entry.exercise || exercises[entry.exerciseKey]?.name || "Exercício"}</strong><span>${formatted}</span></div>
        <p>${entry.variation ? `${entry.variation} • ` : ""}${Math.round((entry.performance || 0) * 100)}% do objetivo • +${entry.xp || 0} XP • +${entry.essence || 0} Essence</p>
        <div class="history-gains">${gains || "Registro da Alpha 1.1 preservado"}</div>
      </div>
    `;
  }).join("");
}

function legacyHistoryBodyGains(entry) {
  if (!entry.statGains) return {};
  const converted = convertLegacyAttributes(entry.statGains);
  const max = Math.max(...Object.values(converted), 1);
  const scaled = {};
  Object.entries(converted).forEach(([key, value]) => {
    scaled[key] = Math.round((value / max) * 8);
  });
  return scaled;
}

function updateCooldownUI() {
  if (!$("cooldownInfo") || !$("dailyDate")) return;

  if (sessionLocked()) {
    const remaining = cooldownRemaining();
    const text = formatDuration(remaining);
    $("cooldownInfo").className = "cooldown-info locked";
    $("cooldownInfo").textContent = `⏳ RECUPERAÇÃO • ${text}`;
    $("dailyDate").textContent = `COOLDOWN ${text}`;
    $("startTrainingButton").disabled = true;
    return;
  }

  if (player.daily.bonusClaimed && prepareNextSessionIfReady()) {
    updateUI(false);
    return;
  }

  $("cooldownInfo").className = "cooldown-info ready";
  $("cooldownInfo").textContent = "◆ QUEST DISPONÍVEL";
  $("dailyDate").textContent = "DISPONÍVEL";
  $("startTrainingButton").disabled = false;
}

function startTimers() {
  clearInterval(cooldownTimer);
  clearInterval(streakTimer);
  cooldownTimer = setInterval(updateCooldownUI, 1000);
  streakTimer = setInterval(() => {
    const changed = processStreakGap();
    if (changed) updateUI(false);
  }, 60000);
}

function exportSave() {
  saveGame();
  const payload = JSON.stringify({ app: "Project Arise", version: VERSION, exportedAt: new Date().toISOString(), player }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `project-arise-save-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showNotification("SAVE EXPORTADO.");
}

async function importSaveFile(file) {
  if (!file) return;
  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const candidate = parsed?.player || parsed;
    const imported = sanitizePlayer(candidate, true);
    const confirmed = window.confirm("Importar este save substituirá o progresso atual neste navegador. Continuar?");
    if (!confirmed) return;
    player = imported;
    saveGame();
    processStreakGap();
    resetDailyIfNeeded();
    updateUI(false);
    showScreen("dashboardScreen");
    showNotification("SAVE IMPORTADO COM SUCESSO.");
  } catch (error) {
    console.error(error);
    openModal("Falha ao importar", "<p>O arquivo não parece ser um save válido do Project Arise.</p>");
  } finally {
    $("saveImportInput").value = "";
  }
}

function resetProgress() {
  const confirmed = window.confirm("RESET TOTAL: apagar Level, XP, Essence, corpo, streak, histórico, loja e desbloqueios deste navegador? Esta ação não pode ser desfeita sem um backup.");
  if (!confirmed) return;
  const confirmedAgain = window.confirm("Última confirmação: deseja realmente voltar ao início da Alpha 1.3?");
  if (!confirmedAgain) return;

  [SAVE_KEY, ...LEGACY_SAVE_KEYS].forEach((key) => localStorage.removeItem(key));
  player = defaultPlayer();
  selectedBodyZone = "chest";
  saveGame();
  updateUI(false);
  showScreen("dashboardScreen");
  showNotification("PROGRESSO RESETADO. NOVO DESPERTAR INICIADO.");
}

async function installPwa() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch (_) {}
    deferredInstallPrompt = null;
    return;
  }

  const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone;
  if (standalone) {
    showNotification("PROJECT ARISE JÁ ESTÁ INSTALADO.");
    return;
  }

  openModal("Instalar no celular", `<p>Para instalar como app, o Project Arise precisa estar aberto por um endereço <strong>HTTPS</strong> (não apenas pelo arquivo <code>index.html</code>).</p><p>Quando estiver hospedado, abra no Chrome/Edge do celular e use <strong>Adicionar à tela inicial</strong> ou <strong>Instalar app</strong>. A Alpha 1.3 já inclui manifest, ícones e modo offline para isso.</p>`);
}

function startTraining() {
  resetDailyIfNeeded();
  if (sessionLocked()) {
    showNotification(`RECUPERAÇÃO ATIVA. Próxima quest em ${formatDuration(cooldownRemaining())}.`);
    return;
  }
  const routine = routines[player.daily.routineId];
  const pending = routine.exercises.filter((key) => !player.daily.completed.includes(key));
  trainingQueue = pending.length ? pending : [...routine.exercises];
  trainingIndex = 0;
  singleExerciseMode = false;
  showScreen("trainingScreen");
  loadTrainingExercise();
}

function startSingleExercise(exerciseKey) {
  if (sessionLocked()) {
    showNotification(`RECUPERAÇÃO ATIVA. Próxima quest em ${formatDuration(cooldownRemaining())}.`);
    return;
  }
  trainingQueue = [exerciseKey];
  trainingIndex = 0;
  singleExerciseMode = true;
  showScreen("trainingScreen");
  loadTrainingExercise();
}

function loadTrainingExercise() {
  const key = trainingQueue[trainingIndex];
  const exercise = exercises[key];
  if (!exercise) {
    finishTraining();
    return;
  }

  $("trainingStepText").textContent = `${trainingIndex + 1} / ${trainingQueue.length}`;
  $("trainingExerciseName").textContent = exercise.name;
  $("trainingVariationName").textContent = `Variação: ${currentVariation(key).name}`;
  $("trainingExerciseDescription").textContent = exercise.description;
  $("trainingCategoryChip").textContent = exercise.category;
  $("trainingTarget").textContent = targetText(key);
  $("skillLevelText").textContent = `Proficiência Lv. ${player.skills[key]}`;
  $("trainingSafetyNote").textContent = exercise.safety || "Registre apenas o que você fez com técnica aceitável. Não precisa chegar à falha para progredir.";
  $("saveExerciseButton").textContent = trainingIndex === trainingQueue.length - 1 ? "FINALIZAR ✓" : "REGISTRAR →";
  $("trainingBodyTargets").innerHTML = bodyNamesForExercise(key).map((name) => `<span class="body-target">${name}</span>`).join("");

  const target = currentTarget(key);
  $("setInputs").innerHTML = Array.from({ length: exercise.sets }, (_, index) => `
    <div class="set-row">
      <div>
        <label for="set-${index}">${exercise.unit === "seconds" ? "Rodada" : "Série"} ${index + 1}</label>
        <small>Meta: ${target}${exercise.unit === "seconds" ? " segundos" : " repetições"}</small>
      </div>
      <input id="set-${index}" class="set-value" type="number" inputmode="numeric" min="0" max="999" value="${target}" aria-label="Resultado ${index + 1}" />
    </div>
  `).join("");

  const normal = document.querySelector('input[name="difficulty"][value="normal"]');
  if (normal) normal.checked = true;
}

function collectTrainingValues() {
  return [...document.querySelectorAll(".set-value")].map((input) => {
    const parsed = Number(input.value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.round(parsed);
  });
}

function saveCurrentExercise() {
  const key = trainingQueue[trainingIndex];
  const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || "normal";
  const values = collectTrainingValues();
  registerExerciseResult(key, values, difficulty);

  if (trainingIndex < trainingQueue.length - 1) {
    trainingIndex += 1;
    loadTrainingExercise();
  } else {
    finishTraining(false);
  }
}

function skipCurrentExercise() {
  if (trainingIndex < trainingQueue.length - 1) {
    trainingIndex += 1;
    loadTrainingExercise();
    showNotification("Exercício pulado. Você pode voltar a ele depois.");
  } else {
    finishTraining();
  }
}

function finishTraining(showMessage = true) {
  showScreen("dashboardScreen");
  updateUI();
  if (showMessage && !singleExerciseMode) showNotification("Sessão encerrada. Seu progresso foi salvo.");
}

function clearHistory() {
  if (!player.history.length) return;
  const confirmed = window.confirm("Apagar apenas o histórico de treinos? Nível, XP, corpo, streak e progresso serão mantidos.");
  if (!confirmed) return;
  player.history = [];
  saveGame();
  renderHistory();
  showNotification("Histórico apagado.");
}

function bindEvents() {
  $("startTrainingButton").addEventListener("click", startTraining);
  $("saveExerciseButton").addEventListener("click", saveCurrentExercise);
  $("skipExerciseButton").addEventListener("click", skipCurrentExercise);
  $("exitTrainingButton").addEventListener("click", () => finishTraining());

  $("statusButton").addEventListener("click", () => { updateUI(); showScreen("statusScreen"); });
  $("openStatusButton").addEventListener("click", () => { updateUI(); showScreen("statusScreen"); });
  $("progressionButton").addEventListener("click", () => { updateUI(); showScreen("progressionScreen"); });
  $("achievementsButton").addEventListener("click", () => { updateUI(); showScreen("achievementsScreen"); });
  $("titlesButton").addEventListener("click", () => { updateUI(); showScreen("titlesScreen"); });
  $("equippedTitleButton").addEventListener("click", () => { updateUI(); showScreen("titlesScreen"); });
  $("shopButton").addEventListener("click", () => { updateUI(); showScreen("shopScreen"); });
  $("historyButton").addEventListener("click", () => { updateUI(); showScreen("historyScreen"); });
  $("settingsButton").addEventListener("click", () => { updateUI(false); showScreen("settingsScreen"); });
  $("clearHistoryButton").addEventListener("click", clearHistory);
  $("exportSaveButton").addEventListener("click", exportSave);
  $("importSaveButton").addEventListener("click", () => $("saveImportInput").click());
  $("saveImportInput").addEventListener("change", () => importSaveFile($("saveImportInput").files?.[0]));
  $("resetProgressButton").addEventListener("click", resetProgress);
  $("installPwaButton").addEventListener("click", installPwa);

  document.querySelectorAll(".back-dashboard").forEach((button) => {
    button.addEventListener("click", () => { updateUI(); showScreen("dashboardScreen"); });
  });

  $("systemButton").addEventListener("click", () => {
    openModal("Project Arise — Alpha 1.3 • Body Sync", `
      <ul>
        <li><strong>Body Sync:</strong> toque nas regiões do mapa corporal para ver nível, progresso e exercícios relacionados.</li>
        <li><strong>Cooldown:</strong> concluir as quatro missões bloqueia a próxima System Quest por 12 horas.</li>
        <li><strong>Streak:</strong> conclua a próxima quest em até 36 horas da anterior para manter a corrente. O bônus continua limitado a +25%.</li>
        <li><strong>Streak Guard:</strong> a cada 7 de streak você recebe uma proteção (máx. 1) para um atraso moderado.</li>
        <li><strong>Treino A/B:</strong> alterna após cada quest completa, em vez de depender da meia-noite.</li>
        <li><strong>Mobile/PWA:</strong> a interface foi ajustada para toque e já inclui os arquivos necessários para instalação quando hospedada em HTTPS.</li>
        <li><strong>Configurações:</strong> exporte, importe ou resete totalmente o save durante a fase Alpha.</li>
      </ul>
    `);
  });

  $("closeModalButton").addEventListener("click", closeModal);
  $("modalOverlay").addEventListener("click", (event) => {
    if (event.target === $("modalOverlay")) closeModal();
  });
}

player = loadGame();
processStreakGap();
resetDailyIfNeeded();
bindEvents();
updateUI();
saveGame();
startTimers();

if (window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone) {
  document.body.classList.add("standalone-mode");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  showNotification("PROJECT ARISE INSTALADO.");
});

if ("serviceWorker" in navigator && ["http:", "https:"].includes(location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((error) => console.warn("Service worker:", error));
  });
}

if (pendingSystemMessages.length) {
  setTimeout(() => openModal("SYSTEM UPDATE", pendingSystemMessages.map((message) => `<p>${message}</p>`).join("")), 250);
}
