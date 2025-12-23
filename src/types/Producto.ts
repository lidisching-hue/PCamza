export type Producto = {
  oferta: boolean
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  imagen_url: string | null
  activo: boolean
  preciooferta: number | null
  ofertaactiva: boolean
}
