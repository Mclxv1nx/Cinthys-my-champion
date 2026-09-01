import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/tokens.css'
import './styles/global.css'
import './styles/ui.css'
import './styles/sections.css'
import './styles/tragaperras.css'

import App from './App'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No se encontró #root en index.html')

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
