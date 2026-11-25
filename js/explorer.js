const grid = document.querySelector('#game-grid');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const genreFilter = document.querySelector('#genre-filter');
const platformFilter = document.querySelector('#platform-filter');
const loadMoreBtn = document.querySelector('#load-more');
let currentPage = 1;

async function fetchFromRawg(endpoint, params = {}) {
    const query = new URLSearchParams({ key: RAWG_KEY, ...params });
    const response = await fetch(`https://api.rawg.io/api/${endpoint}?${query}`);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
}

async function loadFilters() {
    try {
        const genres = await fetchFromRawg('genres');
        genres.results.forEach(genre => {
            genreFilter.add(new Option(genre.name, genre.slug));
        });

        const platforms = await fetchFromRawg('platforms', { page_size: 50 });
        platforms.results.forEach(platform => {
            platformFilter.add(new Option(platform.name, platform.id));
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadGames(append = false) {
    currentPage = append ? currentPage + 1 : 1;

    const params = { page_size: 20, page: currentPage };
    if (searchInput.value.trim()) params.search = searchInput.value.trim();
    if (genreFilter.value) params.genres = genreFilter.value;
    if (platformFilter.value) params.platforms = platformFilter.value;

    if (append) {
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
    } else {
        grid.textContent = 'Loading games...';
        loadMoreBtn.hidden = true;
    }

    try {
        const data = await fetchFromRawg('games', params);

        if (!append && data.results.length === 0) {
            grid.textContent = 'No games found. Try a different search.';
            return;
        }

        renderGames(data.results, append);
        loadMoreBtn.hidden = !data.next;
    } catch (error) {
        console.error(error);
        if (!append) {
            grid.textContent = 'Could not load games. Please try again later.';
        }
    } finally {
        loadMoreBtn.textContent = 'Load more';
        loadMoreBtn.disabled = false;
    }
}

function renderGames(games, append = false) {
    if (!append) {
        grid.innerHTML = '';
    }
    
    games.forEach(game => {
        const card = document.createElement('article');
        card.classList.add('game-card');
        
        const img = document.createElement('img');
        img.src = game.background_image || 'assets/img/no-cover.jpg';
        img.alt = `Cover of ${game.name}`;
        
        const title = document.createElement('h2');
        title.textContent = game.name;
        
        const genres = document.createElement('p');
        genres.classList.add('game-genres');
        genres.textContent = game.genres.map(genre => genre.name).join(', ');
        
        const rating = document.createElement('p');
        rating.classList.add('game-rating');
        rating.textContent = `★ ${game.rating} / 5`;
        
        const addBtn = document.createElement('button');
        addBtn.classList.add('button');
        addBtn.textContent = 'Add to collection';
        
        card.append(img, title, genres, rating, addBtn);
        grid.appendChild(card);
    });
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loadGames();
});

loadMoreBtn.addEventListener('click', () => loadGames(true));

loadFilters();
loadGames();