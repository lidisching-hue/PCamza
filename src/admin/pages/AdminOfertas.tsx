import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Toaster } from 'react-hot-toast' // Agregamos Toaster para las notificaciones
import { uploadProductImage } from '../services/productAdmin.service' 

// 👇 1. IMPORTAMOS EL COMPONENTE NUEVO (Asegúrate de haberlo creado en la carpeta components)
import AdminOfertasTitulo from '../components/AdminOfertasTitulo'

// Definimos tipos locales para esta pantalla
interface ProductoSelect {
  id: string
  nombre: string
  precio: number
  imagen_url: string
}

interface ItemSeleccionado {
  producto: ProductoSelect
  cantidad: number
}

interface OfertaData {
  id: string
  nombre: string
  descripcion: string
  precio_oferta: number
  imagen_url: string
  fecha_vencimiento: string | null
  activo: boolean
  // Para mostrar en la tabla, Supabase devolverá esto anidado:
  oferta_productos: {
    cantidad: number
    producto: { nombre: string; precio: number }
  }[]
}

export default function AdminOfertas() {
  const [ofertas, setOfertas] = useState<OfertaData[]>([])
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoSelect[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // --- ESTADOS DEL MODAL Y FORMULARIO ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Datos de la Oferta (Padre)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioOferta, setPrecioOferta] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)

  // Datos de los Productos (Hijos/Items)
  const [itemsSeleccionados, setItemsSeleccionados] = useState<ItemSeleccionado[]>([])

  // 1. CARGA DE DATOS INICIAL
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // A. Cargar Ofertas Existentes con sus productos
      const { data: ofertasData, error: errorOfertas } = await supabase
        .from('ofertas')
        .select(`
          *,
          oferta_productos (
            cantidad,
            producto:productos ( nombre, precio )
          )
        `)
        .order('created_at', { ascending: false })

      if (errorOfertas) throw errorOfertas

      // B. Cargar Productos Disponibles (para el selector)
      const { data: prodsData, error: errorProds } = await supabase
        .from('productos')
        .select('id, nombre, precio, imagen_url')
        .eq('activo', true)
        .order('nombre')

      if (errorProds) throw errorProds

      setOfertas(ofertasData as any)
      setProductosDisponibles(prodsData || [])
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  // 2. LÓGICA DEL "CARRITO" CONSTRUCTOR DE PACKS
  const agregarAlPack = (prod: ProductoSelect) => {
    setItemsSeleccionados(prev => {
      const existe = prev.find(item => item.producto.id === prod.id)
      if (existe) {
        // Si ya está, aumentamos cantidad
        return prev.map(item => 
          item.producto.id === prod.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      }
      // Si no está, lo agregamos
      return [...prev, { producto: prod, cantidad: 1 }]
    })
  }

  const quitarDelPack = (idProducto: string) => {
    setItemsSeleccionados(prev => prev.filter(item => item.producto.id !== idProducto))
  }

  const cambiarCantidad = (idProducto: string, nuevaCant: number) => {
    if (nuevaCant < 1) return
    setItemsSeleccionados(prev => prev.map(item => 
      item.producto.id === idProducto ? { ...item, cantidad: nuevaCant } : item
    ))
  }

  // Cálculos de Precio en Vivo
  const precioRealTotal = itemsSeleccionados.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0)
  const ahorro = precioRealTotal - (parseFloat(precioOferta) || 0)
  const porcentajeAhorro = precioRealTotal > 0 ? Math.round((ahorro / precioRealTotal) * 100) : 0

  // 3. GUARDAR OFERTA EN BASE DE DATOS
  const handleGuardar = async () => {
    if (!nombre || !precioOferta || itemsSeleccionados.length === 0) {
      alert("Faltan datos: Nombre, Precio o Productos.")
      return
    }

    setSaving(true)
    try {
      // A. Subir imagen si existe
      let finalImageUrl = null
      if (imagenFile) {
        finalImageUrl = await uploadProductImage(imagenFile)
      }

      // B. Crear SLUG (URL amigable)
      const slug = nombre.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4)

      // C. Insertar la OFERTA (Padre)
      const { data: ofertaCreada, error: errorOferta } = await supabase
        .from('ofertas')
        .insert({
          nombre,
          slug,
          descripcion,
          precio_oferta: parseFloat(precioOferta),
          imagen_url: finalImageUrl,
          fecha_vencimiento: fechaVencimiento || null,
          activo: true
        })
        .select()
        .single()

      if (errorOferta) throw errorOferta

      // D. Insertar los PRODUCTOS (Hijos)
      const itemsParaInsertar = itemsSeleccionados.map(item => ({
        oferta_id: ofertaCreada.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad
      }))

      const { error: errorItems } = await supabase
        .from('oferta_productos')
        .insert(itemsParaInsertar)

      if (errorItems) {
        // Si fallan los items, borramos la oferta para no dejar basura
        await supabase.from('ofertas').delete().eq('id', ofertaCreada.id)
        throw errorItems
      }

      // Éxito
      alert("¡Combo creado exitosamente!")
      resetForm()
      cargarDatos()

    } catch (error: any) {
      console.error(error)
      alert("Error al guardar: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de borrar este combo?")) return
    
    // Al borrar el padre, el SQL (ON DELETE CASCADE) borrará los hijos automáticamente
    const { error } = await supabase.from('ofertas').delete().eq('id', id)
    
    if (error) alert("Error al borrar")
    else cargarDatos()
  }

  const resetForm = () => {
    setIsModalOpen(false)
    setNombre(''); setDescripcion(''); setPrecioOferta(''); setFechaVencimiento('')
    setItemsSeleccionados([])
    setImagenFile(null); setImagenPreview(null)
  }

  // --- RENDERIZADO ---
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Notificaciones */}
      <Toaster position="top-right" />

      {/* ==============================================
          SECCIÓN 1: CONFIGURACIÓN DEL BANNER PRINCIPAL
          ============================================== */}
      <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          </h2>
          <AdminOfertasTitulo />
      </section>

      <hr className="border-gray-300" />

      {/* ==============================================
          SECCIÓN 2: GESTIÓN DE PACKS Y COMBOS
          ============================================== */}
      <section>
          <div className="flex justify-between items-center mb-6">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Gestión de Packs & Ofertas</h1>
               <p className="text-gray-500">Crea combos irresistibles sumando tus productos.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
            >
              <span>+</span> Crear Nuevo Combo
            </button>
          </div>

          {/* LISTADO DE OFERTAS EXISTENTES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <p>Cargando ofertas...</p> : ofertas.map(oferta => {
               // Calcular precio real de esta oferta para mostrar info
               const real = oferta.oferta_productos.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0)
               
               return (
                 <div key={oferta.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
                   <div className="h-40 bg-gray-100 relative">
                     {oferta.imagen_url ? (
                       <img src={oferta.imagen_url} className="w-full h-full object-cover" />
                     ) : (
                       <div className="flex items-center justify-center h-full text-gray-400 font-bold">SIN IMAGEN</div>
                     )}
                     <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                        S/ {oferta.precio_oferta}
                     </div>
                   </div>
                   <div className="p-4">
                     <h3 className="font-bold text-lg leading-tight mb-1">{oferta.nombre}</h3>
                     <p className="text-xs text-gray-500 mb-3 line-clamp-2">{oferta.descripcion}</p>
                     
                     <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 space-y-1 mb-3">
                        {oferta.oferta_productos.map((op, idx) => (
                          <div key={idx} className="flex justify-between">
                              <span>{op.producto.nombre}</span>
                              <span className="font-bold">x{op.cantidad}</span>
                          </div>
                        ))}
                     </div>
                     
                     <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-xs text-gray-400 line-through">Real: S/ {real}</span>
                        <button onClick={() => handleDelete(oferta.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                          Eliminar
                        </button>
                     </div>
                   </div>
                 </div>
               )
            })}
          </div>
      </section>

      {/* MODAL CREADOR DE PACKS (Sin Cambios) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden">
              
              {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DEL PACK */}
              <div className="w-1/3 bg-gray-50 border-r p-6 flex flex-col overflow-y-auto">
                 <h2 className="text-xl font-black text-gray-800 mb-4">1. Configura el Pack</h2>
                 
                 <div className="space-y-4 flex-1">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE DEL COMBO</label>
                     <input 
                       className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                       placeholder="Ej. Pack Gamer Supremo"
                       value={nombre} onChange={e => setNombre(e.target.value)}
                     />
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIPCIÓN</label>
                     <textarea 
                       className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black outline-none resize-none h-20" 
                       placeholder="Describe lo increíble que es..."
                       value={descripcion} onChange={e => setDescripcion(e.target.value)}
                     />
                   </div>

                   <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                       <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold text-gray-400">PRECIO REAL (SUMA)</span>
                          <span className="font-bold text-gray-600 line-through">S/ {precioRealTotal}</span>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-red-600 mb-1">PRECIO DE OFERTA (TU PRECIO)</label>
                          <input 
                            type="number"
                            className="w-full p-2 border-2 border-red-100 bg-red-50 rounded-lg text-red-600 font-black text-xl focus:outline-none focus:border-red-500" 
                            placeholder="0.00"
                            value={precioOferta} onChange={e => setPrecioOferta(e.target.value)}
                          />
                       </div>
                       {porcentajeAhorro > 0 && (
                         <div className="mt-2 text-center text-xs font-bold text-green-600 bg-green-100 py-1 rounded">
                           ¡Ahorro del {porcentajeAhorro}%! 🔥
                         </div>
                       )}
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">FECHA DE VENCIMIENTO (Opcional)</label>
                     <input 
                       type="date"
                       className="w-full p-2 border rounded-lg text-sm"
                       value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)}
                     />
                   </div>

                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">IMAGEN DEL PACK</label>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border">
                             {imagenPreview && <img src={imagenPreview} className="w-full h-full object-cover" />}
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="text-xs w-full"
                            onChange={e => {
                               const file = e.target.files?.[0]
                               if(file){
                                 setImagenFile(file)
                                 setImagenPreview(URL.createObjectURL(file))
                               }
                            }}
                          />
                       </div>
                   </div>

                   {/* LISTA DE ITEMS SELECCIONADOS */}
                   <div className="mt-4 border-t pt-4">
                       <h3 className="text-xs font-black text-gray-800 mb-2">CONTENIDO DEL PACK ({itemsSeleccionados.length})</h3>
                       {itemsSeleccionados.length === 0 && <p className="text-xs text-gray-400 italic">Selecciona productos de la derecha 👉</p>}
                       <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {itemsSeleccionados.map((item) => (
                             <div key={item.producto.id} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm text-sm">
                                <div className="flex-1 truncate pr-2">
                                   <p className="font-bold truncate text-xs">{item.producto.nombre}</p>
                                   <p className="text-[10px] text-gray-400">S/ {item.producto.precio} c/u</p>
                                </div>
                                <div className="flex items-center gap-2">
                                   <input 
                                     type="number" 
                                     min="1"
                                     className="w-10 p-1 border rounded text-center text-xs font-bold"
                                     value={item.cantidad}
                                     onChange={(e) => cambiarCantidad(item.producto.id, parseInt(e.target.value))}
                                   />
                                   <button onClick={() => quitarDelPack(item.producto.id)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                                </div>
                             </div>
                          ))}
                       </div>
                   </div>
                 </div>

                 <div className="mt-6 flex gap-2">
                    <button onClick={resetForm} className="flex-1 py-3 bg-white border text-gray-600 rounded-xl font-bold hover:bg-gray-50">Cancelar</button>
                    <button 
                      onClick={handleGuardar} 
                      disabled={saving}
                      className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : 'Crear Pack'}
                    </button>
                 </div>
              </div>

              {/* COLUMNA DERECHA: SELECTOR DE PRODUCTOS */}
              <div className="w-2/3 p-6 bg-white overflow-y-auto">
                 <h2 className="text-xl font-black text-gray-800 mb-4">2. Agrega Productos</h2>
                 <p className="text-sm text-gray-500 mb-4">Haz clic en los productos para agregarlos al combo.</p>
                 
                 <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                    {productosDisponibles.map(prod => {
                       const estaEnPack = itemsSeleccionados.find(i => i.producto.id === prod.id)
                       
                       return (
                         <div 
                           key={prod.id} 
                           onClick={() => agregarAlPack(prod)}
                           className={`cursor-pointer border rounded-xl p-3 transition relative group ${estaEnPack ? 'border-black ring-1 ring-black bg-gray-50' : 'hover:border-gray-400 hover:shadow-lg'}`}
                         >
                            <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                               {prod.imagen_url ? (
                                 <img src={prod.imagen_url} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">SIN FOTO</div>
                               )}
                            </div>
                            <p className="font-bold text-xs truncate mb-1">{prod.nombre}</p>
                            <p className="text-gray-500 text-xs">S/ {prod.precio}</p>

                            {estaEnPack && (
                               <div className="absolute top-2 right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md animate-bounce-short">
                                  {estaEnPack.cantidad}
                               </div>
                            )}
                         </div>
                       )
                    })}
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  )
}