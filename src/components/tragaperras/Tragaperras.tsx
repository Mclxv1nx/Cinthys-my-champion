import { useCallback, useEffect, useRef, useState } from 'react'
import { premios, porId, type PremioId } from '@/data/premios'
import { config } from '@/lib/config'
import { lanzarConfeti } from '@/lib/confetti'
import { enviarAviso, type ResultadoAviso } from '@/lib/notify'
import {
  estadoInicial,
  estaBloqueado,
  guardarEstado,
  leerEstado,
  reiniciarEstado,
  type EstadoJuego,
} from '@/lib/storage'
import { Section } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { Rodillo } from './Rodillo'

const RODILLOS = 3
const TOTAL_GIROS = config.tragaperras.giros
const PASO = 360 / premios.length

/** Cuánto tarda en frenar cada rodillo (el último es el más dramático). */
const duracionDe = (i: number) => 2200 + i * 480

/** Siguiente rotación para que el rodillo caiga en `indice`, dando vueltas. */
function calcularRotacion(actual: number, indice: number, vueltas: number): number {
  const objetivo = -indice * PASO
  const delta = (((objetivo - actual) % 360) + 360) % 360
  return actual + delta + vueltas * 360
}

type Envio = { estado: 'quieto' } | { estado: 'enviando' } | { estado: 'hecho'; via: ResultadoAviso }

export function Tragaperras() {
  const [juego, setJuego] = useState<EstadoJuego>(estadoInicial)
  const [listo, setListo] = useState(false)
  /* En reposo cada rodillo muestra un premio distinto, como una máquina
     de verdad esperando a que le jalen la palanca. */
  const [rotaciones, setRotaciones] = useState<number[]>(() =>
    Array.from({ length: RODILLOS }, (_, i) => -i * 2 * PASO),
  )
  const [duraciones, setDuraciones] = useState<number[]>(() => Array(RODILLOS).fill(0))
  const [girando, setGirando] = useState(false)
  const [recienSalio, setRecienSalio] = useState<PremioId | null>(null)
  const [seleccion, setSeleccion] = useState<PremioId | null>(null)
  const [recado, setRecado] = useState('')
  const [envio, setEnvio] = useState<Envio>({ estado: 'quieto' })
  const [avisoLlave, setAvisoLlave] = useState(false)

  const temporizador = useRef<number | null>(null)
  const palanca = useRef<HTMLDivElement>(null)

  /* ── Arranque: leer estado y revisar la llave secreta ────────── */
  useEffect(() => {
    const url = new URL(window.location.href)
    const llave = url.searchParams.get(config.tragaperras.paramLlave)

    if (llave && llave === config.tragaperras.llaveSecreta) {
      reiniciarEstado()
      setJuego({ ...estadoInicial })
      setAvisoLlave(true)
      url.searchParams.delete(config.tragaperras.paramLlave)
      window.history.replaceState({}, '', url.pathname + url.search + url.hash)
      window.setTimeout(() => setAvisoLlave(false), 6000)
    } else {
      const guardado = leerEstado()
      setJuego(guardado)
      setSeleccion(guardado.elegido)
      setRecado(guardado.recado)
      if (guardado.reclamadoEn) setEnvio({ estado: 'hecho', via: { via: 'web3forms' } })
    }

    setListo(true)
  }, [])

  /* Guardar cada cambio. */
  useEffect(() => {
    if (listo) guardarEstado(juego)
  }, [juego, listo])

  useEffect(() => () => {
    if (temporizador.current) window.clearTimeout(temporizador.current)
  }, [])

  const bloqueado = estaBloqueado(juego)
  const girosUsados = juego.tirados.length
  const girosQuedan = Math.max(0, TOTAL_GIROS - girosUsados)
  const yaGiróTodo = girosUsados >= TOTAL_GIROS
  const puedeGirar = !bloqueado && !girando && !yaGiróTodo

  /* ── Girar ───────────────────────────────────────────────────── */
  const girar = useCallback(() => {
    if (!puedeGirar) return

    /* Un premio que todavía no le haya salido: así los 3 son distintos. */
    const restantes = premios.filter((p) => !juego.tirados.includes(p.id))
    const premio = restantes[Math.floor(Math.random() * restantes.length)]
    const indice = premios.findIndex((p) => p.id === premio.id)

    setGirando(true)
    setRecienSalio(null)
    palanca.current?.classList.add('es-jalada')
    window.setTimeout(() => palanca.current?.classList.remove('es-jalada'), 620)

    setDuraciones(Array.from({ length: RODILLOS }, (_, i) => duracionDe(i)))
    setRotaciones((prev) =>
      prev.map((r, i) => calcularRotacion(r, indice, 4 + i)),
    )

    const espera = duracionDe(RODILLOS - 1) + 120
    temporizador.current = window.setTimeout(() => {
      setGirando(false)
      setRecienSalio(premio.id)
      setJuego((j) => ({ ...j, tirados: [...j.tirados, premio.id] }))

      const caja = palanca.current?.closest('.maquina')?.getBoundingClientRect()
      lanzarConfeti(
        caja
          ? { x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 }
          : undefined,
        70,
      )
    }, espera)
  }, [puedeGirar, juego.tirados])

  /* ── Reclamar ────────────────────────────────────────────────── */
  const reclamar = useCallback(async () => {
    if (!seleccion || bloqueado || envio.estado === 'enviando') return

    setEnvio({ estado: 'enviando' })

    const resultado = await enviarAviso({
      premio: porId(seleccion).nombre,
      opciones: juego.tirados.map((id) => porId(id).nombre),
      recado,
    })

    if (resultado.via === 'fallo') {
      setEnvio({ estado: 'hecho', via: resultado })
      return
    }

    setJuego((j) => ({
      ...j,
      elegido: seleccion,
      recado,
      reclamadoEn: new Date().toISOString(),
    }))
    setEnvio({ estado: 'hecho', via: resultado })
    lanzarConfeti(undefined, 140)
  }, [seleccion, bloqueado, envio.estado, juego.tirados, recado])

  const premioFinal = juego.elegido ? porId(juego.elegido) : null
  const falló = envio.estado === 'hecho' && envio.via.via === 'fallo'

  return (
    <Section
      id="premio"
      etiqueta="Tu recompensa"
      titulo={
        <>
          La máquina de <span className="grad-oro">premios</span>
        </>
      }
      bajada={
        bloqueado
          ? 'Ya pediste el tuyo. Esta máquina descansa hasta que Adrián la vuelva a prender.'
          : `Tienes ${TOTAL_GIROS} oportunidades. Gíralas todas y quédate con la que más te guste.`
      }
      className="tragaperras"
    >
      {avisoLlave && (
        <div className="aviso-llave" role="status">
          <span aria-hidden="true">✨</span> Máquina rehabilitada. Vuelve a girar,
          {' '}
          {config.ella.apodo}.
        </div>
      )}

      <Reveal desde="fondo">
        <div className={`maquina__zona ${bloqueado ? 'es-bloqueada' : ''}`}>
          {/* ── El mueble ──────────────────────────────────────── */}
          <div className="maquina">
            <div className="maquina__marquesina">
              <span className="maquina__foco" aria-hidden="true" />
              <h3 className="maquina__rotulo">Mi Ganadora</h3>
              <span className="maquina__foco" aria-hidden="true" />
            </div>

            <div className="maquina__cuerpo">
              <div className={`maquina__rodillos ${girando ? 'es-girando' : ''}`}>
                {rotaciones.map((r, i) => (
                  <Rodillo
                    key={i}
                    caras={premios}
                    rotacion={r}
                    duracion={duraciones[i]}
                    posicion={i + 1}
                  />
                ))}
              </div>

              <div className="palanca" ref={palanca} aria-hidden="true">
                <span className="palanca__vara" />
                <span className="palanca__bola" />
              </div>
            </div>

            <div className="maquina__base">
              <div className="fichas" aria-label={`Te quedan ${girosQuedan} oportunidades`}>
                {Array.from({ length: TOTAL_GIROS }, (_, i) => (
                  <span
                    key={i}
                    className={`ficha ${i < girosUsados ? 'es-usada' : ''}`}
                    aria-hidden="true"
                  />
                ))}
                <span className="fichas__texto">
                  {girosQuedan > 0
                    ? `${girosQuedan} ${girosQuedan === 1 ? 'oportunidad' : 'oportunidades'}`
                    : 'Ya no quedan giros'}
                </span>
              </div>

              <button
                type="button"
                className="btn btn--oro maquina__boton"
                onClick={girar}
                disabled={!puedeGirar}
              >
                {girando
                  ? 'Girando…'
                  : yaGiróTodo
                    ? 'Listo, ahora elige'
                    : girosUsados === 0
                      ? '¡Girar!'
                      : 'Girar otra vez'}
              </button>
            </div>
          </div>

          {/* ── Lo que le va saliendo ──────────────────────────── */}
          {girosUsados > 0 && (
            <div className="cartas">
              <p className="cartas__titulo">
                {yaGiróTodo
                  ? 'Te salieron estos tres. Toca el que quieras:'
                  : 'Lo que llevas hasta ahora:'}
              </p>

              <ul className="cartas__lista">
                {juego.tirados.map((id, i) => {
                  const p = porId(id)
                  const activa = seleccion === id
                  const nueva = recienSalio === id
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={`carta-premio ${activa ? 'es-elegida' : ''} ${nueva ? 'es-nueva' : ''}`}
                        style={{ ['--tinte' as string]: p.color }}
                        onClick={() => yaGiróTodo && !bloqueado && setSeleccion(id)}
                        disabled={!yaGiróTodo || bloqueado}
                        aria-pressed={activa}
                      >
                        <span className="carta-premio__num" aria-hidden="true">
                          0{i + 1}
                        </span>
                        <span className="carta-premio__icono" aria-hidden="true">
                          {p.icono}
                        </span>
                        <span className="carta-premio__nombre">{p.nombre}</span>
                        <span className="carta-premio__frase">{p.frase}</span>
                        {activa && (
                          <span className="carta-premio__sello" aria-hidden="true">
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* ── Reclamo ──────────────────────────────────── */}
              {yaGiróTodo && !bloqueado && (
                <div className="reclamo vidrio">
                  <label className="reclamo__campo">
                    <span>¿Le quieres decir algo a Adrián? (opcional)</span>
                    <textarea
                      value={recado}
                      onChange={(e) => setRecado(e.target.value.slice(0, 400))}
                      rows={3}
                      maxLength={400}
                      placeholder="Escribe aquí…"
                    />
                  </label>

                  <button
                    type="button"
                    className="btn btn--principal reclamo__boton"
                    onClick={reclamar}
                    disabled={!seleccion || envio.estado === 'enviando'}
                  >
                    {envio.estado === 'enviando'
                      ? 'Enviando…'
                      : seleccion
                        ? `Pedir: ${porId(seleccion).nombre}`
                        : 'Elige uno primero'}
                  </button>

                  {falló && (
                    <p className="reclamo__error" role="alert">
                      No se pudo mandar el aviso
                      {envio.estado === 'hecho' && envio.via.via === 'fallo'
                        ? ` (${envio.via.motivo})`
                        : ''}
                      . Inténtalo otra vez, o cuéntaselo directo 💗
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Velo de bloqueo ────────────────────────────────── */}
          {bloqueado && (
            <div className="velo" role="status">
              <div className="velo__tarjeta vidrio">
                <span className="velo__icono" aria-hidden="true">
                  {premioFinal?.icono ?? '💌'}
                </span>
                <h3 className="velo__titulo">Ya está pedido</h3>
                <p className="velo__premio">{premioFinal?.nombre}</p>
                <p className="velo__texto">
                  Adrián ya lo sabe. Ahora te toca esperar a que lo cumpla —
                  {' '}
                  y créeme que lo va a cumplir.
                </p>
                {envio.estado === 'hecho' && envio.via.via === 'correo-abierto' && (
                  <p className="velo__nota">
                    Se abrió tu correo con el mensaje listo. Solo dale enviar 💌
                  </p>
                )}
                <p className="velo__pie">
                  La máquina vuelve cuando él la prenda otra vez.
                </p>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  )
}
