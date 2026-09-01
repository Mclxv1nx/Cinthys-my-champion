/**
 * Confeti casero en canvas. ~60 líneas, cero dependencias.
 * Se dibuja encima de todo, se limpia solo y respeta
 * `prefers-reduced-motion`.
 */

type Papelito = {
  x: number
  y: number
  vx: number
  vy: number
  giro: number
  vGiro: number
  ancho: number
  alto: number
  color: string
  vida: number
}

const COLORES = ['#FF5D8F', '#9B6BF2', '#F2C56B', '#FF9DBB', '#C0A3FF', '#FFFFFF']

export function lanzarConfeti(origen?: { x: number; y: number }, cantidad = 90): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const ancho = window.innerWidth
  const alto = window.innerHeight

  canvas.width = ancho * dpr
  canvas.height = alto * dpr
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }
  ctx.scale(dpr, dpr)

  const cx = origen?.x ?? ancho / 2
  const cy = origen?.y ?? alto / 2.4

  const papelitos: Papelito[] = Array.from({ length: cantidad }, () => {
    const angulo = Math.random() * Math.PI * 2
    const fuerza = 5 + Math.random() * 11
    return {
      x: cx,
      y: cy,
      vx: Math.cos(angulo) * fuerza,
      vy: Math.sin(angulo) * fuerza - 5,
      giro: Math.random() * Math.PI,
      vGiro: (Math.random() - 0.5) * 0.32,
      ancho: 5 + Math.random() * 6,
      alto: 8 + Math.random() * 8,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
      vida: 1,
    }
  })

  let raf = 0

  const tick = () => {
    ctx.clearRect(0, 0, ancho, alto)
    let vivos = 0

    for (const p of papelitos) {
      p.vy += 0.28 // gravedad
      p.vx *= 0.99
      p.vy *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.giro += p.vGiro
      p.vida -= 0.0092

      if (p.vida <= 0 || p.y > alto + 60) continue
      vivos++

      ctx.save()
      ctx.globalAlpha = Math.max(p.vida, 0)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.giro)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.ancho / 2, -p.alto / 2, p.ancho, p.alto * Math.abs(Math.cos(p.giro)))
      ctx.restore()
    }

    if (vivos > 0) {
      raf = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(raf)
      canvas.remove()
    }
  }

  raf = requestAnimationFrame(tick)
}
