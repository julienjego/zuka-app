const searchBox = document.querySelector("#bar-search");
const searchBtn = document.querySelector("#btn-search");
const randomBtn = document.querySelector("#btn-random-search");

searchBtn?.addEventListener("click", doSearch, false);
// randomBtn.addEventListener("click", doRandomSearch, false);

searchBox?.addEventListener("keydown", (e: KeyboardEventInit): void =>
    getEnter(e as KeyboardEvent)
);

function getEnter(e: KeyboardEvent): void {
    if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
    }
}

async function doSearch() {
    const alertBox = <HTMLDivElement>document.querySelector("#alert-box");
    let url =
        "https://fr.openfoodfacts.org/api/v0/product/3760020507350.json?fields=additives_original_tags,allergens,brands,categories,ecoscore_grade,image_front_url,ingredients_analysis_tags,ingredients_text_debug,ingredients_text_fr,ingredients_text_en,labels,nova_group,nutriscore_grade,nutrient_levels,nutriments,product_name,quantity";
    const response = await fetch(url);
    const data: Response = await response.json();

    if (data.status === 0) {
        alertBox.style.display = "block";
    } else {
        alertBox.style.display = "none";
        getProductInfo(data);
    }
}

// On récupère les infos  pour la section "Le produit"
function getProductInfo(data: any) {
    const productLbl = <HTMLParagraphElement>(
        document.querySelector("#product-name")
    );
    const productQty = <HTMLSpanElement>(
        document.querySelector("#product-quantity")
    );
    const productBrand = <HTMLSpanElement>(
        document.querySelector("#product-brand")
    );
    const productCat = <HTMLSpanElement>(
        document.querySelector("#product-category")
    );
    const productImg = <HTMLImageElement>document.querySelector("#product-img");
    const bioLbl = <HTMLSpanElement>document.querySelector("#bio-label");

    productLbl.innerHTML =
        data.product.product_name === null
            ? "<strong>Aucun nom</strong>"
            : `<strong>${data.product.product_name}</strong>`;

    productQty.innerHTML =
        data.product.quantity === null
            ? "Aucune valeur"
            : data.product.quantity;

    productBrand.innerHTML =
        data.product.brands === null
            ? "Aucune valeur"
            : data.product.brands.replaceAll(",", ", ");

    productCat.innerHTML =
        data.product.categories === null
            ? "Aucune valeur"
            : data.product.categories
                  .replaceAll("en:", "")
                  .match(/[^,.\s][^,\d]*$/);

    productImg.src =
        data.product.image_front_url === null
            ? "../img/placeholder.png"
            : data.product.image_front_url;

    bioLbl.style.display =
        data.product.labels != null && data.product.labels.includes("Bio")
            ? "inline-block"
            : "none";
}
