import { PrimeReactProvider } from 'primereact/api'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes'

// En la VPS la tienda vive bajo una ruta propia (VITE_BASE al compilar); en local, en la raíz.
const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

export function App() {
  return (
    <PrimeReactProvider value={{ ripple: false }}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  )
}
