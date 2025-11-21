import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';
import NotificationLog from '@/components/notifications/NotificationLog';

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();

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
      <main className="max-w-4xl mx-auto px-4 py-8" role="main">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Configuración de Notificaciones
          </h2>
          <p className="text-muted-foreground">
            Gestiona cómo y cuándo recibes recordatorios de tus citas
          </p>
        </div>

        <div className="space-y-6">
          <NotificationPreferences />
          <NotificationLog />
        </div>
      </main>
    </div>
  );
};

export default NotificationSettings;
