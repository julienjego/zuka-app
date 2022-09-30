$(document).ready(function () {
    $("#alert-box").css("display", "none");

    $("#bar-search").keydown(function (e) {
        e = e || window.event;
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            console.log("enter search");
        }
    });

    $("#btn-search").click(doSearch);
    $("#btn-random-search").click(doRandomSearch);

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
        let productCode = $("#bar-search").val();
        let url = `https://fr.openfoodfacts.org/api/v0/product/${productCode}.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity`;
        fetchIt(url);
    }

    // On effectue la requête avec l'url du random ou la recherche classique
    function fetchIt(url) {
        $.getJSON(url, (data) => {
            if (data.status === 0) {
                $("#alert-box").css("display", "block");
            } else {
                $("#alert-box").css("display", "none");
                console.log(data);
                getProductInfo(data);
                getScores(data);
                getIngredients(data);
                getAdditives(data);
                getAllergens(data);
                getAnalysis(data);
                getNutriments(data);
            }
        });
    }

    // On récupère les infos  pour la section "Le produit"
    function getProductInfo(data) {
        const productLbl = $("#product-name");
        const productQty = $("#product-quantity");
        const productBrand = $("#product-brand");
        const productCat = $("#product-category");
        const productImg = $("#product-img");
        const bioLbl = $("#bio-label");

        data.product.product_name === null
            ? productLbl.html("<strong>Aucun nom</strong>")
            : productLbl.html(`<strong>${data.product.product_name}</strong>`);

        data.product.quantity === null
            ? productQty.html("Aucune valeur")
            : productQty.html(data.product.quantity);

        data.product.brands === null
            ? productBrand.html("Aucune valeur")
            : productBrand.html(data.product.brands.replaceAll(",", ", "));

        data.product.categories === null
            ? productCat.html("Aucune valeur")
            : productCat.html(
                  data.product.categories
                      .replaceAll("en:", "")
                      .match(/[^,.\s][^,\d]*$/)
              );

        data.product.image_front_url === null
            ? productImg.attr("src", "../img/placeholder.png")
            : productImg.attr("src", data.product.image_front_url);

        data.product.labels != null && data.product.labels.includes("Bio")
            ? bioLbl.css("display", "inline-block")
            : bioLbl.css("display", "none");
    }

    // On récupère les scores et on affiche les bonnes images
    function getScores(data) {
        const ecoScore = $("#ecoscore");
        const nutriScore = $("#nutriscore");
        const novaScore = $("#novascore");

        // Obtenir et modifier l'éco-score
        switch (data.product.ecoscore_grade) {
            case "a":
                ecoScore.attr("src", "../img/ecoscore-a.svg");
                break;
            case "b":
                ecoScore.attr("src", "../img/ecoscore-b.svg");
                break;
            case "c":
                ecoScore.attr("src", "../img/ecoscore-c.svg");
                break;
            case "d":
                ecoScore.attr("src", "../img/ecoscore-d.svg");
                break;
            case "e":
                ecoScore.attr("src", "../img/ecoscore-e.svg");
                break;
            default:
                ecoScore.attr("src", "../img/ecoscore-na.svg");
        }
        // Obtenir et modifier le nutriscore
        switch (data.product.nutriscore_grade) {
            case "a":
                nutriScore.attr("src", "../img/nutriscore-a.svg");
                break;
            case "b":
                nutriScore.attr("src", "../img/nutriscore-b.svg");
                break;
            case "c":
                nutriScore.attr("src", "../img/nutriscore-c.svg");
                break;
            case "d":
                nutriScore.attr("src", "../img/nutriscore-d.svg");
                break;
            case "e":
                nutriScore.attr("src", "../img/nutriscore-e.svg");
                break;
            default:
                nutriScore.attr("src", "../img/nutriscore-na.svg");
        }
        // Obtenir et modifier le score nova
        switch (data.product.nova_group) {
            case 1:
                novaScore.attr("src", "../img/nova-1.svg");
                break;
            case 2:
                novaScore.attr("src", "../img/nova-2.svg");
                break;
            case 3:
                novaScore.attr("src", "../img/nova-3.svg");
                break;
            case 4:
                novaScore.attr("src", "../img/nova-4.svg");
                break;
            default:
                novaScore.attr("src", "../img/nova-na.svg");
        }
    }

    // On récupère la liste des ingrédients, trois cas pour être sûr d'obtenir quelque chose
    function getIngredients(data) {
        const productIngredients = $("#list-ingredients");

        if (data.product.ingredients_text_fr != null) {
            productIngredients.text(
                data.product.ingredients_text_fr.replaceAll("_", "")
            );
        } else if (data.product.ingredients_text_en != null) {
            productIngredients.text(
                data.product.ingredients_text_en.replaceAll("_", "")
            );
        } else if (data.product.ingredients_text_debug != null) {
            productIngredients.text(
                data.product.ingredients_text_debug.replaceAll("_", "")
            );
        } else {
            productIngredients.text("Aucun ingrédient ajouté");
        }
    }

    // On récupère les additifs s'il y en a
    function getAdditives(data) {
        const productAdditives = $("#additives");

        productAdditives.html("");
        if (
            data.product.additives_original_tags === null ||
            data.product.additives_original_tags.length === 0
        ) {
            $(
                "<li class='list-group-item'>Aucun additif connu dans ce produit</li>"
            ).appendTo(productAdditives);
        } else {
            data.product.additives_original_tags.forEach((additive) => {
                let add = additive.replace("en:", "").toUpperCase();

                let li = $("<li>").text(add).addClass("list-group-item");
                li.appendTo(productAdditives);
            });
        }
    }

    // On récupère les allergènes s'il y en a
    function getAllergens(data) {
        const productAllergens = $("#allergens");

        productAllergens.html("");
        if (
            data.product.allergens === null ||
            data.product.allergens.length === 0
        ) {
            productAllergens.append(
                "<li class='list-group-item'>Aucun allergène connu dans ce produit</li>"
            );
        } else {
            let allergen = data.product.allergens.split(",");
            allergen.forEach(function (aller) {
                let al = aller.replace("en:", "");
                let alCap = al.charAt(0).toUpperCase() + al.slice(1);
                let li = $("<li>").text(alCap).addClass("list-group-item");
                li.appendTo(productAllergens);
            });
        }
    }

    // On récupère les infos sur le statut "huile de palme", "vegan" et "végé" et on affiche les bons labels
    function getAnalysis(data) {
        const productAnalysis = $("#analysis-labels");

        let palmOilLabel = $("#palm-oil");
        let veganLabel = $("#vegan");
        let vegetarianLabel = $("#vegetarian");

        palmOilLabel.html("");
        veganLabel.html("");
        vegetarianLabel.html("");

        if (data.product.ingredients_analysis_tags === null) {
            productAnalysis.text("Rien à afficher ici...");
        } else {
            // Labels huile de palme
            switch (data.product.ingredients_analysis_tags[0]) {
                case "en:palm-oil":
                    palmOilLabel
                        .addClass("badge rounded-pill bg-danger p-3 mt-1")
                        .text("Huile de palme");
                    break;
                case "en:palm-oil-free":
                    palmOilLabel
                        .addClass("badge rounded-pill bg-success p-3 mt-1")
                        .text("Sans huile de palme");
                    break;
                case "en:palm-oil-content-unknown":
                case "en:may-contain-palm-oil":
                default:
                    palmOilLabel
                        .addClass("badge rounded-pill bg-secondary p-3 mt-1")
                        .text("Présence huile de palme inconnue");
                    break;
            }

            // Labels vegan
            switch (data.product.ingredients_analysis_tags[1]) {
                case "en:non-vegan":
                    veganLabel
                        .addClass("badge rounded-pill bg-danger p-3 mt-1")
                        .text("Non vegan");
                    break;
                case "en:vegan":
                    veganLabel
                        .addClass("badge rounded-pill bg-success p-3 mt-1")
                        .text("Vegan");
                    break;
                case "en:vegan-status-unknown":
                case "en:maybe-vegan":
                default:
                    veganLabel
                        .addClass("badge rounded-pill bg-secondary p-3 mt-1")
                        .text("Caractère vegan inconnu");
                    break;
            }

            // Labels végé
            switch (data.product.ingredients_analysis_tags[2]) {
                case "en:non-vegetarian":
                    vegetarianLabel
                        .addClass("badge rounded-pill bg-danger p-3 mt-1")
                        .text("Non végétarien");
                    break;
                case "en:vegetarian":
                    vegetarianLabel
                        .addClass("badge rounded-pill bg-success p-3 mt-1")
                        .text("Végétarien");
                    break;
                case "en:vegetarian-status-unknown":
                case "en:maybe-vegetarian":
                default:
                    vegetarianLabel
                        .addClass("badge rounded-pill bg-secondary p-3 mt-1")
                        .text("Caractère végétarien inconnu");
                    break;
            }
        }
    }

    // On récupère les infos pour le tableau "Repères nutritionnels"
    function getNutriments(data) {
        const nbFormat = new Intl.NumberFormat("fr-FR");

        const nutriEnergy = $("#energy");
        const nutriFat = $("#fat");
        const nutriSatFat = $("#saturated-fat");
        const nutriSugar = $("#sugar");
        const nutriSalt = $("#salt");

        if (Object.keys(data.product.nutriments).length === 0) {
            nutriEnergy.text("?");
            nutriFat.text("?");
            nutriSatFat.text("?");
            nutriSugar.text("?");
            nutriSalt.text("?");
        } else {
            nutriEnergy.html(
                nbFormat.format(data.product.nutriments["energy-kcal_100g"]) +
                    " kcal"
            );
            nutriFat.html(
                nbFormat.format(data.product.nutriments.fat_100g) +
                    " g " +
                    getNutrimentLevel(data, "fat")
            );
            nutriSatFat.html(
                nbFormat.format(data.product.nutriments["saturated-fat_100g"]) +
                    " g " +
                    getNutrimentLevel(data, "saturated-fat")
            );
            nutriSugar.html(
                nbFormat.format(data.product.nutriments.sugars_100g) +
                    " g " +
                    getNutrimentLevel(data, "sugars")
            );
            nutriSalt.html(
                nbFormat.format(data.product.nutriments.salt_100g) +
                    " g " +
                    getNutrimentLevel(data, "salt")
            );
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
});
