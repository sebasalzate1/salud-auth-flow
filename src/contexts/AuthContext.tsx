import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'citasalud:users',
  SESSION: 'citasalud:session'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    }
  }, []);

  const getUsers = (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  };

  const register = async (userData: Omit<User, 'id' | 'rol' | 'fechaRegistro'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getUsers();
      
      // Check if document or email already exists
      const existingUser = users.find(
        u => u.documento === userData.documento || u.correo === userData.correo
      );
      
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Error de registro",
          description: "El documento o correo electrónico ya se encuentra registrado."
        });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        ...userData,
        rol: 'afiliado',
        fechaRegistro: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      saveUsers(users);
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión."
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, contrasena: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getUsers();
      const foundUser = users.find(
        u => u.correo === correo && u.contrasena === contrasena
      );
      
      if (!foundUser) {
        toast({
          variant: "destructive",
          title: "Error de acceso",
          description: "Las credenciales son inválidas. Por favor, verifica tu correo y contraseña."
        });
        return false;
      }
      
      // Save session
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(foundUser));
      setUser(foundUser);
      
      toast({
        title: "¡Bienvenido!",
        description: `Hola ${foundUser.nombreCompleto}, has iniciado sesión correctamente.`
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error. Por favor, inténtalo de nuevo."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente."
    });
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};