// Fonction pour récupérer les données (utilisation du LocalStorage)
function getMemoData() {
    return JSON.parse(localStorage.getItem('memoData')) || { folders: [] };
}

// Fonction pour enregistrer les données dans LocalStorage
function setMemoData(data) {
    localStorage.setItem('memoData', JSON.stringify(data));
}

// Fonction pour ouvrir/fermer le menu
document.getElementById("menuToggle").onclick = function() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("main-content");
    const menuIcon = document.getElementById("menuToggle");

    sidebar.classList.toggle("open");
    menuIcon.classList.toggle("open");
    content.classList.toggle("shift"); // Déplace le contenu avec le menu
};

// Fonction pour ajouter un dossier
function addFolder() {
    const data = getMemoData();
    const newFolder = {
        id: Date.now(),
        name: 'Nouveau Dossier',
        subfolders: [],
        notes: []
    };
    data.folders.push(newFolder);
    setMemoData(data);
    renderFolderList();
}

// Fonction pour afficher la liste des dossiers
function renderFolderList() {
    const data = getMemoData();
    const folderList = document.getElementById('folder-list');
    folderList.innerHTML = '';  // Réinitialiser la liste

    data.folders.forEach(folder => {
        const folderItem = document.createElement('li');
        folderItem.textContent = folder.name;
        folderItem.onclick = () => selectFolder(folder.id);
        folderList.appendChild(folderItem);
    });
}

// Fonction pour sélectionner un dossier et afficher son contenu
function selectFolder(folderId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    
    // Mettre à jour le titre du dossier sélectionné
    document.getElementById('folder-name').textContent = folder.name;

    // Réinitialiser les listes de sous-dossiers et de notes
    renderSubfolderList(folderId);
    renderNoteList(folderId);

    // Afficher le bouton de suppression du dossier
    document.getElementById('delete-folder-btn').onclick = () => deleteFolder(folderId);
}

// Fonction pour supprimer un dossier
function deleteFolder(folderId) {
    const data = getMemoData();
    const folderIndex = data.folders.findIndex(f => f.id === folderId);
    data.folders.splice(folderIndex, 1);
    setMemoData(data);
    renderFolderList();
    resetMainContent();
}

// Fonction pour ajouter un sous-dossier
function addSubfolder() {
    const folderId = getSelectedFolderId();
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    const newSubfolder = {
        id: Date.now(),
        name: 'new Sous-dossier',
        notes: []
    };
    folder.subfolders.push(newSubfolder);
    setMemoData(data);
    renderSubfolderList(folderId);
}

// Fonction pour afficher la liste des sous-dossiers
function renderSubfolderList(folderId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    const subfolderList = document.getElementById('subfolder-list');
    subfolderList.innerHTML = '';

    folder.subfolders.forEach(subfolder => {
        const subfolderItem = document.createElement('li');
        subfolderItem.innerHTML = `
            ${subfolder.name} 
            <button onclick="editSubfolder(${folderId}, ${subfolder.id})">Modifier</button>
            <button onclick="deleteSubfolder(${folderId}, ${subfolder.id})">Supprimer</button>
        `;
        subfolderList.appendChild(subfolderItem);
    });
}

// Fonction pour supprimer un sous-dossier
function deleteSubfolder(folderId, subfolderId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    folder.subfolders = folder.subfolders.filter(s => s.id !== subfolderId);
    setMemoData(data);
    renderSubfolderList(folderId);
}

// Fonction pour modifier un sous-dossier
function editSubfolder(folderId, subfolderId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    const subfolder = folder.subfolders.find(s => s.id === subfolderId);
    const newName = prompt('Modifier le nom du sous-dossier:', subfolder.name);
    if (newName) {
        subfolder.name = newName;
        setMemoData(data);
        renderSubfolderList(folderId);
    }
}

// Fonction pour ajouter une note
function addNote() {
    const folderId = getSelectedFolderId();
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    const newNote = {
        id: Date.now(),
        content: 'Nouvelle Note'
    };
    folder.notes.push(newNote);
    setMemoData(data);
    renderNoteList(folderId);
}

// Fonction pour afficher la liste des notes
function renderNoteList(folderId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';

    folder.notes.forEach(note => {
        const noteItem = document.createElement('li');
        noteItem.innerHTML = `
            ${note.content} 
            <button onclick="editNoteContent(${folderId}, ${note.id})">Modifier</button>
            <button onclick="deleteNote(${folderId}, ${note.id})">Supprimer</button>
        `;
        noteList.appendChild(noteItem);
    });
}

// Fonction pour supprimer une note
function deleteNote(folderId, noteId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    folder.notes = folder.notes.filter(n => n.id !== noteId);
    setMemoData(data);
    renderNoteList(folderId);
}

// Fonction pour modifier une note
function editNoteContent(folderId, noteId) {
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);
    const note = folder.notes.find(n => n.id === noteId);
    const newContent = prompt('Modifier la note:', note.content);
    if (newContent) {
        note.content = newContent;
        setMemoData(data);
        renderNoteList(folderId);
    }
}

// Fonction pour obtenir l'ID du dossier sélectionné
function getSelectedFolderId() {
    const folderName = document.getElementById('folder-name').textContent;
    const data = getMemoData();
    const folder = data.folders.find(f => f.name === folderName);
    return folder.id;
}

// Fonction pour réinitialiser le contenu principal
function resetMainContent() {
    document.getElementById('folder-name').textContent = '';
    document.getElementById('subfolder-list').innerHTML = '';
    document.getElementById('note-list').innerHTML = '';
}

// Initialiser l'application
document.getElementById('add-folder-btn').onclick = addFolder;
document.getElementById('add-subfolder-btn').onclick = addSubfolder;
document.getElementById('add-note-btn').onclick = addNote;

document.addEventListener('DOMContentLoaded', () => {
    renderFolderList();
});

// Fonction pour modifier le nom du dossier
function editFolderName() {
    const folderId = getSelectedFolderId();
    const data = getMemoData();
    const folder = data.folders.find(f => f.id === folderId);

    // Demander un nouveau nom via une fenêtre prompt
    const newName = prompt('Modifier le nom du dossier:', folder.name);
    if (newName && newName.trim() !== '') {
        folder.name = newName.trim();
        setMemoData(data);
        document.getElementById('folder-name').textContent = folder.name;
        renderFolderList(); // Pour mettre à jour la liste des dossiers dans la barre latérale
    }
}

// Lier l'événement au bouton "Modifier le Nom"
document.getElementById('edit-folder-name-btn').onclick = editFolderName;
