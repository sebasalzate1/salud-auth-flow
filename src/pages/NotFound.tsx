import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Heart, Activity, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
      </div>

      {/* 404 Content */}
      <Card className="w-full max-w-md shadow-medical text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-primary mb-4">404</CardTitle>
          <CardDescription className="text-lg">
            ¡Oops! No pudimos encontrar esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            La página que buscas no existe o ha sido movida.
          </p>
          
          <Button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-gradient-primary hover:bg-primary-hover"
          >
            <Home className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 CITASalud. Cuidando tu salud digitalmente.
        </p>
      </footer>
    </div>
  );
};

export default NotFound;
