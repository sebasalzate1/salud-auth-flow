import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { Cita } from '@/types/appointments';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModifyAppointmentModalProps {
  cita: Cita;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModifyAppointmentModal: React.FC<ModifyAppointmentModalProps> = ({
  cita,
  open,
  onOpenChange
}) => {
  const { modificarCita, obtenerHorariosDisponibles, isLoading } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHora, setSelectedHora] = useState<string>('');

  const horariosDisponibles = selectedDate
    ? obtenerHorariosDisponibles(
        cita.profesionalId,
        selectedDate.toISOString().split('T')[0]
      )
    : [];

  const handleSubmit = async () => {
    if (!selectedDate || !selectedHora) return;

    const success = await modificarCita(
      cita.id,
      selectedDate.toISOString().split('T')[0],
      selectedHora
    );

    if (success) {
      onOpenChange(false);
      setSelectedDate(undefined);
      setSelectedHora('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modificar Cita</DialogTitle>
          <DialogDescription>
            Selecciona una nueva fecha y hora para tu cita. No se puede modificar con menos de 24 horas de anticipación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Selecciona nueva fecha</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className={cn("rounded-md border pointer-events-auto")}
            />
          </div>

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

          {selectedDate && horariosDisponibles.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay horarios disponibles para esta fecha
            </p>
          )}

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedHora || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Modificando...' : 'Confirmar Cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
