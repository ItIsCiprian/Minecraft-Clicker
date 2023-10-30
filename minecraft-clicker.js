// Get DOM elements
const blocksMinedElement = document.getElementById("blocksMined");
const resourcesElement = document.getElementById("resources");
const mineButton = document.getElementById("mineButton");
const upgradeButton = document.getElementById("upgradeButton");
const craftButton = document.getElementById("craftButton");
const craftedItemsElement = document.getElementById("craftedItems");

// Constants
const UPGRADE_COST = 10;
const CRAFT_COST = 50; // Cost for crafting an item

// Game state
let blocksMined = 0;
let resources = 0;
let toolLevel = 1;
let craftedItems = 0; // Number of crafted items

// Function to update the UI
function updateUI() {
    blocksMinedElement.textContent = blocksMined;
    resourcesElement.textContent = resources;
    upgradeButton.textContent = `Upgrade Tool (Cost: ${toolLevel * UPGRADE_COST} resources)`;
    craftButton.textContent = `Craft Item (Cost: ${CRAFT_COST} resources)`;
    craftedItemsElement.textContent = craftedItems;
}

// Event listener for mining
mineButton.addEventListener("click", () => {
    blocksMined++;
    resources += toolLevel;
    updateUI();
});

// Event listener for upgrading
upgradeButton.addEventListener("click", () => {
    const upgradeCost = toolLevel * UPGRADE_COST;
    
    if (resources >= upgradeCost) {
        resources -= upgradeCost;
        toolLevel++;
        updateUI();
        console.log(`Tool upgraded to level ${toolLevel}`);
    } else {
        console.log("Not enough resources to upgrade the tool.");
    }
});

// Event listener for crafting
craftButton.addEventListener("click", () => {
    if (resources >= CRAFT_COST) {
        resources -= CRAFT_COST;
        craftedItems++;
        updateUI();
        console.log("Crafted an item!");
    } else {
        console.log("Not enough resources to craft an item.");
    }
});

// Game loop (updates every second)
setInterval(() => {
    resources += toolLevel;
    updateUI();
}, 1000);

// Initialize the game by updating the UI
updateUI();
