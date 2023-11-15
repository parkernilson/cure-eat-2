import type { RecordModel } from 'pocketbase';


export type List = {
	title: string;
	owner: string;
}
export type ListItem = {
	value: string;
	list: string;
}

export type ListRecord = List & RecordModel;

export type ListItemRecord = ListItem & RecordModel;

export type ListWithItemsRecord = ListRecord & { items: ListItemRecord[] };
