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
  estado: 'programada' | 'cancelada' | 'completada' | 'no_asistio';
  motivoCancelacion?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
  observaciones?: string;
}

export interface Recordatorio {
  id: string;
  citaId: string;
  canal: 'correo' | 'sms';
  fechaEnvio: string;
  estado: 'exitoso' | 'fallido' | 'pendiente';
  intentos: number;
}

export interface PreferenciasNotificacion {
  userId: string;
  canalPreferido: 'correo' | 'sms';
  correo?: string;
  telefono?: string;
}

export interface AppointmentsContextType {
  citas: Cita[];
  sedes: Sede[];
  especialidades: Especialidad[];
  profesionales: Profesional[];
  recordatorios: Recordatorio[];
  preferenciasNotificacion: PreferenciasNotificacion | null;
  agendarCita: (cita: Omit<Cita, 'id' | 'estado' | 'fechaCreacion'>) => Promise<boolean>;
  modificarCita: (citaId: string, nuevaFecha: string, nuevaHora: string) => Promise<boolean>;
  cancelarCita: (citaId: string, motivo: string) => Promise<boolean>;
  obtenerHorariosDisponibles: (profesionalId: string, fecha: string) => string[];
  actualizarPreferenciasNotificacion: (preferencias: Omit<PreferenciasNotificacion, 'userId'>) => Promise<boolean>;
  procesarRecordatorios: () => void;
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
