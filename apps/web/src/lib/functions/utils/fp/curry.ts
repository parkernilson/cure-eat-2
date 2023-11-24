export const curry2 =
	<A, B, C>(fn: (a: A, b: B) => C) =>
	(a: A) =>
	(b: B) =>
		fn(a, b);

export const curry3 =
	<A, B, C, D>(fn: (a: A, b: B, c: C) => D) =>
	(a: A) =>
	(b: B) =>
	(c: C) =>
		fn(a, b, c);
