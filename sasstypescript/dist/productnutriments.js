class ProductNutriments {
    constructor(energy, fat, satfat, sugar, salt) {
        this.energy = energy;
        this.fat = fat;
        this.satfat = satfat;
        this.sugar = sugar;
        this.salt = salt;
    }
}
// On récupère les infos pour le tableau "Repères nutritionnels"
export function getNutriments(data) {
    const nbFormat = new Intl.NumberFormat("fr-FR");
    const nutriEnergy = document.querySelector("#energy");
    const nutriFat = document.querySelector("#fat");
    const nutriSatFat = (document.querySelector("#saturated-fat"));
    const nutriSugar = document.querySelector("#sugar");
    const nutriSalt = document.querySelector("#salt");
    if (Object.keys(data.product.nutriments).length === 0) {
        nutriEnergy.innerHTML = "?";
        nutriFat.innerHTML = "?";
        nutriSatFat.innerHTML = "?";
        nutriSugar.innerHTML = "?";
        nutriSalt.innerHTML = "?";
    }
    else {
        const productNutriments = new ProductNutriments(data.product.nutriments["energy-kcal_100g"], data.product.nutriments.fat_100g, data.product.nutriments["saturated-fat_100g"], data.product.nutriments.sugars_100g, data.product.nutriments.salt_100g);
        nutriEnergy.innerHTML = isNaN(productNutriments.energy)
            ? "?"
            : nbFormat.format(productNutriments.energy) + " kcal";
        nutriFat.innerHTML = isNaN(productNutriments.fat)
            ? "?"
            : nbFormat.format(productNutriments.fat) +
                " g " +
                getNutrimentLevel(data, "fat");
        nutriSatFat.innerHTML = isNaN(productNutriments.satfat)
            ? "?"
            : nbFormat.format(productNutriments.satfat) +
                " g " +
                getNutrimentLevel(data, "saturated-fat");
        nutriSugar.innerHTML = isNaN(productNutriments.sugar)
            ? "?"
            : nbFormat.format(productNutriments.sugar) +
                " g " +
                getNutrimentLevel(data, "sugars");
        nutriSalt.innerHTML = isNaN(productNutriments.salt)
            ? "?"
            : nbFormat.format(productNutriments.salt) +
                " g " +
                getNutrimentLevel(data, "salt");
        console.log(productNutriments);
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
