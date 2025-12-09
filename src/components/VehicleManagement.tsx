import React, { useState, useEffect } from 'react';
import { vehicleService, type Vehicle } from '../services/VehicleService';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Bike, Car, Zap, Plus, Edit, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VehicleManagementProps {
  userId: string;
}

export function VehicleManagement({ userId }: VehicleManagementProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    type: 'scooter' as 'scooter' | 'bicycle' | 'motorcycle',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    serialNumber: '',
    isElectric: true,
    batteryCapacity: '',
    maxSpeed: 0,
    range: 0
  });

  useEffect(() => {
    loadVehicles();
  }, [userId]);

  const loadVehicles = () => {
    const userVehicles = vehicleService.getUserVehicles(userId);
    setVehicles(userVehicles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVehicle) {
      const result = vehicleService.updateVehicle(editingVehicle.id, userId, formData);
      if (result.success) {
        toast.success(result.message);
        loadVehicles();
        setEditingVehicle(null);
        resetForm();
      } else {
        toast.error(result.message);
      }
    } else {
      // RF-02: Registrar vehículo
      const result = vehicleService.registerVehicle(userId, formData);
      
      if (result.success && result.vehicle) {
        // RF-03: Vincular vehículo automáticamente
        const linkResult = vehicleService.linkVehicleToUser(userId, result.vehicle.id);
        
        if (linkResult.success) {
          toast.success('Vehículo registrado y vinculado exitosamente');
        } else {
          toast.success(result.message);
        }
        
        loadVehicles();
        setIsAddingVehicle(false);
        resetForm();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleDelete = (vehicleId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) return;

    const result = vehicleService.deleteVehicle(vehicleId, userId);
    
    if (result.success) {
      toast.success(result.message);
      loadVehicles();
    } else {
      toast.error(result.message);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'scooter',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: '',
      serialNumber: '',
      isElectric: true,
      batteryCapacity: '',
      maxSpeed: 0,
      range: 0
    });
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || '',
      licensePlate: vehicle.licensePlate || '',
      serialNumber: vehicle.serialNumber || '',
      isElectric: vehicle.isElectric,
      batteryCapacity: vehicle.batteryCapacity || '',
      maxSpeed: vehicle.maxSpeed || 0,
      range: vehicle.range || 0
    });
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'scooter':
        return <Zap className="h-8 w-8 text-blue-600" />;
      case 'bicycle':
        return <Bike className="h-8 w-8 text-green-600" />;
      case 'motorcycle':
        return <Car className="h-8 w-8 text-purple-600" />;
      default:
        return <Zap className="h-8 w-8" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Mis Vehículos</h2>
          <p className="text-gray-600 mt-1">Gestiona tus vehículos registrados</p>
        </div>
        <Button onClick={() => setIsAddingVehicle(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Vehículo
        </Button>
      </div>

      {/* Lista de vehículos */}
      {vehicles.length === 0 ? (
        <Card className="p-12 text-center">
          <Bike className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-gray-900 mb-2">No tienes vehículos registrados</h3>
          <p className="text-gray-600 mb-6">Comienza agregando tu primer vehículo</p>
          <Button onClick={() => setIsAddingVehicle(true)} className="bg-blue-600 hover:bg-blue-700">
            Agregar Vehículo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <Card key={vehicle.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getVehicleIcon(vehicle.type)}
                  <div>
                    <h3 className="text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
                  </div>
                </div>
                {vehicle.isElectric && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Eléctrico
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Año:</span>
                  <span className="text-gray-900">{vehicle.year}</span>
                </div>
                {vehicle.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="text-gray-900">{vehicle.color}</span>
                  </div>
                )}
                {vehicle.licensePlate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Placa:</span>
                    <span className="text-gray-900 uppercase">{vehicle.licensePlate}</span>
                  </div>
                )}
                {vehicle.range && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Autonomía:</span>
                    <span className="text-gray-900">{vehicle.range} km</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(vehicle)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo para agregar/editar vehículo */}
      <Dialog open={isAddingVehicle || editingVehicle !== null} onOpenChange={(open) => {
        if (!open) {
          setIsAddingVehicle(false);
          setEditingVehicle(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Vehículo *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="scooter">Scooter</option>
                  <option value="bicycle">Bicicleta</option>
                  <option value="motorcycle">Moto</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isElectric"
                  checked={formData.isElectric}
                  onChange={(e) => setFormData({ ...formData, isElectric: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Label htmlFor="isElectric" className="cursor-pointer">
                  ⚡ Vehículo Eléctrico
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ej: Xiaomi, NIU, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ej: M365, NQi GT"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Año *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ej: Negro, Rojo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licensePlate">Placa</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  placeholder="ABC123"
                />
              </div>

              <div>
                <Label htmlFor="serialNumber">Número de Serie</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="Número de serie"
                />
              </div>
            </div>

            {formData.isElectric && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="batteryCapacity">Batería (Ah)</Label>
                    <Input
                      id="batteryCapacity"
                      value={formData.batteryCapacity}
                      onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                      placeholder="Ej: 10Ah"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxSpeed">Velocidad Máx (km/h)</Label>
                    <Input
                      id="maxSpeed"
                      type="number"
                      value={formData.maxSpeed}
                      onChange={(e) => setFormData({ ...formData, maxSpeed: parseInt(e.target.value) || 0 })}
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <Label htmlFor="range">Autonomía (km)</Label>
                    <Input
                      id="range"
                      type="number"
                      value={formData.range}
                      onChange={(e) => setFormData({ ...formData, range: parseInt(e.target.value) || 0 })}
                      placeholder="40"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingVehicle(false);
                  setEditingVehicle(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Check className="h-4 w-4 mr-2" />
                {editingVehicle ? 'Actualizar' : 'Registrar'} Vehículo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
