import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, MapPin, Stethoscope, UserCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppointmentCalendarProps {
  onSuccess?: () => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ onSuccess }) => {
  const { sedes, especialidades, profesionales, agendarCita, obtenerHorariosDisponibles, isLoading } = useAppointments();
  const { user } = useAuth();
  
  const [selectedSede, setSelectedSede] = useState<string>('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>('');
  const [selectedProfesional, setSelectedProfesional] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHora, setSelectedHora] = useState<string>('');

  const especialidadesFiltradas = especialidades.filter(e => 
    !selectedSede || e.sedeIds.includes(selectedSede)
  );

  const profesionalesFiltrados = profesionales.filter(p => 
    (!selectedSede || p.sedeIds.includes(selectedSede)) &&
    (!selectedEspecialidad || p.especialidadId === selectedEspecialidad)
  );

  const horariosDisponibles = selectedProfesional && selectedDate
    ? obtenerHorariosDisponibles(
        selectedProfesional, 
        selectedDate.toISOString().split('T')[0]
      )
    : [];

  const handleSubmit = async () => {
    if (!user || !selectedSede || !selectedEspecialidad || !selectedProfesional || !selectedDate || !selectedHora) {
      return;
    }

    const success = await agendarCita({
      afiliadoId: user.id,
      sedeId: selectedSede,
      especialidadId: selectedEspecialidad,
      profesionalId: selectedProfesional,
      fecha: selectedDate.toISOString().split('T')[0],
      hora: selectedHora
    });

    if (success) {
      // Reset form
      setSelectedSede('');
      setSelectedEspecialidad('');
      setSelectedProfesional('');
      setSelectedDate(undefined);
      setSelectedHora('');
      onSuccess?.();
    }
  };

  const isFormComplete = selectedSede && selectedEspecialidad && selectedProfesional && selectedDate && selectedHora;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span>Datos de la Cita</span>
          </CardTitle>
          <CardDescription>Selecciona sede, especialidad y profesional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Sede</span>
            </label>
            <Select value={selectedSede} onValueChange={setSelectedSede}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sede" />
              </SelectTrigger>
              <SelectContent>
                {sedes.map(sede => (
                  <SelectItem key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span>Especialidad</span>
            </label>
            <Select 
              value={selectedEspecialidad} 
              onValueChange={setSelectedEspecialidad}
              disabled={!selectedSede}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                {especialidadesFiltradas.map(esp => (
                  <SelectItem key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <UserCircle className="h-4 w-4 text-primary" />
              <span>Profesional</span>
            </label>
            <Select 
              value={selectedProfesional} 
              onValueChange={setSelectedProfesional}
              disabled={!selectedEspecialidad}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un profesional" />
              </SelectTrigger>
              <SelectContent>
                {profesionalesFiltrados.map(prof => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.nombreCompleto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Fecha y Hora</CardTitle>
          <CardDescription>
            {selectedProfesional ? 'Selecciona fecha y horario disponible' : 'Primero selecciona un profesional'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || !selectedProfesional}
            className={cn("rounded-md border pointer-events-auto")}
          />

          {selectedDate && horariosDisponibles.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Horarios Disponibles</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {horariosDisponibles.map(hora => (
                  <Button
                    key={hora}
                    variant={selectedHora === hora ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedHora(hora)}
                    className="text-xs"
                  >
                    {hora}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && horariosDisponibles.length === 0 && selectedProfesional && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay horarios disponibles para esta fecha
            </p>
          )}

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!isFormComplete || isLoading}
          >
            {isLoading ? 'Agendando...' : 'Confirmar Cita'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
