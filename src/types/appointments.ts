export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
}

export interface Especialidad {
  id: string;
  nombre: string;
  sedeIds: string[];
}

export interface Profesional {
  id: string;
  nombreCompleto: string;
  especialidadId: string;
  sedeIds: string[];
}

export interface HorarioDisponible {
  fecha: string;
  hora: string;
  profesionalId: string;
  disponible: boolean;
}

export interface Cita {
  id: string;
  afiliadoId: string;
  sedeId: string;
  especialidadId: string;
  profesionalId: string;
  fecha: string;
  hora: string;
  estado: 'programada' | 'cancelada' | 'completada';
  motivoCancelacion?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface AppointmentsContextType {
  citas: Cita[];
  sedes: Sede[];
  especialidades: Especialidad[];
  profesionales: Profesional[];
  agendarCita: (cita: Omit<Cita, 'id' | 'estado' | 'fechaCreacion'>) => Promise<boolean>;
  modificarCita: (citaId: string, nuevaFecha: string, nuevaHora: string) => Promise<boolean>;
  cancelarCita: (citaId: string, motivo: string) => Promise<boolean>;
  obtenerHorariosDisponibles: (profesionalId: string, fecha: string) => string[];
  isLoading: boolean;
}

export const MOTIVOS_CANCELACION = [
  'No puedo asistir',
  'Problema de transporte',
  'Mejoría en el estado de salud',
  'Cambio de horario laboral',
  'Emergencia personal',
  'Otro'
] as const;
