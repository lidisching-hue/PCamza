import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Producto } from '../../types/Producto'
import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '../services/productAdmin.service'

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)

  // Estado del Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    preciooferta: '',
    ofertaactiva: false,
    activo: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // 1. Cargar Productos
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    if (data) setProductos(data)
    setLoading(false)
  }

  // 2. Abrir Modal (Crear o Editar)
  const handleOpenModal = (producto?: Producto) => {
    if (producto) {
      setEditingProduct(producto)
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio.toString(),
        preciooferta: producto.preciooferta?.toString() || '',
        ofertaactiva: producto.ofertaactiva|| false,
        activo: producto.activo,
      })
      setImagePreview(producto.imagen_url)
    } else {
      setEditingProduct(null)
      setFormData({ nombre: '', descripcion: '', precio: '', preciooferta: '', ofertaactiva: false, activo: true })
      setImagePreview(null)
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  // 3. Manejar selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file)) // Previsualización local
    }
  }

  // 4. Guardar (Crear o Actualizar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = editingProduct?.imagen_url || null

      // Si hay nueva imagen, subirla primero
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile)
      }

      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        preciooferta: formData.preciooferta ? parseFloat(formData.preciooferta) : null,
        ofertaactiva: formData.ofertaactiva,
        activo: formData.activo,
        imagen_url: imageUrl,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        // @ts-ignore: Omitimos ID porque Supabase lo genera
        await createProduct(productData)
      }

      await fetchProductos() // Recargar tabla
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      alert('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  // 5. Eliminar
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    await deleteProduct(id)
    fetchProductos()
  }

  // Filtrado visual
  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Buscar producto por nombre..." 
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
                <th className="p-4">Nombre</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando...</td></tr>
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
                    <p className="text-xs text-gray-500 line-clamp-1">{prod.descripcion}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={prod.ofertaactiva ? "text-xs line-through text-gray-400" : "font-bold"}>
                        S/ {prod.precio}
                      </span>
                      {prod.ofertaactiva && (
                        <span className="font-bold text-red-600">S/ {prod.preciooferta}</span>
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
                    <button 
                      onClick={() => handleOpenModal(prod)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(prod.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-400">No se encontraron productos.</div>
          )}
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
                <p className="text-xs text-gray-500">Click para cambiar imagen</p>
              </div>

              {/* Campos Texto */}
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
                    rows={3}
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Precio Normal (S/)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
                    value={formData.precio}
                    onChange={e => setFormData({...formData, precio: e.target.value})}
                  />
                </div>

                <div>
                   <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                      <input 
                        type="checkbox" 
                        checked={formData.ofertaactiva}
                        onChange={e => setFormData({...formData, ofertaactiva: e.target.checked})}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      Activar Oferta
                   </label>
                   <input 
                    type="number" step="0.01"
                    disabled={!formData.ofertaactiva}
                    placeholder="Precio Oferta"
                    className={`w-full border rounded-lg px-3 py-2 outline-none ${formData.ofertaactiva ? 'border-red-300 bg-red-50' : 'bg-gray-100 cursor-not-allowed'}`}
                    value={formData.preciooferta}
                    onChange={e => setFormData({...formData, preciooferta: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.activo ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Producto Visible en Catálogo</span>
                    <input type="checkbox" className="hidden" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} />
                  </label>
                </div>
              </div>

              {/* Botones Footer */}
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