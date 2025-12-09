import { storageService } from './LocalStorageService';

export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  type: 'charging_station' | 'repair_shop' | 'parking' | 'store' | 'rest_area' | 'scenic_point' | 'danger_zone';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  icon: string;
  rating: number;
  reviewCount: number;
  photos?: string[];
  amenities?: string[];
  isVerified: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  distance: number; // en kilómetros
  estimatedDuration: number; // en minutos
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'urban' | 'suburban' | 'mixed';
  waypoints: {
    lat: number;
    lng: number;
    order: number;
  }[];
  pointsOfInterest: string[]; // IDs de POIs en la ruta
  rating: number;
  reviewCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

class MapService {
  private static instance: MapService;
  // Coordenadas de Bogotá, D.C.
  private readonly bogotaCenter = { lat: 4.6097, lng: -74.0817 };

  private constructor() {
    this.initializeDefaultPOIs();
  }

  public static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  // RF-27: Registrar punto de interés
  createPointOfInterest(
    poiData: Omit<PointOfInterest, 'id' | 'rating' | 'reviewCount' | 'createdAt'>
  ): { success: boolean; message: string; poi?: PointOfInterest } {
    // Validaciones
    if (!poiData.name || !poiData.type || !poiData.location) {
      return { success: false, message: 'Campos obligatorios faltantes' };
    }

    if (!this.isValidLocation(poiData.location.lat, poiData.location.lng)) {
      return { success: false, message: 'Ubicación inválida' };
    }

    const pois = storageService.get<PointOfInterest[]>('pointsOfInterest') || [];

    const newPOI: PointOfInterest = {
      id: this.generateId(),
      ...poiData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    pois.push(newPOI);
    storageService.set('pointsOfInterest', pois);

    return { success: true, message: 'Punto de interés registrado', poi: newPOI };
  }

  // Obtener puntos de interés
  getPointsOfInterest(filters?: {
    type?: string;
    minRating?: number;
    location?: { lat: number; lng: number; radiusKm: number };
    searchTerm?: string;
  }): PointOfInterest[] {
    let pois = storageService.get<PointOfInterest[]>('pointsOfInterest') || [];

    if (!filters) return pois;

    if (filters.type) {
      pois = pois.filter(poi => poi.type === filters.type);
    }

    if (filters.minRating) {
      pois = pois.filter(poi => poi.rating >= filters.minRating!);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      pois = pois.filter(poi =>
        poi.name.toLowerCase().includes(term) ||
        poi.description.toLowerCase().includes(term)
      );
    }

    if (filters.location && filters.location.radiusKm) {
      pois = pois.filter(poi => {
        const distance = this.calculateDistance(
          filters.location!.lat,
          filters.location!.lng,
          poi.location.lat,
          poi.location.lng
        );
        return distance <= filters.location!.radiusKm;
      });
    }

    return pois;
  }

  // Obtener POI por ID
  getPointOfInterestById(poiId: string): PointOfInterest | null {
    const pois = storageService.get<PointOfInterest[]>('pointsOfInterest') || [];
    return pois.find(poi => poi.id === poiId) || null;
  }

  // Crear ruta
  createRoute(
    routeData: Omit<Route, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; message: string; route?: Route } {
    // Validaciones
    if (!routeData.name || !routeData.waypoints || routeData.waypoints.length < 2) {
      return { success: false, message: 'La ruta debe tener al menos 2 puntos' };
    }

    const routes = storageService.get<Route[]>('routes') || [];

    const newRoute: Route = {
      id: this.generateId(),
      ...routeData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    routes.push(newRoute);
    storageService.set('routes', routes);

    return { success: true, message: 'Ruta creada exitosamente', route: newRoute };
  }

  // Obtener rutas
  getRoutes(filters?: {
    createdBy?: string;
    difficulty?: string;
    type?: string;
    minRating?: number;
    isPublic?: boolean;
  }): Route[] {
    let routes = storageService.get<Route[]>('routes') || [];

    if (!filters) return routes.filter(r => r.isPublic);

    if (filters.isPublic !== undefined) {
      routes = routes.filter(r => r.isPublic === filters.isPublic);
    }

    if (filters.createdBy) {
      routes = routes.filter(r => r.createdBy === filters.createdBy);
    }

    if (filters.difficulty) {
      routes = routes.filter(r => r.difficulty === filters.difficulty);
    }

    if (filters.type) {
      routes = routes.filter(r => r.type === filters.type);
    }

    if (filters.minRating) {
      routes = routes.filter(r => r.rating >= filters.minRating!);
    }

    return routes;
  }

  // Obtener ruta por ID
  getRouteById(routeId: string): Route | null {
    const routes = storageService.get<Route[]>('routes') || [];
    return routes.find(r => r.id === routeId) || null;
  }

  // RF-11: Obtener ubicación actual (simulada para Bogotá)
  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      // Simular delay de geolocalización
      setTimeout(() => {
        // Agregar variación aleatoria para simular diferentes ubicaciones en Bogotá
        const lat = this.bogotaCenter.lat + (Math.random() - 0.5) * 0.1;
        const lng = this.bogotaCenter.lng + (Math.random() - 0.5) * 0.1;
        resolve({ lat, lng });
      }, 500);
    });
  }

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private isValidLocation(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Inicializar puntos de interés por defecto en Bogotá
  private initializeDefaultPOIs(): void {
    const existingPOIs = storageService.get<PointOfInterest[]>('pointsOfInterest');
    
    if (!existingPOIs || existingPOIs.length === 0) {
      const defaultPOIs: PointOfInterest[] = [
        {
          id: this.generateId(),
          name: 'Estación de Carga Usaquén',
          description: 'Estación de carga rápida para vehículos eléctricos',
          type: 'charging_station',
          location: { lat: 4.7010, lng: -74.0304, address: 'Calle 120 #7-20, Usaquén' },
          icon: '⚡',
          rating: 4.5,
          reviewCount: 23,
          isVerified: true,
          createdBy: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          name: 'Taller Motos Eléctricas Chapinero',
          description: 'Reparación y mantenimiento especializado',
          type: 'repair_shop',
          location: { lat: 4.6333, lng: -74.0640, address: 'Carrera 13 #57-30, Chapinero' },
          icon: '🔧',
          rating: 4.8,
          reviewCount: 45,
          isVerified: true,
          createdBy: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          name: 'Parqueadero Seguro Centro',
          description: 'Parqueadero con vigilancia 24/7',
          type: 'parking',
          location: { lat: 4.5981, lng: -74.0758, address: 'Calle 19 #5-14, Centro' },
          icon: '🅿️',
          rating: 4.2,
          reviewCount: 78,
          isVerified: true,
          createdBy: 'admin',
          createdAt: new Date().toISOString()
        }
      ];

      storageService.set('pointsOfInterest', defaultPOIs);
    }
  }

  private generateId(): string {
    return 'map_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const mapService = MapService.getInstance();
