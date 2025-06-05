// Core Virtual OS functionality
class VirtualOS {
    constructor() {
        this.currentUser = null;
        this.windows = new Map();
        this.windowCounter = 0;
        this.activeWindow = null;
        this.fileSystem = new FileSystem();
        this.chatSystem = new ChatSystem();
        this.userManager = new UserManager();
        this.adminKey = this.generateAdminKey();
        
        this.init();
    }
    
    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // Load user data
        this.userManager.loadUsers();
        
        // Hide menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#startMenu')) {
                document.getElementById('startMenu').style.display = 'none';
            }
            if (!e.target.closest('#contextMenu')) {
                document.getElementById('contextMenu').style.display = 'none';
            }
            if (!e.target.closest('#userMenu')) {
                document.getElementById('userMenu').style.display = 'none';
            }
        });
        
        // Prevent default context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.desktop-background')) {
                e.preventDefault();
            }
        });
        
        console.log('Virtual OS initialized');
        console.log('Admin key:', this.adminKey);
    }
    
    generateAdminKey() {
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // Save admin key to file
        this.saveAdminKey(key);
        return key;
    }
    
    saveAdminKey(key) {
        try {
            localStorage.setItem('virtualos_admin_key', key);
            // Also create a virtual admin_key.txt file
            this.fileSystem.createFile('/System/admin_key.txt', key);
        } catch (error) {
            console.error('Error saving admin key:', error);
        }
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    setCurrentUser(username) {
        this.currentUser = username;
        const userElement = document.getElementById('currentUser');
        if (userElement) {
            userElement.textContent = username;
        }
    }
    
    createWindow(id, title, content, className = '') {
        const windowElement = document.createElement('div');
        windowElement.className = `window ${className}`;
        windowElement.id = `window-${id}`;
        windowElement.style.left = `${50 + this.windowCounter * 30}px`;
        windowElement.style.top = `${50 + this.windowCounter * 30}px`;
        
        windowElement.innerHTML = `
            <div class="window-header">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <button class="window-control minimize-btn" onclick="minimizeWindow('${id}')">−</button>
                    <button class="window-control maximize-btn" onclick="toggleMaximize('${id}')">□</button>
                    <button class="window-control close-btn" onclick="closeWindow('${id}')">×</button>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;
        
        document.getElementById('windowsContainer').appendChild(windowElement);
        
        // Make window draggable
        this.makeDraggable(windowElement);
        
        // Add to taskbar
        this.addToTaskbar(id, title);
        
        // Set as active window
        this.setActiveWindow(id);
        
        // Store window reference
        this.windows.set(id, {
            element: windowElement,
            title: title,
            isMaximized: false,
            isMinimized: false
        });
        
        this.windowCounter++;
        
        return windowElement;
    }
    
    makeDraggable(windowElement) {
        const header = windowElement.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = windowElement.offsetLeft;
            startTop = windowElement.offsetTop;
            
            windowElement.style.zIndex = 1000;
            this.setActiveWindow(windowElement.id.replace('window-', ''));
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            windowElement.style.left = `${startLeft + deltaX}px`;
            windowElement.style.top = `${Math.max(0, startTop + deltaY)}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Double-click to maximize
        header.addEventListener('dblclick', () => {
            const windowId = windowElement.id.replace('window-', '');
            toggleMaximize(windowId);
        });
    }
    
    addToTaskbar(windowId, title) {
        const taskbarItems = document.getElementById('taskbarItems');
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.id = `taskbar-${windowId}`;
        taskbarItem.textContent = title;
        taskbarItem.onclick = () => this.focusWindow(windowId);
        taskbarItems.appendChild(taskbarItem);
    }
    
    removeFromTaskbar(windowId) {
        const taskbarItem = document.getElementById(`taskbar-${windowId}`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }
    
    setActiveWindow(windowId) {
        // Remove active class from all windows
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('active');
            w.style.zIndex = 100;
        });
        
        // Remove active class from all taskbar items
        document.querySelectorAll('.taskbar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Set active window
        const windowElement = document.getElementById(`window-${windowId}`);
        const taskbarItem = document.getElementById(`taskbar-${windowId}`);
        
        if (windowElement) {
            windowElement.classList.add('active');
            windowElement.style.zIndex = 200;
            this.activeWindow = windowId;
        }
        
        if (taskbarItem) {
            taskbarItem.classList.add('active');
        }
    }
    
    focusWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window && window.isMinimized) {
            // Restore from minimized state
            window.element.classList.remove('minimized');
            window.isMinimized = false;
        }
        this.setActiveWindow(windowId);
    }
    
    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.remove();
            this.removeFromTaskbar(windowId);
            this.windows.delete(windowId);
        }
    }
    
    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.add('minimized');
            window.isMinimized = true;
        }
    }
    
    toggleMaximize(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            if (window.isMaximized) {
                window.element.classList.remove('maximized');
                window.isMaximized = false;
            } else {
                window.element.classList.add('maximized');
                window.isMaximized = true;
            }
        }
    }
}

// File System
class FileSystem {
    constructor() {
        this.files = new Map();
        this.directories = new Set();
        this.currentPath = '/';
        this.initializeSystem();
    }
    
    initializeSystem() {
        // Create basic directory structure
        this.createDirectory('/');
        this.createDirectory('/System');
        this.createDirectory('/Users');
        this.createDirectory('/Applications');
        this.createDirectory('/Documents');
        this.createDirectory('/Desktop');
        this.createDirectory('/Downloads');
        
        // Create some default files
        this.createFile('/System/readme.txt', 'Bienvenue dans Virtual OS!\n\nCe système d\'exploitation virtuel offre une interface complète avec:\n- Gestionnaire de fichiers\n- Système de chat\n- Applications intégrées\n- Dashboard administrateur\n\nProfitez de votre expérience!');
        this.createFile('/Documents/exemple.txt', 'Ceci est un fichier d\'exemple.\nVous pouvez créer, modifier et supprimer des fichiers.');
    }
    
    createDirectory(path) {
        this.directories.add(path);
        return true;
    }
    
    createFile(path, content = '') {
        this.files.set(path, {
            content: content,
            created: new Date(),
            modified: new Date(),
            size: content.length
        });
        return true;
    }
    
    getFile(path) {
        return this.files.get(path);
    }
    
    getDirectoryContents(path) {
        const contents = [];
        
        // Add subdirectories
        for (const dir of this.directories) {
            if (dir !== path && dir.startsWith(path) && dir !== '/' && path !== '/') {
                const relativePath = dir.substring(path.length);
                if (relativePath && !relativePath.includes('/')) {
                    contents.push({
                        name: relativePath,
                        type: 'directory',
                        path: dir
                    });
                }
            } else if (path === '/') {
                const parts = dir.split('/').filter(p => p);
                if (parts.length === 1) {
                    contents.push({
                        name: parts[0],
                        type: 'directory',
                        path: dir
                    });
                }
            }
        }
        
        // Add files
        for (const [filePath, fileData] of this.files) {
            if (filePath.startsWith(path) && filePath !== path) {
                const relativePath = path === '/' ? filePath.substring(1) : filePath.substring(path.length + 1);
                if (relativePath && !relativePath.includes('/')) {
                    const extension = relativePath.split('.').pop().toLowerCase();
                    contents.push({
                        name: relativePath,
                        type: 'file',
                        path: filePath,
                        size: fileData.size,
                        modified: fileData.modified,
                        extension: extension
                    });
                }
            }
        }
        
        return contents;
    }
    
    deleteFile(path) {
        return this.files.delete(path);
    }
    
    deleteDirectory(path) {
        // Remove directory and all its contents
        this.directories.delete(path);
        
        // Remove all files in directory
        for (const filePath of this.files.keys()) {
            if (filePath.startsWith(path)) {
                this.files.delete(filePath);
            }
        }
        
        // Remove all subdirectories
        for (const dir of this.directories) {
            if (dir.startsWith(path) && dir !== path) {
                this.directories.delete(dir);
            }
        }
        
        return true;
    }
    
    importFile(file) {
        const path = `/Downloads/${file.name}`;
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                this.createFile(path, e.target.result);
                resolve(path);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// Chat System
class ChatSystem {
    constructor() {
        this.channels = new Map();
        this.currentChannel = 'general';
        this.username = 'Guest';
        this.initializeChannels();
    }
    
    initializeChannels() {
        this.channels.set('general', {
            name: 'Général',
            type: 'text',
            messages: [
                {
                    id: 1,
                    author: 'Système',
                    content: 'Bienvenue dans le chat Virtual OS!',
                    timestamp: new Date()
                }
            ]
        });
        
        this.channels.set('random', {
            name: 'Random',
            type: 'text',
            messages: []
        });
        
        this.channels.set('voice-1', {
            name: 'Salon Vocal 1',
            type: 'voice',
            messages: [],
            participants: []
        });
    }
    
    setUsername(username) {
        this.username = username;
    }
    
    sendMessage(channelId, content) {
        const channel = this.channels.get(channelId);
        if (channel) {
            const message = {
                id: Date.now(),
                author: this.username,
                content: content,
                timestamp: new Date()
            };
            channel.messages.push(message);
            return message;
        }
        return null;
    }
    
    getChannelMessages(channelId) {
        const channel = this.channels.get(channelId);
        return channel ? channel.messages : [];
    }
    
    getChannels() {
        return Array.from(this.channels.entries()).map(([id, channel]) => ({
            id,
            name: channel.name,
            type: channel.type
        }));
    }
}

// User Management
class UserManager {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
    }
    
    loadUsers() {
        try {
            const savedUsers = localStorage.getItem('virtualos_users');
            if (savedUsers) {
                const usersData = JSON.parse(savedUsers);
                this.users = new Map(usersData);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
    
    saveUsers() {
        try {
            const usersData = Array.from(this.users.entries());
            localStorage.setItem('virtualos_users', JSON.stringify(usersData));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }
    
    createUser(username, password) {
        if (this.users.has(username)) {
            return { success: false, message: 'L\'utilisateur existe déjà' };
        }
        
        this.users.set(username, {
            password: password, // In a real system, this would be hashed
            created: new Date(),
            lastLogin: null,
            permissions: ['user']
        });
        
        this.saveUsers();
        
        return { success: true, message: 'Utilisateur créé avec succès' };
    }
    
    authenticateUser(username, password) {
        const user = this.users.get(username);
        if (user && user.password === password) {
            user.lastLogin = new Date();
            this.saveUsers();
            
            // Create session
            const sessionId = Math.random().toString(36).substring(2, 15);
            this.sessions.set(sessionId, {
                username: username,
                created: new Date()
            });
            
            return { success: true, sessionId: sessionId };
        }
        
        return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }
    
    getUser(username) {
        return this.users.get(username);
    }
    
    getAllUsers() {
        return Array.from(this.users.entries()).map(([username, userData]) => ({
            username,
            created: userData.created,
            lastLogin: userData.lastLogin,
            permissions: userData.permissions
        }));
    }
}

// Global instances
let virtualOS;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    virtualOS = new VirtualOS();
});

// Global functions for window management
function minimizeWindow(windowId) {
    virtualOS.minimizeWindow(windowId);
}

function toggleMaximize(windowId) {
    virtualOS.toggleMaximize(windowId);
}

function closeWindow(windowId) {
    virtualOS.closeWindow(windowId);
}