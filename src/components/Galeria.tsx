import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { galeria } from '@/data/galeria'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Foto } from './ui/Foto'
import { useVisor } from './ui/Visor'

const TOTAL = galeria.length
const PASO = 360 / TOTAL
const MEDIDAS = '(min-width: 960px) 280px, 44vw'

/**
 * Carrusel 3D de verdad: las piezas van pegadas por dentro a un cilindro
 * (rotateY + translateZ) y el cilindro entero gira. Se arrastra con el dedo,
 * con el mouse, con las flechas del teclado o con los botones.
 */
export function Galeria() {
  const pista = useRef<HTMLDivElement>(null)
  const [angulo, setAngulo] = useState(0)
  const [radio, setRadio] = useState(340)
  const abrirVisor = useVisor()

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
    let movido = 0

    const abajo = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return
      arrastrando = true
      movido = 0
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
      movido = Math.max(movido, Math.abs(dx))
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
      /* Si arrastró de verdad, que no se cuente como clic en la pieza. */
      if (movido > 8) nodo.dataset.arrastro = '1'
      else delete nodo.dataset.arrastro
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

  const abrir = (i: number) => {
    if (pista.current?.dataset.arrastro) return
    const p = galeria[i]
    abrirVisor(
      p.tipo === 'foto'
        ? { tipo: 'foto', src: p.src, alt: p.alt, pie: p.pie }
        : { tipo: 'video', src: p.src, poster: p.poster, alt: p.alt, pie: p.pie },
    )
  }

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
                /* Solo se cargan las piezas cercanas a la de adelante. */
                const distancia = Math.min(
                  (i - indice + TOTAL) % TOTAL,
                  (indice - i + TOTAL) % TOTAL,
                )
                const cerca = distancia <= 2

                return (
                  <button
                    type="button"
                    key={p.src}
                    className={`pieza ${alFrente ? 'es-frente' : ''}`}
                    style={
                      { transform: `rotateY(${i * PASO}deg) translateZ(${radio}px)` } as CSSProperties
                    }
                    onClick={() => alFrente && abrir(i)}
                    tabIndex={alFrente ? 0 : -1}
                    aria-hidden={!alFrente}
                    aria-label={`${p.pie} — abrir en grande`}
                  >
                    <Foto
                      src={p.tipo === 'foto' ? p.src : p.poster}
                      alt={p.alt}
                      sizes={MEDIDAS}
                      loading={cerca ? 'eager' : 'lazy'}
                    />
                    {p.tipo === 'video' && (
                      <span className="pieza__play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z" />
                        </svg>
                      </span>
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
    </Section>
  )
}
