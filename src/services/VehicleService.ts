import { storageService } from './LocalStorageService';
import type { User } from './AuthService';

export interface Vehicle {
  id: string;
  userId: string;
  type: 'scooter' | 'bicycle' | 'motorcycle';
  brand: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  serialNumber?: string;
  isElectric: boolean;
  batteryCapacity?: string;
  maxSpeed?: number;
  range?: number;
  photos?: string[];
  registrationDate: string;
  isActive: boolean;
}

class VehicleService {
  private static instance: VehicleService;

  private constructor() {}

  public static getInstance(): VehicleService {
    if (!VehicleService.instance) {
      VehicleService.instance = new VehicleService();
    }
    return VehicleService.instance;
  }

  // RF-02: Registrar vehículo
  registerVehicle(
    userId: string,
    vehicleData: Omit<Vehicle, 'id' | 'userId' | 'registrationDate' | 'isActive'>
  ): { success: boolean; message: string; vehicle?: Vehicle } {
    // RNF-08: Validaciones al realizar CRUD
    if (!userId) {
      return { success: false, message: 'Usuario no identificado' };
    }

    if (!vehicleData.type || !vehicleData.brand || !vehicleData.model || !vehicleData.year) {
      return { success: false, message: 'Todos los campos obligatorios deben ser completados' };
    }

    if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
      return { success: false, message: 'Año inválido' };
    }

    const vehicles = storageService.get<Vehicle[]>('vehicles') || [];
    
    const newVehicle: Vehicle = {
      id: this.generateId(),
      userId,
      ...vehicleData,
      registrationDate: new Date().toISOString(),
      isActive: true
    };

    vehicles.push(newVehicle);
    storageService.set('vehicles', vehicles);

    return { success: true, message: 'Vehículo registrado exitosamente', vehicle: newVehicle };
  }

  // RF-03: Vincular vehículo a cuenta
  linkVehicleToUser(userId: string, vehicleId: string): { success: boolean; message: string } {
    const vehicles = storageService.get<Vehicle[]>('vehicles') || [];
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (!vehicle) {
      return { success: false, message: 'Vehículo no encontrado' };
    }

    if (vehicle.userId !== userId) {
      return { success: false, message: 'No tienes permiso para vincular este vehículo' };
    }

    // Actualizar usuario con el vehículo vinculado
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (!users[userIndex].vehicles) {
      users[userIndex].vehicles = [];
    }

    if (!users[userIndex].vehicles.includes(vehicleId)) {
      users[userIndex].vehicles.push(vehicleId);
      storageService.set('users', users);
    }

    return { success: true, message: 'Vehículo vinculado exitosamente' };
  }

  // Obtener vehículos de un usuario
  getUserVehicles(userId: string): Vehicle[] {
    const vehicles = storageService.get<Vehicle[]>('vehicles') || [];
    return vehicles.filter(v => v.userId === userId && v.isActive);
  }

  // Obtener vehículo por ID
  getVehicleById(vehicleId: string): Vehicle | null {
    const vehicles = storageService.get<Vehicle[]>('vehicles') || [];
    return vehicles.find(v => v.id === vehicleId) || null;
  }

  // Actualizar vehículo
  updateVehicle(
    vehicleId: string, 
    userId: string, 
    updates: Partial<Vehicle>
  ): { success: boolean; message: string; vehicle?: Vehicle } {
    const vehicles = storageService.get<Vehicle[]>('vehicles') || [];
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);

    if (vehicleIndex === -1) {
      return { success: false, message: 'Vehículo no encontrado' };
    }

    if (vehicles[vehicleIndex].userId !== userId) {
      return { success: false, message: 'No tienes permiso para actualizar este vehículo' };
    }

    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updates,
      id: vehicleId,
      userId: vehicles[vehicleIndex].userId
    };

    storageService.set('vehicles', vehicles);

    return { success: true, message: 'Vehículo actualizado exitosamente', vehicle: vehicles[vehicleIndex] };
  }

  // Eliminar vehículo (soft delete)
  deleteVehicle(vehicleId: string, userId: string): { success: boolean; message: string } {
    const vehicles = storageService.get<Vehicle[]>('vehicles') || [];
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);

    if (vehicleIndex === -1) {
      return { success: false, message: 'Vehículo no encontrado' };
    }

    if (vehicles[vehicleIndex].userId !== userId) {
      return { success: false, message: 'No tienes permiso para eliminar este vehículo' };
    }

    vehicles[vehicleIndex].isActive = false;
    storageService.set('vehicles', vehicles);

    // Desvincular del usuario
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && users[userIndex].vehicles) {
      users[userIndex].vehicles = users[userIndex].vehicles.filter(id => id !== vehicleId);
      storageService.set('users', users);
    }

    return { success: true, message: 'Vehículo eliminado exitosamente' };
  }

  private generateId(): string {
    return 'veh_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const vehicleService = VehicleService.getInstance();
