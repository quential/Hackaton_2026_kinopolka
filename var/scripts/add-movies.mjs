import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const dataPath = path.join(root, 'src/data/movies.json')
const postersPath = path.join(root, 'public/posters')
const omdbKey = process.env.OMDB_API_KEY || 'thewdb'
const requestConcurrency = 4
const imdbOverrides = {
  "Schindler's List|1993": 'tt0108052',
  'The Good, the Bad and the Ugly|1966': 'tt0060196',
  'Se7en|1995': 'tt0114369',
  'Room|2015': 'tt3170832',
  'Memento|2000': 'tt0209144',
  'Up|2009': 'tt1049413',
  'Indiana Jones and the Raiders of the Lost Ark|1981': 'tt0082971',
}
const rutubeOverrides = {
  'The Good, the Bad and the Ugly|1966': {
    title: 'Хороший, плохой, злой',
    url: 'https://rutube.ru/video/deb07e579b7e3048294a3ad7378d7796/',
  },
  'Room|2015': {
    title: 'Комната',
    url: 'https://rutube.ru/video/1242d61a9ddbd6012b9374dba64646cc/',
  },
}
const russianTitleOverrides = {
  Memento: 'Помни',
  'The Wailing': 'Вопль',
  'Train to Busan': 'Поезд в Пусан',
  'Gone Girl': 'Исчезнувшая',
  Nightcrawler: 'Стрингер',
  Up: 'Вверх',
  'The Thing': 'Нечто',
  Alien: 'Чужой',
  Aliens: 'Чужие',
  'The Iron Giant': 'Стальной гигант',
  'The King\'s Speech': 'Король говорит',
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

const movieSeeds = [
  ['12 Angry Men', 1957],
  ["Schindler's List", 1993],
  ["One Flew Over the Cuckoo's Nest", 1975],
  ['The Godfather Part II', 1974],
  ['The Good, the Bad and the Ugly', 1966],
  ['The Silence of the Lambs', 1991],
  ['Saving Private Ryan', 1998],
  ['The Lives of Others', 2006],
  ['The Hunt', 2012],
  ['The Father', 2020],
  ['Manchester by the Sea', 2016],
  ['Room', 2015],
  ['The Florida Project', 2017],
  ['Moonlight', 2016],
  ['Spotlight', 2015],
  ['The Help', 2011],
  ["The King's Speech", 2010],
  ['The Theory of Everything', 2014],
  ['Dallas Buyers Club', 2013],
  ['The Whale', 2022],
  ['The Holdovers', 2023],
  ['The Banshees of Inisherin', 2022],
  ['The Irishman', 2019],
  ['The Great Dictator', 1940],
  ['Modern Times', 1936],
  ['City Lights', 1931],
  ['Bicycle Thieves', 1948],
  ['Tokyo Story', 1953],
  ['Wild Strawberries', 1957],
  ['A Separation', 2011],
  ['Se7en', 1995],
  ['The Usual Suspects', 1995],
  ['Memento', 2000],
  ['Zodiac', 2007],
  ['Heat', 1995],
  ['Casino', 1995],
  ['Scarface', 1983],
  ['Snatch', 2000],
  ['Lock, Stock and Two Smoking Barrels', 1998],
  ['The Hateful Eight', 2015],
  ['Reservoir Dogs', 1992],
  ['The Big Lebowski', 1998],
  ['American History X', 1998],
  ['Prisoners', 2013],
  ['Gone Girl', 2014],
  ['Nightcrawler', 2014],
  ['The Girl with the Dragon Tattoo', 2011],
  ['The Sixth Sense', 1999],
  ['The Machinist', 2004],
  ['The Lighthouse', 2019],
  ['The Menu', 2022],
  ['The Handmaiden', 2016],
  ['Memories of Murder', 2003],
  ['Oldboy', 2003],
  ['Train to Busan', 2016],
  ['The Wailing', 2016],
  ['The Invisible Man', 2020],
  ['The Thing', 1982],
  ['Alien', 1979],
  ['Aliens', 1986],
  ['Star Wars: Episode IV - A New Hope', 1977],
  ['Star Wars: Episode V - The Empire Strikes Back', 1980],
  ['Star Wars: Episode VI - Return of the Jedi', 1983],
  ['Rogue One: A Star Wars Story', 2016],
  ['The Terminator', 1984],
  ['Terminator 2: Judgment Day', 1991],
  ['Jurassic Park', 1993],
  ['Back to the Future', 1985],
  ['Back to the Future Part II', 1989],
  ['E.T. the Extra-Terrestrial', 1982],
  ['2001: A Space Odyssey', 1968],
  ['WALL-E', 2008],
  ['Up', 2009],
  ['Coco', 2017],
  ['Toy Story', 1995],
  ['Finding Nemo', 2003],
  ['Ratatouille', 2007],
  ["Howl's Moving Castle", 2004],
  ['Princess Mononoke', 1997],
  ['Your Name.', 2016],
  ['The Iron Giant', 1999],
  ['The Incredibles', 2004],
  ['Spider-Man: Into the Spider-Verse', 2018],
  ['Soul', 2020],
  ['The Boy and the Heron', 2023],
  ['My Neighbor Totoro', 1988],
  ["Kiki's Delivery Service", 1989],
  ['Nausicaä of the Valley of the Wind', 1984],
  ['Pirates of the Caribbean: The Curse of the Black Pearl', 2003],
  ['Indiana Jones and the Raiders of the Lost Ark', 1981],
  ['Indiana Jones and the Last Crusade', 1989],
  ['The Mummy', 1999],
  ['The Martian', 2015],
  ['Gravity', 2013],
  ['Life of Pi', 2012],
  ['1917', 2019],
  ['Dunkirk', 2017],
  ['Top Gun: Maverick', 2022],
  ['Avatar: The Way of Water', 2022],
  ['Guardians of the Galaxy', 2014],
  ['The Avengers', 2012],
  ['Black Panther', 2018],
  ['Captain America: The Winter Soldier', 2014],
  ['Groundhog Day', 1993],
  ['Monty Python and the Holy Grail', 1975],
  ['Life of Brian', 1979],
  ['Hot Fuzz', 2007],
  ['Shaun of the Dead', 2004],
  ['Superbad', 2007],
  ['The Hangover', 2009],
  ['Mean Girls', 2004],
  ['The Devil Wears Prada', 2006],
  ['Little Miss Sunshine', 2006],
  ['(500) Days of Summer', 2009],
  ['Before Sunrise', 1995],
  ['Before Sunset', 2004],
  ['When Harry Met Sally...', 1989],
  ['The Apartment', 1960],
  ["Singin' in the Rain", 1952],
  ['Some Like It Hot', 1959],
  ['Notting Hill', 1999],
  ['Love Actually', 2003],
  ['Pride & Prejudice', 2005],
  ['The Worst Person in the World', 2021],
  ['The Lobster', 2015],
  ['Jojo Rabbit', 2019],
  ['The Farewell', 2019],
  ['The Perks of Being a Wallflower', 2012],
  ['Call Me by Your Name', 2017],
  ['Brooklyn', 2015],
  ['Past Lives', 2023],
  ['The Sound of Music', 1965],
  ['The Last Samurai', 2003],
  ['The Bridge on the River Kwai', 1957],
  ['Lawrence of Arabia', 1962],
  ['Apocalypse Now', 1979],
  ['Full Metal Jacket', 1987],
  ['Platoon', 1986],
  ['The Deer Hunter', 1978],
  ['There Will Be Blood', 2007],
  ['The Master', 2012],
  ['The Diving Bell and the Butterfly', 2007],
  ['The Secret in Their Eyes', 2009],
  ['The Trial of the Chicago 7', 2020],
  ['The Elephant Man', 1980],
  ['The Curious Case of Benjamin Button', 2008],
  ['The Pursuit of Happyness', 2006],
  ['Ford v Ferrari', 2019],
  ['The Batman', 2022],
  ['Logan', 2017],
]

const existingMovies = JSON.parse(await readFile(dataPath, 'utf8'))
const existingOriginalTitles = new Set(existingMovies.map((movie) => movie.originalTitle.toLowerCase()))

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function fetchJson(url, attempts = 3) {
  let lastError

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'kinopolka-catalog-seed/1.0' },
      })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return await response.json()
    } catch (error) {
      lastError = error
      await sleep(350 * (attempt + 1))
    }
  }

  throw lastError
}

async function translateText(text) {
  if (!text || text === 'N/A') return ''

  const url = new URL('https://translate.googleapis.com/translate_a/single')
  url.searchParams.set('client', 'gtx')
  url.searchParams.set('sl', 'en')
  url.searchParams.set('tl', 'ru')
  url.searchParams.set('dt', 't')
  url.searchParams.set('q', text)

  try {
    const payload = await fetchJson(url)
    return Array.isArray(payload?.[0])
      ? payload[0].map((part) => part?.[0] ?? '').join('').trim()
      : ''
  } catch {
    return ''
  }
}

function hasCyrillic(text) {
  return /[А-Яа-яЁё]/.test(text)
}

function cleanTitle(text, year) {
  return text
    .replace(/\([^)]*\)/g, ' ')
    .replace(new RegExp(`\\b${year}\\b`, 'g'), ' ')
    .replace(/\b(?:4k|hd|full hd|movie|фильм)\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/[|/—-]+$/g, '')
    .trim()
}

function getRussianTitle(resultTitle, originalTitle, year) {
  const parts = resultTitle.split(/\s*(?:\||\/|—|○|·)\s*/)
  const russianPart = parts.find(
    (part) => hasCyrillic(part) && !part.toLowerCase().includes(originalTitle.toLowerCase()),
  )

  return cleanTitle(russianPart ?? resultTitle, year)
}

function getSearchUrl(title, year) {
  const url = new URL('https://rutube.ru/search/')
  url.searchParams.set('query', `${title} ${year}`)
  return url.toString()
}

function normalizeSearchText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function getTitleRelevance(resultTitle, queryTitle) {
  const normalizedResultTitle = normalizeSearchText(resultTitle)
  const normalizedQueryTitle = normalizeSearchText(queryTitle)
  if (!normalizedResultTitle || !normalizedQueryTitle) return -120
  if (normalizedResultTitle === normalizedQueryTitle) return 120

  const stopWords = new Set(['the', 'and', 'of', 'a', 'an', 'part', 'episode', 'i', 'ii', 'iii', 'iv', 'v', 'vi'])
  const queryWords = normalizedQueryTitle.split(' ').filter((word) => word.length > 1 && !stopWords.has(word))
  if (normalizedResultTitle.includes(normalizedQueryTitle)) {
    return queryWords.length > 1 ? 100 : 55
  }
  if (queryWords.length === 0) return -120

  const matchingWords = queryWords.filter((word) => normalizedResultTitle.includes(word)).length
  const matchRatio = matchingWords / queryWords.length
  return matchRatio >= 0.8 ? 55 : -120
}

function getResultScore(result, queryTitle, year, runtime) {
  const resultTitle = String(result.title ?? '')
  const normalizedResultTitle = resultTitle.toLowerCase()
  const targetDuration = runtime * 60
  const duration = Number(result.duration) || 0
  const titleRelevance = getTitleRelevance(resultTitle, queryTitle)
  if (titleRelevance < 0) return -1000
  if (/саундтрек|музыкальн|трейлер|тизер|отрывок|клип|обзор|реценз|реакц|прохожд|геймплей|пранк|шортс|обсужд|разбор|мнение|впечатлен|серия|сезон|детективы|новая серия|попкорн|клуб|аниме|фрейд|soundtrack|trailer|teaser|clip|review|gameplay|walkthrough|reaction|music|discussion|episode|season/i.test(resultTitle)) {
    return -1000
  }

  let score = titleRelevance

  if (hasCyrillic(resultTitle)) score += 12
  if (normalizedResultTitle.includes(String(year))) score += 18
  if (result.category?.name === 'Фильмы') score += 8
  if (result.is_deleted || result.is_hidden || result.is_locked) score -= 100

  const mentionedYears = [...resultTitle.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]))
  if (mentionedYears.length > 0 && !mentionedYears.includes(year)) score -= 110

  if (targetDuration > 0 && duration > 0) {
    const difference = Math.abs(duration - targetDuration) / targetDuration
    if (difference <= 0.2) score += 95
    else if (difference <= 0.4) score += 50
    else if (difference <= 0.7) score += 8
    else score -= 45
  }

  return score
}

async function findRutubeVideo(originalTitle, year, runtime) {
  const override = rutubeOverrides[`${originalTitle}|${year}`]
  if (override) return override

  const translatedTitle = russianTitleOverrides[originalTitle] || (await translateText(originalTitle))
  const queries = [translatedTitle, originalTitle].filter(
    (query, index, allQueries) => query && allQueries.indexOf(query) === index,
  )

  for (const query of queries) {
    const searchUrl = new URL('https://rutube.ru/api/search/video/')
    searchUrl.searchParams.set('query', `${query} ${year}`)
    const payload = await fetchJson(searchUrl)
    const results = Array.isArray(payload?.results) ? payload.results : []
    const sortedResults = results
      .filter((result) => result.video_url)
      .sort(
        (first, second) =>
          getResultScore(second, query, year, runtime) - getResultScore(first, query, year, runtime),
      )
    const bestResult = sortedResults[0]
    const bestScore = bestResult ? getResultScore(bestResult, query, year, runtime) : -1000
    const titleRelevance = bestResult ? getTitleRelevance(bestResult.title, query) : -120
    const hasFilmCategory = bestResult?.category?.name === 'Фильмы'
    const hasExpectedYear = bestResult
      ? [...String(bestResult.title).matchAll(/\b(?:19|20)\d{2}\b/g)].every((match) => Number(match[0]) === year)
      : false

    if (
      bestResult &&
      bestScore >= 100 &&
      titleRelevance >= 55 &&
      hasFilmCategory &&
      (titleRelevance >= 100 || (hasExpectedYear && titleRelevance >= 55))
    ) {
      const localizedTitle = hasCyrillic(bestResult.title)
        ? getRussianTitle(bestResult.title, originalTitle, year)
        : translatedTitle || originalTitle
      return {
        title: russianTitleOverrides[originalTitle] || localizedTitle,
        url: bestResult.video_url,
      }
    }
  }

  const searchTitle = translatedTitle || originalTitle
  return {
    title: russianTitleOverrides[originalTitle] || searchTitle,
    url: getSearchUrl(searchTitle, year),
  }
}

function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseRuntime(runtime) {
  const minutes = Number.parseInt(String(runtime).replace(/,/g, ''), 10)
  return Number.isFinite(minutes) ? minutes : 110
}

function parseRating(rating) {
  const value = Number.parseFloat(rating)
  return Number.isFinite(value) && value > 0 ? Number(value.toFixed(1)) : 7
}

function parseVotes(votes) {
  const value = Number.parseInt(String(votes).replace(/,/g, ''), 10)
  return Number.isFinite(value) ? value : 1000
}

function normalizeTitle(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function getAgeRating(rated) {
  if (/G|TV-G/i.test(rated)) return '6+'
  if (/PG|TV-PG|TV-14/i.test(rated)) return '12+'
  if (/R|NC-17|TV-MA/i.test(rated)) return '18+'
  return '16+'
}

function getGenres(genreText) {
  const text = String(genreText ?? '').toLowerCase()
  const genres = []

  if (/comedy|musical|family/.test(text)) genres.push('комедия')
  if (/thriller|horror|crime|mystery|action/.test(text)) genres.push('триллер')
  if (/sci-fi|fantasy|adventure|animation/.test(text)) genres.push('фантастика')
  if (/drama|romance|biography|history|war|musical/.test(text)) genres.push('драма')

  return genres.length > 0 ? genres : ['драма']
}

function getPrimaryGenre(genres) {
  return genres[0]
}

function buildDescription(title, translatedPlot) {
  return translatedPlot || `История фильма «${title}», к которой хочется возвращаться.`
}

async function downloadPoster(url, targetPath, imdbId) {
  const sources = [url, `https://img.omdbapi.com/?apikey=${omdbKey}&i=${imdbId}`]
  let lastStatus = 'неизвестная ошибка'

  for (const source of sources) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(source, { headers: { 'user-agent': 'kinopolka-catalog-seed/1.0' } })
        if (!response.ok) {
          lastStatus = response.status
        } else {
          const image = Buffer.from(await response.arrayBuffer())
          if (image.length >= 1000) {
            await writeFile(targetPath, image)
            return
          }
          lastStatus = 'пустой файл'
        }
      } catch (error) {
        lastStatus = error instanceof Error ? error.message : String(error)
      }

      await sleep(300 * (attempt + 1))
    }
  }

  throw new Error(`${targetPath}: постер не загрузился: ${lastStatus}`)
}

async function createMovie([requestedTitle, requestedYear]) {
  const searchTerms = [
    requestedTitle,
    requestedTitle.replace(/[^a-z0-9]+/gi, ' ').replace(/\s{2,}/g, ' ').trim(),
  ].filter((term, index, terms) => terms.indexOf(term) === index)
  const searchResults = []

  for (const searchTerm of searchTerms) {
    for (const includeYear of [true, false]) {
      const searchUrl = new URL('https://www.omdbapi.com/')
      searchUrl.searchParams.set('apikey', omdbKey)
      searchUrl.searchParams.set('s', searchTerm)
      searchUrl.searchParams.set('type', 'movie')
      if (includeYear) searchUrl.searchParams.set('y', String(requestedYear))

      const search = await fetchJson(searchUrl)
      if (Array.isArray(search.Search)) searchResults.push(...search.Search)

      const hasExactTitle = searchResults.some(
        (result) => normalizeTitle(result.Title) === normalizeTitle(requestedTitle),
      )
      if (hasExactTitle) break
    }

    if (searchResults.some((result) => normalizeTitle(result.Title) === normalizeTitle(requestedTitle))) break
  }

  const uniqueSearchResults = [...new Map(searchResults.map((result) => [result.imdbID, result])).values()]
  const exactYearMatch = uniqueSearchResults.find(
    (result) =>
      normalizeTitle(result.Title) === normalizeTitle(requestedTitle) &&
      String(result.Year).startsWith(String(requestedYear)),
  )
  const exactMatch = uniqueSearchResults.find(
    (result) => normalizeTitle(result.Title) === normalizeTitle(requestedTitle),
  )
  const yearMatch = uniqueSearchResults.find((result) => String(result.Year).startsWith(String(requestedYear)))
  const selectedSearchResult = exactYearMatch ?? exactMatch ?? yearMatch ?? uniqueSearchResults[0]

  const overrideKey = `${requestedTitle}|${requestedYear}`
  const selectedImdbId = imdbOverrides[overrideKey] ?? selectedSearchResult?.imdbID

  if (!selectedImdbId) {
    throw new Error(`${requestedTitle}: фильм не найден в OMDb`)
  }

  const detailsUrl = new URL('https://www.omdbapi.com/')
  detailsUrl.searchParams.set('apikey', omdbKey)
  detailsUrl.searchParams.set('i', selectedImdbId)
  detailsUrl.searchParams.set('plot', 'full')

  const details = await fetchJson(detailsUrl)
  if (details.Response === 'False') throw new Error(`${requestedTitle}: ${details.Error}`)
  if (!details.imdbID || !details.Poster || details.Poster === 'N/A') {
    throw new Error(`${requestedTitle}: отсутствуют IMDb ID или постер`)
  }

  const year = requestedYear
  const runtime = parseRuntime(details.Runtime)
  const rutube = await findRutubeVideo(details.Title, year, runtime)
  const title = rutube.title || (await translateText(details.Title)) || details.Title
  const id = `${slugify(details.Title)}-${year}`
  const posterFile = `${id}.jpg`
  const posterTarget = path.join(postersPath, posterFile)
  const translatedPlot = await translateText(details.Plot)

  await downloadPoster(details.Poster, posterTarget, details.imdbID)

  const genres = getGenres(details.Genre)
  const cast = String(details.Actors ?? '')
    .split(',')
    .map((actor) => actor.trim())
    .filter((actor) => actor && actor !== 'N/A')
    .slice(0, 5)

  return {
    id,
    title,
    originalTitle: details.Title,
    year,
    genre: getPrimaryGenre(genres),
    genres,
    rating: parseRating(details.imdbRating),
    votes: parseVotes(details.imdbVotes),
    duration: runtime,
    country: String(details.Country ?? '').split(',')[0].trim() || 'США',
    ageRating: getAgeRating(details.Rated),
    director: details.Director && details.Director !== 'N/A' ? details.Director : 'Не указан',
    cast,
    tagline: `История, к которой хочется возвращаться после финальных титров.`,
    description: buildDescription(title, translatedPlot),
    poster: `/posters/${posterFile}`,
    posterSource: `/posters/${posterFile}`,
    watchUrl: rutube.url,
    isEditorsChoice: false,
  }
}

async function mapWithConcurrency(items, worker, concurrency) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function run() {
    while (true) {
      const index = nextIndex
      nextIndex += 1
      if (index >= items.length) return
      results[index] = await worker(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => run()))
  return results
}

await mkdir(postersPath, { recursive: true })

const newSeeds = movieSeeds.filter(([title]) => !existingOriginalTitles.has(title.toLowerCase()))
if (newSeeds.length !== 150) {
  throw new Error(`Ожидалось 150 новых фильмов, подготовлено ${newSeeds.length}`)
}

console.log(`Начинаю загрузку ${newSeeds.length} фильмов, постеров и ссылок Rutube…`)
const addedMovies = await mapWithConcurrency(
  newSeeds,
  async (seed, index) => {
    const movie = await createMovie(seed)
    console.log(`${index + 1}/${newSeeds.length} ${movie.title} — ${movie.watchUrl}`)
    return movie
  },
  requestConcurrency,
)

const nextMovies = [...existingMovies, ...addedMovies]
await writeFile(dataPath, `${JSON.stringify(nextMovies, null, 2)}\n`)

const directRutubeLinks = addedMovies.filter((movie) => movie.watchUrl.includes('/video/')).length
console.log(`Готово: ${addedMovies.length} добавлено, всего ${nextMovies.length}.`)
console.log(`Прямых ссылок на видео Rutube: ${directRutubeLinks}; ссылок на поиск: ${addedMovies.length - directRutubeLinks}.`)
