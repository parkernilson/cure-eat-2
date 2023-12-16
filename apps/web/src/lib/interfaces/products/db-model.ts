import type { RecordModel } from "pocketbase"

export interface Product {
    /** The id this product has in its original context (e.g. Kroger's system) */
    external_id: string
    location_id: string
    /** The id to the list record this product belongs to */
    list: string
    name: string
    price: string
}

export type ProductRecord = Product & RecordModel