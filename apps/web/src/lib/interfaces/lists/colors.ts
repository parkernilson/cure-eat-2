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