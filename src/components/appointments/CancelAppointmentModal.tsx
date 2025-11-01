import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { Cita, MOTIVOS_CANCELACION } from '@/types/appointments';
import { AlertTriangle } from 'lucide-react';

interface CancelAppointmentModalProps {
  cita: Cita;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  cita,
  open,
  onOpenChange
}) => {
  const { cancelarCita, isLoading } = useAppointments();
  const [motivo, setMotivo] = useState<string>('');

  const handleSubmit = async () => {
    if (!motivo) return;

    const success = await cancelarCita(cita.id, motivo);

    if (success) {
      onOpenChange(false);
      setMotivo('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Cancelar Cita</span>
          </DialogTitle>
          <DialogDescription>
            Estás a punto de cancelar esta cita. Esta acción no se puede deshacer. No se puede cancelar con menos de 24 horas de anticipación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Motivo de cancelación <span className="text-destructive">*</span>
            </label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                {MOTIVOS_CANCELACION.map(m => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={!motivo || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
