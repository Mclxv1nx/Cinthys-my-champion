import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { galeria } from '@/data/galeria'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'

const TOTAL = galeria.length
const PASO = 360 / TOTAL

/**
 * Carrusel 3D de verdad: las piezas van pegadas por dentro a un cilindro
 * (rotateY + translateZ) y el cilindro entero gira. Se arrastra con el dedo,
 * con el mouse, con las flechas del teclado o con los botones.
 */
export function Galeria() {
  const pista = useRef<HTMLDivElement>(null)
  const [angulo, setAngulo] = useState(0)
  const [radio, setRadio] = useState(340)
  const [abierta, setAbierta] = useState<number | null>(null)

  const indice = ((Math.round(-angulo / PASO) % TOTAL) + TOTAL) % TOTAL

  /* El radio depende del ancho real de cada pieza. */
  useLayoutEffect(() => {
    const medir = () => {
      const nodo = pista.current
      if (!nodo) return
      const pieza = nodo.querySelector<HTMLElement>('.pieza')
      const ancho = pieza?.offsetWidth ?? 220
      setRadio(Math.round(ancho / 2 / Math.tan(Math.PI / TOTAL)))
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  const mover = useCallback((delta: number) => {
    setAngulo((a) => a + delta * PASO)
  }, [])

  /* Arrastre con puntero (dedo o mouse). */
  useEffect(() => {
    const nodo = pista.current
    if (!nodo) return

    let arrastrando = false
    let inicioX = 0
    let anguloInicio = 0
    let idPuntero = -1

    const abajo = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a, video')) return
      arrastrando = true
      idPuntero = e.pointerId
      inicioX = e.clientX
      setAngulo((a) => {
        anguloInicio = a
        return a
      })
      nodo.setPointerCapture(e.pointerId)
      nodo.classList.add('es-arrastrando')
    }

    const mueve = (e: PointerEvent) => {
      if (!arrastrando || e.pointerId !== idPuntero) return
      const dx = e.clientX - inicioX
      setAngulo(anguloInicio + dx * 0.32)
    }

    const arriba = (e: PointerEvent) => {
      if (!arrastrando || e.pointerId !== idPuntero) return
      arrastrando = false
      nodo.classList.remove('es-arrastrando')
      try {
        nodo.releasePointerCapture(e.pointerId)
      } catch {
        /* el puntero ya se fue */
      }
      setAngulo((a) => Math.round(a / PASO) * PASO)
    }

    nodo.addEventListener('pointerdown', abajo)
    nodo.addEventListener('pointermove', mueve)
    nodo.addEventListener('pointerup', arriba)
    nodo.addEventListener('pointercancel', arriba)

    return () => {
      nodo.removeEventListener('pointerdown', abajo)
      nodo.removeEventListener('pointermove', mueve)
      nodo.removeEventListener('pointerup', arriba)
      nodo.removeEventListener('pointercancel', arriba)
    }
  }, [])

  /* Teclado. */
  const teclas = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      mover(1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      mover(-1)
    }
  }

  /* Cerrar la lupa con Escape. */
  useEffect(() => {
    if (abierta === null) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierta(null)
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [abierta])

  const pieza = abierta !== null ? galeria[abierta] : null

  return (
    <Section
      id="galeria"
      etiqueta="Galería"
      titulo={
        <>
          Gírala con el <span className="grad">dedo</span>
        </>
      }
      bajada="Arrastra para dar la vuelta y toca la de adelante para verla en grande."
      className="galeria"
    >
      <Reveal desde="fondo">
        <div className="carrusel">
          <div
            className="carrusel__escena"
            ref={pista}
            role="group"
            aria-roledescription="carrusel"
            aria-label="Fotos y videos de nosotros"
            tabIndex={0}
            onKeyDown={teclas}
          >
            <div
              className="carrusel__cilindro"
              style={{ transform: `translateZ(-${radio}px) rotateY(${angulo}deg)` }}
            >
              {galeria.map((p, i) => {
                const alFrente = i === indice
                return (
                  <button
                    type="button"
                    key={p.src}
                    className={`pieza ${alFrente ? 'es-frente' : ''}`}
                    style={
                      {
                        transform: `rotateY(${i * PASO}deg) translateZ(${radio}px)`,
                      } as CSSProperties
                    }
                    onClick={() => alFrente && setAbierta(i)}
                    tabIndex={alFrente ? 0 : -1}
                    aria-hidden={!alFrente}
                    aria-label={`${p.pie} — abrir en grande`}
                  >
                    {p.tipo === 'foto' ? (
                      <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
                    ) : (
                      <>
                        <img src={p.poster} alt={p.alt} loading="lazy" decoding="async" />
                        <span className="pieza__play" aria-hidden="true">
                          ▶
                        </span>
                      </>
                    )}
                    <span className="pieza__pie">{p.pie}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="carrusel__mandos">
            <button
              type="button"
              className="carrusel__flecha"
              onClick={() => mover(1)}
              aria-label="Anterior"
            >
              ‹
            </button>
            <p className="carrusel__cuenta" aria-live="polite">
              <strong>{indice + 1}</strong> / {TOTAL}
              <span className="carrusel__pie-actual">{galeria[indice].pie}</span>
            </p>
            <button
              type="button"
              className="carrusel__flecha"
              onClick={() => mover(-1)}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>
      </Reveal>

      {pieza && (
        <div
          className="lupa"
          role="dialog"
          aria-modal="true"
          aria-label={pieza.pie}
          onClick={() => setAbierta(null)}
        >
          <div className="lupa__caja" onClick={(e) => e.stopPropagation()}>
            {pieza.tipo === 'foto' ? (
              <img src={pieza.src} alt={pieza.alt} />
            ) : (
              <video src={pieza.src} poster={pieza.poster} controls autoPlay playsInline />
            )}
            <p className="lupa__pie">{pieza.pie}</p>
          </div>
          <button
            type="button"
            className="lupa__cerrar"
            onClick={() => setAbierta(null)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      )}
    </Section>
  )
}
