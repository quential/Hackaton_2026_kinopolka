import Icon from './Icon'

type SectionHeadingProps = {
  actionLabel?: string
  eyebrow?: string
  onAction?: () => void
  title: string
}

export function SectionHeading({
  actionLabel,
  eyebrow,
  onAction,
  title,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {actionLabel && onAction && (
        <button className="text-action" onClick={onAction} type="button">
          <Icon name="refresh" size={17} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
