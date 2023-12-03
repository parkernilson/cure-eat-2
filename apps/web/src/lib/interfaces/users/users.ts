import type { RecordModel } from "pocketbase"

export type User = {
    name: string
} 

export type UserRecord = User & RecordModel