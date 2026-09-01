import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  id: string
  /** Texto chiquito de arriba. */
  etiqueta?: string
  titulo: ReactNode
  /** Párrafo bajo el título. */
  bajada?: ReactNode
  children: ReactNode
  className?: string
  /** Centrar el encabezado. */
  centrado?: boolean
}

/** Sección estándar: encabezado + contenido, con el mismo ritmo en todas. */
export function Section({
  id,
  etiqueta,
  titulo,
  bajada,
  children,
  className = '',
  centrado = true,
}: Props) {
  return (
    <section id={id} className={`seccion ${className}`}>
      <div className="contenedor">
        <header className={`seccion__cabeza ${centrado ? 'es-centrada' : ''}`}>
          {etiqueta && (
            <Reveal>
              <p className="etiqueta">
                <span className="etiqueta__punto" aria-hidden="true" />
                {etiqueta}
              </p>
            </Reveal>
          )}
          <Reveal demora={60}>
            <h2 className="seccion__titulo">{titulo}</h2>
          </Reveal>
          {bajada && (
            <Reveal demora={120}>
              <p className="seccion__bajada">{bajada}</p>
            </Reveal>
          )}
        </header>

        {children}
      </div>
    </section>
  )
}
