$(document).ready(function () {
    $("#alert-box").css("display", "none");
    $("#bio-label").css("display", "none");
    $("#alert-scan").css("display", "none");
    $("#btn-noscan").css("display", "none");

    $("#btn-scan").click(startScan);

    // Initialisation du lecteur de code-barre

    const html5QrCode = new Html5Qrcode("reader");

    function startScan() {
        $("#btn-scan").css("display", "none");
        $("#alert-scan").css("display", "none");
        $("#btn-noscan").css("display", "block");
        html5QrCode
            .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)

            .catch((err) => {
                console.log("failed : " + err);
                $("#btn-noscan").css("display", "none");
                $("#btn-scan").css("display", "block");
                $("#alert-scan").css("display", "block");
            })
            .then($("#btn-noscan").click(stopScan));
    }

    function stopScan() {
        html5QrCode.stop();
        $("#btn-noscan").css("display", "none");
        $("#btn-scan").css("display", "block");
        $("#alert-scan").css("display", "none");
    }

    const config = {
        fps: 10,
        qrbox: { width: 300, height: 200 },
        aspectRatio: { width: 350, height: 250 },
    };

    const qrCodeSuccessCallback = (decodedText) => {
        console.log(`Code scanned = ${decodedText}`);
        let url = `https://fr.openfoodfacts.org/api/v0/product/${decodedText}.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity`;
        fetchIt(url);
        html5QrCode.stop();
        $("#btn-noscan").css("display", "none");
        $("#btn-scan").css("display", "block");
    };

    // Appuyer sur "Entrée" pour chercher, c'est pratique

    $("#bar-search").keydown(function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
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

    // On effectue la requête avec l'url du random ou la recherche classique ou le scan
    function fetchIt(url) {
        const loader = $(
            "<img src='/img/loader.gif' alt='chargement' class='d-block mx-auto'>"
        ).appendTo($("#error-panel"));
        $.getJSON(url)
            .done((data) => {
                if (data.status === 0) {
                    $("#alert-box").css("display", "block");
                    $("#alert-scan").css("display", "none");
                } else {
                    $("#alert-box").css("display", "none");
                    $("#alert-scan").css("display", "none");
                    getProductInfo(data);
                    getScores(data);
                    getIngredients(data);
                    getAdditives(data);
                    getAllergens(data);
                    getAnalysis(data);
                    getNutriments(data);
                }
            })
            .always(() => {
                loader.remove();
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

        productLbl.html(
            !data.product.product_name
                ? "<strong>Aucun nom</strong>"
                : `<strong>${data.product.product_name}</strong>`
        );

        productQty.html(
            !data.product.quantity ? "Aucune valeur" : data.product.quantity
        );

        productBrand.html(
            !data.product.brands
                ? "Aucune valeur"
                : data.product.brands.replaceAll(",", ", ")
        );

        productCat.html(
            !data.product.categories
                ? "Aucune valeur"
                : data.product.categories
                      .replaceAll("en:", "")
                      .match(/[^,.\s][^,\d]*$/)
        );

        productImg.attr(
            "src",
            !data.product.image_front_url
                ? "/img/placeholder.png"
                : data.product.image_front_url
        );

        bioLbl.css(
            "display",
            data.product.labels && data.product.labels.includes("Bio")
                ? "inline-block"
                : "none"
        );
    }

    // On récupère les scores et on affiche les bonnes images
    function getScores(data) {
        const ecoScore = $("#ecoscore");
        const nutriScore = $("#nutriscore");
        const novaScore = $("#novascore");

        ecoScore.attr(
            "src",
            data.product.ecoscore_grade.match(/^[a-e]$/)
                ? "/img/ecoscore-" + data.product.ecoscore_grade + ".svg"
                : "/img/ecoscore-na.svg"
        );

        nutriScore.attr(
            "src",
            data.product.nutriscore_grade.match(/^[a-e]$/)
                ? "/img/nutriscore-" + data.product.nutriscore_grade + ".svg"
                : "/img/nutriscore-na.svg"
        );

        novaScore.attr(
            "src",
            !isNaN(data.product.nova_group)
                ? "/img/nova-" + data.product.nova_group + ".svg"
                : "/img/nova-na.svg"
        );
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
            !data.product.additives_original_tags ||
            data.product.additives_original_tags.length === 0
        ) {
            $(
                "<li class='list-group-item'>Aucun additif connu dans ce produit</li>"
            ).appendTo(productAdditives);
        } else {
            data.product.additives_original_tags.forEach((additive) => {
                let add = additive.replace("en:", "").toUpperCase();

                $.getJSON("/json/additives.json", (data) => {
                    for (let d of data) {
                        if (d.additif == add) {
                            add += ` (${d.description})`;
                            let li = $("<li>")
                                .text(add)
                                .addClass("list-group-item");
                            li.appendTo(productAdditives);
                        }
                    }
                });
            });
        }
    }

    // On récupère les allergènes s'il y en a
    function getAllergens(data) {
        const productAllergens = $("#allergens");

        productAllergens.html("");
        if (!data.product.allergens || data.product.allergens.length === 0) {
            productAllergens.append(
                "<li class='list-group-item'>Aucun allergène connu dans ce produit</li>"
            );
        } else {
            let allergen = data.product.allergens.split(",");
            allergen.forEach(function (aller) {
                let al = aller.replace("en:", "").replace("fr:", "");
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

        palmOilLabel.removeClass();
        veganLabel.removeClass();
        vegetarianLabel.removeClass();

        if (!data.product.ingredients_analysis_tags) {
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
                !data.product.nutriments["energy-kcal_100g"]
                    ? "?"
                    : nbFormat.format(
                          data.product.nutriments["energy-kcal_100g"]
                      ) + " kcal"
            );
            nutriFat.html(
                !data.product.nutriments.fat_100g
                    ? "?"
                    : nbFormat.format(data.product.nutriments.fat_100g) +
                          " g " +
                          getNutrimentLevel(data, "fat")
            );
            nutriSatFat.html(
                !data.product.nutriments["saturated-fat_100g"]
                    ? "?"
                    : nbFormat.format(
                          data.product.nutriments["saturated-fat_100g"]
                      ) +
                          " g " +
                          getNutrimentLevel(data, "saturated-fat")
            );
            nutriSugar.html(
                !data.product.nutriments.sugars_100g
                    ? "?"
                    : nbFormat.format(data.product.nutriments.sugars_100g) +
                          " g " +
                          getNutrimentLevel(data, "sugars")
            );
            nutriSalt.html(
                !data.product.nutriments.salt_100g
                    ? "?"
                    : nbFormat.format(data.product.nutriments.salt_100g) +
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
