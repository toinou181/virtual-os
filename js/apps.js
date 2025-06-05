// Applications functionality (Calculator, Notepad, Snake Game)

// Calculator functionality
let calcState = {
    display: '0',
    operator: null,
    operand: null,
    waitingForOperand: false
};

function calcInput(value) {
    const display = document.getElementById('calcDisplay');
    if (!display) return;
    
    if (calcState.waitingForOperand) {
        calcState.display = value;
        calcState.waitingForOperand = false;
    } else {
        calcState.display = calcState.display === '0' ? value : calcState.display + value;
    }
    
    display.textContent = calcState.display;
}

function calcClear() {
    calcState.display = '0';
    calcState.operator = null;
    calcState.operand = null;
    calcState.waitingForOperand = false;
    
    const display = document.getElementById('calcDisplay');
    if (display) {
        display.textContent = calcState.display;
    }
}

function calcBackspace() {
    if (calcState.display.length > 1) {
        calcState.display = calcState.display.slice(0, -1);
    } else {
        calcState.display = '0';
    }
    
    const display = document.getElementById('calcDisplay');
    if (display) {
        display.textContent = calcState.display;
    }
}

function calcCalculate() {
    const inputValue = parseFloat(calcState.display);
    
    if (calcState.operand !== null && calcState.operator) {
        const result = calculate(calcState.operand, inputValue, calcState.operator);
        calcState.display = String(result);
        calcState.operator = null;
        calcState.operand = null;
        calcState.waitingForOperand = true;
        
        const display = document.getElementById('calcDisplay');
        if (display) {
            display.textContent = calcState.display;
        }
    }
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return secondOperand !== 0 ? firstOperand / secondOperand : 0;
        default:
            return secondOperand;
    }
}

// Notepad functionality
function notepadNew() {
    const editor = document.getElementById('notepadEditor');
    const status = document.getElementById('notepadStatus');
    
    if (editor) {
        editor.value = '';
        if (status) {
            status.textContent = 'Nouveau document';
        }
        
        // Update window data
        const activeWindow = virtualOS.activeWindow;
        if (activeWindow && virtualOS.windows.has(activeWindow)) {
            const windowData = virtualOS.windows.get(activeWindow);
            windowData.filePath = null;
            windowData.originalContent = '';
        }
    }
}

function notepadSave() {
    const editor = document.getElementById('notepadEditor');
    const status = document.getElementById('notepadStatus');
    
    if (!editor) return;
    
    const content = editor.value;
    const activeWindow = virtualOS.activeWindow;
    
    if (activeWindow && virtualOS.windows.has(activeWindow)) {
        const windowData = virtualOS.windows.get(activeWindow);
        
        if (windowData.filePath) {
            // Save to existing file
            const file = virtualOS.fileSystem.getFile(windowData.filePath);
            if (file) {
                file.content = content;
                file.modified = new Date();
                file.size = content.length;
                
                if (status) {
                    status.textContent = `Sauvegardé: ${windowData.filePath}`;
                }
                showNotification('Fichier sauvegardé');
            }
        } else {
            // Save as new file
            const fileName = prompt('Nom du fichier:', 'nouveau_document.txt');
            if (fileName) {
                const filePath = `/Documents/${fileName}`;
                virtualOS.fileSystem.createFile(filePath, content);
                
                windowData.filePath = filePath;
                if (status) {
                    status.textContent = `Fichier: ${filePath}`;
                }
                showNotification(`Fichier sauvegardé: ${fileName}`);
            }
        }
    }
}

function notepadOpen() {
    // Simple file picker simulation
    const fileName = prompt('Nom du fichier à ouvrir:', 'exemple.txt');
    if (fileName) {
        const filePath = `/Documents/${fileName}`;
        const file = virtualOS.fileSystem.getFile(filePath);
        
        if (file) {
            const editor = document.getElementById('notepadEditor');
            const status = document.getElementById('notepadStatus');
            
            if (editor) {
                editor.value = file.content;
            }
            if (status) {
                status.textContent = `Fichier: ${filePath}`;
            }
            
            // Update window data
            const activeWindow = virtualOS.activeWindow;
            if (activeWindow && virtualOS.windows.has(activeWindow)) {
                const windowData = virtualOS.windows.get(activeWindow);
                windowData.filePath = filePath;
                windowData.originalContent = file.content;
            }
            
            showNotification(`Fichier ouvert: ${fileName}`);
        } else {
            alert('Fichier non trouvé');
        }
    }
}

function notepadCopy() {
    const editor = document.getElementById('notepadEditor');
    if (editor) {
        editor.select();
        document.execCommand('copy');
        showNotification('Texte copié');
    }
}

function notepadPaste() {
    // Note: Clipboard API requires HTTPS in production
    showNotification('Fonction coller - utilisez Ctrl+V');
}

// Snake Game functionality
let snakeGame = {
    canvas: null,
    ctx: null,
    snake: [],
    food: {},
    direction: 'right',
    score: 0,
    gameRunning: false,
    gameInterval: null
};

function initializeSnakeGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    snakeGame.canvas = canvas;
    snakeGame.ctx = canvas.getContext('2d');
    
    // Initialize game state
    resetSnakeGame();
    
    // Add keyboard controls
    document.addEventListener('keydown', handleSnakeKeyPress);
    
    drawSnakeGame();
}

function resetSnakeGame() {
    snakeGame.snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 }
    ];
    snakeGame.direction = 'right';
    snakeGame.score = 0;
    snakeGame.food = generateSnakeFood();
    
    updateSnakeScore();
}

function generateSnakeFood() {
    return {
        x: Math.floor(Math.random() * 40) * 10,
        y: Math.floor(Math.random() * 40) * 10
    };
}

function startGame() {
    if (snakeGame.gameRunning) return;
    
    resetSnakeGame();
    snakeGame.gameRunning = true;
    
    snakeGame.gameInterval = setInterval(() => {
        updateSnakeGame();
        drawSnakeGame();
    }, 150);
    
    showNotification('Jeu démarré!');
}

function pauseGame() {
    if (snakeGame.gameRunning) {
        clearInterval(snakeGame.gameInterval);
        snakeGame.gameRunning = false;
        showNotification('Jeu en pause');
    } else {
        snakeGame.gameInterval = setInterval(() => {
            updateSnakeGame();
            drawSnakeGame();
        }, 150);
        snakeGame.gameRunning = true;
        showNotification('Jeu repris');
    }
}

function updateSnakeGame() {
    if (!snakeGame.gameRunning) return;
    
    const head = { ...snakeGame.snake[0] };
    
    // Move head based on direction
    switch (snakeGame.direction) {
        case 'up':
            head.y -= 10;
            break;
        case 'down':
            head.y += 10;
            break;
        case 'left':
            head.x -= 10;
            break;
        case 'right':
            head.x += 10;
            break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snakeGame.snake.unshift(head);
    
    // Check food collision
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        snakeGame.food = generateSnakeFood();
        updateSnakeScore();
    } else {
        snakeGame.snake.pop();
    }
}

function drawSnakeGame() {
    if (!snakeGame.ctx) return;
    
    const ctx = snakeGame.ctx;
    
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 400, 400);
    
    // Draw snake
    ctx.fillStyle = '#4ade80';
    snakeGame.snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#22c55e';
        } else {
            ctx.fillStyle = '#4ade80';
        }
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
    
    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(snakeGame.food.x, snakeGame.food.y, 10, 10);
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 400; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 400);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(400, i);
        ctx.stroke();
    }
}

function handleSnakeKeyPress(event) {
    if (!snakeGame.gameRunning) return;
    
    const key = event.key;
    
    switch (key) {
        case 'ArrowUp':
            if (snakeGame.direction !== 'down') {
                snakeGame.direction = 'up';
            }
            event.preventDefault();
            break;
        case 'ArrowDown':
            if (snakeGame.direction !== 'up') {
                snakeGame.direction = 'down';
            }
            event.preventDefault();
            break;
        case 'ArrowLeft':
            if (snakeGame.direction !== 'right') {
                snakeGame.direction = 'left';
            }
            event.preventDefault();
            break;
        case 'ArrowRight':
            if (snakeGame.direction !== 'left') {
                snakeGame.direction = 'right';
            }
            event.preventDefault();
            break;
    }
}

function updateSnakeScore() {
    const scoreElement = document.getElementById('gameScore');
    if (scoreElement) {
        scoreElement.textContent = snakeGame.score;
    }
}

function gameOver() {
    snakeGame.gameRunning = false;
    clearInterval(snakeGame.gameInterval);
    
    alert(`Game Over! Score final: ${snakeGame.score}`);
    
    // Reset for new game
    resetSnakeGame();
    drawSnakeGame();
}

function showGameInstructions() {
    const instructionsContent = `
        <div style="padding: 20px; text-align: center;">
            <h2>🎮 Instructions du Jeu Snake</h2>
            <div style="text-align: left; margin: 20px 0;">
                <h3>Contrôles:</h3>
                <ul>
                    <li><strong>Flèches directionnelles</strong> - Diriger le serpent</li>
                    <li><strong>Nouvelle partie</strong> - Recommencer le jeu</li>
                    <li><strong>Pause</strong> - Mettre en pause/reprendre</li>
                </ul>
                
                <h3>Règles:</h3>
                <ul>
                    <li>Mangez la nourriture rouge pour grandir</li>
                    <li>Chaque nourriture donne 10 points</li>
                    <li>Évitez de toucher les murs</li>
                    <li>Évitez de vous mordre la queue</li>
                    <li>Plus vous grandissez, plus c'est difficile!</li>
                </ul>
                
                <h3>Conseils:</h3>
                <ul>
                    <li>Planifiez vos mouvements à l'avance</li>
                    <li>Utilisez les bords pour vous aider</li>
                    <li>Ne paniquez pas quand le serpent grandit</li>
                </ul>
            </div>
            <button onclick="closeWindow('instructions')" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Fermer
            </button>
        </div>
    `;
    
    virtualOS.createWindow('instructions', '📖 Instructions du Jeu', instructionsContent);
}