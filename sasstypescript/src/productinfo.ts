import { ProductData } from "./productdataype";

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
export function getProductInfo(data: ProductData) {
    const product = new ProductInfo(
        data.product.product_name,
        data.product.brands,
        data.product.quantity,
        data.product.categories,
        data.product.image_front_url,
        data.product.labels
    );

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

    productLbl.innerHTML = !product.name
        ? "<strong>Aucun nom</strong>"
        : `<strong>${product.name}</strong>`;

    productQty.innerHTML = !product.quantity
        ? "Aucune valeur"
        : product.quantity;

    productBrand.innerHTML = !product.brand
        ? "Aucune valeur"
        : product.brand.replaceAll(",", ", ");

    const cat: string[] = product.category.match(/[^,.\s][^,\d]*$/)!;

    productCat.innerHTML = !product.category
        ? "Aucune valeur"
        : cat.toString().replaceAll("en:", "");

    productImg.src = !product.image ? "../img/placeholder.png" : product.image;

    bioLbl.style.display =
        product.bio && product.bio.includes("Bio") ? "inline-block" : "none";
}
