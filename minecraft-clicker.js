// ─── Constants ────────────────────────────────────────────────────────────────

const UPGRADE_COST_PER_LEVEL = 10;
const CRAFT_COST = 50;
const AUTO_MINE_INTERVAL_MS = 1000;
const ANIMATION_DURATION_MS = 300;
const MESSAGE_DURATION_MS = 3000;

const TOOLTIPS = {
  mineButton:    "Mine blocks to collect resources.",
  upgradeButton: "Upgrade your mining tool to collect more resources per mine.",
  craftButton:   "Craft items to progress and unlock achievements.",
};

// ─── State ────────────────────────────────────────────────────────────────────

const defaultState = () => ({
  blocksMined:  0,
  resources:    0,
  toolLevel:    1,
  craftedItems: 0,
  achievements: [],
});

let state = defaultState();

// ─── DOM ──────────────────────────────────────────────────────────────────────

const el = (id) => document.getElementById(id);

const ui = {
  blocksMined:      el("blocksMined"),
  resources:        el("resources"),
  craftedItems:     el("craftedItems"),
  achievements:     el("achievements"),
  mineButton:       el("mineButton"),
  upgradeButton:    el("upgradeButton"),
  craftButton:      el("craftButton"),
  saveButton:       el("saveButton"),
  loadButton:       el("loadButton"),
  resetButton:      el("resetButton"),
  messageBox:       el("messageBox"),
  tooltipContainer: el("tooltipContainer"),
};

// ─── UI Rendering ─────────────────────────────────────────────────────────────

function render() {
  const upgradeCost = state.toolLevel * UPGRADE_COST_PER_LEVEL;

  ui.blocksMined.textContent  = state.blocksMined;
  ui.resources.textContent    = state.resources;
  ui.craftedItems.textContent = state.craftedItems;
  ui.achievements.textContent = state.achievements.join(", ") || "None";

  setButtonState(ui.upgradeButton, `Upgrade Tool (Cost: ${upgradeCost})`, state.resources < upgradeCost);
  setButtonState(ui.craftButton,   `Craft Item (Cost: ${CRAFT_COST})`,    state.resources < CRAFT_COST);
}

function setButtonState(button, label, disabled) {
  button.textContent = label;
  button.disabled    = disabled;
  button.classList.toggle("disabled", disabled);
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

let messageTimer = null;

function showMessage(text, type = "info") {
  if (!ui.messageBox) return;
  clearTimeout(messageTimer);
  ui.messageBox.textContent  = text;
  ui.messageBox.className    = `message ${type}`;
  messageTimer = setTimeout(() => {
    ui.messageBox.textContent = "";
    ui.messageBox.className   = "";
  }, MESSAGE_DURATION_MS);
}

function pulse(buttonKey) {
  const button = ui[buttonKey];
  if (!button) return;
  button.classList.add("action-pulse");
  setTimeout(() => button.classList.remove("action-pulse"), ANIMATION_DURATION_MS);
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function mine() {
  state.blocksMined++;
  state.resources += state.toolLevel;
  showMessage(`Mined ${state.toolLevel} resource${state.toolLevel > 1 ? "s" : ""}!`, "success");
  pulse("mineButton");
  checkAchievements();
  render();
}

function upgrade() {
  const cost = state.toolLevel * UPGRADE_COST_PER_LEVEL;
  if (state.resources < cost) {
    showMessage("Not enough resources to upgrade.", "error");
    return;
  }
  state.resources -= cost;
  state.toolLevel++;
  showMessage(`Tool upgraded to level ${state.toolLevel}!`, "success");
  pulse("upgradeButton");
  checkAchievements();
  render();
}

function craft() {
  if (state.resources < CRAFT_COST) {
    showMessage("Not enough resources to craft an item.", "error");
    return;
  }
  state.resources -= CRAFT_COST;
  state.craftedItems++;
  showMessage("Crafted an item successfully!", "success");
  pulse("craftButton");
  checkAchievements();
  render();
}

// ─── Achievements ─────────────────────────────────────────────────────────────

const ACHIEVEMENT_RULES = [
  { id: "First Blood",    check: (s) => s.blocksMined  >= 1   },
  { id: "Century Miner", check: (s) => s.blocksMined  >= 100 },
  { id: "Master Crafter",check: (s) => s.craftedItems >= 10  },
  { id: "Tool Master",   check: (s) => s.toolLevel    >= 5   },
];

function checkAchievements() {
  ACHIEVEMENT_RULES.forEach(({ id, check }) => {
    if (!state.achievements.includes(id) && check(state)) {
      state.achievements.push(id);
      showMessage(`Achievement unlocked: ${id}!`, "achievement");
    }
  });
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const SAVE_KEY = "miningGameState";

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  showMessage("Game saved.", "info");
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  try {
    state = { ...defaultState(), ...JSON.parse(saved) };
    showMessage("Game loaded.", "info");
  } catch {
    showMessage("Failed to load save data.", "error");
  }
}

function resetGame() {
  if (!confirm("Reset all progress?")) return;
  localStorage.removeItem(SAVE_KEY);
  state = defaultState();
  showMessage("Game reset.", "info");
  render();
}

// ─── Auto-mining ──────────────────────────────────────────────────────────────

function startAutoMine() {
  setInterval(() => {
    state.resources += state.toolLevel;
    render();
  }, AUTO_MINE_INTERVAL_MS);
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function initTooltips() {
  if (!ui.tooltipContainer) return;

  Object.entries(TOOLTIPS).forEach(([key, text]) => {
    const button = ui[key];
    if (!button) return;

    button.addEventListener("mouseenter", (e) => {
      ui.tooltipContainer.textContent    = text;
      ui.tooltipContainer.style.display  = "block";
      ui.tooltipContainer.style.left     = `${e.pageX + 12}px`;
      ui.tooltipContainer.style.top      = `${e.pageY + 12}px`;
    });

    button.addEventListener("mouseleave", () => {
      ui.tooltipContainer.style.display = "none";
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  ui.mineButton.addEventListener("click",    mine);
  ui.upgradeButton.addEventListener("click", upgrade);
  ui.craftButton.addEventListener("click",   craft);
  ui.saveButton.addEventListener("click",    saveGame);
  ui.loadButton.addEventListener("click",    loadGame);
  ui.resetButton.addEventListener("click",   resetGame);

  initTooltips();
  loadGame();
  startAutoMine();
  render();
}

init();
