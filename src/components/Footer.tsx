import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="relative">
      
      {/* Contenido principal con Degradado Moderno */}
      {/* El degradado va de un azul muy oscuro (slate/blue) hacia el rojo de la marca */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-red-900 text-white py-14 relative overflow-hidden">
        
        {/* Efecto de luz opcional en el fondo para profundidad */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          
          {/* 1. Logo y Redes Sociales */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-red-600 text-white font-bold px-3 py-2 rounded-lg text-xl shadow-lg group-hover:bg-red-500 transition-colors">
                🛒
              </div>
              <span className="text-2xl font-bold tracking-wide">PCAMZA</span>
            </div>
            <p className="text-gray-300 text-sm italic border-l-2 border-red-500 pl-3">
              "Donde comprar, es ahorrar"
            </p>
            
            {/* Redes Sociales con Iconos SVG */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-pink-600 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Nosotros */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-red-400 border-b border-red-500/30 inline-block pb-2">Nosotros</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/quienes-somos" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Quienes somos
                </Link>
              </li>
              <li>
                <Link to="/tiendas" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Tiendas
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Atención al cliente */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-red-400 border-b border-red-500/30 inline-block pb-2">Atención al cliente</h4>
            <ul className="space-y-3">
              <li><Link to="/legales" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Legales</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Revisa tu boleta/factura</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Canal de denuncias</a></li>
              <li><Link to="/comunicados" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Comunicados</Link></li>
              <li className="pt-4">
                <a href="#" className="inline-block hover:brightness-110 transition-all">
                   {/* Botón de Libro de Reclamaciones estilizado */}
                  <div className="bg-white rounded-lg p-1">
                    <img src="https://www.sutran.gob.pe/wp-content/uploads/2022/11/logo_libro_reclam.jpg" alt="Libro de Reclamaciones" className="h-8 md:h-10 object-contain rounded" />
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Canal Institucional */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-red-400 border-b border-red-500/30 inline-block pb-2">Ventas Institucionales</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://api.whatsapp.com/send?phone=+51912822543" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-300 hover:text-green-400 transition-colors group">
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-green-500/20 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 font-semibold uppercase">WhatsApp Ventas</span>
                    <span className="font-medium">+51 972 157 530</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:ventaspecamza@gmail.com" className="flex items-start gap-3 text-gray-300 hover:text-red-400 transition-colors group">
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-red-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-xs text-gray-400 font-semibold uppercase">Correo</span>
                    <span className="font-medium truncate block">ventaspecamza@gmail.com</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barra inferior - Copyright con fondo semi-transparente oscuro */}
      <div className="bg-black/40 backdrop-blur-sm absolute bottom-0 w-full border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span>Perú</span>
            </div>
            <div className="text-center md:text-right">
              <p>
                © {new Date().getFullYear()} <span className="text-white font-semibold">PCAMZA</span>. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante de WhatsApp Moderno */}
      <a
        href="https://api.whatsapp.com/send?phone=+51994166419&text=Hola,%20necesito%20información%20sobre%20sus%20productos."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 z-50 flex items-center justify-center group animate-bounce-slow"
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zM12.05 20.21c-1.5 0-2.97-.39-4.27-1.14l-.3-.18-3.15.83.84-3.07-.19-.31a8.154 8.154 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.14 8.23zm4.51-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.24.26-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.24-.18-.48-.3z"/>
        </svg>
      </a>
    </footer>
  )
}

export default Footer