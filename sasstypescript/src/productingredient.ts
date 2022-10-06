class IngredientsList {
    ingredients: string;
    allergens: string;
    additives: string[];

    constructor(ingredients: string, allergens: string, additives: string[]) {
        this.ingredients = ingredients;
        this.allergens = allergens;
        this.additives = additives;
    }
}
