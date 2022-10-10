import { ProductData } from "./productdataype";

class ProductScores {
    nutriscore: string;
    novascore: number;
    ecoscore: string;

    constructor(nutriscore: string, novascore: number, ecoscore: string) {
        this.nutriscore = nutriscore;
        this.novascore = novascore;
        this.ecoscore = ecoscore;
    }
}

// On récupère les scores et on affiche les bonnes images
export function getScores(data: ProductData) {
    const scores = new ProductScores(
        data.product.nutriscore_grade,
        data.product.nova_group,
        data.product.ecoscore_grade
    );

    const ecoScore = <HTMLImageElement>document.querySelector("#ecoscore");
    const nutriScore = <HTMLImageElement>document.querySelector("#nutriscore");
    const novaScore = <HTMLImageElement>document.querySelector("#novascore");

    let ecoscoreSrc: string;
    let nutricoreSrc: string;
    let novascoreSrc: string;

    if (!scores.ecoscore) {
        ecoscoreSrc = "/img/ecoscore-na.svg";
    } else if (scores.ecoscore.match(/^[a-e]$/)) {
        ecoscoreSrc = "/img/ecoscore-" + scores.ecoscore + ".svg";
    } else {
        ecoscoreSrc = "/img/ecoscore-na.svg";
    }

    if (!scores.nutriscore) {
        nutricoreSrc = "/img/nutriscore-na.svg";
    } else if (scores.nutriscore.match(/^[a-e]$/)) {
        nutricoreSrc = "/img/nutriscore-" + scores.nutriscore + ".svg";
    } else {
        nutricoreSrc = "/img/nutri-na.svg";
    }

    if (!scores.novascore) {
        novascoreSrc = "/img/nova-na.svg";
    } else if (!isNaN(scores.novascore)) {
        novascoreSrc = "/img/nova-" + scores.novascore + ".svg";
    } else {
        novascoreSrc = "/img/nova-na.svg";
    }

    nutriScore.src = nutricoreSrc;
    novaScore.src = novascoreSrc;
    ecoScore.src = ecoscoreSrc;
}
