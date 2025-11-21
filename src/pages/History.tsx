import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, Activity, ArrowLeft, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentsContext';
import AppointmentDashboard from '@/components/history/AppointmentDashboard';
import AppointmentHistory from '@/components/history/AppointmentHistory';
import AppointmentFilters from '@/components/history/AppointmentFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface AppointmentFilters {
  dateFrom?: string;
  dateTo?: string;
  especialidadId?: string;
  sedeId?: string;
  estado?: string;
}

const History: React.FC = () => {
  const { user } = useAuth();
  const { citas, sedes, especialidades } = useAppointments();
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== 'afiliado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-accent-light/10 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            Esta sección solo está disponible para afiliados
          </p>
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userCitas = citas.filter(cita => cita.afiliadoId === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-accent-light/10">
      {/* Header */}
      <header className="border-b bg-card shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CITASalud</h1>
          </div>
          
          <Link to="/dashboard">
            <Button variant="outline" size="sm" aria-label="Volver al panel principal">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8" role="main">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Historial y Dashboard de Citas
          </h2>
          <p className="text-muted-foreground">
            Visualiza tus citas pasadas, futuras y métricas de asistencia
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Historial</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AppointmentDashboard citas={userCitas} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-label="Mostrar u ocultar filtros de búsqueda"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </Button>
            </div>

            {showFilters && (
              <AppointmentFilters
                filters={filters}
                onFiltersChange={setFilters}
                sedes={sedes}
                especialidades={especialidades}
              />
            )}

            <AppointmentHistory citas={userCitas} filters={filters} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default History;
