import { useEffect, useState } from 'react'
import type { Oferta } from '../types/Oferta'
// IMPORTANTE: Traemos exactamente lo mismo que usas en tu Carrito.tsx
import { useCart } from '../hooks/useCart'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
// Iconos
import { ShoppingBag, Timer, Sparkles, Zap, ShoppingCart, Flame, Tag, Plus, Minus, Trash2 } from 'lucide-react' 
import { obtenerOfertasCombos, obtenerConfigOferta } from '../services/contenido.service'

interface OfertaExtendida extends Oferta {
  es_exclusivo_campana?: boolean;
  es_cyber?: boolean;
}

function Catalogos() {
  const [combos, setCombos] = useState<OfertaExtendida[]>([])
  
  // --- CORRECCIÓN CLAVE ---
  // Usamos la misma estructura que tu Carrito.tsx: 'items', 'increment', 'decrement'
  const { items, addToCart, increment, decrement, removeFromCart } = useCart() as any
  
  // Convertimos items a array seguro por si acaso viene null
  const cartItems = Array.isArray(items) ? items : [];

  const [config, setConfig] = useState({
    titulo: 'Cargando...',
    subtitulo: '',
    fecha_fin: null as string | null,
    activo: false 
  })

  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataCombos = await obtenerOfertasCombos()
        setCombos(dataCombos)

        const dataConfig = await obtenerConfigOferta()
        if (dataConfig) {
           setConfig(dataConfig)
           if (dataConfig.activo && dataConfig.fecha_fin) {
             calcularTiempoRestante(dataConfig.fecha_fin)
           }
        }
      } catch (error) {
        console.error("Error cargando datos", error)
      }
    }
    cargarDatos()
  }, [])

  useEffect(() => {
    if (!config.activo || !config.fecha_fin) return;
    const timer = setInterval(() => {
      calcularTiempoRestante(config.fecha_fin!)
    }, 1000)
    return () => clearInterval(timer)
  }, [config])

  const calcularTiempoRestante = (fechaFinString: string) => {
      const diff = new Date(fechaFinString).getTime() - new Date().getTime()
      if (diff > 0) {
        setTiempo({
          dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((diff % (1000 * 60)) / 1000)
        })
      } else {
        setTiempo({ dias:0, horas: 0, minutos: 0, segundos: 0 })
      }
  }

  const combosVisibles = combos.filter(combo => {
    if (config.activo) return true; 
    return !combo.es_exclusivo_campana && !combo.es_cyber; 
  });

  const obtenerPrecioReal = (combo: any) => {
    const suma = combo.oferta_productos?.reduce((acc: number, item: any) => acc + ((item.producto?.precio || item.precio_manual || 0) * item.cantidad), 0) || 0
    return suma > 0 ? suma : (combo.precio_oferta * 1.2)
  }

  // Objeto idéntico al que espera tu carrito
  const prepararItemCarrito = (combo: any) => {
    const precioReal = obtenerPrecioReal(combo)
    return {
      id: `combo-${combo.id}`,
      nombre: combo.nombre,
      precio: precioReal, 
      precio_oferta: combo.precio_oferta, 
      preciooferta: combo.precio_oferta, 
      ofertaactiva: true,
      imagen_url: combo.imagen_url || '', 
      esCombo: true,
      oferta_productos: combo.oferta_productos?.map((op: any) => ({ 
        nombre: op.producto?.nombre || op.nombre_manual || 'Producto', 
        cantidad: op.cantidad 
      }))
    }
  }

  const headerTheme = config.activo 
    ? { 
        bg: 'bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900', 
        accentBadge: 'bg-yellow-300 text-purple-900',
        textAccent: 'text-yellow-300'
      }
    : { 
        bg: 'bg-gradient-to-r from-gray-900 via-gray-800 to-black', 
        accentBadge: 'bg-white text-black',
        textAccent: 'text-white'
      };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <div className="sticky top-0 z-50 w-full bg-white shadow-md">
         <Header />
      </div>

      <main className="flex-grow flex flex-col">
        {/* BANNER (Sin cambios visuales) */}
        <section className={`relative py-6 md:py-12 shadow-2xl ${headerTheme.bg} text-white overflow-hidden shrink-0`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left flex-1">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-3 ${headerTheme.accentBadge} shadow-lg`}>
                        {config.activo ? <Zap size={14} className="fill-current"/> : <Sparkles size={14}/>}
                        {config.activo ? 'CYBER DAYS' : 'OFERTAS'}
                    </div>
                    <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] drop-shadow-xl">
                        {(!config.activo && (config.titulo === '' || config.titulo === 'Cargando...')) ? 'CATÁLOGO' : config.titulo}
                    </h1>
                    <p className="mt-2 text-xs md:text-lg font-medium text-white/80 max-w-xl leading-snug">
                         {(!config.activo && !config.subtitulo) ? 'Precios bajos siempre.' : config.subtitulo}
                    </p>
                </div>
                {config.activo && config.fecha_fin && (
                    <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-2xl transform scale-90 md:scale-100 origin-bottom">
                         <div className="flex gap-2 text-center justify-center">
                            {['D', 'H', 'M', 'S'].map((label, i) => {
                                const val = [tiempo.dias, tiempo.horas, tiempo.minutos, tiempo.segundos][i];
                                return (
                                    <div key={label} className="flex flex-col">
                                        <span className="bg-white text-purple-900 rounded w-8 h-8 flex items-center justify-center font-black">{val}</span>
                                    </div>
                                )
                            })}
                         </div>
                    </div>
                )}
            </div>
        </section>

        {/* CATALOGO */}
        <section className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-12 w-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl md:text-3xl font-black text-gray-800 flex items-center gap-2 tracking-tight">
                   {config.activo ? <Flame className="text-orange-500 fill-orange-500" size={20}/> : <Tag className="text-gray-800" size={20}/>}
                   Catálogo
                </h2>
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-md">
                    {combosVisibles.length} Packs
                </span>
            </div>

            {combosVisibles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {combosVisibles.map((combo) => {
                    const precioNormal = obtenerPrecioReal(combo)
                    const isCyber = combo.es_cyber || (config.activo && combo.es_exclusivo_campana);
                    
                    // ID EXACTO QUE SE USA EN EL CARRITO
                    const idProducto = `combo-${combo.id}`;
                    
                    // --- LÓGICA DE DETECCIÓN IGUAL AL CARRITO ---
                    // Buscamos si existe este ID en 'items'
                    const itemEnCarrito = cartItems.find((item: any) => item.id === idProducto);
                    const cantidad = itemEnCarrito ? itemEnCarrito.cantidad : 0;
                    // ---------------------------------------------

                    const cardStyle = isCyber 
                        ? "bg-slate-900 border-purple-500/50 shadow-purple-500/20 text-white" 
                        : "bg-white border-gray-100 text-gray-800";
                    
                    const priceColor = isCyber ? "text-yellow-400" : "text-gray-900";
                    const oldPriceColor = isCyber ? "text-slate-500" : "text-gray-400";
                    
                    // Lista de productos para descripción
                    const listaProductos = combo.oferta_productos && combo.oferta_productos.length > 0 
                                    ? combo.oferta_productos
                                    : null;

                    return (
                    <div key={combo.id} className={`group relative rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border overflow-hidden flex flex-col ${cardStyle}`}>
                        
                        {/* ETIQUETAS */}
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                            {isCyber ? (
                                <span className="flex w-fit items-center gap-1 bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase tracking-wider animate-pulse">
                                    <Zap size={8} className="fill-white"/> Cyber
                                </span>
                            ) : (
                                <span className="w-fit bg-blue-50 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-blue-100">
                                    Oferta
                                </span>
                            )}
                        </div>
                        
                        {/* PORCENTAJE */}
                        <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl-xl font-black text-[10px] md:text-xs z-20 shadow-sm ${isCyber ? 'bg-yellow-400 text-black' : 'bg-red-600 text-white'}`}>
                            -{precioNormal ? Math.round(((precioNormal - combo.precio_oferta) / precioNormal) * 100) : 0}%
                        </div>

                        {/* IMAGEN */}
                        <div className={`relative h-28 md:h-40 p-2 flex items-center justify-center transition-colors ${isCyber ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            {combo.imagen_url ? (
                                <img src={combo.imagen_url} alt={combo.nombre} className="w-full h-full object-contain drop-shadow-md mix-blend-multiply" style={{ mixBlendMode: isCyber ? 'normal' : 'multiply'}} />
                            ) : (
                                <div className="flex flex-col items-center justify-center opacity-30"><ShoppingBag size={24} /></div>
                            )}
                        </div>

                        {/* INFO */}
                        <div className="p-3 flex flex-col flex-grow">
                            <h3 className={`font-bold text-xs md:text-sm leading-tight mb-2 line-clamp-2 ${isCyber ? 'text-gray-100' : 'text-gray-900'}`}>
                                {combo.nombre}
                            </h3>
                            
                            {/* DESCRIPCIÓN EN LISTA (Minúscula) */}
                            <div className="flex-grow mb-3">
                                {listaProductos ? (
                                    <ul className={`space-y-0.5 ${isCyber ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {listaProductos.map((p: any, idx: number) => (
                                            <li key={idx} className="text-[10px] md:text-xs flex items-start gap-1.5 leading-tight lowercase">
                                                <span className={`font-bold ${isCyber ? 'text-slate-200' : 'text-gray-700'}`}>
                                                    {p.cantidad}x
                                                </span>
                                                <span className="flex-1">
                                                    {p.producto?.nombre || p.nombre_manual || 'producto'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={`text-[10px] md:text-xs lowercase ${isCyber ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {combo.descripcion}
                                    </p>
                                )}
                            </div>
                            
                            <div className="mt-auto pt-2 border-t border-dashed border-opacity-20 flex flex-col gap-2" style={{borderColor: isCyber ? '#ffffff30' : '#00000020'}}>
                                <div className="flex items-end justify-between">
                                    <div className={`text-[10px] font-medium line-through ${oldPriceColor}`}>S/ {precioNormal.toFixed(2)}</div>
                                    <div className={`text-lg md:text-xl font-black leading-none ${priceColor}`}>
                                        <span className="text-[10px] mr-0.5 align-top opacity-80 font-bold">S/</span>
                                        {combo.precio_oferta.toFixed(2)}
                                    </div>
                                </div>
                                
                                {/* --- ZONA DE BOTONES (LÓGICA DEL CARRITO APLICADA) --- */}
                                <div className="h-9 w-full">
                                    {itemEnCarrito ? (
                                        // SI ESTÁ EN EL CARRITO: Usamos decrement/increment igual que Carrito.tsx
                                        <div className={`flex items-center justify-between w-full h-full rounded-lg overflow-hidden border ${isCyber ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                            
                                            {/* BOTÓN MENOS (Usa decrement del hook) */}
                                            <button 
                                                onClick={() => {
                                                    // Si es 1, usamos removeFromCart (igual que Carrito visualmente elimina, 
                                                    // pero aseguramos con removeFromCart si decrement no borra al llegar a 0)
                                                    if (cantidad === 1) {
                                                       removeFromCart(idProducto);
                                                    } else {
                                                       decrement(idProducto);
                                                    }
                                                }}
                                                className={`h-full px-4 flex items-center justify-center transition-colors hover:bg-red-50 active:bg-red-100 ${isCyber ? 'text-white hover:bg-slate-700' : 'text-gray-600 border-r border-gray-200'}`}
                                            >
                                                {cantidad === 1 ? <Trash2 size={16} className="text-red-500"/> : <Minus size={16}/>}
                                            </button>
                                            
                                            {/* CANTIDAD */}
                                            <span className={`font-black text-sm ${isCyber ? 'text-white' : 'text-gray-900'}`}>
                                                {cantidad}
                                            </span>

                                            {/* BOTÓN MÁS (Usa increment del hook) */}
                                            <button 
                                                onClick={() => increment(idProducto)}
                                                className={`h-full px-4 flex items-center justify-center transition-colors hover:bg-green-50 active:bg-green-100 ${isCyber ? 'text-white hover:bg-slate-700' : 'text-gray-600 border-l border-gray-200'}`}
                                            >
                                                <Plus size={16}/>
                                            </button>
                                        </div>
                                    ) : (
                                        // SI NO ESTÁ: Botón agregar normal
                                        <button 
                                            onClick={() => addToCart(prepararItemCarrito(combo))}
                                            className={`w-full h-full rounded-lg flex items-center justify-center gap-2 font-bold text-xs transition-transform active:scale-95 shadow-sm ${
                                                isCyber 
                                                ? "bg-purple-600 hover:bg-purple-500 text-white"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                            }`}
                                        >
                                            <ShoppingCart size={16} /> AGREGAR
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4 opacity-30">📦</div>
                    <h3 className="text-xl font-bold text-gray-400">No hay ofertas disponibles.</h3>
                </div>
            )}
        </section>
      </main>
      <QRCanal />
      <Footer />
    </div>
  )
}

export default Catalogos