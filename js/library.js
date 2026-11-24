const list = document.querySelector('#collection-list');
let collections = getCollections();

// Sample data so the list isn't empty while you build the page
if (collections.length === 0) {
    collections = [
        { id: 1, name: 'Currently Playing' },
        { id: 2, name: 'Pending' },
        { id: 3, name: 'Completed' }
    ];
    saveCollections(collections);
}

function renderCollections() {
    list.innerHTML = '';

    collections.forEach(collection => {
        const item = document.createElement('li');
        item.textContent = `${collection.id} - ${collection.name}`;
        list.appendChild(item);
    });
}

renderCollections();