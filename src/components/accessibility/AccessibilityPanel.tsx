import React from 'react';
import { Eye, Type, Zap, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const AccessibilityPanel: React.FC = () => {
  const { settings, toggleHighContrast, setFontSize, toggleReducedMotion, resetSettings } = useAccessibility();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Configuración de Accesibilidad</span>
        </CardTitle>
        <CardDescription>
          Ajusta la interfaz según tus necesidades para una mejor experiencia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="high-contrast" className="text-base">
              Alto Contraste
            </Label>
            <p className="text-sm text-muted-foreground">
              Aumenta el contraste de colores para mejor visibilidad
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={toggleHighContrast}
            aria-label="Activar o desactivar alto contraste"
          />
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size" className="text-base flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Tamaño de Fuente</span>
            </Label>
            <span className="text-sm font-medium">{settings.fontSize}%</span>
          </div>
          <Slider
            id="font-size"
            min={100}
            max={200}
            step={25}
            value={[settings.fontSize]}
            onValueChange={([value]) => setFontSize(value)}
            className="w-full"
            aria-label="Ajustar tamaño de fuente"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>100%</span>
            <span>125%</span>
            <span>150%</span>
            <span>175%</span>
            <span>200%</span>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reduced-motion" className="text-base flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Reducir Movimiento</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Minimiza animaciones y transiciones
            </p>
          </div>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={toggleReducedMotion}
            aria-label="Activar o desactivar reducción de movimiento"
          />
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full"
            aria-label="Restablecer configuración de accesibilidad a valores por defecto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer Configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityPanel;
