function getCollections() {
    const data = localStorage.getItem('collections');
    return data ? JSON.parse(data) : [];
}

function saveCollections(collections) {
    localStorage.setItem('collections', JSON.stringify(collections));
}