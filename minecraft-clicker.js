// Selectors for accessing HTML elements related to the game interface.
const UIElements = {
    blocksMined: document.getElementById("blocksMined"),
    resources: document.getElementById("resources"),
    mineButton: document.getElementById("mineButton"),
    upgradeButton: document.getElementById("upgradeButton"),
    craftButton: document.getElementById("craftButton"),
    craftedItems: document.getElementById("craftedItems")
};

// Constants used in the game for various costs and rates.
const GAME_CONSTANTS = {
    UPGRADE_COST: 10, // Base cost for upgrading tools, multiplied by the tool level.
    CRAFT_COST: 50    // Cost to craft one item.
};

// Object to track the state of the game including resources and item counts.
let gameState = {
    blocksMined: 0,
    resources: 0,
    toolLevel: 1,
    craftedItems: 0
};

// Updates the game UI elements based on the current state of the game.
function updateUI() {
    UIElements.blocksMined.textContent = gameState.blocksMined;
    UIElements.resources.textContent = gameState.resources;
    UIElements.upgradeButton.textContent = `Upgrade Tool (Cost: ${gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST} resources)`;
    UIElements.craftButton.textContent = `Craft Item (Cost: ${GAME_CONSTANTS.CRAFT_COST} resources)`;
    UIElements.craftedItems.textContent = gameState.craftedItems;
}

// Handles mining action: increments blocks mined and resources based on tool level.
function handleMine() {
    gameState.blocksMined++;
    gameState.resources += gameState.toolLevel; // Increment resources by tool level.
    updateUI();
}

// Handles upgrading the tool: checks resource availability and upgrades the tool if possible.
function handleUpgrade() {
    const upgradeCost = gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST;

    if (gameState.resources >= upgradeCost) {
        gameState.resources -= upgradeCost;
        gameState.toolLevel++;
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
        updateUI();
        console.log("Crafted an item!");
    } else {
        console.log("Not enough resources to craft an item.");
    }
}

// Event listeners for button actions.
UIElements.mineButton.addEventListener("click", handleMine);
UIElements.upgradeButton.addEventListener("click", handleUpgrade);
UIElements.craftButton.addEventListener("click", handleCraft);

// Periodically updates game resources automatically every second.
setInterval(() => {
    gameState.resources += gameState.toolLevel;
    updateUI();
}, 1000);

// Initial UI update to display the starting state of the game.
updateUI();
