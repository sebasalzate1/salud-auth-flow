import React, { useMemo } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cita } from '@/types/appointments';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { format, parseISO, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentDashboardProps {
  citas: Cita[];
}

const AppointmentDashboard: React.FC<AppointmentDashboardProps> = ({ citas }) => {
  const { sedes, especialidades, profesionales } = useAppointments();

  const metrics = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const citasAnio = citas.filter(cita => 
      new Date(cita.fecha).getFullYear() === currentYear
    );

    const completadas = citasAnio.filter(c => c.estado === 'completada').length;
    const canceladas = citasAnio.filter(c => c.estado === 'cancelada').length;
    const noAsistio = citasAnio.filter(c => c.estado === 'no_asistio').length;

    const proximasCitas = citas
      .filter(c => c.estado === 'programada' && isFuture(parseISO(`${c.fecha}T${c.hora}`)))
      .sort((a, b) => {
        const dateA = parseISO(`${a.fecha}T${a.hora}`);
        const dateB = parseISO(`${b.fecha}T${b.hora}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);

    return {
      total: citasAnio.length,
      completadas,
      canceladas,
      noAsistio,
      proximasCitas,
    };
  }, [citas]);

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
    <div className="space-y-6" role="region" aria-label="Dashboard de métricas de citas">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total del Año</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              Citas en {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completadas}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.total > 0 ? Math.round((metrics.completadas / metrics.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.canceladas}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.total > 0 ? Math.round((metrics.canceladas / metrics.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Asistencias</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.noAsistio}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.total > 0 ? Math.round((metrics.noAsistio / metrics.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Próximas Citas</span>
          </CardTitle>
          <CardDescription>
            Las siguientes 3 citas programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.proximasCitas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tienes citas programadas próximamente
            </p>
          ) : (
            <div className="space-y-4">
              {metrics.proximasCitas.map((cita) => {
                const { sede, especialidad, profesional } = getCitaDetails(cita);
                return (
                  <div
                    key={cita.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent-light/50 transition-colors"
                    role="article"
                    aria-label={`Cita con ${profesional?.nombreCompleto} el ${format(parseISO(cita.fecha), "d 'de' MMMM, yyyy", { locale: es })}`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground">
                          {format(parseISO(cita.fecha), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                        {getEstadoBadge(cita.estado)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Hora:</span> {cita.hora}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Especialidad:</span> {especialidad?.nombre}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Profesional:</span> {profesional?.nombreCompleto}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Sede:</span> {sede?.nombre}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentDashboard;
