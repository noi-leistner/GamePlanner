const params = new URLSearchParams(window.location.search);
const collectionId = Number(params.get('id'));

const collections = getCollections();
const collection = collections.find(c => c.id === collectionId);

const nameHeading = document.querySelector('#collection-name');
const info = document.querySelector('#collection-info');
const descriptionText = document.querySelector('#collection-description');
const gameList = document.querySelector('#game-list');
const emptyMessage = document.querySelector('#empty-message');

const sessionDialog = document.querySelector('#session-dialog');
const sessionForm = document.querySelector('#session-form');
const sessionFormTitle = document.querySelector('#session-form-title');
const sessionGameName = document.querySelector('#session-game-name');
const dateInput = document.querySelector('#session-date');
const hoursInput = document.querySelector('#session-hours');
const notesInput = document.querySelector('#session-notes');

let currentGame = null;      // the game the dialog is for
let editingSessionId = null; // null = new session

function save() {
    saveCollections(collections);
}

function totalHours(game) {
    return game.sessions.reduce((sum, session) => sum + session.hours, 0);
}

function formatDate(dateText) {
    return new Date(dateText + 'T00:00').toLocaleDateString();
}

function renderHeader() {
    const allHours = collection.games.reduce((sum, game) => sum + totalHours(game), 0);

    nameHeading.textContent = collection.name;
    info.textContent = `${collection.type || 'Custom'} · ${collection.games.length} games · ${allHours} h played`;
    descriptionText.textContent = collection.description || '';
}

function renderGames() {
    gameList.innerHTML = '';
    emptyMessage.hidden = collection.games.length > 0;

    collection.games.forEach(game => {
        if (!game.sessions) {
            game.sessions = [];
        }

        const card = document.createElement('article');
        card.classList.add('game-card');

        const img = document.createElement('img');
        img.src = game.cover || 'assets/img/no-cover.jpg';
        img.alt = `Cover of ${game.name}`;

        const body = document.createElement('div');
        body.classList.add('game-card-body');

        const title = document.createElement('h2');
        title.textContent = game.name;

        const hours = document.createElement('p');
        hours.textContent = `${totalHours(game)} h played · ${game.sessions.length} sessions`;

        const sessionList = document.createElement('ul');
        sessionList.classList.add('session-list');

        game.sessions.forEach(session => {
            const item = document.createElement('li');

            const text = document.createElement('p');
            text.textContent = `${formatDate(session.date)} · ${session.hours} h`;

            const notes = document.createElement('p');
            notes.classList.add('session-notes');
            notes.textContent = session.notes;

            const editBtn = document.createElement('button');
            editBtn.classList.add('button', 'button-secondary');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openSessionDialog(game, session));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('button', 'button-secondary');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteSession(game, session.id));

            item.append(text);
            if (session.notes) {
                item.append(notes);
            }
            item.append(editBtn, deleteBtn);
            sessionList.appendChild(item);
        });

        const actions = document.createElement('div');
        actions.classList.add('card-actions');

        const logBtn = document.createElement('button');
        logBtn.classList.add('button');
        logBtn.textContent = 'Log session';
        logBtn.addEventListener('click', () => openSessionDialog(game));

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('button', 'button-secondary');
        removeBtn.textContent = 'Remove game';
        removeBtn.addEventListener('click', () => removeGame(game.id));

        actions.append(logBtn, removeBtn);
        body.append(title, hours, sessionList, actions);
        card.append(img, body);
        gameList.appendChild(card);
    });
}

function render() {
    renderHeader();
    renderGames();
}

function openSessionDialog(game, session = null) {
    currentGame = game;
    sessionGameName.textContent = game.name;

    if (session) {
        editingSessionId = session.id;
        sessionFormTitle.textContent = 'Edit session';
        dateInput.value = session.date;
        hoursInput.value = session.hours;
        notesInput.value = session.notes;
    } else {
        editingSessionId = null;
        sessionFormTitle.textContent = 'Log session';
        sessionForm.reset();
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    sessionDialog.showModal();
}

function closeSessionDialog() {
    sessionForm.reset();
    currentGame = null;
    editingSessionId = null;
    sessionDialog.close();
}

function deleteSession(game, sessionId) {
    if (!confirm('Delete this session?')) {
        return;
    }
    game.sessions = game.sessions.filter(s => s.id !== sessionId);
    save();
    render();
}

function removeGame(gameId) {
    if (!confirm('Remove this game and all its sessions from the collection?')) {
        return;
    }
    collection.games = collection.games.filter(g => g.id !== gameId);
    save();
    render();
}

if (!collection) {
    nameHeading.textContent = 'Collection not found';
    info.textContent = 'It may have been deleted.';
    document.querySelector('#add-games-link').hidden = true;
} else {
    document.querySelector('#cancel-session').addEventListener('click', closeSessionDialog);

    sessionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = {
            date: dateInput.value,
            hours: Number(hoursInput.value),
            notes: notesInput.value.trim()
        };

        if (editingSessionId === null) {
            currentGame.sessions.push({ id: Date.now(), ...data });
        } else {
            const session = currentGame.sessions.find(s => s.id === editingSessionId);
            Object.assign(session, data);
        }

        save();
        render();
        closeSessionDialog();
    });

    render();
}