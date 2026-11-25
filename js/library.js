const list = document.querySelector('#collection-list');
const dialog = document.querySelector('#collection-dialog');
const form = document.querySelector('#collection-form');
const formTitle = form.querySelector('h2');
const nameInput = document.querySelector('#collection-name');
const typeInput = document.querySelector('#collection-type');
const descriptionInput = document.querySelector('#collection-description');

let collections = getCollections();
let editingId = null; // null = creating, a number = editing that collection

function renderCollections() {
    list.innerHTML = '';

    collections.forEach(collection => {
        const item = document.createElement('li');
        item.classList.add('collection-card');

        const title = document.createElement('h2');
        title.textContent = collection.name;
        
        const type = document.createElement('span');
        type.classList.add('collection-type');
        type.textContent = `Type: ${collection.type || 'Custom'}`;

        const description = document.createElement('p');
        description.textContent = collection.description || 'No description';

        const actions = document.createElement('div');
        actions.classList.add('card-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => openEditForm(collection));
        editBtn.classList.add('button', 'button-secondary');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteCollection(collection.id));
        deleteBtn.classList.add('button', 'button-secondary');

        actions.append(editBtn, deleteBtn);
        item.append(title, type, description, actions);
        list.appendChild(item);
    });
}

function deleteCollection(id) {
    if (!confirm('Delete this collection? This cannot be undone.')) {
        return;
    }
    collections = collections.filter(collection => collection.id !== id);
    saveCollections(collections);
    renderCollections();
}

function openEditForm(collection) {
    editingId = collection.id;
    formTitle.textContent = 'Edit collection';
    nameInput.value = collection.name;
    typeInput.value = collection.type || 'Custom';
    descriptionInput.value = collection.description || '';
    dialog.showModal();
}

function closeForm() {
    form.reset();
    editingId = null;
    dialog.close();
}

document.querySelector('#open-form').addEventListener('click', () => {
    editingId = null;
    formTitle.textContent = 'New collection';
    dialog.showModal();
});

document.querySelector('#cancel-form').addEventListener('click', closeForm);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (editingId === null) {
        collections.push({
            id: Date.now(),
            name: nameInput.value,
            type: typeInput.value,
            description: descriptionInput.value,
            games: []
        });
    } else {
        const collection = collections.find(c => c.id === editingId);
        collection.name = nameInput.value;
        collection.type = typeInput.value;
        collection.description = descriptionInput.value;
    }

    saveCollections(collections);
    renderCollections();
    closeForm();
});

renderCollections();