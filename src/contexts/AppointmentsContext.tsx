import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cita, Sede, Especialidad, Profesional, AppointmentsContextType } from '@/types/appointments';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

const STORAGE_KEY = 'citasalud:appointments';

// Mock data
const SEDES_MOCK: Sede[] = [
  { id: '1', nombre: 'Sede Norte', direccion: 'Calle 123 #45-67' },
  { id: '2', nombre: 'Sede Sur', direccion: 'Carrera 78 #90-12' },
  { id: '3', nombre: 'Sede Centro', direccion: 'Avenida 34 #56-78' }
];

const ESPECIALIDADES_MOCK: Especialidad[] = [
  { id: '1', nombre: 'Medicina General', sedeIds: ['1', '2', '3'] },
  { id: '2', nombre: 'Cardiología', sedeIds: ['1', '3'] },
  { id: '3', nombre: 'Pediatría', sedeIds: ['2', '3'] },
  { id: '4', nombre: 'Dermatología', sedeIds: ['1'] },
  { id: '5', nombre: 'Oftalmología', sedeIds: ['2', '3'] }
];

const PROFESIONALES_MOCK: Profesional[] = [
  { id: '1', nombreCompleto: 'Dr. Carlos Méndez', especialidadId: '1', sedeIds: ['1', '2'] },
  { id: '2', nombreCompleto: 'Dra. Ana Rodríguez', especialidadId: '1', sedeIds: ['3'] },
  { id: '3', nombreCompleto: 'Dr. Juan Pérez', especialidadId: '2', sedeIds: ['1', '3'] },
  { id: '4', nombreCompleto: 'Dra. María González', especialidadId: '3', sedeIds: ['2', '3'] },
  { id: '5', nombreCompleto: 'Dr. Luis Torres', especialidadId: '4', sedeIds: ['1'] },
  { id: '6', nombreCompleto: 'Dra. Patricia Silva', especialidadId: '5', sedeIds: ['2', '3'] }
];

const HORARIOS_BASE = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30'
];

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const savedCitas = localStorage.getItem(STORAGE_KEY);
    if (savedCitas) {
      try {
        setCitas(JSON.parse(savedCitas));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  }, []);

  const saveCitas = (newCitas: Cita[]) => {
    setCitas(newCitas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCitas));
  };

  const agendarCita = async (citaData: Omit<Cita, 'id' | 'estado' | 'fechaCreacion'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if time slot is available
      const horarioOcupado = citas.some(
        c => c.profesionalId === citaData.profesionalId && 
        c.fecha === citaData.fecha && 
        c.hora === citaData.hora && 
        c.estado === 'programada'
      );

      if (horarioOcupado) {
        toast({
          variant: "destructive",
          title: "Horario no disponible",
          description: "Este horario ya está ocupado. Por favor, selecciona otro."
        });
        return false;
      }

      const nuevaCita: Cita = {
        id: crypto.randomUUID(),
        ...citaData,
        estado: 'programada',
        fechaCreacion: new Date().toISOString()
      };

      saveCitas([...citas, nuevaCita]);

      toast({
        title: "¡Cita agendada exitosamente!",
        description: `Tu cita ha sido programada para el ${citaData.fecha} a las ${citaData.hora}.`
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agendar la cita. Por favor, inténtalo de nuevo."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const modificarCita = async (citaId: string, nuevaFecha: string, nuevaHora: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const cita = citas.find(c => c.id === citaId);
      if (!cita) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cita no encontrada."
        });
        return false;
      }

      // Check 24-hour restriction
      const citaDate = new Date(`${cita.fecha}T${cita.hora}`);
      const now = new Date();
      const hoursUntilAppointment = (citaDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24) {
        toast({
          variant: "destructive",
          title: "Modificación no permitida",
          description: "No se puede modificar una cita con menos de 24 horas de anticipación."
        });
        return false;
      }

      // Check if new time slot is available
      const horarioOcupado = citas.some(
        c => c.id !== citaId &&
        c.profesionalId === cita.profesionalId && 
        c.fecha === nuevaFecha && 
        c.hora === nuevaHora && 
        c.estado === 'programada'
      );

      if (horarioOcupado) {
        toast({
          variant: "destructive",
          title: "Horario no disponible",
          description: "Este horario ya está ocupado. Por favor, selecciona otro."
        });
        return false;
      }

      const citasActualizadas = citas.map(c => 
        c.id === citaId 
          ? { ...c, fecha: nuevaFecha, hora: nuevaHora, fechaModificacion: new Date().toISOString() }
          : c
      );

      saveCitas(citasActualizadas);

      toast({
        title: "Cita modificada exitosamente",
        description: `Tu cita ha sido reprogramada para el ${nuevaFecha} a las ${nuevaHora}.`
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo modificar la cita. Por favor, inténtalo de nuevo."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarCita = async (citaId: string, motivo: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const cita = citas.find(c => c.id === citaId);
      if (!cita) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cita no encontrada."
        });
        return false;
      }

      // Check 24-hour restriction
      const citaDate = new Date(`${cita.fecha}T${cita.hora}`);
      const now = new Date();
      const hoursUntilAppointment = (citaDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24) {
        toast({
          variant: "destructive",
          title: "Cancelación no permitida",
          description: "No se puede cancelar una cita con menos de 24 horas de anticipación."
        });
        return false;
      }

      const citasActualizadas = citas.map(c => 
        c.id === citaId 
          ? { ...c, estado: 'cancelada' as const, motivoCancelacion: motivo }
          : c
      );

      saveCitas(citasActualizadas);

      toast({
        title: "Cita cancelada exitosamente",
        description: "El cupo ha sido liberado automáticamente."
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cancelar la cita. Por favor, inténtalo de nuevo."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerHorariosDisponibles = (profesionalId: string, fecha: string): string[] => {
    const citasOcupadas = citas.filter(
      c => c.profesionalId === profesionalId && 
      c.fecha === fecha && 
      c.estado === 'programada'
    ).map(c => c.hora);

    return HORARIOS_BASE.filter(hora => !citasOcupadas.includes(hora));
  };

  const value: AppointmentsContextType = {
    citas: user ? citas.filter(c => c.afiliadoId === user.id) : [],
    sedes: SEDES_MOCK,
    especialidades: ESPECIALIDADES_MOCK,
    profesionales: PROFESIONALES_MOCK,
    agendarCita,
    modificarCita,
    cancelarCita,
    obtenerHorariosDisponibles,
    isLoading
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
};
