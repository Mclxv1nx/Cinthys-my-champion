import { useMemo } from 'react'
import type { CSSProperties } from 'react'

const CORAZONES = ['💗', '💜', '🤍', '✨', '💞']

/**
 * Fondo de toda la página: auroras que respiran, una malla de puntos
 * y corazones que suben despacito. Todo es CSS — nada de canvas.
 */
export function Fondo() {
  const corazones = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: CORAZONES[i % CORAZONES.length],
        estilo: {
          left: `${(i * 7.3 + 4) % 96}%`,
          fontSize: `${10 + ((i * 5) % 16)}px`,
          animationDuration: `${17 + ((i * 3.1) % 14)}s`,
          animationDelay: `${-(i * 2.4) % 24}s`,
          '--deriva': `${((i % 5) - 2) * 26}px`,
          '--giro': `${((i % 4) - 2) * 22}deg`,
          '--op': `${0.16 + ((i % 4) * 0.09)}`,
        } as CSSProperties,
      })),
    [],
  )

  return (
    <div className="fondo" aria-hidden="true">
      <div className="fondo__aurora fondo__aurora--rosa" />
      <div className="fondo__aurora fondo__aurora--violeta" />
      <div className="fondo__aurora fondo__aurora--oro" />
      <div className="fondo__malla" />
      <div className="fondo__grano" />

      <div className="fondo__corazones">
        {corazones.map((c) => (
          <span key={c.id} className="fondo__corazon" style={c.estilo}>
            {c.emoji}
          </span>
        ))}
      </div>
    </div>
  )
}
