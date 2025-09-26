export interface User {
  id: string;
  nombreCompleto: string;
  documento: string;
  correo: string;
  telefono: string;
  contrasena: string;
  rol: 'afiliado' | 'medico' | 'coordinador';
  fechaRegistro: string;
}

export interface AuthContextType {
  user: User | null;
  login: (correo: string, contrasena: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'rol' | 'fechaRegistro'>) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterFormData {
  nombreCompleto: string;
  documento: string;
  correo: string;
  telefono: string;
  contrasena: string;
}

export interface LoginFormData {
  correo: string;
  contrasena: string;
}