import { Reveal } from './ui/Reveal'
import { useTilt } from '@/hooks/useTilt'

/** Una cartita corta, antes de que empiecen los recuerdos. */
export function Carta() {
  const ref = useTilt<HTMLDivElement>({ max: 6 })

  return (
    <section className="carta" aria-label="Una nota para Cinthya">
      <div className="contenedor">
        <Reveal desde="fondo">
          <div className="carta__marco" ref={ref}>
            <article className="carta__hoja vidrio tilt">
              <span className="carta__comilla" aria-hidden="true">
                &ldquo;
              </span>

              <p className="carta__texto">
                Hice esta página porque no me alcanzan las palabras en un mensaje, y
                poquito tedioso jsjs.
              </p>

              <p className="carta__texto">
                Recapitulé cositas que te gustan, que son tu vida entera, y seguiré
                sumando cosas conforme te vaya conociendo mi niña, hasta nuestras
                nuevas aventuras si me permites con ello.
              </p>

              <footer className="carta__firma">
                <span className="carta__linea" aria-hidden="true" />
                <span className="nota">Con todo cariño, Adriansito</span>
              </footer>

              <div className="tilt__brillo" aria-hidden="true" />
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
