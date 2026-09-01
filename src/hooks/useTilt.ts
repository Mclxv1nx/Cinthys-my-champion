import { useEffect, useRef } from 'react'

type Opciones = {
  /** Grados máximos de inclinación. */
  max?: number
  /** Cuánto se levanta hacia el observador (px). */
  alzar?: number
  /** Seguir el giroscopio en celular. */
  giroscopio?: boolean
}

/**
 * Inclinación 3D: sigue el puntero en desktop y el giroscopio en celular.
 * Escribe en variables CSS (--rx, --ry, --mx, --my) para no re-renderizar React.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  max = 10,
  alzar = 0,
  giroscopio = true,
}: Opciones = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let rx = 0
    let ry = 0
    let mx = 50
    let my = 50

    const pintar = () => {
      raf = 0
      nodo.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
      nodo.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
      nodo.style.setProperty('--mx', `${mx.toFixed(1)}%`)
      nodo.style.setProperty('--my', `${my.toFixed(1)}%`)
      nodo.style.setProperty('--alzar', `${alzar}px`)
    }

    const pedirPintado = () => {
      if (!raf) raf = requestAnimationFrame(pintar)
    }

    const alMover = (e: PointerEvent) => {
      const caja = nodo.getBoundingClientRect()
      const px = (e.clientX - caja.left) / caja.width
      const py = (e.clientY - caja.top) / caja.height
      ry = (px - 0.5) * 2 * max
      rx = -(py - 0.5) * 2 * max
      mx = px * 100
      my = py * 100
      pedirPintado()
    }

    const alSalir = () => {
      rx = 0
      ry = 0
      mx = 50
      my = 50
      pedirPintado()
    }

    const alGirar = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0 // adelante / atrás
      const gamma = e.gamma ?? 0 // izquierda / derecha
      ry = Math.max(-max, Math.min(max, (gamma / 45) * max))
      rx = Math.max(-max, Math.min(max, ((beta - 45) / 45) * max))
      mx = 50 + (ry / max) * 30
      my = 50 - (rx / max) * 30
      pedirPintado()
    }

    const finoPuntero = window.matchMedia('(pointer: fine)').matches

    if (finoPuntero) {
      nodo.addEventListener('pointermove', alMover)
      nodo.addEventListener('pointerleave', alSalir)
    } else if (giroscopio && typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', alGirar)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      nodo.removeEventListener('pointermove', alMover)
      nodo.removeEventListener('pointerleave', alSalir)
      window.removeEventListener('deviceorientation', alGirar)
    }
  }, [max, alzar, giroscopio])

  return ref
}
