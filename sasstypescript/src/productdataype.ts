export type ProductData = {
    code: string;
    status: number;
    product: {
        additives_original_tags: string[];
        allergens: string;
        brands: string;
        categories: string;
        ecoscore_grade: string;
        image_front_url: string;
        ingredients_analysis_tags: string[];
        ingredients_text_debug: string;
        ingredients_text_en: string;
        ingredients_text_fr: string;
        labels: string;
        nova_group: number;
        nutrient_levels: {
            fat: string;
            salt: string;
            "saturated-fat": string;
            sugars: string;
        };
        nutriments: {
            "energy-kcal_100g": number;
            fat_100g: number;
            salt_100g: number;
            "saturated-fat_100g": number;
            sugars_100g: number;
        };
        nutriscore_grade: string;
        product_name: string;
        quantity: string;
    };
};
