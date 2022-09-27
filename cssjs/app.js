let nbFormat = new Intl.NumberFormat("fr-FR");

let searchBtn = document.querySelector("#btn-search");
let productLbl = document.querySelector("#produit-nom");
let productQty = document.querySelector("#produit-quantite");
let productBrand = document.querySelector("#produit-marque");
let productCat = document.querySelector("#produit-categorie");
let productImg = document.querySelector("#produit-img");
let bioLbl = document.querySelector("#bio-label");

let ecoScore = document.querySelector("#ecoscore");
let nutriScore = document.querySelector("#nutriscore");
let novaScore = document.querySelector("#novascore");

let productIngredients = document.querySelector("#list-ingredients");
let productAdditives = document.querySelector("#additifs");
let productAllergens = document.querySelector("#allergens");

let productAnalysis = document.querySelector("#analysis-labels");

let nutriEnergy = document.querySelector("#energy");
let nutriFat = document.querySelector("#fat");
let nutriSatFat = document.querySelector("#saturated-fat");
let nutriSugar = document.querySelector("#sugar");
let nutriSalt = document.querySelector("#salt");

searchBtn.addEventListener("click", function () {
    // "https://fr.openfoodfacts.org/api/v0/product/3017620421006.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity"
    fetch("http://127.0.0.1:5500/json/3083681081534.json")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            getProductInfo(data);
            getScores(data);
            getIngredients(data);
            getAdditives(data);
            getAllergens(data);
            getNutriments(data);
            getAnalysis(data);
        });
});

function getProductInfo(data) {
    productLbl.innerHTML = `<strong>${data.product.product_name}</strong>`;
    productQty.innerHTML = data.product.quantity;
    productBrand.innerHTML = data.product.brands.replaceAll(",", ", ");
    productCat.innerHTML = data.product.categories.match(/[^,.\s][^,\d]*$/);
    productImg.src = data.product.image_front_url;

    if (data.product.labels.includes("Bio,")) {
        bioLbl.style.visibility = "visible";
    } else {
        bioLbl.style.visibility = "hidden";
    }
}

function getScores(data) {
    // Obtenir et modifier l'éco-score
    switch (data.product.ecoscore_grade) {
        case "a":
            ecoScore.src = "../img/ecoscore-a.svg";
            break;
        case "b":
            ecoScore.src = "../img/ecoscore-b.svg";
            break;
        case "c":
            ecoScore.src = "../img/ecoscore-c.svg";
            break;
        case "d":
            ecoScore.src = "../img/ecoscore-d.svg";
            break;
        case "e":
            ecoScore.src = "../img/ecoscore-e.svg";
            break;
        default:
            ecoScore.src = "../img/ecoscore-na.svg";
    }
    // Obtenir et modifier le nutriscore
    switch (data.product.nutriscore_grade) {
        case "a":
            nutriScore.src = "../img/nutriscore-a.svg";
            break;
        case "b":
            nutriScore.src = "../img/nutriscore-b.svg";
            break;
        case "c":
            nutriScore.src = "../img/nutriscore-c.svg";
            break;
        case "d":
            nutriScore.src = "../img/nutriscore-d.svg";
            break;
        case "e":
            nutriScore.src = "../img/nutriscore-e.svg";
            break;
        default:
            nutriScore.src = "../img/nutriscore-na.svg";
    }
    // Obtenir et modifier le score nova
    switch (data.product.nova_group) {
        case 1:
            novaScore.src = "../img/nova-1.svg";
            break;
        case 2:
            novaScore.src = "../img/nova-2.svg";
            break;
        case 3:
            novaScore.src = "../img/nova-3.svg";
            break;
        case 4:
            novaScore.src = "../img/nova-4.svg";
            break;
        default:
            novaScore.src = "../img/nutriscore-na.svg";
    }
}

function getIngredients(data) {
    if (data.product.ingredients_text_debug != null) {
        productIngredients.innerHTML =
            data.product.ingredients_text_debug.replaceAll("_", "");
    } else if (data.product.ingredients_text_fr != null) {
        productIngredients.innerHTML =
            data.product.ingredients_text_fr.replaceAll("_", "");
    } else {
        productIngredients.innerHTML =
            data.product.ingredients_text_en.replaceAll("_", "");
    }
}

function getAdditives(data) {
    if (data.product.additives_original_tags.length == 0) {
        productAdditives.innerHTML = "Aucun additif dans ce produit";
    } else {
        for (let add of data.product.additives_original_tags) {
            let additive = document.createElement("div");
            additive.setAttribute("class", "additif");
            additive.innerHTML =
                "&#x25CF;&nbsp;" + add.replace("en:", "").toUpperCase();
            productAdditives.appendChild(additive);
        }
    }
}

function getAllergens(data) {
    if (data.product.allergens.length == null) {
        productAllergens.innerHTML = "Aucun allergène dans ce produit";
    } else {
        productAllergens.innerHTML = data.product.allergens.replaceAll(
            "en:",
            ""
        );
    }
}

function getAnalysis(data) {
    let palmOilLabel = document.createElement("div");
    let veganLabel = document.createElement("div");
    let vegatarianLabel = document.createElement("div");

    switch (data.product.ingredients_analysis_tags[0]) {
        case "en:palm-oil":
            palmOilLabel.setAttribute("class", "red-ingredients-label");
            palmOilLabel.innerHTML = "&#x25CF;&nbsp;Huile de palme";
            productAnalysis.appendChild(palmOilLabel);
            break;
        case "en:palm-oil-free":
            palmOilLabel.setAttribute("class", "green-ingredients-label");
            palmOilLabel.innerHTML = "&#x25CF;&nbsp;Sans huile de palme";
            productAnalysis.appendChild(palmOilLabel);
            break;
        case "en:palm-oil-content-unknown":
        case "en:may-contain-palm-oil":
        default:
            palmOilLabel.setAttribute("class", "unknown-ingredients-label");
            palmOilLabel.innerHTML =
                "&#x25CF;&nbsp;Présence huile de palme inconnue";
            productAnalysis.appendChild(palmOilLabel);
            break;
    }

    switch (data.product.ingredients_analysis_tags[1]) {
        case "en:non-vegan":
            veganLabel.setAttribute("class", "red-ingredients-label");
            veganLabel.innerHTML = "&#x25CF;&nbsp;Non vegan";
            productAnalysis.appendChild(veganLabel);
            break;
        case "en:vegan":
            veganLabel.setAttribute("class", "green-ingredients-label");
            veganLabel.innerHTML = "&#x25CF;&nbsp;Vegan";
            productAnalysis.appendChild(veganLabel);
            break;
        case "en:vegan-status-unknown":
        case "en:maybe-vegan":
        default:
            veganLabel.setAttribute("class", "unknown-ingredients-label");
            veganLabel.innerHTML = "&#x25CF;&nbsp;Caractère vegan inconnu";
            productAnalysis.appendChild(veganLabel);
            break;
    }
    switch (data.product.ingredients_analysis_tags[2]) {
        case "en:non-vegetarian":
            vegatarianLabel.setAttribute("class", "red-ingredients-label");
            vegatarianLabel.innerHTML = "&#x25CF;&nbsp;Non végétarien";
            productAnalysis.appendChild(vegatarianLabel);
            break;
        case "en:vegetarian":
            vegatarianLabel.setAttribute("class", "green-ingredients-label");
            vegatarianLabel.innerHTML = "&#x25CF;&nbsp;Végétarien";
            productAnalysis.appendChild(vegatarianLabel);
            break;
        case "en:vegetarian-status-unknown":
        case "en:maybe-vegetarian":
        default:
            vegatarianLabel.setAttribute("class", "unknown-ingredients-label");
            vegatarianLabel.innerHTML =
                "&#x25CF;&nbsp;Caractère végétarien inconnu";
            productAnalysis.appendChild(vegatarianLabel);
            break;
    }
}

function getNutriments(data) {
    nutriEnergy.innerHTML =
        nbFormat.format(data.product.nutriments["energy-kcal_100g"]) + " kcal";
    nutriFat.innerHTML =
        nbFormat.format(data.product.nutriments.fat_100g) +
        " g " +
        getNutrimentLevel(data, "fat");
    nutriSatFat.innerHTML =
        nbFormat.format(data.product.nutriments["saturated-fat_100g"]) +
        " g " +
        getNutrimentLevel(data, "saturated-fat");
    nutriSugar.innerHTML =
        nbFormat.format(data.product.nutriments.sugars_100g) +
        " g " +
        getNutrimentLevel(data, "sugars");
    nutriSalt.innerHTML =
        nbFormat.format(data.product.nutriments.salt_100g) +
        " g " +
        getNutrimentLevel(data, "salt");
}

function getNutrimentLevel(data, nutri) {
    switch (data.product.nutrient_levels[nutri]) {
        case "low":
            return "&#x1F600;";
        case "moderate":
            return "&#x1F610;";
        case "high":
            return "&#x1F629;";
        default:
            return "";
    }
}
