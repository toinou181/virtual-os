// Window management functionality

function createApplicationWindow(appId, title, contentHtml, className = '') {
    return virtualOS.createWindow(appId, title, contentHtml, className);
}

// Application launchers
function openFileManager(initialPath = '/') {
    const fileManagerContent = `
        <div class="file-manager">
            <div class="file-manager-toolbar">
                <button onclick="navigateBack()">← Retour</button>
                <button onclick="navigateUp()">↑ Parent</button>
                <button onclick="refreshFileManager()">🔄 Actualiser</button>
                <input type="text" class="file-manager-path" id="currentPath" value="${initialPath}" readonly>
                <button onclick="importFileToManager()">📥 Importer</button>
                <button onclick="createNewFolderInManager()">📁 Nouveau dossier</button>
            </div>
            <div class="file-manager-content">
                <div class="file-tree" id="fileTree">
                    <!-- Directory tree will be populated here -->
                </div>
                <div class="file-list" id="fileList">
                    <!-- File grid will be populated here -->
                </div>
            </div>
        </div>
    `;
    
    const window = createApplicationWindow('filemanager', '📁 Gestionnaire de fichiers', fileManagerContent, 'file-manager-window');
    
    // Initialize file manager
    setTimeout(() => {
        initializeFileManager(initialPath);
    }, 100);
}

function openCalculator() {
    const calculatorContent = `
        <div class="calculator">
            <div class="calculator-display" id="calcDisplay">0</div>
            <div class="calculator-buttons">
                <button class="calc-btn clear" onclick="calcClear()">C</button>
                <button class="calc-btn operator" onclick="calcInput('/')">/</button>
                <button class="calc-btn operator" onclick="calcInput('*')">×</button>
                <button class="calc-btn operator" onclick="calcBackspace()">⌫</button>
                
                <button class="calc-btn number" onclick="calcInput('7')">7</button>
                <button class="calc-btn number" onclick="calcInput('8')">8</button>
                <button class="calc-btn number" onclick="calcInput('9')">9</button>
                <button class="calc-btn operator" onclick="calcInput('-')">-</button>
                
                <button class="calc-btn number" onclick="calcInput('4')">4</button>
                <button class="calc-btn number" onclick="calcInput('5')">5</button>
                <button class="calc-btn number" onclick="calcInput('6')">6</button>
                <button class="calc-btn operator" onclick="calcInput('+')">+</button>
                
                <button class="calc-btn number" onclick="calcInput('1')">1</button>
                <button class="calc-btn number" onclick="calcInput('2')">2</button>
                <button class="calc-btn number" onclick="calcInput('3')">3</button>
                <button class="calc-btn equals" onclick="calcCalculate()" rowspan="2">=</button>
                
                <button class="calc-btn number" onclick="calcInput('0')" style="grid-column: span 2;">0</button>
                <button class="calc-btn number" onclick="calcInput('.')">.</button>
            </div>
        </div>
    `;
    
    createApplicationWindow('calculator', '🧮 Calculatrice', calculatorContent, 'calculator-window');
    
    // Initialize calculator
    window.calcState = {
        display: '0',
        operator: null,
        operand: null,
        waitingForOperand: false
    };
}

function openNotepad(filePath = null, initialContent = '') {
    const notepadContent = `
        <div class="notepad">
            <div class="notepad-toolbar">
                <button onclick="notepadNew()">Nouveau</button>
                <button onclick="notepadSave()">Sauvegarder</button>
                <button onclick="notepadOpen()">Ouvrir</button>
                <button onclick="notepadCopy()">Copier</button>
                <button onclick="notepadPaste()">Coller</button>
                <span style="margin-left: auto; font-size: 12px; color: #666;" id="notepadStatus">
                    ${filePath ? `Fichier: ${filePath}` : 'Nouveau document'}
                </span>
            </div>
            <textarea class="notepad-editor" id="notepadEditor" placeholder="Tapez votre texte ici...">${initialContent}</textarea>
        </div>
    `;
    
    const windowId = `notepad-${Date.now()}`;
    createApplicationWindow(windowId, '📝 Bloc-notes', notepadContent, 'notepad-window');
    
    // Store file info in window data
    if (virtualOS.windows.has(windowId)) {
        virtualOS.windows.get(windowId).filePath = filePath;
        virtualOS.windows.get(windowId).originalContent = initialContent;
    }
}

function openChat() {
    const chatContent = `
        <div class="chat-container">
            <div class="chat-sidebar">
                <div class="chat-server-name">Virtual OS Chat</div>
                <div class="chat-channels" id="chatChannels">
                    <!-- Channels will be populated here -->
                </div>
            </div>
            <div class="chat-main">
                <div class="chat-header" id="chatHeader">
                    # général
                </div>
                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be populated here -->
                </div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Tapez votre message..." onkeypress="handleChatKeyPress(event)">
                    <button class="chat-send-btn" onclick="sendChatMessage()">Envoyer</button>
                </div>
            </div>
        </div>
    `;
    
    createApplicationWindow('chat', '💬 Chat Discord', chatContent, 'chat-window');
    
    // Initialize chat
    setTimeout(() => {
        initializeChat();
    }, 100);
}

function openGame() {
    const gameContent = `
        <div class="snake-game">
            <h2>🎮 Jeu Snake</h2>
            <div class="game-score">Score: <span id="gameScore">0</span></div>
            <canvas class="game-canvas" id="gameCanvas" width="400" height="400"></canvas>
            <div class="game-controls">
                <button class="game-btn" onclick="startGame()">Nouvelle partie</button>
                <button class="game-btn" onclick="pauseGame()">Pause</button>
                <button class="game-btn" onclick="showGameInstructions()">Instructions</button>
            </div>
            <div class="game-instructions">
                <p>Utilisez les flèches du clavier pour diriger le serpent.</p>
                <p>Mangez la nourriture rouge pour grandir et marquer des points.</p>
                <p>Évitez de toucher les murs ou votre propre corps!</p>
            </div>
        </div>
    `;
    
    createApplicationWindow('game', '🎮 Jeu Snake', gameContent, 'game-window');
    
    // Initialize game
    setTimeout(() => {
        initializeSnakeGame();
    }, 100);
}

// Hide start menu when opening applications
function hideStartMenu() {
    document.getElementById('startMenu').style.display = 'none';
}

// Override application functions to hide start menu
const originalOpenFileManager = openFileManager;
const originalOpenCalculator = openCalculator;
const originalOpenNotepad = openNotepad;
const originalOpenChat = openChat;
const originalOpenGame = openGame;

openFileManager = function(path) {
    hideStartMenu();
    return originalOpenFileManager(path);
};

openCalculator = function() {
    hideStartMenu();
    return originalOpenCalculator();
};

openNotepad = function(filePath, content) {
    hideStartMenu();
    return originalOpenNotepad(filePath, content);
};

openChat = function() {
    hideStartMenu();
    return originalOpenChat();
};

openGame = function() {
    hideStartMenu();
    return originalOpenGame();
};