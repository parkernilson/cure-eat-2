interface ProductItemModel {
    itemId: string
    inventory: {
        stockLevel: "HIGH" | "LOW" | "TEMPORARILY_OUT_OF_STOCK"
    }
    favorite: boolean
    fulfillment: {
        curbside: boolean
        delivery: boolean
        instore: boolean
        shiptohome: boolean
    }
    price: {
        regular: number
        promo: number
        regularPerUnitEstimate: number
        promoPerUnitEstimate: number
    }
    nationalPrice: {
        regular: number
        promo: number
        regularPerUnitEstimate: number
        promoPerUnitEstimate: number
    }
    size: string
    soldBy: string
}

interface AisleLocation {
    bayNumber: string
    description: string
    number: string
    numberOfFacings: string
    sequenceNumber: string
    side: string
    shelfNumber: string
    shelfPositionInBay: string
}

interface ProductModel {
    productId: string
    aisleLocations: AisleLocation[]
    brand: string
    categories: string[]
    countryOrigin: string
    description: string
    items: ProductItemModel[]
    itemInformation: {
        depth: string
        height: string
        width: string
    }
    temperature: {
        indicator: string
        heatSensitive: boolean
    }
    images: {
        id: string
        perspective: string
        default: boolean
        sizes: {
            id: string
            size: string
            url: string
        }[]
    }[]
    upc: string
}

export interface KrogerProductSearchResponse {
    data: ProductModel[]
    meta: {
        pagination: {
            total: number
            start: number
            limit: number
        }
        warnings: string[]
    }
}