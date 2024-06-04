export interface AuthState {
  loggedIn: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: () => void;
  logout: () => void;
}

export interface User {
  id: number;
  user: string;
  token: string;
}

export interface Categoria {
  id?: number | null;
  nombre: string;
  descripcion?: string | null;
  productos?: Producto[];
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoriaId: number;
  categoria?: Categoria;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  stock?: number
  movimientosInventario?: MovimientoInventario[];
}

export interface MovimientoInventario {
  id?: number;
  categoriaId?: number;
  productoId: number;
  producto?: Producto;
  tipoMovimiento: 'entrada' | 'salida';
  cantidad: number;
  fechaMovimiento?: string;
  descripcion?: string | null;
}

export interface FieldOnmodal {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: { value: string | number; label: string }[];
  disabled?: boolean;
}