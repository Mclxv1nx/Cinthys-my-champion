/**
 * Aviso por correo cuando Cinthy pide su premio.
 *
 * Hay tres caminos. Se prueban en este orden y se usa el primero que
 * esté configurado:
 *
 *   1. EMAILJS  ← el recomendado.
 *      Conectas tu Gmail (adrianurresta108@gmail.com) una sola vez, y desde
 *      ahí sale el correo hacia sanchezadrianu@gmail.com. Sin servidor, sin
 *      backend, y ella no tiene que hacer absolutamente nada.
 *
 *   2. WEB3FORMS
 *      Alternativa sin cuenta: pones tu correo, te dan una key y listo.
 *
 *   3. MAILTO (último recurso)
 *      Si no hay nada configurado, se abre la app de correo de ella con el
 *      mensaje ya escrito. Funciona, pero tiene que darle a enviar.
 *
 * El día que montes el Nest: borra los transportes y deja uno solo que
 * haga `fetch` a tu endpoint. Ningún componente se entera.
 */

import { config } from './config'

const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send'
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

export type DatosAviso = {
  /** Nombre del premio que eligió. */
  premio: string
  /** Los tres que le salieron. */
  opciones: string[]
  /** Recado opcional de ella. */
  recado: string
}

export type ResultadoAviso =
  | { via: 'emailjs' }
  | { via: 'web3forms' }
  | { via: 'correo-abierto' }
  | { via: 'fallo'; motivo: string }

/* ── Texto del correo ─────────────────────────────────────── */

function cuandoFue(): string {
  return new Date().toLocaleString('es-EC', { dateStyle: 'full', timeStyle: 'short' })
}

function armarTexto({ premio, opciones, recado }: DatosAviso): string {
  return [
    `${config.ella.nombre} ya giró la máquina y eligió su premio.`,
    '',
    `PREMIO ELEGIDO:  ${premio}`,
    `LE SALIERON:     ${opciones.join('  ·  ')}`,
    '',
    recado.trim() ? `RECADO DE ELLA:\n"${recado.trim()}"` : 'No dejó recado.',
    '',
    `Cuándo: ${cuandoFue()}`,
    '',
    '— Enviado desde la página que le hiciste.',
  ].join('\n')
}

const asuntoDe = (premio: string) => `${config.ella.nombre} pidió su premio: ${premio}`

/* ── 1. EmailJS ───────────────────────────────────────────── */

async function porEmailjs(datos: DatosAviso): Promise<ResultadoAviso | null> {
  const { serviceId, templateId, publicKey } = config.correo.emailjs
  if (!serviceId || !templateId || !publicKey) return null

  try {
    const respuesta = await fetch(EMAILJS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          /* Estos nombres son los que usas en la plantilla de EmailJS
             como {{to_email}}, {{premio}}, etc. */
          to_email: config.yo.correo,
          from_name: `${config.ella.nombreCompleto} · Mi Ganadora`,
          subject: asuntoDe(datos.premio),
          premio: datos.premio,
          opciones: datos.opciones.join(' · '),
          recado: datos.recado.trim() || '(sin recado)',
          fecha: cuandoFue(),
          message: armarTexto(datos),
        },
      }),
    })

    if (respuesta.ok) return { via: 'emailjs' }

    const detalle = await respuesta.text().catch(() => '')
    return {
      via: 'fallo',
      motivo: detalle.slice(0, 120) || `EmailJS respondió ${respuesta.status}.`,
    }
  } catch {
    return { via: 'fallo', motivo: 'No hay internet o la conexión con EmailJS falló.' }
  }
}

/* ── 2. Web3Forms ─────────────────────────────────────────── */

async function porWeb3forms(datos: DatosAviso): Promise<ResultadoAviso | null> {
  const key = config.correo.web3formsKey
  if (!key) return null

  try {
    const respuesta = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: asuntoDe(datos.premio),
        from_name: `${config.ella.nombreCompleto} · Mi Ganadora`,
        premio: datos.premio,
        le_salieron: datos.opciones.join(' · '),
        recado: datos.recado.trim() || '(sin recado)',
        message: armarTexto(datos),
        /* Miel para bots: Web3Forms descarta el envío si viene llena. */
        botcheck: '',
      }),
    })

    const cuerpo = (await respuesta.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null

    if (respuesta.ok && cuerpo?.success) return { via: 'web3forms' }

    return {
      via: 'fallo',
      motivo: cuerpo?.message || `Web3Forms respondió ${respuesta.status}.`,
    }
  } catch {
    return { via: 'fallo', motivo: 'No hay internet o la conexión con Web3Forms falló.' }
  }
}

/* ── 3. Abrir el correo de ella ───────────────────────────── */

function porMailto(datos: DatosAviso): ResultadoAviso {
  const url =
    `mailto:${encodeURIComponent(config.yo.correo)}` +
    `?subject=${encodeURIComponent(asuntoDe(datos.premio))}` +
    `&body=${encodeURIComponent(armarTexto(datos))}`

  try {
    window.location.href = url
    return { via: 'correo-abierto' }
  } catch {
    return { via: 'fallo', motivo: 'No se pudo abrir la app de correo.' }
  }
}

/* ── Punto de entrada ─────────────────────────────────────── */

/**
 * Manda el aviso por el primer transporte configurado.
 * Nunca lanza: siempre devuelve algo que la interfaz pueda mostrar.
 */
export async function enviarAviso(datos: DatosAviso): Promise<ResultadoAviso> {
  const transportes = [porEmailjs, porWeb3forms]

  for (const intentar of transportes) {
    const resultado = await intentar(datos)
    /* null = ese transporte no está configurado; seguimos con el siguiente.
       Cualquier otra cosa (éxito o fallo real) es la respuesta final. */
    if (resultado) return resultado
  }

  return porMailto(datos)
}
