"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hud = document.getElementById("hud");
const hubPanel = document.getElementById("hubPanel");
const vaultPanel = document.getElementById("vaultPanel");
const artPanel = document.getElementById("artPanel");
const choicePanel = document.getElementById("choicePanel");
const choiceCards = document.getElementById("choiceCards");
const choiceEyebrow = document.getElementById("choiceEyebrow");
const choiceTitle = document.getElementById("choiceTitle");
const noticePanel = document.getElementById("noticePanel");
const noticeText = document.getElementById("noticeText");
const runPanel = document.getElementById("runPanel");
const resultEyebrow = document.getElementById("resultEyebrow");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultStats = document.getElementById("resultStats");
const hudCharacterName = document.getElementById("hudCharacterName");
const hpFill = document.getElementById("hpFill");
const hpText = document.getElementById("hpText");
const roomText = document.getElementById("roomText");
const coinText = document.getElementById("coinText");
const edictText = document.getElementById("edictText");
const artifactHud = document.getElementById("artifactHud");
const unlockRow = document.getElementById("unlockRow");
const characterGrid = document.getElementById("characterGrid");
const characterHint = document.getElementById("characterHint");
const vaultGoldText = document.getElementById("vaultGoldText");
const vaultCards = document.getElementById("vaultCards");
const startButton = document.getElementById("startButton");
const vaultButton = document.getElementById("vaultButton");
const closeVaultButton = document.getElementById("closeVaultButton");
const artbookButton = document.getElementById("artbookButton");
const closeArtButton = document.getElementById("closeArtButton");
const restartButton = document.getElementById("restartButton");

const TAU = Math.PI * 2;
const ARENA = { width: 1500, height: 900 };
const ROOM_COUNT = 10;
const keys = new Set();
const mouse = { x: ARENA.width / 2, y: ARENA.height / 2, down: false };

const CharacterConfig = {
  shenJin: {
    id: "shenJin",
    name: "沈烬",
    title: "巡夜司新人术士",
    role: "均衡",
    unlockedByDefault: true,
    lore: "出身巡夜司外堂，腰悬符匣与魂灯，擅长把零散法器串成稳定连锁。",
    skillName: "巡夜令",
    skillText: "每击杀 12 个敌人凝成令火，下一次法器触发大幅增强。",
    unlockText: "初始可用",
    maxHp: 120,
    speed: 245,
    attackName: "镇魂符",
    attackCooldown: 0.22,
    dashCooldown: 1.1,
    edictNeed: 12,
    visual: {
      robe: "#10211f",
      sash: "#173a35",
      accent: "#b94634",
      trim: "#e8b85c",
      aura: "rgba(232, 184, 92, 0.35)",
      prop: "lantern",
    },
  },
  linQingwu: {
    id: "linQingwu",
    name: "林青梧",
    title: "司灯医官",
    role: "续航",
    lore: "曾在旧街灯局守夜，能听见魂火将熄前的轻响，擅长把危险转成回复。",
    skillName: "青灯回春",
    skillText: "每第 6 次击杀额外凝出魂火，魂火回复量提高。",
    unlockText: "累计带出 120 库银，或在一局中发现魂灯。",
    maxHp: 104,
    speed: 252,
    attackName: "回灯符",
    attackCooldown: 0.23,
    dashCooldown: 1.05,
    edictNeed: 14,
    visual: {
      robe: "#d7d3bd",
      sash: "#6f9181",
      accent: "#65c6a7",
      trim: "#e9f2d8",
      aura: "rgba(101, 198, 167, 0.34)",
      prop: "healerLamp",
    },
  },
  peiXuance: {
    id: "peiXuance",
    name: "裴玄策",
    title: "雷符校尉",
    role: "爆发",
    lore: "雷部旧案的幸存者，袖中铜铃常鸣，习惯用最短的夜路劈开最硬的妖潮。",
    skillName: "雷契",
    skillText: "每第 5 次出手引一道小雷，所有雷击伤害与范围略增。",
    unlockText: "清理任意一个精英房。",
    maxHp: 112,
    speed: 238,
    attackName: "雷押符",
    attackCooldown: 0.24,
    dashCooldown: 1.16,
    edictNeed: 13,
    visual: {
      robe: "#121c24",
      sash: "#24384d",
      accent: "#a7f5ff",
      trim: "#b27a43",
      aura: "rgba(107, 207, 255, 0.32)",
      prop: "bell",
    },
  },
  yanZhiyuan: {
    id: "yanZhiyuan",
    name: "晏纸鸢",
    title: "纸人匠",
    role: "牵制",
    lore: "会替纸人点眼，也会替活人剪影。她的纸影常比本人先一步挡在鬼前。",
    skillName: "纸影成阵",
    skillText: "闪避会留下短暂纸影；纸影消散时释放小型剑气。",
    unlockText: "让纸人替身在战斗中救命 1 次。",
    maxHp: 96,
    speed: 262,
    attackName: "纸鸢符",
    attackCooldown: 0.2,
    dashCooldown: 0.95,
    edictNeed: 14,
    visual: {
      robe: "#cfc8b4",
      sash: "#5f5a50",
      accent: "#f3dba8",
      trim: "#a13f35",
      aura: "rgba(243, 219, 168, 0.28)",
      prop: "paperBirds",
    },
  },
  tangDengke: {
    id: "tangDengke",
    name: "唐灯客",
    title: "灯市小妖",
    role: "经营",
    lore: "长明旧街的半妖灯商，账本比符箓还厚。入夜后，他知道哪里能用最少银钱换到最狠的东西。",
    skillName: "鬼市契券",
    skillText: "开局额外携带 45 银钱，夜市商店价格降低 25%。",
    unlockText: "击败无面灯婆 1 次。",
    maxHp: 108,
    speed: 248,
    attackName: "灯契符",
    attackCooldown: 0.21,
    dashCooldown: 1.08,
    edictNeed: 15,
    visual: {
      robe: "#2b2318",
      sash: "#5a3b1d",
      accent: "#e8b85c",
      trim: "#c77739",
      aura: "rgba(232, 184, 92, 0.36)",
      prop: "coins",
    },
  },
};

const ArtifactConfig = {
  cinnabarCase: {
    id: "cinnabarCase",
    name: "朱砂符匣",
    type: "攻击",
    rarity: "玄",
    tags: ["符", "火"],
    effect: "符火命中后有概率追加追踪符。",
    upgrades: ["追踪符伤害提升", "触发概率提升", "可连续追加"],
  },
  thunderBell: {
    id: "thunderBell",
    name: "引雷铜铃",
    type: "攻击",
    rarity: "玄",
    tags: ["雷", "铃"],
    effect: "每第 6 次出手召来雷击。",
    upgrades: ["雷击范围提升", "雷击伤害提升", "触发间隔缩短"],
  },
  demonMirror: {
    id: "demonMirror",
    name: "照妖镜",
    type: "护身",
    rarity: "玄",
    tags: ["符", "镜"],
    effect: "闪避后留下镜影吸引妖祟。",
    upgrades: ["镜影持续更久", "镜影更耐打", "镜影消散时震退"],
  },
  soulLamp: {
    id: "soulLamp",
    name: "魂灯",
    type: "触发",
    rarity: "玄",
    tags: ["魂", "火"],
    effect: "击杀妖祟有概率凝出魂火。",
    upgrades: ["魂火回复提升", "魂火概率提升", "满血时转为增伤"],
  },
  woodenSword: {
    id: "woodenSword",
    name: "斩祟木剑",
    type: "攻击",
    rarity: "玄",
    tags: ["剑", "魂"],
    effect: "近身妖祟时自动挥斩。",
    upgrades: ["挥斩范围提升", "挥斩伤害提升", "冷却缩短"],
  },
  paperEffigy: {
    id: "paperEffigy",
    name: "纸人替身",
    type: "护身",
    rarity: "玄",
    tags: ["符", "魂"],
    effect: "致命伤时免死一次，本局损毁。",
    upgrades: ["免死后回复更多", "触发后短暂无敌", "替身燃尽时爆裂"],
  },
};

const PowerItemConfig = {
  cinnabarEdict: {
    id: "cinnabarEdict",
    name: "天师朱批",
    cost: 90,
    effect: "镇魂符基础伤害 +6，前期清怪更利落。",
  },
  nightWard: {
    id: "nightWard",
    name: "夜行护符",
    cost: 110,
    effect: "每局最大生命 +24，并以满血入夜。",
  },
  thunderToken: {
    id: "thunderToken",
    name: "玄雷司铃",
    cost: 130,
    effect: "即使没有引雷铜铃，每第 9 次出手也会落下一道司雷。",
  },
  treasuryPouch: {
    id: "treasuryPouch",
    name: "百鬼钱囊",
    cost: 75,
    effect: "每局开局额外携带 35 银钱，可更早在夜市换补给。",
  },
  goldenDecree: {
    id: "goldenDecree",
    name: "巡夜金令",
    cost: 150,
    effect: "每局开局自带一枚令火，首次法器触发大幅强化。",
  },
};

const EnemyConfig = {
  lanternMoth: {
    id: "lanternMoth",
    name: "灯蛾妖",
    hp: 34,
    speed: 145,
    radius: 18,
    damage: 13,
    color: "#e5aa53",
    behavior: "lunge",
  },
  umbrellaGhost: {
    id: "umbrellaGhost",
    name: "纸伞鬼",
    hp: 58,
    speed: 92,
    radius: 22,
    damage: 12,
    color: "#93c9bd",
    behavior: "ranged",
  },
  gongCorpse: {
    id: "gongCorpse",
    name: "铜锣尸",
    hp: 130,
    speed: 62,
    radius: 28,
    damage: 17,
    color: "#b27a43",
    behavior: "shock",
  },
};

const RoomConfig = {
  normal: [
    { type: "normal", title: "旧街妖影", enemyPool: ["lanternMoth", "umbrellaGhost"], reward: true },
    { type: "normal", title: "纸钱巷", enemyPool: ["lanternMoth", "umbrellaGhost"], reward: true },
    { type: "normal", title: "湿石牌坊", enemyPool: ["lanternMoth", "gongCorpse"], reward: true },
    { type: "normal", title: "残灯市", enemyPool: ["lanternMoth", "umbrellaGhost", "gongCorpse"], reward: true },
    { type: "normal", title: "无灯窄巷", enemyPool: ["umbrellaGhost", "gongCorpse"], reward: true },
  ],
  elite: [
    { type: "elite", title: "铜锣夜巡", enemyPool: ["gongCorpse", "umbrellaGhost"], reward: true },
    { type: "elite", title: "灯蛾成群", enemyPool: ["lanternMoth", "umbrellaGhost"], reward: true },
    { type: "elite", title: "伞骨雨", enemyPool: ["umbrellaGhost", "gongCorpse"], reward: true },
  ],
  event: [
    { type: "event", title: "怪谈摊", reward: false },
    { type: "event", title: "纸人茶棚", reward: false },
  ],
  shop: [{ type: "shop", title: "夜市灯商", reward: false }],
  supply: [{ type: "supply", title: "司灯补给", reward: false }],
  boss: [{ type: "boss", title: "灯下百鬼", boss: "facelessGranny", reward: false }],
};

const affixes = [
  { name: "急行", hp: 1.25, speed: 1.32, cooldown: 0.78 },
  { name: "厚皮", hp: 1.75, speed: 0.92, cooldown: 1 },
  { name: "乱响", hp: 1.35, speed: 1.05, cooldown: 0.68 },
];

const state = {
  scene: "hub",
  selectedCharacter: "shenJin",
  selectedStartArtifact: "cinnabarCase",
  player: null,
  roomIndex: 0,
  roomPlan: [],
  room: null,
  enemies: [],
  projectiles: [],
  enemyProjectiles: [],
  effects: [],
  pickups: [],
  hazards: [],
  decoys: [],
  particles: [],
  rewards: [],
  coins: 0,
  kills: 0,
  runKills: 0,
  elapsed: 0,
  roomElapsed: 0,
  cameraShake: 0,
  noticeTimer: 0,
  unlocks: loadUnlocks(),
};

function loadUnlocks() {
  try {
    const raw = localStorage.getItem("canDengUnlocks");
    if (!raw) return defaultUnlocks();
    const parsed = JSON.parse(raw);
    return {
      bestRoom: Number(parsed.bestRoom) || 0,
      wins: Number(parsed.wins) || 0,
      discovered: Array.isArray(parsed.discovered) ? parsed.discovered : [],
      bankGold: Number(parsed.bankGold) || 0,
      lifetimeBanked: Number(parsed.lifetimeBanked) || 0,
      eliteClears: Number(parsed.eliteClears) || 0,
      effigySaves: Number(parsed.effigySaves) || 0,
      purchasedItems: Array.isArray(parsed.purchasedItems) ? parsed.purchasedItems : [],
      unlockedCharacters: Array.isArray(parsed.unlockedCharacters) ? parsed.unlockedCharacters : ["shenJin"],
    };
  } catch {
    return defaultUnlocks();
  }
}

function defaultUnlocks() {
  return {
    bestRoom: 0,
    wins: 0,
    discovered: [],
    bankGold: 0,
    lifetimeBanked: 0,
    eliteClears: 0,
    effigySaves: 0,
    purchasedItems: [],
    unlockedCharacters: ["shenJin"],
  };
}

function saveUnlocks() {
  try {
    localStorage.setItem("canDengUnlocks", JSON.stringify(state.unlocks));
  } catch {
    // Some file:// privacy modes reject localStorage. The run should still work.
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function normalize(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function screenToWorld(clientX, clientY) {
  const scale = Math.min(window.innerWidth / ARENA.width, window.innerHeight / ARENA.height);
  const offsetX = (window.innerWidth - ARENA.width * scale) / 2;
  const offsetY = (window.innerHeight - ARENA.height * scale) / 2;
  return {
    x: clamp((clientX - offsetX) / scale, 0, ARENA.width),
    y: clamp((clientY - offsetY) / scale, 0, ARENA.height),
  };
}

function withWorld(draw) {
  const scale = Math.min(window.innerWidth / ARENA.width, window.innerHeight / ARENA.height);
  const offsetX = (window.innerWidth - ARENA.width * scale) / 2;
  const offsetY = (window.innerHeight - ARENA.height * scale) / 2;
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  if (state.cameraShake > 0) {
    ctx.translate(rand(-state.cameraShake, state.cameraShake), rand(-state.cameraShake, state.cameraShake));
  }
  draw();
  ctx.restore();
}

function setScene(scene) {
  state.scene = scene;
  hud.classList.toggle("hidden", !["playing", "reward", "event", "shop", "supply"].includes(scene));
  hubPanel.classList.toggle("hidden", scene !== "hub");
  vaultPanel.classList.toggle("hidden", scene !== "vault");
  artPanel.classList.toggle("hidden", scene !== "artbook");
  choicePanel.classList.toggle("hidden", !["reward", "event", "shop", "supply"].includes(scene));
  runPanel.classList.toggle("hidden", scene !== "result");
}

function showNotice(text, duration = 2.1) {
  noticeText.textContent = text;
  noticePanel.classList.remove("hidden");
  state.noticeTimer = duration;
}

function isCharacterUnlocked(id) {
  const config = CharacterConfig[id];
  return Boolean(config?.unlockedByDefault || state.unlocks.unlockedCharacters.includes(id));
}

function refreshCharacterUnlocks() {
  const unlocked = new Set(state.unlocks.unlockedCharacters);
  unlocked.add("shenJin");
  if ((state.unlocks.lifetimeBanked || 0) >= 120 || state.unlocks.discovered.includes("soulLamp")) unlocked.add("linQingwu");
  if ((state.unlocks.eliteClears || 0) >= 1) unlocked.add("peiXuance");
  if ((state.unlocks.effigySaves || 0) >= 1) unlocked.add("yanZhiyuan");
  if ((state.unlocks.wins || 0) >= 1) unlocked.add("tangDengke");
  const before = state.unlocks.unlockedCharacters.length;
  state.unlocks.unlockedCharacters = Array.from(unlocked);
  return state.unlocks.unlockedCharacters.length > before;
}

function renderCharacterSelect() {
  refreshCharacterUnlocks();
  if (!isCharacterUnlocked(state.selectedCharacter)) state.selectedCharacter = "shenJin";
  characterGrid.innerHTML = Object.values(CharacterConfig)
    .map((character) => {
      const unlocked = isCharacterUnlocked(character.id);
      const active = state.selectedCharacter === character.id;
      const status = unlocked ? character.skillText : `解锁：${character.unlockText}`;
      return `
        <article class="character-card${active ? " active" : ""}${unlocked ? "" : " locked"}" data-character-id="${character.id}">
          <span>${character.role} · ${character.title}</span>
          <h2>${character.name}</h2>
          <p>${character.lore}</p>
          <em>${character.skillName}：${status}</em>
        </article>
      `;
    })
    .join("");
  characterHint.textContent = `${CharacterConfig[state.selectedCharacter].name} · ${CharacterConfig[state.selectedCharacter].skillName}`;
  characterGrid.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", () => selectCharacter(card.dataset.characterId));
  });
}

function selectCharacter(id) {
  if (!isCharacterUnlocked(id)) {
    showNotice(CharacterConfig[id].unlockText, 1.8);
    return;
  }
  state.selectedCharacter = id;
  renderCharacterSelect();
}

function updateUnlockRow() {
  refreshCharacterUnlocks();
  const pills = [
    `库银 ${state.unlocks.bankGold || 0}`,
    `最远夜路 ${state.unlocks.bestRoom || 0} / ${ROOM_COUNT}`,
    `破夜 ${state.unlocks.wins || 0} 次`,
  ];
  const discovered = state.unlocks.discovered.length;
  if (discovered) pills.push(`法器见闻 ${discovered} / ${Object.keys(ArtifactConfig).length}`);
  const purchased = state.unlocks.purchasedItems.length;
  if (purchased) pills.push(`司库道具 ${purchased} / ${Object.keys(PowerItemConfig).length}`);
  const characters = state.unlocks.unlockedCharacters.length;
  pills.push(`巡夜人 ${characters} / ${Object.keys(CharacterConfig).length}`);
  unlockRow.innerHTML = pills.map((pill) => `<span class="unlock-pill">${pill}</span>`).join("");
}

function hasPowerItem(id) {
  return state.unlocks.purchasedItems.includes(id);
}

function renderVaultShop() {
  vaultGoldText.textContent = String(state.unlocks.bankGold || 0);
  vaultCards.innerHTML = Object.values(PowerItemConfig)
    .map((item) => {
      const owned = hasPowerItem(item.id);
      const affordable = (state.unlocks.bankGold || 0) >= item.cost;
      const label = owned ? "已入库" : affordable ? `${item.cost} 库银购买` : `需 ${item.cost} 库银`;
      return `
        <article class="vault-card">
          <strong>${item.name}</strong>
          <p>${item.effect}</p>
          <button type="button" data-power-item="${item.id}" ${owned || !affordable ? "disabled" : ""}>${label}</button>
        </article>
      `;
    })
    .join("");
  vaultCards.querySelectorAll("button[data-power-item]").forEach((button) => {
    button.addEventListener("click", () => buyPowerItem(button.dataset.powerItem));
  });
}

function buyPowerItem(id) {
  const item = PowerItemConfig[id];
  if (!item || hasPowerItem(id) || (state.unlocks.bankGold || 0) < item.cost) return;
  state.unlocks.bankGold -= item.cost;
  state.unlocks.purchasedItems.push(id);
  saveUnlocks();
  updateUnlockRow();
  renderVaultShop();
  showNotice(`${item.name} 已入司库。`, 1.6);
}

function createPlayer(characterId, startArtifact) {
  const config = CharacterConfig[characterId] || CharacterConfig.shenJin;
  const maxHp = config.maxHp + (hasPowerItem("nightWard") ? 24 : 0);
  return {
    id: characterId,
    characterId,
    name: config.name,
    title: config.title,
    visual: config.visual,
    x: ARENA.width / 2,
    y: ARENA.height / 2,
    radius: 20,
    maxHp,
    hp: maxHp,
    speed: config.speed,
    attackName: config.attackName,
    attackCooldown: 0,
    attackCooldownBase: config.attackCooldown,
    dashCooldown: 0,
    dashCooldownBase: config.dashCooldown,
    dashTime: 0,
    invuln: 0,
    damageBuff: 0,
    orderFire: hasPowerItem("goldenDecree"),
    edictNeed: config.edictNeed,
    attackCount: 0,
    swordCooldown: 0,
    animTime: 0,
    isMoving: false,
    attackAnim: 0,
    dashAnim: 0,
    baseProjectileDamage: 18 + (hasPowerItem("cinnabarEdict") ? 6 : 0),
    artifacts: [{ id: startArtifact, level: 1, broken: false }],
    lastMove: { x: 1, y: 0 },
  };
}

function makeRoom(type) {
  const template = choice(RoomConfig[type]);
  return {
    ...template,
    enemyPool: template.enemyPool ? template.enemyPool.slice() : undefined,
  };
}

function buildRoomPlan() {
  const flexibleThird = choice(["normal", "event"]);
  const flexibleSixth = choice(["normal", "event", "shop"]);
  const flexibleEighth = choice(["normal", "shop"]);
  return [
    makeRoom("normal"),
    makeRoom("normal"),
    makeRoom(flexibleThird),
    makeRoom("elite"),
    makeRoom("normal"),
    makeRoom(flexibleSixth),
    makeRoom("elite"),
    makeRoom(flexibleEighth),
    makeRoom("supply"),
    makeRoom("boss"),
  ];
}

function startRun() {
  if (!isCharacterUnlocked(state.selectedCharacter)) state.selectedCharacter = "shenJin";
  state.player = createPlayer(state.selectedCharacter, state.selectedStartArtifact);
  state.roomIndex = 0;
  state.roomPlan = buildRoomPlan();
  state.room = null;
  state.enemies = [];
  state.projectiles = [];
  state.enemyProjectiles = [];
  state.effects = [];
  state.pickups = [];
  state.hazards = [];
  state.decoys = [];
  state.particles = [];
  state.rewards = [];
  state.coins = 18 + (hasPowerItem("treasuryPouch") ? 35 : 0) + (state.player.characterId === "tangDengke" ? 45 : 0);
  state.kills = 0;
  state.runKills = 0;
  state.elapsed = 0;
  state.roomElapsed = 0;
  state.cameraShake = 0;
  discoverArtifact(state.selectedStartArtifact);
  setScene("playing");
  beginRoom(0);
  showNotice("长明旧街，残灯未尽。");
}

function discoverArtifact(id) {
  if (!state.unlocks.discovered.includes(id)) {
    state.unlocks.discovered.push(id);
    refreshCharacterUnlocks();
    saveUnlocks();
    renderCharacterSelect();
  }
}

function beginRoom(index) {
  state.roomIndex = index;
  state.room = state.roomPlan[index];
  state.enemies = [];
  state.projectiles = [];
  state.enemyProjectiles = [];
  state.effects = [];
  state.hazards = [];
  state.decoys = [];
  state.particles = [];
  state.pickups = state.pickups.filter((pickup) => pickup.kind === "orderFire");
  state.roomElapsed = 0;
  state.player.x = ARENA.width / 2;
  state.player.y = ARENA.height / 2;
  state.player.invuln = Math.max(state.player.invuln, 0.8);

  if (state.room.type === "event") {
    openEvent();
    return;
  }
  if (state.room.type === "shop") {
    openShop();
    return;
  }
  if (state.room.type === "supply") {
    openSupply();
    return;
  }
  if (state.room.type === "boss") {
    spawnBoss();
    showNotice("无面灯婆在灯影里抬起了头。", 2.4);
    return;
  }

  const count = state.room.type === "elite" ? 5 + index : 6 + index * 2;
  for (let i = 0; i < count; i += 1) {
    const type = choice(state.room.enemyPool);
    const elite = state.room.type === "elite" && i < 2;
    spawnEnemy(type, elite);
  }
  showNotice(state.room.title);
}

function randomEdgePosition() {
  const side = Math.floor(rand(0, 4));
  if (side === 0) return { x: rand(90, ARENA.width - 90), y: 90 };
  if (side === 1) return { x: ARENA.width - 90, y: rand(90, ARENA.height - 90) };
  if (side === 2) return { x: rand(90, ARENA.width - 90), y: ARENA.height - 90 };
  return { x: 90, y: rand(90, ARENA.height - 90) };
}

function spawnEnemy(type, elite = false, position = randomEdgePosition()) {
  const config = EnemyConfig[type];
  const affix = elite ? choice(affixes) : null;
  const hpMul = affix ? affix.hp : 1;
  const speedMul = affix ? affix.speed : 1;
  const enemy = {
    id: `${type}-${Math.random().toString(16).slice(2)}`,
    type,
    name: config.name,
    x: position.x,
    y: position.y,
    vx: 0,
    vy: 0,
    hp: Math.round(config.hp * hpMul * (1 + state.roomIndex * 0.08)),
    maxHp: Math.round(config.hp * hpMul * (1 + state.roomIndex * 0.08)),
    speed: config.speed * speedMul,
    radius: config.radius + (elite ? 4 : 0),
    damage: config.damage + Math.floor(state.roomIndex * 0.7),
    color: config.color,
    behavior: config.behavior,
    elite,
    affix,
    cooldown: rand(0.3, 1.4),
    windup: 0,
    lungeTime: 0,
    mark: 0,
    dead: false,
  };
  state.enemies.push(enemy);
  return enemy;
}

function spawnBoss() {
  state.enemies.push({
    id: "facelessGranny",
    type: "boss",
    name: "无面灯婆",
    x: ARENA.width / 2,
    y: 160,
    vx: 0,
    vy: 0,
    hp: 1250,
    maxHp: 1250,
    speed: 70,
    radius: 46,
    damage: 18,
    color: "#d44f4f",
    behavior: "boss",
    cooldown: 1.2,
    summonCooldown: 3.2,
    hazardCooldown: 5,
    phase: 1,
    elite: true,
    dead: false,
  });
}

function hasArtifact(id) {
  return state.player.artifacts.find((artifact) => artifact.id === id && !artifact.broken);
}

function artifactLevel(id) {
  const artifact = hasArtifact(id);
  return artifact ? artifact.level : 0;
}

function hasCombo(a, b) {
  return Boolean(hasArtifact(a) && hasArtifact(b));
}

function consumeOrderFire() {
  if (!state.player.orderFire) return 1;
  state.player.orderFire = false;
  burstParticles(state.player.x, state.player.y, "#f0c96a", 24, 220);
  showNotice("巡夜令火催动法器。", 1.2);
  return 1.75;
}

function playerShoot() {
  const player = state.player;
  const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  const speed = 610;
  const buff = player.damageBuff > 0 ? 1.25 : 1;
  player.attackAnim = 0.18;
  state.projectiles.push({
    kind: "talisman",
    x: player.x + Math.cos(angle) * 22,
    y: player.y + Math.sin(angle) * 22,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 7,
    damage: player.baseProjectileDamage * buff,
    life: 1.25,
    pierce: 0,
    source: "main",
    color: "#f2cf78",
  });
  player.attackCount += 1;
  spawnSpark(player.x + Math.cos(angle) * 26, player.y + Math.sin(angle) * 26, "#f5d589");

  const bell = hasArtifact("thunderBell");
  if (bell) {
    const interval = Math.max(3, 7 - bell.level);
    if (player.attackCount % interval === 0) {
      triggerLightning(nearestEnemy(player.x, player.y), 42 + bell.level * 8, 56 + bell.level * 8);
    }
  }
  if (hasPowerItem("thunderToken") && player.attackCount % 9 === 0) {
    triggerLightning(nearestEnemy(player.x, player.y), 44, 58);
  }
  if (player.characterId === "peiXuance" && player.attackCount % 5 === 0) {
    triggerLightning(nearestEnemy(player.x, player.y), 34, 52);
  }
}

function nearestEnemy(x, y, maxDistance = Infinity) {
  let best = null;
  let bestDist = maxDistance;
  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    const d = Math.hypot(enemy.x - x, enemy.y - y);
    if (d < bestDist) {
      best = enemy;
      bestDist = d;
    }
  }
  return best;
}

function triggerLightning(target, damage = 50, radius = 64) {
  if (!target || target.dead) return;
  const boost = consumeOrderFire();
  const lightningBonus = state.player?.characterId === "peiXuance" ? 1.15 : 1;
  const finalDamage = damage * boost * lightningBonus;
  const finalRadius = radius + (state.player?.characterId === "peiXuance" ? 10 : 0);
  state.effects.push({
    kind: "lightning",
    x: target.x,
    y: target.y,
    radius: finalRadius,
    life: 0.22,
    maxLife: 0.22,
    color: "#a7f5ff",
  });
  state.cameraShake = Math.max(state.cameraShake, 5);
  for (const enemy of state.enemies) {
    if (!enemy.dead && Math.hypot(enemy.x - target.x, enemy.y - target.y) <= finalRadius) {
      damageEnemy(enemy, finalDamage, "thunder");
    }
  }
}

function spawnHoming(origin, target, damage = 13) {
  if (!target || target.dead) return;
  const boost = consumeOrderFire();
  state.projectiles.push({
    kind: "homing",
    x: origin.x,
    y: origin.y,
    vx: 0,
    vy: 0,
    radius: 6,
    damage: damage * boost,
    life: 1.8,
    targetId: target.id,
    source: "cinnabarCase",
    color: "#ff8f61",
  });
}

function spawnSwordSlash(x, y, radius, damage, boosted = true) {
  const boost = boosted ? consumeOrderFire() : 1;
  state.effects.push({
    kind: "slash",
    x,
    y,
    radius,
    damage: damage * boost,
    life: 0.18,
    maxLife: 0.18,
    hit: new Set(),
    color: "#e9f0c0",
  });
  state.cameraShake = Math.max(state.cameraShake, 2.5);
}

function dashPlayer() {
  const player = state.player;
  if (player.dashCooldown > 0 || player.dashTime > 0) return;
  const dir = normalize(player.lastMove.x, player.lastMove.y);
  player.dashTime = 0.16;
  player.dashAnim = 0.32;
  player.dashCooldown = player.dashCooldownBase;
  player.invuln = 0.28;
  player.vx = dir.x * 760;
  player.vy = dir.y * 760;
  burstParticles(player.x, player.y, "#f0d48a", 18, 160);

  const mirror = hasArtifact("demonMirror");
  if (mirror) {
    const boost = consumeOrderFire();
    state.decoys.push({
      x: player.x - dir.x * 44,
      y: player.y - dir.y * 44,
      radius: 22,
      life: 1.2 + mirror.level * 0.22,
      maxLife: 1.2 + mirror.level * 0.22,
      hp: 40 * boost + mirror.level * 12,
      exploded: false,
    });
  } else if (player.characterId === "yanZhiyuan") {
    state.decoys.push({
      x: player.x - dir.x * 38,
      y: player.y - dir.y * 38,
      radius: 19,
      life: 0.9,
      maxLife: 0.9,
      hp: 32,
      exploded: false,
      fromCharacter: true,
    });
  }
}

function updatePlayer(dt) {
  const player = state.player;
  let mx = 0;
  let my = 0;
  if (keys.has("KeyW") || keys.has("ArrowUp")) my -= 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) my += 1;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
  const movement = normalize(mx, my);
  player.isMoving = mx !== 0 || my !== 0;
  player.animTime += dt;

  if (player.isMoving) player.lastMove = movement;

  if (player.dashTime > 0) {
    player.dashTime -= dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
  } else {
    player.x += movement.x * player.speed * dt;
    player.y += movement.y * player.speed * dt;
  }

  player.x = clamp(player.x, 52, ARENA.width - 52);
  player.y = clamp(player.y, 60, ARENA.height - 56);
  player.attackCooldown -= dt;
  player.dashCooldown -= dt;
  player.invuln -= dt;
  player.damageBuff -= dt;
  player.swordCooldown -= dt;
  player.attackAnim = Math.max(0, player.attackAnim - dt);
  player.dashAnim = Math.max(0, player.dashAnim - dt);

  if (player.attackCooldown <= 0) {
    player.attackCooldown = player.attackCooldownBase;
    playerShoot();
  }

  const sword = hasArtifact("woodenSword");
  if (sword && player.swordCooldown <= 0) {
    const target = nearestEnemy(player.x, player.y, 100 + sword.level * 16);
    if (target) {
      player.swordCooldown = Math.max(0.38, 0.82 - sword.level * 0.08);
      spawnSwordSlash(player.x, player.y, 86 + sword.level * 14, 24 + sword.level * 7);
    }
  }
}

function updateEnemies(dt) {
  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    enemy.mark -= dt;
    if (enemy.behavior === "boss") {
      updateBoss(enemy, dt);
      continue;
    }
    const target = nearestDecoy(enemy) || state.player;
    const angle = Math.atan2(target.y - enemy.y, target.x - enemy.x);
    const d = Math.hypot(target.x - enemy.x, target.y - enemy.y);
    const cooldownMul = enemy.affix ? enemy.affix.cooldown : 1;
    enemy.cooldown -= dt;

    if (enemy.behavior === "lunge") {
      if (enemy.lungeTime > 0) {
        enemy.lungeTime -= dt;
        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;
      } else if (enemy.cooldown <= 0 && d < 440) {
        enemy.lungeTime = 0.33;
        enemy.cooldown = rand(1.25, 1.75) * cooldownMul;
        enemy.vx = Math.cos(angle) * enemy.speed * 2.65;
        enemy.vy = Math.sin(angle) * enemy.speed * 2.65;
        telegraph(enemy.x, enemy.y, 36, "#eab35d");
      } else {
        enemy.x += Math.cos(angle) * enemy.speed * dt;
        enemy.y += Math.sin(angle) * enemy.speed * dt;
      }
    }

    if (enemy.behavior === "ranged") {
      const desired = 330;
      const moveSign = d < desired ? -1 : 1;
      if (Math.abs(d - desired) > 28) {
        enemy.x += Math.cos(angle) * enemy.speed * moveSign * dt;
        enemy.y += Math.sin(angle) * enemy.speed * moveSign * dt;
      }
      if (enemy.cooldown <= 0) {
        enemy.cooldown = rand(1.45, 2.05) * cooldownMul;
        shootEnemyProjectile(enemy, angle);
      }
    }

    if (enemy.behavior === "shock") {
      if (d > 115) {
        enemy.x += Math.cos(angle) * enemy.speed * dt;
        enemy.y += Math.sin(angle) * enemy.speed * dt;
      }
      if (enemy.cooldown <= 0) {
        enemy.cooldown = rand(2.0, 2.65) * cooldownMul;
        createShockwave(enemy.x, enemy.y, 82 + state.roomIndex * 4, enemy.damage);
      }
    }

    enemy.x = clamp(enemy.x, 42, ARENA.width - 42);
    enemy.y = clamp(enemy.y, 58, ARENA.height - 48);
    collideWithPlayer(enemy);
  }
}

function nearestDecoy(enemy) {
  let best = null;
  let bestDist = Infinity;
  for (const decoy of state.decoys) {
    const d = Math.hypot(decoy.x - enemy.x, decoy.y - enemy.y);
    if (d < bestDist && d < 520) {
      best = decoy;
      bestDist = d;
    }
  }
  return best;
}

function updateBoss(boss, dt) {
  const player = state.player;
  const hpRatio = boss.hp / boss.maxHp;
  boss.phase = hpRatio > 0.66 ? 1 : hpRatio > 0.33 ? 2 : 3;
  const angle = angleTo(boss, player);
  const targetY = boss.phase === 3 ? 240 : 180;
  boss.x += Math.cos(angle) * boss.speed * 0.35 * dt;
  boss.y += (targetY - boss.y) * dt * 0.45;
  boss.cooldown -= dt;
  boss.summonCooldown -= dt;
  boss.hazardCooldown -= dt;

  if (boss.cooldown <= 0) {
    boss.cooldown = boss.phase === 3 ? 0.72 : boss.phase === 2 ? 1.05 : 1.28;
    fanAttack(boss.x, boss.y, angle, boss.phase === 3 ? 7 : 5, boss.phase);
  }

  if (boss.summonCooldown <= 0) {
    boss.summonCooldown = boss.phase === 3 ? 2.6 : 3.8;
    const count = boss.phase === 1 ? 2 : 3;
    for (let i = 0; i < count; i += 1) {
      spawnEnemy("lanternMoth", false, { x: boss.x + rand(-80, 80), y: boss.y + rand(70, 130) });
    }
    showNotice("灯蛾从袖中扑出。", 1.2);
  }

  if (boss.phase >= 2 && boss.hazardCooldown <= 0) {
    boss.hazardCooldown = boss.phase === 3 ? 3.4 : 5.2;
    for (let i = 0; i < boss.phase + 1; i += 1) {
      state.hazards.push({
        kind: "dark",
        x: rand(180, ARENA.width - 180),
        y: rand(180, ARENA.height - 120),
        radius: rand(68, 105),
        damage: boss.phase === 3 ? 13 : 9,
        life: 5.5,
        pulse: 0,
      });
    }
    showNotice("灯火熄了一片。", 1.2);
  }
}

function fanAttack(x, y, angle, count, phase) {
  const spread = phase === 3 ? 1.1 : 0.86;
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const a = angle - spread / 2 + spread * t;
    state.enemyProjectiles.push({
      kind: "bossFire",
      x,
      y,
      vx: Math.cos(a) * (phase === 3 ? 310 : 250),
      vy: Math.sin(a) * (phase === 3 ? 310 : 250),
      radius: 12,
      damage: phase === 3 ? 17 : 14,
      life: 3.4,
      color: "#e85c3f",
    });
  }
  state.effects.push({ kind: "fan", x, y, angle, life: 0.26, maxLife: 0.26, color: "#e76d43" });
}

function shootEnemyProjectile(enemy, angle) {
  state.enemyProjectiles.push({
    kind: "umbrellaBone",
    x: enemy.x + Math.cos(angle) * enemy.radius,
    y: enemy.y + Math.sin(angle) * enemy.radius,
    vx: Math.cos(angle) * 260,
    vy: Math.sin(angle) * 260,
    radius: 8,
    damage: enemy.damage,
    life: 3,
    color: "#cfe8da",
  });
  spawnSpark(enemy.x, enemy.y, "#cfe8da");
}

function createShockwave(x, y, radius, damage) {
  state.effects.push({
    kind: "shockwave",
    x,
    y,
    radius,
    damage,
    life: 0.55,
    maxLife: 0.55,
    hitPlayer: false,
    color: "#d9ab69",
  });
  state.cameraShake = Math.max(state.cameraShake, 3);
}

function telegraph(x, y, radius, color) {
  state.effects.push({ kind: "telegraph", x, y, radius, life: 0.26, maxLife: 0.26, color });
}

function collideWithPlayer(enemy) {
  const player = state.player;
  if (player.invuln > 0) return;
  const d = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  if (d < player.radius + enemy.radius * 0.78) {
    damagePlayer(enemy.damage, enemy.name);
    const push = normalize(player.x - enemy.x, player.y - enemy.y);
    player.x += push.x * 24;
    player.y += push.y * 24;
    enemy.x -= push.x * 12;
    enemy.y -= push.y * 12;
  }
}

function damagePlayer(amount, source) {
  const player = state.player;
  if (player.invuln > 0 || state.scene !== "playing") return;

  if (player.hp - amount <= 0) {
    const effigy = hasArtifact("paperEffigy");
    if (effigy && !effigy.broken) {
      effigy.broken = true;
      state.unlocks.effigySaves = (state.unlocks.effigySaves || 0) + 1;
      refreshCharacterUnlocks();
      saveUnlocks();
      renderCharacterSelect();
      player.hp = Math.max(28 + effigy.level * 8, player.hp);
      player.invuln = 2.2 + effigy.level * 0.25;
      state.cameraShake = Math.max(state.cameraShake, 9);
      burstParticles(player.x, player.y, "#f3dba8", 42, 260);
      if (hasCombo("soulLamp", "paperEffigy")) detonateSoulFires();
      showNotice("纸人替身燃尽，替你挡下一死。", 2);
      updateHud();
      return;
    }
  }

  player.hp -= amount;
  player.invuln = 0.55;
  state.cameraShake = Math.max(state.cameraShake, 6);
  burstParticles(player.x, player.y, "#c9363f", 20, 180);
  if (player.hp <= 0) {
    player.hp = 0;
    finishRun(false, source);
  }
  updateHud();
}

function detonateSoulFires() {
  let count = 0;
  for (const pickup of state.pickups) {
    if (pickup.kind !== "soulFire") continue;
    count += 1;
    state.effects.push({
      kind: "soulBurst",
      x: pickup.x,
      y: pickup.y,
      radius: 120,
      damage: 58,
      life: 0.32,
      maxLife: 0.32,
      color: "#64e0b5",
    });
  }
  state.pickups = state.pickups.filter((pickup) => pickup.kind !== "soulFire");
  if (count) showNotice("魂火随替身一并爆燃。", 1.6);
}

function damageEnemy(enemy, amount, source = "hit") {
  if (!enemy || enemy.dead) return;
  enemy.hp -= amount;
  enemy.hitFlash = 0.12;
  if (source === "thunder") enemy.mark = 0;
  if (enemy.hp <= 0) {
    killEnemy(enemy);
  }
}

function killEnemy(enemy) {
  if (enemy.dead) return;
  enemy.dead = true;
  state.kills += 1;
  state.runKills += 1;
  state.coins += enemy.type === "boss" ? 40 : enemy.elite ? 9 : 3;
  burstParticles(enemy.x, enemy.y, enemy.color, enemy.type === "boss" ? 80 : 24, enemy.type === "boss" ? 360 : 200);
  if (enemy.type !== "boss" && state.kills % state.player.edictNeed === 0) {
    state.pickups.push({ kind: "orderFire", x: enemy.x, y: enemy.y, radius: 13, life: 18 });
    showNotice("巡夜令火凝成。", 1.4);
  }
  if (state.player.characterId === "linQingwu" && enemy.type !== "boss" && state.runKills % 6 === 0) {
    state.pickups.push({ kind: "soulFire", x: enemy.x + rand(-14, 14), y: enemy.y + rand(-14, 14), radius: 12, life: 14 });
  }
  const lamp = hasArtifact("soulLamp");
  if (lamp && enemy.type !== "boss") {
    const chance = 0.18 + lamp.level * 0.06;
    if (Math.random() < chance) {
      state.pickups.push({ kind: "soulFire", x: enemy.x + rand(-10, 10), y: enemy.y + rand(-10, 10), radius: 11, life: 12 });
    }
  }
  if (enemy.type === "boss") finishRun(true, enemy.name);
}

function updateProjectiles(dt) {
  for (const projectile of state.projectiles) {
    if (projectile.kind === "homing") {
      const target = state.enemies.find((enemy) => enemy.id === projectile.targetId && !enemy.dead) || nearestEnemy(projectile.x, projectile.y);
      if (target) {
        const a = Math.atan2(target.y - projectile.y, target.x - projectile.x);
        projectile.vx = projectile.vx * 0.86 + Math.cos(a) * 520 * 0.14;
        projectile.vy = projectile.vy * 0.86 + Math.sin(a) * 520 * 0.14;
      }
    }
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    projectile.dead ||= projectile.life <= 0 || projectile.x < -30 || projectile.x > ARENA.width + 30 || projectile.y < -30 || projectile.y > ARENA.height + 30;

    for (const enemy of state.enemies) {
      if (enemy.dead || projectile.dead) continue;
      if (Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y) <= enemy.radius + projectile.radius) {
        damageEnemy(enemy, projectile.damage, projectile.source);
        onPlayerProjectileHit(projectile, enemy);
        if (projectile.pierce > 0) projectile.pierce -= 1;
        else projectile.dead = true;
      }
    }
  }
  state.projectiles = state.projectiles.filter((projectile) => !projectile.dead);

  for (const projectile of state.enemyProjectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    projectile.dead ||= projectile.life <= 0;
    const player = state.player;
    if (!projectile.dead && player.invuln <= 0 && Math.hypot(projectile.x - player.x, projectile.y - player.y) <= projectile.radius + player.radius) {
      projectile.dead = true;
      damagePlayer(projectile.damage, projectile.kind === "bossFire" ? "灯火" : "伞骨");
    }
  }
  state.enemyProjectiles = state.enemyProjectiles.filter((projectile) => !projectile.dead);
}

function onPlayerProjectileHit(projectile, enemy) {
  if (projectile.source !== "main") return;
  const cinnabar = hasArtifact("cinnabarCase");
  if (cinnabar) {
    const chance = 0.16 + cinnabar.level * 0.07;
    if (Math.random() < chance) {
      spawnHoming(projectile, nearestEnemy(enemy.x, enemy.y, 520), 13 + cinnabar.level * 4);
    }
  }
  if (hasCombo("cinnabarCase", "thunderBell") && Math.random() < 0.24) {
    enemy.mark = 1.4;
    state.effects.push({
      kind: "mark",
      x: enemy.x,
      y: enemy.y,
      radius: enemy.radius + 10,
      life: 0.3,
      maxLife: 0.3,
      color: "#a7f5ff",
    });
    setTimeout(() => {
      if (state.scene === "playing" && !enemy.dead && enemy.mark > 0) triggerLightning(enemy, 36 + artifactLevel("thunderBell") * 6, 58);
    }, 260);
  }
}

function updateEffects(dt) {
  for (const effect of state.effects) {
    effect.life -= dt;
    if (effect.kind === "slash" || effect.kind === "soulBurst") {
      for (const enemy of state.enemies) {
        if (enemy.dead || effect.hit?.has(enemy.id)) continue;
        if (Math.hypot(enemy.x - effect.x, enemy.y - effect.y) <= effect.radius + enemy.radius * 0.4) {
          damageEnemy(enemy, effect.damage, effect.kind);
          effect.hit?.add(enemy.id);
        }
      }
    }
    if (effect.kind === "shockwave") {
      const age = 1 - effect.life / effect.maxLife;
      const waveRadius = effect.radius * age;
      const player = state.player;
      const d = Math.hypot(player.x - effect.x, player.y - effect.y);
      if (!effect.hitPlayer && d > waveRadius - 12 && d < waveRadius + 18) {
        effect.hitPlayer = true;
        damagePlayer(effect.damage, "铜锣震波");
      }
    }
  }
  state.effects = state.effects.filter((effect) => effect.life > 0);
}

function updatePickups(dt) {
  const player = state.player;
  for (const pickup of state.pickups) {
    pickup.life -= dt;
    pickup.pulse = (pickup.pulse || 0) + dt * 5;
    if (Math.hypot(player.x - pickup.x, player.y - pickup.y) <= player.radius + pickup.radius + 8) {
      pickup.dead = true;
      if (pickup.kind === "soulFire") {
        const lampLevel = artifactLevel("soulLamp");
        const healerBonus = player.characterId === "linQingwu" ? 6 : 0;
        if (player.hp >= player.maxHp) {
          player.damageBuff = Math.max(player.damageBuff, 4.5 + lampLevel * 0.7 + healerBonus * 0.12);
          showNotice("魂火转为符火锐意。", 1.2);
        } else {
          player.hp = Math.min(player.maxHp, player.hp + 7 + lampLevel * 3 + healerBonus);
        }
        burstParticles(pickup.x, pickup.y, "#65c6a7", 14, 120);
      }
      if (pickup.kind === "orderFire") {
        player.orderFire = true;
        burstParticles(pickup.x, pickup.y, "#f0c96a", 22, 170);
      }
    }
  }
  state.pickups = state.pickups.filter((pickup) => !pickup.dead && pickup.life > 0);
}

function updateHazards(dt) {
  const player = state.player;
  for (const hazard of state.hazards) {
    hazard.life -= dt;
    hazard.pulse += dt;
    if (Math.hypot(player.x - hazard.x, player.y - hazard.y) <= hazard.radius && hazard.pulse > 0.55) {
      hazard.pulse = 0;
      damagePlayer(hazard.damage, "熄灯暗区");
    }
  }
  state.hazards = state.hazards.filter((hazard) => hazard.life > 0);
}

function updateDecoys(dt) {
  for (const decoy of state.decoys) {
    decoy.life -= dt;
    for (const enemy of state.enemies) {
      if (enemy.dead) continue;
      const d = Math.hypot(enemy.x - decoy.x, enemy.y - decoy.y);
      if (d < enemy.radius + decoy.radius) {
        decoy.hp -= enemy.damage * dt * 0.8;
      }
    }
    if ((decoy.life <= 0 || decoy.hp <= 0) && !decoy.exploded) {
      decoy.exploded = true;
      if (hasCombo("demonMirror", "woodenSword")) {
        spawnSwordSlash(decoy.x, decoy.y, 132 + artifactLevel("woodenSword") * 12, 34 + artifactLevel("woodenSword") * 6, false);
      } else if (decoy.fromCharacter) {
        spawnSwordSlash(decoy.x, decoy.y, 92, 24, false);
      }
    }
  }
  state.decoys = state.decoys.filter((decoy) => decoy.life > 0 && decoy.hp > 0);
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.96;
    particle.vy *= 0.96;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function burstParticles(x, y, color, count, speed) {
  for (let i = 0; i < count; i += 1) {
    const a = rand(0, TAU);
    const s = rand(speed * 0.25, speed);
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      radius: rand(2, 5),
      life: rand(0.35, 0.8),
      maxLife: 0.8,
      color,
    });
  }
}

function spawnSpark(x, y, color) {
  burstParticles(x, y, color, 5, 90);
}

function checkRoomClear() {
  if (state.scene !== "playing") return;
  if (state.room.type === "boss") return;
  const remaining = state.enemies.some((enemy) => !enemy.dead);
  if (!remaining) {
    state.unlocks.bestRoom = Math.max(state.unlocks.bestRoom, state.roomIndex + 1);
    if (state.room.type === "elite") state.unlocks.eliteClears = (state.unlocks.eliteClears || 0) + 1;
    refreshCharacterUnlocks();
    saveUnlocks();
    renderCharacterSelect();
    if (state.room.reward) {
      openReward();
    } else {
      nextRoom();
    }
  }
}

function openReward() {
  setScene("reward");
  choiceEyebrow.textContent = "战利";
  choiceTitle.textContent = "择一法器";
  const options = makeRewardOptions();
  renderChoices(options);
}

function makeRewardOptions() {
  const options = [];
  const ownedIds = state.player.artifacts.map((artifact) => artifact.id);
  const unowned = Object.keys(ArtifactConfig).filter((id) => !ownedIds.includes(id));
  if (state.player.artifacts.length < 4 && unowned.length) {
    while (options.length < 2 && unowned.length) {
      const id = unowned.splice(Math.floor(rand(0, unowned.length)), 1)[0];
      options.push({
        title: ArtifactConfig[id].name,
        kind: "法器",
        body: `${ArtifactConfig[id].effect} 标签：${ArtifactConfig[id].tags.join(" / ")}`,
        action: () => addArtifact(id),
      });
    }
  }
  const upgradeable = state.player.artifacts.filter((artifact) => artifact.level < 4 && !artifact.broken);
  if (upgradeable.length) {
    const artifact = choice(upgradeable);
    const config = ArtifactConfig[artifact.id];
    options.push({
      title: `${config.name} +1`,
      kind: "升阶",
      body: config.upgrades[Math.min(artifact.level - 1, config.upgrades.length - 1)] || "法器灵光更盛。",
      action: () => upgradeArtifact(artifact.id),
    });
  }
  options.push({
    title: "巡夜银钱",
    kind: "银钱",
    body: "获得 18 枚银钱，夜市可换补给。",
    action: () => {
      state.coins += 18;
      nextRoom();
    },
  });
  while (options.length < 3) {
    options.push({
      title: "司灯符水",
      kind: "补给",
      body: "回复 22 点生命。",
      action: () => {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 22);
        nextRoom();
      },
    });
  }
  return shuffle(options).slice(0, 3);
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function addArtifact(id) {
  if (state.player.artifacts.length >= 4) {
    state.coins += 16;
    showNotice("法器匣已满，折为银钱。");
  } else {
    state.player.artifacts.push({ id, level: 1, broken: false });
    discoverArtifact(id);
    showNotice(`${ArtifactConfig[id].name} 入匣。`);
  }
  nextRoom();
}

function upgradeArtifact(id) {
  const artifact = state.player.artifacts.find((item) => item.id === id);
  if (artifact) {
    artifact.level = Math.min(4, artifact.level + 1);
    showNotice(`${ArtifactConfig[id].name} 升至 ${artifact.level} 阶。`);
  }
  nextRoom();
}

function openEvent() {
  setScene("event");
  choiceEyebrow.textContent = "怪谈";
  choiceTitle.textContent = "灯下小摊";
  renderChoices([
    {
      title: "买一盏旧魂灯",
      kind: "怪谈钥物",
      body: "失去 14 生命，获得 26 银钱与一枚令火。",
      action: () => {
        state.player.hp = Math.max(1, state.player.hp - 14);
        state.coins += 26;
        state.player.orderFire = true;
        showNotice("灯芯里有一瞬像人在眨眼。", 1.6);
        nextRoom();
      },
    },
    {
      title: "替摊主镇符",
      kind: "怪谈",
      body: "立即升级一个已持有法器。",
      action: () => {
        const up = state.player.artifacts.filter((artifact) => artifact.level < 4 && !artifact.broken);
        if (up.length) upgradeArtifact(choice(up).id);
        else {
          state.coins += 18;
          nextRoom();
        }
      },
    },
    {
      title: "绕摊而过",
      kind: "谨慎",
      body: "回复 16 生命，继续巡街。",
      action: () => {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 16);
        nextRoom();
      },
    },
  ]);
}

function openShop() {
  setScene("shop");
  choiceEyebrow.textContent = "夜市";
  choiceTitle.textContent = "灯商开价";
  const ownedIds = state.player.artifacts.map((artifact) => artifact.id);
  const unowned = Object.keys(ArtifactConfig).filter((id) => !ownedIds.includes(id));
  const shopArtifact = unowned.length ? choice(unowned) : null;
  const artifactCost = shopCost(32);
  const upgradeCost = shopCost(24);
  const wineCost = shopCost(14);
  renderChoices([
    {
      title: shopArtifact ? ArtifactConfig[shopArtifact].name : "空法器匣",
      kind: `${artifactCost} 银钱`,
      body: shopArtifact ? ArtifactConfig[shopArtifact].effect : "没有新的法器，只余几张黄纸。",
      disabled: !shopArtifact || state.coins < artifactCost || state.player.artifacts.length >= 4,
      action: () => {
        state.coins -= artifactCost;
        addArtifact(shopArtifact);
      },
    },
    {
      title: "擦亮旧器",
      kind: `${upgradeCost} 银钱`,
      body: "随机升级一个已持有法器。",
      disabled: state.coins < upgradeCost,
      action: () => {
        state.coins -= upgradeCost;
        const up = state.player.artifacts.filter((artifact) => artifact.level < 4 && !artifact.broken);
        if (up.length) upgradeArtifact(choice(up).id);
        else nextRoom();
      },
    },
    {
      title: "温酒符水",
      kind: `${wineCost} 银钱`,
      body: "回复 36 点生命。",
      disabled: state.coins < wineCost,
      action: () => {
        state.coins -= wineCost;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 36);
        nextRoom();
      },
    },
  ]);
}

function shopCost(baseCost) {
  return state.player?.characterId === "tangDengke" ? Math.max(1, Math.ceil(baseCost * 0.75)) : baseCost;
}

function openSupply() {
  setScene("supply");
  choiceEyebrow.textContent = "补给";
  choiceTitle.textContent = "Boss 前整备";
  renderChoices([
    {
      title: "司灯符水",
      kind: "补给",
      body: "回复 45 点生命。",
      action: () => {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 45);
        nextRoom();
      },
    },
    {
      title: "令火入匣",
      kind: "爆发",
      body: "获得一枚令火，下一次法器触发大幅增强。",
      action: () => {
        state.player.orderFire = true;
        nextRoom();
      },
    },
    {
      title: "重整法器",
      kind: "升阶",
      body: "随机升级一个已持有法器。",
      action: () => {
        const up = state.player.artifacts.filter((artifact) => artifact.level < 4 && !artifact.broken);
        if (up.length) upgradeArtifact(choice(up).id);
        else nextRoom();
      },
    },
  ]);
}

function renderChoices(options) {
  choiceCards.innerHTML = "";
  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-card${option.disabled ? " disabled" : ""}`;
    button.disabled = Boolean(option.disabled);
    button.innerHTML = `<span>${option.kind}</span><h3>${option.title}</h3><p>${option.body}</p>`;
    button.addEventListener("click", () => {
      if (option.disabled) return;
      option.action();
      updateHud();
    });
    choiceCards.appendChild(button);
  }
  updateHud();
}

function nextRoom() {
  if (state.roomIndex + 1 >= ROOM_COUNT) {
    finishRun(false, "夜色");
    return;
  }
  setScene("playing");
  beginRoom(state.roomIndex + 1);
  updateHud();
}

function finishRun(victory, source) {
  if (state.scene === "result") return;
  const bankedGold = Math.max(0, Math.floor(state.coins));
  state.unlocks.bestRoom = Math.max(state.unlocks.bestRoom, state.roomIndex + 1);
  if (victory) state.unlocks.wins += 1;
  state.unlocks.bankGold = (state.unlocks.bankGold || 0) + bankedGold;
  state.unlocks.lifetimeBanked = (state.unlocks.lifetimeBanked || 0) + bankedGold;
  refreshCharacterUnlocks();
  saveUnlocks();
  renderCharacterSelect();

  setScene("result");
  resultEyebrow.textContent = victory ? "破夜" : "夜巡终了";
  resultTitle.textContent = victory ? "残灯复明" : "长街仍暗";
  resultText.textContent = victory
    ? `无面灯婆的灯盏碎在街心，${bankedGold} 枚银钱已入司库。`
    : `${state.player.name}倒在${source || "夜色"}之前，巡夜司带回了 ${bankedGold} 枚银钱。`;
  resultStats.innerHTML = [
    `巡夜人 ${state.player.name}`,
    `抵达 ${Math.min(state.roomIndex + 1, ROOM_COUNT)} / ${ROOM_COUNT}`,
    `击杀 ${state.runKills}`,
    `带出库银 +${bankedGold}`,
    `司库余额 ${state.unlocks.bankGold}`,
    `法器 ${state.player.artifacts.map((artifact) => ArtifactConfig[artifact.id].name).join("、")}`,
  ]
    .map((item) => `<span class="stat-pill">${item}</span>`)
    .join("");
}

function updateHud() {
  if (!state.player) return;
  const hpRatio = state.player.hp / state.player.maxHp;
  hudCharacterName.textContent = state.player.name;
  hpFill.style.width = `${clamp(hpRatio * 100, 0, 100)}%`;
  hpText.textContent = `${Math.ceil(state.player.hp)} / ${state.player.maxHp}`;
  roomText.textContent = `${Math.min(state.roomIndex + 1, ROOM_COUNT)} / ${ROOM_COUNT}`;
  coinText.textContent = String(state.coins);
  edictText.textContent = state.player.orderFire
    ? "令火待发"
    : `${state.kills % state.player.edictNeed} / ${state.player.edictNeed}`;
  artifactHud.innerHTML = state.player.artifacts
    .map((artifact) => {
      const config = ArtifactConfig[artifact.id];
      const broken = artifact.broken ? " · 已损" : "";
      return `<div class="artifact-chip"><span>${config.type} · ${config.tags.join("/")}</span><strong>${config.name} ${artifact.level}阶${broken}</strong></div>`;
    })
    .join("");
}

function update(dt) {
  if (state.noticeTimer > 0) {
    state.noticeTimer -= dt;
    if (state.noticeTimer <= 0) noticePanel.classList.add("hidden");
  }
  state.cameraShake = Math.max(0, state.cameraShake - dt * 18);

  if (state.scene !== "playing") {
    updateParticles(dt);
    return;
  }
  state.elapsed += dt;
  state.roomElapsed += dt;
  updatePlayer(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateEffects(dt);
  updatePickups(dt);
  updateHazards(dt);
  updateDecoys(dt);
  updateParticles(dt);
  state.enemies = state.enemies.filter((enemy) => !enemy.dead || enemy.type === "boss");
  checkRoomClear();
  updateHud();
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  withWorld(() => {
    drawBackground();
    drawHazards();
    drawPickups();
    drawDecoys();
    drawProjectiles();
    drawEnemies();
    drawPlayer();
    drawEffects();
    drawParticles();
    drawArenaVignette();
  });
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, ARENA.height);
  sky.addColorStop(0, "#111715");
  sky.addColorStop(0.54, "#17201d");
  sky.addColorStop(1, "#0a0d0c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#c9b88e";
  ctx.lineWidth = 1;
  for (let x = 0; x < ARENA.width; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x + ((Math.floor(x / 70) % 2) * 22), 0);
    ctx.lineTo(x - 30, ARENA.height);
    ctx.stroke();
  }
  for (let y = 40; y < ARENA.height; y += 74) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ARENA.width, y + Math.sin(y) * 20);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#f3dba8";
  for (let i = 0; i < 80; i += 1) {
    const x = (i * 191) % ARENA.width;
    const y = 80 + ((i * 113) % (ARENA.height - 160));
    ctx.beginPath();
    ctx.ellipse(x, y, 18 + (i % 5) * 4, 3 + (i % 3), (i % 9) * 0.2, 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  drawStreetProps();
}

function drawStreetProps() {
  const lanterns = [
    [130, 110],
    [1370, 116],
    [115, 770],
    [1380, 760],
    [760, 80],
  ];
  for (const [x, y] of lanterns) {
    const gradient = ctx.createRadialGradient(x, y, 10, x, y, 150);
    gradient.addColorStop(0, "rgba(226, 111, 60, 0.28)");
    gradient.addColorStop(1, "rgba(226, 111, 60, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 150, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#e56b45";
    roundedRect(x - 10, y - 17, 20, 34, 8);
    ctx.fill();
    ctx.strokeStyle = "#f2d58d";
    ctx.strokeRect(x - 7, y - 13, 14, 26);
    drawTalisman(x - 4, y + 26, 8, 34, "#b94932");
  }

  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = "#d6c28c";
  for (let i = 0; i < 36; i += 1) {
    const x = (i * 173) % ARENA.width;
    const y = 120 + ((i * 97) % (ARENA.height - 230));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i % 7) * 0.24);
    ctx.fillRect(-5, -2, 10, 4);
    ctx.restore();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(232, 184, 92, 0.26)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(540, 46);
  ctx.lineTo(960, 46);
  ctx.moveTo(590, 46);
  ctx.lineTo(590, 118);
  ctx.moveTo(910, 46);
  ctx.lineTo(910, 118);
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = 0.36;
  ctx.strokeStyle = "#85745b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ARENA.width / 2, 114, 148, Math.PI, TAU);
  ctx.stroke();
  ctx.fillStyle = "rgba(11, 16, 16, 0.42)";
  roundedRect(ARENA.width / 2 - 120, 72, 240, 24, 4);
  ctx.fill();
  ctx.restore();

  const paperRows = [
    [420, 126],
    [1080, 128],
    [300, 720],
    [1180, 720],
  ];
  for (const [x, y] of paperRows) {
    drawTalisman(x, y, 18, 62, "#b94634");
    drawTalisman(x + 26, y + 9, 16, 54, "#d7bf82");
    drawTalisman(x + 50, y - 2, 18, 62, "#733233");
  }
}

function drawTalisman(x, y, width, height, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin((x + y + performance.now() * 0.04) * 0.01) * 0.05);
  ctx.fillStyle = color;
  roundedRect(-width / 2, 0, width, height, 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(247, 236, 213, 0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-width * 0.22, height * 0.26);
  ctx.lineTo(width * 0.2, height * 0.26);
  ctx.moveTo(0, height * 0.38);
  ctx.lineTo(-width * 0.18, height * 0.58);
  ctx.lineTo(width * 0.18, height * 0.75);
  ctx.stroke();
  ctx.restore();
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function drawPlayer() {
  const p = state.player;
  if (!p) return;
  const visual = p.visual || CharacterConfig.shenJin.visual;
  const aim = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  const moveWave = Math.sin(p.animTime * (p.isMoving ? 14 : 3));
  const bob = moveWave * (p.isMoving ? 3.2 : 1.2);
  const step = p.isMoving ? Math.sin(p.animTime * 18) : 0;
  const attackPulse = clamp(p.attackAnim / 0.18, 0, 1);
  const dashPulse = clamp(p.dashAnim / 0.32, 0, 1);

  if (dashPulse > 0) drawPlayerDashTrail(p, aim, visual, dashPulse);

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(aim);
  ctx.globalAlpha = p.invuln > 0 ? 0.72 + Math.sin(performance.now() / 55) * 0.18 : 1;

  const glow = ctx.createRadialGradient(0, bob, 4, 0, bob, 52 + attackPulse * 10);
  glow.addColorStop(0, visual.aura);
  glow.addColorStop(1, "rgba(232, 184, 92, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, bob, 52 + attackPulse * 10, 0, TAU);
  ctx.fill();

  drawCharacterShadow(step, dashPulse);
  drawCharacterRobe(visual, bob, step);
  drawCharacterTrim(visual, bob);
  drawCharacterHead(visual, bob);
  drawCharacterArms(visual, bob, step, attackPulse);
  drawCharacterProp(p, visual, bob, attackPulse);
  drawCharacterSpecial(p, visual, bob, attackPulse);

  if (p.orderFire) {
    ctx.strokeStyle = visual.trim;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, bob, 30 + Math.sin(performance.now() / 120) * 3, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayerDashTrail(p, aim, visual, dashPulse) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(aim);
  ctx.globalAlpha = 0.26 * dashPulse;
  ctx.fillStyle = visual.accent;
  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(-i * 19, 8, 17 + i * 7, 8 + i * 2, 0, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawCharacterShadow(step, dashPulse) {
  ctx.fillStyle = "rgba(5, 8, 8, 0.45)";
  ctx.beginPath();
  ctx.ellipse(-5, 18, 28 + Math.abs(step) * 4 + dashPulse * 9, 12, 0, 0, TAU);
  ctx.fill();
}

function drawCharacterRobe(visual, bob, step) {
  ctx.fillStyle = visual.robe;
  ctx.beginPath();
  ctx.moveTo(-16, -17 + bob);
  ctx.quadraticCurveTo(-27 - step * 1.5, 3 + bob, -21 - step * 2, 25 + bob);
  ctx.quadraticCurveTo(0, 35 + bob + Math.abs(step) * 2, 23 + step * 2, 23 + bob);
  ctx.quadraticCurveTo(25 + step, 1 + bob, 14, -17 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = visual.sash;
  ctx.beginPath();
  ctx.moveTo(-20, 6 + bob);
  ctx.lineTo(18, 1 + bob);
  ctx.lineTo(20, 9 + bob);
  ctx.lineTo(-18, 13 + bob);
  ctx.closePath();
  ctx.fill();
}

function drawCharacterTrim(visual, bob) {
  ctx.strokeStyle = visual.trim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -14 + bob);
  ctx.quadraticCurveTo(5, 0 + bob, 8, 24 + bob);
  ctx.moveTo(-20, 5 + bob);
  ctx.lineTo(19, 5 + bob);
  ctx.stroke();
}

function drawCharacterHead(visual, bob) {
  ctx.fillStyle = visual.sash;
  ctx.beginPath();
  ctx.moveTo(-10, -21 + bob);
  ctx.quadraticCurveTo(0, -31 + bob, 12, -19 + bob);
  ctx.quadraticCurveTo(6, -11 + bob, -6, -12 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = visual.trim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-2, -29 + bob);
  ctx.quadraticCurveTo(8, -37 + bob, 18, -28 + bob);
  ctx.stroke();
}

function drawCharacterArms(visual, bob, step, attackPulse) {
  ctx.strokeStyle = visual.robe;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-10, -2 + bob);
  ctx.lineTo(-24 - step * 2, 10 + bob + step * 2);
  ctx.moveTo(9, -4 + bob);
  ctx.lineTo(22 + attackPulse * 16, -2 + bob - attackPulse * 9);
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.fillStyle = visual.accent;
  if (attackPulse > 0) {
    ctx.beginPath();
    ctx.arc(30 + attackPulse * 16, -4 + bob - attackPulse * 8, 5 + attackPulse * 4, 0, TAU);
    ctx.fill();
  }
}

function drawCharacterProp(p, visual, bob, attackPulse) {
  if (visual.prop === "lantern") {
    drawSmallLantern(-24, 14 + bob, visual.trim, attackPulse);
    drawTalisman(20 + attackPulse * 14, -24 + bob, 8, 28, visual.accent);
  } else if (visual.prop === "healerLamp") {
    drawSmallLantern(-23, 13 + bob, visual.accent, attackPulse);
    ctx.fillStyle = visual.accent;
    ctx.beginPath();
    ctx.arc(27 + attackPulse * 9, -10 + bob, 4, 0, TAU);
    ctx.arc(36 + attackPulse * 11, -2 + bob, 3, 0, TAU);
    ctx.fill();
  } else if (visual.prop === "bell") {
    ctx.fillStyle = visual.trim;
    ctx.beginPath();
    ctx.arc(-21, 11 + bob, 9, Math.PI, TAU);
    ctx.lineTo(-12, 22 + bob);
    ctx.lineTo(-30, 22 + bob);
    ctx.closePath();
    ctx.fill();
    if (attackPulse > 0) drawLightningGlyph(30, -4 + bob, visual.accent, attackPulse);
  } else if (visual.prop === "paperBirds") {
    drawPaperBird(-24, -7 + bob, visual.accent, -0.5);
    drawPaperBird(27 + attackPulse * 12, -13 + bob, visual.trim, 0.45);
  } else if (visual.prop === "coins") {
    drawSmallLantern(-23, 13 + bob, visual.trim, attackPulse);
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = visual.accent;
      ctx.beginPath();
      ctx.arc(20 + i * 7 + attackPulse * 14, -8 + bob + i * 4, 4, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#40240d";
      ctx.stroke();
    }
  }
}

function drawCharacterSpecial(p, visual, bob, attackPulse) {
  if (p.characterId === "linQingwu" && p.damageBuff > 0) {
    ctx.strokeStyle = visual.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, bob, 36 + Math.sin(p.animTime * 8) * 3, 0, TAU);
    ctx.stroke();
  }
  if (p.characterId === "yanZhiyuan" && (p.isMoving || p.dashAnim > 0)) {
    drawPaperBird(-34, -20 + bob, visual.accent, -0.8);
    drawPaperBird(-43, 2 + bob, visual.trim, 0.25);
  }
  if (p.characterId === "peiXuance" && attackPulse > 0) {
    drawLightningGlyph(15, -22 + bob, visual.accent, attackPulse);
  }
  if (p.characterId === "tangDengke") {
    ctx.strokeStyle = visual.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, bob, 36 + Math.sin(p.animTime * 4) * 2, -0.2, 1.1);
    ctx.stroke();
  }
}

function drawSmallLantern(x, y, color, pulse) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  roundedRect(-7, -11, 14, 22, 5);
  ctx.fill();
  ctx.fillStyle = "#f7e2a0";
  ctx.beginPath();
  ctx.arc(0, 0, 5 + pulse * 2, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawPaperBird(x, y, color, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(0, -6);
  ctx.lineTo(11, 0);
  ctx.lineTo(0, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLightningGlyph(x, y, color, pulse) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 + pulse * 2;
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 13);
  ctx.lineTo(x + 2, y - 2);
  ctx.lineTo(x - 3, y - 2);
  ctx.lineTo(x + 8, y + 13);
  ctx.stroke();
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const pulse = enemy.type === "boss" ? Math.sin(performance.now() / 180) * 3 : 0;
    const flash = enemy.hitFlash > 0;
    enemy.hitFlash = Math.max(0, (enemy.hitFlash || 0) - 0.016);
    drawMonsterSilhouette(enemy, pulse, flash);

    drawEnemyHp(enemy);
    ctx.restore();
  }
}

function drawMonsterSilhouette(enemy, pulse, flash) {
  ctx.save();
  if (flash) {
    ctx.shadowColor = "#fff4d1";
    ctx.shadowBlur = 20;
  }
  if (enemy.type === "lanternMoth") drawLanternMoth(enemy, flash);
  else if (enemy.type === "umbrellaGhost") drawUmbrellaGhost(enemy, flash);
  else if (enemy.type === "gongCorpse") drawGongCorpse(enemy, flash);
  else if (enemy.type === "boss") drawFacelessGranny(enemy, pulse, flash);
  ctx.strokeStyle = enemy.elite ? "#e8b85c" : "rgba(255, 244, 210, 0.35)";
  ctx.lineWidth = enemy.elite ? 4 : 2;
  ctx.beginPath();
  ctx.arc(0, 0, enemy.radius + pulse, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawLanternMoth(enemy, flash) {
  const wingColor = flash ? "#fff4d1" : "rgba(232, 184, 92, 0.76)";
  ctx.fillStyle = "rgba(229, 93, 55, 0.2)";
  ctx.beginPath();
  ctx.arc(0, 0, enemy.radius * 1.85, 0, TAU);
  ctx.fill();
  ctx.fillStyle = wingColor;
  ellipse(-18, -3, 18, 29, -0.72);
  ellipse(18, -3, 18, 29, 0.72);
  ctx.fillStyle = flash ? "#fff4d1" : "#3a2418";
  ctx.beginPath();
  ctx.ellipse(0, 4, 9, 20, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#f5c36d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-5, -12);
  ctx.quadraticCurveTo(-18, -28, -28, -24);
  ctx.moveTo(5, -12);
  ctx.quadraticCurveTo(18, -28, 28, -24);
  ctx.stroke();
  ctx.fillStyle = "#f6d070";
  ctx.beginPath();
  ctx.arc(0, -2, 5, 0, TAU);
  ctx.fill();
}

function drawUmbrellaGhost(enemy, flash) {
  ctx.fillStyle = flash ? "#fff4d1" : "#d9d1bd";
  ctx.beginPath();
  ctx.arc(0, -6, enemy.radius * 1.15, Math.PI, TAU);
  ctx.lineTo(enemy.radius * 1.05, 2);
  ctx.quadraticCurveTo(0, 16, -enemy.radius * 1.05, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5c4f43";
  ctx.lineWidth = 2;
  for (let i = -3; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, -enemy.radius * 1.1);
    ctx.lineTo(i * 10, 6);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(230, 230, 215, 0.84)";
  ctx.beginPath();
  ctx.moveTo(-9, 0);
  ctx.quadraticCurveTo(-20, 31, -6, 46);
  ctx.quadraticCurveTo(2, 36, 9, 46);
  ctx.quadraticCurveTo(24, 26, 10, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#20201d";
  ctx.beginPath();
  ctx.arc(-4, 17, 3, 0, TAU);
  ctx.arc(6, 17, 3, 0, TAU);
  ctx.fill();
}

function drawGongCorpse(enemy, flash) {
  ctx.fillStyle = flash ? "#fff4d1" : "#564136";
  ctx.beginPath();
  ctx.ellipse(0, 8, enemy.radius * 0.78, enemy.radius * 1.08, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#2d2621";
  ctx.beginPath();
  ctx.arc(0, -22, 13, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#b27a43";
  ctx.beginPath();
  ctx.arc(18, 3, enemy.radius * 0.76, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#f0c173";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(18, 3, enemy.radius * 0.52, 0, TAU);
  ctx.stroke();
  drawTalisman(-10, -8, 10, 34, "#9d3d31");
  ctx.strokeStyle = "#2a1d16";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-18, 2);
  ctx.lineTo(-38, 30);
  ctx.stroke();
}

function drawFacelessGranny(enemy, pulse, flash) {
  ctx.fillStyle = "rgba(229, 93, 55, 0.16)";
  ctx.beginPath();
  ctx.arc(0, 0, enemy.radius * 1.8 + pulse * 2, 0, TAU);
  ctx.fill();
  ctx.fillStyle = flash ? "#fff4d1" : "#6c2f34";
  ctx.beginPath();
  ctx.moveTo(-36, -8);
  ctx.quadraticCurveTo(-20, 42, 0, 54);
  ctx.quadraticCurveTo(24, 42, 38, -8);
  ctx.quadraticCurveTo(16, -36, -36, -8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#211616";
  ctx.beginPath();
  ctx.arc(0, -18, 22, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#f0d48a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -18, 13, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = "rgba(247, 236, 213, 0.55)";
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 12, 2);
    ctx.quadraticCurveTo(i * 16, 28, i * 8, 54);
    ctx.stroke();
  }
}

function ellipse(x, y, rx, ry, rotation) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, TAU);
  ctx.fill();
}

function drawEnemyHp(enemy) {
  const width = enemy.type === "boss" ? 96 : enemy.radius * 2.2;
  const y = enemy.radius + 13;
  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.fillRect(-width / 2, y, width, 5);
  ctx.fillStyle = enemy.type === "boss" ? "#e4563d" : "#e8b85c";
  ctx.fillRect(-width / 2, y, width * clamp(enemy.hp / enemy.maxHp, 0, 1), 5);
  if (enemy.affix) {
    ctx.fillStyle = "#f7ecd5";
    ctx.font = "13px Microsoft YaHei, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(enemy.affix.name, 0, -enemy.radius - 9);
  }
}

function drawProjectiles() {
  for (const projectile of state.projectiles) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.fillStyle = projectile.color;
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, projectile.radius, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  for (const projectile of state.enemyProjectiles) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.fillStyle = projectile.color;
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, projectile.radius, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawEffects() {
  for (const effect of state.effects) {
    const age = 1 - effect.life / effect.maxLife;
    ctx.save();
    ctx.globalAlpha = clamp(effect.life / effect.maxLife, 0, 1);
    ctx.strokeStyle = effect.color;
    ctx.fillStyle = effect.color;
    if (effect.kind === "lightning") {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(effect.x + rand(-8, 8), 70);
      ctx.lineTo(effect.x + rand(-30, 30), effect.y - 20);
      ctx.lineTo(effect.x + rand(-16, 16), effect.y + 20);
      ctx.stroke();
      ctx.globalAlpha *= 0.22;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, TAU);
      ctx.fill();
    }
    if (effect.kind === "slash" || effect.kind === "soulBurst") {
      ctx.lineWidth = effect.kind === "slash" ? 8 : 4;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.45 + age * 0.6), 0, TAU);
      ctx.stroke();
    }
    if (effect.kind === "shockwave") {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * age, 0, TAU);
      ctx.stroke();
    }
    if (effect.kind === "telegraph" || effect.kind === "mark") {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (1 + age * 0.25), 0, TAU);
      ctx.stroke();
    }
    if (effect.kind === "fan") {
      ctx.translate(effect.x, effect.y);
      ctx.rotate(effect.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 170, -0.48, 0.48);
      ctx.closePath();
      ctx.globalAlpha *= 0.18;
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawHazards() {
  for (const hazard of state.hazards) {
    const alpha = clamp(hazard.life / 5.5, 0, 1);
    const gradient = ctx.createRadialGradient(hazard.x, hazard.y, 0, hazard.x, hazard.y, hazard.radius);
    gradient.addColorStop(0, `rgba(15, 10, 18, ${0.5 * alpha})`);
    gradient.addColorStop(1, "rgba(15, 10, 18, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = `rgba(191, 54, 75, ${0.5 * alpha})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawPickups() {
  for (const pickup of state.pickups) {
    const pulse = Math.sin(pickup.pulse || 0) * 3;
    ctx.save();
    ctx.translate(pickup.x, pickup.y);
    ctx.fillStyle = pickup.kind === "orderFire" ? "#f0c96a" : "#65c6a7";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, pickup.radius + pulse, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawDecoys() {
  for (const decoy of state.decoys) {
    ctx.save();
    ctx.translate(decoy.x, decoy.y);
    ctx.globalAlpha = clamp(decoy.life / decoy.maxLife, 0.2, 0.88);
    ctx.strokeStyle = "#a7f5ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, decoy.radius, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = "rgba(167, 245, 255, 0.12)";
    ctx.fill();
    ctx.restore();
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawArenaVignette() {
  const gradient = ctx.createRadialGradient(ARENA.width / 2, ARENA.height / 2, 240, ARENA.width / 2, ARENA.height / 2, 820);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.42)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);
}

function loop(now) {
  const dt = Math.min(0.033, (now - loop.last) / 1000 || 0.016);
  loop.last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
loop.last = performance.now();

function bindEvents() {
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", (event) => {
    keys.add(event.code);
    if (event.code === "Space" && state.scene === "playing") {
      event.preventDefault();
      dashPlayer();
    }
    if (event.code === "Escape" && ["reward", "event", "shop", "supply"].includes(state.scene)) {
      event.preventDefault();
      nextRoom();
    }
    if (event.code === "Escape" && state.scene === "artbook") {
      event.preventDefault();
      setScene("hub");
    }
    if (event.code === "Escape" && state.scene === "vault") {
      event.preventDefault();
      setScene("hub");
    }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  canvas.addEventListener("mousemove", (event) => {
    const world = screenToWorld(event.clientX, event.clientY);
    mouse.x = world.x;
    mouse.y = world.y;
  });
  canvas.addEventListener("mousedown", () => {
    mouse.down = true;
    if (state.scene === "playing") {
      state.player.attackCooldown = 0;
    }
  });
  canvas.addEventListener("mouseup", () => {
    mouse.down = false;
  });
  document.querySelectorAll(".loadout-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".loadout-card").forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
      state.selectedStartArtifact = card.dataset.startArtifact;
    });
  });
  startButton.addEventListener("click", startRun);
  vaultButton.addEventListener("click", () => {
    renderVaultShop();
    setScene("vault");
  });
  closeVaultButton.addEventListener("click", () => setScene("hub"));
  artbookButton.addEventListener("click", () => setScene("artbook"));
  closeArtButton.addEventListener("click", () => setScene("hub"));
  restartButton.addEventListener("click", () => {
    updateUnlockRow();
    setScene("hub");
  });
}

resizeCanvas();
bindEvents();
renderCharacterSelect();
updateUnlockRow();
setScene("hub");
requestAnimationFrame(loop);
