const mainContent = document.getElementById('searchContents');
const header = document.getElementById('header');

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

function closeModal(id) 
{
    var modalEl = document.getElementById(id);
    setTimeout(() => {
      var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
    }, 3000);
}

function getFavoriteSuperheroes() 
{
    const favoriteSuperHerosJSON = localStorage.getItem('favoriteSuperHeros'); 
    
    if (favoriteSuperHerosJSON) 
    {
        try 
        {
            const favoriteSuperHeros = JSON.parse(favoriteSuperHerosJSON); 
            return favoriteSuperHeros;
        } 
        catch (error) 
        {
            console.error('Error parsing JSON:', error);
        }
    }
    
    return []; 
}

function updateHeader(text)
{
    header.innerHTML = text;
}

function setHeader()
{
    //Favorite Super Heros
    const favoriteSuperHeros = getFavoriteSuperheroes();
    if(favoriteSuperHeros.length === 0)
    {
        updateHeader("You have no Favorites yet");
        return;
    }
    
    updateHeader("Favorite Super Heros");
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

function removeFromFavoritesEventListener(btnId, modalId, hero)
{
    const btn = document.getElementById(btnId);
    
    function handleClick()
    {
        removeFromFavorites(hero.id);
        closeModal(modalId);
        const favoriteSuperHeros = getFavoriteSuperheroes();
        renderHTML(favoriteSuperHeros);
    }

    btn.addEventListener('click', handleClick);
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



function renderHTML(heros)
{
    setHeader();
    mainContent.innerHTML = ''; // Clear previous results
    heros.forEach((hero)=>
    {
        const { id, heroName, heroImage } = hero;

        const heroElement = document.createElement('div');
        heroElement.className = 'card mb-3 h-100';

        const modalId = getModalID(id);
        const modalBtnId = getModalBtnID(id);
        const modalTarget = getModalTarget(id);
        const modalLabel = getModalLabel(id);
        const modalTextId = getModalTextId(id);
        const readMoreBtnId = getReadMoreBtnID(id);

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
                    <button type="button" id=${modalBtnId} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target=${modalTarget}><i class="fa-solid fa-heart-crack"></i></button>
                    <button type="button" id=${readMoreBtnId} class="btn btn-link"><i class="fa-solid fa-arrow-up-right-from-square fa-2xl"></i></button>
                    <div class="modal fade" id=${modalId} tabindex="-1" aria-labelledby=${modalLabel} aria-hidden="true" data-bs-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content text-bg-success">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id=${modalId}><i class="fa-solid fa-circle-check" style="margin-right: 10px;"></i><span>Success</span></h1>
                                </div>
                                <div class="modal-body">
                                    <p id=${modalTextId} class="card-text">Removed from Favorites</p>
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
        removeFromFavoritesEventListener(modalBtnId, modalId, hero);
        readMoreEventListener(hero, readMoreBtnId);
    })
}

document.addEventListener("DOMContentLoaded", function() 
{
    const favoriteSuperHeros = getFavoriteSuperheroes();
    renderHTML(favoriteSuperHeros);
});
