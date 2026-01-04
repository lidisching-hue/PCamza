import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { CartProvider } from './context/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // 1. Importar
import App from './App'
import './index.css'

// 2. Configuración Profesional del Caché
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos: Los datos se consideran "nuevos" por este tiempo
      gcTime: 1000 * 60 * 30,   // 30 minutos: Se guardan en memoria basura antes de borrar
      refetchOnWindowFocus: false, // No recargar si el usuario cambia de pestaña (ahorra datos)
      retry: 1, // Si falla internet, reintenta 1 vez
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 3. Envolver TODA la app con el Provider */}
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>
)