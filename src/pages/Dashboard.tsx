import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, Activity, User, Calendar, Settings, LogOut, Shield, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'medico':
        return <Stethoscope className="h-4 w-4" />;
      case 'coordinador':
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (rol: string) => {
    switch (rol) {
      case 'medico':
        return 'default';
      case 'coordinador':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleFeatures = (rol: string) => {
    switch (rol) {
      case 'medico':
        return [
          { icon: Calendar, title: 'Gestión de Citas', description: 'Ver y gestionar tu agenda médica', link: null },
          { icon: User, title: 'Historias Clínicas', description: 'Acceso a historias de pacientes', link: null },
          { icon: Settings, title: 'Configuración Médica', description: 'Ajustes específicos para médicos', link: null }
        ];
      case 'coordinador':
        return [
          { icon: Users, title: 'Gestión de Personal', description: 'Administrar médicos y personal', link: null },
          { icon: Calendar, title: 'Programación General', description: 'Coordinar horarios y disponibilidad', link: null },
          { icon: Shield, title: 'Panel Administrativo', description: 'Acceso a funciones administrativas', link: null }
        ];
      default:
        return [
          { icon: Calendar, title: 'Mis Citas', description: 'Agendar y ver mis citas médicas', link: '/appointments' },
          { icon: User, title: 'Mi Perfil', description: 'Actualizar información personal', link: null },
          { icon: Heart, title: 'Mi Salud', description: 'Seguimiento de mi estado de salud', link: null }
        ];
    }
  };

  const features = getRoleFeatures(user.rol);

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
            <div className="flex items-center space-x-2">
              {getRoleIcon(user.rol)}
              <span className="text-sm font-medium">{user.nombreCompleto}</span>
              <Badge variant={getRoleBadgeVariant(user.rol)}>
                {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
              </Badge>
            </div>
            
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            ¡Bienvenido, {user.nombreCompleto.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus actividades médicas desde tu panel de control personalizado como{' '}
            <span className="font-medium text-primary">{user.rol}</span>.
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Mi Información</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Documento</p>
              <p className="font-medium">{user.documento}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correo Electrónico</p>
              <p className="font-medium">{user.correo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{user.telefono}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Registro</p>
              <p className="font-medium">
                {new Date(user.fechaRegistro).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              {feature.link ? (
                <Link to={feature.link} className="block">
                  <Card className="shadow-card hover:shadow-medical transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-light rounded-lg group-hover:bg-gradient-primary transition-all duration-300">
                          <feature.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className="shadow-card hover:shadow-medical transition-all duration-300 cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-light rounded-lg group-hover:bg-gradient-primary transition-all duration-300">
                        <feature.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                    <div className="mt-4 text-sm text-muted-foreground">
                      Próximamente disponible
                    </div>
                  </CardContent>
                </Card>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Development Notice */}
        <Card className="mt-8 border-accent bg-accent-light/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-gradient-success rounded-lg">
                <Settings className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
            <h3 className="font-semibold text-accent-foreground mb-2">
              Módulo de Autenticación Completo
            </h3>
            <p className="text-sm text-accent-foreground/80">
              El sistema de registro e inicio de sesión está funcionando correctamente. 
              Las funcionalidades adicionales se implementarán en las siguientes fases del proyecto.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;