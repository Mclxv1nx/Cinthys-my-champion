/**
 * Los seis premios del tragaperras.
 * Añade o quita entradas y la máquina se ajusta sola
 * (los rodillos se reparten los grados según cuántos haya).
 */

export type PremioId = 'cena' | 'cine' | 'camping' | 'cita' | 'besote' | 'cancion'

export type Premio = {
  id: PremioId
  nombre: string
  icono: string
  frase: string
  color: string
}

export const premios: Premio[] = [
  {
    id: 'cena',
    nombre: 'Una cena',
    icono: '🍝',
    frase: 'Mesa para dos, y yo mirándote más a ti que al plato.',
    color: '#FF5D8F',
  },
  {
    id: 'cine',
    nombre: 'Ida al cine',
    icono: '🎬',
    frase: 'Tú eliges la película. Yo compro los canguiles.',
    color: '#9B6BF2',
  },
  {
    id: 'camping',
    nombre: 'Camping juntos',
    icono: '⛺',
    frase: 'Carpa, fogata, estrellas y tu risa de fondo.',
    color: '#5BD9C0',
  },
  {
    id: 'cita',
    nombre: 'Una cita',
    icono: '💗',
    frase: 'Día entero, sin reloj, solo nosotros dos.',
    color: '#FF9DBB',
  },
  {
    id: 'besote',
    nombre: 'Besote y abrazote',
    icono: '🤗',
    frase: 'Del que aprieta fuerte y no quiere soltar.',
    color: '#F2C56B',
  },
  {
    id: 'cancion',
    nombre: 'Que te cante',
    icono: '🎤',
    frase: 'Desafino, pero es toda para ti.',
    color: '#C0A3FF',
  },
]

export const porId = (id: PremioId): Premio =>
  premios.find((p) => p.id === id) ?? premios[0]

/**
 * Saca `cuantos` premios distintos al azar (Fisher–Yates).
 * Distintos a propósito: así al final tiene tres opciones
 * de verdad entre las cuales elegir.
 */
export function sortear(cuantos: number): PremioId[] {
  const mazo = premios.map((p) => p.id)
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[mazo[i], mazo[j]] = [mazo[j], mazo[i]]
  }
  return mazo.slice(0, Math.min(cuantos, mazo.length))
}
