// Admin Dashboard functionality

function showAdminDashboard() {
    document.getElementById('adminAccessModal').style.display = 'flex';
}

function closeAdminAccess() {
    document.getElementById('adminAccessModal').style.display = 'none';
    document.getElementById('adminKey').value = '';
}

function verifyAdminAccess() {
    const enteredKey = document.getElementById('adminKey').value;
    const storedKey = localStorage.getItem('virtualos_admin_key') || virtualOS.adminKey;
    
    if (enteredKey === storedKey) {
        closeAdminAccess();
        openAdminDashboard();
        showNotification('Accès administrateur accordé');
    } else {
        alert('Clé de sécurité incorrecte');
        document.getElementById('adminKey').value = '';
    }
}

function openAdminDashboard() {
    const adminContent = `
        <div class="admin-dashboard">
            <div class="admin-header">
                <h1>🔐 Dashboard Administrateur</h1>
                <p>Accès ultra-sécurisé - Gestion du système Virtual OS</p>
            </div>
            
            <div class="admin-nav">
                <button class="admin-nav-btn active" onclick="showAdminSection('overview')">Vue d'ensemble</button>
                <button class="admin-nav-btn" onclick="showAdminSection('users')">Gestion des utilisateurs</button>
                <button class="admin-nav-btn" onclick="showAdminSection('system')">Configuration système</button>
                <button class="admin-nav-btn" onclick="showAdminSection('files')">Gestion des fichiers</button>
                <button class="admin-nav-btn" onclick="showAdminSection('security')">Sécurité</button>
                <button class="admin-nav-btn" onclick="showAdminSection('emergency')">Outils d'urgence</button>
            </div>
            
            <div class="admin-content" id="adminContent">
                ${getAdminOverviewContent()}
            </div>
        </div>
    `;
    
    virtualOS.createWindow('admin', '🔐 Dashboard Administrateur', adminContent, 'admin-window');
}

function showAdminSection(section) {
    // Update nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content
    const contentContainer = document.getElementById('adminContent');
    if (!contentContainer) return;
    
    switch (section) {
        case 'overview':
            contentContainer.innerHTML = getAdminOverviewContent();
            break;
        case 'users':
            contentContainer.innerHTML = getAdminUsersContent();
            break;
        case 'system':
            contentContainer.innerHTML = getAdminSystemContent();
            break;
        case 'files':
            contentContainer.innerHTML = getAdminFilesContent();
            break;
        case 'security':
            contentContainer.innerHTML = getAdminSecurityContent();
            break;
        case 'emergency':
            contentContainer.innerHTML = getAdminEmergencyContent();
            break;
    }
}

function getAdminOverviewContent() {
    const users = virtualOS.userManager.getAllUsers();
    const fileCount = virtualOS.fileSystem.files.size;
    const dirCount = virtualOS.fileSystem.directories.size;
    const windowCount = virtualOS.windows.size;
    
    return `
        <div class="admin-section">
            <h3>📊 Vue d'ensemble du système</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">
                <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>👥 Utilisateurs</h4>
                    <div style="font-size: 32px; font-weight: bold;">${users.length}</div>
                    <p>Comptes enregistrés</p>
                </div>
                <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>📁 Fichiers</h4>
                    <div style="font-size: 32px; font-weight: bold;">${fileCount}</div>
                    <p>Fichiers stockés</p>
                </div>
                <div style="background: #f59e0b; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>📂 Dossiers</h4>
                    <div style="font-size: 32px; font-weight: bold;">${dirCount}</div>
                    <p>Répertoires créés</p>
                </div>
                <div style="background: #ef4444; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>🪟 Fenêtres</h4>
                    <div style="font-size: 32px; font-weight: bold;">${windowCount}</div>
                    <p>Fenêtres ouvertes</p>
                </div>
            </div>
            
            <div style="margin: 30px 0;">
                <h4>🔄 État du système</h4>
                <table class="admin-table">
                    <tr>
                        <td>Système d'exploitation</td>
                        <td>Virtual OS v1.0</td>
                    </tr>
                    <tr>
                        <td>Utilisateur connecté</td>
                        <td>${virtualOS.currentUser || 'Aucun'}</td>
                    </tr>
                    <tr>
                        <td>Heure de connexion</td>
                        <td>${new Date().toLocaleString('fr-FR')}</td>
                    </tr>
                    <tr>
                        <td>Dernière sauvegarde</td>
                        <td>Automatique</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin: 30px 0;">
                <h4>⚡ Actions rapides</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="adminBackupSystem()" style="background: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        💾 Sauvegarder le système
                    </button>
                    <button onclick="adminCleanSystem()" style="background: #f59e0b; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        🧹 Nettoyer le système
                    </button>
                    <button onclick="adminRebootSystem()" style="background: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        🔄 Redémarrer le système
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getAdminUsersContent() {
    const users = virtualOS.userManager.getAllUsers();
    
    let usersTable = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Nom d'utilisateur</th>
                    <th>Date de création</th>
                    <th>Dernière connexion</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        usersTable += `
            <tr>
                <td>${user.username}</td>
                <td>${user.created.toLocaleDateString('fr-FR')}</td>
                <td>${user.lastLogin ? user.lastLogin.toLocaleDateString('fr-FR') : 'Jamais'}</td>
                <td>${user.permissions.join(', ')}</td>
                <td>
                    <button onclick="adminEditUser('${user.username}')" style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 2px;">
                        Éditer
                    </button>
                    <button onclick="adminDeleteUser('${user.username}')" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 2px;">
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    });
    
    usersTable += '</tbody></table>';
    
    return `
        <div class="admin-section">
            <h3>👥 Gestion des utilisateurs</h3>
            
            <div style="margin: 20px 0;">
                <button onclick="adminCreateUser()" style="background: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                    ➕ Créer un utilisateur
                </button>
            </div>
            
            ${usersTable}
        </div>
    `;
}

function getAdminSystemContent() {
    return `
        <div class="admin-section">
            <h3>⚙️ Configuration système</h3>
            
            <form class="admin-form">
                <label>Nom du système:</label>
                <input type="text" value="Virtual OS" id="systemName">
                
                <label>Version:</label>
                <input type="text" value="1.0.0" id="systemVersion">
                
                <label>Langue par défaut:</label>
                <select id="systemLanguage">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                </select>
                
                <label>Thème par défaut:</label>
                <select id="systemTheme">
                    <option value="default">Défaut</option>
                    <option value="dark">Sombre</option>
                    <option value="light">Clair</option>
                </select>
                
                <label>Taille max des fichiers (MB):</label>
                <input type="number" value="100" id="maxFileSize">
                
                <label>Nombre max d'utilisateurs:</label>
                <input type="number" value="1000" id="maxUsers">
                
                <button type="button" onclick="adminSaveSystemConfig()">💾 Sauvegarder la configuration</button>
            </form>
            
            <div style="margin-top: 30px;">
                <h4>📈 Statistiques avancées</h4>
                <table class="admin-table">
                    <tr>
                        <td>Mémoire utilisée</td>
                        <td>${(virtualOS.windows.size * 50)} MB</td>
                    </tr>
                    <tr>
                        <td>Espace disque virtuel</td>
                        <td>${virtualOS.fileSystem.files.size * 10} KB</td>
                    </tr>
                    <tr>
                        <td>Processus actifs</td>
                        <td>${virtualOS.windows.size}</td>
                    </tr>
                    <tr>
                        <td>Temps de fonctionnement</td>
                        <td>Session en cours</td>
                    </tr>
                </table>
            </div>
        </div>
    `;
}

function getAdminFilesContent() {
    return `
        <div class="admin-section">
            <h3>📁 Gestion des fichiers système</h3>
            
            <div style="margin: 20px 0;">
                <button onclick="adminViewSystemFiles()" style="background: #667eea; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    👁️ Voir les fichiers système
                </button>
                <button onclick="adminCleanTempFiles()" style="background: #f59e0b; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    🧹 Nettoyer les fichiers temporaires
                </button>
                <button onclick="adminBackupFiles()" style="background: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    💾 Sauvegarder les fichiers
                </button>
            </div>
            
            <div style="margin: 30px 0;">
                <h4>📊 Analyse de l'espace disque</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <div>Fichiers système: ${Math.floor(virtualOS.fileSystem.files.size * 0.3)} fichiers</div>
                    <div>Fichiers utilisateur: ${Math.floor(virtualOS.fileSystem.files.size * 0.7)} fichiers</div>
                    <div>Dossiers: ${virtualOS.fileSystem.directories.size} répertoires</div>
                    <div style="margin-top: 10px;">
                        <div style="background: #e2e8f0; height: 20px; border-radius: 10px; overflow: hidden;">
                            <div style="background: #667eea; height: 100%; width: 45%; transition: width 0.3s;"></div>
                        </div>
                        <small>Utilisation: 45% de l'espace alloué</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAdminSecurityContent() {
    return `
        <div class="admin-section">
            <h3>🔐 Configuration de sécurité</h3>
            
            <div style="margin: 20px 0;">
                <h4>🔑 Gestion des clés d'accès</h4>
                <div style="background: #fee2e2; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <strong>⚠️ Attention:</strong> La clé administrateur actuelle est: <code style="background: #000; color: #0f0; padding: 2px 8px; border-radius: 3px;">${virtualOS.adminKey}</code>
                </div>
                <button onclick="adminRegenerateKey()" style="background: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                    🔄 Régénérer la clé admin
                </button>
            </div>
            
            <form class="admin-form">
                <label>Politique de mots de passe:</label>
                <select id="passwordPolicy">
                    <option value="simple">Simple (4+ caractères)</option>
                    <option value="medium">Moyenne (8+ caractères)</option>
                    <option value="strong">Forte (12+ caractères + complexité)</option>
                </select>
                
                <label>Durée de session (minutes):</label>
                <input type="number" value="60" id="sessionDuration">
                
                <label>Tentatives de connexion max:</label>
                <input type="number" value="5" id="maxLoginAttempts">
                
                <label>Chiffrement des données:</label>
                <select id="encryption">
                    <option value="none">Aucun</option>
                    <option value="basic">Basique</option>
                    <option value="advanced">Avancé</option>
                </select>
                
                <button type="button" onclick="adminSaveSecurityConfig()">💾 Sauvegarder</button>
            </form>
        </div>
    `;
}

function getAdminEmergencyContent() {
    return `
        <div class="admin-section">
            <h3>🚨 Outils d'administration d'urgence</h3>
            
            <div style="background: #fee2e2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #dc2626;">⚠️ Zone Dangereuse</h4>
                <p>Ces actions peuvent affecter le fonctionnement du système. Utilisez avec précaution.</p>
            </div>
            
            <div style="display: grid; gap: 20px; margin: 20px 0;">
                <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px;">
                    <h4>🔧 Réparation système</h4>
                    <p>Répare les fichiers système corrompus et restaure la configuration par défaut.</p>
                    <button onclick="adminRepairSystem()" style="background: #f59e0b; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        🔧 Lancer la réparation
                    </button>
                </div>
                
                <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px;">
                    <h4>🗑️ Réinitialisation d'urgence</h4>
                    <p>Supprime tous les données utilisateur et remet le système à zéro.</p>
                    <button onclick="adminEmergencyReset()" style="background: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        🗑️ Réinitialisation totale
                    </button>
                </div>
                
                <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px;">
                    <h4>👥 Gestion d'urgence des utilisateurs</h4>
                    <p>Outils pour gérer les comptes en cas de problème d'accès.</p>
                    <button onclick="adminForceLogoutAll()" style="background: #dc2626; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                        🚪 Déconnecter tous les utilisateurs
                    </button>
                    <button onclick="adminDisableUserAccounts()" style="background: #dc2626; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                        🔒 Désactiver tous les comptes
                    </button>
                </div>
                
                <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px;">
                    <h4>📋 Journaux d'événements</h4>
                    <p>Consultation des logs système pour diagnostiquer les problèmes.</p>
                    <button onclick="adminViewLogs()" style="background: #667eea; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        📋 Voir les journaux
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Admin action functions
function adminBackupSystem() {
    showNotification('Sauvegarde système en cours...');
    setTimeout(() => {
        showNotification('Sauvegarde système terminée!');
    }, 2000);
}

function adminCleanSystem() {
    showNotification('Nettoyage système en cours...');
    setTimeout(() => {
        showNotification('Nettoyage système terminé!');
    }, 1500);
}

function adminRebootSystem() {
    if (confirm('Êtes-vous sûr de vouloir redémarrer le système? Toutes les sessions seront perdues.')) {
        showNotification('Redémarrage du système...');
        setTimeout(() => {
            logout();
        }, 2000);
    }
}

function adminCreateUser() {
    const username = prompt('Nom d\'utilisateur:');
    const password = prompt('Mot de passe:');
    
    if (username && password) {
        const result = virtualOS.userManager.createUser(username, password);
        if (result.success) {
            showNotification(`Utilisateur "${username}" créé`);
            showAdminSection('users');
        } else {
            alert(result.message);
        }
    }
}

function adminEditUser(username) {
    const newPassword = prompt(`Nouveau mot de passe pour ${username}:`);
    if (newPassword) {
        const user = virtualOS.userManager.users.get(username);
        if (user) {
            user.password = newPassword;
            virtualOS.userManager.saveUsers();
            showNotification(`Mot de passe mis à jour pour ${username}`);
        }
    }
}

function adminDeleteUser(username) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}"?`)) {
        virtualOS.userManager.users.delete(username);
        virtualOS.userManager.saveUsers();
        showNotification(`Utilisateur "${username}" supprimé`);
        showAdminSection('users');
    }
}

function adminRegenerateKey() {
    if (confirm('Êtes-vous sûr de vouloir régénérer la clé administrateur? L\'ancienne clé ne fonctionnera plus.')) {
        virtualOS.adminKey = virtualOS.generateAdminKey();
        showNotification('Nouvelle clé administrateur générée');
        showAdminSection('security');
    }
}

function adminSaveSystemConfig() {
    // Save system configuration
    const config = {
        name: document.getElementById('systemName').value,
        version: document.getElementById('systemVersion').value,
        language: document.getElementById('systemLanguage').value,
        theme: document.getElementById('systemTheme').value,
        maxFileSize: document.getElementById('maxFileSize').value,
        maxUsers: document.getElementById('maxUsers').value
    };
    
    localStorage.setItem('virtualos_system_config', JSON.stringify(config));
    showNotification('Configuration système sauvegardée');
}

function adminSaveSecurityConfig() {
    // Save security configuration
    const config = {
        passwordPolicy: document.getElementById('passwordPolicy').value,
        sessionDuration: document.getElementById('sessionDuration').value,
        maxLoginAttempts: document.getElementById('maxLoginAttempts').value,
        encryption: document.getElementById('encryption').value
    };
    
    localStorage.setItem('virtualos_security_config', JSON.stringify(config));
    showNotification('Configuration de sécurité sauvegardée');
}

function adminRepairSystem() {
    if (confirm('Lancer la réparation système? Cette opération peut prendre quelques instants.')) {
        showNotification('Réparation système en cours...');
        setTimeout(() => {
            showNotification('Réparation système terminée!');
        }, 3000);
    }
}

function adminEmergencyReset() {
    const confirmation = prompt('ATTENTION: Cette action supprimera TOUTES les données. Tapez "RESET" pour confirmer:');
    if (confirmation === 'RESET') {
        localStorage.clear();
        alert('Réinitialisation terminée. Le système va redémarrer.');
        location.reload();
    }
}

function adminForceLogoutAll() {
    if (confirm('Déconnecter tous les utilisateurs?')) {
        logout();
        showNotification('Tous les utilisateurs ont été déconnectés');
    }
}

function adminDisableUserAccounts() {
    if (confirm('Désactiver temporairement tous les comptes utilisateur?')) {
        showNotification('Comptes utilisateur désactivés temporairement');
    }
}

function adminViewLogs() {
    const logsContent = `
        <div style="font-family: 'Courier New', monospace; background: #000; color: #0f0; padding: 20px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
            <div>[${new Date().toISOString()}] SYSTEM: Virtual OS started</div>
            <div>[${new Date().toISOString()}] AUTH: User ${virtualOS.currentUser} logged in</div>
            <div>[${new Date().toISOString()}] ADMIN: Dashboard accessed</div>
            <div>[${new Date().toISOString()}] SYSTEM: File system initialized</div>
            <div>[${new Date().toISOString()}] CHAT: Chat system ready</div>
            <div>[${new Date().toISOString()}] WINDOW: ${virtualOS.windows.size} windows active</div>
            <div>[${new Date().toISOString()}] INFO: All systems operational</div>
        </div>
    `;
    
    virtualOS.createWindow('logs', '📋 Journaux Système', logsContent);
}

function adminViewSystemFiles() {
    openFileManager('/System');
}

function adminCleanTempFiles() {
    showNotification('Nettoyage des fichiers temporaires...');
    setTimeout(() => {
        showNotification('Fichiers temporaires supprimés');
    }, 1000);
}

function adminBackupFiles() {
    showNotification('Sauvegarde des fichiers en cours...');
    setTimeout(() => {
        showNotification('Sauvegarde des fichiers terminée');
    }, 2000);
}