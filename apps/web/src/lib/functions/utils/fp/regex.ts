export const matchRegex = (regex: RegExp) => (s: string) => s.match(regex) ? true : false;
