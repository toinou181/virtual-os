// Authentication System

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('desktop').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'flex';
    document.getElementById('desktop').style.display = 'none';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const result = virtualOS.userManager.authenticateUser(username, password);
    
    if (result.success) {
        // Successful login
        virtualOS.setCurrentUser(username);
        virtualOS.chatSystem.setUsername(username);
        
        // Hide login screen and show desktop
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('desktop').style.display = 'block';
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        // Create user's home directory if it doesn't exist
        const userDir = `/Users/${username}`;
        virtualOS.fileSystem.createDirectory(userDir);
        virtualOS.fileSystem.createDirectory(`${userDir}/Documents`);
        virtualOS.fileSystem.createDirectory(`${userDir}/Desktop`);
        virtualOS.fileSystem.createDirectory(`${userDir}/Downloads`);
        
        // Create welcome file for new user
        const welcomeFile = `${userDir}/Documents/Bienvenue.txt`;
        if (!virtualOS.fileSystem.getFile(welcomeFile)) {
            virtualOS.fileSystem.createFile(welcomeFile, 
                `Bienvenue ${username}!\n\nVotre session Virtual OS est maintenant active.\n\nVous avez accès à:\n- Gestionnaire de fichiers\n- Système de chat Discord\n- Applications intégrées\n- Vos documents personnels\n\nBonne utilisation!`
            );
        }
        
        showWelcomeMessage(username);
    } else {
        alert(result.message || 'Erreur de connexion');
    }
}

function register() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }
    
    if (username.length < 3) {
        alert('Le nom d\'utilisateur doit contenir au moins 3 caractères');
        return;
    }
    
    if (password.length < 4) {
        alert('Le mot de passe doit contenir au moins 4 caractères');
        return;
    }
    
    const result = virtualOS.userManager.createUser(username, password);
    
    if (result.success) {
        alert('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
        
        // Clear form and return to login
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        showLogin();
        
        // Auto-fill login form
        document.getElementById('username').value = username;
        document.getElementById('password').focus();
    } else {
        alert(result.message);
    }
}

function logout() {
    // Clear current user
    virtualOS.setCurrentUser(null);
    
    // Close all windows
    virtualOS.windows.forEach((window, id) => {
        virtualOS.closeWindow(id);
    });
    
    // Hide desktop and show login
    document.getElementById('desktop').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    
    // Clear any open menus
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('contextMenu').style.display = 'none';
    document.getElementById('userMenu').style.display = 'none';
    
    // Focus on username field
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 100);
}

function showWelcomeMessage(username) {
    const welcomeContent = `
        <div style="text-align: center; padding: 20px;">
            <h2>🎉 Bienvenue ${username}!</h2>
            <p>Votre session Virtual OS est maintenant active.</p>
            <div style="margin: 20px 0;">
                <h3>Fonctionnalités disponibles:</h3>
                <ul style="text-align: left; display: inline-block;">
                    <li>📁 Gestionnaire de fichiers avec import</li>
                    <li>💬 Système de chat Discord-like</li>
                    <li>🧮 Calculatrice</li>
                    <li>📝 Bloc-notes</li>
                    <li>🎮 Jeu Snake</li>
                    <li>⚙️ Dashboard administrateur</li>
                </ul>
            </div>
            <p style="color: #666; font-size: 14px;">
                Clic droit sur le bureau pour plus d'options.<br>
                Utilisez le menu démarrer pour accéder aux applications.
            </p>
            <button onclick="closeWindow('welcome')" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Commencer
            </button>
        </div>
    `;
    
    virtualOS.createWindow('welcome', `Bienvenue dans Virtual OS`, welcomeContent);
    
    // Auto-close after 10 seconds if user doesn't close it manually
    setTimeout(() => {
        if (virtualOS.windows.has('welcome')) {
            virtualOS.closeWindow('welcome');
        }
    }, 10000);
}

// Handle Enter key in login forms
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('username').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });
    
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // Register form
    document.getElementById('newUsername').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('newPassword').focus();
        }
    });
    
    document.getElementById('newPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('confirmPassword').focus();
        }
    });
    
    document.getElementById('confirmPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            register();
        }
    });
    
    // Focus on username field when page loads
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 100);
});

// User menu functions
function showProfile() {
    if (!virtualOS.currentUser) return;
    
    const user = virtualOS.userManager.getUser(virtualOS.currentUser);
    const profileContent = `
        <div class="admin-form">
            <h3>Profil Utilisateur</h3>
            <div style="margin: 20px 0;">
                <label>Nom d'utilisateur:</label>
                <input type="text" value="${virtualOS.currentUser}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Date de création:</label>
                <input type="text" value="${user.created.toLocaleDateString('fr-FR')}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Dernière connexion:</label>
                <input type="text" value="${user.lastLogin ? user.lastLogin.toLocaleDateString('fr-FR') : 'Première connexion'}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Permissions:</label>
                <input type="text" value="${user.permissions.join(', ')}" readonly style="background: #f5f5f5;">
            </div>
            <button onclick="changePassword()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Changer le mot de passe
            </button>
        </div>
    `;
    
    virtualOS.createWindow('profile', '👤 Profil Utilisateur', profileContent);
    document.getElementById('userMenu').style.display = 'none';
}

function changePassword() {
    const newPassword = prompt('Nouveau mot de passe (min. 4 caractères):');
    if (newPassword && newPassword.length >= 4) {
        const user = virtualOS.userManager.users.get(virtualOS.currentUser);
        if (user) {
            user.password = newPassword;
            virtualOS.userManager.saveUsers();
            alert('Mot de passe changé avec succès!');
        }
    } else if (newPassword !== null) {
        alert('Le mot de passe doit contenir au moins 4 caractères');
    }
}

function showSettings() {
    const settingsContent = `
        <div class="admin-form">
            <h3>Paramètres Utilisateur</h3>
            <div style="margin: 20px 0;">
                <label>Thème:</label>
                <select id="themeSelect" onchange="changeTheme()">
                    <option value="default">Défaut</option>
                    <option value="dark">Sombre</option>
                    <option value="light">Clair</option>
                </select>
            </div>
            <div style="margin: 20px 0;">
                <label>Langue:</label>
                <select id="languageSelect">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </select>
            </div>
            <div style="margin: 20px 0;">
                <label>Notifications:</label>
                <input type="checkbox" id="notificationsCheck" checked> Activer les notifications
            </div>
            <div style="margin: 20px 0;">
                <label>Sons système:</label>
                <input type="checkbox" id="soundsCheck" checked> Activer les sons
            </div>
            <button onclick="saveSettings()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Sauvegarder
            </button>
        </div>
    `;
    
    virtualOS.createWindow('settings', '⚙️ Paramètres', settingsContent);
    document.getElementById('userMenu').style.display = 'none';
}

function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    // Theme switching logic would go here
    console.log('Theme changed to:', theme);
}

function saveSettings() {
    // Settings saving logic would go here
    alert('Paramètres sauvegardés!');
}