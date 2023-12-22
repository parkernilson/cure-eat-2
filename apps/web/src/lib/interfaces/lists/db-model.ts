import type { RecordModel } from 'pocketbase';
import type { ProductRecord } from '../products';
import type { SupportedColor } from './colors';

export type ListRaw = {
	title: string;
	color: SupportedColor;
	owner: string;
	location_id?: string;
	location_name?: string;
};

export const isListRaw = (obj: { [key: string]: unknown }): obj is ListRaw => {
	return (
		typeof obj.title === 'string' &&
		typeof obj.color === 'string' &&
		typeof obj.owner === 'string' &&
		typeof obj.location_id === 'string' || obj.location_id === undefined &&
		typeof obj.location_name === 'string' || obj.location_name === undefined
	);
}

export type ListItemRaw = {
	value: string;
	list: string;
	ordinal: number;
	checked: boolean;
	product?: string;
	search_term?: string;
};

export type ListItem = Omit<ListItemRaw, 'product'> & { product?: ProductRecord }
export type ListItemRecord = ListItem & RecordModel;
export type ListItemRawRecord = ListItemRaw & RecordModel;

export type ListRecord = ListRaw & RecordModel & { items: ListItemRecord[] };
export type ListRawRecord = ListRaw & RecordModel;

export type ListItemExpanded = ListItemRawRecord & { expand?: { product?: ProductRecord } }
export type ListExpanded = ListRawRecord & { expand?: { 'list_items(list)'?: ListItemExpanded[] } }