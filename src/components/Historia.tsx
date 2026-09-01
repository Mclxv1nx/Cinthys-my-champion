import { momentos } from '@/data/momentos'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Foto } from './ui/Foto'
import { MiniVideo } from './ui/MiniVideo'

/* En celular la tarjeta ocupa casi todo el ancho; en desktop, media columna. */
const MEDIDAS = '(min-width: 960px) 46vw, 92vw'

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
                  <Foto src={m.medio.src} alt={m.alt} sizes={MEDIDAS} />
                ) : (
                  <MiniVideo
                    src={m.medio.src}
                    poster={m.medio.poster}
                    alt={m.alt}
                    pie={m.titulo}
                    sizes={MEDIDAS}
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
