import type { SVGProps } from 'react'

export type IconName =
  | 'arrow-down'
  | 'bookmark'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'close'
  | 'moon'
  | 'play'
  | 'refresh'
  | 'search'
  | 'sliders'
  | 'star'
  | 'sun'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {name === 'arrow-down' && (
        <path d="M12 4v15m0 0 6-6m-6 6-6-6" />
      )}
      {name === 'bookmark' && (
        <path d="M6.75 4.75A1.75 1.75 0 0 1 8.5 3h7A1.75 1.75 0 0 1 17.25 4.75V21l-5.25-3-5.25 3V4.75Z" />
      )}
      {name === 'check' && <path d="m5 12 4.25 4.25L19 6.5" />}
      {name === 'chevron-down' && <path d="m5 9 7 7 7-7" />}
      {name === 'chevron-left' && <path d="m14.5 5-7 7 7 7" />}
      {name === 'chevron-right' && <path d="m9.5 5 7 7-7 7" />}
      {name === 'clock' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3.5 2" />
        </>
      )}
      {name === 'close' && <path d="m6 6 12 12M18 6 6 18" />}
      {name === 'moon' && (
        <path d="M19.3 15.1A7.5 7.5 0 0 1 8.9 4.7 7.6 7.6 0 1 0 19.3 15.1Z" />
      )}
      {name === 'play' && <path d="m9 6 9 6-9 6V6Z" />}
      {name === 'refresh' && (
        <>
          <path d="M20 11a8 8 0 0 0-14.8-3.9L4 9" />
          <path d="M4 5v4h4M4 13a8 8 0 0 0 14.8 3.9L20 15" />
          <path d="M20 19v-4h-4" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="10.8" cy="10.8" r="6.5" />
          <path d="m16 16 4 4" />
        </>
      )}
      {name === 'sliders' && (
        <>
          <path d="M4 7h16M4 17h16" />
          <circle cx="9" cy="7" r="2" />
          <circle cx="15" cy="17" r="2" />
        </>
      )}
      {name === 'star' && (
        <path
          d="m12 3 2.75 5.57 6.15.9-4.45 4.34 1.05 6.13L12 17.05l-5.5 2.89 1.05-6.13L3.1 9.47l6.15-.9L12 3Z"
          fill="currentColor"
          stroke="none"
        />
      )}
      {name === 'sun' && (
        <>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v2M12 19.5v2M4.07 4.07l1.42 1.42m13.02 13.02 1.42 1.42M2.5 12h2m15 0h2M4.07 19.93l1.42-1.42M18.51 5.49l1.42-1.42" />
        </>
      )}
    </svg>
  )
}

export default Icon
