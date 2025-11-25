import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  ShoppingBag, 
  Users, 
  Star, 
  TrendingUp, 
  Battery, 
  Clock, 
  Navigation,
  Award,
  Heart,
  Shield,
  Info
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  user: any;
  onViewChange: (view: string) => void;
}

export function Dashboard({ user, onViewChange }: DashboardProps) {
  // Verificar si el usuario es administrador
  const isAdmin = user?.email === 'admin@rolapet.com' || user?.role === 'admin';
  const stats = [
    {
      title: 'Rutas Completadas',
      value: '24',
      change: '+3 esta semana',
      icon: Navigation,
      color: 'text-green-600'
    },
    {
      title: 'Km Recorridos',
      value: '127.5',
      change: '+12.3 km esta semana',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Calificación Promedio',
      value: '4.8',
      change: 'Excelente conductor',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Puntos Rola PET',
      value: '850',
      change: '+50 puntos nuevos',
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const recentRoutes = [
    {
      id: 1,
      name: 'Centro → Zona Rosa',
      distance: '8.5 km',
      time: '25 min',
      rating: 4.9,
      date: 'Hoy'
    },
    {
      id: 2,
      name: 'Chapinero → Universidad Nacional',
      distance: '12.3 km',
      time: '35 min',
      rating: 4.7,
      date: 'Ayer'
    },
    {
      id: 3,
      name: 'Suba → Centro',
      distance: '15.2 km',
      time: '42 min',
      rating: 4.8,
      date: '2 días'
    }
  ];

  const quickActions = [
    {
      title: 'Nueva Ruta',
      description: 'Planifica tu próximo viaje',
      icon: MapPin,
      action: () => onViewChange('map'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      title: 'Marketplace',
      description: 'Explora productos',
      icon: ShoppingBag,
      action: () => onViewChange('marketplace'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      title: 'Comunidad',
      description: 'Conecta con otros',
      icon: Users,
      action: () => onViewChange('social'),
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información',
      icon: Users,
      action: () => onViewChange('profile'),
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                ¡Hola, {user?.firstName}! 👋
              </h1>
              <p className="text-green-100 mt-2">
                Bienvenido de vuelta a Rola PET. Tu vehículo principal: {user?.vehicleType}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Battery className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Access Alert */}
        {isAdmin && (
          <Alert className="border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <span>Tienes permisos de administrador. Accede al panel de control para gestionar la plataforma.</span>
                <Button 
                  size="sm" 
                  onClick={() => onViewChange('admin')}
                  className="ml-4 bg-orange-600 hover:bg-orange-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Panel Admin
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Access Info */}
        {!isAdmin && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Demo:</strong> Para acceder al panel de administración, inicia sesión con el email "admin@rolapet.com" y cualquier contraseña.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-auto p-4 justify-start ${action.color}`}
                        onClick={action.action}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <Icon className="w-6 h-6" />
                          <div className="text-left">
                            <p className="font-medium">{action.title}</p>
                            <p className="text-xs opacity-70">{action.description}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Routes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Rutas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRoutes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{route.distance}</span>
                            <span>{route.time}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{route.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{route.date}</Badge>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onViewChange('map')}
                  >
                    Ver Todas las Rutas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Comunidad</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">1,247 usuarios activos</p>
                      <p className="text-xs text-gray-600">Esta semana</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">347 rutas nuevas</p>
                      <p className="text-xs text-gray-600">Compartidas hoy</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onViewChange('social')}
                  >
                    Explorar Comunidad
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Products */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Destacados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1617134380746-5f313a64a6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU4NjQ1NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Casco premium"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="font-medium text-sm">Casco Premium LED</p>
                    <p className="text-green-600 font-bold">$89.000</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onViewChange('marketplace')}
                  >
                    Ver Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Info */}
            <Card>
              <CardHeader>
                <CardTitle>Condiciones del Clima</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">☀️</div>
                  <p className="font-medium">22°C</p>
                  <p className="text-sm text-gray-600">Perfecto para salir</p>
                  <Badge className="mt-2 bg-green-100 text-green-700">
                    Condiciones ideales
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}