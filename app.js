"use strict";

const SAVE_KEY = "projectAriseAlpha15";
const LEGACY_SAVE_KEYS = ["projectAriseAlpha14", "projectAriseAlpha13", "projectAriseAlpha12", "projectAriseAlpha11", "projectAriseSave", "projectAscensionSave"];
const VERSION = "1.5.0";
const COOLDOWN_MS = 12 * 60 * 60 * 1000;
const STREAK_WINDOW_MS = 36 * 60 * 60 * 1000;
const GUARD_WINDOW_MS = 60 * 60 * 60 * 1000;

const ranks = ["E-", "E", "E+", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S-", "S", "S+"];

const bodyInfo = {
  chest: { name: "Peito", code: "PECTORAL SYNC", description: "Peitoral e estruturas que estabilizam o ombro durante movimentos de empurrar.", focus: "Flexões e suas progressões são a principal fonte de progresso aqui." },
  back: { name: "Costas", code: "BACK SYNC", description: "Dorsais, região escapular e parte superior das costas usadas nas puxadas e suspensões.", focus: "Barra fixa e Dead Hang sustentam esta progressão." },
  arms: { name: "Braços & Pegada", code: "GRIP SYNC", description: "Bíceps, tríceps, antebraços e capacidade de manter uma pegada firme.", focus: "Barra, Dead Hang e flexões contribuem em intensidades diferentes." },
  core: { name: "Core & Abdômen", code: "CORE SYNC", description: "Abdômen, oblíquos, lombar e controle do tronco. Agora inclui trabalho dinâmico de abdômen além da prancha.", focus: "Prancha e Abdominais são as fontes principais; outros movimentos também estabilizam o tronco." },
  legs: { name: "Pernas", code: "LEG SYNC", description: "Quadríceps, glúteos e cadeia posterior envolvidos na base dos movimentos.", focus: "Agachamentos e cardio controlado alimentam esta região." },
  calves: { name: "Panturrilhas", code: "CALF SYNC", description: "Panturrilhas e controle do tornozelo durante elevações e deslocamentos.", focus: "Elevação de panturrilha é o estímulo principal; cardio também contribui um pouco." },
  breath: { name: "Fôlego", code: "CONDITIONING", description: "Capacidade cardiorrespiratória e tolerância a esforço contínuo. É mostrada como uma aura no tórax por não ser um músculo isolado.", focus: "Cardio intervalado é a principal fonte de progresso de fôlego." }
};

const exercises = {
  pushup: {
    name: "Flexão", short: "Flexão", category: "PUSH",
    description: "Empurre o corpo mantendo tronco e quadril alinhados. Pare antes da técnica desmontar.",
    unit: "reps", sets: 3, minTarget: 1, maxTarget: 18, step: 1, xp: 20, essence: 4,
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
    name: "Barra fixa", short: "Barra", category: "PULL",
    description: "Puxe com controle, evitando embalo. Use a variação que você consegue executar com técnica aceitável.",
    unit: "reps", sets: 3, minTarget: 1, maxTarget: 12, step: 1, xp: 25, essence: 5,
    body: { back: 12, arms: 10, core: 2 },
    variations: [
      { name: "Barra fixa", unlock: 1, baseTarget: 1 },
      { name: "Barra com pausa no topo", unlock: 4, baseTarget: 1 },
      { name: "Barra com descida lenta", unlock: 7, baseTarget: 1 },
      { name: "Chest-to-bar controlada", unlock: 11, baseTarget: 1 }
    ]
  },
  squat: {
    name: "Agachamento", short: "Agachamento", category: "LEGS",
    description: "Desça com controle e use uma amplitude confortável, mantendo os pés firmes no chão.",
    unit: "reps", sets: 3, minTarget: 4, maxTarget: 30, step: 2, xp: 20, essence: 4,
    body: { legs: 12, core: 3, breath: 2 },
    variations: [
      { name: "Agachamento padrão", unlock: 1, baseTarget: 8 },
      { name: "Agachamento pausado", unlock: 4, baseTarget: 6 },
      { name: "Agachamento tempo 3s", unlock: 7, baseTarget: 6 },
      { name: "Split squat", unlock: 10, baseTarget: 5 }
    ]
  },
  plank: {
    name: "Prancha", short: "Prancha", category: "CORE",
    description: "Mantenha abdômen e glúteos firmes, respirando normalmente e sem deixar o quadril cair.",
    unit: "seconds", sets: 3, minTarget: 10, maxTarget: 75, step: 5, xp: 18, essence: 4,
    body: { core: 14, arms: 2, breath: 1 },
    variations: [
      { name: "Prancha padrão", unlock: 1, baseTarget: 15 },
      { name: "Prancha com braços mais à frente", unlock: 4, baseTarget: 12 },
      { name: "Prancha RKC", unlock: 8, baseTarget: 10 }
    ]
  },
  abs: {
    name: "Abdominais", short: "Abdômen", category: "CORE",
    description: "Faça a repetição devagar e controle a volta. Evite puxar o pescoço e interrompa se sentir dor lombar fora do esforço normal.",
    unit: "reps", sets: 3, minTarget: 4, maxTarget: 24, step: 2, xp: 20, essence: 4,
    body: { core: 15, legs: 2, breath: 1 },
    variations: [
      { name: "Reverse Crunch", unlock: 1, baseTarget: 6 },
      { name: "Elevação de joelhos deitado", unlock: 4, baseTarget: 6 },
      { name: "Elevação de pernas deitado", unlock: 7, baseTarget: 5 },
      { name: "Hanging Knee Raise", unlock: 10, baseTarget: 4 },
      { name: "Hanging Leg Raise", unlock: 14, baseTarget: 3 }
    ]
  },
  calfRaise: {
    name: "Elevação de panturrilha", short: "Panturrilha", category: "LEGS",
    description: "Suba na ponta dos pés, faça uma pequena pausa no alto e desça controlando. Use apoio se precisar de equilíbrio.",
    unit: "reps", sets: 3, minTarget: 6, maxTarget: 35, step: 2, xp: 18, essence: 4,
    body: { calves: 12, legs: 4 },
    variations: [
      { name: "Elevação bilateral", unlock: 1, baseTarget: 10 },
      { name: "Elevação com pausa de 2s", unlock: 4, baseTarget: 8 },
      { name: "Elevação unilateral assistida", unlock: 8, baseTarget: 5 }
    ]
  },
  deadHang: {
    name: "Dead Hang", short: "Pegada", category: "PULL",
    description: "Fique suspenso na barra sem balançar, com pegada confortável. Encerre a série se a pegada abrir ou houver dor no ombro.",
    unit: "seconds", sets: 3, minTarget: 5, maxTarget: 60, step: 5, xp: 20, essence: 4,
    body: { arms: 13, back: 4, core: 2 },
    variations: [
      { name: "Dead Hang confortável", unlock: 1, baseTarget: 10 },
      { name: "Active Hang", unlock: 4, baseTarget: 8 },
      { name: "Scapular Hold", unlock: 8, baseTarget: 6 }
    ]
  },
  cardio: {
    name: "Cardio intervalado", short: "Fôlego", category: "CONDITIONING",
    description: "Faça marcha acelerada no lugar ou step jacks sem salto. O objetivo é acelerar a respiração sem transformar cada rodada em um sprint máximo.",
    unit: "seconds", sets: 4, minTarget: 20, maxTarget: 90, step: 5, xp: 22, essence: 4,
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
  A: { name: "TREINO A", subtitle: "Empurrar • Pernas • Abdômen • Panturrilhas • Fôlego", exercises: ["pushup", "squat", "abs", "calfRaise", "cardio"] },
  B: { name: "TREINO B", subtitle: "Puxar • Core • Pegada • Fôlego", exercises: ["pullup", "plank", "deadHang", "cardio"] }
};

const masteryGroups = {
  push: { name: "PUSH", label: "Peito & empurrar", exercises: ["pushup"] },
  pull: { name: "PULL", label: "Costas & pegada", exercises: ["pullup", "deadHang"] },
  legs: { name: "LEGS", label: "Pernas & panturrilhas", exercises: ["squat", "calfRaise"] },
  core: { name: "CORE", label: "Abdômen & estabilidade", exercises: ["plank", "abs"] },
  conditioning: { name: "CONDITIONING", label: "Fôlego", exercises: ["cardio"] }
};

const achievements = {
  firstStep: { icon: "⚔", name: "FIRST STEP", description: "Registre seu primeiro exercício.", xp: 15, essence: 2, test: () => player.stats.totalExercises >= 1 },
  dailyClear: { icon: "◆", name: "DAILY CLEARED", description: "Complete uma System Quest inteira.", xp: 25, essence: 5, test: () => player.stats.totalDailyCompletions >= 1 },
  gripSteel: { icon: "✊", name: "IRON GRIP", description: "Acumule 120 segundos de Dead Hang.", xp: 35, essence: 6, test: () => player.stats.totalDeadHangSeconds >= 120 },
  breathLit: { icon: "◈", name: "SECOND WIND", description: "Acumule 5 minutos de cardio registrado.", xp: 40, essence: 8, test: () => player.stats.totalCardioSeconds >= 300 },
  calfAwake: { icon: "▲", name: "GROUND FORCE", description: "Acumule 250 repetições de panturrilha.", xp: 35, essence: 6, test: () => player.stats.totalCalfReps >= 250 },
  coreAwake: { icon: "⬡", name: "CORE AWAKENED", description: "Acumule 150 repetições de Abdominais.", xp: 45, essence: 9, test: () => player.stats.totalAbsReps >= 150 },
  pushFive: { icon: "✦", name: "FIVE IN ONE", description: "Faça 5 flexões em uma única série.", xp: 35, essence: 7, test: () => bestSetForExercise("pushup") >= 5 },
  pushTen: { icon: "✦", name: "DOUBLE DIGITS", description: "Faça 10 flexões em uma única série.", xp: 70, essence: 14, test: () => bestSetForExercise("pushup") >= 10 },
  pullFive: { icon: "⇧", name: "RISE ABOVE", description: "Faça 5 barras em uma única série.", xp: 75, essence: 15, test: () => bestSetForExercise("pullup") >= 5 },
  hangThirty: { icon: "⌁", name: "UNBROKEN GRIP", description: "Mantenha um Dead Hang de 30 segundos em uma série.", xp: 55, essence: 11, test: () => bestSetForExercise("deadHang") >= 30 },
  absTwelve: { icon: "⬢", name: "STEADY CORE", description: "Faça 12 repetições de abdômen em uma série.", xp: 45, essence: 9, test: () => bestSetForExercise("abs") >= 12 },
  streak3: { icon: "🔥", name: "MOMENTUM", description: "Alcance um streak de 3.", xp: 35, essence: 6, test: () => player.streak.best >= 3 },
  streak7: { icon: "♛", name: "SEVEN DAYS", description: "Alcance um streak de 7.", xp: 70, essence: 15, test: () => player.streak.best >= 7 },
  level5: { icon: "✦", name: "AWAKENING", description: "Alcance o Level 5.", xp: 50, essence: 8, test: () => player.level >= 5 },
  level10: { icon: "✧", name: "LIMIT BREAK", description: "Alcance o Level 10.", xp: 100, essence: 20, test: () => player.level >= 10 },
  fiftySessions: { icon: "☰", name: "NO EASY WAY", description: "Registre 50 exercícios.", xp: 100, essence: 20, test: () => player.stats.totalExercises >= 50 }
};

const titles = {
  awakened: { name: "THE AWAKENED", description: "O início da mudança.", test: () => true },
  king: { name: "THE KING", description: "Sete de streak e uma presença difícil de ignorar.", test: () => player.streak.best >= 7 },
  honored: { name: "HONORED ONE", description: "Um marco reservado ao Level 10.", test: () => player.level >= 10 },
  beyondWalls: { name: "BEYOND THE WALLS", description: "Complete 20 System Quests.", test: () => player.stats.totalDailyCompletions >= 20 },
  chainbreaker: { name: "CHAINBREAKER", description: "Registre 60 exercícios.", test: () => player.stats.totalExercises >= 60 },
  shadowRisen: { name: "ONE WHO ROSE", description: "Alcance o Rank C-.", test: () => player.level >= 19 },
  moonWalker: { name: "MOON WALKER", description: "Um título de presença silenciosa e noturna.", test: () => player.shop?.owned?.includes("titleMoonWalker") },
  thunderborn: { name: "THUNDERBORN", description: "Velocidade antes do som.", test: () => player.shop?.owned?.includes("titleThunderborn") },
  flameHeart: { name: "FLAME HEART", description: "Uma chama que cresce quando o corpo pede para parar.", test: () => player.shop?.owned?.includes("titleFlameHeart") },
  bladeDawn: { name: "BLADE OF DAWN", description: "A primeira luz depois da noite.", test: () => player.shop?.owned?.includes("titleBladeDawn") },
  shadowSovereign: { name: "SHADOW SOVEREIGN", description: "Uma presença que cresce de dentro da escuridão.", test: () => player.shop?.owned?.includes("titleShadowSovereign") },
  theCleaver: { name: "THE CLEAVER", description: "Precisão cruel, presença de rei e cortes impossíveis de ignorar.", test: () => player.shop?.owned?.includes("titleTheCleaver") },
  wallbreaker: { name: "WALLBREAKER", description: "Para quem continua avançando mesmo quando o caminho parece fechado.", test: () => player.shop?.owned?.includes("titleWallbreaker") },
  sunBreather: { name: "SUN BREATHER", description: "Disciplina que começa fluida e termina em chama.", test: () => player.shop?.owned?.includes("titleSunBreather") },
  devilEngine: { name: "DEVIL ENGINE", description: "Barulho, faísca e movimento sem freio.", test: () => player.shop?.owned?.includes("titleDevilEngine") }
};

const shopItems = {
  themeShadowGate: { name: "Shadow Gate", type: "theme", typeLabel: "TEMA", rarity: "RARE", price: 180, className: "theme-shadow-gate", description: "Roxo profundo e brilho de portal. Preço reduzido por ser um cosmético simples." },
  themeKingDomain: { name: "King's Domain", type: "theme", typeLabel: "TEMA", rarity: "RARE", price: 220, className: "theme-king-domain", description: "Vermelho sombrio e presença de trono." },
  themeBeyondWalls: { name: "Beyond Walls", type: "theme", typeLabel: "TEMA", rarity: "RARE", price: 180, className: "theme-beyond-walls", description: "Verde militar, aço e sensação de expedição." },
  themeDevilPulse: { name: "Devil Pulse", type: "theme", typeLabel: "TEMA", rarity: "RARE", price: 220, className: "theme-devil-pulse", description: "Preto, vermelho e laranja com energia caótica." },
  themeCrimsonDawn: { name: "Crimson Dawn", type: "theme", typeLabel: "TEMA", rarity: "LEGENDARY", price: 480, className: "theme-crimson-dawn", description: "Vermelho solar, âmbar e contrastes de lâmina ao amanhecer." },
  themeMoonlitFlow: { name: "Moonlit Flow", type: "theme", typeLabel: "TEMA", rarity: "LEGENDARY", price: 500, className: "theme-moonlit-flow", description: "Azul noturno, prata e brilho de lua sobre água escura." },

  effectShadowRise: { name: "Shadow Rise", type: "effect", typeLabel: "LEVEL UP", rarity: "EPIC", price: 220, effectClass: "effect-shadow-rise", duration: 1800, description: "Ascensão violeta com névoa e partículas verticais." },
  effectDarkImpact: { name: "Dark Impact", type: "effect", typeLabel: "LEVEL UP", rarity: "EPIC", price: 260, effectClass: "effect-dark-impact", duration: 1800, description: "Impacto escuro com duplicação de texto e onda de choque." },
  effectGroundTremor: { name: "Ground Tremor", type: "effect", typeLabel: "LEVEL UP", rarity: "EPIC", price: 240, effectClass: "effect-ground-tremor", duration: 1800, description: "Pulso pesado, poeira digital e tremor da interface." },
  effectChainBurst: { name: "Chain Burst", type: "effect", typeLabel: "LEVEL UP", rarity: "EPIC", price: 260, effectClass: "effect-chain-burst", duration: 1800, description: "Linhas cortantes cruzam a tela em uma explosão vermelha." },
  effectCrimsonDawn: { name: "Crimson Dawn", type: "effect", typeLabel: "LEVEL UP", rarity: "LEGENDARY", price: 650, effectClass: "effect-crimson-dawn", duration: 2400, description: "Arcos vermelho-alaranjados fluem como uma sequência de cortes antes do Level aparecer." },
  effectMoonlitFlow: { name: "Moonlit Flow", type: "effect", typeLabel: "LEVEL UP", rarity: "LEGENDARY", price: 700, effectClass: "effect-moonlit-flow", duration: 2500, description: "Lua crescente, ondas azuis e rastros prateados atravessam a tela." },
  effectThunderStep: { name: "Thunder Step", type: "effect", typeLabel: "LEVEL UP", rarity: "MYTHIC", price: 950, effectClass: "effect-thunder-step", duration: 2800, description: "A tela apaga por um instante; relâmpagos dourados se acumulam e o Level surge em um clarão." },
  effectFlameHeart: { name: "Flame Heart", type: "effect", typeLabel: "LEVEL UP", rarity: "MYTHIC", price: 1100, effectClass: "effect-flame-heart", duration: 3000, description: "Chamas em camadas crescem do rodapé, fecham no centro e explodem quando o novo Level aparece." },
  effectInfiniteHorizon: { name: "Infinite Horizon", type: "effect", typeLabel: "LEVEL UP", rarity: "MYTHIC", price: 1050, effectClass: "effect-infinite-horizon", duration: 3000, description: "Partículas convergem para um vazio azul-branco e o Level rompe o horizonte." },
  effectMonarchAscension: { name: "Monarch Ascension", type: "effect", typeLabel: "LEVEL UP", rarity: "MYTHIC", price: 1200, effectClass: "effect-monarch-ascension", duration: 3200, description: "Sombras violetas se erguem de baixo e formam uma coroa abstrata antes da ascensão." },

  auraShadowMist: { name: "Shadow Mist", type: "aura", typeLabel: "AURA", rarity: "EPIC", price: 350, className: "aura-shadow-mist", description: "Névoa violeta pulsando discretamente ao redor do perfil." },
  auraCrimsonBreath: { name: "Crimson Breath", type: "aura", typeLabel: "AURA", rarity: "LEGENDARY", price: 500, className: "aura-crimson-breath", description: "Faixas carmesim orbitam o perfil como uma respiração em movimento." },
  auraInfiniteHaze: { name: "Infinite Haze", type: "aura", typeLabel: "AURA", rarity: "LEGENDARY", price: 550, className: "aura-infinite-haze", description: "Halo azul-claro com partículas que parecem parar no espaço." },
  auraThunderCurrent: { name: "Thunder Current", type: "aura", typeLabel: "AURA", rarity: "LEGENDARY", price: 600, className: "aura-thunder-current", description: "Pequenos pulsos dourados cruzam o contorno do perfil." },

  frameWingsBeyond: { name: "Wings Beyond", type: "frame", typeLabel: "MOLDURA", rarity: "EPIC", price: 400, className: "frame-wings-beyond", description: "Moldura metálica com marcas de expedição e liberdade." },
  frameCursedCrown: { name: "Cursed Crown", type: "frame", typeLabel: "MOLDURA", rarity: "LEGENDARY", price: 550, className: "frame-cursed-crown", description: "Bordas vermelhas e pretas com um símbolo de coroa abstrato." },
  frameSunBlade: { name: "Sun Blade", type: "frame", typeLabel: "MOLDURA", rarity: "LEGENDARY", price: 600, className: "frame-sun-blade", description: "Moldura âmbar e carmesim com brilho cortante." },
  frameBlackCrown: { name: "Black Crown", type: "frame", typeLabel: "MOLDURA", rarity: "MYTHIC", price: 700, className: "frame-black-crown", description: "Contorno violeta profundo, marcas reais e brilho em camadas." },

  titleMoonWalker: { name: "[ MOON WALKER ]", type: "title", typeLabel: "TÍTULO", rarity: "EPIC", price: 500, unlockTitle: "moonWalker", description: "Desbloqueia o título MOON WALKER." },
  titleThunderborn: { name: "[ THUNDERBORN ]", type: "title", typeLabel: "TÍTULO", rarity: "LEGENDARY", price: 650, unlockTitle: "thunderborn", description: "Desbloqueia o título THUNDERBORN." },
  titleFlameHeart: { name: "[ FLAME HEART ]", type: "title", typeLabel: "TÍTULO", rarity: "LEGENDARY", price: 750, unlockTitle: "flameHeart", description: "Desbloqueia o título FLAME HEART." },
  titleBladeDawn: { name: "[ BLADE OF DAWN ]", type: "title", typeLabel: "TÍTULO", rarity: "LEGENDARY", price: 650, unlockTitle: "bladeDawn", description: "Desbloqueia o título BLADE OF DAWN." },

  effectWaterPulse: { name: "Water Pulse", type: "effect", typeLabel: "LEVEL UP", rarity: "RARE", price: 260, effectClass: "effect-water-pulse", duration: 2600, description: "Uma corrente azul corta a interface em arcos fluidos antes de revelar o novo Level." },
  effectScoutRush: { name: "Scout Rush", type: "effect", typeLabel: "LEVEL UP", rarity: "RARE", price: 280, effectClass: "effect-scout-rush", duration: 2600, description: "Cabos verdes atravessam a tela, vapor explode nas laterais e o Level surge como uma investida além das muralhas." },
  effectCursedSpark: { name: "Cursed Spark", type: "effect", typeLabel: "LEVEL UP", rarity: "RARE", price: 300, effectClass: "effect-cursed-spark", duration: 2700, description: "Energia negra e vermelha comprime no centro e estoura em um impacto seco." },
  effectDevilEngine: { name: "Devil Engine", type: "effect", typeLabel: "LEVEL UP", rarity: "EPIC", price: 520, effectClass: "effect-devil-engine", duration: 3600, description: "Correntes dentadas giram ao redor do layout, faíscas riscam a tela e o Level antigo é serrado antes do novo aparecer." },
  effectKingCleave: { name: "King's Cleave", type: "effect", typeLabel: "LEVEL UP", rarity: "EPIC", price: 560, effectClass: "effect-king-cleave", duration: 3500, description: "Uma sequência de cortes cruza o número antigo, fatia suas camadas e abre espaço para o novo Level." },
  effectTitanSteam: { name: "Colossal Steam", type: "effect", typeLabel: "LEVEL UP", rarity: "LEGENDARY", price: 760, effectClass: "effect-titan-steam", duration: 4200, description: "Vapor branco domina a tela, o HUD treme e um clarão quente revela a ascensão por trás da névoa." },
  effectAbsoluteDomain: { name: "Absolute Domain", type: "effect", typeLabel: "LEVEL UP", rarity: "MYTHIC", price: 1450, effectClass: "effect-absolute-domain", duration: 5600, description: "O espaço escurece, linhas de domínio fecham ao redor do HUD e múltiplos cortes apagam o Level antigo antes de uma revelação real." },

  auraWaterBreath: { name: "Water Breathing", type: "aura", typeLabel: "AURA", rarity: "RARE", price: 300, className: "aura-water-breath", description: "Ondas azuis orbitam o perfil em fluxo contínuo." },
  auraScoutSteam: { name: "Scout Steam", type: "aura", typeLabel: "AURA", rarity: "EPIC", price: 420, className: "aura-scout-steam", description: "Vapor e linhas verdes curtas lembram uma arrancada de equipamento de mobilidade." },
  auraKingMarks: { name: "King Marks", type: "aura", typeLabel: "AURA", rarity: "LEGENDARY", price: 620, className: "aura-king-marks", description: "Traços vermelhos surgem e desaparecem como marcas e cortes ao redor do perfil." },
  auraDevilSparks: { name: "Devil Sparks", type: "aura", typeLabel: "AURA", rarity: "LEGENDARY", price: 650, className: "aura-devil-sparks", description: "Faíscas quentes, metal e uma vibração de motor acompanham o perfil." },
  auraMonarchFlame: { name: "Monarch Flame", type: "aura", typeLabel: "AURA", rarity: "MYTHIC", price: 900, className: "aura-monarch-flame", description: "Chamas negras com bordas azul-violeta sobem ao redor do perfil em ciclos lentos." },

  frameThunderEdge: { name: "Thunder Edge", type: "frame", typeLabel: "MOLDURA", rarity: "RARE", price: 320, className: "frame-thunder-edge", description: "Moldura escura com impulsos dourados nas quinas." },
  frameMoonCrescent: { name: "Moon Crescent", type: "frame", typeLabel: "MOLDURA", rarity: "EPIC", price: 460, className: "frame-moon-crescent", description: "Arcos prateados e azuis percorrem as bordas como luas finas." },
  frameScoutWing: { name: "Scout Wing", type: "frame", typeLabel: "MOLDURA", rarity: "EPIC", price: 440, className: "frame-scout-wing", description: "Aço, verde militar e traços diagonais de movimento." },

  titleShadowSovereign: { name: "[ SHADOW SOVEREIGN ]", type: "title", typeLabel: "TÍTULO", rarity: "MYTHIC", price: 950, unlockTitle: "shadowSovereign", description: "Desbloqueia o título SHADOW SOVEREIGN." },
  titleTheCleaver: { name: "[ THE CLEAVER ]", type: "title", typeLabel: "TÍTULO", rarity: "LEGENDARY", price: 780, unlockTitle: "theCleaver", description: "Desbloqueia o título THE CLEAVER." },
  titleWallbreaker: { name: "[ WALLBREAKER ]", type: "title", typeLabel: "TÍTULO", rarity: "EPIC", price: 560, unlockTitle: "wallbreaker", description: "Desbloqueia o título WALLBREAKER." },
  titleSunBreather: { name: "[ SUN BREATHER ]", type: "title", typeLabel: "TÍTULO", rarity: "LEGENDARY", price: 760, unlockTitle: "sunBreather", description: "Desbloqueia o título SUN BREATHER." },
  titleDevilEngine: { name: "[ DEVIL ENGINE ]", type: "title", typeLabel: "TÍTULO", rarity: "EPIC", price: 620, unlockTitle: "devilEngine", description: "Desbloqueia o título DEVIL ENGINE." }
};

const weeklyChallenges = [
  { id: "quests", name: "UNCHAINED WEEK", description: "Complete 2 System Quests nesta semana.", goal: 2, unit: "quests", xp: 120, essence: 80 },
  { id: "volume", name: "SYSTEM DISCIPLINE", description: "Registre 8 exercícios nesta semana — sem volume extra obrigatório.", goal: 8, unit: "exercícios", xp: 120, essence: 80 },
  { id: "breath", name: "SECOND WIND PROTOCOL", description: "Acumule 240 segundos de cardio nas sessões normais desta semana.", goal: 240, unit: "s", xp: 140, essence: 90 },
  { id: "balance", name: "BALANCED ASCENSION", description: "Registre Flexão, Barra, Agachamento e Abdômen ao menos uma vez nesta semana.", goal: 4, unit: "grupos", xp: 150, essence: 100 }
];

const milestones = [
  { name: "5 FLEXÕES", description: "5 repetições em uma única série", test: () => bestSetForExercise("pushup") >= 5 },
  { name: "10 FLEXÕES", description: "10 repetições em uma única série", test: () => bestSetForExercise("pushup") >= 10 },
  { name: "3 BARRAS", description: "3 repetições em uma única série", test: () => bestSetForExercise("pullup") >= 3 },
  { name: "5 BARRAS", description: "5 repetições em uma única série", test: () => bestSetForExercise("pullup") >= 5 },
  { name: "30s HANG", description: "30 segundos em uma única série", test: () => bestSetForExercise("deadHang") >= 30 },
  { name: "12 ABDÔMEN", description: "12 repetições em uma única série", test: () => bestSetForExercise("abs") >= 12 },
  { name: "60s CARDIO", description: "60 segundos em uma única rodada", test: () => bestSetForExercise("cardio") >= 60 },
  { name: "20 PANTURRILHAS", description: "20 repetições em uma única série", test: () => bestSetForExercise("calfRaise") >= 20 }
];

const defaultVariationTargets = () => {
  const result = {};
  Object.entries(exercises).forEach(([key, exercise]) => {
    result[key] = {};
    exercise.variations.forEach((variation, index) => { result[key][String(index)] = variation.baseTarget; });
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
  skills: { pushup: 1, pullup: 1, squat: 1, plank: 1, abs: 1, calfRaise: 1, deadHang: 1, cardio: 1 },
  skillXP: { pushup: 0, pullup: 0, squat: 0, plank: 0, abs: 0, calfRaise: 0, deadHang: 0, cardio: 0 },
  variationIndex: { pushup: 0, pullup: 0, squat: 0, plank: 0, abs: 0, calfRaise: 0, deadHang: 0, cardio: 0 },
  variationTargets: defaultVariationTargets(),
  daily: { routineId: "A", completed: [], bonusClaimed: false, completedAt: null, nextAvailableAt: null },
  streak: { current: 0, best: 0, lastCompletedAt: null, guard: 0 },
  recovery: { status: "good", checkedAt: null },
  weekly: { key: null, challengeId: null, claimed: false },
  stats: {
    totalExercises: 0,
    totalDailyCompletions: 0,
    dailyCompletionTimestamps: [],
    totalCardioSeconds: 0,
    totalDeadHangSeconds: 0,
    totalCalfReps: 0,
    totalAbsReps: 0,
    totalPushupReps: 0,
    totalPullupReps: 0
  },
  achievements: [],
  equippedTitle: "awakened",
  shop: { owned: [], equippedTheme: "default", equippedEffect: "default", equippedAura: "default", equippedFrame: "default" },
  preferences: { animationMode: "full", haptics: true, sound: false },
  timeline: [],
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
let selectedExerciseKey = "pushup";
let shopFilter = "all";

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

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

function getWeekKey(date = new Date()) {
  return getTodayKey(getWeekStart(date));
}

function weeklyChallengeForKey(key = getWeekKey()) {
  const index = Math.abs(Math.floor(dateFromKey(key).getTime() / 86400000 / 7)) % weeklyChallenges.length;
  return weeklyChallenges[index];
}

function ensureWeeklyState() {
  const key = getWeekKey();
  const challenge = weeklyChallengeForKey(key);
  if (!player.weekly || player.weekly.key !== key || player.weekly.challengeId !== challenge.id) {
    player.weekly = { key, challengeId: challenge.id, claimed: false };
    saveGame();
  }
  return challenge;
}

function historySinceWeekStart() {
  const start = getWeekStart().getTime();
  return player.history.filter((entry) => {
    const time = parseTime(entry.timestamp);
    return time && time >= start;
  });
}

function weeklyProgress(challenge = ensureWeeklyState()) {
  const entries = historySinceWeekStart();
  if (challenge.id === "quests") {
    const stamps = Array.isArray(player.stats.dailyCompletionTimestamps) ? player.stats.dailyCompletionTimestamps : [];
    const start = getWeekStart().getTime();
    return stamps.filter((stamp) => (parseTime(stamp) || 0) >= start).length;
  }
  if (challenge.id === "volume") return entries.length;
  if (challenge.id === "breath") {
    return entries.filter((entry) => entry.exerciseKey === "cardio").reduce((sum, entry) => sum + (entry.values || []).reduce((a, b) => a + (Number(b) || 0), 0), 0);
  }
  if (challenge.id === "balance") {
    const keys = new Set(entries.map((entry) => entry.exerciseKey));
    return ["pushup", "pullup", "squat", "abs"].filter((key) => keys.has(key)).length;
  }
  return 0;
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

function getRankForLevel(level) {
  const index = Math.min(ranks.length - 1, Math.floor((Math.max(1, level) - 1) / 3));
  return ranks[Math.max(0, index)];
}

function getRank() {
  return getRankForLevel(player.level);
}

function nextRankInfo() {
  const index = ranks.indexOf(getRank());
  if (index >= ranks.length - 1) return { next: "MAX", level: null };
  return { next: ranks[index + 1], level: ((index + 1) * 3) + 1 };
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
    if (entry.exerciseKey === "abs") stats.totalAbsReps += total;
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

  const history = Array.isArray(data.history) ? data.history.slice(-800) : [];
  const derivedStats = deriveStatsFromHistory(history);
  const bodyXP = data.bodyXP ? { ...base.bodyXP, ...data.bodyXP } : convertLegacyAttributes(data.attributeXP || {});

  const variationTargets = defaultVariationTargets();
  Object.keys(exercises).forEach((key) => {
    if (data.variationTargets?.[key]) variationTargets[key] = { ...variationTargets[key], ...data.variationTargets[key] };
  });
  if (data.targets) {
    Object.keys(data.targets).forEach((key) => {
      if (variationTargets[key] && Number.isFinite(Number(data.targets[key]))) variationTargets[key]["0"] = Number(data.targets[key]);
    });
  }

  const oldDaily = data.daily || {};
  const routineId = oldDaily.routineId && routines[oldDaily.routineId] ? oldDaily.routineId : "A";
  const routineKeys = routines[routineId].exercises;
  const dailyCompleted = Array.isArray(oldDaily.completed) ? oldDaily.completed.filter((key) => routineKeys.includes(key)) : [];

  const legacyLastDate = data.streak?.lastCompletedDate;
  let migratedLastCompletedAt = data.streak?.lastCompletedAt || null;
  if (!migratedLastCompletedAt && legacyLastDate) {
    const sameDayEntries = history.map((entry) => ({ entry, time: parseTime(entry.timestamp) })).filter(({ entry, time }) => time && getTodayKey(new Date(time)) === legacyLastDate);
    const latest = sameDayEntries.reduce((max, item) => Math.max(max, item.time), 0);
    migratedLastCompletedAt = new Date(latest || new Date(`${legacyLastDate}T20:00:00`).getTime()).toISOString();
  }

  let completedAt = oldDaily.completedAt || (oldDaily.bonusClaimed ? migratedLastCompletedAt : null);
  let nextAvailableAt = oldDaily.nextAvailableAt || null;
  if (oldDaily.bonusClaimed && completedAt && !nextAvailableAt) nextAvailableAt = new Date(parseTime(completedAt) + COOLDOWN_MS).toISOString();

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
    daily: { routineId, completed: dailyCompleted, bonusClaimed: Boolean(oldDaily.bonusClaimed), completedAt, nextAvailableAt },
    streak: { ...base.streak, ...(data.streak || {}), lastCompletedAt: migratedLastCompletedAt || data.streak?.lastCompletedAt || null },
    recovery: { ...base.recovery, ...(data.recovery || {}) },
    weekly: { ...base.weekly, ...(data.weekly || {}) },
    stats: {
      ...derivedStats,
      ...(data.stats || {}),
      dailyCompletionTimestamps: Array.isArray(data.stats?.dailyCompletionTimestamps) ? data.stats.dailyCompletionTimestamps.slice(-120) : []
    },
    achievements: Array.isArray(data.achievements) ? data.achievements.filter((id) => achievements[id]) : [],
    equippedTitle: titles[data.equippedTitle] ? data.equippedTitle : "awakened",
    shop: {
      owned: Array.isArray(data.shop?.owned) ? data.shop.owned.filter((id) => shopItems[id]) : [],
      equippedTheme: data.shop?.equippedTheme || "default",
      equippedEffect: data.shop?.equippedEffect || "default",
      equippedAura: data.shop?.equippedAura || "default",
      equippedFrame: data.shop?.equippedFrame || "default"
    },
    preferences: { ...base.preferences, ...(data.preferences || {}) },
    timeline: Array.isArray(data.timeline) ? data.timeline.slice(-150) : [],
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
      pendingSystemMessages.push("SAVE ANTERIOR MIGRADO PARA A ALPHA 1.5. Level, XP, Essence, corpo, proficiências, cosméticos e histórico foram preservados.");
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
          pendingSystemMessages.push("SAVE ANTIGO MIGRADO PARA A ALPHA 1.5.");
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
  const themeClasses = Object.values(shopItems).filter((item) => item.type === "theme").map((item) => item.className).filter(Boolean);
  const auraClasses = Object.values(shopItems).filter((item) => item.type === "aura").map((item) => item.className).filter(Boolean);
  const frameClasses = Object.values(shopItems).filter((item) => item.type === "frame").map((item) => item.className).filter(Boolean);

  document.body.classList.remove(...themeClasses, ...auraClasses);
  const card = $("playerCard");
  if (card) card.classList.remove(...frameClasses);

  if (player.shop.equippedTheme !== "default") {
    const item = shopItems[player.shop.equippedTheme];
    if (item?.className) document.body.classList.add(item.className);
  }
  if (player.shop.equippedAura !== "default") {
    const item = shopItems[player.shop.equippedAura];
    if (item?.className) document.body.classList.add(item.className);
  }
  if (player.shop.equippedFrame !== "default") {
    const item = shopItems[player.shop.equippedFrame];
    if (item?.className && card) card.classList.add(item.className);
  }
}

function playLevelEffect(effectId = player.shop.equippedEffect) {
  const layer = $("levelEffectLayer");
  const effect = effectId && effectId !== "default" ? shopItems[effectId] : null;
  const effectClass = effect?.effectClass || "effect-system-pulse";
  const duration = effect?.duration || 1500;
  const particles = Array.from({ length: effect?.rarity === "MYTHIC" ? 26 : effect?.rarity === "LEGENDARY" ? 18 : 10 }, (_, i) => {
    const x = (i * 37) % 101;
    const delay = (i % 8) * 0.07;
    const size = 3 + (i % 5) * 2;
    return `<i class="fx-particle" style="--x:${x}%;--delay:${delay}s;--size:${size}px"></i>`;
  }).join("");

  layer.className = "level-effect-layer";
  layer.innerHTML = `<div class="fx-vignette"></div><div class="fx-ring ring-one"></div><div class="fx-ring ring-two"></div><div class="fx-slash slash-one"></div><div class="fx-slash slash-two"></div><div class="fx-moon"></div><div class="fx-crown">♢</div><div class="fx-level-text"><small>SYSTEM</small><strong>LEVEL UP</strong><span>LV. ${player.level}</span></div>${particles}`;
  void layer.offsetWidth;
  layer.classList.add(effectClass);
  setTimeout(() => { layer.className = "level-effect-layer"; layer.innerHTML = ""; }, duration);
}

function playRankAscension(rank) {
  const layer = $("levelEffectLayer");
  layer.className = "level-effect-layer";
  layer.innerHTML = `<div class="rank-surge"></div><div class="rank-wings"></div><div class="rank-text"><small>SYSTEM RANK ASCENSION</small><strong>${rank}</strong><span>LIMIT RECALIBRATED</span></div>`;
  void layer.offsetWidth;
  layer.classList.add("effect-rank-ascension");
  setTimeout(() => { layer.className = "level-effect-layer"; layer.innerHTML = ""; }, 3600);
}

function playRecordEffect(exerciseKey, value) {
  const layer = $("levelEffectLayer");
  const exercise = exercises[exerciseKey];
  layer.className = "level-effect-layer";
  layer.innerHTML = `<div class="record-beam"></div><div class="record-text"><small>PERSONAL RECORD</small><strong>NEW RECORD</strong><span>${exercise.short} • ${value}${exercise.unit === "seconds" ? "s" : " reps"}</span></div>`;
  void layer.offsetWidth;
  layer.classList.add("effect-new-record");
  setTimeout(() => { layer.className = "level-effect-layer"; layer.innerHTML = ""; }, 2400);
}

function addXP(amount) {
  const oldRank = getRankForLevel(player.level);
  player.xp += Math.max(0, Math.round(amount));
  let levels = 0;
  while (player.xp >= xpRequired()) {
    player.xp -= xpRequired();
    player.level += 1;
    levels += 1;
  }
  if (levels > 0) {
    const newRank = getRankForLevel(player.level);
    playLevelEffect();
    showNotification(`LEVEL UP. Você alcançou o nível ${player.level}.`);
    if (newRank !== oldRank) setTimeout(() => playRankAscension(newRank), 850);
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
  const recovery = player.recovery?.status || "good";

  if (recovery === "sore") return "Objetivo mantido: Recovery Check indica muita dor. O sistema não aumenta a carga hoje.";

  const wouldProgress = (difficulty === "easy" && performance >= 1) || (difficulty === "normal" && performance >= 1.25);
  if (wouldProgress && recovery === "tired") {
    return "Objetivo mantido: você marcou CANSADO, então a progressão foi adiada para preservar recuperação.";
  }

  if (wouldProgress) {
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
  if (!Array.isArray(player.stats.dailyCompletionTimestamps)) player.stats.dailyCompletionTimestamps = [];
  player.stats.dailyCompletionTimestamps.push(new Date(now).toISOString());
  player.stats.dailyCompletionTimestamps = player.stats.dailyCompletionTimestamps.slice(-120);
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
  if (key === "abs") player.stats.totalAbsReps += total;
  if (key === "pushup") player.stats.totalPushupReps += total;
  if (key === "pullup") player.stats.totalPullupReps += total;
}

function evaluateAchievements(showToast = false) {
  const newlyUnlocked = [];
  Object.entries(achievements).forEach(([id, achievement]) => {
    if (player.achievements.includes(id) || !achievement.test()) return;
    player.achievements.push(id);
    if (typeof recordTimelineEvent === "function") recordTimelineEvent("achievement", "ACHIEVEMENT", achievement.name);
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
  const previousPR = bestSetForExercise(exerciseKey);
  const sessionBest = Math.max(0, ...values);
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
  const isNewRecord = previousPR > 0 && sessionBest > previousPR;

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
    recovery: player.recovery?.status || "good",
    xp: earnedXP,
    essence: earnedEssence,
    bodyGains,
    skillXP: skillGained,
    routineId: player.daily.routineId,
    newRecord: isNewRecord,
    previousRecord: previousPR || null
  });
  player.history = player.history.slice(-800);

  const newAchievements = evaluateAchievements(false);
  saveGame();
  updateUI(false);

  const bodyText = Object.entries(bodyGains).filter(([, gain]) => gain > 0).map(([key, gain]) => `<strong>${bodyInfo[key].name} +${gain}</strong>`).join(" • ");
  const variationText = unlockedVariations.length ? `<p class="reward-line">NOVA VARIAÇÃO: <strong>${unlockedVariations.map((v) => v.name).join(", ")}</strong></p>` : "";
  const achievementText = newAchievements.length ? `<p class="reward-line">CONQUISTA: <strong>${newAchievements.map((id) => achievements[id].name).join(", ")}</strong></p>` : "";
  const dailyText = dailyReward.completed ? `<p><strong>System Quest concluída:</strong> +${dailyReward.xp} XP • +${dailyReward.essence} Essence • Streak ${player.streak.current}</p>` : "";
  const recordText = isNewRecord ? `<p class="record-line"><strong>NEW RECORD:</strong> ${previousPR}${exercise.unit === "seconds" ? "s" : ""} → ${sessionBest}${exercise.unit === "seconds" ? "s" : ""}</p>` : previousPR === 0 && sessionBest > 0 ? `<p class="reward-line">Recorde base definido: <strong>${sessionBest}${exercise.unit === "seconds" ? "s" : " reps"}</strong></p>` : "";

  openModal(
    performanceLabel(performance),
    `<p><strong>${exercise.name}</strong> — ${currentVariation(exerciseKey).name}: ${Math.round(performance * 100)}% do objetivo atual.</p>
     <p>Recompensas: <strong>+${earnedXP} XP</strong> • <strong>+${earnedEssence} Essence</strong></p>
     <p>Seu corpo recebeu progresso em: ${bodyText}.</p>
     <p><strong>${progression}</strong>${skillLevels > 0 ? `<br>Proficiência aumentou para Lv. ${player.skills[exerciseKey]}.` : ""}</p>
     ${recordText}${dailyText}${variationText}${achievementText}`
  );
  if (isNewRecord) setTimeout(() => playRecordEffect(exerciseKey, sessionBest), 220);
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

function totalForExercise(key) {
  return player.history.filter((entry) => entry.exerciseKey === key).reduce((sum, entry) => sum + (entry.values || []).reduce((a, b) => a + (Number(b) || 0), 0), 0);
}

function sessionsForExercise(key) {
  return player.history.filter((entry) => entry.exerciseKey === key).length;
}

function setRecovery(status) {
  if (!["good", "tired", "sore"].includes(status)) return;
  player.recovery = { status, checkedAt: new Date().toISOString() };
  saveGame();
  renderRecoveryCheck();
  const messages = {
    good: "RECOVERY: BEM. Progressão normal habilitada.",
    tired: "RECOVERY: CANSADO. Metas podem ser mantidas mesmo com bom desempenho.",
    sore: "RECOVERY: MUITO DOLORIDO. O sistema não aumentará metas nesta sessão."
  };
  showNotification(messages[status]);
}

function renderRecoveryCheck() {
  const status = player.recovery?.status || "good";
  document.querySelectorAll("[data-recovery]").forEach((button) => button.classList.toggle("selected", button.dataset.recovery === status));
  const hints = {
    good: "Você marcou BEM: progressão normal. Isso não é uma ordem para treinar se algo estiver doendo.",
    tired: "Você marcou CANSADO: recompensas continuam normais, mas o sistema evita subir metas hoje.",
    sore: "Você marcou MUITO DOLORIDO: recompensas continuam normais e as metas ficam congeladas para recuperação."
  };
  if ($("recoveryHint")) $("recoveryHint").textContent = hints[status];
}

function weeklyDisplayValue(challenge, value) {
  if (challenge.id === "breath") return `${Math.min(value, challenge.goal)}s / ${challenge.goal}s`;
  return `${Math.min(value, challenge.goal)} / ${challenge.goal}`;
}

function renderWeeklyChallenge() {
  const challenge = ensureWeeklyState();
  const progress = weeklyProgress(challenge);
  const pct = Math.min(100, (progress / challenge.goal) * 100);
  $("weeklyTitle").textContent = challenge.name;
  $("weeklyDescription").textContent = challenge.description;
  $("weeklyReward").textContent = `+${challenge.xp} XP • +${challenge.essence} Essence`;
  $("weeklyProgressBar").style.width = `${pct}%`;
  $("weeklyProgressText").textContent = weeklyDisplayValue(challenge, progress);
  const button = $("claimWeeklyButton");
  if (player.weekly.claimed) {
    button.disabled = true;
    button.textContent = "✓ RESGATADO";
  } else if (progress >= challenge.goal) {
    button.disabled = false;
    button.textContent = "RESGATAR RECOMPENSA";
  } else {
    button.disabled = true;
    button.textContent = "EM PROGRESSO";
  }
}

function claimWeeklyChallenge() {
  const challenge = ensureWeeklyState();
  const progress = weeklyProgress(challenge);
  if (player.weekly.claimed || progress < challenge.goal) return;
  player.weekly.claimed = true;
  player.essence += challenge.essence;
  addXP(challenge.xp);
  saveGame();
  updateUI(false);
  openModal("WEEKLY CLEARED", `<p><strong>${challenge.name}</strong> concluído.</p><p>Recompensa: <strong>+${challenge.xp} XP</strong> • <strong>+${challenge.essence} Essence</strong>.</p><p>O desafio foi cumprido usando suas sessões normais — sem exigir volume extra desnecessário.</p>`);
}

function unlockedTitleIds() {
  return Object.keys(titles).filter((id) => titles[id].test());
}

function updateUI(runAchievementCheck = true) {
  const sessionAdvanced = resetDailyIfNeeded();
  if (sessionAdvanced) showNotification("COOLDOWN ENCERRADO. Uma nova System Quest foi liberada.");
  ensureWeeklyState();
  if (runAchievementCheck) {
    const unlocked = evaluateAchievements(false);
    if (unlocked.length) saveGame();
  }

  applyEquippedTheme();

  $("playerName").textContent = player.name;
  $("rankValue").textContent = getRank();
  const nextRank = nextRankInfo();
  $("rankProgressText").textContent = nextRank.level ? `Próximo: ${nextRank.next} no Lv. ${nextRank.level}` : "RANK MÁXIMO";
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
  renderRecoveryCheck();
  renderWeeklyChallenge();
  renderBodyPreview();
  renderMissions();
  renderStatus();
  renderProgression();
  renderAchievements();
  renderTitles();
  renderShop();
  renderHistory();
  renderRecords();
  if (typeof renderManifestationSettings === "function") renderManifestationSettings();
  if ($("exerciseDetailScreen")?.classList.contains("active")) renderExerciseDetail(selectedExerciseKey);
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
      <div class="attribute-detail-head"><strong>${info.name}</strong><strong>Lv. ${bodyLevel(key)}</strong></div>
      <div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(key)}%"></div></div>
      <p>${info.description} ${bodyProgress(key)}/100 para o próximo nível.</p>
    </div>
  `).join("");

  $("masteryList").innerHTML = Object.values(masteryGroups).map((group) => {
    const level = masteryLevel(group);
    const names = group.exercises.map((key) => exercises[key].short).join(" + ");
    return `<div class="mastery-row"><div class="mastery-head"><span class="mastery-name">${group.name}</span><span class="mastery-level">Lv. ${level}</span></div><div class="mastery-meta">${group.label} • ${names}</div></div>`;
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
        <div class="skill-footer"><p>${progress}/${required} XP de proficiência</p><button class="equip-button" data-exercise-detail="${key}" type="button">VER FICHA</button></div>
      </div>`;
  }).join("");

  renderBodyMap();
  bindBodyMapEvents();
  bindExerciseDetailButtons();
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
          ${unlocked ? `<button class="equip-button" data-variation-exercise="${key}" data-variation-index="${index}" type="button" ${active ? "disabled" : ""}>${active ? "EQUIPADA" : "EQUIPAR"}</button>` : `<button class="equip-button" type="button" disabled>🔒 BLOQUEADA</button>`}
        </div>`;
    }).join("");

    return `
      <div class="progression-card">
        <div class="progression-head">
          <div><h3>${exercise.name}</h3><p>${bodyNamesForExercise(key).join(" • ")}</p></div>
          <div class="progression-actions"><span>PROF. LV. ${player.skills[key]}</span><button class="equip-button" data-exercise-detail="${key}" type="button">FICHA</button></div>
        </div>
        <div class="path-nodes">${nodes}</div>
      </div>`;
  }).join("");

  document.querySelectorAll("[data-variation-exercise]").forEach((button) => button.addEventListener("click", () => equipVariation(button.dataset.variationExercise, Number(button.dataset.variationIndex))));
  bindExerciseDetailButtons();
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

function renderCosmeticLoadout() {
  const slotData = [
    ["theme", "TEMA", player.shop.equippedTheme],
    ["aura", "AURA", player.shop.equippedAura],
    ["effect", "LEVEL UP", player.shop.equippedEffect],
    ["frame", "MOLDURA", player.shop.equippedFrame],
    ["title", "TÍTULO", player.equippedTitle]
  ];
  $("cosmeticLoadout").innerHTML = `<div class="loadout-title"><strong>COSMETIC LOADOUT</strong><span>Misture peças de estilos diferentes.</span></div><div class="loadout-slots">${slotData.map(([type, label, id]) => {
    let name = "Padrão";
    if (type === "title") name = titles[id]?.name || "THE AWAKENED";
    else if (id !== "default") name = shopItems[id]?.name || "Padrão";
    return `<div class="loadout-slot"><small>${label}</small><strong>${name}</strong>${type !== "title" ? `<button data-reset-slot="${type}" type="button">RESET</button>` : ""}</div>`;
  }).join("")}</div>`;
  document.querySelectorAll("[data-reset-slot]").forEach((button) => button.addEventListener("click", () => {
    const type = button.dataset.resetSlot;
    if (type === "theme") player.shop.equippedTheme = "default";
    if (type === "effect") player.shop.equippedEffect = "default";
    if (type === "aura") player.shop.equippedAura = "default";
    if (type === "frame") player.shop.equippedFrame = "default";
    saveGame(); updateUI(false);
  }));
}

function renderShop() {
  $("shopEssenceValue").textContent = player.essence;
  renderCosmeticLoadout();
  const filters = [["all","TODOS"],["theme","TEMAS"],["effect","LEVEL UP"],["aura","AURAS"],["frame","MOLDURAS"],["title","TÍTULOS"]];
  $("shopFilters").innerHTML = filters.map(([id,label]) => `<button class="shop-filter ${shopFilter === id ? "active" : ""}" data-shop-filter="${id}" type="button">${label}</button>`).join("");
  document.querySelectorAll("[data-shop-filter]").forEach((button) => button.addEventListener("click", () => { shopFilter = button.dataset.shopFilter; renderShop(); }));

  const entries = Object.entries(shopItems).filter(([, item]) => shopFilter === "all" || item.type === shopFilter);
  $("shopList").innerHTML = entries.map(([id, item]) => {
    const owned = player.shop.owned.includes(id);
    const equipped = item.type === "theme" ? player.shop.equippedTheme === id
      : item.type === "effect" ? player.shop.equippedEffect === id
      : item.type === "aura" ? player.shop.equippedAura === id
      : item.type === "frame" ? player.shop.equippedFrame === id
      : item.type === "title" ? player.equippedTitle === item.unlockTitle : false;
    return `
      <div class="shop-card rarity-${item.rarity.toLowerCase()} ${owned ? "owned" : ""}">
        <div class="shop-head"><div><span class="rarity-tag">${item.rarity}</span><h3>${item.name}</h3></div><span class="shop-type">${item.typeLabel}</span></div>
        <p>${item.description}</p>
        <div class="shop-price">
          <strong>${owned ? "ADQUIRIDO" : `${item.price} Essence`}</strong>
          <div class="shop-actions"><button class="shop-button" data-shop-preview="${id}" type="button">PREVIEW</button><button class="shop-button" data-shop-action="${id}" type="button" ${equipped ? "disabled" : ""}>${equipped ? "EQUIPADO" : owned ? "EQUIPAR" : "COMPRAR"}</button></div>
        </div>
      </div>`;
  }).join("");

  document.querySelectorAll("[data-shop-preview]").forEach((button) => button.addEventListener("click", () => previewShopItem(button.dataset.shopPreview)));
  document.querySelectorAll("[data-shop-action]").forEach((button) => button.addEventListener("click", () => buyOrEquipShopItem(button.dataset.shopAction)));
}

function previewShopItem(id) {
  const item = shopItems[id];
  if (!item) return;
  if (item.type === "effect") { playLevelEffect(id); return; }
  if (item.type === "title") { showNotification(`PREVIEW DE TÍTULO: ${titles[item.unlockTitle]?.name || item.name}`); return; }

  if (item.type === "theme") {
    const classes = Object.values(shopItems).filter((entry) => entry.type === "theme").map((entry) => entry.className).filter(Boolean);
    document.body.classList.remove(...classes); document.body.classList.add(item.className);
  }
  if (item.type === "aura") {
    const classes = Object.values(shopItems).filter((entry) => entry.type === "aura").map((entry) => entry.className).filter(Boolean);
    document.body.classList.remove(...classes); document.body.classList.add(item.className);
  }
  if (item.type === "frame") {
    const classes = Object.values(shopItems).filter((entry) => entry.type === "frame").map((entry) => entry.className).filter(Boolean);
    $("playerCard").classList.remove(...classes); $("playerCard").classList.add(item.className);
  }
  showNotification(`PREVIEW: ${item.name}`);
  setTimeout(applyEquippedTheme, 2200);
}

function buyOrEquipShopItem(id) {
  const item = shopItems[id];
  if (!item) return;
  const owned = player.shop.owned.includes(id);

  if (!owned) {
    if (player.essence < item.price) { showNotification(`ESSENCE INSUFICIENTE. Faltam ${item.price - player.essence}.`); return; }
    player.essence -= item.price;
    player.shop.owned.push(id);
    showNotification(`${item.name.toUpperCase()} ADQUIRIDO.`);
  }

  if (item.type === "theme") player.shop.equippedTheme = id;
  if (item.type === "effect") player.shop.equippedEffect = id;
  if (item.type === "aura") player.shop.equippedAura = id;
  if (item.type === "frame") player.shop.equippedFrame = id;
  if (item.type === "title" && item.unlockTitle && titles[item.unlockTitle]) player.equippedTitle = item.unlockTitle;
  saveGame(); updateUI(false);
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

function renderRecords() {
  if (!$("recordsGrid")) return;
  $("recordsGrid").innerHTML = Object.entries(exercises).map(([key, exercise]) => {
    const best = bestSetForExercise(key);
    const total = totalForExercise(key);
    const sessions = sessionsForExercise(key);
    return `<button class="record-card" data-exercise-detail="${key}" type="button"><span>${exercise.category}</span><h3>${exercise.short}</h3><strong>${best || "—"}${best ? (exercise.unit === "seconds" ? "s" : "") : ""}</strong><small>melhor série</small><p>${sessions} sessões • ${total}${exercise.unit === "seconds" ? "s" : " reps"} acumulados</p></button>`;
  }).join("");
  $("milestonesList").innerHTML = milestones.map((milestone) => `<div class="milestone ${milestone.test() ? "reached" : ""}"><span>${milestone.test() ? "✓" : "◇"}</span><div><strong>${milestone.name}</strong><p>${milestone.description}</p></div></div>`).join("");
  bindExerciseDetailButtons();
}

function bindExerciseDetailButtons() {
  document.querySelectorAll("[data-exercise-detail]").forEach((button) => {
    button.onclick = () => openExerciseDetail(button.dataset.exerciseDetail);
  });
}

function openExerciseDetail(key) {
  if (!exercises[key]) return;
  selectedExerciseKey = key;
  renderExerciseDetail(key);
  showScreen("exerciseDetailScreen");
}

function renderExerciseDetail(key = selectedExerciseKey) {
  const exercise = exercises[key];
  if (!exercise || !$("exerciseDetailContent")) return;
  const best = bestSetForExercise(key);
  const total = totalForExercise(key);
  const sessions = sessionsForExercise(key);
  const required = skillXPRequired(player.skills[key]);
  const recent = player.history.filter((entry) => entry.exerciseKey === key).slice(-5).reverse();
  const path = exercise.variations.map((variation, index) => `<div class="detail-path-node ${player.skills[key] >= variation.unlock ? "unlocked" : "locked"} ${player.variationIndex[key] === index ? "active" : ""}"><strong>${variation.name}</strong><small>Lv. ${variation.unlock}${player.variationIndex[key] === index ? " • EQUIPADA" : ""}</small></div>`).join("");
  $("exerciseDetailContent").innerHTML = `
    <div class="exercise-detail-head"><div><span class="category-chip">${exercise.category}</span><h2>${exercise.name}</h2><p>${exercise.description}</p></div><div class="exercise-pr"><small>PERSONAL RECORD</small><strong>${best || "—"}${best && exercise.unit === "seconds" ? "s" : ""}</strong></div></div>
    <div class="exercise-stat-grid"><div><span>PROFICIÊNCIA</span><strong>Lv. ${player.skills[key]}</strong><small>${player.skillXP[key]}/${required} XP</small></div><div><span>META ATUAL</span><strong>${targetText(key)}</strong><small>${currentVariation(key).name}</small></div><div><span>SESSÕES</span><strong>${sessions}</strong><small>registros</small></div><div><span>VOLUME</span><strong>${total}</strong><small>${exercise.unit === "seconds" ? "segundos" : "repetições"}</small></div></div>
    <div class="detail-section"><h3>BODY SYNC</h3><div class="body-targets">${bodyNamesForExercise(key).map((name) => `<span class="body-target">${name}</span>`).join("")}</div></div>
    <div class="detail-section"><h3>EVOLUTION PATH</h3><div class="detail-path">${path}</div></div>
    <div class="detail-section"><h3>ÚLTIMOS REGISTROS</h3>${recent.length ? recent.map((entry) => `<div class="detail-log"><span>${new Intl.DateTimeFormat("pt-BR", { day:"2-digit", month:"2-digit" }).format(new Date(entry.timestamp))}</span><strong>${Math.max(...(entry.values || [0]))}${exercise.unit === "seconds" ? "s" : ""}</strong><small>${Math.round((entry.performance || 0) * 100)}% da meta</small></div>`).join("") : `<p class="detail-intro">Nenhum registro ainda.</p>`}</div>`;
  $("trainDetailExerciseButton").disabled = sessionLocked();
  $("trainDetailExerciseButton").textContent = sessionLocked() ? `COOLDOWN ${formatDuration(cooldownRemaining())}` : "TREINAR ESTE EXERCÍCIO";
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
  const confirmedAgain = window.confirm("Última confirmação: deseja realmente voltar ao início da Alpha 1.5?");
  if (!confirmedAgain) return;

  [SAVE_KEY, ...LEGACY_SAVE_KEYS].forEach((key) => localStorage.removeItem(key));
  player = defaultPlayer();
  selectedBodyZone = "chest";
  selectedExerciseHeatmap = null;
  selectedMuscleId = null;
  selectedExerciseKey = "pushup";
  shopFilter = "all";
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

  openModal("Instalar no celular", `<p>Para instalar como app, o Project Arise precisa estar aberto por um endereço <strong>HTTPS</strong> (não apenas pelo arquivo <code>index.html</code>).</p><p>Quando estiver hospedado, abra no Chrome/Edge do celular e use <strong>Adicionar à tela inicial</strong> ou <strong>Instalar app</strong>. A Alpha 1.5 inclui manifest, ícones, cache offline e controles de apresentação para isso.</p>`);
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
  $("recordsButton").addEventListener("click", () => { updateUI(); showScreen("recordsScreen"); });
  $("settingsButton").addEventListener("click", () => { updateUI(false); showScreen("settingsScreen"); });
  $("clearHistoryButton").addEventListener("click", clearHistory);
  $("exportSaveButton").addEventListener("click", exportSave);
  $("importSaveButton").addEventListener("click", () => $("saveImportInput").click());
  $("saveImportInput").addEventListener("change", () => importSaveFile($("saveImportInput").files?.[0]));
  $("resetProgressButton").addEventListener("click", resetProgress);
  $("installPwaButton").addEventListener("click", installPwa);
  $("claimWeeklyButton").addEventListener("click", claimWeeklyChallenge);
  document.querySelectorAll("[data-recovery]").forEach((button) => button.addEventListener("click", () => setRecovery(button.dataset.recovery)));
  $("exerciseDetailBackButton").addEventListener("click", () => { updateUI(); showScreen("progressionScreen"); });
  $("trainDetailExerciseButton").addEventListener("click", () => startSingleExercise(selectedExerciseKey));

  document.querySelectorAll(".back-dashboard").forEach((button) => {
    button.addEventListener("click", () => { updateUI(); showScreen("dashboardScreen"); });
  });

  $("systemButton").addEventListener("click", () => {
    openModal("Project Arise — Alpha 1.5 • Manifestation", `
      <ul>
        <li><strong>Body Sync 3.0:</strong> anatomia muscular detalhada, clique por músculo, heatmap por exercício e pulmões separados.</li>
        <li><strong>Abdômen:</strong> Reverse Crunch e progressões agora fazem parte do Treino A.</li>
        <li><strong>Recovery Check:</strong> marcar Cansado ou Muito dolorido impede aumentos agressivos de meta sem reduzir recompensas.</li>
        <li><strong>Personal Records:</strong> seus melhores resultados recebem NEW RECORD e alimentam marcos físicos.</li>
        <li><strong>Weekly Challenge:</strong> desafio semanal usa o treino normal; ele não exige sessões extras para farmar recompensa.</li>
        <li><strong>Event Director:</strong> Level Up, NEW RECORD e Rank Ascension entram numa fila e nunca mais disputam a tela.</li>
        <li><strong>Manifestation FX:</strong> cada raridade ganhou identidade própria; Mythic vira uma mini-cutscene e os efeitos menores continuam reconhecíveis.</li>
        <li><strong>Cooldown/Streak:</strong> quest bloqueada por 12h; a próxima precisa ser concluída em até 36h para manter a corrente.</li>
        <li><strong>Save:</strong> exporte um backup antes de cada atualização. A Alpha 1.5 migra saves da 1.4 automaticamente.</li>
      </ul>
    `);
  });

  $("closeModalButton").addEventListener("click", closeModal);
  $("modalOverlay").addEventListener("click", (event) => {
    if (event.target === $("modalOverlay")) closeModal();
  });
}



/* ============================================================
   PROJECT ARISE ALPHA 1.5 — MANIFESTATION UPDATE
   Presentation director, Body Sync 3.0 and cinematic cosmetics.
   ============================================================ */

const muscleCatalog = {
  pectorals: { name: "Peitoral maior", zone: "chest", role: "Principal nos movimentos de empurrar." },
  "front-delts": { name: "Deltoide anterior", zone: "chest", role: "Ajuda a elevar e estabilizar o braço durante flexões." },
  serratus: { name: "Serrátil anterior", zone: "chest", role: "Estabiliza a escápula durante empurradas." },
  traps: { name: "Trapézio", zone: "back", role: "Controle escapular e sustentação da parte superior das costas." },
  "rear-delts": { name: "Deltoide posterior", zone: "back", role: "Auxilia movimentos de puxada e estabilidade do ombro." },
  lats: { name: "Latíssimo do dorso", zone: "back", role: "Grande motor das puxadas verticais." },
  erectors: { name: "Eretores da coluna", zone: "core", role: "Mantêm o tronco estável e resistente à flexão." },
  biceps: { name: "Bíceps", zone: "arms", role: "Flexão do cotovelo, principalmente nas barras." },
  triceps: { name: "Tríceps", zone: "arms", role: "Extensão do cotovelo, principalmente nas flexões." },
  "forearms-front": { name: "Antebraços / flexores", zone: "arms", role: "Pegada e controle do punho." },
  "forearms-back": { name: "Antebraços / extensores", zone: "arms", role: "Pegada e estabilidade do punho." },
  "upper-abs": { name: "Reto abdominal superior", zone: "core", role: "Flexão e rigidez do tronco." },
  "mid-abs": { name: "Reto abdominal médio", zone: "core", role: "Controle do tronco em flexão e anti-extensão." },
  "lower-abs": { name: "Reto abdominal inferior", zone: "core", role: "Controle pélvico nas progressões de abdômen." },
  obliques: { name: "Oblíquos", zone: "core", role: "Resistem à rotação e estabilizam o tronco." },
  quads: { name: "Quadríceps", zone: "legs", role: "Principal responsável por estender o joelho nos agachamentos." },
  adductors: { name: "Adutores", zone: "legs", role: "Estabilizam quadril e joelho durante agachamentos." },
  hamstrings: { name: "Posteriores da coxa", zone: "legs", role: "Ajudam no controle do quadril e da descida." },
  glutes: { name: "Glúteos", zone: "legs", role: "Extensão e estabilidade do quadril." },
  tibialis: { name: "Tibial anterior", zone: "legs", role: "Controle do tornozelo e do pé durante deslocamentos." },
  "calves-front": { name: "Sóleo / complexo da panturrilha", zone: "calves", role: "Suporte ao tornozelo e flexão plantar." },
  gastrocnemius: { name: "Gastrocnêmio", zone: "calves", role: "Grande parte visível da panturrilha e impulso do pé." }
};

const musclesByZone = {
  chest: ["pectorals", "front-delts", "serratus"],
  back: ["lats", "traps", "rear-delts", "erectors"],
  arms: ["biceps", "triceps", "forearms-front", "forearms-back", "front-delts", "rear-delts"],
  core: ["upper-abs", "mid-abs", "lower-abs", "obliques", "erectors"],
  legs: ["quads", "adductors", "hamstrings", "glutes", "tibialis"],
  calves: ["calves-front", "gastrocnemius"]
};

const exerciseMuscleMap = {
  pushup: { primary: ["pectorals", "triceps", "front-delts"], secondary: ["serratus"], stabilizer: ["upper-abs", "mid-abs", "lower-abs", "obliques"] },
  pullup: { primary: ["lats", "biceps", "forearms-front", "forearms-back"], secondary: ["traps", "rear-delts"], stabilizer: ["upper-abs", "mid-abs", "obliques", "erectors"] },
  squat: { primary: ["quads", "glutes"], secondary: ["adductors", "hamstrings"], stabilizer: ["upper-abs", "mid-abs", "obliques", "erectors", "gastrocnemius"] },
  plank: { primary: ["upper-abs", "mid-abs", "lower-abs", "obliques"], secondary: ["front-delts", "serratus"], stabilizer: ["erectors", "glutes"] },
  abs: { primary: ["upper-abs", "mid-abs", "lower-abs"], secondary: ["obliques"], stabilizer: ["quads"] },
  calfRaise: { primary: ["gastrocnemius", "calves-front"], secondary: ["tibialis"], stabilizer: ["quads", "glutes"] },
  deadHang: { primary: ["forearms-front", "forearms-back"], secondary: ["lats", "traps", "biceps"], stabilizer: ["upper-abs", "mid-abs", "obliques"] },
  cardio: { primary: ["quads", "gastrocnemius", "calves-front"], secondary: ["glutes", "hamstrings", "tibialis"], stabilizer: ["upper-abs", "mid-abs", "obliques"] }
};

let selectedExerciseHeatmap = null;
let selectedMuscleId = null;
const manifestationQueue = [];
let manifestationBusy = false;
let audioContext = null;

function currentRankTier() {
  const raw = getRank();
  return ["E", "D", "C", "B", "A", "S"].find((letter) => raw.startsWith(letter)) || "E";
}

function recordTimelineEvent(type, title, detail) {
  if (!player) return;
  if (!Array.isArray(player.timeline)) player.timeline = [];
  player.timeline.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`, timestamp: new Date().toISOString(), type, title, detail });
  player.timeline = player.timeline.slice(-150);
}

function animationMode() {
  const mode = player?.preferences?.animationMode;
  return ["full", "fast", "reduced"].includes(mode) ? mode : "full";
}

function manifestationDuration(rarity = "RARE", kind = "level") {
  if (kind === "rank") {
    if (animationMode() === "reduced") return 1200;
    if (animationMode() === "fast") return 3300;
    return 6200;
  }
  if (kind === "record") {
    if (animationMode() === "reduced") return 900;
    if (animationMode() === "fast") return 1700;
    return 2900;
  }
  const base = { RARE: 3000, EPIC: 3800, LEGENDARY: 4700, MYTHIC: 5700 }[rarity] || 3000;
  if (animationMode() === "reduced") return 950;
  if (animationMode() === "fast") return Math.round(base * 0.62);
  return base;
}

function queueManifestation(job) {
  manifestationQueue.push(job);
  runManifestationQueue();
}

async function runManifestationQueue() {
  if (manifestationBusy || !manifestationQueue.length) return;
  manifestationBusy = true;
  while (manifestationQueue.length) {
    const job = manifestationQueue.shift();
    try { await job(); } catch (error) { console.warn("Manifestation event:", error); }
    await new Promise((resolve) => setTimeout(resolve, animationMode() === "full" ? 260 : 90));
  }
  manifestationBusy = false;
}

function vibratePattern(pattern) {
  if (!player?.preferences?.haptics || !navigator.vibrate) return;
  try { navigator.vibrate(pattern); } catch (_) {}
}

function synthCue(kind) {
  if (!player?.preferences?.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const cues = {
      level: [[220,0,.08],[330,.11,.08],[440,.22,.16]],
      rank: [[110,0,.2],[220,.22,.18],[440,.46,.22],[660,.72,.35]],
      slash: [[175,0,.06],[95,.09,.08],[260,.17,.12]],
      thunder: [[90,0,.08],[640,.06,.12],[880,.18,.16]],
      record: [[392,0,.1],[523,.12,.12],[659,.26,.18]]
    };
    (cues[kind] || cues.level).forEach(([frequency, offset, duration]) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = kind === "rank" ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(.055, now + offset + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(now + offset); osc.stop(now + offset + duration + .03);
    });
  } catch (_) {}
}

function levelTextMarkup(oldLevel, newLevel, label = "SYSTEM LEVEL UP") {
  return `<div class="manifest-level-copy"><small>${label}</small><div class="manifest-number-row"><span class="old-level">LV. ${oldLevel}</span><b>→</b><strong>LV. ${newLevel}</strong></div></div>`;
}

function shadowWisps(count = 12) {
  return Array.from({ length: count }, (_, i) => `<i class="shadow-wisp" style="--i:${i};--x:${(i * 41) % 100}%"></i>`).join("");
}

function sparkField(count = 16) {
  return Array.from({ length: count }, (_, i) => `<i class="manifest-spark" style="--i:${i};--x:${(i * 31) % 100}%;--y:${(i * 47) % 100}%"></i>`).join("");
}

function cinematicMarkup(effectId, oldLevel, newLevel) {
  const basic = levelTextMarkup(oldLevel, newLevel);
  switch (effectId) {
    case "effectWaterPulse":
      return `<div class="water-ribbon ribbon-a"></div><div class="water-ribbon ribbon-b"></div><div class="water-ribbon ribbon-c"></div>${basic}`;
    case "effectScoutRush":
      return `<i class="scout-cable cable-a"></i><i class="scout-cable cable-b"></i><i class="scout-cable cable-c"></i><div class="steam-bank left"></div><div class="steam-bank right"></div>${basic}`;
    case "effectCursedSpark":
      return `<div class="cursed-core"></div><i class="curse-crack c1"></i><i class="curse-crack c2"></i><i class="curse-crack c3"></i>${basic}`;
    case "effectShadowRise":
      return `${shadowWisps(14)}<div class="shadow-gate-ring"></div>${basic}`;
    case "effectDarkImpact":
      return `<div class="black-flash-core"></div><i class="black-flash-line l1"></i><i class="black-flash-line l2"></i><i class="black-flash-line l3"></i>${basic}`;
    case "effectGroundTremor":
      return `<div class="impact-floor"></div><div class="steam-bank left"></div><div class="steam-bank right"></div><i class="shock-ring r1"></i><i class="shock-ring r2"></i>${basic}`;
    case "effectChainBurst":
      return `<div class="saw-orbit saw-a"><i></i></div><div class="saw-orbit saw-b"><i></i></div>${sparkField(12)}${basic}`;
    case "effectDevilEngine":
      return `<div class="saw-orbit saw-a"><i></i></div><div class="saw-orbit saw-b"><i></i></div><div class="saw-orbit saw-c"><i></i></div><div class="saw-orbit saw-d"><i></i></div>${sparkField(26)}<div class="engine-cut"></div>${basic}`;
    case "effectKingCleave":
      return `<div class="cleave-old"><span class="slice s1">${oldLevel}</span><span class="slice s2">${oldLevel}</span><span class="slice s3">${oldLevel}</span></div>${Array.from({length:7},(_,i)=>`<i class="king-slash ks${i+1}"></i>`).join("")}<div class="king-new"><small>THE KING HAS SPOKEN</small><strong>LV. ${newLevel}</strong></div>`;
    case "effectCrimsonDawn":
      return `<div class="water-ribbon tanjiro-water"></div><div class="flame-ribbon tanjiro-flame"></div>${sparkField(20)}<div class="late-reveal">${basic}</div>`;
    case "effectMoonlitFlow":
      return `${Array.from({length:8},(_,i)=>`<i class="moon-blade mb${i+1}"></i>`).join("")}<div class="moon-disc"></div>${basic}`;
    case "effectTitanSteam":
      return `<div class="titan-heat"></div><div class="steam-wall"></div><div class="steam-bank left"></div><div class="steam-bank right"></div><i class="shock-ring r1"></i>${basic}`;
    case "effectThunderStep":
      return `${Array.from({length:6},(_,i)=>`<i class="lightning-bolt lb${i+1}"></i>`).join("")}<div class="thunder-center"></div>${basic}`;
    case "effectFlameHeart":
      return `<div class="flame-arc fa1"></div><div class="flame-arc fa2"></div><div class="flame-arc fa3"></div>${sparkField(24)}${basic}`;
    case "effectInfiniteHorizon": {
      const left = Math.floor(newLevel / 2), right = newLevel - left;
      return `<div class="infinity-orb blue"><small>BLUE</small><strong>${left}</strong></div><div class="infinity-orb red"><small>RED</small><strong>${right}</strong></div><div class="purple-collapse"></div><div class="infinity-result"><small>CONVERGENCE</small><strong>${newLevel}</strong></div>`;
    }
    case "effectMonarchAscension":
      return `${shadowWisps(24)}<div class="monarch-flames"></div><div class="arise-word">ARISE</div><div class="monarch-result"><small>SHADOW ASCENSION</small><strong>LV. ${newLevel}</strong></div>`;
    case "effectAbsoluteDomain":
      return `<div class="domain-ring d1"></div><div class="domain-ring d2"></div>${Array.from({length:10},(_,i)=>`<i class="king-slash domain-slash ds${i+1}"></i>`).join("")}<div class="domain-old">${oldLevel}</div><div class="domain-new"><small>ABSOLUTE DOMAIN</small><strong>LV. ${newLevel}</strong></div>`;
    default:
      return `<div class="system-ring sr1"></div><div class="system-ring sr2"></div>${basic}`;
  }
}

function runCinematic(effectId, payload = {}) {
  return new Promise((resolve) => {
    const layer = $("levelEffectLayer");
    const effect = shopItems[effectId] || null;
    const rarity = effect?.rarity || "RARE";
    const duration = manifestationDuration(rarity, payload.kind || "level");
    const oldLevel = Number(payload.oldLevel ?? Math.max(1, player.level - 1));
    const newLevel = Number(payload.newLevel ?? player.level);
    const effectClass = animationMode() === "reduced" ? "effect-system-pulse" : (effect?.effectClass || "effect-system-pulse");
    layer.className = "level-effect-layer manifestation-cinematic";
    layer.innerHTML = `<div class="manifest-vignette"></div>${cinematicMarkup(effectId, oldLevel, newLevel)}`;
    layer.style.setProperty("--manifest-duration", `${duration}ms`);
    void layer.offsetWidth;
    layer.classList.add(effectClass, `animation-${animationMode()}`, `rarity-${rarity.toLowerCase()}`);
    vibratePattern(rarity === "MYTHIC" ? [30,35,55,45,90] : rarity === "LEGENDARY" ? [25,30,55] : [20,25,35]);
    synthCue(effectId === "effectThunderStep" ? "thunder" : effectId === "effectKingCleave" || effectId === "effectAbsoluteDomain" ? "slash" : "level");
    setTimeout(() => {
      layer.className = "level-effect-layer";
      layer.innerHTML = "";
      layer.removeAttribute("style");
      resolve();
    }, duration);
  });
}

function playLevelEffect(effectId = player.shop.equippedEffect, meta = {}) {
  const resolved = effectId && effectId !== "default" ? effectId : "default";
  queueManifestation(() => runCinematic(resolved, { kind: "level", oldLevel: meta.oldLevel, newLevel: meta.newLevel }));
}

function playRankAscension(rank, meta = {}) {
  queueManifestation(() => new Promise((resolve) => {
    const layer = $("levelEffectLayer");
    const duration = manifestationDuration("MYTHIC", "rank");
    const oldRank = meta.oldRank || "—";
    layer.className = "level-effect-layer manifestation-cinematic effect-rank-manifestation";
    layer.style.setProperty("--manifest-duration", `${duration}ms`);
    layer.innerHTML = `<div class="rank-darken"></div><div class="rank-sigil"></div><div class="rank-columns"></div><div class="rank-old">${oldRank}</div><div class="rank-shatter"></div><div class="rank-new"><small>SYSTEM RANK ASCENSION</small><strong>${rank}</strong><span>LIMIT RECALIBRATED</span></div>${shadowWisps(18)}`;
    void layer.offsetWidth;
    layer.classList.add(`animation-${animationMode()}`);
    vibratePattern([45,35,70,45,120]); synthCue("rank");
    setTimeout(() => { layer.className = "level-effect-layer"; layer.innerHTML = ""; layer.removeAttribute("style"); resolve(); }, duration);
  }));
}

function playRecordEffect(exerciseKey, value) {
  const exercise = exercises[exerciseKey];
  recordTimelineEvent("record", "NEW RECORD", `${exercise.short}: ${value}${exercise.unit === "seconds" ? "s" : " reps"}`);
  saveGame();
  queueManifestation(() => new Promise((resolve) => {
    const layer = $("levelEffectLayer");
    const duration = manifestationDuration("EPIC", "record");
    layer.className = "level-effect-layer manifestation-cinematic effect-record-manifestation";
    layer.style.setProperty("--manifest-duration", `${duration}ms`);
    layer.innerHTML = `<div class="record-laser"></div><div class="record-trophy">◆</div><div class="record-manifest-copy"><small>PERSONAL RECORD</small><strong>NEW RECORD</strong><span>${exercise.short} • ${value}${exercise.unit === "seconds" ? "s" : " reps"}</span></div>`;
    void layer.offsetWidth;
    layer.classList.add(`animation-${animationMode()}`);
    vibratePattern([20,25,45]); synthCue("record");
    setTimeout(() => { layer.className = "level-effect-layer"; layer.innerHTML = ""; layer.removeAttribute("style"); resolve(); }, duration);
  }));
}

function addXP(amount) {
  const oldLevel = player.level;
  const oldRank = getRankForLevel(oldLevel);
  player.xp += Math.max(0, Math.round(amount));
  let levels = 0;
  while (player.xp >= xpRequired()) {
    player.xp -= xpRequired();
    player.level += 1;
    levels += 1;
  }
  if (levels > 0) {
    const newRank = getRankForLevel(player.level);
    playLevelEffect(player.shop.equippedEffect, { oldLevel, newLevel: player.level });
    recordTimelineEvent("level", "LEVEL UP", `Lv. ${oldLevel} → ${player.level}`);
    showNotification(`LEVEL UP. Você alcançou o nível ${player.level}.`);
    if (newRank !== oldRank) {
      recordTimelineEvent("rank", "RANK ASCENSION", `${oldRank} → ${newRank}`);
      playRankAscension(newRank, { oldRank, newRank });
    }
  }
  return levels;
}

function selectBodyZone(key, scroll = false) {
  if (!bodyInfo[key] || key === "breath") return;
  selectedExerciseHeatmap = null;
  selectedMuscleId = null;
  selectedBodyZone = key;
  renderBodyMap();
  if (scroll && $("bodyMapDetail")) $("bodyMapDetail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function selectMuscle(muscleId) {
  const muscle = muscleCatalog[muscleId];
  if (!muscle) return;
  selectedExerciseHeatmap = null;
  selectedMuscleId = muscleId;
  selectedBodyZone = muscle.zone;
  renderBodyMap();
}

function setExerciseHeatmap(key) {
  if (!exerciseMuscleMap[key]) return;
  selectedExerciseHeatmap = key;
  selectedMuscleId = null;
  renderBodyMap();
}

function clearExerciseHeatmap() {
  selectedExerciseHeatmap = null;
  selectedMuscleId = null;
  renderBodyMap();
}

function muscleRoleMarkup(zone) {
  return (musclesByZone[zone] || []).map((id, index) => {
    const muscle = muscleCatalog[id];
    const label = index === 0 ? "PRINCIPAL" : index < 3 ? "SECUNDÁRIO" : "ESTABILIZAÇÃO";
    const roleClass = index === 0 ? "principal" : index < 3 ? "secundario" : "estabilizacao";
    return `<button class="muscle-detail-line" data-muscle-detail="${id}" type="button"><span class="muscle-rank-dot ${roleClass}"></span><div><strong>${muscle.name}</strong><small>${muscle.role}</small></div></button>`;
  }).join("");
}

function renderBodyMap() {
  const svg = $("bodyMapSvg");
  if (!svg) return;
  const tier = currentRankTier();
  svg.className.baseVal = `body-map-svg body-map-v3 rank-tier-${tier}`;
  if ($("avatarRankBadge")) $("avatarRankBadge").textContent = `AVATAR • ${tier} RANK`;

  document.querySelectorAll("[data-muscle]").forEach((shape) => {
    shape.classList.remove("active", "stimulus-primary", "stimulus-secondary", "stimulus-stabilizer", "muted");
    const id = shape.dataset.muscle;
    if (selectedExerciseHeatmap) {
      const map = exerciseMuscleMap[selectedExerciseHeatmap];
      if (map.primary.includes(id)) shape.classList.add("stimulus-primary");
      else if (map.secondary.includes(id)) shape.classList.add("stimulus-secondary");
      else if (map.stabilizer.includes(id)) shape.classList.add("stimulus-stabilizer");
      else shape.classList.add("muted");
    } else {
      if ((musclesByZone[selectedBodyZone] || []).includes(id)) shape.classList.add("active");
      else shape.classList.add("muted");
      if (selectedMuscleId === id) shape.classList.add("muscle-selected");
    }
  });

  document.querySelectorAll("[data-body-status]").forEach((card) => card.classList.toggle("selected", card.dataset.bodyStatus === selectedBodyZone && !selectedExerciseHeatmap));
  document.querySelectorAll("[data-body-region]").forEach((button) => button.classList.toggle("selected", button.dataset.bodyRegion === selectedBodyZone && !selectedExerciseHeatmap));
  document.querySelectorAll("[data-heatmap-exercise]").forEach((button) => button.classList.toggle("selected", button.dataset.heatmapExercise === selectedExerciseHeatmap));

  if ($("bodyMapDetail")) {
    if (selectedExerciseHeatmap) {
      const exercise = exercises[selectedExerciseHeatmap];
      const map = exerciseMuscleMap[selectedExerciseHeatmap];
      const row = (ids, role) => ids.map((id) => `<div class="stimulus-row"><span class="stimulus-dot ${role}"></span><div><strong>${muscleCatalog[id]?.name || id}</strong><small>${role === "primary" ? "Estímulo principal" : role === "secondary" ? "Estímulo secundário" : "Estabilização"}</small></div></div>`).join("");
      $("bodyMapDetail").innerHTML = `<div class="sync-code">EXERCISE STIMULUS</div><h3>${exercise.name}</h3><div class="map-level">${currentVariation(selectedExerciseHeatmap).name}</div><p>Mapa aproximado dos músculos mais exigidos por este movimento. Intensidade visual representa função no exercício, não crescimento garantido.</p><div class="stimulus-detail-list">${row(map.primary,"primary")}${row(map.secondary,"secondary")}${row(map.stabilizer,"stabilizer")}</div>`;
    } else {
      const info = bodyInfo[selectedBodyZone];
      const selected = selectedMuscleId ? muscleCatalog[selectedMuscleId] : null;
      $("bodyMapDetail").innerHTML = `<div class="sync-code">${info.code}</div><h3>${selected ? selected.name : info.name}</h3><div class="map-level">${info.name} • Lv. ${bodyLevel(selectedBodyZone)}</div><div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(selectedBodyZone)}%"></div></div><div class="map-xp">${bodyProgress(selectedBodyZone)}/100 para o próximo nível</div><p>${selected ? selected.role : info.description}</p><div class="muscle-detail-list">${muscleRoleMarkup(selectedBodyZone)}</div><p><strong>Como evolui:</strong> ${info.focus}</p>`;
    }
  }
}

function bindBodyMapEvents() {
  document.querySelectorAll("[data-muscle]").forEach((shape) => {
    shape.onclick = () => selectMuscle(shape.dataset.muscle);
    shape.style.cursor = "pointer";
  });
  document.querySelectorAll("[data-body-status]").forEach((card) => card.onclick = () => selectBodyZone(card.dataset.bodyStatus, true));
  document.querySelectorAll("[data-body-region]").forEach((button) => button.onclick = () => selectBodyZone(button.dataset.bodyRegion));
  document.querySelectorAll("[data-muscle-detail]").forEach((button) => button.onclick = () => selectMuscle(button.dataset.muscleDetail));
  document.querySelectorAll("[data-heatmap-exercise]").forEach((button) => button.onclick = () => setExerciseHeatmap(button.dataset.heatmapExercise));
  if ($("clearExerciseHeatmap")) $("clearExerciseHeatmap").onclick = clearExerciseHeatmap;
}

function renderStatus() {
  const muscleZones = Object.entries(bodyInfo).filter(([key]) => key !== "breath");
  if ($("bodyRegionButtons")) $("bodyRegionButtons").innerHTML = muscleZones.map(([key, info]) => `<button class="body-region-chip" data-body-region="${key}" type="button">${info.name}</button>`).join("");
  if ($("exerciseHeatmapButtons")) $("exerciseHeatmapButtons").innerHTML = Object.entries(exercises).map(([key, exercise]) => `<button class="heatmap-chip" data-heatmap-exercise="${key}" type="button">${exercise.short}</button>`).join("");
  $("bodyStatusList").innerHTML = muscleZones.map(([key, info]) => `<div class="attribute-detail ${selectedBodyZone === key && !selectedExerciseHeatmap ? "selected" : ""}" data-body-status="${key}" role="button" tabindex="0"><div class="attribute-detail-head"><strong>${info.name}</strong><strong>Lv. ${bodyLevel(key)}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(key)}%"></div></div><p>${bodyProgress(key)}/100 • ${info.focus}</p></div>`).join("");

  if ($("breathLevelText")) $("breathLevelText").textContent = `Lv. ${bodyLevel("breath")}`;
  if ($("breathProgressBar")) $("breathProgressBar").style.width = `${bodyProgress("breath")}%`;
  if ($("breathProgressText")) $("breathProgressText").textContent = `${bodyProgress("breath")}/100 para o próximo nível.`;
  if ($("breathTotalTime")) $("breathTotalTime").textContent = `${Math.floor(player.stats.totalCardioSeconds / 60)} min`;
  if ($("breathBestSet")) $("breathBestSet").textContent = `${bestSetForExercise("cardio") || 0}s`;

  $("masteryList").innerHTML = Object.values(masteryGroups).map((group) => {
    const level = masteryLevel(group); const names = group.exercises.map((key) => exercises[key].short).join(" + ");
    return `<div class="mastery-row"><div class="mastery-head"><span class="mastery-name">${group.name}</span><span class="mastery-level">Lv. ${level}</span></div><div class="mastery-meta">${group.label} • ${names}</div></div>`;
  }).join("");
  $("skillsList").innerHTML = Object.entries(exercises).map(([key, exercise]) => {
    const required = skillXPRequired(player.skills[key]); const progress = player.skillXP[key]; const best = bestSetForExercise(key);
    return `<div class="skill-row"><div class="skill-head"><strong>${exercise.name}</strong><strong>Lv. ${player.skills[key]}</strong></div><div class="skill-meta">${currentVariation(key).name} • Meta ${targetText(key)} • Melhor série ${best || "—"}${exercise.unit === "seconds" && best ? "s" : ""}</div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,(progress/required)*100)}%"></div></div><div class="skill-footer"><p>${progress}/${required} XP de proficiência</p><button class="equip-button" data-exercise-detail="${key}" type="button">VER FICHA</button></div></div>`;
  }).join("");
  renderBodyMap(); bindBodyMapEvents(); bindExerciseDetailButtons();
}

function renderBodyPreview() {
  if (!$("bodyPreview")) return;
  const muscleZones = Object.entries(bodyInfo).filter(([key]) => key !== "breath");
  $("bodyPreview").innerHTML = `${muscleZones.map(([key, info]) => `<div class="body-mini"><span>${info.name}</span><div class="progress-track"><div class="progress-fill" style="width:${bodyProgress(key)}%"></div></div><strong>${bodyLevel(key)}</strong></div>`).join("")}<div class="body-mini breath-mini"><span>🫁 Fôlego</span><div class="progress-track"><div class="progress-fill" style="width:${bodyProgress("breath")}%"></div></div><strong>${bodyLevel("breath")}</strong></div>`;
}

function previewShopItem(id) {
  const item = shopItems[id];
  if (!item) return;
  if (item.type === "effect") { playLevelEffect(id, { oldLevel: Math.max(1, player.level - 1), newLevel: player.level }); return; }
  if (item.type === "title") { showNotification(`PREVIEW: ${item.name}`); return; }
  if (item.type === "theme") {
    const classes = Object.values(shopItems).filter((entry) => entry.type === "theme").map((entry) => entry.className).filter(Boolean);
    document.body.classList.remove(...classes); document.body.classList.add(item.className);
  }
  if (item.type === "aura") {
    const classes = Object.values(shopItems).filter((entry) => entry.type === "aura").map((entry) => entry.className).filter(Boolean);
    document.body.classList.remove(...classes); document.body.classList.add(item.className);
  }
  if (item.type === "frame") {
    const classes = Object.values(shopItems).filter((entry) => entry.type === "frame").map((entry) => entry.className).filter(Boolean);
    $("playerCard").classList.remove(...classes); $("playerCard").classList.add(item.className);
  }
  showNotification(`PREVIEW: ${item.name}`); setTimeout(applyEquippedTheme, 2600);
}

function openFxGallery() {
  const effects = Object.entries(shopItems).filter(([, item]) => item.type === "effect");
  openModal("GALERIA CINEMÁTICA", `<p>Os efeitos abaixo usam a mesma animação que aparece num Level Up real. Rare e Epic mantêm referências claras; Legendary e Mythic recebem sequências maiores.</p><div class="fx-gallery-grid">${effects.map(([id,item])=>`<button class="fx-gallery-card rarity-${item.rarity.toLowerCase()}" data-gallery-preview="${id}" type="button"><span>${item.rarity}</span><strong>${item.name}</strong><small>${item.description}</small></button>`).join("")}</div>`);
  setTimeout(() => document.querySelectorAll("[data-gallery-preview]").forEach((button) => button.onclick = () => playLevelEffect(button.dataset.galleryPreview, { oldLevel: Math.max(1,player.level-1), newLevel: player.level })), 0);
}

function renderManifestationSettings() {
  const prefs = player.preferences ||= { animationMode: "full", haptics: true, sound: false };
  document.querySelectorAll("[data-animation-mode]").forEach((button) => button.classList.toggle("selected", button.dataset.animationMode === prefs.animationMode));
  if ($("hapticsToggleButton")) $("hapticsToggleButton").textContent = prefs.haptics ? "ATIVADO" : "DESATIVADO";
  if ($("soundToggleButton")) $("soundToggleButton").textContent = prefs.sound ? "ATIVADO" : "DESATIVADO";
}

function renderEvolutionTimeline() {
  if (!$("evolutionTimeline")) return;
  const events = Array.isArray(player.timeline) ? [...player.timeline].reverse().slice(0, 20) : [];
  if (!events.length) {
    $("evolutionTimeline").innerHTML = `<div class="empty-state">A partir da Manifestation Update, Rank Ups, Level Ups, recordes e conquistas importantes aparecerão aqui.</div>`;
    return;
  }
  $("evolutionTimeline").innerHTML = events.map((event) => {
    const date = new Date(event.timestamp); const when = Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(date);
    return `<div class="timeline-event type-${event.type}"><i></i><div><span>${when}</span><strong>${event.title}</strong><p>${event.detail || ""}</p></div></div>`;
  }).join("");
}

function renderHistory() {
  const list = $("historyList"); const cardioMinutes = Math.floor(player.stats.totalCardioSeconds / 60);
  $("historyHighlights").innerHTML = `<div class="history-highlight"><span>EXERCÍCIOS</span><strong>${player.stats.totalExercises}</strong></div><div class="history-highlight"><span>DAILIES</span><strong>${player.stats.totalDailyCompletions}</strong></div><div class="history-highlight"><span>BEST STREAK</span><strong>🔥 ${player.streak.best}</strong></div><div class="history-highlight"><span>CARDIO TOTAL</span><strong>${cardioMinutes} min</strong></div>`;
  renderEvolutionTimeline();
  if (!player.history.length) { list.innerHTML = `<div class="empty-state">Nenhum treino registrado ainda. Seu primeiro resultado aparecerá aqui.</div>`; return; }
  list.innerHTML = [...player.history].reverse().map((entry) => {
    const date = new Date(entry.timestamp); const formatted = Number.isNaN(date.getTime()) ? "Data desconhecida" : new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(date);
    const bodyGains = entry.bodyGains || legacyHistoryBodyGains(entry); const gains = Object.entries(bodyGains).filter(([key,value])=>value>0&&Boolean(bodyInfo[key])).map(([key,value])=>`+${value} ${bodyInfo[key].name}`).join(" • ");
    return `<div class="history-item"><div class="history-head"><strong>${entry.exercise || exercises[entry.exerciseKey]?.name || "Exercício"}</strong><span>${formatted}</span></div><p>${entry.variation ? `${entry.variation} • ` : ""}${Math.round((entry.performance||0)*100)}% do objetivo • +${entry.xp||0} XP • +${entry.essence||0} Essence</p><div class="history-gains">${gains || "Registro anterior preservado"}</div></div>`;
  }).join("");
}

function bindManifestationEvents() {
  if ($("openFxGalleryButton")) $("openFxGalleryButton").addEventListener("click", openFxGallery);
  document.querySelectorAll("[data-animation-mode]").forEach((button) => button.addEventListener("click", () => { player.preferences.animationMode = button.dataset.animationMode; saveGame(); renderManifestationSettings(); showNotification(`ANIMAÇÕES: ${button.textContent}.`); }));
  if ($("hapticsToggleButton")) $("hapticsToggleButton").addEventListener("click", () => { player.preferences.haptics = !player.preferences.haptics; saveGame(); renderManifestationSettings(); if (player.preferences.haptics) vibratePattern([25,30,45]); });
  if ($("soundToggleButton")) $("soundToggleButton").addEventListener("click", () => { player.preferences.sound = !player.preferences.sound; saveGame(); renderManifestationSettings(); if (player.preferences.sound) synthCue("level"); });
}

player = loadGame();
processStreakGap();
resetDailyIfNeeded();
bindEvents();
bindManifestationEvents();
updateUI();
renderManifestationSettings();
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
