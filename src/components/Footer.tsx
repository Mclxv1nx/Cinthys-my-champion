import { config } from '@/lib/config'

export function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie__interior">
        <p className="pie__frase serif italic">
          Para {config.ella.nombreCompleto}, que gana sin competir.
        </p>

        <p className="pie__firma">
          Hecho con mucho amor por {config.yo.nombre}, el Ingeniero que quiere ser
          inolvidable para ti
          <span className="pie__corazon" aria-hidden="true">
            💗
          </span>
        </p>

        <p className="pie__legal">
          Todas las fotos y videos son nuestros. Esta página es solo para ti.
        </p>
      </div>
    </footer>
  )
}
