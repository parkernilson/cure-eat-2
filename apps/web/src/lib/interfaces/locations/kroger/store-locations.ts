interface DayHours {
    open: string
    close: string
    open24: boolean
}

export interface KrogerStoreLocation {
    address: {
        addressLine1: string
        addressLine2?: string
        city: string
        county: string
        state: string
        zipCode: string
    }
    chain: string
    phone: string
    departments: {
        departmentId: string
        name: string
        phone: string
        hours: {
            Open24: boolean
            monday: DayHours
            tuesday: DayHours
            wednesday: DayHours
            thursday: DayHours
            friday: DayHours
            saturday: DayHours
            sunday: DayHours
        }
    }[]
    geolocation: {
        latLng: string
        latitute: string
        longitude: string
    } 
    hours: {
        Open24: boolean
        gmtOffset: string
        timezone: string
        monday: DayHours
        tuesday: DayHours
        wednesday: DayHours
        thursday: DayHours
        friday: DayHours
        saturday: DayHours
        sunday: DayHours
    }
    locationId: string
    storeNumber: string
    divisionNumber: string
    name: string
}

export interface KrogerStoreLocationResponse {
    data: KrogerStoreLocation[]
    meta: {
        pagination: {
            total: number
            start: number
            limit: number
        }
        warnings: string[]
    }
}