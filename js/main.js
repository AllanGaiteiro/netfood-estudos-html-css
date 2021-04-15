
// api url exemplo
//https://api.edamam.com/search?q=chicken&app_id=${7ae6abb5}&app_key=${122888c4e396c6c0cd749ab6b8292a48}&from=0&to=3&calories=591-722&health=alcohol-free"

// variaveis
const carouselList = document.getElementById('container-carousel');
var recipesData = {};
const edamanAPI = {
    url: "https://api.edamam.com/search",
    id: "7ae6abb5",
    key: "122888c4e396c6c0cd749ab6b8292a48",
};
const arrayDiet = [
    "Balanced", "High-Protein", "Low-Carb", "Low-Fat"
];


const getReceitasForDiet = (type) => {
    if (typeof type === 'string') {
        let url = edamanAPI.url + "?q=&app_id=" + edamanAPI.id + "&app_key=" + edamanAPI.key + "&diet=" + type.toLowerCase();

        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const response = JSON.parse(xhttp.responseText);

                recipesData = {
                    ...recipesData,
                    [type.toLowerCase()]: {
                        from: +response.from || null,
                        to: +response.to || null,
                        type,
                        listRecipes: response.hits.map(h => ({
                            name: typeof h.recipe.label === 'string' ? h.recipe.label : null,
                            imageUrl: checkStatus(h.recipe.image) === 200 ? h.recipe.image : "../img/unnamed.jpg",
                            recipeSource: typeof h.recipe.url === 'string' ? h.recipe.url : null,
                            ingredient: typeof h.recipe.ingredientLines === 'string' ? h.recipe.ingredientLines : null,
                        })) || null,
                    },
                };

                if (!!recipesData[type.toLowerCase()] && recipesData[type.toLowerCase()].listRecipes !== null) {
                    console.log(recipesData)
                    creatCaroucelElements(recipesData[type.toLowerCase()]);
                }

            }
        }
        xhttp.send();
    }


}
const getAllDiets = () => {
    arrayDiet.forEach(diet => getReceitasForDiet(diet))
}
const init = () => {
    getAllDiets()
}

const creatCaroucelElements = (groupRecipes) => {

    if (carouselList) {
        var carousel = document.createElement('section');
        var carouselTitle = document.createElement('h2');

        var cardMovies = document.createElement('div');
        var boxRecipe;

        carousel.setAttribute('class', 'carousel-list');
        cardMovies.setAttribute('class', 'owl-carousel owl-theme');
        carouselTitle.setAttribute('id', groupRecipes.type);
        carouselTitle.innerText = groupRecipes.type !== "Low-Carb" ? groupRecipes.type : "Low Carbohydrat"
        carousel.appendChild(carouselTitle);

        groupRecipes.listRecipes.forEach((recipe) => {

            if (recipe.imageUrl) {
                var boxImage = document.createElement('div');
                var boxTitle = document.createElement('div');
                var saibaMais = document.createElement('button');
                boxRecipe = document.createElement('div');
                boxRecipe.setAttribute('class', 'box-recipe');
                saibaMais.setAttribute('class', 'btn-saibaMais');
                boxTitle.setAttribute('class', 'box-title');
                saibaMais.addEventListener('click', () => window.location.href = recipe.recipeSource);
                saibaMais.innerText = 'Saiba Mais';
                boxTitle.innerHTML = `<h3>${recipe.name}</h3>`;
                boxImage.className = 'box-image';
                boxImage.style.backgroundImage = "url(\'"+recipe.imageUrl+"\')";
                boxRecipe.appendChild(boxImage);
                boxRecipe.appendChild(boxTitle);
                boxRecipe.appendChild(saibaMais);
                cardMovies.appendChild(boxRecipe);
            }
        });

        carousel.appendChild(cardMovies);
        carouselList.appendChild(carousel);
    }
    createCarousel();
}

const createCarousel = () => {
    // caroucel
    $(`.owl-carousel`).owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    })
}
function checkStatus(imageUrl) 
{
   var http = jQuery.ajax(
   {
      type:"HEAD",
      url: imageUrl,
      async: false
    })
  return http.status;
}
init();
