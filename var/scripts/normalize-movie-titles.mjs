import { readFile, writeFile } from 'node:fs/promises'

const dataPath = new URL('../src/data/movies.json', import.meta.url)
const titleOverrides = {
  'The Florida Project': 'Проект Флорида',
  'The Theory of Everything': 'Вселенная Стивена Хокинга',
  'Wild Strawberries': 'Земляничная поляна',
  'Hot Fuzz': 'Типа крутые легавые',
  'Shaun of the Dead': 'Зомби по имени Шон',
  "Monty Python's Life of Brian": 'Житие Брайана по Монти Пайтону',
  "Howl's Moving Castle": 'Ходячий замок',
  'The Boy and the Heron': 'Мальчик и птица',
  'Nausicaä of the Valley of the Wind': 'Навсикая из долины ветров',
}

const movies = JSON.parse(await readFile(dataPath, 'utf8'))
let changed = 0

for (const movie of movies) {
  const nextTitle = titleOverrides[movie.originalTitle]
  if (nextTitle && movie.title !== nextTitle) {
    movie.title = nextTitle
    changed += 1
  }
}

await writeFile(dataPath, `${JSON.stringify(movies, null, 2)}\n`)
console.log(`Нормализовано названий: ${changed}`)
