import { createContext, useEffect, useState } from 'react'
import type { CartItem } from '../types/CartItem'
import type { Producto } from '../types/Producto'

interface CartContextType {
  items: CartItem[]
  addToCart: (producto: Producto) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, cantidad: number) => void
  increment: (id: string) => void
  decrement: (id: string) => void
}

export const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart')
      return stored ? (JSON.parse(stored) as CartItem[]) : []
    } catch (error) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (producto: Producto) => {
    setItems(prev => {
      // 1. Buscamos si el producto ya existe
      const existe = prev.find(item => item.id === producto.id)

      if (existe) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }

      // 2. CORRECCIÓN: Creamos el item asegurando las propiedades nuevas
      // Usamos (producto as any) si TS se pone estricto, pero con los tipos actualizados no debería ser necesario.
      const nuevoItem: CartItem = {
        ...producto,
        cantidad: 1,
        esCombo: producto.esCombo || false,
        // Guardamos AMBOS formatos para evitar errores si usas componentes viejos
        contenido: producto.contenido || [], 
        oferta_productos: (producto as any).oferta_productos || [] 
      }

      return [...prev, nuevoItem]
    })
  }

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(id)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    )
  }

  const increment = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) updateQuantity(id, item.cantidad + 1)
  }

  const decrement = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) updateQuantity(id, item.cantidad - 1)
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, updateQuantity, increment, decrement }}>
      {children}
    </CartContext.Provider>
  )
}