import { getProductInfo } from "./productinfo.js";
import { getScores } from "./productscore.js";
import { getAllIngredients } from "./productingredient.js";
import { getAnalysis } from "./productanalysis.js";
import { getNutriments } from "./productnutriments.js";
const searchBox = document.querySelector("#bar-search");
const searchBtn = document.querySelector("#btn-search");
const randomBtn = document.querySelector("#btn-random-search");
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", doSearch, false);
// randomBtn.addEventListener("click", doRandomSearch, false);
searchBox === null || searchBox === void 0 ? void 0 : searchBox.addEventListener("keydown", (e) => getEnter(e));
function getEnter(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
    }
}
async function doSearch() {
    const alertBox = document.querySelector("#alert-box");
    let url = "https://fr.openfoodfacts.org/api/v0/product/3017620422003.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity";
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
