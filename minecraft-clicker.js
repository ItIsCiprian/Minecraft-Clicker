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
    resetButton: document.getElementById("resetButton"),
    messageBox: document.getElementById("messageBox"), // New element for displaying messages
    tooltipContainer: document.getElementById("tooltipContainer") // New element for tooltips
};

// Constants used in the game for various costs and rates.
const GAME_CONSTANTS = {
    UPGRADE_COST: 10, // Base cost for upgrading tools, multiplied by the tool level.
    CRAFT_COST: 50,   // Cost to craft one item.
    AUTO_MINE_INTERVAL: 1000, // Interval for automatic resource generation in milliseconds.
    ANIMATION_DURATION: 300 // Duration for UI animations
};

// Object to track the state of the game including resources and item counts.
let gameState = {
    blocksMined: 0,
    resources: 0,
    toolLevel: 1,
    craftedItems: 0,
    achievements: [],
    lastAction: null
};

// Improved UI update function with more dynamic interactions
function updateUI() {
    // Update text content
    UIElements.blocksMined.textContent = gameState.blocksMined;
    UIElements.resources.textContent = gameState.resources;
    UIElements.craftedItems.textContent = gameState.craftedItems;
    UIElements.achievements.textContent = gameState.achievements.join(", ");

    // Update upgrade and craft button states and tooltips
    const upgradeCost = gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST;
    const craftCost = GAME_CONSTANTS.CRAFT_COST;

    // Upgrade button interaction
    UIElements.upgradeButton.textContent = `Upgrade Tool (Cost: ${upgradeCost} resources)`;
    UIElements.upgradeButton.disabled = gameState.resources < upgradeCost;
    UIElements.upgradeButton.classList.toggle('disabled', gameState.resources < upgradeCost);

    // Craft button interaction
    UIElements.craftButton.textContent = `Craft Item (Cost: ${craftCost} resources)`;
    UIElements.craftButton.disabled = gameState.resources < craftCost;
    UIElements.craftButton.classList.toggle('disabled', gameState.resources < craftCost);

    // Animate last action
    animateLastAction();
}

// Add visual feedback for actions
function animateLastAction() {
    if (!gameState.lastAction) return;

    const element = UIElements[gameState.lastAction];
    if (element) {
        element.classList.add('action-pulse');
        setTimeout(() => {
            element.classList.remove('action-pulse');
        }, GAME_CONSTANTS.ANIMATION_DURATION);
    }
}

// Display interactive messages with fade effects
function showMessage(message, type = 'info') {
    if (!UIElements.messageBox) return;

    UIElements.messageBox.textContent = message;
    UIElements.messageBox.className = `message ${type}`;
    
    // Automatically clear message after 3 seconds
    setTimeout(() => {
        UIElements.messageBox.textContent = '';
        UIElements.messageBox.className = '';
    }, 3000);
}

// Enhanced mining function with more interactive feedback
function handleMine() {
    gameState.blocksMined++;
    gameState.resources += gameState.toolLevel;
    gameState.lastAction = 'mineButton';
    
    // Add visual mining feedback
    showMessage(`Mined ${gameState.toolLevel} resources!`, 'success');
    
    checkAchievements();
    updateUI();
}

// Enhanced upgrade function with more detailed feedback
function handleUpgrade() {
    const upgradeCost = gameState.toolLevel * GAME_CONSTANTS.UPGRADE_COST;

    if (gameState.resources >= upgradeCost) {
        gameState.resources -= upgradeCost;
        gameState.toolLevel++;
        gameState.lastAction = 'upgradeButton';
        
        showMessage(`Tool upgraded to level ${gameState.toolLevel}!`, 'success');
        
        checkAchievements();
        updateUI();
    } else {
        showMessage("Not enough resources to upgrade the tool.", 'error');
    }
}

// Enhanced crafting function with more interactive feedback
function handleCraft() {
    if (gameState.resources >= GAME_CONSTANTS.CRAFT_COST) {
        gameState.resources -= GAME_CONSTANTS.CRAFT_COST;
        gameState.craftedItems++;
        gameState.lastAction = 'craftButton';
        
        showMessage("Crafted an item successfully!", 'success');
        
        checkAchievements();
        updateUI();
    } else {
        showMessage("Not enough resources to craft an item.", 'error');
    }
}

// Add hover tooltips to provide additional information
function initializeTooltips() {
    const tooltipElements = [
        { element: UIElements.upgradeButton, text: "Upgrade your mining tool to collect more resources per mine" },
        { element: UIElements.craftButton, text: "Craft items to progress and unlock achievements" },
        { element: UIElements.mineButton, text: "Mine blocks to collect resources" }
    ];

    tooltipElements.forEach(({ element, text }) => {
        element.addEventListener('mouseenter', (e) => {
            if (!UIElements.tooltipContainer) return;
            UIElements.tooltipContainer.textContent = text;
            UIElements.tooltipContainer.style.display = 'block';
            UIElements.tooltipContainer.style.left = `${e.pageX + 10}px`;
            UIElements.tooltipContainer.style.top = `${e.pageY + 10}px`;
        });

        element.addEventListener('mouseleave', () => {
            if (!UIElements.tooltipContainer) return;
            UIElements.tooltipContainer.style.display = 'none';
        });
    });
}

// Existing functions like saveGame, loadGame, resetGame, checkAchievements remain the same

// Initialize event listeners for button actions
function initializeEventListeners() {
    UIElements.mineButton.addEventListener("click", handleMine);
    UIElements.upgradeButton.addEventListener("click", handleUpgrade);
    UIElements.craftButton.addEventListener("click", handleCraft);
    UIElements.saveButton.addEventListener("click", saveGame);
    UIElements.loadButton.addEventListener("click", loadGame);
    UIElements.resetButton.addEventListener("click", resetGame);

    // Add tooltips
    initializeTooltips();
}

// Initialize the game by setting up event listeners and updating the UI
function initializeGame() {
    initializeEventListeners();
    autoUpdateResources();
    loadGame(); // Attempt to load game state on initialization
    updateUI();
}

// Start the game initialization
initializeGame();
