/**
 * Configuración central del sitio.
 * Todo lo que quieras cambiar sin tocar componentes vive aquí.
 */

const env = import.meta.env

export const config = {
  /** Para quién es todo esto. */
  ella: {
    nombre: 'Cinthya',
    nombreCompleto: 'Cinthya Orbe',
    apodo: 'Cinthy',
  },

  /** Quién la hizo. */
  yo: {
    nombre: 'Adrián',
    correo: env.VITE_EMAIL_DESTINO || 'sanchezadrianu@gmail.com',
  },

  /** Fechas que importan. Formato ISO (YYYY-MM-DD). */
  fechas: {
    /** 31 de julio de 2026 — el día que la conociste. */
    nosConocimos: '2026-07-31',
  },

  /** Enlaces externos. */
  enlaces: {
    spotifyPlaylist: 'https://open.spotify.com/s/RS0YYdk',
    spotifyPlaylistId: env.VITE_SPOTIFY_PLAYLIST_ID || '',
    youtubeCancionId: 'qz0WjbGlmv0',
    flores: 'https://corazondemelonsandia.netlify.app',
  },

  /** TikToks que le dedico. */
  tiktoks: [
    {
      id: '7578680203195649298',
      usuario: '@alizznicolle23',
      titulo: 'Guardarraya',
      nota: 'Esta me acordó a ti apenas la escuché.',
    },
    {
      id: '7277081640080264454',
      usuario: '@ese.man',
      titulo: 'Guambra de ojos cafés',
      nota: 'Oye guambra de ojos cafés… sí, tú.',
    },
  ],

  /** Correo de aviso cuando ella pide su premio. */
  correo: {
    /** EmailJS — el camino recomendado. Sale de tu propio Gmail. */
    emailjs: {
      serviceId: env.VITE_EMAILJS_SERVICE_ID || '',
      templateId: env.VITE_EMAILJS_TEMPLATE_ID || '',
      publicKey: env.VITE_EMAILJS_PUBLIC_KEY || '',
    },
    /** Alternativa: access key gratis de https://web3forms.com (sin cuenta). */
    web3formsKey: env.VITE_WEB3FORMS_KEY || '',
  },

  /**
   * Tragaperras.
   * `llaveSecreta` es la palabra que va en la URL para rehabilitarlo:
   *   https://tu-sitio.vercel.app/?llave=lo-que-pusiste
   */
  tragaperras: {
    giros: 3,
    llaveSecreta: env.VITE_LLAVE_SECRETA || 'cinthy-otra-vuelta',
    /** Nombre del parámetro en la URL. */
    paramLlave: 'llave',
  },
} as const

export type Config = typeof config
