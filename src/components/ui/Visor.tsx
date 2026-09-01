import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Foto } from './Foto'

/**
 * Visor a pantalla completa, uno solo para toda la página.
 *
 * Las fotos y los videos se abren aquí en su proporción real, sin recortes.
 * Los videos no bajan ni un byte hasta que ella toca para abrirlos.
 */

export type Medio =
  | { tipo: 'foto'; src: string; alt: string; pie?: string }
  | { tipo: 'video'; src: string; poster: string; alt: string; pie?: string }

type Abrir = (medio: Medio) => void

const ContextoVisor = createContext<Abrir>(() => {})

/** Hook para abrir el visor desde cualquier componente. */
export const useVisor = (): Abrir => useContext(ContextoVisor)

export function VisorProvider({ children }: { children: ReactNode }) {
  const [medio, setMedio] = useState<Medio | null>(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  const abrir = useCallback<Abrir>((m) => {
    setReproduciendo(false)
    setMedio(m)
  }, [])
  const cerrar = useCallback(() => setMedio(null), [])

  /* Intentar arrancar el video en cuanto se abre. En muchos celulares
     (sobre todo iPhone) el navegador bloquea este autoplay por venir sin
     un toque directo — para eso queda el botón de reproducir de abajo. */
  useEffect(() => {
    if (medio?.tipo !== 'video') return
    video.current
      ?.play()
      .then(() => setReproduciendo(true))
      .catch(() => setReproduciendo(false))
  }, [medio])

  const reproducir = useCallback(() => {
    video.current
      ?.play()
      .then(() => setReproduciendo(true))
      .catch(() => {})
  }, [])

  /* Escape para cerrar, y se bloquea el scroll de atrás. */
  useEffect(() => {
    if (!medio) return

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
    }

    const scrollAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', alTeclear)

    return () => {
      document.body.style.overflow = scrollAnterior
      window.removeEventListener('keydown', alTeclear)
    }
  }, [medio, cerrar])

  const valor = useMemo(() => abrir, [abrir])

  return (
    <ContextoVisor.Provider value={valor}>
      {children}

      {medio && (
        <div
          className="visor"
          role="dialog"
          aria-modal="true"
          aria-label={medio.pie || medio.alt}
          onClick={cerrar}
        >
          <div className="visor__caja" onClick={(e) => e.stopPropagation()}>
            {medio.tipo === 'foto' ? (
              <Foto
                className="visor__foto"
                src={medio.src}
                alt={medio.alt}
                sizes="(min-width: 700px) 640px, 92vw"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="visor__video-caja">
                <video
                  ref={video}
                  className="visor__video"
                  src={medio.src}
                  poster={medio.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onPlaying={() => setReproduciendo(true)}
                  onPause={() => setReproduciendo(false)}
                  aria-label={medio.alt}
                />

                {!reproduciendo && (
                  <button
                    type="button"
                    className="visor__play"
                    onClick={reproducir}
                    aria-label="Reproducir video"
                  >
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {medio.pie && <p className="visor__pie">{medio.pie}</p>}
          </div>

          <button type="button" className="visor__cerrar" onClick={cerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
      )}
    </ContextoVisor.Provider>
  )
}
