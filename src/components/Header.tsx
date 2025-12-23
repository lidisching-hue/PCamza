import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <>
      {/* 1. BARRA SUPERIOR (Top Bar) - FONDO AZUL OSCURO PROFESIONAL */}
      <div className="bg-[#0a192f] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row justify-between items-center text-sm gap-2 sm:gap-0">
          
          {/* Ubicación con Icono SVG */}
          <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <div className="flex gap-1">
              <span className="font-semibold text-gray-300">Ubicación:</span>
              <span className="font-light tracking-wide">Las Lomas | Piura</span>
            </div>
          </div>

          {/* Redes Sociales con Iconos Reales */}
          <div className="flex items-center gap-5">
            <span className="text-gray-400 text-xs uppercase tracking-widest hidden sm:inline">Síguenos</span>
            <div className="flex gap-4">
              
              {/* Facebook Icon */}
              <a
                href="https://web.facebook.com/pcamza/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/perkam4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468.99c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL - DEGRADADO ROJO A AZUL */}
      <header className="bg-gradient-to-r from-[#ce1126] via-[#9e0e28] to-[#003366] shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4"> {/* Aumenté el padding vertical py-4 */}
          <div className="flex items-center justify-between">
            
            {/* Botón menú móvil (Icono SVG) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-gray-200 focus:outline-none"
              aria-label="Menú"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
               </svg>
            </button>

            {/* LOGO + NOMBRE (Aumentado de tamaño) */}
            <Link to="/" className="flex items-center gap-4 group">
              {/* Contenedor del Logo - MÁS GRANDE */}
              <div className="bg-white p-1.5 rounded-xl shadow-lg border-2 border-white/30 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                <img 
                    src="https://i.postimg.cc/Rh0CgnHt/PCAMZALOGO.jpg" 
                    alt="Logo Pcamza" 
                    className="h-14 w-auto md:h-16 object-contain rounded-lg" 
                />
              </div>
              
              {/* Texto PCAMZA */}
              <span className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-lg hidden sm:inline font-sans">
                PCAMZA
              </span>
            </Link>

            {/* NAVEGACIÓN DESKTOP */}
            <nav className="hidden lg:flex items-center gap-6">
              {[
                { path: "/", label: "Inicio" },
                { path: "/QuienesSomos", label: "Quienes somos" },
                { path: "/catalogos", label: "Ofertas" },
                { path: "/productos", label: "Productos" },
                { path: "/tiendas", label: "Tiendas" },
                { path: "/contacto", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-100 hover:text-white font-semibold transition-all text-sm uppercase tracking-wide relative group py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* ICONOS: BUSCAR Y CARRITO (SVGs Reales) */}
            <div className="flex items-center gap-6">
              {/* Icono Lupa */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white hover:text-gray-200 transition-colors transform hover:scale-110 focus:outline-none"
                aria-label="Buscar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Icono Carrito */}
              <Link 
                to="/carrito" 
                state={{ background: location }} 
                className="relative group flex items-center"
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white group-hover:text-gray-100 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce border border-red-900">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA DESPLEGABLE */}
          {isSearchOpen && (
            <div className="mt-4 pb-2 animate-fade-in-down">
              <div className="relative max-w-3xl mx-auto">
                <input
                  type="text"
                  placeholder="Buscar productos en Pcamza..."
                  className="w-full px-6 py-4 rounded-full border-0 shadow-2xl text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-blue-400/50 focus:outline-none text-lg"
                  autoFocus
                />
                <button className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MENÚ MÓVIL (Off-canvas) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay oscuro */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Panel del menú lateral */}
          <div className="relative bg-white w-80 h-full overflow-y-auto shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-6 bg-gradient-to-r from-red-700 to-blue-900 flex justify-between items-center text-white shadow-md">
              <span className="text-xl font-bold flex items-center gap-2">
                 MENÚ
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-white/10 rounded-full p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col p-4 space-y-2 flex-grow bg-gray-50">
              {[
                { path: "/", label: "Inicio" },
                { path: "/QuienesSomos", label: "Quienes somos" },
                { path: "/catalogos", label: "Catálogos de ofertas" },
                { path: "/productos", label: "Productos Merkat" },
                { path: "/tiendas", label: "Nuestras Tiendas" },
                { path: "/contacto", label: "Contáctanos" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between py-4 px-4 text-gray-700 hover:bg-white hover:text-red-700 hover:shadow-sm rounded-xl transition-all font-semibold border border-transparent hover:border-gray-100"
                >
                  {link.label}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </nav>

            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600 mt-1">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-bold text-gray-800 text-base">Ubicación Central</div>
                  <div className="text-gray-500">Las Lomas | Piura</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header