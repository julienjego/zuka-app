const nbFormat = new Intl.NumberFormat("fr-FR");
const searchBox = document.querySelector("#bar-search");
const searchBtn = document.querySelector("#btn-search");
const randomBtn = document.querySelector("#btn-random-search");

searchBtn.addEventListener("click", doSearch, false);
randomBtn.addEventListener("click", doRandomSearch, false);

searchBox.onkeydown = function (e) {
    e = e || window.event;
    if (e.which == 13 || e.keyCode == 13) {
        e.preventDefault();
        doSearch();
    }
};

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
    let productCode = searchBox.value;
    let url = `https://fr.openfoodfacts.org/api/v0/product/${productCode}.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity`;
    fetchIt(url);
}

// On effectue le fetch avec l'url du random ou la recherche classique
function fetchIt(url) {
    const alertBox = document.querySelector("#alert-box");

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 0) {
                alertBox.style.display = "block";
            } else {
                alertBox.style.display = "none";
                console.log(data);
                getProductInfo(data);
                getScores(data);
                getIngredients(data);
                getAdditives(data);
                getAllergens(data);
                getNutriments(data);
                getAnalysis(data);
            }
        });
}

// On récupère les infos  pour la section "Le produit"
function getProductInfo(data) {
    const productLbl = document.querySelector("#product-name");
    const productQty = document.querySelector("#product-quantity");
    const productBrand = document.querySelector("#product-brand");
    const productCat = document.querySelector("#product-category");
    const productImg = document.querySelector("#product-img");
    const bioLbl = document.querySelector("#bio-label");

    data.product.product_name == null
        ? (productLbl.innerHTML = "<strong>Aucun nom</strong>")
        : (productLbl.innerHTML = `<strong>${data.product.product_name}</strong>`);

    data.product.quantity == null
        ? (productQty.innerHTML = "Aucune valeur")
        : (productQty.innerHTML = data.product.quantity);

    data.product.brands == null
        ? (productBrand.innerHTML = "Aucune valeur")
        : (productBrand.innerHTML = data.product.brands.replaceAll(",", ", "));

    data.product.categories == null
        ? (productCat.innerHTML = "Aucune valeur")
        : (productCat.innerHTML = data.product.categories
              .replaceAll("en:", "")
              .match(/[^,.\s][^,\d]*$/));

    data.product.image_front_url == null
        ? (productImg.src = "../img/placeholder.png")
        : (productImg.src = data.product.image_front_url);

    data.product.labels != null && data.product.labels.includes("Bio")
        ? (bioLbl.style.display = "inline-block")
        : (bioLbl.style.display = "none");
}

// On récupère les scores et on affiche les bonnes images
function getScores(data) {
    const ecoScore = document.querySelector("#ecoscore");
    const nutriScore = document.querySelector("#nutriscore");
    const novaScore = document.querySelector("#novascore");

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
            novaScore.src = "../img/nova-na.svg";
    }
}

// On récupère la liste des ingrédients, trois cas pour être sûr d'obtenir quelque chose
function getIngredients(data) {
    const productIngredients = document.querySelector("#list-ingredients");

    if (data.product.ingredients_text_fr != null) {
        productIngredients.innerHTML =
            data.product.ingredients_text_fr.replaceAll("_", "");
    } else if (data.product.ingredients_text_en != null) {
        productIngredients.innerHTML =
            data.product.ingredients_text_en.replaceAll("_", "");
    } else if (data.product.ingredients_text_debug != null) {
        productIngredients.innerHTML =
            data.product.ingredients_text_debug.replaceAll("_", "");
    } else {
        productIngredients.innerHTML = "Aucun ingrédient ajouté";
    }
}

// On récupère les additifs s'il y en a
function getAdditives(data) {
    const productAdditives = document.querySelector("#additives");

    productAdditives.innerHTML = "";
    if (
        data.product.additives_original_tags == null ||
        data.product.additives_original_tags.length == 0
    ) {
        productAdditives.innerHTML = "Aucun additif connu dans ce produit";
    } else {
        for (let add of data.product.additives_original_tags) {
            let additive = document.createElement("div");
            additive.setAttribute("class", "additive");
            additive.innerHTML =
                "&#x25CF;&nbsp;" + add.replace("en:", "").toUpperCase();
            productAdditives.appendChild(additive);
        }
    }
}

// On récupère les allergènes s'il y en a
function getAllergens(data) {
    const productAllergens = document.querySelector("#allergens");

    if (data.product.allergens == null || data.product.allergens.length == 0) {
        productAllergens.innerHTML = "aucun allergène connu dans ce produit";
    } else {
        productAllergens.innerHTML = data.product.allergens.replaceAll(
            "en:",
            ""
        );
    }
}

// On récupère les infos sur le statut "huile de palme", "vegan" et "végé" et on affiche les bons labels
function getAnalysis(data) {
    const productAnalysis = document.querySelector("#analysis-labels");

    productAnalysis.innerHTML = "";
    let palmOilLabel = document.createElement("div");
    let veganLabel = document.createElement("div");
    let vegatarianLabel = document.createElement("div");

    if (data.product.ingredients_analysis_tags == null) {
        productAnalysis.innerHTML = "Rien à afficher ici...";
    } else {
        // Labels huile de palme
        switch (data.product.ingredients_analysis_tags[0]) {
            case "en:palm-oil":
                palmOilLabel.setAttribute("class", "red-ingredients-label");
                palmOilLabel.innerHTML =
                    "<img src='../img/palm.svg' alt='icon-palm-oil'>&nbsp;Huile de palme";
                productAnalysis.appendChild(palmOilLabel);
                break;
            case "en:palm-oil-free":
                palmOilLabel.setAttribute("class", "green-ingredients-label");
                palmOilLabel.innerHTML =
                    "<img src='../img/palm.svg' alt='icon-palm-oil'>&nbsp;Sans huile de palme";
                productAnalysis.appendChild(palmOilLabel);
                break;
            case "en:palm-oil-content-unknown":
            case "en:may-contain-palm-oil":
            default:
                palmOilLabel.setAttribute("class", "unknown-ingredients-label");
                palmOilLabel.innerHTML =
                    "&nbsp;Présence huile de palme inconnue";
                productAnalysis.appendChild(palmOilLabel);
                break;
        }

        // Labels vegan
        switch (data.product.ingredients_analysis_tags[1]) {
            case "en:non-vegan":
                veganLabel.setAttribute("class", "red-ingredients-label");
                veganLabel.innerHTML =
                    "<img src='../img/vegan.svg' alt='icon-vegan'>&nbsp;Non vegan";
                productAnalysis.appendChild(veganLabel);
                break;
            case "en:vegan":
                veganLabel.setAttribute("class", "green-ingredients-label");
                veganLabel.innerHTML =
                    "<img src='../img/vegan.svg' alt='icon-vegan'>&nbsp;Vegan";
                productAnalysis.appendChild(veganLabel);
                break;
            case "en:vegan-status-unknown":
            case "en:maybe-vegan":
            default:
                veganLabel.setAttribute("class", "unknown-ingredients-label");
                veganLabel.innerHTML = "&nbsp;Caractère vegan inconnu";
                productAnalysis.appendChild(veganLabel);
                break;
        }

        // Labels végé
        switch (data.product.ingredients_analysis_tags[2]) {
            case "en:non-vegetarian":
                vegatarianLabel.setAttribute("class", "red-ingredients-label");
                vegatarianLabel.innerHTML =
                    "<img src='../img/vege.svg' alt='icon-vegetarian'>&nbsp;Non végétarien";
                productAnalysis.appendChild(vegatarianLabel);
                break;
            case "en:vegetarian":
                vegatarianLabel.setAttribute(
                    "class",
                    "green-ingredients-label"
                );
                vegatarianLabel.innerHTML =
                    "<img src='../img/vege.svg' alt='icon-vegetarian'>&nbsp;Végétarien";
                productAnalysis.appendChild(vegatarianLabel);
                break;
            case "en:vegetarian-status-unknown":
            case "en:maybe-vegetarian":
            default:
                vegatarianLabel.setAttribute(
                    "class",
                    "unknown-ingredients-label"
                );
                vegatarianLabel.innerHTML =
                    "&nbsp;Caractère végétarien inconnu";
                productAnalysis.appendChild(vegatarianLabel);
                break;
        }
    }
}

// On récupère les infos pour le tableau "Repères nutritionnels"
function getNutriments(data) {
    const nutriEnergy = document.querySelector("#energy");
    const nutriFat = document.querySelector("#fat");
    const nutriSatFat = document.querySelector("#saturated-fat");
    const nutriSugar = document.querySelector("#sugar");
    const nutriSalt = document.querySelector("#salt");

    if (Object.keys(data.product.nutriments).length === 0) {
        nutriEnergy.innerHTML = "?";
        nutriFat.innerHTML = "?";
        nutriSatFat.innerHTML = "?";
        nutriSugar.innerHTML = "?";
        nutriSalt.innerHTML = "?";
    } else {
        nutriEnergy.innerHTML =
            nbFormat.format(data.product.nutriments["energy-kcal_100g"]) +
            " kcal";
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
}

// On récupère les niveaux de nutriments et on affiche des emojis suivant le niveau
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
