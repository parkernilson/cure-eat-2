import type { RecordModel } from 'pocketbase';
import type { ProductRecord } from '../products';

export type SupportedColor =
	| 'red'
	| 'blue'
	| 'green'
	| 'yellow'
	| 'purple'
	| 'pink'
	| 'orange'
	| 'gray';
export const isSupportedColor = (color: string): color is SupportedColor =>
	color === 'red' ||
	color === 'blue' ||
	color === 'green' ||
	color === 'yellow' ||
	color === 'purple' ||
	color === 'pink' ||
	color === 'orange' ||
	color === 'gray';

export type List = {
	title: string;
	color: SupportedColor;
	owner: string;
	location_id: string;
	location_name: string;
};
export type ListItem = {
	value: string;
	list: string;
	ordinal: number;
	checked: boolean;
	product?: ProductRecord;
	search_term?: string;
};

export type ListRecord = List & RecordModel;

export type ListItemRecord = ListItem & RecordModel;

export type ListWithItemsRecord = ListRecord & { items: ListItemRecord[] };

export type ListItemExpanded = ListItemRecord & { expand?: { product?: ProductRecord } }
export type ListExpanded = ListWithItemsRecord & { expand?: { 'list_items(list)'?: ListItemExpanded[] } }
