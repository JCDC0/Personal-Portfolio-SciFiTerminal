import { setSound, useSound } from '../sound.js'

export default function SoundToggle() {
  const on = useSound()

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={on}
      aria-label={`Sound effects ${on ? 'on' : 'off'}`}
      onClick={() => setSound(!on)}
    >
      Sound: {on ? 'on' : 'off'}
    </button>
  )
}
