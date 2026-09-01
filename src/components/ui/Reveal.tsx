import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Props = {
  children: ReactNode
  /** Retardo en ms, para escalonar varios elementos. */
  demora?: number
  /** Desde dónde entra. */
  desde?: 'abajo' | 'izquierda' | 'derecha' | 'fondo'
  className?: string
  as?: 'div' | 'li' | 'article' | 'section'
}

/** Envuelve cualquier cosa y la hace aparecer al entrar en pantalla. */
export function Reveal({
  children,
  demora = 0,
  desde = 'abajo',
  className = '',
  as: Tag = 'div',
}: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal--${desde} ${visible ? 'es-visible' : ''} ${className}`}
      style={{ '--demora': `${demora}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
