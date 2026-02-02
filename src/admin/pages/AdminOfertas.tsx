import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Toaster, toast } from 'react-hot-toast'
import { uploadProductImage } from '../services/productAdmin.service' 
import { Trash2, Plus, X, Search, Edit3, Save, Zap, Tag, Eye, EyeOff, Package, ListPlus } from 'lucide-react'
import AdminOfertasTitulo from '../components/AdminOfertasTitulo'
import { obtenerConfigOferta } from '../../services/contenido.service'

// --- Interfaces ---
interface ItemBuilder {
  tempId: string;
  tipo: 'DB' | 'MANUAL';
  productoId?: string;
  nombre: string;
  precioBase: number;
  cantidad: number;
  imagen?: string;
}

interface OfertaData {
  id: string; 
  nombre: string; 
  descripcion: string; 
  precio_oferta: number; 
  precio_real: number; 
  imagen_url: string; 
  es_cyber: boolean;
  oferta_productos: any[];
}

export default function AdminOfertas() {
  // --- ESTADOS ---
  const [ofertas, setOfertas] = useState<OfertaData[]>([])
  const [productosDisponibles, setProductosDisponibles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [eventoEncendido, setEventoEncendido] = useState(false)

  // Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingOffer, setSavingOffer] = useState(false)

  // Campos Formulario Pack
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('') 
  const [esCyber, setEsCyber] = useState(false)
  const [precioReal, setPrecioReal] = useState('') 
  const [precioOferta, setPrecioOferta] = useState('') 
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [itemsSeleccionados, setItemsSeleccionados] = useState<ItemBuilder[]>([])
  
  // Buscador y Manual
  const [searchTerm, setSearchTerm] = useState('')
  const [manualNombre, setManualNombre] = useState('')
  const [manualPrecio, setManualPrecio] = useState('')

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
        const config = await obtenerConfigOferta()
        setEventoEncendido(config?.activo || false)
    } catch (e) { console.error(e) }

    const { data } = await supabase.from('ofertas')
      .select(`*, oferta_productos (cantidad, nombre_manual, precio_manual, producto:productos (id, nombre, precio, imagen_url))`)
      .order('created_at', { ascending: false })
    
    const { data: prods } = await supabase.from('productos').select('id, nombre, precio, imagen_url').eq('activo', true)

    setOfertas(data as any || [])
    setProductosDisponibles(prods || [])
    setLoading(false)
  }

  // --- LÓGICA DE PRECIOS AUTOMÁTICA ---
  useEffect(() => {
    if (itemsSeleccionados.length === 0) return;
    const total = itemsSeleccionados.reduce((acc, item) => acc + (item.precioBase * item.cantidad), 0).toFixed(2);
    setPrecioReal(total)
    setPrecioOferta(total)
    const desc = itemsSeleccionados.map(i => `${i.cantidad}x ${i.nombre}`).join(' + ')
    setDescripcion(desc)
  }, [itemsSeleccionados])

  // --- GUARDAR PACK ---
  const handleGuardarPack = async () => {
    if (!nombre || !precioOferta) return toast.error("Faltan datos")
    setSavingOffer(true)
    
    try {
        let url = imagenPreview
        if (imagenFile) url = await uploadProductImage(imagenFile)
        
        const slug = nombre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4)

        const packData = {
            nombre,
            slug: editingId ? undefined : slug,
            descripcion,
            precio_real: parseFloat(precioReal),
            precio_oferta: parseFloat(precioOferta),
            imagen_url: url,
            es_cyber: esCyber,
            activo: true
        }

        let id = editingId
        if (id) {
            await supabase.from('ofertas').update(packData).eq('id', id)
            await supabase.from('oferta_productos').delete().eq('oferta_id', id)
        } else {
            const { data } = await supabase.from('ofertas').insert(packData).select().single()
            id = data.id
        }

        const itemsDB = itemsSeleccionados.map(i => ({
            oferta_id: id,
            producto_id: i.tipo === 'DB' ? i.productoId : null,
            nombre_manual: i.tipo === 'MANUAL' ? i.nombre : null,
            precio_manual: i.tipo === 'MANUAL' ? i.precioBase : 0,
            cantidad: i.cantidad
        }))
        await supabase.from('oferta_productos').insert(itemsDB)

        toast.success(editingId ? "Actualizado" : "Creado")
        setIsModalOpen(false)
        resetForm()
        cargarDatos()
    } catch (e) {
        toast.error("Error al guardar")
    } finally {
        setSavingOffer(false)
    }
  }

  const handleDelete = async (idToDelete?: string) => {
      const id = idToDelete || editingId
      if(!id || !confirm("¿Estás seguro de ELIMINAR este pack?")) return
      await supabase.from('ofertas').delete().eq('id', id)
      if(isModalOpen) setIsModalOpen(false)
      resetForm()
      cargarDatos()
      toast.success("Pack eliminado correctamente")
  }

  // --- UTILS ---
  const agregarProducto = (p: any) => setItemsSeleccionados(prev => [...prev, { tempId: p.id, tipo: 'DB', productoId: p.id, nombre: p.nombre, precioBase: p.precio, cantidad: 1, imagen: p.imagen_url }])
  
  const agregarManual = () => {
      if(!manualNombre) return toast.error("Escribe un nombre")
      setItemsSeleccionados(prev => [...prev, {
          tempId: `manual-${Date.now()}`, tipo: 'MANUAL', nombre: manualNombre, precioBase: parseFloat(manualPrecio) || 0, cantidad: 1
      }])
      setManualNombre(''); setManualPrecio('')
  }

  const updateCantidad = (id: string, d: number) => setItemsSeleccionados(prev => prev.map(i => i.tempId === id ? {...i, cantidad: Math.max(1, i.cantidad + d)} : i))
  const resetForm = () => { setEditingId(null); setNombre(''); setDescripcion(''); setPrecioReal(''); setPrecioOferta(''); setEsCyber(false); setItemsSeleccionados([]); setImagenFile(null); setImagenPreview(null); setManualNombre(''); setManualPrecio('') }
  
  const handleEdit = (o: OfertaData) => {
      setEditingId(o.id); setNombre(o.nombre); setDescripcion(o.descripcion); setEsCyber(o.es_cyber);
      setPrecioReal(o.precio_real.toString()); setPrecioOferta(o.precio_oferta.toString()); setImagenPreview(o.imagen_url);
      setItemsSeleccionados(o.oferta_productos.map((op:any, i) => ({
          tempId: op.producto?.id || `m-${i}`, tipo: op.producto ? 'DB' : 'MANUAL', productoId: op.producto?.id,
          nombre: op.producto?.nombre || op.nombre_manual, precioBase: op.producto?.precio || op.precio_manual,
          cantidad: op.cantidad, imagen: op.producto?.imagen_url
      })))
      setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-24">
      <Toaster position="top-right"/>
      <AdminOfertasTitulo />

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-t pt-6">
        <div>
            <h2 className="text-2xl font-black text-gray-800">Mis Packs</h2>
            <p className="text-gray-500 text-sm">Gestiona tus combos y promociones.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true) }} className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center justify-center hover:bg-gray-800 shadow-lg transition-transform active:scale-95">
            <Plus size={20}/> <span className="hidden md:inline">Crear Nuevo Pack</span><span className="md:hidden">Nuevo</span>
        </button>
      </div>

      {/* GRID DE PACKS (MODIFICADO: grid-cols-4 en XL y altura fija de imagen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? <p className="col-span-full text-center py-10 text-gray-400">Cargando packs...</p> : ofertas.map(oferta => {
            const isVisibleNow = !oferta.es_cyber || (oferta.es_cyber && eventoEncendido);
            
            // Texto productos
            const textoProductos = oferta.oferta_productos && oferta.oferta_productos.length > 0 
                ? oferta.oferta_productos.map((op: any) => `${op.cantidad}x ${op.producto?.nombre || op.nombre_manual}`).join(', ')
                : 'Sin productos asignados';

            return (
               <div key={oferta.id} className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${!isVisibleNow ? 'bg-gray-50 border-dashed opacity-80' : 'bg-white border-gray-100 hover:shadow-xl'}`}>
                   
                   {/* IMAGEN DEL PACK (MODIFICADO: h-32 en vez de aspect-video para hacerla más pequeña) */}
                   <div className={`w-full h-32 bg-gray-100 relative ${!isVisibleNow ? 'grayscale' : ''}`}>
                       {oferta.imagen_url ? (
                           <img src={oferta.imagen_url} className="w-full h-full object-cover"/>
                       ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={30}/></div>
                       )}
                       
                       <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shadow-sm backdrop-blur-md ${oferta.es_cyber ? 'bg-purple-600/90 text-white' : 'bg-blue-100/90 text-blue-800'}`}>
                                {oferta.es_cyber ? '⚡ EVENTO' : '🔵 NORMAL'}
                            </span>
                            {!isVisibleNow && (
                                <span className="bg-red-100/90 text-red-600 px-2 py-0.5 rounded text-[9px] font-bold border border-red-200 flex items-center gap-1 backdrop-blur-md">
                                    <EyeOff size={10}/> OCULTO
                                </span>
                            )}
                       </div>
                   </div>

                   {/* CONTENIDO */}
                   <div className="p-3 flex-1 flex flex-col gap-2">
                       <div className="flex justify-between items-start gap-2">
                           <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{oferta.nombre}</h3>
                           {/* PRECIOS FORMATO SOLES (MODIFICADO) */}
                           <div className="text-right shrink-0">
                               <div className="text-sm font-black text-gray-800">S/ {Number(oferta.precio_oferta).toFixed(2)}</div>
                               <div className="text-[10px] text-gray-400 line-through">S/ {Number(oferta.precio_real).toFixed(2)}</div>
                           </div>
                       </div>

                       {/* DESCRIPCIÓN SIMPLE */}
                       <div className="bg-gray-50 rounded p-2 text-[10px] border border-gray-100 flex-1">
                           <p className="text-gray-500 font-medium line-clamp-3 leading-relaxed">
                               <span className="text-gray-400 font-bold uppercase mr-1">Incluye:</span>
                               {textoProductos}
                           </p>
                       </div>

                       {/* BOTONES ACCIÓN */}
                       <div className="flex gap-2 mt-auto pt-1">
                           <button onClick={() => handleEdit(oferta)} className="flex-1 bg-black text-white py-1.5 rounded text-[10px] font-bold flex justify-center items-center gap-1 hover:bg-gray-800 transition active:scale-95">
                                <Edit3 size={12} /> EDITAR
                           </button>
                           <button onClick={() => handleDelete(oferta.id)} className="w-8 bg-red-50 text-red-500 rounded flex justify-center items-center hover:bg-red-100 transition border border-red-100 active:scale-95">
                                <Trash2 size={14} />
                           </button>
                       </div>
                   </div>
               </div>
            )
        })}
      </div>

      {/* --- MODAL RESPONSIVE (Mismo código, solo oculto por brevedad, no se modificó) --- */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 animate-in fade-in">
              <div className="bg-[#f8f9fa] w-full max-w-6xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                  
                  {/* --- IZQUIERDA --- */}
                  <div className="w-full lg:w-1/3 bg-white border-b lg:border-b-0 lg:border-r flex flex-col z-10 shadow-lg order-2 lg:order-1 h-[50%] lg:h-full">
                      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-20">
                          <h3 className="font-black text-lg sm:text-xl truncate">{editingId ? 'Editar' : 'Crear'} Pack</h3>
                          <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X size={20}/></button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                              <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Tipo</label>
                              <div className="flex gap-2">
                                  <button onClick={() => setEsCyber(false)} className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-2 ${!esCyber ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>
                                      <Tag size={14}/> Normal
                                  </button>
                                  <button onClick={() => setEsCyber(true)} className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-2 ${esCyber ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-400 border-gray-200'}`}>
                                      <Zap size={14}/> Evento
                                  </button>
                              </div>
                          </div>
                          <div className="flex gap-3">
                               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden border border-dashed border-gray-300 relative group aspect-square">
                                   {imagenPreview ? <img src={imagenPreview} className="w-full h-full object-cover"/> : <div className="flex h-full items-center justify-center text-xl">📷</div>}
                                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {const f=e.target.files?.[0]; if(f){setImagenFile(f); setImagenPreview(URL.createObjectURL(f))}}}/>
                               </div>
                               <div className="flex-1 min-w-0">
                                   <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre</label>
                                   <input className="w-full py-2 bg-transparent border-b font-bold outline-none focus:border-black text-sm sm:text-base" placeholder="Ej. Combo" value={nombre} onChange={e => setNombre(e.target.value)} />
                               </div>
                          </div>
                          <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                               <div className="flex-1">
                                   <label className="text-[10px] font-bold text-gray-400 uppercase">Real</label>
                                   <input type="number" className="w-full bg-transparent border-b py-1 font-bold text-gray-500 outline-none text-sm" value={precioReal} onChange={e => setPrecioReal(e.target.value)} placeholder="0.00"/>
                               </div>
                               <div className="flex-1">
                                   <label className="text-[10px] font-bold text-red-500 uppercase">Oferta</label>
                                   <input type="number" className="w-full bg-transparent border-b-2 border-red-200 py-1 font-black text-lg text-red-600 outline-none" value={precioOferta} onChange={e => setPrecioOferta(e.target.value)} placeholder="0.00"/>
                               </div>
                          </div>
                      </div>
                      <div className="p-4 border-t flex gap-3 bg-white pb-safe">
                          <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 text-xs sm:text-sm">Cancelar</button>
                          <button onClick={handleGuardarPack} disabled={savingOffer} className="flex-[2] py-3 bg-black text-white rounded-xl font-bold shadow-xl hover:bg-gray-800 text-xs sm:text-sm">
                              {savingOffer ? '...' : (editingId ? 'Guardar' : 'Crear')}
                          </button>
                      </div>
                  </div>

                  {/* --- DERECHA --- */}
                  <div className="flex-1 bg-gray-50 p-4 flex flex-col relative order-1 lg:order-2 h-[50%] lg:h-full border-b lg:border-none">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 mb-4 shadow-sm">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><ListPlus size={12}/> Agregar Producto Manual</h4>
                            <div className="flex gap-2">
                                <input className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-xs outline-none border focus:border-black" placeholder="Nombre" value={manualNombre} onChange={(e) => setManualNombre(e.target.value)}/>
                                <input type="number" className="w-20 bg-gray-50 px-3 py-2 rounded-lg text-xs outline-none border focus:border-black" placeholder="Precio" value={manualPrecio} onChange={(e) => setManualPrecio(e.target.value)}/>
                                <button onClick={agregarManual} className="bg-black text-white px-3 rounded-lg text-xs font-bold hover:bg-gray-800"><Plus size={16}/></button>
                            </div>
                        </div>
                        <div className="mb-2 relative shrink-0">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input className="w-full pl-9 p-2.5 rounded-xl shadow-sm outline-none border focus:border-black transition text-sm" placeholder="Buscar productos BD..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
                            {itemsSeleccionados.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 sticky top-0 bg-gray-50 py-1 z-10">En el Pack ({itemsSeleccionados.length})</h4>
                                    <div className="space-y-2">
                                        {itemsSeleccionados.map(item => (
                                            <div key={item.tempId} className="bg-white p-2 rounded-lg flex justify-between items-center shadow-sm border border-gray-100">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 bg-gray-100 rounded shrink-0 overflow-hidden flex items-center justify-center">
                                                        {item.imagen ? <img src={item.imagen} className="w-full h-full object-cover"/> : <span className="text-[10px]">📦</span>}
                                                    </div>
                                                    <div className="min-w-0"><p className="font-bold text-xs truncate">{item.nombre}</p>{item.tipo === 'MANUAL' && <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1 rounded">Manual</span>}</div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button onClick={() => updateCantidad(item.tempId, -1)} className="w-6 h-6 bg-gray-100 rounded font-bold text-xs">-</button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                                                    <button onClick={() => updateCantidad(item.tempId, 1)} className="w-6 h-6 bg-gray-100 rounded font-bold text-xs">+</button>
                                                    <button onClick={() => setItemsSeleccionados(p => p.filter(x => x.tempId !== item.tempId))} className="text-red-400 ml-1"><Trash2 size={14}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                             <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 sticky top-0 bg-gray-50 py-1 z-10">Catálogo</h4>
                             <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {productosDisponibles.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                    <div key={p.id} onClick={() => agregarProducto(p)} className="bg-white p-2 rounded-lg border cursor-pointer hover:border-black transition active:scale-95 shadow-sm">
                                        <div className="aspect-square bg-gray-100 rounded mb-1 overflow-hidden relative">
                                            {p.imagen_url && <img src={p.imagen_url} className="w-full h-full object-cover"/>}
                                            <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 py-0.5 font-bold rounded-tl-md">S/{p.precio}</div>
                                        </div>
                                        <p className="text-[9px] sm:text-[10px] font-bold truncate leading-tight">{p.nombre}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}