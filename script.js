console.log("JS loaded!");

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const recipesDiv = document.getElementById('recipes');
const favoritesDiv = document.getElementById('favorites');
const categoryButtons = document.querySelectorAll('.category-filters button');

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
displayFavorites();

async function fetchRecipes(query){
    try{
        const res = await fetch(API_URL + query);
        const data = await res.json();
        if(data.meals) displayRecipes(data.meals);
        else recipesDiv.innerHTML = "<p style='text-align:center;'>No recipes found.</p>";
    }catch(e){
        recipesDiv.innerHTML = "<p style='text-align:center;'>Error fetching recipes.</p>";
        console.error(e);
    }
}

function displayRecipes(recipes){
    recipesDiv.innerHTML = recipes.map(r=>`
        <div class="recipe-card">
            <img src="${r.strMealThumb}" alt="${r.strMeal}">
            <div class="card-content">
                <h3>${r.strMeal}</h3>
                <button onclick="addToFavorites('${r.idMeal}','${r.strMeal}','${r.strMealThumb}')">❤ Add to Favorites</button>
            </div>
        </div>
    `).join('');
}

function addToFavorites(id,name,thumb){
    if(!favorites.find(f=>f.id===id)){
        favorites.push({id,name,thumb});
        localStorage.setItem("favorites",JSON.stringify(favorites));
        displayFavorites();
    }
}

function displayFavorites(){
    if(favorites.length===0){
        favoritesDiv.innerHTML="<p style='text-align:center;'>No favorites yet.</p>";
        return;
    }
    favoritesDiv.innerHTML=favorites.map(f=>`
        <div class="recipe-card">
            <img src="${f.thumb}" alt="${f.name}">
            <div class="card-content">
                <h3>${f.name}</h3>
                <button onclick="removeFavorite('${f.id}')">❌ Remove</button>
            </div>
        </div>
    `).join('');
}

function removeFavorite(id){
    favorites=favorites.filter(f=>f.id!==id);
    localStorage.setItem("favorites",JSON.stringify(favorites));
    displayFavorites();
}

searchBtn.addEventListener('click',()=>{const q=searchInput.value.trim();if(q)fetchRecipes(q);});
categoryButtons.forEach(b=>b.addEventListener('click',()=>fetchRecipes(b.dataset.category)));
const darkModeBtn = document.getElementById('dark-mode-btn');
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});