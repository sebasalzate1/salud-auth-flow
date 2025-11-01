import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, Activity, LogOut, Calendar, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { AppointmentsList } from '@/components/appointments/AppointmentsList';

const Appointments: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('list');

  // HU6: Validación de sesión y permisos
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== 'afiliado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-accent-light/10 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="p-4 bg-destructive/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Activity className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-6">
            Esta funcionalidad solo está disponible para usuarios afiliados.
          </p>
          <Button onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-accent-light/10">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CITASalud</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:inline">{user.nombreCompleto}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Citas Médicas
          </h2>
          <p className="text-muted-foreground">
            Agenda, modifica o cancela tus citas médicas de forma fácil y rápida
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Mis Citas</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Agendar Cita</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <AppointmentsList />
          </TabsContent>

          <TabsContent value="new">
            <AppointmentCalendar onSuccess={() => setActiveTab('list')} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Appointments;
