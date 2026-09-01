import { useEffect, useState } from 'react'

const ENLACES = [
  { id: 'inicio', icono: '✦', texto: 'Inicio' },
  { id: 'historia', icono: '❤', texto: 'Nosotros' },
  { id: 'ganadora', icono: '🏆', texto: 'Campeona' },
  { id: 'galeria', icono: '◫', texto: 'Galería' },
  { id: 'musica', icono: '♫', texto: 'Música' },
  { id: 'premio', icono: '🎰', texto: 'Tu premio' },
]

/**
 * Barra flotante. En celular vive abajo (donde llega el pulgar);
 * en pantallas grandes sube al centro superior.
 */
export function Nav() {
  const [activo, setActivo] = useState('inicio')

  useEffect(() => {
    const secciones = ENLACES.map((e) => document.getElementById(e.id)).filter(
      (n): n is HTMLElement => n !== null,
    )
    if (!secciones.length) return

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActivo(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    secciones.forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [])

  const ir = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="nav" aria-label="Secciones de la página">
      <ul className="nav__lista">
        {ENLACES.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              className={`nav__btn ${activo === e.id ? 'es-activo' : ''}`}
              onClick={() => ir(e.id)}
              aria-current={activo === e.id ? 'true' : undefined}
            >
              <span className="nav__icono" aria-hidden="true">
                {e.icono}
              </span>
              <span className="nav__texto">{e.texto}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
