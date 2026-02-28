import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Producto } from '../../types/Producto'
import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '../services/productAdmin.service'

export default function AdminProductos() {
  // --- ESTADO DE DATOS ---
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  
  // --- ESTADO DE LOS FILTROS (LA BARRA PROFESIONAL) ---
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('TODAS')
  const [filterStatus, setFilterStatus] = useState('TODOS') // TODOS, ACTIVOS, INACTIVOS, OFERTAS

  // --- ESTADO PARA CATEGORÍAS DINÁMICAS (Para el selector) ---
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  
  // --- ESTADOS DEL MODAL Y FORMULARIO (EDICIÓN/CREACIÓN) ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', marca: '', categoria: '', presentacion: '',
    precio: '', preciooferta: '', ofertaactiva: false, activo: true,
    // --- NUEVO: CAMPOS PARA LA CAJA ---
    tiene_caja: false, precio_caja: '', unidades_por_caja: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Helper: Moneda
  const formatoMoneda = (monto: number | string) => {
    const numero = Number(monto)
    return isNaN(numero) ? '0.00' : numero.toFixed(2)
  }

  // 1. CARGA INICIAL
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    if (data) {
      setProductos(data)
      // Extraer categorías únicas para llenar el selector automáticamente
      const uniqueCats = Array.from(new Set(data.map(p => p.categoria).filter(c => c && c.trim() !== ''))).sort()
      setAvailableCategories(uniqueCats)
    }
    setLoading(false)
  }

  // 2. LÓGICA DE FILTRADO INTELIGENTE
  const filteredProducts = productos.filter(p => {
    // A. Filtro de Texto (Nombre o Marca)
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()));

    // B. Filtro de Categoría
    const matchesCategory = filterCategory === 'TODAS' || p.categoria === filterCategory;

    // C. Filtro de Estado
    let matchesStatus = true;
    if (filterStatus === 'ACTIVOS') matchesStatus = p.activo === true;
    if (filterStatus === 'INACTIVOS') matchesStatus = p.activo === false;
    if (filterStatus === 'OFERTAS') matchesStatus = p.ofertaactiva === true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // --- MANEJADORES DEL MODAL (CRUD) ---
  const handleOpenModal = (producto?: Producto) => {
    setIsCreatingCategory(false)
    if (producto) {
      setEditingProduct(producto)
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        marca: producto.marca || '',
        categoria: producto.categoria || '',
        presentacion: producto.presentacion || '',
        precio: producto.precio.toString(),
        preciooferta: producto.preciooferta?.toString() || '',
        ofertaactiva: producto.ofertaactiva || false,
        activo: producto.activo,
        // --- NUEVO: CARGAR DATOS DE CAJA SI LOS TIENE ---
        tiene_caja: !!producto.precio_caja, // si tiene precio de caja, activamos el switch
        precio_caja: producto.precio_caja?.toString() || '',
        unidades_por_caja: producto.unidades_por_caja?.toString() || ''
      })
      setImagePreview(producto.imagen_url || null)
    } else {
      setEditingProduct(null)
      setFormData({ 
        nombre: '', descripcion: '', marca: '', categoria: '', presentacion: '', 
        precio: '', preciooferta: '', ofertaactiva: false, activo: true,
        // --- NUEVO ---
        tiene_caja: false, precio_caja: '', unidades_por_caja: ''
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = editingProduct?.imagen_url || null
      if (imageFile) imageUrl = await uploadProductImage(imageFile)

      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        marca: formData.marca,
        categoria: formData.categoria, 
        presentacion: formData.presentacion,
        precio: parseFloat(formData.precio),
        preciooferta: formData.preciooferta ? parseFloat(formData.preciooferta) : null,
        ofertaactiva: formData.ofertaactiva,
        activo: formData.activo,
        imagen_url: imageUrl,
        // --- NUEVO: GUARDAR O ANULAR PRECIOS DE CAJA ---
        precio_caja: formData.tiene_caja && formData.precio_caja ? parseFloat(formData.precio_caja) : null,
        unidades_por_caja: formData.tiene_caja && formData.unidades_por_caja ? parseInt(formData.unidades_por_caja) : null,
      }

      if (editingProduct) await updateProduct(editingProduct.id, productData)
      else await createProduct(productData) // @ts-ignore

      await fetchProductos()
      setIsModalOpen(false)
    } catch (error) { console.error(error); alert('Error al guardar') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return
    await deleteProduct(id)
    fetchProductos()
  }

  // --- RENDERIZADO ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventario</h1>
          <p className="text-slate-500 mt-1">Gestión centralizada de productos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Nuevo Producto
        </button>
      </div>

      {/* ================================================================= */}
      {/* IDEA 3: BARRA DE HERRAMIENTAS DE FILTRADO (PROFESIONAL)           */}
      {/* ================================================================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 sticky top-2 z-10">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* 1. BUSCADOR (Flexible, ocupa el espacio restante) */}
          <div className="flex-1 relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                🔍
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nombre o marca..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 2. SELECTOR DE CATEGORÍA */}
          <div className="w-full md:w-56">
            <div className="relative">
                <select 
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="TODAS">📁 Todas las Categorías</option>
                    <option disabled className="bg-gray-100">----------------</option>
                    {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>

          {/* 3. SELECTOR DE ESTADO */}
          <div className="w-full md:w-48">
            <div className="relative">
                <select 
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="TODOS">⚡ Todos los Estados</option>
                    <option value="ACTIVOS">✅ Visibles</option>
                    <option value="INACTIVOS">🔒 Ocultos</option>
                    <option value="OFERTAS">🔥 En Oferta</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Resumen de Filtros (Barra inferior pequeña) */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">
                Mostrando <b>{filteredProducts.length}</b> resultados
            </span>
            
            {/* Botón de limpiar filtros solo aparece si hay filtros activos */}
            {(searchTerm || filterCategory !== 'TODAS' || filterStatus !== 'TODOS') && (
                <button 
                    onClick={() => { setSearchTerm(''); setFilterCategory('TODAS'); setFilterStatus('TODOS'); }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1"
                >
                    ✕ Limpiar filtros
                </button>
            )}
        </div>
      </div>


      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-4 pl-6">Producto</th>
                <th className="p-4">Categoría / Marca</th>
                <th className="p-4">Precio (S/)</th>
                <th className="p-4">Estado</th>
                <th className="p-4 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">Cargando inventario...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">🔍</span>
                            <p className="text-gray-800 font-medium">No se encontraron productos</p>
                            <p className="text-gray-500 text-sm">Prueba ajustando los filtros de búsqueda</p>
                        </div>
                    </td>
                </tr>
              ) : filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition group">
                  
                  {/* Columna: Producto */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                        {prod.imagen_url ? (
                            <img src={prod.imagen_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{prod.nombre}</p>
                        <p className="text-xs text-gray-500">{prod.presentacion || 'Unidad'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Columna: Categoría */}
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {prod.categoria || 'Sin Categoría'}
                        </span>
                        <span className="text-xs text-gray-400 pl-1">{prod.marca}</span>
                    </div>
                  </td>

                  {/* Columna: Precio */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={prod.ofertaactiva ? "text-xs line-through text-gray-400" : "font-bold text-gray-900 text-sm"}>
                        S/ {formatoMoneda(prod.precio)}
                      </span>
                      {prod.ofertaactiva && (
                        <span className="font-bold text-red-600 text-sm animate-pulse-slow">
                           S/ {formatoMoneda(prod.preciooferta || 0)}
                        </span>
                      )}
                      {/* Mostrar si tiene caja en la tabla sin dañar estilos */}
                      {prod.precio_caja && (
                        <span className="text-[10px] text-blue-600 font-bold mt-1">📦 x{prod.unidades_por_caja}: S/{formatoMoneda(prod.precio_caja)}</span>
                      )}
                    </div>
                  </td>

                  {/* Columna: Estado */}
                  <td className="p-4">
                    <div className="flex gap-2">
                        {prod.activo ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                Visible
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                Oculto
                            </span>
                        )}
                        {prod.ofertaactiva && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                                Oferta
                            </span>
                        )}
                    </div>
                  </td>

                  {/* Columna: Acciones */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleOpenModal(prod)} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={() => handleDelete(prod.id)} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                        >
                            🗑️
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL (SE MANTIENE IGUAL DE FUNCIONAL QUE ANTES) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 text-xl transition">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* SECCIÓN IMAGEN */}
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative group hover:border-blue-400 transition-colors cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400 text-sm">
                        <span className="text-2xl block mb-1">📷</span>
                        Subir Foto
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* GRID DE CAMPOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Nombre</label>
                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition" 
                        value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej. Leche Gloria Azul" />
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Descripción</label>
                    <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-slate-800 outline-none resize-none" rows={2}
                        value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} placeholder="Detalles del producto..." />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Marca</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-slate-800 outline-none" 
                        value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Categoría</label>
                    {isCreatingCategory ? (
                         <div className="flex gap-2">
                            <input type="text" autoFocus className="w-full border-2 border-blue-400 rounded-lg px-3 py-2.5 outline-none" placeholder="Nueva categoría..."
                                value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} />
                            <button type="button" onClick={() => { setIsCreatingCategory(false); setFormData({...formData, categoria: ''}) }} className="text-red-500 font-bold px-3 hover:bg-red-50 rounded-lg">✕</button>
                         </div>
                    ) : (
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-slate-800 outline-none bg-white"
                            value={formData.categoria} onChange={e => e.target.value === 'NEW_CAT' ? (setIsCreatingCategory(true), setFormData({...formData, categoria: ''})) : setFormData({...formData, categoria: e.target.value})}>
                            <option value="">Seleccionar...</option>
                            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            <option value="NEW_CAT" className="text-blue-600 font-bold bg-blue-50">+ Crear Nueva</option>
                        </select>
                    )}
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Presentación</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-slate-800 outline-none" 
                        value={formData.presentacion} onChange={e => setFormData({...formData, presentacion: e.target.value})} placeholder="Ej. 1L, 500g" />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Precio (S/)</label>
                    <input type="number" step="0.01" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-slate-800 outline-none font-bold" 
                        value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} placeholder="0.00" />
                </div>

                {/* SECCIÓN CAJA / PAQUETE (NUEVO, OCULTO SI NO ESTÁ ACTIVO) */}
                <div className={`md:col-span-2 p-4 rounded-xl border transition-all duration-300 ${formData.tiene_caja ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <label className="flex items-center gap-2 cursor-pointer select-none mb-1">
                        <input type="checkbox" checked={formData.tiene_caja} onChange={e => setFormData({...formData, tiene_caja: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                        <span className={`font-bold ${formData.tiene_caja ? 'text-blue-700' : 'text-gray-500'}`}>Habilitar Venta por Caja / Paquete</span>
                    </label>
                    
                    {/* Campos desplegables */}
                    {formData.tiene_caja && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-fade-in-up">
                            <div>
                                <label className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 block">Unidades por Caja</label>
                                <input type="number" placeholder="Ej. 12" className="w-full border border-blue-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                                    value={formData.unidades_por_caja} onChange={e => setFormData({...formData, unidades_por_caja: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 block">Precio de la Caja Completa (S/)</label>
                                <input type="number" step="0.01" placeholder="Ej. 50.00" className="w-full border border-blue-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white" 
                                    value={formData.precio_caja} onChange={e => setFormData({...formData, precio_caja: e.target.value})} />
                            </div>
                        </div>
                    )}
                </div>

                {/* SECCIÓN OFERTA */}
                <div className="md:col-span-2 bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col sm:flex-row gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={formData.ofertaactiva} onChange={e => setFormData({...formData, ofertaactiva: e.target.checked})} className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300" />
                        <span className="font-bold text-red-700">¡Activar Oferta!</span>
                    </label>
                    <input type="number" step="0.01" disabled={!formData.ofertaactiva} placeholder="Precio Oferta (S/)"
                        className={`flex-1 w-full border rounded-lg px-4 py-2.5 outline-none transition ${formData.ofertaactiva ? 'bg-white border-red-300 ring-2 ring-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        value={formData.preciooferta} onChange={e => setFormData({...formData, preciooferta: e.target.value})} />
                </div>

                {/* SWITCH VISIBILIDAD */}
                <div className="md:col-span-2 pt-2">
                     <label className="inline-flex items-center cursor-pointer gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Producto Visible en Tienda</span>
                        <input type="checkbox" className="hidden" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} />
                     </label>
                </div>
              </div>

              {/* FOOTER MODAL */}
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition">Cancelar</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}