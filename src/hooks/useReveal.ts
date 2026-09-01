import { useEffect, useRef, useState } from 'react'

/* ============================================================
   Un solo vigilante para toda la página.

   Con IntersectionObserver a secas, si alguien hace scroll muy
   rápido (o el navegador salta con un ancla), un bloque puede
   pasar entero entre dos cuadros y quedarse invisible para
   siempre. Así que medimos posiciones nosotros mismos, una vez
   por cuadro y solo mientras haya scroll: si el elemento ya
   entró —o si ya pasó de largo hacia arriba— se muestra.
   ============================================================ */

type Suscrito = { nodo: Element; mostrar: () => void }

const pendientes = new Set<Suscrito>()
let raf = 0
let escuchando = false

/** Umbral: se revela cuando su borde superior sube del 92% de la pantalla. */
const UMBRAL = 0.92

function revisar() {
  raf = 0
  const alto = window.innerHeight || document.documentElement.clientHeight

  for (const s of pendientes) {
    const { top } = s.nodo.getBoundingClientRect()
    if (top < alto * UMBRAL) {
      pendientes.delete(s)
      s.mostrar()
    }
  }

  if (pendientes.size === 0) apagar()
}

function pedirRevision() {
  if (!raf) raf = requestAnimationFrame(revisar)
}

function encender() {
  if (escuchando) return
  escuchando = true
  window.addEventListener('scroll', pedirRevision, { passive: true })
  window.addEventListener('resize', pedirRevision, { passive: true })
}

function apagar() {
  if (!escuchando) return
  escuchando = false
  window.removeEventListener('scroll', pedirRevision)
  window.removeEventListener('resize', pedirRevision)
}

function suscribir(nodo: Element, mostrar: () => void): () => void {
  const s: Suscrito = { nodo, mostrar }
  pendientes.add(s)
  encender()
  pedirRevision()
  return () => {
    pendientes.delete(s)
    if (pendientes.size === 0) apagar()
  }
}

/**
 * Devuelve una ref y un booleano que pasa a `true` —y ya no vuelve
 * atrás— la primera vez que el elemento entra en pantalla.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return

    /* Sin animación configurada: mostrar de una. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    return suscribir(nodo, () => setVisible(true))
  }, [])

  return { ref, visible }
}
