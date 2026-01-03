import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Oferta } from '../types/Oferta'
import { useCart } from '../hooks/useCart'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
// 👇 Tu importación original se mantiene intacta
import { obtenerOfertasCombos, obtenerConfigOferta } from '../services/contenido.service'

function Catalogos() {
  const [combos, setCombos] = useState<Oferta[]>([])
  const { addToCart } = useCart()
  
  // ESTADO PARA LA CONFIGURACIÓN DINÁMICA
  const [config, setConfig] = useState({
    titulo: 'Cargando...',
    subtitulo: '',
    fecha_fin: null as string | null,
    activo: true
  })

  // Estado del contador visual
  const [tiempo, setTiempo] = useState({ horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Cargar Combos
        const dataCombos = await obtenerOfertasCombos()
        setCombos(dataCombos)

        // 2. Cargar Configuración del Banner
        const dataConfig = await obtenerConfigOferta()
        if (dataConfig) {
            setConfig(dataConfig)
            // Calculamos el tiempo inicial
            calcularTiempoRestante(dataConfig.fecha_fin)
        }

      } catch (error) {
        console.error("Error cargando datos", error)
      }
    }
    cargarDatos()
  }, [])

  // Lógica del Temporizador
  useEffect(() => {
    if (!config.fecha_fin) return;

    const timer = setInterval(() => {
      calcularTiempoRestante(config.fecha_fin!)
    }, 1000)

    return () => clearInterval(timer)
  }, [config.fecha_fin])

  const calcularTiempoRestante = (fechaFinString: string) => {
      const fin = new Date(fechaFinString).getTime()
      const ahora = new Date().getTime()
      const diff = fin - ahora

      if (diff > 0) {
        setTiempo({
          horas: Math.floor(diff / (1000 * 60 * 60)),
          minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((diff % (1000 * 60)) / 1000)
        })
      } else {
        setTiempo({ horas: 0, minutos: 0, segundos: 0 })
      }
  }

  // 👇 NUEVA FUNCIÓN: Convierte la fecha fea a "Lunes 12 de Octubre..."
  const obtenerFechaLegible = () => {
    if (!config.fecha_fin) return null;
    const date = new Date(config.fecha_fin);
    // Formato: "Lunes, 15 de Enero"
    return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
  }

  // ... (Tus funciones de cálculo de precio se mantienen igual) ...
  const calcularDescuento = (normal: number, oferta: number) => {
    if (!normal || !oferta) return 0
    return Math.round(((normal - oferta) / normal) * 100)
  }

  const obtenerPrecioReal = (combo: Oferta) => {
    const sumaProductos = combo.oferta_productos?.reduce((acc, item) => {
      return acc + ((item.producto?.precio || 0) * item.cantidad)
    }, 0) || 0
    return sumaProductos > 0 ? sumaProductos : (combo.precio_oferta * 1.2)
  }

  const manejarAgregarCombo = (combo: Oferta) => {
    const precioRealCalculado = obtenerPrecioReal(combo)
    const productoParaCarrito: any = {
      id: `combo-${combo.id}`,
      nombre: combo.nombre,
      precio: precioRealCalculado, 
      precio_oferta: combo.precio_oferta, 
      preciooferta: combo.precio_oferta,
      ofertaactiva: true,
      imagen_url: combo.imagen_url,
      esCombo: true,
      oferta_productos: combo.oferta_productos?.map(op => ({
        nombre: op.producto?.nombre || 'Producto Desconocido',
        cantidad: op.cantidad
      }))
    }
    addToCart(productoParaCarrito)
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans">
      <Header />

      <main>
        {/* SECCIÓN BANNER Y CONTADOR (DINÁMICA) */}
        {config.activo && (
            <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden transition-all duration-500">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="text-center md:text-left space-y-4">
                    <span className="bg-yellow-400 text-red-900 font-black px-4 py-1 rounded-full text-sm uppercase tracking-wider inline-block transform -rotate-2 shadow-lg">
                    ¡Solo por tiempo limitado!
                    </span>
                    {/* TÍTULO DINÁMICO */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none text-white drop-shadow-md uppercase">
                    {config.titulo}
                    </h1>
                    {/* SUBTÍTULO DINÁMICO */}
                    <p className="text-xl text-red-100 font-medium">
                    {config.subtitulo}
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <p className="text-center text-red-100 mb-1 font-bold uppercase text-xs tracking-widest">
                        Cierra Puertas termina el:
                    </p>
                    
                    {/* 👇 AQUÍ MOSTRAMOS LA FECHA BONITA (Lunes, Martes, etc) */}
                    <p className="text-center text-white font-black text-lg md:text-xl capitalize mb-4 bg-red-900/30 py-1 px-4 rounded-lg border border-red-500/30">
                        🗓️ {obtenerFechaLegible()}
                    </p>

                    <div className="flex gap-4 text-center justify-center">
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
            
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#f3f4f6]"></path>
                </svg>
            </div>
            </section>
        )}

        {/* LISTA DE COMBOS */}
        <section className="max-w-7xl mx-auto px-4 py-12">
            {combos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {combos.map((combo) => {
                const precioNormal = obtenerPrecioReal(combo)
                const porcentajeDescuento = calcularDescuento(precioNormal, combo.precio_oferta)
                
                return (
                  <div key={combo.id} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-red-500">
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-yellow-400 text-red-800 font-black text-xs md:text-sm py-2 px-3 rounded-bl-2xl shadow-md">
                        -{porcentajeDescuento}%
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">¡COMBO!</span>
                    </div>
                    
                    <div className="relative h-48 md:h-60 p-4 bg-white flex items-center justify-center overflow-hidden">
                      {combo.imagen_url ? (
                        <img src={combo.imagen_url} alt={combo.nombre} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="text-gray-300 text-center">
                          <span className="text-4xl">📷</span>
                          <p className="text-xs mt-1">Sin imagen</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <h3 className="text-gray-800 font-semibold text-sm md:text-base line-clamp-1 mb-1 leading-tight">{combo.nombre}</h3>
                      
                      <p className="text-[10px] text-gray-500 mb-2 line-clamp-2 italic">
                        Incluye: {combo.oferta_productos?.map(op => `${op.cantidad}x ${op.producto?.nombre}`).join(', ')}
                      </p>

                      <div className="flex flex-col mb-3">
                        <span className="text-gray-400 text-xs line-through decoration-red-500 decoration-1">
                          S/ {precioNormal.toFixed(2)}
                        </span>
                        <div className="flex items-baseline gap-1 text-red-600">
                            <span className="text-sm font-bold">S/</span>
                            <span className="text-3xl font-black tracking-tighter">{combo.precio_oferta?.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button onClick={() => manejarAgregarCombo(combo)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        Agregar Combo
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-2xl font-bold text-gray-700">No hay canastas activas</h2>
              <Link to="/productos" className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700">Ver catálogo general</Link>
            </div>
          )}
        </section>

        {/* FOOTER INFORMATIVO */}
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
      </main>
      <QRCanal />
      <Footer />
    </div>
  )
}

export default Catalogos