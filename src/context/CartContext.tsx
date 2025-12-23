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
  /* 🧠 Inicializar carrito desde localStorage */
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart')
      return stored ? (JSON.parse(stored) as CartItem[]) : []
    } catch (error) {
      console.error('Error leyendo carrito:', error)
      return []
    }
  })

  /* 💾 Guardar carrito en localStorage cada vez que cambia */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  /* ➕ Agregar producto al carrito */
  const addToCart = (producto: Producto) => {
    setItems(prev => {
      const existe = prev.find(item => item.id === producto.id)

      if (existe) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }

      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  /* ➖ Quitar producto del carrito */
  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  /* 🔄 Actualizar cantidad de un producto */
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

  /* ➕ Incrementar cantidad de un producto */
  const increment = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) updateQuantity(id, item.cantidad + 1)
  }

  /* ➖ Decrementar cantidad de un producto */
  const decrement = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) updateQuantity(id, item.cantidad - 1)
  }

  /* 🧹 Vaciar carrito completo */
  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        increment,
        decrement,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
