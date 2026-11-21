import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/montserrat/wght.css'
import './styles/tokens.css'
import './styles/global.css'
import { App } from './app/App'
import { ID_RAIZ_APP } from './shared/lib/dom'

const raiz = document.getElementById(ID_RAIZ_APP)
if (!raiz) throw new Error(`Falta el elemento #${ID_RAIZ_APP} en index.html`)

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
