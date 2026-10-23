import { useState } from 'react'
import Icon from './Icon'

type StarRatingProps = {
  onChange: (rating: number) => void
  value: number | null
}

export function StarRating({ onChange, value }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const activeRating = hoveredRating ?? value ?? 0

  return (
    <div
      aria-label="Ваша оценка"
      className="star-rating"
      onMouseLeave={() => setHoveredRating(null)}
      role="radiogroup"
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          aria-checked={value === rating}
          aria-label={`Поставить оценку ${rating} из 5`}
          className={`star-rating__button ${rating <= activeRating ? 'is-active' : ''}`}
          key={rating}
          onBlur={() => setHoveredRating(null)}
          onClick={() => onChange(rating)}
          onFocus={() => setHoveredRating(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          role="radio"
          type="button"
        >
          <Icon name="star" size={20} />
        </button>
      ))}
    </div>
  )
}
