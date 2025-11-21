import React, { useState, useEffect } from 'react';
import { Mail, Phone, Save, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { useToast } from '@/hooks/use-toast';

const NotificationPreferences: React.FC = () => {
  const { user } = useAuth();
  const { preferenciasNotificacion, actualizarPreferenciasNotificacion } = useAppointments();
  const { toast } = useToast();

  const [canalPreferido, setCanalPreferido] = useState<'correo' | 'sms'>('correo');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (preferenciasNotificacion) {
      setCanalPreferido(preferenciasNotificacion.canalPreferido);
      setCorreo(preferenciasNotificacion.correo || user?.correo || '');
      setTelefono(preferenciasNotificacion.telefono || user?.telefono || '');
    } else if (user) {
      setCorreo(user.correo);
      setTelefono(user.telefono);
    }
  }, [preferenciasNotificacion, user]);

  const handleSave = async () => {
    if (canalPreferido === 'correo' && !correo) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes proporcionar un correo electrónico',
      });
      return;
    }

    if (canalPreferido === 'sms' && !telefono) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes proporcionar un número de teléfono',
      });
      return;
    }

    setIsLoading(true);
    const success = await actualizarPreferenciasNotificacion({
      canalPreferido,
      correo: correo || undefined,
      telefono: telefono || undefined,
    });

    setIsLoading(false);

    if (success) {
      toast({
        title: 'Preferencias actualizadas',
        description: 'Tus preferencias de notificación se han guardado correctamente',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron guardar las preferencias',
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Preferencias de Notificación</span>
        </CardTitle>
        <CardDescription>
          Configura cómo deseas recibir recordatorios de tus citas médicas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canal Preferido */}
        <div className="space-y-3">
          <Label htmlFor="canal-preferido">Canal de Notificación Preferido</Label>
          <RadioGroup
            id="canal-preferido"
            value={canalPreferido}
            onValueChange={(value) => setCanalPreferido(value as 'correo' | 'sms')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="correo" id="correo" />
              <Label htmlFor="correo" className="flex items-center space-x-2 cursor-pointer">
                <Mail className="h-4 w-4" />
                <span>Correo Electrónico</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms" className="flex items-center space-x-2 cursor-pointer">
                <Phone className="h-4 w-4" />
                <span>SMS</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Correo */}
        <div className="space-y-2">
          <Label htmlFor="correo-input">Correo Electrónico</Label>
          <Input
            id="correo-input"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="tu@email.com"
            disabled={canalPreferido === 'sms'}
            aria-label="Correo electrónico para notificaciones"
          />
          <p className="text-xs text-muted-foreground">
            {canalPreferido === 'correo' 
              ? 'Recibirás recordatorios en este correo 24 horas antes de tu cita'
              : 'Este campo no es necesario si seleccionaste SMS como canal preferido'}
          </p>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="telefono-input">Número de Teléfono</Label>
          <Input
            id="telefono-input"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+57 300 123 4567"
            disabled={canalPreferido === 'correo'}
            aria-label="Número de teléfono para notificaciones"
          />
          <p className="text-xs text-muted-foreground">
            {canalPreferido === 'sms'
              ? 'Recibirás recordatorios por SMS 24 horas antes de tu cita'
              : 'Este campo no es necesario si seleccionaste correo como canal preferido'}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-accent-light/50 border border-accent rounded-lg p-4">
          <p className="text-sm text-accent-foreground">
            <strong>Recordatorios automáticos:</strong> El sistema enviará recordatorios automáticamente 
            24 horas antes de cada cita programada. Si el envío falla, se intentará hasta 2 veces más 
            con intervalos de 30 minutos.
          </p>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full"
          aria-label="Guardar preferencias de notificación"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
