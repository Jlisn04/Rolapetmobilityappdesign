import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User, 
  Settings, 
  Star, 
  MapPin, 
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  Award,
  TrendingUp,
  Shield,
  Heart
} from 'lucide-react';

interface UserProfileProps {
  user: any;
  onViewChange: (view: string) => void;
}

export function UserProfile({ user, onViewChange }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'settings'>('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+57 300 123 4567',
    vehicleType: user?.vehicleType || 'scooter',
    bio: 'Amante de la movilidad sostenible en Bogotá 🚲⚡',
    location: 'Bogotá, Colombia',
    membershipNumber: user?.membershipNumber || 'RP2024001'
  });

  const stats = [
    { label: 'Rutas Completadas', value: '127', icon: MapPin, color: 'text-green-600' },
    { label: 'Km Recorridos', value: '1,247', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Calificación', value: '4.9', icon: Star, color: 'text-yellow-600' },
    { label: 'Puntos Rola PET', value: '2,850', icon: Award, color: 'text-purple-600' }
  ];

  const achievements = [
    {
      id: 1,
      name: 'Explorador Urbano',
      description: 'Completó 100 rutas diferentes',
      icon: '🗺️',
      earned: true,
      date: '15 Ene 2024'
    },
    {
      id: 2,
      name: 'Eco Warrior',
      description: 'Recorrió 1000 km en vehículo eléctrico',
      icon: '🌱',
      earned: true,
      date: '22 Dic 2023'
    },
    {
      id: 3,
      name: 'Conductor Estrella',
      description: 'Mantuvo calificación 4.8+ por 6 meses',
      icon: '⭐',
      earned: true,
      date: '08 Nov 2023'
    },
    {
      id: 4,
      name: 'Embajador Rola PET',
      description: 'Invitó a 10 nuevos usuarios',
      icon: '👥',
      earned: false,
      progress: '7/10'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'route',
      description: 'Completó la ruta Centro → Zona Rosa',
      time: '2h ago',
      rating: 4.9
    },
    {
      id: 2,
      type: 'review',
      description: 'Calificó la ruta Chapinero → UniNacional',
      time: '1d ago',
      rating: 4.7
    },
    {
      id: 3,
      type: 'achievement',
      description: 'Desbloqueó logro "Conductor Estrella"',
      time: '3d ago'
    },
    {
      id: 4,
      type: 'social',
      description: 'Se unió al grupo "Scooteros Bogotá"',
      time: '1w ago'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    setIsEditing(false);
  };

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case 'scooter': return '🛴';
      case 'bicycle': return '🚲';
      case 'motorcycle': return '🏍️';
      default: return '🚲';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'route': return <MapPin className="w-4 h-4 text-green-600" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'achievement': return <Award className="w-4 h-4 text-purple-600" />;
      case 'social': return <Heart className="w-4 h-4 text-red-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información y revisa tu actividad</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'activity'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Actividad
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'settings'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configuración
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarFallback className="text-2xl">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-bold mb-1">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-600 mb-2">@{formData.firstName.toLowerCase()}_rides</p>
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="text-2xl">{getVehicleIcon(formData.vehicleType)}</span>
                  <Badge className="bg-green-100 text-green-700">
                    Miembro {formData.membershipNumber}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{formData.bio}</p>
                
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Miembro desde Nov 2023</span>
                </div>

                {!isEditing ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Edit Form */}
                {isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Editar Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vehicleType">Vehículo Principal</Label>
                        <Select onValueChange={(value) => handleInputChange('vehicleType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={formData.vehicleType} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scooter">Scooter Eléctrico</SelectItem>
                            <SelectItem value="bicycle">Bicicleta Eléctrica</SelectItem>
                            <SelectItem value="motorcycle">Moto Eléctrica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Input
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Cuéntanos sobre ti..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Logros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-lg border-2 ${
                            achievement.earned
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                              {achievement.icon}
                            </span>
                            <div className="flex-1">
                              <h3 className={`font-medium ${achievement.earned ? 'text-green-700' : 'text-gray-600'}`}>
                                {achievement.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {achievement.description}
                              </p>
                              {achievement.earned ? (
                                <Badge className="bg-green-100 text-green-700">
                                  Desbloqueado • {achievement.date}
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  Progreso: {achievement.progress}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {activity.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{activity.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de Notificaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notificaciones push</h3>
                        <p className="text-sm text-gray-600">Recibe alertas importantes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Alertas de rutas</h3>
                        <p className="text-sm text-gray-600">Notificaciones sobre nuevas rutas</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Actividad social</h3>
                        <p className="text-sm text-gray-600">Likes, comentarios y menciones</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Perfil público</h3>
                        <p className="text-sm text-gray-600">Permite que otros te encuentren</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mostrar ubicación</h3>
                        <p className="text-sm text-gray-600">Comparte tu ubicación en el mapa</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Historial de rutas visible</h3>
                        <p className="text-sm text-gray-600">Otros pueden ver tus rutas</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Cambiar Contraseña
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Autenticación de dos factores
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                      <X className="w-4 h-4 mr-2" />
                      Eliminar Cuenta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}