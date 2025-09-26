import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Heart, Activity } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-accent-light/20 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-medical">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          CITASalud
        </h1>
        <p className="text-muted-foreground">
          Tu plataforma de gestión médica de confianza
        </p>
      </div>

      {/* Login Form */}
      <LoginForm onSuccess={handleLoginSuccess} />

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 CITASalud. Cuidando tu salud digitalmente.
        </p>
      </footer>
    </div>
  );
};

export default Login;