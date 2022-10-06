class ProductInfo {
    name: string;
    brand: string;
    quantity: string;
    category: string;
    image: string;
    bio: string;

    constructor(
        name: string,
        brand: string,
        quantity: string,
        category: string,
        image: string,
        bio: string
    ) {
        this.name = name;
        this.brand = brand;
        this.quantity = quantity;
        this.category = category;
        this.image = image;
        this.bio = bio;
    }
}

// On récupère les infos  pour la section "Le produit"
export function getProductInfo(data: any) {
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

    const name: string = !data.product.product_name
        ? "<strong>Aucun nom</strong>"
        : `<strong>${data.product.product_name}</strong>`;

    const qty: string = !data.product.quantity
        ? "Aucune valeur"
        : data.product.quantity;

    const brand: string = !data.product.brands
        ? "Aucune valeur"
        : data.product.brands.replaceAll(",", ", ");

    const cat: string = !data.product.categories
        ? "Aucune valeur"
        : data.product.categories
              .replaceAll("en:", "")
              .match(/[^,.\s][^,\d]*$/);

    const img: string = !data.product.image_front_url
        ? "../img/placeholder.png"
        : data.product.image_front_url;

    const bio: string =
        data.product.labels && data.product.labels.includes("Bio")
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
