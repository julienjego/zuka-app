"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        let url = "https://fr.openfoodfacts.org/api/v0/product/3760020507350.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity";
        const response = yield fetch(url);
        const data = yield response.json();
        if (data.status === 0) {
            alertBox.style.display = "block";
        }
        else {
            alertBox.style.display = "none";
            getProductInfo(data);
        }
    });
}
// On récupère les infos  pour la section "Le produit"
function getProductInfo(data) {
    const productLbl = (document.querySelector("#product-name"));
    const productQty = (document.querySelector("#product-quantity"));
    const productBrand = (document.querySelector("#product-brand"));
    const productCat = (document.querySelector("#product-category"));
    const productImg = document.querySelector("#product-img");
    const bioLbl = document.querySelector("#bio-label");
    productLbl.innerHTML = !data.product.product_name
        ? "<strong>Aucun nom</strong>"
        : `<strong>${data.product.product_name}</strong>`;
    productQty.innerHTML = !data.product.quantity
        ? "Aucune valeur"
        : data.product.quantity;
    productBrand.innerHTML = !data.product.brands
        ? "Aucune valeur"
        : data.product.brands.replaceAll(",", ", ");
    productCat.innerHTML = !data.product.categories
        ? "Aucune valeur"
        : data.product.categories
            .replaceAll("en:", "")
            .match(/[^,.\s][^,\d]*$/);
    productImg.src = !data.product.image_front_url
        ? "../img/placeholder.png"
        : data.product.image_front_url;
    bioLbl.style.display =
        data.product.labels && data.product.labels.includes("Bio")
            ? "inline-block"
            : "none";
}
