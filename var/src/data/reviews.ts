import type { Movie } from '../types/movie'
import type { MovieReview } from '../types/review'

const authors = ['Анна', 'Михаил', 'Екатерина', 'Даниил', 'София', 'Илья', 'Вера', 'Артём']

const reviewCopy: Record<Movie['genre'], readonly [string, string]> = {
  драма: [
    'Сильная история с героями, которым веришь до самого финала.',
    'После титров хочется ещё немного побыть в этом мире.',
  ],
  комедия: [
    'Лёгкое, тёплое и очень вовремя смешное кино на вечер.',
    'Отличный темп: улыбка не сходит с лица, но и героям сопереживаешь.',
  ],
  фантастика: [
    'Красивый мир и история, которую интересно собирать по деталям.',
    'Идеальный вариант, если хочется на пару часов оказаться в другом мире.',
  ],
  триллер: [
    'Напряжение держится до финала, а развязку хочется обсудить.',
    'Умный и атмосферный триллер без лишних сцен — смотрится на одном дыхании.',
  ],
}

function getStableIndex(value: string, length: number) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash % length
}

function clampRating(value: number) {
  return Math.max(1, Math.min(5, value))
}

export function getDefaultReviews(movie: Movie): MovieReview[] {
  const index = getStableIndex(movie.id, authors.length)
  const firstRating = clampRating(Math.round(movie.rating / 2))
  const secondRating = clampRating(firstRating - (index % 2))
  const [firstComment, secondComment] = reviewCopy[movie.genre]

  return [
    {
      id: `seed-${movie.id}-first`,
      author: authors[index],
      comment: firstComment,
      rating: firstRating,
      createdAt: '2026-10-18T12:00:00.000Z',
    },
    {
      id: `seed-${movie.id}-second`,
      author: authors[(index + 3) % authors.length],
      comment: secondComment,
      rating: secondRating,
      createdAt: '2026-10-20T12:00:00.000Z',
    },
  ]
}
