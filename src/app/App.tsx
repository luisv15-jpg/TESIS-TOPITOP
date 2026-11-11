import { PrimeReactProvider } from 'primereact/api'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export function App() {
  return (
    <PrimeReactProvider value={{ ripple: false }}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  )
}
