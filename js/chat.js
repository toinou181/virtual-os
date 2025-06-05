// Chat system functionality

let currentChatChannel = 'general';

function initializeChat() {
    updateChatChannels();
    updateChatMessages();
    
    // Auto-scroll to bottom
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function updateChatChannels() {
    const channelsContainer = document.getElementById('chatChannels');
    if (!channelsContainer) return;
    
    channelsContainer.innerHTML = '';
    
    const channels = virtualOS.chatSystem.getChannels();
    
    channels.forEach(channel => {
        const channelElement = document.createElement('div');
        channelElement.className = `chat-channel ${channel.id === currentChatChannel ? 'active' : ''}`;
        
        const prefix = channel.type === 'voice' ? '🔊' : '#';
        channelElement.innerHTML = `${prefix} ${channel.name}`;
        
        channelElement.onclick = () => switchChatChannel(channel.id);
        
        channelsContainer.appendChild(channelElement);
    });
}

function updateChatMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    const headerContainer = document.getElementById('chatHeader');
    
    if (!messagesContainer || !headerContainer) return;
    
    const channel = virtualOS.chatSystem.channels.get(currentChatChannel);
    if (!channel) return;
    
    // Update header
    const prefix = channel.type === 'voice' ? '🔊' : '#';
    headerContainer.textContent = `${prefix} ${channel.name}`;
    
    // Update messages
    messagesContainer.innerHTML = '';
    
    const messages = virtualOS.chatSystem.getChannelMessages(currentChatChannel);
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.author === virtualOS.currentUser ? 'own' : ''}`;
        
        messageElement.innerHTML = `
            <div class="chat-message-author">
                ${message.author}
                <span class="chat-message-time">${formatTime(message.timestamp)}</span>
            </div>
            <div class="chat-message-content">${escapeHtml(message.content)}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    });
    
    // Add voice channel info
    if (channel.type === 'voice') {
        const voiceInfo = document.createElement('div');
        voiceInfo.style.cssText = `
            text-align: center;
            padding: 20px;
            color: #666;
            background: #f8f9fa;
            border-radius: 5px;
            margin: 10px;
        `;
        voiceInfo.innerHTML = `
            <h4>🔊 Salon Vocal</h4>
            <p>Fonctionnalité vocale en cours de développement</p>
            <button onclick="simulateVoiceJoin()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 5px;">
                Rejoindre le salon
            </button>
            <button onclick="simulateVoiceLeave()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 5px;">
                Quitter le salon
            </button>
        `;
        messagesContainer.appendChild(voiceInfo);
    }
    
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function switchChatChannel(channelId) {
    currentChatChannel = channelId;
    updateChatChannels();
    updateChatMessages();
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const content = input.value.trim();
    if (!content) return;
    
    // Check for commands
    if (content.startsWith('/')) {
        handleChatCommand(content);
    } else {
        // Send regular message
        const message = virtualOS.chatSystem.sendMessage(currentChatChannel, content);
        if (message) {
            updateChatMessages();
            
            // Simulate response from other users occasionally
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    simulateUserResponse(content);
                }, 1000 + Math.random() * 3000);
            }
        }
    }
    
    input.value = '';
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function handleChatCommand(command) {
    const parts = command.substring(1).split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    switch (cmd) {
        case 'help':
            addSystemMessage('Commandes disponibles: /help, /clear, /time, /users, /nick [nom]');
            break;
            
        case 'clear':
            const channel = virtualOS.chatSystem.channels.get(currentChatChannel);
            if (channel) {
                channel.messages = [];
                updateChatMessages();
                addSystemMessage('Historique effacé');
            }
            break;
            
        case 'time':
            addSystemMessage(`Heure actuelle: ${new Date().toLocaleString('fr-FR')}`);
            break;
            
        case 'users':
            const users = virtualOS.userManager.getAllUsers();
            const userList = users.map(u => u.username).join(', ');
            addSystemMessage(`Utilisateurs enregistrés: ${userList}`);
            break;
            
        case 'nick':
            if (args.length > 0) {
                const newNick = args.join(' ');
                addSystemMessage(`${virtualOS.currentUser} est maintenant connu sous le nom ${newNick}`);
                virtualOS.chatSystem.setUsername(newNick);
            } else {
                addSystemMessage('Usage: /nick [nouveau nom]');
            }
            break;
            
        default:
            addSystemMessage(`Commande inconnue: ${cmd}. Tapez /help pour la liste des commandes.`);
    }
}

function addSystemMessage(content) {
    const message = virtualOS.chatSystem.sendMessage(currentChatChannel, content);
    if (message) {
        message.author = 'Système';
        updateChatMessages();
    }
}

function simulateUserResponse(originalMessage) {
    const responses = [
        "Intéressant!",
        "Je suis d'accord",
        "Hmm, je ne suis pas sûr...",
        "C'est cool!",
        "Salut tout le monde!",
        "Comment ça va?",
        "Qui d'autre utilise Virtual OS?",
        "J'adore cette interface!",
        "Les fonctionnalités sont impressionnantes",
        "Est-ce que quelqu'un a testé le gestionnaire de fichiers?"
    ];
    
    const users = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eva', 'Frank'];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Temporarily change username for simulation
    const originalUsername = virtualOS.chatSystem.username;
    virtualOS.chatSystem.setUsername(randomUser);
    
    const message = virtualOS.chatSystem.sendMessage(currentChatChannel, randomResponse);
    if (message) {
        updateChatMessages();
    }
    
    // Restore original username
    virtualOS.chatSystem.setUsername(originalUsername);
}

function simulateVoiceJoin() {
    addSystemMessage(`${virtualOS.currentUser} a rejoint le salon vocal`);
    showNotification('Vous avez rejoint le salon vocal');
}

function simulateVoiceLeave() {
    addSystemMessage(`${virtualOS.currentUser} a quitté le salon vocal`);
    showNotification('Vous avez quitté le salon vocal');
}

function formatTime(date) {
    return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add emoji support
function addEmoji(emoji) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value += emoji;
        input.focus();
    }
}

// Initialize chat when window is created
document.addEventListener('DOMContentLoaded', () => {
    // Add emoji toolbar to chat (could be expanded)
    const emojiToolbar = `
        <div style="padding: 10px; background: #f8f9fa; border-bottom: 1px solid #e2e8f0; display: flex; gap: 5px; flex-wrap: wrap;">
            <button onclick="addEmoji('😀')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">😀</button>
            <button onclick="addEmoji('😂')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">😂</button>
            <button onclick="addEmoji('❤️')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">❤️</button>
            <button onclick="addEmoji('👍')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">👍</button>
            <button onclick="addEmoji('👎')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">👎</button>
            <button onclick="addEmoji('🔥')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">🔥</button>
            <button onclick="addEmoji('💯')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">💯</button>
            <button onclick="addEmoji('🎉')" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 5px;">🎉</button>
        </div>
    `;
    
    // This would be injected into the chat window when it opens
    window.chatEmojiToolbar = emojiToolbar;
});