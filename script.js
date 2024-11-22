// Structure initiale pour localStorage
const initialData = {
    folders: [
        {
            id: 1,
            name: "Dossier 1",
            notes: [
                { id: 1, content: "Note 1 dans Dossier 1" },
                { id: 2, content: "Note 2 dans Dossier 1" }
            ],
            subfolders: []
        }
    ]
};

// Initialiser les données dans localStorage si ce n'est pas déjà fait
if (!localStorage.getItem('memoData')) {
    localStorage.setItem('memoData', JSON.stringify(initialData));
}

// Fonction pour récupérer les données de localStorage
function getMemoData() {
    return JSON.parse(localStorage.getItem('memoData'));
}

// Fonction pour mettre à jour les données dans localStorage
function setMemoData(data) {
    localStorage.setItem('memoData', JSON.stringify(data));
}

// Ajouter un dossier
function addFolder(parentId = null) {
    const data = getMemoData();
    const newFolder = {
        id: Date.now(),  // Utilisation de Date.now() comme identifiant unique
        name: `Nouveau Dossier`,
        notes: [],
        subfolders: []
    };

    if (parentId === null) {
        data.folders.push(newFolder);
    } else {
        const parentFolder = findFolderById(data.folders, parentId);
        parentFolder.subfolders.push(newFolder);
    }

    setMemoData(data);
    renderFolders();
}

// Ajouter une note dans un dossier
function addNote(folderId) {
    const data = getMemoData();
    const folder = findFolderById(data.folders, folderId);
    const newNote = {
        id: Date.now(),
        content: `Nouvelle Note dans ${folder.name}`
    };
    folder.notes.push(newNote);
    setMemoData(data);
    renderFolders();
}

// Supprimer un dossier
function deleteFolder(folderId) {
    const data = getMemoData();
    data.folders = deleteFolderRecursive(data.folders, folderId);
    setMemoData(data);
    renderFolders();
}

// Fonction récursive pour supprimer un dossier dans la hiérarchie
function deleteFolderRecursive(folders, folderId) {
    return folders.filter(folder => {
        if (folder.id === folderId) {
            return false;
        }
        folder.subfolders = deleteFolderRecursive(folder.subfolders, folderId);
        return true;
    });
}

// Supprimer une note
function deleteNote(folderId, noteId) {
    const data = getMemoData();
    const folder = findFolderById(data.folders, folderId);
    folder.notes = folder.notes.filter(note => note.id !== noteId);
    setMemoData(data);
    renderFolders();
}

// Trouver un dossier par son ID
function findFolderById(folders, folderId) {
    for (let folder of folders) {
        if (folder.id === folderId) {
            return folder;
        }
        const subfolder = findFolderById(folder.subfolders, folderId);
        if (subfolder) return subfolder;
    }
    return null;
}

// Fonction pour afficher les dossiers et notes
function renderFolders() {
    const data = getMemoData();
    const container = document.getElementById('folder-container');
    container.innerHTML = ''; // Effacer l'ancien contenu

    // Fonction récursive pour afficher les dossiers et sous-dossiers
    function renderFolder(folder) {
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder');
        
        // Affichage du nom du dossier avec bouton "Modifier"
        const folderNameHtml = `
            <span class="folder-name" id="folder-name-${folder.id}">
                ${folder.name}
            </span>
            <button onclick="editFolderName(${folder.id})">Modifier</button>
            <button class="delete" onclick="deleteFolder(${folder.id})">Supprimer</button>
        `;
        
        folderElement.innerHTML = `
            <h3>
                ${folderNameHtml}
            </h3>
            <ul class="notes" id="folder-${folder.id}">
                ${folder.notes.map(note => `
                    <li id="note-${note.id}">
                        <span class="note-content" id="note-content-${note.id}">
                            ${note.content}
                        </span>
                        <button onclick="editNoteContent(${folder.id}, ${note.id})">Modifier</button>
                        <button onclick="deleteNote(${folder.id}, ${note.id})">Supprimer</button>
                    </li>`).join('')}
            </ul>
            <button class="add-note" onclick="addNote(${folder.id})">Ajouter une Note</button>
            <button onclick="addFolder(${folder.id})">Ajouter un Sous-dossier</button>
            <div class="subfolders">
                ${folder.subfolders.map(subfolder => renderFolder(subfolder)).join('')}
            </div>
        `;
        return folderElement.outerHTML;
    }

    data.folders.forEach(folder => {
        container.innerHTML += renderFolder(folder);
    });
}

// Fonction pour afficher un champ de texte pour éditer le nom du dossier
function editFolderName(folderId) {
    const folder = findFolderById(getMemoData().folders, folderId);
    const folderElement = document.getElementById(`folder-name-${folderId}`);
    folderElement.innerHTML = `
        <input type="text" id="edit-folder-name" value="${folder.name}" />
        <button onclick="saveFolderName(${folderId})">Sauvegarder</button>
        <button onclick="cancelEditFolderName(${folderId})">Annuler</button>
    `;
}

// Fonction pour sauvegarder le nouveau nom du dossier
function saveFolderName(folderId) {
    const newName = document.getElementById('edit-folder-name').value;
    const data = getMemoData();
    const folder = findFolderById(data.folders, folderId);
    folder.name = newName;
    setMemoData(data);
    renderFolders();
}

// Annuler l'édition du nom du dossier
function cancelEditFolderName(folderId) {
    renderFolders(); // Restaure la vue sans modifications
}

// Fonction pour afficher un champ de texte pour éditer le contenu de la note
function editNoteContent(folderId, noteId) {
    const data = getMemoData();
    const folder = findFolderById(data.folders, folderId);
    const note = folder.notes.find(note => note.id === noteId);
    
    const noteElement = document.getElementById(`note-content-${noteId}`);
    noteElement.innerHTML = `
        <input id="edit-note-content" placeholder="${note.content}"></input>
        <button onclick="saveNoteContent(${folderId}, ${noteId})">Sauvegarder</button>
        <button onclick="cancelEditNoteContent(${folderId}, ${noteId})">Annuler</button>
    `;
}

// Sauvegarder le contenu de la note
function saveNoteContent(folderId, noteId) {
    const newContent = document.getElementById('edit-note-content').value;
    const data = getMemoData();
    const folder = findFolderById(data.folders, folderId);
    const note = folder.notes.find(note => note.id === noteId);
    note.content = newContent;
    setMemoData(data);
    renderFolders();
}

// Annuler l'édition du contenu de la note
function cancelEditNoteContent(folderId, noteId) {
    renderFolders(); // Restaure la vue sans modifications
}

// Ajouter un événement pour initialiser le rendu des dossiers
document.addEventListener('DOMContentLoaded', renderFolders);
