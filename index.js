const publicApiKey = '2a02aebd75a0a41bc7b3a8894935a024';
const privateApiKey = '9a668fee946f147d5e267632470dfb2626d3d01c';
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const mainContent = document.getElementById('searchContents');
const searchInput = document.getElementById('searchInput');

function checkPresentInFavorites(id)
{
    let favoriteSuperHeros = JSON.parse(localStorage.getItem('favoriteSuperHeros')) || [];
    return favoriteSuperHeros.some(hero => hero.id === id);
}

function getHeroName(name)
{
    const separators = /[-/(]/;
    return name.split(separators)[0];
}

function getHeroImage(thumbnail)
{
    const { path, extension }  = thumbnail;
    return `${path}.${extension}`;
}

function getComics(comics)
{
    const { available } = comics;
    return available;
}

function getStories(stories)
{
    const { available } = stories;
    return available;
}

function getSeries(series)
{
    const { available } = series;
    return available;
}

function getModalID(id)
{
    return `modal-${id}`;
}

function getModalBtnID(id)
{
    return `modal-btn-${id}`;
}

function getModalTarget(id)
{
    return `#modal-${id}`;
}

function getModalLabel(id)
{
    return `modal-${id}-label`;
}

function getModalTextId(id)
{
    return  `modal-${id}-text`;
}

function getReadMoreBtnID(id)
{
    return `read-more-btn-${id}`;
}

function Hero(id, heroName, description, heroImage, numComics, numStories, numSeries)
{
    this.id = id;
    this.heroName = heroName;
    this.description = description;
    this.heroImage = heroImage;
    this.numComics = numComics;
    this.numStories = numStories;
    this.numSeries = numSeries;
}

function closeModal(id) 
{
    var modalEl = document.getElementById(id);
    setTimeout(() => {
      var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
    }, 3000);
}

function addToFavorites(hero)
{
    let favoriteSuperHeros = JSON.parse(localStorage.getItem('favoriteSuperHeros')) || [];
    favoriteSuperHeros.push(hero);
    localStorage.setItem('favoriteSuperHeros', JSON.stringify(favoriteSuperHeros));
}

function removeFromFavorites(id)
{
    let favoriteSuperHeros = JSON.parse(localStorage.getItem('favoriteSuperHeros')) || [];

    const heroIndex = favoriteSuperHeros.findIndex(hero => hero.id === id);

    if(heroIndex !== -1) 
    {
        favoriteSuperHeros.splice(heroIndex, 1);
        localStorage.setItem('favoriteSuperHeros', JSON.stringify(favoriteSuperHeros));
    }
}



function addToFavoritesEventListener(btnId, modalId, modalTextId, hero)
{
    const btn = document.getElementById(btnId);
    const modalTextEl = document.getElementById(modalTextId);
    modalTextEl.innerHTML = "Removed from Favorites";
    
    function handleClick()
    {
        btn.innerHTML = `<i class="fa-solid fa-heart-crack"></i>`;
        
        addToFavorites(hero);
        closeModal(modalId);
        btn.removeEventListener('click', handleClick);
        removeFromFavoritesEventListener(btnId, modalId, modalTextId, hero);
    }

    btn.addEventListener('click', handleClick);
}

function removeFromFavoritesEventListener(btnId, modalId, modalTextId, hero)
{
    const btn = document.getElementById(btnId);
    const modalTextEl = document.getElementById(modalTextId);
    modalTextEl.innerHTML = "Added to Favorites";
    
    function handleClick()
    {
        btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        removeFromFavorites(hero.id);
        closeModal(modalId);

        btn.removeEventListener('click', handleClick);

        addToFavoritesEventListener(btnId, modalId, modalTextId, hero);
    }

    btn.addEventListener('click', handleClick);
}

function addOrRemoveEventListener(btnId, modalId, hero, modalTextId)
{
    const isPresent = checkPresentInFavorites(hero.id);

    if(isPresent) 
    {
        removeFromFavoritesEventListener(btnId, modalId, modalTextId, hero);
        return;
    }

    addToFavoritesEventListener(btnId, modalId, modalTextId, hero);
}

function readMoreEventListener(hero, btnId)
{
    const btn = document.getElementById(btnId);
    btn.addEventListener("click", () =>
    {
        localStorage.setItem("heroInfo", JSON.stringify(hero));
        window.location.assign('./about.html');
    })
}




// Fetch and display superheroes
async function fetchSuperheroes(query) 
{
    try 
    {
        if (query.length === 0)
        {
            mainContent.innerHTML = ''; // Clear previous results
            return;
        }
        const timeStamp = new Date().getTime();
        const hash = CryptoJS.MD5(`${timeStamp}${privateApiKey}${publicApiKey}`);
        const url = `${baseUrl}?ts=${timeStamp}&apikey=${publicApiKey}&hash=${hash}&nameStartsWith=${query}`;
    
        const response = await fetch(url);
        const data = await response.json();
        const superheroes = data.data.results;     

        mainContent.innerHTML = ''; // Clear previous results
        superheroes.forEach(superhero => 
        {
            const {id, name, thumbnail, comics, series, stories, description } = superhero;

            const heroElement = document.createElement('div');
            heroElement.className = 'card mb-3 h-100';

            const heroName = getHeroName(name);
            const heroImage = getHeroImage(thumbnail);
            const numComics = getComics(comics);
            const numStories = getStories(stories);
            const numSeries = getSeries(series);
            
            const hero = new Hero(id, heroName, description, heroImage, numComics, numStories, numSeries);


            const modalId = getModalID(id);
            const modalBtnId = getModalBtnID(id);
            const modalTarget = getModalTarget(id);
            const modalLabel = getModalLabel(id);
            const modalTextId = getModalTextId(id);
            const readMoreBtnId = getReadMoreBtnID(id);

            const isPresent = checkPresentInFavorites(id);

            heroElement.innerHTML = 
            `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src=${heroImage} class="img-fluid rounded-start" alt=${heroName}>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${heroName}</h5>
                        <div class="card-btns">
                            <button type="button" id=${modalBtnId} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target=${modalTarget}>${!isPresent ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-solid fa-heart-crack"></i>` }</button>
                            <button type="button" id=${readMoreBtnId} class="btn btn-link"><i class="fa-solid fa-arrow-up-right-from-square fa-2xl"></i></button>
                            <div class="modal fade" id=${modalId} tabindex="-1" aria-labelledby=${modalLabel} aria-hidden="true" data-bs-backdrop="static">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content text-bg-success">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id=${modalId}><i class="fa-solid fa-circle-check"></i><span>Success</span></h1>
                                        </div>
                                        <div class="modal-body">
                                            <p id=${modalTextId} class="card-text">${ !isPresent ? "Added to Favorites" : "Removed from Favorites" }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            mainContent.appendChild(heroElement);
            addOrRemoveEventListener(modalBtnId, modalId, hero, modalTextId);
            readMoreEventListener(hero, readMoreBtnId);
        })
             
    } 
    catch (error) 
    {
        console.log(error.message);
    }

}


// Initialize

searchInput.addEventListener('input', event => 
{
    const query = event.target.value;
    fetchSuperheroes(query);
});



fetchSuperheroes("Iron Man");