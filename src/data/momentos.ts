/**
 * La línea de tiempo de "Nuestra historia".
 * Cambia los textos y las fechas a tu gusto — el orden del array
 * es el orden en que aparecen.
 */

export type Momento = {
  id: string
  etiqueta: string
  titulo: string
  texto: string
  medio: { tipo: 'foto'; src: string } | { tipo: 'video'; src: string; poster: string }
  alt: string
}

export const momentos: Momento[] = [
  {
    id: 'conocernos',
    etiqueta: 'El principio',
    titulo: '31 de Julio, donde te conocí',
    texto:
      'Ese día no sabía que me estaba metiendo en el mejor lío de mi vida. Tú riéndote en la lancha, y yo ahí, ya sin piernas juju.',
    medio: { tipo: 'foto', src: '/media/primer-dia.webp' },
    alt: 'Cinthya y sus amigos en una lancha el día que nos conocimos',
  },
  {
    id: 'primera-cita',
    etiqueta: 'La primera',
    titulo: 'Nuestra primera cita',
    texto:
      'Dos tacitas de chocolate, mezclas raras, una buena conversación, conejos… y supe que me pones loquito.',
    medio: { tipo: 'foto', src: '/media/primera-cita.webp' },
    alt: 'La mesa de nuestra primera cita, con dos tazas y postres',
  },
  {
    id: 'heladeria',
    etiqueta: 'La dulce',
    titulo: 'La cita en la heladería',
    texto:
      'Donde te ves adorable, y es lo que atesoro en mis recuerdos: tu amabilidad y lo linda que eres con los animales.',
    medio: { tipo: 'video', src: '/media/heladeria.mp4', poster: '/media/heladeria-poster.webp' },
    alt: 'Video de nuestra cita en la heladería, dándoles de comer a los conejos',
  },
  {
    id: 'lancha',
    etiqueta: 'La aventura',
    titulo: 'De paseo, sin apuro',
    texto: 'En nuestra lancha, y una foto de nuestros peinados raros jasjas.',
    medio: { tipo: 'foto', src: '/media/en-lancha.webp' },
    alt: 'Paseo en lancha con chalecos salvavidas',
  },
  {
    id: 'beso',
    etiqueta: 'Mi favorita',
    titulo: 'Un beso en la frente',
    texto:
      'De todas las fotos que tengo, amo tener la mía dándote el beso más sincero que te puedo entregar: el de protección, cariño y cuidado. Me encantasss.',
    medio: { tipo: 'foto', src: '/media/beso-frente.webp' },
    alt: 'Adrián dándole un beso en la frente a Cinthya',
  },
]
