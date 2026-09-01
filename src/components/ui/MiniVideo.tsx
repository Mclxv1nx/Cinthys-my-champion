import { Foto } from './Foto'
import { useVisor } from './Visor'

/**
 * La carátula de un video dentro de una tarjeta.
 *
 * Muestra solo el poster (una imagen ligera) con un botón de play. El video
 * en sí no se descarga hasta que ella lo toca, y cuando lo hace se abre en
 * el visor a pantalla completa, en su proporción real — nada de videos
 * verticales recortados dentro de una caja horizontal.
 */

type Props = {
  /** El .mp4 */
  src: string
  /** La versión grande del poster, ej. "/media/heladeria-poster.webp" */
  poster: string
  alt: string
  pie?: string
  sizes: string
  className?: string
}

export function MiniVideo({ src, poster, alt, pie, sizes, className }: Props) {
  const abrir = useVisor()

  return (
    <button
      type="button"
      className={`minivideo ${className ?? ''}`}
      onClick={() => abrir({ tipo: 'video', src, poster, alt, pie })}
      aria-label={`Reproducir: ${pie || alt}`}
    >
      <Foto className="minivideo__poster" src={poster} alt={alt} sizes={sizes} />

      <span className="minivideo__velo" aria-hidden="true" />

      <span className="minivideo__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z" />
        </svg>
      </span>
    </button>
  )
}
