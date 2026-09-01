import { Fondo } from './components/Fondo'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Carta } from './components/Carta'
import { Historia } from './components/Historia'
import { Ganadora } from './components/Ganadora'
import { Sayko } from './components/Sayko'
import { Galeria } from './components/Galeria'
import { Musica } from './components/Musica'
import { TikToks } from './components/TikToks'
import { Flores } from './components/Flores'
import { Tragaperras } from './components/tragaperras/Tragaperras'
import { Footer } from './components/Footer'
import { VisorProvider } from './components/ui/Visor'

export default function App() {
  return (
    <VisorProvider>
      <Fondo />

      <main id="contenido">
        <Hero />
        <Carta />
        <Historia />
        <Ganadora />
        <Sayko />
        <Galeria />
        <Musica />
        <TikToks />
        <Flores />
        <Tragaperras />
      </main>

      <Footer />
      <Nav />
    </VisorProvider>
  )
}
