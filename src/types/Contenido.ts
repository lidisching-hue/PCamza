export interface ContenidoInicio {
  id: number
  created_at: string
  seccion: 'banner' | 'oferta' | 'video' // Solo permitimos estos valores exactos
  url: string
  orden: number
  titulo?: string
  activo: boolean
}

export interface ContenidoNosotros {
  id: number
  seccion: string // 'banner' | 'contenido'
  url: string
  orden: number
  titulo?: string
}

// Interfaces para la sección de Tiendas
export interface ContenidoTiendaBanner {
  url: string
}

export interface Tienda {
  id: number
  ciudad: string // Ej: 'piura', 'lima'
  nombre: string
  direccion: string
  horario: string
  telefono: string
  map_src: string // Nombre exacto de la columna en Supabase
  orden: number
}
// ... (manten lo anterior y agrega esto al final)

export interface AjusteContacto {
  id: number
  clave: string
  valor: string
}
// Asegúrate de que el nombre del archivo sea Contenido.ts (con C mayúscula)

export interface ProductoEnCombo {
  cantidad: number;
  productos: {
    nombre: string;
    precio: number;
    imagen_url: string;
  };
}

export interface OfertaCombo {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_calculado: number;
  precio_oferta: number;
  activo: boolean;
  fecha_vencimiento: string; 
  oferta_productos: ProductoEnCombo[];
}

// ... Tus otras interfaces (Tienda, ContenidoInicio, etc.)
export interface ContenidoInicio {
  id: number;
  created_at: string;
  seccion: 'banner' | 'oferta' | 'video';
  url: string;
  orden: number;
  titulo?: string;
  activo: boolean;
}