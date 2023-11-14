import type { BaseModel, RecordModel } from 'pocketbase';

export interface ListItem {
	value: string;
	/** Id of the list that this item belongs to */
	list: string;
}

export type ListItemRecord = ListItem & RecordModel;

export interface ListModel extends BaseModel {
	title: string;
}

export type ListWithItems = ListModel & { items: ListItemRecord[] };
