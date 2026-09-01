/**
 * Capa de persistencia del tragaperras.
 *
 * Hoy guarda todo en localStorage (sin backend). El día que quieras
 * meter un Nest, solo reescribes las cuatro funciones de abajo para que
 * peguen contra tu API — el resto de la app no se entera de nada.
 */

import type { PremioId } from '@/data/premios'

const CLAVE = 'cinthy:tragaperras:v1'

export type EstadoJuego = {
  /** Premios que ya le salieron, en orden. */
  tirados: PremioId[]
  /** El que eligió al final (null = todavía no elige). */
  elegido: PremioId | null
  /** ISO de cuando lo reclamó. Si tiene valor, la máquina está bloqueada. */
  reclamadoEn: string | null
  /** Recado opcional que le dejó a Adrián. */
  recado: string
}

export const estadoInicial: EstadoJuego = {
  tirados: [],
  elegido: null,
  reclamadoEn: null,
  recado: '',
}

function disponible(): boolean {
  try {
    const t = '__t'
    window.localStorage.setItem(t, t)
    window.localStorage.removeItem(t)
    return true
  } catch {
    return false
  }
}

/** Lee el estado guardado. Nunca lanza: si algo falla, arranca de cero. */
export function leerEstado(): EstadoJuego {
  if (!disponible()) return { ...estadoInicial }
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return { ...estadoInicial }
    const dato = JSON.parse(crudo) as Partial<EstadoJuego>
    return {
      tirados: Array.isArray(dato.tirados) ? (dato.tirados as PremioId[]) : [],
      elegido: (dato.elegido as PremioId) ?? null,
      reclamadoEn: typeof dato.reclamadoEn === 'string' ? dato.reclamadoEn : null,
      recado: typeof dato.recado === 'string' ? dato.recado : '',
    }
  } catch {
    return { ...estadoInicial }
  }
}

/** Guarda el estado. Nunca lanza. */
export function guardarEstado(estado: EstadoJuego): void {
  if (!disponible()) return
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    /* modo incógnito o almacenamiento lleno: seguimos sin guardar */
  }
}

/** Borra todo: la máquina vuelve a estar libre. */
export function reiniciarEstado(): void {
  if (!disponible()) return
  try {
    window.localStorage.removeItem(CLAVE)
  } catch {
    /* nada que hacer */
  }
}

/** ¿Está bloqueada la máquina? */
export function estaBloqueado(estado: EstadoJuego): boolean {
  return estado.reclamadoEn !== null
}
