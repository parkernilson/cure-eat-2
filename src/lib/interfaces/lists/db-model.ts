import type { RecordModel } from 'pocketbase';

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
};
export type ListItem = {
	value: string;
	list: string;
};

export type ListRecord = List & RecordModel;

export type ListItemRecord = ListItem & RecordModel;

export type ListWithItemsRecord = ListRecord & { items: ListItemRecord[] };
