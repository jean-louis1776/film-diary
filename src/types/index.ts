export interface FilmCategory {
  id: string
  name: string
  iso: string
  description: string
  accent: string
  bg: string
  tag: string
  frameCount: number
}

export interface Photo {
  id: string
  url: string
  thumb: string
  width: number
  height: number
  frame: string
  keyword: string
}
