import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Heart,
  Grid,
  List,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MarketplaceProps {
  onViewChange: (view: string) => void;
}

export function Marketplace({ onViewChange }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const categories = [
    { id: 'all', name: 'Todos', count: 124 },
    { id: 'helmets', name: 'Cascos', count: 28 },
    { id: 'lights', name: 'Luces', count: 19 },
    { id: 'accessories', name: 'Accesorios', count: 45 },
    { id: 'parts', name: 'Repuestos', count: 32 }
  ];

  const products = [
    {
      id: 1,
      name: 'Casco LED Premium Pro',
      description: 'Casco con luces LED integradas y bluetooth',
      price: 189000,
      originalPrice: 220000,
      rating: 4.8,
      reviews: 156,
      category: 'helmets',
      seller: 'TechMobility',
      verified: true,
      image: 'https://images.unsplash.com/photo-1700705581244-f28d6bdd1936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGJpa2UlMjBoZWxtZXR8ZW58MXx8fHwxNzU4NjQ1ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: 'Set de Luces LED Recargables',
      description: 'Luces delanteras y traseras con 5 modos',
      price: 85000,
      originalPrice: null,
      rating: 4.6,
      reviews: 89,
      category: 'lights',
      seller: 'BikeTech',
      verified: true,
      image: 'https://images.unsplash.com/photo-1637879197757-0deb020b0d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwbGlnaHRzJTIwbGVkfGVufDF8fHx8MTc1ODY0NTg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      inStock: true,
      featured: false
    },
    {
      id: 3,
      name: 'Batería de Repuesto 48V',
      description: 'Batería de litio de alta capacidad',
      price: 450000,
      originalPrice: null,
      rating: 4.9,
      reviews: 234,
      category: 'parts',
      seller: 'PowerBike',
      verified: true,
      image: 'https://images.unsplash.com/photo-1651952636868-7ff9928549dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBwYXJ0c3xlbnwxfHx8fDE3NTg2NDU4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      inStock: true,
      featured: true
    },
    {
      id: 4,
      name: 'Candado Inteligente U-Lock',
      description: 'Candado con apertura por app y GPS',
      price: 125000,
      originalPrice: 150000,
      rating: 4.4,
      reviews: 67,
      category: 'accessories',
      seller: 'SecureBike',
      verified: false,
      image: 'https://images.unsplash.com/photo-1584131688247-27fe529d6717?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwbG9jayUyMHNlY3VyaXR5fGVufDF8fHx8MTc1ODY0NTg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      inStock: false,
      featured: false
    },
    {
      id: 5,
      name: 'Guantes Táctiles Impermeables',
      description: 'Guantes con refuerzo y compatibilidad táctil',
      price: 45000,
      originalPrice: null,
      rating: 4.7,
      reviews: 123,
      category: 'accessories',
      seller: 'RideGear',
      verified: true,
      image: 'https://images.unsplash.com/photo-1617134380746-5f313a64a6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU4NjQ1NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: 'Reflectores LED Inalámbricos',
      description: 'Set de 4 reflectores con control remoto',
      price: 65000,
      originalPrice: 80000,
      rating: 4.5,
      reviews: 91,
      category: 'lights',
      seller: 'SafeRide',
      verified: true,
      image: 'https://images.unsplash.com/photo-1637879197757-0deb020b0d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwbGlnaHRzJTIwbGVkfGVufDF8fHx8MTc1ODY0NTg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      inStock: true,
      featured: false
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600">Encuentra todo para tu vehículo eléctrico</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Carrito
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
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
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorías</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Precio</label>
                  <div className="space-y-2">
                    <Input placeholder="Mín" type="number" />
                    <Input placeholder="Máx" type="number" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Calificación</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <div className="flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                          <span className="ml-1 text-sm">y más</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Solo en stock</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Vendedores verificados</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} productos encontrados
              </p>
              <div className="flex items-center space-x-4">
                <select className="border rounded-lg px-3 py-2">
                  <option>Más relevantes</option>
                  <option>Precio: menor a mayor</option>
                  <option>Precio: mayor a menor</option>
                  <option>Mejor calificados</option>
                  <option>Más vendidos</option>
                </select>
                <div className="flex rounded-lg border">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <Card key={product.id} className={`overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'} relative`}>
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Destacado
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="outline" className="bg-white">
                          Agotado
                        </Badge>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium line-clamp-2">{product.name}</h3>
                        {product.verified && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Vendido por {product.seller}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                        
                        {product.inStock && (
                          <div className="flex items-center space-x-2">
                            {cart[product.id] ? (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(product.id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center">{cart[product.id]}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addToCart(product.id)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Agregar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}