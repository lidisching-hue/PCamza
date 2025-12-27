// src/types/CartItem.ts

import type { Producto } from "./Producto";


export interface CartItem extends Producto {
  cantidad: number
  // Agregamos estas propiedades opcionales para soportar los Combos nuevos
  esCombo?: boolean
  oferta_productos?: {
    nombre?: string;
    cantidad: number;
    producto?: { nombre: string } 
  }[]
}