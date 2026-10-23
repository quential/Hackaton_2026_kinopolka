export const genreOptions = [
  'драма',
  'комедия',
  'фантастика',
  'триллер',
] as const

export type Genre = (typeof genreOptions)[number]
export type GenreFilter = Genre | 'all'
export type SortOption = 'rating' | 'year' | 'title'

export type Movie = {
  id: string
  title: string
  originalTitle: string
  year: number
  genre: Genre
  genres: string[]
  rating: number
  votes: number
  duration: number
  country: string
  ageRating: string
  director: string
  cast: string[]
  tagline: string
  description: string
  poster: string
  posterSource: string
  isEditorsChoice: boolean
}
