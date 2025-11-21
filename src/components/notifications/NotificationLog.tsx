import React from 'react';
import { CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const NotificationLog: React.FC = () => {
  const { recordatorios, citas } = useAppointments();

  // Sort by date descending
  const sortedRecordatorios = [...recordatorios].sort((a, b) => {
    const dateA = parseISO(a.fechaEnvio);
    const dateB = parseISO(b.fechaEnvio);
    return dateB.getTime() - dateA.getTime();
  });

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'exitoso':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'fallido':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pendiente':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'exitoso':
        return <Badge className="bg-accent text-accent-foreground">Exitoso</Badge>;
      case 'fallido':
        return <Badge variant="destructive">Fallido</Badge>;
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getCanalIcon = (canal: string) => {
    return canal === 'correo' 
      ? <Mail className="h-4 w-4" />
      : <Phone className="h-4 w-4" />;
  };

  const getCitaInfo = (citaId: string) => {
    const cita = citas.find(c => c.id === citaId);
    return cita ? `${format(parseISO(cita.fecha), "dd/MM/yyyy", { locale: es })} - ${cita.hora}` : 'N/A';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Historial de Recordatorios</CardTitle>
        <CardDescription>
          Registro de los últimos recordatorios enviados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRecordatorios.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay recordatorios registrados aún
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha de Envío</TableHead>
                  <TableHead>Cita</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Intentos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecordatorios.map((recordatorio) => (
                  <TableRow key={recordatorio.id}>
                    <TableCell className="font-medium">
                      {format(parseISO(recordatorio.fechaEnvio), "dd/MM/yyyy HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>{getCitaInfo(recordatorio.citaId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCanalIcon(recordatorio.canal)}
                        <span className="capitalize">{recordatorio.canal}</span>
                      </div>
                    </TableCell>
                    <TableCell>{recordatorio.intentos}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(recordatorio.estado)}
                        {getEstadoBadge(recordatorio.estado)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationLog;
