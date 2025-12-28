import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Producto } from '../../types/Producto'
import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '../services/productAdmin.service'

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // --- 1. ESTADO PARA LAS CATEGORÍAS DINÁMICAS ---
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)

  // Estado del Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    marca: '',
    categoria: '',
    presentacion: '',
    precio: '',
    preciooferta: '',
    ofertaactiva: false,
    activo: true,
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // --- HELPER: FORMATO MONEDA PERUANA ---
  // Esto asegura que siempre se vean 2 decimales (Ej: 15.00 o 19.90)
  const formatoMoneda = (monto: number | string) => {
    const numero = Number(monto)
    return isNaN(numero) ? '0.00' : numero.toFixed(2)
  }

  // Cargar Productos y Categorías
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    
    if (data) {
      setProductos(data)
      const uniqueCats = Array.from(new Set(data.map(p => p.categoria).filter(c => c && c.trim() !== ''))).sort()
      setAvailableCategories(uniqueCats)
    }
    setLoading(false)
  }

  // Abrir Modal
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
      })
      setImagePreview(producto.imagen_url || null)
    } else {
      setEditingProduct(null)
      setFormData({ 
        nombre: '', descripcion: '', marca: '', categoria: '', presentacion: '', 
        precio: '', preciooferta: '', ofertaactiva: false, activo: true 
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = editingProduct?.imagen_url || null

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile)
      }

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
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        // @ts-ignore
        await createProduct(productData)
      }

      await fetchProductos()
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      alert('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    await deleteProduct(id)
    fetchProductos()
  }

  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          <p className="text-gray-500">Administra tu catálogo ({productos.length})</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2"
        >
          <span>+</span> Nuevo Producto
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <input 
          type="text" 
          placeholder="Buscar por nombre o marca..." 
          className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-100 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold text-sm">
              <tr>
                <th className="p-4">Imagen</th>
                <th className="p-4">Detalles</th>
                <th className="p-4">Categoría / Marca</th>
                <th className="p-4">Precio (S/)</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Cargando...</td></tr>
              ) : filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {prod.imagen_url ? (
                        <img src={prod.imagen_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{prod.nombre}</p>
                    <p className="text-xs text-gray-500">{prod.presentacion || '-'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full w-fit">
                            {prod.categoria || 'Sin Cat.'}
                        </span>
                        <span className="text-xs text-gray-500">{prod.marca}</span>
                    </div>
                  </td>
                  {/* AQUÍ SE APLICA EL FORMATO DE MONEDA EN LA TABLA */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={prod.ofertaactiva ? "text-xs line-through text-gray-400" : "font-bold text-gray-900"}>
                        S/ {formatoMoneda(prod.precio)}
                      </span>
                      {prod.ofertaactiva && prod.preciooferta && (
                        <span className="font-bold text-red-600">
                            S/ {formatoMoneda(prod.preciooferta)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {prod.activo ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Activo</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Inactivo</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(prod)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">✏️</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              {/* Imagen */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center p-2">Subir Imagen</span>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Campos Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto</label>
                  <input 
                    type="text" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                    rows={2}
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Marca</label>
                    <input 
                        type="text" 
                        placeholder="Ej. Gloria"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                        value={formData.marca}
                        onChange={e => setFormData({...formData, marca: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    
                    {isCreatingCategory ? (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Escribe nueva categoría..."
                                autoFocus
                                className="w-full border-2 border-blue-400 rounded-lg px-3 py-2 outline-none animate-pulse-once"
                                value={formData.categoria}
                                onChange={e => setFormData({...formData, categoria: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsCreatingCategory(false);
                                    setFormData({...formData, categoria: ''})
                                }}
                                className="text-red-500 font-bold px-2 hover:bg-red-50 rounded"
                                title="Cancelar"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <select 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none bg-white"
                            value={formData.categoria}
                            onChange={e => {
                                if (e.target.value === 'NEW_CAT') {
                                    setIsCreatingCategory(true);
                                    setFormData({...formData, categoria: ''});
                                } else {
                                    setFormData({...formData, categoria: e.target.value});
                                }
                            }}
                        >
                            <option value="">Selecciona...</option>
                            {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="NEW_CAT" className="font-bold text-blue-600 bg-blue-50">
                                + Nueva Categoría...
                            </option>
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Presentación</label>
                    <input 
                        type="text" 
                        placeholder="Ej. 1kg, 500ml"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                        value={formData.presentacion}
                        onChange={e => setFormData({...formData, presentacion: e.target.value})}
                    />
                </div>

                {/* CAMPO DE PRECIO CON SOPORTE PARA DECIMALES */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Precio Normal (S/)</label>
                  <input 
                    type="number" step="0.01" required
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                    value={formData.precio}
                    onChange={e => setFormData({...formData, precio: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={formData.ofertaactiva}
                        onChange={e => setFormData({...formData, ofertaactiva: e.target.checked})}
                        className="rounded text-red-600 focus:ring-red-500 w-5 h-5"
                      />
                      ¡Activar Oferta!
                    </label>
                    
                    <input 
                        type="number" step="0.01"
                        disabled={!formData.ofertaactiva}
                        placeholder="Precio Rebajado (S/)"
                        className={`w-full border rounded-lg px-3 py-2 outline-none ${formData.ofertaactiva ? 'border-red-300 bg-white ring-2 ring-red-100' : 'bg-gray-100 cursor-not-allowed'}`}
                        value={formData.preciooferta}
                        onChange={e => setFormData({...formData, preciooferta: e.target.value})}
                    />
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.activo ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Visible en tienda</span>
                    <input type="checkbox" className="hidden" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
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