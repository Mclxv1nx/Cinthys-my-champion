/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** EmailJS — el camino recomendado: el correo sale de tu propio Gmail. */
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
  /** Alternativa: access key de Web3Forms. */
  readonly VITE_WEB3FORMS_KEY?: string
  /** Tu correo, usado como respaldo si no hay access key. */
  readonly VITE_EMAIL_DESTINO?: string
  /** Palabra secreta para volver a habilitar el tragaperras: ?llave=... */
  readonly VITE_LLAVE_SECRETA?: string
  /** ID de la playlist de Spotify (solo el id, sin la url). */
  readonly VITE_SPOTIFY_PLAYLIST_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
