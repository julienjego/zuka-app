import { getProductInfo } from "./productinfo.js";
import { getScores } from "./productscore.js";
import { getAllIngredients } from "./productingredient.js";
import { getAnalysis } from "./productanalysis.js";
import { getNutriments } from "./productnutriments.js";
const searchBox = document.querySelector("#bar-search");
const searchBtn = document.querySelector("#btn-search");
const randomBtn = (document.querySelector("#btn-random-search"));
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", doSearch, false);
randomBtn === null || randomBtn === void 0 ? void 0 : randomBtn.addEventListener("click", doRandomSearch, false);
searchBox === null || searchBox === void 0 ? void 0 : searchBox.addEventListener("keydown", (e) => getEnter(e));
function getEnter(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
    }
}
// Va chercher un produit parmi la liste de manière aléatoire
function doRandomSearch() {
    const randomProducts = [
        "3760020507350",
        "3155250358788",
        "3033710065967",
        "7622210713780",
        "3228857000852",
        "3268840001008",
        "3046920022606",
        "7613035989535",
    ];
    let rndInt = Math.floor(Math.random() * randomProducts.length);
    let url = `https://fr.openfoodfacts.org/api/v0/product/${randomProducts[rndInt]}.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity`;
    fetchIt(url);
}
// Lance la recherche depuis le bouton "Rechercher"
function doSearch() {
    let productCode = searchBox === null || searchBox === void 0 ? void 0 : searchBox.value;
    let url = `https://fr.openfoodfacts.org/api/v0/product/${productCode}.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity`;
    fetchIt(url);
}
// On effectue le fetch avec l'url du random ou la recherche classique
async function fetchIt(url) {
    const alertBox = document.querySelector("#alert-box");
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 0) {
        alertBox.style.display = "block";
    }
    else {
        alertBox.style.display = "none";
        getProductInfo(data);
        getScores(data);
        getAllIngredients(data);
        getAnalysis(data);
        getNutriments(data);
    }
}
