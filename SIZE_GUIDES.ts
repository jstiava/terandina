"use server"

const SIZE_GUIDES = {
    "hoodies": {
        name: "Hoodies",
        data: [
            ["Size", "M", "L", "XL"],
            ["Length", "0.00 in", "28.00 in", "0.00 in"],
            ["Chest", "0.00 in", "22.75 in", "0.00 in"],
            ["Waist", "0.00 in", "21.50 in", "0.00 in"],
            ["Shoulder Width", "0.00 in", "19.00 in", "0.00 in"],
            ["Sleeve Length", "0.00 in", "26.50 in", "0.00 in"],
        ],
        notes: "Measured flat straight across. Sizes are approximate.\nMedium and Extra Large sizes are currently not avaliable."
    },
    "cardigans": {
        name: "Cardigans",
        data: [
            ["Size", "L", "XL"],
            ["Length", "27.30 in", "0.00 in"],
            ["Chest", "22.35 in", "0.00 in"],
            ["Waist", "20.50 in", "0.00 in"],
            ["Shoulder Width", "17.55 in", "0.00 in"],
            ["Sleeve Length", "26.00 in", "0.00 in"],
        ],
        notes: "Measured flat straight across. Sizes are approximate.\nExtra Large size currently not avaliable."
    },
    "blankets": {
        name: "Blankets",
        data: [
            ["Size", "Queen"],
            ["Width", "83.00 in"],
            ["Length", "89.00 in"],
        ],
        notes: "Measured flat and fully open. Sizes are approximate."
    },
    "lightweight_alpaca_poncho": {
        name: "Lightweight Alpaca Ponchos",
        data: [
            ["Size", "One-Size"],
            ["Width", "44.00 in"],
            ["Length", "69.00 in"],
        ],
        notes: "Measured flat and fully open. Sizes are approximate."
    },
    "heavy_wool_poncho": {
        name: "Heavy Wool Ponchos",
        data: [
            ["Size", "One-Size"],
            ["Width", "51.00 in"],
            ["Length", "73.75 in"],
        ],
        notes: "Measured flat and fully open. Sizes are approximate."
    },
    "classic_alpaca_poncho": {
        name: "Classic Alpaca Ponchos",
        data: [
            ["Size", "One-Size"],
            ["Width", "53.00 in"],
            ["Length", "68.25 in"],
        ],
        notes: "Measured flat and fully open. Sizes are approximate."
    },
}

export default SIZE_GUIDES;