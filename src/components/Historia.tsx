import { momentos } from '@/data/momentos'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'

/** Línea de tiempo de nuestros recuerdos. Zigzag en desktop, columna en celular. */
export function Historia() {
  return (
    <Section
      id="historia"
      etiqueta="Nuestra historia"
      titulo={
        <>
          Los ratos que <span className="grad">no se me olvidan</span>
        </>
      }
      bajada="Cada uno de estos días valió por mil. Y todavía nos faltan un montón."
      className="historia"
    >
      <ol className="linea">
        <span className="linea__hilo" aria-hidden="true" />

        {momentos.map((m, i) => (
          <Reveal
            as="li"
            key={m.id}
            demora={i * 70}
            desde={i % 2 === 0 ? 'izquierda' : 'derecha'}
            className="linea__item"
          >
            <span className="linea__nodo" aria-hidden="true">
              <span className="linea__pulso" />
            </span>

            <article className="momento vidrio">
              <div className="momento__medio">
                {m.medio.tipo === 'foto' ? (
                  <img
                    src={m.medio.src}
                    alt={m.alt}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                  />
                ) : (
                  <video
                    src={m.medio.src}
                    poster={m.medio.poster}
                    controls
                    playsInline
                    preload="none"
                    aria-label={m.alt}
                  />
                )}
              </div>

              <div className="momento__cuerpo">
                <p className="momento__etiqueta">{m.etiqueta}</p>
                <h3 className="momento__titulo">{m.titulo}</h3>
                <p className="momento__texto">{m.texto}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
