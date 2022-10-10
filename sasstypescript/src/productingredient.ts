class IngredientsList {
    ingredients: string;
    allergens: string;
    additives: string | string[];

    constructor(
        ingredients: string,
        allergens: string,
        additives: string | string[]
    ) {
        this.ingredients = ingredients;
        this.allergens = allergens;
        this.additives = additives;
    }
}

export function getAllIngredients(data: any) {
    // On récupère la liste des ingrédients, trois cas pour être sûr d'obtenir quelque chose
    const productIngredients = <HTMLParagraphElement>(
        document.querySelector("#list-ingredients")
    );

    const ingredientsText = (): string => {
        if (data.product.ingredients_text_fr != null) {
            return data.product.ingredients_text_fr.replaceAll("_", "");
        } else if (data.product.ingredients_text_en != null) {
            return data.product.ingredients_text_en.replaceAll("_", "");
        } else if (data.product.ingredients_text_debug != null) {
            return data.product.ingredients_text_debug.replaceAll("_", "");
        } else {
            return "Aucun ingrédient ajouté";
        }
    };

    // On récupère les additifs s'il y en a
    const productAdditives = <HTMLDivElement>(
        document.querySelector("#additives")
    );

    productAdditives.innerHTML = "";

    const additivesText = (): string | string[] => {
        if (
            !data.product.additives_original_tags ||
            data.product.additives_original_tags.length === 0
        ) {
            return "Aucun additif connu dans ce produit";
        } else {
            let additives: string[] = [];
            for (let add of data.product.additives_original_tags) {
                let additive =
                    "<div class='additive'>&#x25CF;&nbsp;" +
                    add.replace("en:", "").toUpperCase() +
                    "</div>";
                additives.push(additive);
            }
            return additives;
        }
    };

    // On récupère les allergènes s'il y en a

    const productAllergens = <HTMLSpanElement>(
        document.querySelector("#allergens")
    );

    const allergensText =
        !data.product.allergens || data.product.allergens.length === 0
            ? "aucun allergène connu dans ce produit"
            : data.product.allergens
                  .replaceAll("en:", "")
                  .replaceAll("fr:", "");

    // Affichage de l'ensemble

    const ingredients = new IngredientsList(
        ingredientsText(),
        allergensText,
        additivesText()
    );

    productIngredients.innerHTML = ingredients.ingredients;
    productAllergens.innerHTML = ingredients.allergens;
    for (let add of ingredients.additives) {
        productAdditives.innerHTML += add;
    }
}
