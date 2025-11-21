import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Sede, Especialidad } from '@/types/appointments';
import { AppointmentFilters as Filters } from '@/pages/History';

interface AppointmentFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  sedes: Sede[];
  especialidades: Especialidad[];
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  filters,
  onFiltersChange,
  sedes,
  especialidades,
}) => {
  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filtros de Búsqueda</CardTitle>
            <CardDescription>Refina tu búsqueda de citas</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              aria-label="Limpiar todos los filtros"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="date-from">Fecha Desde</Label>
            <Input
              id="date-from"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
              aria-label="Filtrar por fecha desde"
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="date-to">Fecha Hasta</Label>
            <Input
              id="date-to"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
              aria-label="Filtrar por fecha hasta"
            />
          </div>

          {/* Especialidad */}
          <div className="space-y-2">
            <Label htmlFor="especialidad">Especialidad</Label>
            <Select
              value={filters.especialidadId || ''}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, especialidadId: value || undefined })
              }
            >
              <SelectTrigger id="especialidad" aria-label="Filtrar por especialidad">
                <SelectValue placeholder="Todas las especialidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las especialidades</SelectItem>
                {especialidades.map((especialidad) => (
                  <SelectItem key={especialidad.id} value={especialidad.id}>
                    {especialidad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sede */}
          <div className="space-y-2">
            <Label htmlFor="sede">Sede</Label>
            <Select
              value={filters.sedeId || ''}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, sedeId: value || undefined })
              }
            >
              <SelectTrigger id="sede" aria-label="Filtrar por sede">
                <SelectValue placeholder="Todas las sedes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las sedes</SelectItem>
                {sedes.map((sede) => (
                  <SelectItem key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={filters.estado || ''}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, estado: value || undefined })
              }
            >
              <SelectTrigger id="estado" aria-label="Filtrar por estado">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="programada">Programada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="no_asistio">No Asistió</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentFilters;
