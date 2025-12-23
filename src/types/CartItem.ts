import type { Producto } from './Producto'

export interface CartItem extends Producto {
  cantidad: number
}
