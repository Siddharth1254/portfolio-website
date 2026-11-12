export type Lang = 'en' | 'fr';

export type Localized<T> = Record<Lang, T>;

/** Inline rich text: plain strings, or `{ b }` segments rendered bold. */
export type RichText = (string | { b: string })[];
