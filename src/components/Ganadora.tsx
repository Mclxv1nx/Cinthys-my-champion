import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { useTilt } from '@/hooks/useTilt'

const LOGROS = [
  {
    src: '/media/mi-ganadora.webp',
    alt: 'Cinthya en el stand del Club de Robótica con un robot en la mano',
    pie: 'En su vibra',
    texto: 'Con un gran proyecto en mano y esa carita de "vamos a por todo".',
  },
  {
    src: '/media/mi-genia.webp',
    alt: 'El equipo de robótica con banderas y certificados',
    pie: 'Mi genia',
    texto: 'Banderas arriba, certificado en mano, el equipo de mi genia alzándose en victoria.',
  },
  {
    src: '/media/participando.webp',
    alt: 'Cinthya con su equipo antes de competir',
    pie: 'Antes de competir',
    texto: 'Los nervios de antes, que después se vuelven pura celebración.',
  },
  {
    src: '/media/orgullo-campeona.webp',
    alt: 'El equipo completo junto al lago al atardecer',
    pie: 'Orgullo',
    texto: 'Cerrando el día con los suyos y el cielo a favor.',
  },
]

/** La felicitación: por qué es mi ganadora, con pruebas. */
export function Ganadora() {
  const copa = useTilt<HTMLDivElement>({ max: 16 })

  return (
    <Section
      id="ganadora"
      etiqueta="La felicitación"
      titulo={
        <>
          Felicidades, <span className="grad-oro">campeona</span>
        </>
      }
      bajada="No lo digo de cariño nomás. Lo digo porque lo he visto: te esfuerzas, te sale, y encima lo haces ver fácil."
      className="ganadora"
    >
      <Reveal desde="fondo">
        <div className="copa__marco" ref={copa}>
          <div className="copa tilt">
            <span className="copa__resplandor" aria-hidden="true" />
            <span className="copa__icono" aria-hidden="true">
              🏆
            </span>
            <div className="copa__rayos" aria-hidden="true" />
          </div>
        </div>
      </Reveal>

      <Reveal demora={80}>
        <p className="ganadora__frase nota">
          «Robótica, competencias, certificados… y todavía te sobra tiempo para ser la
          persona más linda que conozco.»
        </p>
      </Reveal>

      <div className="logros">
        {LOGROS.map((l, i) => (
          <Reveal key={l.src} demora={i * 90} className="logros__celda">
            <figure className="logro vidrio">
              <img
                src={l.src}
                alt={l.alt}
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
              />
              <figcaption className="logro__pie">
                <strong>{l.pie}</strong>
                <span>{l.texto}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
