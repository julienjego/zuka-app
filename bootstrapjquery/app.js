$(document).ready(function () {
    $("#btn-search").click(() => {
        $.getJSON(
            "https://fr.openfoodfacts.org/api/v0/product/3760020507350.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity",
            (data) => {
                console.log(data);
                getProductInfo(data);
            }
        );
    });

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
});
