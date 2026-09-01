import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Premio } from '@/data/premios'

type Props = {
  caras: Premio[]
  /** Rotación absoluta en grados (siempre creciente). */
  rotacion: number
  /** Duración de la transición en ms. */
  duracion: number
  /** Para el `aria-label`. */
  posicion: number
}

/**
 * Un rodillo de verdad: las caras están pegadas por dentro a un cilindro
 * con `rotateX(i·paso) translateZ(radio)`. Girar el rodillo es girar el
 * cilindro entero. Puro CSS 3D, sin imágenes ni trucos.
 */
export function Rodillo({ caras, rotacion, duracion, posicion }: Props) {
  const ventana = useRef<HTMLDivElement>(null)
  const [radio, setRadio] = useState(120)

  const n = caras.length
  const paso = 360 / n

  /* El radio del cilindro sale del alto real de la ventana. */
  useLayoutEffect(() => {
    const medir = () => {
      const alto = ventana.current?.offsetHeight ?? 128
      setRadio(Math.round(alto / 2 / Math.tan(Math.PI / n)))
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [n])

  const indiceFrente = ((Math.round(-rotacion / paso) % n) + n) % n

  return (
    <div
      className="rodillo"
      ref={ventana}
      role="img"
      aria-label={`Rodillo ${posicion}: ${caras[indiceFrente]?.nombre ?? ''}`}
    >
      <div
        className="rodillo__cilindro"
        style={
          {
            transform: `rotateX(${rotacion}deg)`,
            transitionDuration: `${duracion}ms`,
          } as CSSProperties
        }
      >
        {caras.map((c, i) => (
          <div
            key={c.id}
            className="rodillo__cara"
            style={
              {
                transform: `rotateX(${i * paso}deg) translateZ(${radio}px)`,
                '--tinte': c.color,
              } as CSSProperties
            }
          >
            <span className="rodillo__icono">{c.icono}</span>
            <span className="rodillo__nombre">{c.nombre}</span>
          </div>
        ))}
      </div>

      {/* Vidrio curvo de la ventanita */}
      <span className="rodillo__vidrio" aria-hidden="true" />
      <span className="rodillo__linea" aria-hidden="true" />
    </div>
  )
}
