/**
 * Las piezas del carrusel 3D. Fotos y videos mezclados.
 * El carrusel arma el cilindro solo, según cuántas haya.
 */

export type Pieza =
  | { tipo: 'foto'; src: string; pie: string; alt: string }
  | { tipo: 'video'; src: string; poster: string; pie: string; alt: string }

export const galeria: Pieza[] = [
  {
    tipo: 'foto',
    src: '/media/fotito-juntos.webp',
    pie: 'Nosotros dos',
    alt: 'Cinthya y Adrián juntos, sonriendo',
  },
  {
    tipo: 'video',
    src: '/media/eres-hermosa.mp4',
    poster: '/media/eres-hermosa-poster.webp',
    pie: 'Eres hermosa',
    alt: 'Video de Cinthya',
  },
  {
    tipo: 'foto',
    src: '/media/beso-frente.webp',
    pie: 'Un beso en la frente',
    alt: 'Beso en la frente',
  },
  {
    tipo: 'video',
    src: '/media/outfit-bonito.mp4',
    poster: '/media/outfit-bonito-poster.webp',
    pie: 'Ese outfit',
    alt: 'Cinthya con un outfit bonito',
  },
  {
    tipo: 'foto',
    src: '/media/portada.webp',
    pie: 'Mi favorita',
    alt: 'Retrato de Cinthya en el parque',
  },
  {
    tipo: 'foto',
    src: '/media/primera-cita.webp',
    pie: 'La primera cita',
    alt: 'Mesa de la primera cita',
  },
  {
    tipo: 'video',
    src: '/media/conejitos.mp4',
    poster: '/media/conejitos-poster.webp',
    pie: 'Dándoles de comer',
    alt: 'Cinthya dándole de comer a los conejitos',
  },
  {
    tipo: 'foto',
    src: '/media/detallitos.webp',
    pie: 'Los detallitos',
    alt: 'Pines y llaveros pequeños en la mano',
  },
  {
    tipo: 'foto',
    src: '/media/en-lancha.webp',
    pie: 'En la lancha',
    alt: 'Paseo en lancha',
  },
  {
    tipo: 'foto',
    src: '/media/tu-spiderman.webp',
    pie: 'Tu Spiderman',
    alt: 'Adrián con una máscara de Spiderman',
  },
]
