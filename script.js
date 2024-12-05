let activeFolder = null; // Variable pour suivre le dossier actif
let folders = JSON.parse(localStorage.getItem('folders')) || []; // Charger les dossiers depuis localStorage

// Fonction pour ouvrir/fermer le menu
document.getElementById("menuToggle").onclick = function() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const menuIcon = document.getElementById("menuToggle");

    sidebar.classList.toggle("open");
    menuIcon.classList.toggle("open");
    content.classList.toggle("shift");
};

// Ajouter un dossier
function addFolder() {
    const newFolderName = prompt("Entrez le nom du nouveau dossier");
    if (newFolderName) {
        const newFolder = {
            name: newFolderName,
            notes: []
        };
        folders.push(newFolder);
        localStorage.setItem('folders', JSON.stringify(folders)); // Sauvegarder les dossiers
        loadFolders(); // Recharger la liste des dossiers
    }
}

// Afficher les dossiers dans le menu
function loadFolders() {
    const folderList = document.getElementById("sidebar");
    folderList.innerHTML = ''; // Vider le menu avant de le remplir

    // Ajouter les dossiers existants
    folders.forEach((folder, index) => {
        const folderElement = document.createElement("div");
        folderElement.classList.add("folder");
        folderElement.textContent = folder.name;
        folderElement.onclick = function() { showContent(index, folderElement); };
        folderList.insertBefore(folderElement, folderList.lastElementChild);
    });

    // Ajouter un bouton pour créer un dossier, à la fin du menu
    const addFolderButton = document.createElement("div");
    addFolderButton.classList.add("add-folder");
    addFolderButton.textContent = "Ajouter un dossier";
    addFolderButton.onclick = addFolder;
    folderList.appendChild(addFolderButton);
}

// Afficher le contenu du dossier
function showContent(folderIndex, folderElement) {
    activeFolder = folderIndex; // Marquer le dossier actif
    const folder = folders[folderIndex];
    const content = document.getElementById("content");
    const folderActions = document.getElementById("folderActions");
    const notesSection = document.getElementById("notesSection");
    const notesContainer = document.getElementById("notesContainer");

    content.innerHTML = `<h2> ${folder.name}</h2>`;
    content.appendChild(folderActions);
    content.appendChild(notesSection);

    // Effacer les anciennes notes
    notesContainer.innerHTML = "";

    // Créer des notes par défaut pour le dossier
    folder.notes.forEach((note, noteIndex) => {
        notesContainer.innerHTML += `
            <div class="note">
                <p>${note}</p>
                <div class="note-actions">
                    <button onclick="editNote(${noteIndex})">Modifier</button>
                    <button onclick="deleteNote(${noteIndex})">Supprimer</button>
                </div>
            </div>
        `;
    });
}

// Ajouter une note
function addNote() {
    const noteContent = prompt("Entrez le contenu de la note");
    if (noteContent) {
        folders[activeFolder].notes.push(noteContent);
        localStorage.setItem('folders', JSON.stringify(folders)); // Sauvegarder les notes
        loadFolders(); // Recharger la liste des dossiers
        showContent(activeFolder, document.querySelectorAll(".folder")[activeFolder]);
    }
}

// Modifier une note
function editNote(noteIndex) {
    const newContent = prompt("Modifiez le contenu de la note", folders[activeFolder].notes[noteIndex]);
    if (newContent) {
        folders[activeFolder].notes[noteIndex] = newContent;
        localStorage.setItem('folders', JSON.stringify(folders)); // Sauvegarder les notes modifiées
        showContent(activeFolder, document.querySelectorAll(".folder")[activeFolder]);
    }
}

// Supprimer une note
function deleteNote(noteIndex) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
        folders[activeFolder].notes.splice(noteIndex, 1);
        localStorage.setItem('folders', JSON.stringify(folders)); // Sauvegarder la suppression
        showContent(activeFolder, document.querySelectorAll(".folder")[activeFolder]);
    }
}

// Renommer un dossier
function renameFolder() {
    if (activeFolder !== null) {
        const newName = prompt("Entrez le nouveau nom du dossier", folders[activeFolder].name);
        if (newName) {
            folders[activeFolder].name = newName;
            localStorage.setItem('folders', JSON.stringify(folders)); // Sauvegarder le renommage
            loadFolders();
            showContent(activeFolder, document.querySelectorAll(".folder")[activeFolder]);
        }
    } else {
        alert("Aucun dossier sélectionné !");
    }
}

// Supprimer un dossier
function deleteFolder() {
    if (activeFolder !== null) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le dossier ${folders[activeFolder].name}?`)) {
            folders.splice(activeFolder, 1);
            localStorage.setItem('folders', JSON.stringify(folders)); // Sauvegarder la suppression
            loadFolders();
            document.getElementById("content").innerHTML = "<h2>Choisissez un dossier pour afficher son contenu</h2>";
        }
    } else {
        alert("Aucun dossier sélectionné !");
    }
}

// Charger les dossiers dès le chargement de la page
window.onload = loadFolders;
