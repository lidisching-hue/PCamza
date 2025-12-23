export interface Producto {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  imagen_url: string | null
  activo: boolean
  preciooferta: number | null
  ofertaactiva: boolean
  // Estas son las claves para que los Combos no den error
  esCombo?: boolean
  contenido?: { nombre: string; cantidad: number }[]
}