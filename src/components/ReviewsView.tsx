import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { 
  Star, 
  MapPin, 
  ThumbsUp, 
  MessageCircle,
  Filter,
  Search,
  Plus,
  Navigation,
  Clock,
  TrendingUp
} from 'lucide-react';

interface ReviewsViewProps {
  onViewChange: (view: string) => void;
}

export function ReviewsView({ onViewChange }: ReviewsViewProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-reviews' | 'write'>('browse');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const reviews = [
    {
      id: 1,
      user: {
        name: 'María González',
        avatar: 'MG',
        verified: true
      },
      type: 'route',
      subject: 'Centro → Zona Rosa Express',
      rating: 5,
      title: 'Excelente ruta para principiantes',
      content: 'Perfecta para quienes se inician en el mundo de los scooters eléctricos. La cicloruta está bien señalizada y tiene muy poco tráfico. El tiempo estimado es muy preciso.',
      helpful: 23,
      comments: 5,
      date: '2 días ago',
      tags: ['Principiante', 'Seguro', 'Rápido']
    },
    {
      id: 2,
      user: {
        name: 'Carlos Mendoza',
        avatar: 'CM',
        verified: false
      },
      type: 'service',
      subject: 'Estación de Carga - Centro Comercial',
      rating: 4,
      title: 'Buena ubicación pero muy congestionada',
      content: 'La estación funciona bien y la carga es rápida, pero siempre hay cola especialmente en las horas pico. Recomiendo ir temprano en la mañana.',
      helpful: 15,
      comments: 8,
      date: '1 semana ago',
      tags: ['Carga Rápida', 'Congestionado']
    },
    {
      id: 3,
      user: {
        name: 'Ana Rodríguez',
        avatar: 'AR',
        verified: true
      },
      type: 'route',
      subject: 'Chapinero → Universidad Nacional',
      rating: 5,
      title: 'La mejor ruta para estudiantes',
      content: 'Como estudiante que hace este recorrido diariamente, puedo confirmar que es la ruta más eficiente. Evita el tráfico de la 26 y tiene varias opciones de estacionamiento seguro.',
      helpful: 41,
      comments: 12,
      date: '3 días ago',
      tags: ['Estudiantes', 'Diario', 'Eficiente']
    },
    {
      id: 4,
      user: {
        name: 'Diego Silva',
        avatar: 'DS',
        verified: false
      },
      type: 'service',
      subject: 'Taller ElectroMobility',
      rating: 3,
      title: 'Servicio regular, precios altos',
      content: 'El servicio técnico es competente pero los precios son bastante elevados comparado con otros talleres. La atención al cliente podría mejorar.',
      helpful: 8,
      comments: 3,
      date: '5 días ago',
      tags: ['Caro', 'Servicio Técnico']
    }
  ];

  const myReviews = [
    {
      id: 1,
      subject: 'Suba → Centro Express',
      rating: 4,
      title: 'Buena ruta pero con algunos desafíos',
      date: '1 semana ago',
      helpful: 12,
      comments: 4
    },
    {
      id: 2,
      subject: 'Estación PowerBike Norte',
      rating: 5,
      title: 'Excelente servicio y atención',
      date: '2 semanas ago',
      helpful: 8,
      comments: 2
    }
  ];

  const topRoutes = [
    { name: 'Centro → Zona Rosa', rating: 4.9, reviews: 234 },
    { name: 'Chapinero → UniNacional', rating: 4.8, reviews: 189 },
    { name: 'Suba → Centro', rating: 4.6, reviews: 156 },
    { name: 'Usaquén → Zona T', rating: 4.7, reviews: 98 }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === null || review.rating >= filterRating;
    const matchesSearch = searchQuery === '' || 
      review.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(i + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calificaciones y Reseñas</h1>
          <p className="text-gray-600">Comparte tu experiencia y descubre las mejores rutas y servicios</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'browse'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Explorar Reseñas
            </button>
            <button
              onClick={() => setActiveTab('my-reviews')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'my-reviews'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Mis Reseñas
            </button>
            <button
              onClick={() => setActiveTab('write')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'write'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Escribir Reseña
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar reseñas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Calificación mínima</Label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                          className={`w-full flex items-center space-x-2 p-2 rounded transition-colors ${
                            filterRating === rating ? 'bg-green-100' : 'hover:bg-gray-100'
                          }`}
                        >
                          {renderStars(rating)}
                          <span className="text-sm">y más</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Tipo</Label>
                    <div className="space-y-2">
                      <button className="w-full text-left p-2 rounded hover:bg-gray-100">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Rutas
                      </button>
                      <button className="w-full text-left p-2 rounded hover:bg-gray-100">
                        <Navigation className="w-4 h-4 inline mr-2" />
                        Servicios
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Rated Routes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rutas Mejor Calificadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topRoutes.map((route, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{route.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{route.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{route.reviews} reseñas</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'browse' && (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {filteredReviews.length} reseñas encontradas
                  </p>
                  <select className="border rounded-lg px-3 py-2">
                    <option>Más recientes</option>
                    <option>Mejor calificadas</option>
                    <option>Más útiles</option>
                  </select>
                </div>

                {/* Reviews List */}
                {filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{review.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{review.user.name}</h3>
                              {review.user.verified && (
                                <Badge variant="outline" className="text-xs">✓</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{review.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={
                          review.type === 'route' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }>
                          {review.type === 'route' ? 'Ruta' : 'Servicio'}
                        </Badge>
                        <h4 className="font-medium">{review.subject}</h4>
                      </div>

                      {/* Review Content */}
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-gray-700 mb-4">{review.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-6 pt-4 border-t">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">Útil ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Comentarios ({review.comments})</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'my-reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Mis Reseñas</h2>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab('write')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Reseña
                  </Button>
                </div>

                {myReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{review.subject}</h3>
                          <p className="text-sm text-gray-600">{review.date}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      <h4 className="font-medium mb-3">{review.title}</h4>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>{review.helpful} personas lo encontraron útil</span>
                        <span>{review.comments} comentarios</span>
                      </div>
                      
                      <div className="mt-4 space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'write' && (
              <Card>
                <CardHeader>
                  <CardTitle>Escribir Nueva Reseña</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tipo de reseña</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="reviewType" value="route" defaultChecked />
                        <span>Ruta</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="reviewType" value="service" />
                        <span>Servicio</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Ruta o Servicio</Label>
                    <Input
                      id="subject"
                      placeholder="Ej: Centro → Zona Rosa Express"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Calificación</Label>
                    {renderStars(0, true, (rating) => console.log('Rating:', rating))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la reseña</Label>
                    <Input
                      id="title"
                      placeholder="Resume tu experiencia en pocas palabras"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review">Tu reseña</Label>
                    <Textarea
                      id="review"
                      placeholder="Comparte los detalles de tu experiencia. ¿Qué te gustó? ¿Qué se podría mejorar?"
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Etiquetas (opcional)</Label>
                    <Input
                      id="tags"
                      placeholder="Ej: Rápido, Seguro, Principiante (separadas por comas)"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Publicar Reseña
                    </Button>
                    <Button variant="outline">
                      Guardar Borrador
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}