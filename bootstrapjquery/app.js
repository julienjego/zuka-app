$(document).ready(function () {
    $("#btn-search").click(() => {
        $.getJSON(
            "https://fr.openfoodfacts.org/api/v0/product/3033710065967.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity",
            (data) => {
                console.log(data);
                getProductInfo(data);
                getScores(data);
            }
        );
    });

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
});
