import "./style/style.css";
import "./image-figure.js";

const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    singleMealEl = document.getElementById('single-meal');

function searchMeal(e) {
    e.preventDefault();

    singleMealEl.innerHTML = '';

    const term = search.value;

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h1 style="color: #4f8a8b;"><b>Hasil pencarian dari ${term}:</b></h1>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `Pencarian anda tidak ditemukan, silahkan masukkan keyword pencarian lainnya!`;
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                          <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                          </div>
                        </div>
                    `).join('');
                }
            });
        search.value = '';
    } else {
        alert('Silahkan masukkan keyword pencarian');
    }
}

// Fetch meal dari id
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

// Fetch meal secara random dari API
function getRandomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

// Menambahkan meal ke DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                &nbsp;&nbsp;&nbsp;
                <h4 style="color: #4f8a8b;">Ingredients</h4>
                <ul>
                  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});

