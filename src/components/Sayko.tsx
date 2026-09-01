import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Foto } from './ui/Foto'
import { MiniVideo } from './ui/MiniVideo'
import { useTilt } from '@/hooks/useTilt'

const MEDIDAS = '(min-width: 960px) 44vw, 92vw'

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
              <Foto
                src="/media/sayko.webp"
                alt="Sayko, el husky de Cinthya, en el pasto"
                sizes={MEDIDAS}
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
              <MiniVideo
                src="/media/conejitos.mp4"
                poster="/media/conejitos-poster.webp"
                alt="Cinthya dándole de comer a los conejitos"
                pie="Dándoles de comer a los conejitos"
                sizes={MEDIDAS}
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
