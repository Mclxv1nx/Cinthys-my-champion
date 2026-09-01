import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { useTilt } from '@/hooks/useTilt'

const DATOS = [
  { icono: '🐺', texto: 'Husky, o sea: pura felicidad, energía y amor, corazón.' },
  { icono: '👀', texto: 'Ojos que te convencen de lo que sea.' },
  { icono: '🦴', texto: 'Tu compañero número uno (yo peleo por el dos).' },
]

/** La sección de su mascotita. */
export function Sayko() {
  const ref = useTilt<HTMLDivElement>({ max: 9 })

  return (
    <Section
      id="sayko"
      etiqueta="Tu compañero"
      titulo={
        <>
          Y por supuesto, <span className="grad">Sayko</span>
        </>
      }
      bajada="Porque una página tuya sin él quedaría incompleta."
      className="sayko"
    >
      <div className="sayko__grid">
        <Reveal desde="izquierda">
          <div className="sayko__marco" ref={ref}>
            <figure className="sayko__foto vidrio tilt">
              <img
                src="/media/sayko.webp"
                alt="Sayko, el husky de Cinthya, en el pasto"
                loading="lazy"
                decoding="async"
                width={900}
                height={1100}
              />
              <figcaption>
                <span className="sayko__nombre">Sayko</span>
                <span className="sayko__rol">Guardián oficial</span>
              </figcaption>
              <div className="tilt__brillo" aria-hidden="true" />
            </figure>
          </div>
        </Reveal>

        <div className="sayko__lado">
          <Reveal desde="derecha" demora={80}>
            <ul className="sayko__datos">
              {DATOS.map((d) => (
                <li key={d.texto}>
                  <span className="sayko__icono" aria-hidden="true">
                    {d.icono}
                  </span>
                  {d.texto}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal desde="derecha" demora={160}>
            <figure className="sayko__video vidrio">
              <video
                src="/media/conejitos.mp4"
                poster="/media/conejitos-poster.webp"
                controls
                playsInline
                preload="none"
                aria-label="Cinthya dándole de comer a los conejitos"
              />
              <figcaption>
                Dándoles de comer a los conejitos. Tienes ese don con los animales.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
