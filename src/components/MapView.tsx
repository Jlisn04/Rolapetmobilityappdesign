import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Navigation, 
  MapPin, 
  Users, 
  Clock, 
  Zap, 
  Route,
  Star,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MapViewProps {
  onViewChange: (view: string) => void;
}

export function MapView({ onViewChange }: MapViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const mapPoints = [
    {
      id: 1,
      name: 'Centro Comercial Andino',
      type: 'commercial',
      coordinates: { lat: 4.6698, lng: -74.0541 },
      users: 3,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Universidad Nacional',
      type: 'education',
      coordinates: { lat: 4.6359, lng: -74.0834 },
      users: 7,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Parque de la 93',
      type: 'park',
      coordinates: { lat: 4.6765, lng: -74.0495 },
      users: 2,
      rating: 4.6
    },
    {
      id: 4,
      name: 'Terminal TransMilenio',
      type: 'transport',
      coordinates: { lat: 4.6486, lng: -74.0676 },
      users: 12,
      rating: 4.2
    }
  ];

  const suggestedRoutes = [
    {
      id: 1,
      from: 'Centro',
      to: 'Zona Rosa',
      distance: '8.5 km',
      time: '25 min',
      difficulty: 'Fácil',
      rating: 4.9,
      users: 156,
      bikelanePct: 85
    },
    {
      id: 2,
      from: 'Chapinero',
      to: 'Universidad Nacional',
      distance: '12.3 km',
      time: '35 min',
      difficulty: 'Moderado',
      rating: 4.7,
      users: 89,
      bikelanePct: 70
    },
    {
      id: 3,
      from: 'Suba',
      to: 'Centro',
      distance: '15.2 km',
      time: '42 min',
      difficulty: 'Difícil',
      rating: 4.4,
      users: 234,
      bikelanePct: 60
    }
  ];

  const activeUsers = [
    {
      id: 1,
      name: 'Carlos M.',
      vehicle: 'scooter',
      location: 'Zona Rosa',
      online: true
    },
    {
      id: 2,
      name: 'Ana S.',
      vehicle: 'bicycle',
      location: 'Chapinero',
      online: true
    },
    {
      id: 3,
      name: 'Miguel R.',
      vehicle: 'motorcycle',
      location: 'Centro',
      online: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-700';
      case 'Moderado': return 'bg-yellow-100 text-yellow-700';
      case 'Difícil': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case 'scooter': return '🛴';
      case 'bicycle': return '🚲';
      case 'motorcycle': return '🏍️';
      default: return '🚲';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa y Rutas</h1>
          <p className="text-gray-600">Descubre las mejores rutas por Bogotá</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar lugares..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
                {showFilters && (
                  <div className="mt-3 space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Ciclorrutas
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Comercios
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Estaciones de carga
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Routes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rutas Sugeridas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {suggestedRoutes.map((route) => (
                  <div 
                    key={route.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoute?.id === route.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{route.from} → {route.to}</p>
                      <Badge className={getDifficultyColor(route.difficulty)}>
                        {route.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>{route.distance}</span>
                      <span>{route.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{route.rating}</span>
                      </div>
                      <span>{route.users} usuarios</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Ciclorrutas</span>
                        <span>{route.bikelanePct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full" 
                          style={{ width: `${route.bikelanePct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Usuarios Activos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getVehicleIcon(user.vehicle)}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.location}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Seguir
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onViewChange('social')}
                >
                  Ver Todos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                {/* Simulated Map */}
                <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MapPin className="w-16 h-16 text-green-600 mx-auto" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Mapa Interactivo de Bogotá</h3>
                        <p className="text-gray-600">Aquí se mostraría el mapa con:</p>
                        <ul className="text-sm text-gray-500 mt-2 space-y-1">
                          <li>• Ciclorrutas disponibles</li>
                          <li>• Ubicación de usuarios activos</li>
                          <li>• Puntos de interés y comercios</li>
                          <li>• Estaciones de carga</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Map Points Simulation */}
                  {mapPoints.map((point) => (
                    <div
                      key={point.id}
                      className="absolute w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transform hover:scale-110 transition-transform"
                      style={{
                        left: `${20 + (point.id * 15)}%`,
                        top: `${30 + (point.id * 10)}%`
                      }}
                    >
                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600 font-bold">RP</span>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                        {point.name}
                      </div>
                    </div>
                  ))}

                  {/* Route Line Simulation */}
                  {selectedRoute && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full">
                        <path
                          d="M 100 200 Q 200 100 400 300"
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="8,4"
                          className="animate-pulse"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" className="bg-white text-gray-700 shadow-lg">
                    <Navigation className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-white text-gray-700 shadow-lg">
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>

                {/* Route Info Panel */}
                {selectedRoute && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{selectedRoute.from} → {selectedRoute.to}</h3>
                      <Button size="sm" className="bg-green-600 text-white">
                        <Route className="w-4 h-4 mr-2" />
                        Iniciar Ruta
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Distancia</p>
                        <p className="font-medium">{selectedRoute.distance}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Tiempo Est.</p>
                        <p className="font-medium">{selectedRoute.time}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Calificación</p>
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{selectedRoute.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}