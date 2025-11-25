import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MapPin, 
  Star,
  Users,
  Search,
  Plus,
  Camera,
  MoreHorizontal,
  Clock,
  Navigation,
  UserPlus
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SocialViewProps {
  user: any;
  onViewChange: (view: string) => void;
}

export function SocialView({ user, onViewChange }: SocialViewProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'users' | 'routes'>('feed');
  const [newPostText, setNewPostText] = useState('');

  const posts = [
    {
      id: 1,
      user: {
        name: 'María González',
        username: '@maria_rides',
        avatar: 'MG',
        verified: true,
        vehicle: 'scooter'
      },
      content: '¡Increíble ruta por la Zona Rosa! Las ciclorrutas están perfectas hoy 🛴✨',
      image: 'https://images.unsplash.com/photo-1713254249770-7e9a688064d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBjaXR5fGVufDF8fHx8MTc1ODU4MTU1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      route: {
        from: 'Centro',
        to: 'Zona Rosa',
        distance: '8.5 km',
        time: '25 min'
      },
      likes: 47,
      comments: 12,
      shares: 5,
      timestamp: '2h',
      liked: false
    },
    {
      id: 2,
      user: {
        name: 'Carlos Mendoza',
        username: '@carlos_ebike',
        avatar: 'CM',
        verified: false,
        vehicle: 'bicycle'
      },
      content: 'Nuevo accesorio para mi bici eléctrica. ¡Las luces LED hacen toda la diferencia!',
      image: 'https://images.unsplash.com/photo-1637879197757-0deb020b0d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwbGlnaHRzJTIwbGVkfGVufDF8fHx8MTc1ODY0NTg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      likes: 23,
      comments: 8,
      shares: 2,
      timestamp: '4h',
      liked: true
    },
    {
      id: 3,
      user: {
        name: 'Ana Rodríguez',
        username: '@ana_moto',
        avatar: 'AR',
        verified: true,
        vehicle: 'motorcycle'
      },
      content: 'Compartiendo mi ruta favorita para llegar a la Universidad Nacional. ¡Evita el tráfico!',
      route: {
        from: 'Chapinero',
        to: 'Universidad Nacional',
        distance: '12.3 km',
        time: '35 min'
      },
      likes: 89,
      comments: 24,
      shares: 15,
      timestamp: '6h',
      liked: false
    }
  ];

  const suggestedUsers = [
    {
      id: 1,
      name: 'Diego Silva',
      username: '@diego_rides',
      avatar: 'DS',
      vehicle: 'scooter',
      followers: 234,
      mutual: 5,
      following: false
    },
    {
      id: 2,
      name: 'Lucia Torres',
      username: '@lucia_ebike',
      avatar: 'LT',
      vehicle: 'bicycle',
      followers: 156,
      mutual: 3,
      following: false
    },
    {
      id: 3,
      name: 'Roberto Kim',
      username: '@robert_moto',
      avatar: 'RK',
      vehicle: 'motorcycle',
      followers: 445,
      mutual: 8,
      following: false
    }
  ];

  const popularRoutes = [
    {
      id: 1,
      name: 'Centro → Zona Rosa Express',
      creator: 'María González',
      rating: 4.9,
      users: 156,
      distance: '8.5 km',
      saved: false
    },
    {
      id: 2,
      name: 'Chapinero → UniNacional',
      creator: 'Ana Rodríguez',
      rating: 4.7,
      users: 89,
      distance: '12.3 km',
      saved: true
    },
    {
      id: 3,
      name: 'Suba → Centro Comercial',
      creator: 'Carlos Mendoza',
      rating: 4.6,
      users: 234,
      distance: '15.2 km',
      saved: false
    }
  ];

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case 'scooter': return '🛴';
      case 'bicycle': return '🚲';
      case 'motorcycle': return '🏍️';
      default: return '🚲';
    }
  };

  const handleLike = (postId: number) => {
    // Aquí iría la lógica para dar like
    console.log('Like post:', postId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comunidad Rola PET</h1>
          <p className="text-gray-600">Conecta, comparte y descubre con otros usuarios</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'feed'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Feed
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'users'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'routes'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Rutas Populares
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* New Post */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          placeholder="¿Qué quieres compartir con la comunidad?"
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          className="mb-3"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Camera className="w-4 h-4 mr-2" />
                              Foto
                            </Button>
                            <Button variant="outline" size="sm">
                              <MapPin className="w-4 h-4 mr-2" />
                              Ruta
                            </Button>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Publicar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{post.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{post.user.name}</h3>
                              {post.user.verified && (
                                <Badge variant="outline" className="text-xs">✓</Badge>
                              )}
                              <span className="text-lg">{getVehicleIcon(post.user.vehicle)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{post.user.username}</span>
                              <span>•</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <p className="mb-3">{post.content}</p>

                      {/* Route Info */}
                      {post.route && (
                        <div className="bg-green-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Navigation className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-700">
                              {post.route.from} → {post.route.to}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-green-600">
                            <span>{post.route.distance}</span>
                            <span>{post.route.time}</span>
                          </div>
                        </div>
                      )}

                      {/* Post Image */}
                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={post.image}
                            alt="Post image"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 ${
                              post.liked ? 'text-red-500' : 'text-gray-600'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600">
                            <Share2 className="w-5 h-5" />
                            <span>{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedUsers.map((suggestedUser) => (
                    <Card key={suggestedUser.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback>{suggestedUser.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{suggestedUser.name}</h3>
                              <span>{getVehicleIcon(suggestedUser.vehicle)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{suggestedUser.username}</p>
                            <p className="text-xs text-gray-500">
                              {suggestedUser.followers} seguidores • {suggestedUser.mutual} amigos en común
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Seguir
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="space-y-4">
                {popularRoutes.map((route) => (
                  <Card key={route.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{route.name}</h3>
                          <p className="text-sm text-gray-600">Creada por {route.creator}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{route.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{route.users} usuarios</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{route.distance}</Badge>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            {route.saved ? 'Guardada' : 'Guardar'}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onViewChange('map')}
                          >
                            Ver Ruta
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tu Actividad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">127</p>
                  <p className="text-sm text-gray-600">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">89</p>
                  <p className="text-sm text-gray-600">Siguiendo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">24</p>
                  <p className="text-sm text-gray-600">Publicaciones</p>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#ZonaRosaRoute</span>
                    <Badge variant="outline">156 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#ElectricBike</span>
                    <Badge variant="outline">89 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#BogotaMobility</span>
                    <Badge variant="outline">234 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#SafeRiding</span>
                    <Badge variant="outline">67 posts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grupos Sugeridos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Scooteros Bogotá</p>
                      <p className="text-xs text-gray-600">1,247 miembros</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Unirse
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Bici Eléctrica CO</p>
                      <p className="text-xs text-gray-600">856 miembros</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Unirse
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Moto Eléctrica</p>
                      <p className="text-xs text-gray-600">542 miembros</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Unirse
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}