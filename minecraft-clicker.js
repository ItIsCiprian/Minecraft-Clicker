// Selectors for accessing HTML elements related to the game interface.
const UIElements = {
    blocksMined: document.getElementById("blocksMined"),
    resources: document.getElementById("resources"),
    mineButton: document.getElementById("mineButton"),
    upgradeButton: document.getElementById("upgradeButton"),
    craftButton: document.getElementById("craftButton"),
    craftedItems: document.getElementById("craftedItems"),
    achievements: document.getElementById("achievements"),
    saveButton: document.getElementById("saveButton"),
    loadButton: document.getElementById("loadButton"),
    resetButton: document.getElementById("resetButton")
};

// Constants used in the game for various costs and rates.
const GAME_CONSTANTS = {
    UPGRADE_COST: 10, // Base cost for upgrading tools, multiplied by the tool level.
    CRAFT_COST: 50,   // Cost to craft one item.
    AUTO_MINE_INTERVAL: 1000 // Interval for automatic resource generation in milliseconds.
};

// Object to track the state of the game including resources and item counts.
let gameState = {
    blocksMined: 0,
    resources: 0,
    toolLevel: 1,
    craftedItems: 0,
    achievements: []
};

// Updates the game UI elements based on the current state of the game.
function updateUI() {
    UIElements.blocksMined.textContent = gameState.blocksMined;
    UIElements.resources.textContent = gameState.resources;
    UIElements.upgradeButton.textContent = `Upgrade Tool (Cost: ${gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST} resources)`;
    UIElements.craftButton.textContent = `Craft Item (Cost: ${GAME_CONSTANTS.CRAFT_COST} resources)`;
    UIElements.craftedItems.textContent = gameState.craftedItems;
    UIElements.achievements.textContent = gameState.achievements.join(", ");
}

// Handles mining action: increments blocks mined and resources based on tool level.
function handleMine() {
    gameState.blocksMined++;
    gameState.resources += gameState.toolLevel; // Increment resources by tool level.
    checkAchievements();
    updateUI();
}

// Handles upgrading the tool: checks resource availability and upgrades the tool if possible.
function handleUpgrade() {
    const upgradeCost = gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST;

    if (gameState.resources >= upgradeCost) {
        gameState.resources -= upgradeCost;
        gameState.toolLevel++;
        checkAchievements();
        updateUI();
        console.log(`Tool upgraded to level ${gameState.toolLevel}`);
    } else {
        console.log("Not enough resources to upgrade the tool.");
    }
}

// Handles crafting items: checks resource availability and crafts an item if possible.
function handleCraft() {
    if (gameState.resources >= GAME_CONSTANTS.CRAFT_COST) {
        gameState.resources -= GAME_CONSTANTS.CRAFT_COST;
        gameState.craftedItems++;
        checkAchievements();
        updateUI();
        console.log("Crafted an item!");
    } else {
        console.log("Not enough resources to craft an item.");
    }
}

// Saves the current game state to local storage.
function saveGame() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log("Game saved!");
}

// Loads the game state from local storage.
function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateUI();
        console.log("Game loaded!");
    } else {
        console.log("No saved game found.");
    }
}

// Resets the game state to the initial values.
function resetGame() {
    gameState = {
        blocksMined: 0,
        resources: 0,
        toolLevel: 1,
        craftedItems: 0,
        achievements: []
    };
    updateUI();
    console.log("Game reset!");
}

// Check for achievements and update the achievements list.
function checkAchievements() {
    const achievements = [];
    if (gameState.blocksMined >= 100) achievements.push("100 Blocks Mined");
    if (gameState.resources >= 500) achievements.push("500 Resources Collected");
    if (gameState.toolLevel >= 10) achievements.push("Tool Level 10");
    if (gameState.craftedItems >= 10) achievements.push("10 Items Crafted");
    gameState.achievements = achievements;
}

// Initialize event listeners for button actions.
function initializeEventListeners() {
    UIElements.mineButton.addEventListener("click", handleMine);
    UIElements.upgradeButton.addEventListener("click", handleUpgrade);
    UIElements.craftButton.addEventListener("click", handleCraft);
    UIElements.saveButton.addEventListener("click", saveGame);
    UIElements.loadButton.addEventListener("click", loadGame);
    UIElements.resetButton.addEventListener("click", resetGame);
}

// Periodically updates game resources automatically every second.
function autoUpdateResources() {
    setInterval(() => {
        gameState.resources += gameState.toolLevel;
        checkAchievements();
        updateUI();
    }, GAME_CONSTANTS.AUTO_MINE_INTERVAL);
}

// Initialize the game by setting up event listeners and updating the UI.
function initializeGame() {
    initializeEventListeners();
    autoUpdateResources();
    loadGame(); // Attempt to load game state on initialization
    updateUI();
}

// Start the game initialization.
initializeGame();
