function getCollections() {
    const data = localStorage.getItem('collections');
    const collections = data ? JSON.parse(data) : [];

    collections.forEach(collection => {
        if (!collection.games) {
            collection.games = [];
        }
    });

    return collections;
}

function saveCollections(collections) {
    localStorage.setItem('collections', JSON.stringify(collections));
}