/**
 * Una foto que trae tres tamaños y deja que el navegador elija.
 *
 * Cada imagen de `public/media` existe en tres anchos:
 *   portada-480.webp · portada-760.webp · portada.webp (1200w)
 *
 * Le pasas la grande y el componente arma el `srcset` solo. En un celular
 * eso baja unos 35 KB en vez de 105 KB, y se ve exactamente igual.
 */

type Props = {
  /** La versión grande, ej. "/media/portada.webp". */
  src: string
  alt: string
  /**
   * Cuánto espacio ocupa la foto en pantalla. Es lo que le dice al
   * navegador cuál de los tres archivos bajar. Ej: "(min-width: 960px) 25vw, 92vw".
   */
  sizes: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function Foto({
  src,
  alt,
  sizes,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
}: Props) {
  const base = src.replace(/\.webp$/, '')

  return (
    <img
      className={className}
      src={src}
      srcSet={`${base}-480.webp 480w, ${base}-760.webp 760w, ${src} 1200w`}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  )
}
