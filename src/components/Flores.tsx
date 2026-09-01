import { useState } from 'react'
import { config } from '@/lib/config'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'

const URL = config.enlaces.flores

/**
 * Las flores que le hice, embebidas en un navegador de mentira.
 * Si el sitio no se deja incrustar, cae en una tarjeta con el enlace.
 */
export function Flores() {
  const [cargado, setCargado] = useState(false)
  const [falló, setFalló] = useState(false)

  return (
    <Section
      id="flores"
      etiqueta="Un regalito aparte"
      titulo={
        <>
          Te hice unas <span className="grad">flores</span>
        </>
      }
      bajada="No se marchitan y no dan alergia. Las armé línea por línea para ti."
      className="flores"
    >
      <Reveal desde="fondo">
        <div className="ventana vidrio">
          <div className="ventana__barra">
            <span className="ventana__luz ventana__luz--roja" />
            <span className="ventana__luz ventana__luz--ambar" />
            <span className="ventana__luz ventana__luz--verde" />
            <span className="ventana__url">corazondemelonsandia.netlify.app</span>
          </div>

          <div className="ventana__lienzo">
            {!falló ? (
              <>
                {!cargado && (
                  <div className="ventana__cargando">
                    <span className="ventana__flor" aria-hidden="true">
                      🌸
                    </span>
                    <p>Regando las flores…</p>
                  </div>
                )}
                <iframe
                  title="Flores para Cinthya"
                  src={URL}
                  loading="lazy"
                  onLoad={() => setCargado(true)}
                  onError={() => setFalló(true)}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </>
            ) : (
              <div className="ventana__cargando">
                <span className="ventana__flor" aria-hidden="true">
                  🌷
                </span>
                <p>Estas se ven mejor en pantalla completa.</p>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal demora={100}>
        <div className="flores__pie">
          <a className="btn btn--principal" href={URL} target="_blank" rel="noreferrer noopener">
            Verlas en grande
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
