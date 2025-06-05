// File Manager functionality

let currentPath = '/';
let fileManagerHistory = ['/'];
let fileManagerHistoryIndex = 0;

function initializeFileManager(initialPath = '/') {
    currentPath = initialPath;
    fileManagerHistory = [initialPath];
    fileManagerHistoryIndex = 0;
    
    updateFileTree();
    updateFileList();
    updatePathDisplay();
}

function updateFileTree() {
    const fileTree = document.getElementById('fileTree');
    if (!fileTree) return;
    
    fileTree.innerHTML = '';
    
    // Add root directories
    const rootDirs = ['/', '/System', '/Users', '/Applications', '/Documents', '/Desktop', '/Downloads'];
    
    rootDirs.forEach(dir => {
        const item = document.createElement('div');
        item.className = `file-tree-item ${currentPath === dir ? 'selected' : ''}`;
        item.textContent = dir === '/' ? 'Racine' : dir.substring(1);
        item.onclick = () => navigateToPath(dir);
        fileTree.appendChild(item);
    });
    
    // Add user directory if logged in
    if (virtualOS.currentUser) {
        const userDir = `/Users/${virtualOS.currentUser}`;
        const item = document.createElement('div');
        item.className = `file-tree-item ${currentPath === userDir ? 'selected' : ''}`;
        item.textContent = `👤 ${virtualOS.currentUser}`;
        item.onclick = () => navigateToPath(userDir);
        fileTree.appendChild(item);
    }
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;
    
    const contents = virtualOS.fileSystem.getDirectoryContents(currentPath);
    
    fileList.innerHTML = '<div class="file-grid" id="fileGrid"></div>';
    const fileGrid = document.getElementById('fileGrid');
    
    contents.forEach(item => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        let icon = '📁';
        if (item.type === 'file') {
            const ext = item.extension;
            if (ext === 'txt') icon = '📝';
            else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) icon = '🖼️';
            else if (['mp3', 'wav', 'ogg'].includes(ext)) icon = '🎵';
            else if (['mp4', 'avi', 'mov'].includes(ext)) icon = '🎬';
            else icon = '📄';
        }
        
        fileItem.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-name">${item.name}</div>
        `;
        
        if (item.type === 'directory') {
            fileItem.ondblclick = () => navigateToPath(item.path);
        } else {
            fileItem.ondblclick = () => openFileFromManager(item.path);
        }
        
        fileItem.oncontextmenu = (e) => showFileContextMenu(e, item);
        
        fileGrid.appendChild(fileItem);
    });
    
    // Add empty state if no contents
    if (contents.length === 0) {
        fileGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 40px;">Ce dossier est vide</div>';
    }
}

function updatePathDisplay() {
    const pathInput = document.getElementById('currentPath');
    if (pathInput) {
        pathInput.value = currentPath;
    }
}

function navigateToPath(path) {
    if (path !== currentPath) {
        currentPath = path;
        
        // Update history
        if (fileManagerHistoryIndex < fileManagerHistory.length - 1) {
            fileManagerHistory = fileManagerHistory.slice(0, fileManagerHistoryIndex + 1);
        }
        fileManagerHistory.push(path);
        fileManagerHistoryIndex = fileManagerHistory.length - 1;
        
        updateFileTree();
        updateFileList();
        updatePathDisplay();
    }
}

function navigateBack() {
    if (fileManagerHistoryIndex > 0) {
        fileManagerHistoryIndex--;
        currentPath = fileManagerHistory[fileManagerHistoryIndex];
        updateFileTree();
        updateFileList();
        updatePathDisplay();
    }
}

function navigateUp() {
    if (currentPath !== '/') {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
        navigateToPath(parentPath);
    }
}

function refreshFileManager() {
    updateFileTree();
    updateFileList();
    showNotification('Gestionnaire de fichiers actualisé');
}

function importFileToManager() {
    document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = async (event) => {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            try {
                const importPath = `${currentPath}/${file.name}`;
                await virtualOS.fileSystem.importFile(file);
                showNotification(`Fichier "${file.name}" importé`);
            } catch (error) {
                showNotification(`Erreur lors de l'import de "${file.name}"`, 'error');
            }
        }
        
        updateFileList();
        event.target.value = '';
    };
}

function createNewFolderInManager() {
    const folderName = prompt('Nom du nouveau dossier:');
    if (folderName && folderName.trim()) {
        const newPath = `${currentPath}/${folderName.trim()}`;
        virtualOS.fileSystem.createDirectory(newPath);
        updateFileList();
        showNotification(`Dossier "${folderName.trim()}" créé`);
    }
}

function openFileFromManager(filePath) {
    const file = virtualOS.fileSystem.getFile(filePath);
    if (file) {
        const extension = filePath.split('.').pop().toLowerCase();
        
        if (extension === 'txt') {
            openNotepad(filePath, file.content);
        } else {
            // Show file properties
            showFileProperties(filePath, file);
        }
    }
}

function showFileProperties(filePath, file) {
    const propertiesContent = `
        <div class="admin-form">
            <h3>Propriétés du fichier</h3>
            <div style="margin: 20px 0;">
                <label>Nom:</label>
                <input type="text" value="${filePath.split('/').pop()}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Chemin complet:</label>
                <input type="text" value="${filePath}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Taille:</label>
                <input type="text" value="${file.size} octets" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Type:</label>
                <input type="text" value="${getFileType(filePath)}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Créé le:</label>
                <input type="text" value="${file.created.toLocaleString('fr-FR')}" readonly style="background: #f5f5f5;">
            </div>
            <div style="margin: 20px 0;">
                <label>Modifié le:</label>
                <input type="text" value="${file.modified.toLocaleString('fr-FR')}" readonly style="background: #f5f5f5;">
            </div>
            ${file.content.length < 1000 ? `
            <div style="margin: 20px 0;">
                <label>Aperçu du contenu:</label>
                <textarea readonly style="width: 100%; height: 100px; background: #f5f5f5; font-family: 'Courier New', monospace; font-size: 12px;">${file.content}</textarea>
            </div>
            ` : ''}
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="editFileContent('${filePath}')" style="background: #667eea; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                    Éditer
                </button>
                <button onclick="deleteFileConfirm('${filePath}')" style="background: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                    Supprimer
                </button>
            </div>
        </div>
    `;
    
    virtualOS.createWindow(`properties-${Date.now()}`, '📄 Propriétés', propertiesContent);
}

function getFileType(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    const types = {
        'txt': 'Fichier texte',
        'jpg': 'Image JPEG',
        'jpeg': 'Image JPEG',
        'png': 'Image PNG',
        'gif': 'Image GIF',
        'mp3': 'Fichier audio MP3',
        'wav': 'Fichier audio WAV',
        'mp4': 'Vidéo MP4',
        'avi': 'Vidéo AVI',
        'pdf': 'Document PDF',
        'doc': 'Document Word',
        'docx': 'Document Word',
        'zip': 'Archive ZIP'
    };
    
    return types[extension] || 'Fichier';
}

function editFileContent(filePath) {
    const file = virtualOS.fileSystem.getFile(filePath);
    if (file) {
        openNotepad(filePath, file.content);
    }
}

function deleteFileConfirm(filePath) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${filePath.split('/').pop()}" ?`)) {
        virtualOS.fileSystem.deleteFile(filePath);
        updateFileList();
        showNotification('Fichier supprimé');
        
        // Close properties window
        const activeWindow = virtualOS.activeWindow;
        if (activeWindow && activeWindow.startsWith('properties')) {
            virtualOS.closeWindow(activeWindow);
        }
    }
}

function showFileContextMenu(event, item) {
    event.preventDefault();
    event.stopPropagation();
    
    // Create context menu for files
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.display = 'block';
    
    const actions = [];
    
    if (item.type === 'file') {
        actions.push(
            { text: '📖 Ouvrir', action: () => openFileFromManager(item.path) },
            { text: '✏️ Éditer', action: () => editFileContent(item.path) },
            { text: '📋 Propriétés', action: () => showFileProperties(item.path, virtualOS.fileSystem.getFile(item.path)) },
            { text: '🗑️ Supprimer', action: () => deleteFileConfirm(item.path) }
        );
    } else {
        actions.push(
            { text: '📂 Ouvrir', action: () => navigateToPath(item.path) },
            { text: '🗑️ Supprimer', action: () => deleteFolderConfirm(item.path) }
        );
    }
    
    actions.forEach(action => {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-item';
        menuItem.textContent = action.text;
        menuItem.onclick = () => {
            action.action();
            contextMenu.remove();
        };
        contextMenu.appendChild(menuItem);
    });
    
    document.body.appendChild(contextMenu);
    
    // Remove context menu when clicking elsewhere
    setTimeout(() => {
        const removeMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.remove();
                document.removeEventListener('click', removeMenu);
            }
        };
        document.addEventListener('click', removeMenu);
    }, 100);
}

function deleteFolderConfirm(folderPath) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${folderPath.split('/').pop()}" et tout son contenu ?`)) {
        virtualOS.fileSystem.deleteDirectory(folderPath);
        updateFileList();
        showNotification('Dossier supprimé');
    }
}