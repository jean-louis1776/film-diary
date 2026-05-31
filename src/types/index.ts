export interface FilmCategory {
  id: string;
  name: string;
  iso: string;
  shots: number;
  description: string;
  accent: string;
  bg: string;
  tag: string;
  count: number;
}

export interface Photo {
  id: string;
  url: string;
  thumb: string;
  width: number;
  height: number;
  frame: string;
  keyword: string;
}
