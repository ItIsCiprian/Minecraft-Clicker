// Get DOM elements
const blocksMinedElement = document.getElementById("blocksMined");
const resourcesElement = document.getElementById("resources");
const mineButton = document.getElementById("mineButton");
const upgradeButton = document.getElementById("upgradeButton");

// Game state
let blocksMined = 0;
let resources = 0;
let toolLevel = 1;

// Update blocks mined and resources count on the webpage
function updateUI() {
    blocksMinedElement.textContent = blocksMined;
    resourcesElement.textContent = resources;
    upgradeButton.textContent = `Upgrade Tool (Cost: ${toolLevel * 10} resources)`;
}

// Event listener for the mine button
mineButton.addEventListener("click", () => {
    // Increase blocks mined
    blocksMined++;

    // Collect resources based on tool level
    resources += toolLevel;

    // Update the UI
    updateUI();
});

// Event listener for the upgrade button
upgradeButton.addEventListener("click", () => {
    const upgradeCost = toolLevel * 10;

    // Check if player has enough resources to upgrade
    if (resources >= upgradeCost) {
        // Deduct resources and increase tool level
        resources -= upgradeCost;
        toolLevel++;

        // Update the UI
        updateUI();
    }
});

// Game loop (updates every second)
setInterval(() => {
    // Automatically mine blocks based on tool level
    resources += toolLevel;

    // Update the UI
    updateUI();
}, 1000);

// Initialize the game by updating the UI
updateUI();
