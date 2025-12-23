import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Producto } from '../types/Producto'
import { obtenerProductos } from '../services/productos.service'
import { useCart } from '../hooks/useCart'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Catalogos() {
  const [ofertas, setOfertas] = useState<Producto[]>([])
  const { addToCart } = useCart()
  
  // Estado para la cuenta regresiva (efecto visual de urgencia)
  const [tiempo, setTiempo] = useState({ horas: 12, minutos: 0, segundos: 0 })

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const data = await obtenerProductos()
        // CORRECCIÓN: Filtramos usando tu propiedad real 'ofertaactiva'
        // y nos aseguramos que tenga un precio de oferta válido
        const soloOfertas = data.filter(p => p.ofertaactiva === true && p.preciooferta !== null)
        setOfertas(soloOfertas)
      } catch (error) {
        console.error("Error cargando catálogo", error)
      }
    }
    cargarOfertas()
  }, [])

  // Lógica del temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempo(prev => {
        if (prev.segundos > 0) return { ...prev, segundos: prev.segundos - 1 }
        if (prev.minutos > 0) return { ...prev, minutos: prev.minutos - 1, segundos: 59 }
        if (prev.horas > 0) return { ...prev, horas: prev.horas - 1, minutos: 59, segundos: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Función para calcular el porcentaje de descuento
  const calcularDescuento = (precioNormal: number, precioOferta: number | null) => {
    if (!precioNormal || !precioOferta) return 0
    const descuento = ((precioNormal - precioOferta) / precioNormal) * 100
    return Math.round(descuento)
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans">
      <Header />

      <main>
        {/* --- HERO: ENCABEZADO IMPACTANTE TIPO FOLLETO --- */}
        <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="text-center md:text-left space-y-4">
                <span className="bg-yellow-400 text-red-900 font-black px-4 py-1 rounded-full text-sm uppercase tracking-wider inline-block transform -rotate-2 shadow-lg">
                  ¡Solo por tiempo limitado!
                </span>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-white drop-shadow-md">
                  CIERRA <br/> PUERTAS PCAMZA
                </h1>
                <p className="text-xl text-red-100 font-medium">
                  Los mejores descuentos del mes en un solo lugar.
                </p>
              </div>

              {/* Temporizador */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <p className="text-center text-red-100 mb-2 font-bold uppercase text-sm tracking-widest">Las ofertas terminan en:</p>
                <div className="flex gap-4 text-center">
                  <div>
                    <div className="bg-white text-red-700 font-black text-4xl w-20 h-20 rounded-xl flex items-center justify-center shadow-lg">
                      {tiempo.horas.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs mt-1 block">HORAS</span>
                  </div>
                  <div className="text-4xl font-bold flex items-center">:</div>
                  <div>
                    <div className="bg-white text-red-700 font-black text-4xl w-20 h-20 rounded-xl flex items-center justify-center shadow-lg">
                      {tiempo.minutos.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs mt-1 block">MIN</span>
                  </div>
                  <div className="text-4xl font-bold flex items-center">:</div>
                  <div>
                    <div className="bg-yellow-400 text-red-800 font-black text-4xl w-20 h-20 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                      {tiempo.segundos.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs mt-1 block">SEG</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Forma de ola abajo */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#f3f4f6]"></path>
            </svg>
          </div>
        </section>

        {/* --- GRID DE OFERTAS ESTILO FOLLETO --- */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          
          {ofertas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ofertas.map((producto) => {
                // CORRECCIÓN: Usamos 'preciooferta' para el cálculo
                const porcentajeDescuento = calcularDescuento(producto.precio, producto.preciooferta)
                
                return (
                  <div key={producto.id} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-red-500">
                    
                    {/* Badge de Descuento (Estrella/Círculo llamativo) */}
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-yellow-400 text-red-800 font-black text-xs md:text-sm py-2 px-3 rounded-bl-2xl shadow-md">
                        -{porcentajeDescuento}%
                      </div>
                    </div>

                    {/* Etiqueta "EXCLUSIVO" */}
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            ¡OFERTA!
                        </span>
                    </div>

                    {/* Imagen del Producto */}
                    <div className="relative h-48 md:h-60 p-4 bg-white flex items-center justify-center overflow-hidden">
                      {/* CORRECCIÓN: Usamos 'imagen_url' y validamos si es null */}
                      {producto.imagen_url ? (
                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-gray-300 text-center">
                          <span className="text-4xl">📷</span>
                          <p className="text-xs mt-1">Sin imagen</p>
                        </div>
                      )}
                    </div>

                    {/* Información y Precio */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <h3 className="text-gray-800 font-semibold text-sm md:text-base line-clamp-2 min-h-[40px] mb-2 leading-tight">
                        {producto.nombre}
                      </h3>

                      <div className="flex flex-col mb-3">
                        {/* Precio Anterior (Tachado) */}
                        <span className="text-gray-400 text-xs line-through decoration-red-500 decoration-1">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                        
                        {/* Precio Oferta (Gigante) - CORRECCIÓN: Usamos preciooferta */}
                        <div className="flex items-baseline gap-1 text-red-600">
                            <span className="text-sm font-bold">S/</span>
                            <span className="text-3xl font-black tracking-tighter">
                                {producto.preciooferta?.toFixed(2) ?? "0.00"}
                            </span>
                        </div>
                      </div>

                      {/* Botón de Acción */}
                      <button
                        onClick={() => addToCart(producto)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        Agregar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-2xl font-bold text-gray-700">No hay ofertas activas por ahora</h2>
              <p className="text-gray-500 mt-2">Estamos actualizando nuestros precios. Vuelve pronto.</p>
              <Link to="/productos" className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700">
                Ver catálogo general
              </Link>
            </div>
          )}

        </section>

        {/* --- BANNER INFORMATIVO FINAL --- */}
        <section className="bg-yellow-400 py-6 mb-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                <div className="bg-white p-3 rounded-full shadow-sm text-3xl">🚛</div>
                <div>
                    <h3 className="text-red-900 font-bold text-lg uppercase">¡Delivery Gratis!</h3>
                    <p className="text-red-800 text-sm">Por compras mayores a S/ 100 en productos seleccionados.</p>
                </div>
                <div className="h-8 w-px bg-red-900/20 hidden md:block"></div>
                <div className="bg-white p-3 rounded-full shadow-sm text-3xl">💳</div>
                <div>
                    <h3 className="text-red-900 font-bold text-lg uppercase">Paga Seguro</h3>
                    <p className="text-red-800 text-sm">Aceptamos todas las tarjetas y billeteras digitales.</p>
                </div>
            </div>
        </section>





{/* Banner de WhatsApp con QR, Texto y Botón a la derecha */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            
            {/* 1. LADO IZQUIERDO: Imagen QR */}
            <div className="bg-white p-2 rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
              <img 
                src="https://i.postimg.cc/SRdCH8jk/PCamza.png" 
                alt="QR Canal WhatsApp" 
                className="w-32 h-32 md:w-36 md:h-36 object-contain"
              />
            </div>

            {/* 2. CENTRO: Texto Informativo (ocupa el espacio disponible) */}
            <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl font-bold mb-2">
                ¡Únete a nuestro Canal!
              </h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Escanea el código QR con tu celular o usa el botón para unirte a nuestro canal. <br className="hidden md:block"/>
                Recibe ofertas exclusivas al instante.
              </p>
            </div>

            {/* 3. LADO DERECHO: Botón de acción */}
            <div className="flex-shrink-0">
              <a
                href="https://whatsapp.com/channel/0029Vb9q1tJJZg46Segt7c04"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <span className="text-lg">Chatear ahora</span>
                {/* Flecha animada al hacer hover */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>





      </main>

      <Footer />
    </div>
  )
}

export default Catalogos