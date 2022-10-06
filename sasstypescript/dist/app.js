var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getProductInfo } from "./productinfo.js";
import { getScores } from "./productscore.js";
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
function doSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const alertBox = document.querySelector("#alert-box");
        let url = "https://fr.openfoodfacts.org/api/v0/product/5449000131805.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity";
        const response = yield fetch(url);
        const data = yield response.json();
        if (data.status === 0) {
            alertBox.style.display = "block";
        }
        else {
            alertBox.style.display = "none";
            getProductInfo(data);
            getScores(data);
        }
    });
}
