import moviesData from '../data/movies.json'
import type { Movie } from '../types/movie'

const movies = moviesData as Movie[]

export function fetchMovies(): Promise<Movie[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (movies.length === 0) {
        reject(new Error('Каталог пока пуст.'))
        return
      }

      resolve(movies)
    }, 420)
  })
}
