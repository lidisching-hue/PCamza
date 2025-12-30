// src/types/contenido.ts

// ==========================================================
// 1. SECCIÓN HOME (Adaptado a la tabla real 'contenido_home')
// ==========================================================
export interface ContenidoHome {
  id: string;        // UUID de Supabase
  created_at: string;
  seccion: 'banner' | 'oferta' | 'video';
  url: string;

  // Campos opcionales (por si en el futuro agregas estas columnas a la BD)
  orden?: number;    
  titulo?: string;
  activo?: boolean;
}

// ==========================================================
// 2. SECCIÓN NOSOTROS (Placeholders)
// ==========================================================
export interface ContenidoNosotros {
  id: number;
  seccion: string;
  url: string;
  orden: number;
  titulo?: string;
}

// ==========================================================
// 3. SECCIÓN TIENDAS (Placeholders)
// ==========================================================
export interface ContenidoTiendaBanner {
  url: string;
}

export interface Tienda {
  id: number;
  ciudad: string;
  nombre: string;
  direccion: string;
  horario: string;
  telefono: string;
  map_src: string;
  orden: number;
}

// ==========================================================
// 4. CONTACTO (Placeholders)
// ==========================================================
export interface AjusteContacto {
  id: number;
  clave: string;
  valor: string;
}