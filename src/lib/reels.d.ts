export type ReelTheme = 'dark' | 'light';

export interface ReelCover {
  dur: number;
  chapters: [string, number][];
  draw(g: CanvasRenderingContext2D, p: number, t: number): void;
}

export interface ReelRenderOptions {
  theme?: ReelTheme;
  width?: number;
  dpr?: number;
}

export declare const Reels: {
  COVERS: Record<string, ReelCover>;
  render(canvas: HTMLCanvasElement, key: string, p: number, opts?: ReelRenderOptions): void;
  W: number;
  H: number;
  THEMES: Record<ReelTheme, Record<string, string>>;
};
