// Initial setup: Grabbing HTML elements to interact with the game UI
const elements = {
    blocksMined: document.getElementById("blocksMined"),
    resources: document.getElementById("resources"),
    mineButton: document.getElementById("mineButton"),
    upgradeButton: document.getElementById("upgradeButton"),
    craftButton: document.getElementById("craftButton"),
    craftedItems: document.getElementById("craftedItems")
};

// Game constants: Define costs and rates for game actions
const GAME_CONSTANTS = {
    UPGRADE_COST: 10, // Base cost to upgrade tools
    CRAFT_COST: 50 // Cost to craft an item
};

// Game state: Track game statistics and player progression
let gameState = {
    blocksMined: 0,
    resources: 0,
    toolLevel: 1,
    craftedItems: 0
};

// Function to update the game UI based on the current state
function updateUI() {
    elements.blocksMined.textContent = gameState.blocksMined;
    elements.resources.textContent = gameState.resources;
    elements.upgradeButton.textContent = `Upgrade Tool (Cost: ${gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST} resources)`;
    elements.craftButton.textContent = `Craft Item (Cost: ${GAME_CONSTANTS.CRAFT_COST} resources)`;
    elements.craftedItems.textContent = gameState.craftedItems;
}

// Adds functionality to the mine button for mining resources
elements.mineButton.addEventListener("click", () => {
    gameState.blocksMined++;
    gameState.resources += gameState.toolLevel;
    updateUI();
});

// Adds functionality to the upgrade button for upgrading tools
elements.upgradeButton.addEventListener("click", () => {
    const upgradeCost = gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST;
    
    if (gameState.resources >= upgradeCost) {
        gameState.resources -= upgradeCost;
        gameState.toolLevel++;
        updateUI();
        console.log(`Tool upgraded to level ${gameState.toolLevel}`);
    } else {
        console.log("Not enough resources to upgrade the tool.");
    }
});

// Adds functionality to the craft button for crafting items
elements.craftButton.addEventListener("click", () => {
    if (gameState.resources >= GAME_CONSTANTS.CRAFT_COST) {
        gameState.resources -= GAME_CONSTANTS.CRAFT_COST;
        gameState.craftedItems++;
        updateUI();
        console.log("Crafted an item!");
    } else {
        console.log("Not enough resources to craft an item.");
    }
});

// Game loop to increment resources over time
setInterval(() => {
    gameState.resources += gameState.toolLevel;
    updateUI();
}, 1000);

// Initializes the game by updating the UI initially
updateUI();
