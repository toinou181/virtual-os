// Desktop functionality

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const isVisible = startMenu.style.display === 'block';
    startMenu.style.display = isVisible ? 'none' : 'block';
}

function showDesktopMenu(event) {
    event.preventDefault();
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;
    
    // Hide other menus
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('userMenu').style.display = 'none';
}

function showUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userInfo = document.querySelector('.user-info');
    const rect = userInfo.getBoundingClientRect();
    
    userMenu.style.display = 'block';
    userMenu.style.right = '10px';
    userMenu.style.bottom = '60px';
    
    // Hide other menus
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('contextMenu').style.display = 'none';
}

function createNewFolder() {
    const folderName = prompt('Nom du nouveau dossier:');
    if (folderName && folderName.trim()) {
        const path = `/Desktop/${folderName.trim()}`;
        virtualOS.fileSystem.createDirectory(path);
        
        // Create desktop icon for the new folder
        createDesktopIcon(folderName.trim(), '📁', () => openFolder(path));
        
        document.getElementById('contextMenu').style.display = 'none';
        showNotification(`Dossier "${folderName.trim()}" créé`);
    }
}

function createNewFile() {
    const fileName = prompt('Nom du nouveau fichier:');
    if (fileName && fileName.trim()) {
        const path = `/Desktop/${fileName.trim()}`;
        virtualOS.fileSystem.createFile(path, '');
        
        // Determine file icon based on extension
        const extension = fileName.split('.').pop().toLowerCase();
        let icon = '📄';
        if (extension === 'txt') icon = '📝';
        else if (['jpg', 'png', 'gif', 'jpeg'].includes(extension)) icon = '🖼️';
        else if (['mp3', 'wav', 'ogg'].includes(extension)) icon = '🎵';
        else if (['mp4', 'avi', 'mov'].includes(extension)) icon = '🎬';
        
        // Create desktop icon for the new file
        createDesktopIcon(fileName.trim(), icon, () => openFile(path));
        
        document.getElementById('contextMenu').style.display = 'none';
        showNotification(`Fichier "${fileName.trim()}" créé`);
    }
}

function importFile() {
    document.getElementById('fileInput').click();
    document.getElementById('contextMenu').style.display = 'none';
}

function handleFileImport(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(async (file) => {
        try {
            const path = await virtualOS.fileSystem.importFile(file);
            
            // Determine file icon
            const extension = file.name.split('.').pop().toLowerCase();
            let icon = '📄';
            if (extension === 'txt') icon = '📝';
            else if (['jpg', 'png', 'gif', 'jpeg'].includes(extension)) icon = '🖼️';
            else if (['mp3', 'wav', 'ogg'].includes(extension)) icon = '🎵';
            else if (['mp4', 'avi', 'mov'].includes(extension)) icon = '🎬';
            
            // Create desktop icon for imported file
            createDesktopIcon(file.name, icon, () => openFile(path));
            
            showNotification(`Fichier "${file.name}" importé avec succès`);
        } catch (error) {
            console.error('Error importing file:', error);
            showNotification(`Erreur lors de l'import de "${file.name}"`, 'error');
        }
    });
    
    // Reset file input
    event.target.value = '';
}

function refreshDesktop() {
    // Refresh desktop icons and layout
    showNotification('Bureau actualisé');
    document.getElementById('contextMenu').style.display = 'none';
}

function openProperties() {
    const propertiesContent = `
        <div class="admin-form">
            <h3>Propriétés du Bureau</h3>
            <div style="margin: 20px 0;">
                <label>Résolution:</label>
                <input type="text" value="${window.screen.width}x${window.screen.height}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Système:</label>
                <input type="text" value="Virtual OS v1.0" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Utilisateur:</label>
                <input type="text" value="${virtualOS.currentUser}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Heure système:</label>
                <input type="text" value="${new Date().toLocaleString('fr-FR')}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Mémoire utilisée:</label>
                <input type="text" value="${(virtualOS.windows.size * 50)} MB" readonly style="background: #f5f5f5;">
            </div>
        </div>
    `;
    
    virtualOS.createWindow('properties', '⚙️ Propriétés du Bureau', propertiesContent);
    document.getElementById('contextMenu').style.display = 'none';
}

function createDesktopIcon(name, icon, action) {
    const desktopIcons = document.querySelector('.desktop-icons');
    const iconElement = document.createElement('div');
    iconElement.className = 'desktop-icon';
    iconElement.ondblclick = action;
    
    iconElement.innerHTML = `
        <div class="icon">${icon}</div>
        <div class="icon-label">${name}</div>
    `;
    
    desktopIcons.appendChild(iconElement);
    return iconElement;
}

function openFolder(path) {
    // Open folder in file manager
    openFileManager(path);
}

function openFile(path) {
    const file = virtualOS.fileSystem.getFile(path);
    if (file) {
        const extension = path.split('.').pop().toLowerCase();
        
        if (extension === 'txt') {
            // Open in notepad
            openNotepad(path, file.content);
        } else if (['jpg', 'png', 'gif', 'jpeg'].includes(extension)) {
            // Open image viewer
            openImageViewer(path, file.content);
        } else {
            // Open generic file viewer
            openGenericViewer(path, file);
        }
    }
}

function openImageViewer(path, content) {
    const viewerContent = `
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column;">
            <h3>${path.split('/').pop()}</h3>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f5f5f5; margin: 10px 0; border-radius: 5px;">
                <div style="color: #666; font-size: 48px;">🖼️</div>
            </div>
            <p style="color: #666; font-size: 14px;">Aperçu d'image (simulation)</p>
        </div>
    `;
    
    virtualOS.createWindow(`image-${Date.now()}`, '🖼️ Visionneuse d\'images', viewerContent);
}

function openGenericViewer(path, file) {
    const viewerContent = `
        <div class="admin-form">
            <h3>Propriétés du fichier</h3>
            <div style="margin: 20px 0;">
                <label>Nom:</label>
                <input type="text" value="${path.split('/').pop()}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Chemin:</label>
                <input type="text" value="${path}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Taille:</label>
                <input type="text" value="${file.size} octets" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Créé le:</label>
                <input type="text" value="${file.created.toLocaleString('fr-FR')}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Modifié le:</label>
                <input type="text" value="${file.modified.toLocaleString('fr-FR')}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Contenu:</label>
                <textarea readonly style="width: 100%; height: 150px; background: #f5f5f5; font-family: 'Courier New', monospace;">${file.content}</textarea>
            </div>
        </div>
    `;
    
    virtualOS.createWindow(`file-${Date.now()}`, '📄 Visionneuse de fichiers', viewerContent);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation keyframes if not already added
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Alt + Tab - Switch windows
    if (event.altKey && event.key === 'Tab') {
        event.preventDefault();
        switchToNextWindow();
    }
    
    // Ctrl + Alt + T - Open terminal/notepad
    if (event.ctrlKey && event.altKey && event.key === 't') {
        event.preventDefault();
        openNotepad();
    }
    
    // Ctrl + Alt + F - Open file manager
    if (event.ctrlKey && event.altKey && event.key === 'f') {
        event.preventDefault();
        openFileManager();
    }
    
    // Escape - Close menus
    if (event.key === 'Escape') {
        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('contextMenu').style.display = 'none';
        document.getElementById('userMenu').style.display = 'none';
    }
});

function switchToNextWindow() {
    const windowIds = Array.from(virtualOS.windows.keys());
    if (windowIds.length === 0) return;
    
    const currentIndex = windowIds.indexOf(virtualOS.activeWindow);
    const nextIndex = (currentIndex + 1) % windowIds.length;
    const nextWindowId = windowIds[nextIndex];
    
    virtualOS.focusWindow(nextWindowId);
}