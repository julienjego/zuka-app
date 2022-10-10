import { ProductData } from "./productdataype";

class ProductAnalysis {
    palmoil: string;
    vegan: string;
    vegetarian: string;

    constructor(palmoil: string, vegan: string, vegetarian: string) {
        this.palmoil = palmoil;
        this.vegan = vegan;
        this.vegetarian = vegetarian;
    }
}

const productAnalysisEl = <HTMLDivElement>(
    document.querySelector("#analysis-labels")
);

let palmOilLabel = document.createElement("div");
let veganLabel = document.createElement("div");
let vegatarianLabel = document.createElement("div");

// On récupère les infos sur le statut "huile de palme", "vegan" et "végé" et on affiche les bons labels
export function getAnalysis(data: ProductData) {
    productAnalysisEl.innerHTML = "";
    if (!data.product.ingredients_analysis_tags) {
        productAnalysisEl.innerHTML = "Rien à afficher ici...";
    } else {
        const productAnalysis = new ProductAnalysis("", "", "");

        // Labels huile de palme
        switch (data.product.ingredients_analysis_tags[0]) {
            case "en:palm-oil":
                productAnalysis.palmoil = "true";
                break;
            case "en:palm-oil-free":
                productAnalysis.palmoil = "false";
                break;
            case "en:palm-oil-content-unknown":
            case "en:may-contain-palm-oil":
            default:
                productAnalysis.palmoil = "unknown";
                break;
        }

        // Labels vegan
        switch (data.product.ingredients_analysis_tags[1]) {
            case "en:non-vegan":
                productAnalysis.vegan = "false";
                break;
            case "en:vegan":
                productAnalysis.vegan = "true";
                break;
            case "en:vegan-status-unknown":
            case "en:maybe-vegan":
            default:
                productAnalysis.vegan = "unknown";
                break;
        }

        // Labels végé
        switch (data.product.ingredients_analysis_tags[2]) {
            case "en:non-vegetarian":
                productAnalysis.vegetarian = "false";

                break;
            case "en:vegetarian":
                productAnalysis.vegetarian = "true";

                break;
            case "en:vegetarian-status-unknown":
            case "en:maybe-vegetarian":
            default:
                productAnalysis.vegetarian = "unknown";

                break;
        }

        isPalmOil(productAnalysis.palmoil);
        isVegan(productAnalysis.vegan);
        isVegetarian(productAnalysis.vegetarian);
    }
}

function isPalmOil(s: string): void {
    if (s === "true") {
        palmOilLabel.setAttribute("class", "red-ingredients-label");
        palmOilLabel.innerHTML =
            "<img src='/img/palm.svg' alt='icon-palm-oil'>&nbsp;Huile de palme";
        productAnalysisEl.appendChild(palmOilLabel);
    } else if (s === "false") {
        palmOilLabel.setAttribute("class", "green-ingredients-label");
        palmOilLabel.innerHTML =
            "<img src='/img/palm.svg' alt='icon-palm-oil'>&nbsp;Sans huile de palme";
        productAnalysisEl.appendChild(palmOilLabel);
    } else {
        palmOilLabel.setAttribute("class", "unknown-ingredients-label");
        palmOilLabel.innerHTML = "&nbsp;Présence huile de palme inconnue";
        productAnalysisEl.appendChild(palmOilLabel);
    }
}

function isVegan(s: string): void {
    if (s === "true") {
        veganLabel.setAttribute("class", "green-ingredients-label");
        veganLabel.innerHTML =
            "<img src='/img/vegan.svg' alt='icon-vegan'>&nbsp;Vegan";
        productAnalysisEl.appendChild(veganLabel);
    } else if (s === "false") {
        veganLabel.setAttribute("class", "red-ingredients-label");
        veganLabel.innerHTML =
            "<img src='/img/vegan.svg' alt='icon-vegan'>&nbsp;Non vegan";
        productAnalysisEl.appendChild(veganLabel);
    } else {
        veganLabel.setAttribute("class", "unknown-ingredients-label");
        veganLabel.innerHTML = "&nbsp;Caractère vegan inconnu";
        productAnalysisEl.appendChild(veganLabel);
    }
}

function isVegetarian(s: string): void {
    if (s === "true") {
        vegatarianLabel.setAttribute("class", "green-ingredients-label");
        vegatarianLabel.innerHTML =
            "<img src='/img/vege.svg' alt='icon-vegetarian'>&nbsp;Végétarien";
        productAnalysisEl.appendChild(vegatarianLabel);
    } else if (s === "false") {
        vegatarianLabel.setAttribute("class", "red-ingredients-label");
        vegatarianLabel.innerHTML =
            "<img src='/img/vege.svg' alt='icon-vegetarian'>&nbsp;Non végétarien";
        productAnalysisEl.appendChild(vegatarianLabel);
    } else {
        vegatarianLabel.setAttribute("class", "unknown-ingredients-label");
        vegatarianLabel.innerHTML = "&nbsp;Caractère végétarien inconnu";
        productAnalysisEl.appendChild(vegatarianLabel);
    }
}
