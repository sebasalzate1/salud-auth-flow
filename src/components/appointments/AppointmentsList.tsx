import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { Calendar, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { ModifyAppointmentModal } from './ModifyAppointmentModal';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { Cita } from '@/types/appointments';

export const AppointmentsList: React.FC = () => {
  const { citas, sedes, especialidades, profesionales } = useAppointments();
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const citasProgramadas = citas
    .filter(c => c.estado === 'programada')
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`);
      const dateB = new Date(`${b.fecha}T${b.hora}`);
      return dateA.getTime() - dateB.getTime();
    });

  const getSedeName = (sedeId: string) => sedes.find(s => s.id === sedeId)?.nombre || 'N/A';
  const getEspecialidadName = (espId: string) => especialidades.find(e => e.id === espId)?.nombre || 'N/A';
  const getProfesionalName = (profId: string) => profesionales.find(p => p.id === profId)?.nombreCompleto || 'N/A';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleModifyClick = (cita: Cita) => {
    setSelectedCita(cita);
    setModifyModalOpen(true);
  };

  const handleCancelClick = (cita: Cita) => {
    setSelectedCita(cita);
    setCancelModalOpen(true);
  };

  if (citasProgramadas.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tienes citas programadas</h3>
          <p className="text-sm text-muted-foreground">
            Agenda tu primera cita médica para comenzar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {citasProgramadas.map(cita => (
          <Card key={cita.id} className="shadow-card hover:shadow-medical transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{getEspecialidadName(cita.especialidadId)}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>{getProfesionalName(cita.profesionalId)}</span>
                  </CardDescription>
                </div>
                <Badge variant="default">Programada</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="capitalize">{formatDate(cita.fecha)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{cita.hora}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm md:col-span-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{getSedeName(cita.sedeId)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleModifyClick(cita)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modificar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCancelClick(cita)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCita && (
        <>
          <ModifyAppointmentModal
            cita={selectedCita}
            open={modifyModalOpen}
            onOpenChange={setModifyModalOpen}
          />
          <CancelAppointmentModal
            cita={selectedCita}
            open={cancelModalOpen}
            onOpenChange={setCancelModalOpen}
          />
        </>
      )}
    </>
  );
};
