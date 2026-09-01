import { useEffect, useState } from 'react'
import { config } from '@/lib/config'
import { useTilt } from '@/hooks/useTilt'

function diasJuntos(desde: string): number {
  const inicio = new Date(`${desde}T00:00:00`)
  if (Number.isNaN(inicio.getTime())) return 0
  const ms = Date.now() - inicio.getTime()
  return Math.max(0, Math.floor(ms / 86_400_000))
}

/**
 * Portada. Una tarjeta 3D con su foto que se inclina siguiendo el dedo
 * (giroscopio en celular, puntero en desktop), sobre capas con profundidad.
 */
export function Hero() {
  const tarjeta = useTilt<HTMLDivElement>({ max: 12, alzar: 0 })
  const [dias, setDias] = useState(0)

  useEffect(() => {
    setDias(diasJuntos(config.fechas.nosConocimos))
  }, [])

  const bajar = () => {
    document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header id="inicio" className="hero">
      <div className="hero__interior contenedor">
        <div className="hero__texto">
          <p className="etiqueta hero__etiqueta">
            <span className="etiqueta__punto" aria-hidden="true" />
            Hecho solo para ti
          </p>

          <h1 className="hero__titulo">
            <span className="hero__hola">Hola,</span>
            <span className="hero__nombre grad">Cinthya Orbe</span>
          </h1>

          <p className="hero__lema">
            Mi <em>ganadora</em>. La que se lleva el premio sin ni siquiera competir.
          </p>

          <div className="hero__acciones">
            <button type="button" className="btn btn--principal" onClick={bajar}>
              Empezar a mirar
              <span aria-hidden="true">↓</span>
            </button>
            <a className="btn btn--fantasma" href="#premio">
              Ir directo a tu premio 🎰
            </a>
          </div>

          {dias > 0 && (
            <p className="hero__contador">
              <strong>{dias.toLocaleString('es-EC')}</strong> días desde que te conocí
            </p>
          )}
        </div>

        <div className="hero__marco" ref={tarjeta}>
          <div className="hero__tarjeta tilt">
            <div className="hero__halo" aria-hidden="true" />
            <img
              className="hero__foto"
              src="/media/portada.webp"
              alt="Retrato de Cinthya en el parque"
              width={900}
              height={1200}
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero__velo" aria-hidden="true" />
            <div className="tilt__brillo" aria-hidden="true" />

            <div className="hero__chapa">
              <span className="hero__chapa-icono" aria-hidden="true">
                🏆
              </span>
              <span>
                Mi ganadora
                <small>Campeona oficial de mi cabeza</small>
              </span>
            </div>
          </div>

          <div className="hero__sombra" aria-hidden="true" />
        </div>
      </div>

      <button type="button" className="hero__flecha" onClick={bajar} aria-label="Bajar">
        <span className="hero__raton" aria-hidden="true">
          <span className="hero__rueda" />
        </span>
      </button>
    </header>
  )
}
