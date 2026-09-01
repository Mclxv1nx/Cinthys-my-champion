# Cinthys · My Champion 🏆

Una landing page para **Cinthya Orbe**. Modo oscuro, mobile-first, con efectos
CSS 3D de verdad y un tragaperras que le regala un premio.

React 18 + Vite 5 + TypeScript. Sin librerías de animación, sin UI kit, sin
backend. El bundle pesa ~58 KB gzip.

---

## Arrancarlo

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # deja todo listo en dist/
npm run preview  # revisa el build antes de subirlo
```

---

## Los 3 ajustes que tienes que hacer

Copia `.env.example` como `.env` y llena los valores. Solo el primero es
imprescindible.

### 1. El correo que te avisa · EmailJS

Es lo que buscabas: el correo sale de **tu propio Gmail**
(`adrianurresta108@gmail.com`) y llega a `sanchezadrianu@gmail.com`. Ella no da
ningún paso extra — aprieta "Pedir mi premio" y el correo ya salió. Gratis, sin
tarjeta, 200 correos al mes.

**Los 4 pasos (unos 5 minutos):**

1. Crea la cuenta en **https://www.emailjs.com**.
2. **Email Services → Add New Service → Gmail → Connect Account.** Inicia sesión
   con `adrianurresta108@gmail.com` y acepta los permisos.
   Copia el **Service ID**.
3. **Email Templates → Create New Template.** Llena así:

   | Campo | Qué pones |
   | --- | --- |
   | To Email | `sanchezadrianu@gmail.com` |
   | From Name | `Mi Ganadora` |
   | Subject | `{{subject}}` |
   | Content | `{{message}}` |

   Guarda y copia el **Template ID**.
4. **Account → General → Public Key.** Cópiala.

Y los pegas en el `.env`:

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

> Si quieres un correo más bonito, en vez de `{{message}}` puedes armar la
> plantilla con las variables sueltas: `{{premio}}`, `{{opciones}}`,
> `{{recado}}` y `{{fecha}}`. La página manda las cuatro siempre.

> La *Public Key* es pública a propósito: está hecha para vivir en el navegador.
> La **Private Key** nunca la pongas aquí. Si en EmailJS activas *Allowed
> Origins*, agrega el dominio de Vercel; si lo dejas vacío funciona desde
> cualquier lado.

**Alternativa sin crear cuenta:** deja lo de EmailJS vacío y llena
`VITE_WEB3FORMS_KEY`. Entras a https://web3forms.com, escribes
`sanchezadrianu@gmail.com` y te dan un *Access Key* al instante.

**Si no configuras ninguno** la página igual funciona: abre la app de correo de
ella con el mensaje ya escrito. Pero es un paso más para ella — mejor configura
EmailJS.

### 2. La llave para rehabilitar el tragaperras · `VITE_LLAVE_SECRETA`

Cámbiala por algo que solo tú sepas.

```
VITE_LLAVE_SECRETA=lo-que-tu-quieras
```

### 3. La playlist de Spotify · `VITE_SPOTIFY_PLAYLIST_ID`

Abre *Pika de Cin* en Spotify → **⋯ → Compartir → Copiar enlace**. Te queda algo
como `https://open.spotify.com/playlist/AbC123XyZ?si=...`; copia **solo** el
pedazo entre `/playlist/` y el `?`.

```
VITE_SPOTIFY_PLAYLIST_ID=AbC123XyZ
```

Si lo dejas vacío, esa tarjeta muestra un botón que abre la playlist en Spotify
— también se ve bien, solo que sin el reproductor incrustado.

> En Vercel estas tres van en **Project Settings → Environment Variables**, con
> los mismos nombres. Ojo: todo lo que empieza con `VITE_` viaja al navegador,
> así que ahí no pongas contraseñas de verdad.

---

## Cómo funciona el tragaperras

1. Cinthy tiene **3 giros**. Los tres rodillos caen siempre en el mismo premio
   (siempre gana), y cada giro le saca un premio **distinto** a los anteriores.
2. Al terminar los tres, elige el que más le guste y puede dejarte un recado.
3. Al pedirlo **te llega el correo** con el premio elegido, los otros dos que le
   salieron y su recado.
4. La máquina **se bloquea con blur** y le queda una tarjeta que dice que ya
   está pedido.

### Volver a habilitarla

Mándale este enlace (con tu llave secreta):

```
https://tu-sitio.vercel.app/?llave=lo-que-tu-quieras
```

Cuando lo abra, la máquina se reinicia sola, le sale un aviso y el parámetro
desaparece de la barra de direcciones.

**Importante:** el estado vive en el navegador de ella (`localStorage`), que es
lo que elegimos para no montar un backend. Eso significa que:

- Si ella borra los datos del navegador o entra desde otro teléfono, la máquina
  vuelve a estar libre.
- No puedes bloquearla ni desbloquearla a distancia sin mandarle el enlace.

Si algún día quieres control real desde tu celular, ve a la sección
[Meterle un backend](#meterle-un-backend-despues).

---

## Dónde cambiar las cosas

| Qué quieres cambiar | Archivo |
| --- | --- |
| Tu nombre, el de ella, correo, enlaces, TikToks | `src/lib/config.ts` |
| **La fecha en que se conocieron** (el contador de la portada) | `src/lib/config.ts` → `fechas.nosConocimos` |
| Los premios del tragaperras (nombre, emoji, frase, color) | `src/data/premios.ts` |
| Los recuerdos de la línea de tiempo | `src/data/momentos.ts` |
| Las fotos del carrusel 3D | `src/data/galeria.ts` |
| Los colores, tipografías y tamaños de todo el sitio | `src/styles/tokens.css` |
| Fotos y videos | `public/media/` |

Los textos de cada sección están dentro de su propio componente en
`src/components/`, en español y fáciles de encontrar.

> La fecha `nosConocimos` está en `2026-07-31`. El contador de días de la
> portada se calcula solo a partir de ahí.

---

## Subirlo a GitHub

**La forma fácil:** doble clic en **`subir-a-github.bat`**. Hace todo solo y te
abre el navegador para iniciar sesión con tu cuenta (`Mclxv1nx`). Solo la
primera vez.

**A mano**, si prefieres:

```bash
git init -b main
git add .
git commit -m "Landing para Cinthy"
git remote add origin https://github.com/Mclxv1nx/Cinthys-my-champion.git
git push -u origin main
```

Si el repo ya tenía commits, primero:

```bash
git pull origin main --allow-unrelated-histories
```

> El `.env` **no se sube** (está en el `.gitignore`), que es justo lo que
> queremos: las variables van en Vercel, no en el repo público.

---

## Desplegar en Vercel

1. Entra a **https://vercel.com** con tu cuenta de GitHub.
2. **Add New → Project** y elige `Cinthys-my-champion`.
3. Vercel detecta Vite solo. No cambies nada: build `npm run build`, salida `dist`.
4. Antes de darle **Deploy**, abre *Environment Variables* y pega las tres
   variables del `.env`.
5. Deploy. En un minuto tienes la URL.

Cada `git push` a `main` vuelve a desplegar solo.

---

## Meterle un backend después

El código ya está partido para eso. Solo hay dos archivos que hablan con el
mundo exterior:

- **`src/lib/notify.ts`** — manda el aviso por correo. Adentro hay una lista de
  "transportes" que se prueban en orden (EmailJS → Web3Forms → abrir el correo
  de ella). Para meter tu Nest, borras los transportes y dejas uno solo que haga
  `fetch` a tu endpoint.
- **`src/lib/storage.ts`** — guarda el estado del juego (giros, premio elegido,
  bloqueo). Cambia las cuatro funciones por llamadas a tu API y el bloqueo pasa
  a ser de verdad: lo prendes y lo apagas desde donde quieras, y funciona en
  cualquier teléfono de ella.

Ningún componente sabe de dónde salen los datos, así que no tienes que tocar
nada más.

---

## Detalles técnicos

- **El contador de días es automático.** Sale de `fechas.nosConocimos` en
  `src/lib/config.ts` y se recalcula cada vez que alguien abre la página. No hay
  que tocarlo nunca.
- **Fotos en tres tamaños.** Cada imagen existe en 480, 760 y 1200 px de ancho;
  el componente `<Foto>` arma el `srcset` y el navegador baja la que necesita.
  Un celular baja ~35 KB donde antes bajaba ~105 KB.
- **Los videos no pesan hasta que se tocan.** En las tarjetas solo se ve el
  poster (una imagen). El `.mp4` se descarga recién cuando ella toca play, y se
  abre en un visor a pantalla completa con su proporción real — nada de videos
  verticales aplastados dentro de una caja horizontal.
- **Nada de `backdrop-filter` en lo que scrollea.** Es lo más caro de pintar en
  un celular; se cambió por colores planos que sobre fondo oscuro se ven igual.
  Solo queda en la barra flotante y en el visor, que son un elemento cada uno.
- **Los rodillos son cilindros CSS 3D reales.** Cada premio es una cara pegada
  por dentro con `rotateX(i·paso) translateZ(radio)`; girar es rotar el
  cilindro. El radio se calcula en JS a partir del alto real de la ventanita,
  así que funciona en cualquier pantalla y con cualquier número de premios.
- **El carrusel de la galería** usa el mismo truco pero en el eje Y, y se
  arrastra con el dedo, el mouse o las flechas del teclado.
- **La portada y varias tarjetas** se inclinan siguiendo el puntero en desktop y
  el giroscopio en celular (`src/hooks/useTilt.ts`). Escriben variables CSS, no
  estado de React, así que no re-renderizan nada.
- **Las apariciones al hacer scroll** (`src/hooks/useReveal.ts`) usan un solo
  vigilante para toda la página, con una medición por cuadro y solo mientras hay
  scroll. Si alguien baja muy rápido, ningún bloque se queda invisible.
- **Todo respeta `prefers-reduced-motion`**: si el sistema pide menos
  movimiento, las animaciones se apagan y el contenido se muestra directo.
- Imágenes en WebP y videos re-comprimidos: los 13 MB originales quedaron en
  ~4 MB en disco, y la página abre con 125 KB.

### Medido en un celular de gama media (CPU 6× más lenta)

| | Antes | Ahora |
| --- | --- | --- |
| FPS en la portada | 22 | 60 |
| FPS haciendo scroll | 17 | 57 |
| Peso al abrir | 333 KB | 125 KB |
| Peso tras verla entera | 1083 KB | 367 KB |
| Cuadros trabados al scrollear | 25 | 0 |

---

Hecho a mano para Cinthy 💗
