import Icon from './Icon'
import { BrandMark } from './BrandMark'

type WelcomeScreenProps = {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <main className="welcome-screen">
      <div className="welcome-screen__glow" />
      <div className="welcome-screen__content">
        <BrandMark className="welcome-screen__mark" />
        <h1>КИНОПОЛКА</h1>
        <p>Фильм на вечер — за минуту</p>
      </div>
      <button className="scroll-cue" onClick={onContinue} type="button">
        <Icon name="chevron-down" size={17} />
        <span>Листать вниз</span>
      </button>
    </main>
  )
}
