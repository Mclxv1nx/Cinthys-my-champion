import { config } from '@/lib/config'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'

const { spotifyPlaylist, spotifyPlaylistId, youtubeCancionId } = config.enlaces

/** La playlist "Pika de Cin" y la canción que le dedico. */
export function Musica() {
  return (
    <Section
      id="musica"
      etiqueta="Lo que suena"
      titulo={
        <>
          Pika de <span className="grad">Cin</span>
        </>
      }
      bajada="Nuestra playlist, y una canción que cada vez que suena me acuerdo de ti."
      className="musica"
    >
      <div className="musica__grid">
        <Reveal desde="izquierda">
          <article className="disco-card vidrio">
            <div className="disco-card__cabeza">
              <div className="disco" aria-hidden="true">
                <div className="disco__surco" />
                <div className="disco__surco disco__surco--2" />
                <div className="disco__centro" />
              </div>
              <div>
                <h3 className="disco-card__titulo">Pika de Cin</h3>
                <p className="disco-card__sub">La playlist oficial</p>
              </div>
            </div>

            {spotifyPlaylistId ? (
              <iframe
                className="musica__embed"
                title="Playlist Pika de Cin en Spotify"
                src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?theme=0`}
                height={352}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            ) : (
              <div className="musica__hueco">
                <p>
                  Ábrela en Spotify y dale <em>play</em> mientras miras el resto.
                </p>
                <a
                  className="btn btn--principal"
                  href={spotifyPlaylist}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Abrir en Spotify
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}
          </article>
        </Reveal>

        <Reveal desde="derecha" demora={90}>
          <article className="video-card vidrio">
            <div className="video-card__cabeza">
              <span className="video-card__icono" aria-hidden="true">
                🎧
              </span>
              <div>
                <h3 className="disco-card__titulo">La que te dedico</h3>
                <p className="disco-card__sub">Súbele el volumen, va en serio</p>
              </div>
            </div>

            <div className="marco16">
              <iframe
                title="Canción dedicada a Cinthya"
                src={`https://www.youtube-nocookie.com/embed/${youtubeCancionId}?rel=0`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="video-card__nota nota">
              Cada vez que suena pienso en ti. Ni modo, ya es tuya.
            </p>
          </article>
        </Reveal>
      </div>
    </Section>
  )
}
