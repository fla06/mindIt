document.addEventListener('DOMContentLoaded', () => {
    const createFolderBtn = document.getElementById('createFolderBtn');
    const foldersContainer = document.getElementById('folders');
    const folderTemplate = document.getElementById('folderTemplate');

    // Chargement des dossiers depuis le stockage local
    loadFolders();

    // Créer un dossier
    createFolderBtn.addEventListener('click', () => {
        const folderElement = folderTemplate.content.cloneNode(true);
        const folderName = folderElement.querySelector('h3');
        const addNoteBtn = folderElement.querySelector('.addNoteBtn');
        const addSubFolderBtn = folderElement.querySelector('.addSubFolderBtn');
        const notesContainer = folderElement.querySelector('.notes');
        const subFoldersContainer = folderElement.querySelector('.subFolders');

        // Ajouter une note
        addNoteBtn.addEventListener('click', () => {
            const note = document.createElement('div');
            note.classList.add('note');
            note.innerHTML = `<input type="text" placeholder="Écrire une note..." />`;
            notesContainer.appendChild(note);
            saveFolders();
        });

        // Ajouter un sous-dossier
        addSubFolderBtn.addEventListener('click', () => {
            const subFolderElement = folderTemplate.content.cloneNode(true);
            const subFolderName = subFolderElement.querySelector('h3');
            const addSubNoteBtn = subFolderElement.querySelector('.addNoteBtn');
            const subFolderNotesContainer = subFolderElement.querySelector('.notes');

            // Ajouter une note au sous-dossier
            addSubNoteBtn.addEventListener('click', () => {
                const note = document.createElement('div');
                note.classList.add('note');
                note.innerHTML = `<input type="text" placeholder="Écrire une note..." />`;
                subFolderNotesContainer.appendChild(note);
                saveFolders();
            });

            subFoldersContainer.appendChild(subFolderElement);
            saveFolders();
        });

        // Ajouter le dossier à l'interface
        foldersContainer.appendChild(folderElement);
        saveFolders();
    });

    // Sauvegarder les dossiers et notes dans localStorage
    function saveFolders() {
        const folders = [];
        const folderElements = document.querySelectorAll('.folder');

        folderElements.forEach(folderElement => {
            const folder = {
                name: folderElement.querySelector('h3').innerText,
                notes: [],
                subFolders: []
            };

            const noteElements = folderElement.querySelectorAll('.note input');
            noteElements.forEach(note => {
                folder.notes.push(note.value);
            });

            const subFolderElements = folderElement.querySelectorAll('.subFolders .folder');
            subFolderElements.forEach(subFolderElement => {
                const subFolder = {
                    name: subFolderElement.querySelector('h3').innerText,
                    notes: []
                };

                const subNoteElements = subFolderElement.querySelectorAll('.note input');
                subNoteElements.forEach(note => {
                    subFolder.notes.push(note.value);
                });

                folder.subFolders.push(subFolder);
            });

            folders.push(folder);
        });

        localStorage.setItem('folders', JSON.stringify(folders));
    }

    // Charger les dossiers depuis le localStorage
    function loadFolders() {
        const savedFolders = JSON.parse(localStorage.getItem('folders')) || [];
        savedFolders.forEach(folder => {
            const folderElement = folderTemplate.content.cloneNode(true);
            const folderName = folderElement.querySelector('h3');
            folderName.innerText = folder.name;
            const addNoteBtn = folderElement.querySelector('.addNoteBtn');
            const addSubFolderBtn = folderElement.querySelector('.addSubFolderBtn');
            const notesContainer = folderElement.querySelector('.notes');
            const subFoldersContainer = folderElement.querySelector('.subFolders');

            // Charger les notes du dossier
            folder.notes.forEach(noteText => {
                const note = document.createElement('div');
                note.classList.add('note');
                note.innerHTML = `<input type="text" value="${noteText}" />`;
                notesContainer.appendChild(note);
            });

            // Charger les sous-dossiers
            folder.subFolders.forEach(subFolder => {
                const subFolderElement = folderTemplate.content.cloneNode(true);
                const subFolderName = subFolderElement.querySelector('h3');
                subFolderName.innerText = subFolder.name;
                const addSubNoteBtn = subFolderElement.querySelector('.addNoteBtn');
                const subFolderNotesContainer = subFolderElement.querySelector('.notes');

                subFolder.notes.forEach(noteText => {
                    const note = document.createElement('div');
                    note.classList.add('note');
                    note.innerHTML = `<input type="text" value="${noteText}" />`;
                    subFolderNotesContainer.appendChild(note);
                });

                subFoldersContainer.appendChild(subFolderElement);
            });

            // Ajouter le dossier à l'interface
            foldersContainer.appendChild(folderElement);
        });
    }
});

