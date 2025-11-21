import React, { useMemo, useState } from 'react';
import { Calendar, MapPin, User, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cita } from '@/types/appointments';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppointmentFilters as Filters } from '@/pages/History';

interface AppointmentHistoryProps {
  citas: Cita[];
  filters: Filters;
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ citas, filters }) => {
  const { sedes, especialidades, profesionales } = useAppointments();
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  const filteredCitas = useMemo(() => {
    let result = [...citas];

    // Filter by date range
    if (filters.dateFrom) {
      result = result.filter(cita => cita.fecha >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter(cita => cita.fecha <= filters.dateTo!);
    }

    // Filter by especialidad
    if (filters.especialidadId) {
      result = result.filter(cita => cita.especialidadId === filters.especialidadId);
    }

    // Filter by sede
    if (filters.sedeId) {
      result = result.filter(cita => cita.sedeId === filters.sedeId);
    }

    // Filter by estado
    if (filters.estado) {
      result = result.filter(cita => cita.estado === filters.estado);
    }

    // Sort by date descending
    return result.sort((a, b) => {
      const dateA = parseISO(`${a.fecha}T${a.hora}`);
      const dateB = parseISO(`${b.fecha}T${b.hora}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [citas, filters]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'programada':
        return <Badge variant="default">Programada</Badge>;
      case 'completada':
        return <Badge className="bg-accent text-accent-foreground">Completada</Badge>;
      case 'cancelada':
        return <Badge variant="outline">Cancelada</Badge>;
      case 'no_asistio':
        return <Badge variant="destructive">No Asistió</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getCitaDetails = (cita: Cita) => {
    const sede = sedes.find(s => s.id === cita.sedeId);
    const especialidad = especialidades.find(e => e.id === cita.especialidadId);
    const profesional = profesionales.find(p => p.id === cita.profesionalId);

    return { sede, especialidad, profesional };
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Historial de Citas</CardTitle>
          <CardDescription>
            {filteredCitas.length} {filteredCitas.length === 1 ? 'cita encontrada' : 'citas encontradas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCitas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No se encontraron citas con los filtros aplicados
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCitas.map((cita) => {
                    const { especialidad, profesional } = getCitaDetails(cita);
                    return (
                      <TableRow key={cita.id}>
                        <TableCell className="font-medium">
                          {format(parseISO(cita.fecha), "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell>{cita.hora}</TableCell>
                        <TableCell>{especialidad?.nombre}</TableCell>
                        <TableCell>{profesional?.nombreCompleto}</TableCell>
                        <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCita(cita)}
                            aria-label={`Ver detalles de cita del ${format(parseISO(cita.fecha), "dd/MM/yyyy")}`}
                          >
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedCita} onOpenChange={() => setSelectedCita(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="appointment-detail-description">
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
            <DialogDescription id="appointment-detail-description">
              Información completa de la cita médica seleccionada
            </DialogDescription>
          </DialogHeader>
          {selectedCita && (() => {
            const { sede, especialidad, profesional } = getCitaDetails(selectedCita);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha y Hora</span>
                    </div>
                    <p className="font-medium">
                      {format(parseISO(selectedCita.fecha), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedCita.hora}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    {getEstadoBadge(selectedCita.estado)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Sede</span>
                    </div>
                    <p className="font-medium">{sede?.nombre}</p>
                    <p className="text-sm text-muted-foreground">{sede?.direccion}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Especialidad</p>
                    <p className="font-medium">{especialidad?.nombre}</p>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Profesional</span>
                    </div>
                    <p className="font-medium">{profesional?.nombreCompleto}</p>
                  </div>

                  {selectedCita.motivoCancelacion && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Motivo de Cancelación</p>
                      <p className="font-medium">{selectedCita.motivoCancelacion}</p>
                    </div>
                  )}

                  {selectedCita.observaciones && (
                    <div className="space-y-1 col-span-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Observaciones</span>
                      </div>
                      <p className="text-sm">{selectedCita.observaciones}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                    <p className="text-sm">
                      {format(parseISO(selectedCita.fechaCreacion), "dd/MM/yyyy HH:mm", { locale: es })}
                    </p>
                  </div>

                  {selectedCita.fechaModificacion && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Última Modificación</p>
                      <p className="text-sm">
                        {format(parseISO(selectedCita.fechaModificacion), "dd/MM/yyyy HH:mm", { locale: es })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentHistory;
