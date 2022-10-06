class ProductInfo {
    constructor(name, brand, quantity, category, image, bio) {
        this.name = name;
        this.brand = brand;
        this.quantity = quantity;
        this.category = category;
        this.image = image;
        this.bio = bio;
    }
}
// On récupère les infos  pour la section "Le produit"
export function getProductInfo(data) {
    const productLbl = (document.querySelector("#product-name"));
    const productQty = (document.querySelector("#product-quantity"));
    const productBrand = (document.querySelector("#product-brand"));
    const productCat = (document.querySelector("#product-category"));
    const productImg = document.querySelector("#product-img");
    const bioLbl = document.querySelector("#bio-label");
    const name = !data.product.product_name
        ? "<strong>Aucun nom</strong>"
        : `<strong>${data.product.product_name}</strong>`;
    const qty = !data.product.quantity
        ? "Aucune valeur"
        : data.product.quantity;
    const brand = !data.product.brands
        ? "Aucune valeur"
        : data.product.brands.replaceAll(",", ", ");
    const cat = !data.product.categories
        ? "Aucune valeur"
        : data.product.categories
            .replaceAll("en:", "")
            .match(/[^,.\s][^,\d]*$/);
    const img = !data.product.image_front_url
        ? "../img/placeholder.png"
        : data.product.image_front_url;
    const bio = data.product.labels && data.product.labels.includes("Bio")
        ? "inline-block"
        : "none";
    const product = new ProductInfo(name, brand, qty, cat, img, bio);
    productLbl.innerHTML = product.name;
    productQty.innerHTML = product.quantity;
    productBrand.innerHTML = product.brand;
    productCat.innerHTML = product.category;
    productImg.src = product.image;
    bioLbl.style.display = product.bio;
}
