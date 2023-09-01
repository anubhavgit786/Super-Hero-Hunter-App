const mainElement = document.getElementById("heroAbout"); 


function getHero()
{
    return JSON.parse(localStorage.getItem('heroInfo'));
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

function closeModal(id) 
{
    var modalEl = document.getElementById(id);
    setTimeout(() => {
      var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
    }, 3000);
}

function checkPresentInFavorites(id)
{
    let favoriteSuperHeros = JSON.parse(localStorage.getItem('favoriteSuperHeros')) || [];
    return favoriteSuperHeros.some(hero => hero.id === id);
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
        btn.innerHTML = `<span>Remove from Favorites</span><i class="fa-solid fa-heart-crack"></i>`;
        
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
        btn.innerHTML = `<span>Add to Favorites</span><i class="fa-solid fa-heart"></i>`;
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


function renderResults(hero)
{
    const { id, heroName, description, heroImage, numComics, numSeries, numStories } = hero;

    const modalId = getModalID(id);
    const modalBtnId = getModalBtnID(id);
    const modalTarget = getModalTarget(id);
    const modalLabel = getModalLabel(id);
    const modalTextId = getModalTextId(id);

    const isPresent = checkPresentInFavorites(id);

    mainElement.innerHTML =
    `
    <section class="heroName">
        <h1 class="display-5">${heroName}</h1>
    </section>
    <section class="heroInfo">
        <div class="card text-bg-dark">
            <img src=${heroImage} class="card-img" alt=${heroName}>
            <div class="card-img-overlay">
                <p class="card-text card-description">${description}</p>
                <div class="card-info">
                    <p class="card-text"><span>Comics: ${numComics}</span></p>
                    <p class="card-text"><span>Stories: ${numStories}</span></p>
                    <p class="card-text"><span>Series: ${numSeries}</span></p>
                </div>
                <button type="button" id=${modalBtnId} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target=${modalTarget}>${!isPresent ? `<span>Add to Favorites</span><i class="fa-solid fa-heart"></i>` : `<span>Remove from Favorites</span> <i class="fa-solid fa-heart-crack"></i>` }</button> 
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
    </section>
    `;

    addOrRemoveEventListener(modalBtnId, modalId, hero, modalTextId);
}


document.addEventListener("DOMContentLoaded", function() 
{
    const hero = getHero();
    renderResults(hero);
});