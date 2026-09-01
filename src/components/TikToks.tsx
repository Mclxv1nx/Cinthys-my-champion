import { useState } from 'react'
import { config } from '@/lib/config'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { useTilt } from '@/hooks/useTilt'

const VIDEOS = config.tiktoks

/** Visor de TikToks dentro de un celular en 3D. */
export function TikToks() {
  const [activo, setActivo] = useState(0)
  const marco = useTilt<HTMLDivElement>({ max: 8 })
  const video = VIDEOS[activo]

  return (
    <Section
      id="tiktoks"
      etiqueta="Te los dedico"
      titulo={
        <>
          Estos me hicieron <span className="grad">pensar en ti</span>
        </>
      }
      bajada="Los guardé apenas los vi. Míralos aquí mismo, sin salir de la página."
      className="tiktoks"
    >
      <div className="tiktoks__cuerpo">
        <Reveal desde="izquierda">
          <div className="tiktoks__lista" role="tablist" aria-label="TikToks dedicados">
            {VIDEOS.map((v, i) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={activo === i}
                className={`tiktoks__tab vidrio ${activo === i ? 'es-activo' : ''}`}
                onClick={() => setActivo(i)}
              >
                <span className="tiktoks__tab-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="tiktoks__tab-texto">
                  <strong>{v.titulo}</strong>
                  <small>{v.usuario}</small>
                  <em>{v.nota}</em>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal desde="derecha" demora={90}>
          <div className="celular__marco" ref={marco}>
            <div className="celular tilt">
              <span className="celular__ceja" aria-hidden="true" />
              <div className="celular__pantalla">
                <iframe
                  key={video.id}
                  title={`TikTok: ${video.titulo}`}
                  src={`https://www.tiktok.com/embed/v2/${video.id}`}
                  loading="lazy"
                  allow="encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
              <span className="celular__brillo" aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
