import type { BaseModel } from 'pocketbase';

export interface ListItem {
	value: string;
	/** Id of the list that this item belongs to */
	list: string;
}

export type ListItemModel = ListItem & BaseModel

export const isListItemModel = (item: Partial<ListItemModel>): item is ListItemModel =>
	"list" in item && typeof item.list === "string" &&
	"value" in item && typeof item.value === "string" &&
	"id" in item && typeof item.id === "string" &&
	"created" in item && typeof item.id === "string" &&
	"updated" in item && typeof item.updated === "string"

export interface ListModel extends BaseModel {
	title: string;
}

export type ListWithItems = ListModel & { items: ListItemModel[] };
