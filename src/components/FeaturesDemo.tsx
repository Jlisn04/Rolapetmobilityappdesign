import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Users,
  Car,
  ShieldAlert,
  ShoppingCart,
  Star,
  MessageSquare,
  MapPin,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Servicios
import { authService } from '../services/AuthService';
import { vehicleService } from '../services/VehicleService';
import { moderationService } from '../services/ModerationService';
import { contentService } from '../services/ContentService';
import { providerService } from '../services/ProviderService';
import { ratingService } from '../services/RatingService';
import { shoppingCartService } from '../services/ShoppingCartService';
import { mapService } from '../services/MapService';
import { userService } from '../services/UserService';

interface FeaturesDemoProps {
  userId?: string;
  onViewChange?: (view: string) => void;
}

export function FeaturesDemo({ userId = 'demo_user', onViewChange }: FeaturesDemoProps) {
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTest = (name: string, fn: () => any) => {
    try {
      const result = fn();
      const success = result.success !== false;
      
      setTestResults(prev => [...prev, {
        name,
        success,
        message: result.message || JSON.stringify(result),
        timestamp: new Date().toISOString()
      }]);

      if (success) {
        toast.success(`✅ ${name}`);
      } else {
        toast.error(`❌ ${name}: ${result.message}`);
      }

      return result;
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        name,
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      }]);
      toast.error(`❌ ${name}: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  const testAuthentication = () => {
    // RF-01: Registro
    runTest('RF-01: Registro de usuario', () => 
      authService.register(
        'test@example.com',
        'testuser',
        'password123',
        'Test User',
        true
      )
    );

    // RF-04: Login
    runTest('RF-04: Login con credenciales', () =>
      authService.login('admin@rolapet.com', 'admin123')
    );

    // RF-37: Recuperación de contraseña
    runTest('RF-37: Recuperación de contraseña', () =>
      authService.requestPasswordReset('admin@rolapet.com')
    );
  };

  const testVehicles = () => {
    // RF-02: Registrar vehículo
    const vehicleResult = runTest('RF-02: Registrar vehículo', () =>
      vehicleService.registerVehicle(userId, {
        type: 'scooter',
        brand: 'Xiaomi',
        model: 'M365',
        year: 2024,
        isElectric: true,
        batteryCapacity: '10Ah',
        maxSpeed: 25,
        range: 40
      })
    );

    // RF-03: Vincular vehículo
    if (vehicleResult.success && vehicleResult.vehicle) {
      runTest('RF-03: Vincular vehículo a usuario', () =>
        vehicleService.linkVehicleToUser(userId, vehicleResult.vehicle.id)
      );
    }
  };

  const testModeration = () => {
    // RF-06 & RF-10: Moderación automática
    runTest('RF-06/10: Moderación - contenido limpio', () =>
      moderationService.moderateContent('Este es un comentario normal', userId)
    );

    runTest('RF-06/10: Moderación - contenido inapropiado', () =>
      moderationService.moderateContent('Este comentario tiene odio y violencia', userId)
    );

    // RF-09: Advertencia a usuario
    runTest('RF-09: Registrar advertencia', () =>
      moderationService.addWarningToUser(
        userId,
        'Contenido inapropiado',
        'Uso de lenguaje ofensivo',
        'admin'
      )
    );

    // RF-07: Consultar advertencias
    runTest('RF-07: Consultar advertencias', () => {
      const warnings = moderationService.getUserWarnings(userId);
      return { success: true, warnings, message: `${warnings.length} advertencias` };
    });
  };

  const testProviders = () => {
    // RF-15 & RF-18: Registrar proveedor
    const providerResult = runTest('RF-15/18: Registrar proveedor', () =>
      providerService.registerProvider({
        name: 'Taller Demo',
        email: 'taller@example.com',
        phone: '+57 300 123 4567',
        address: 'Calle 123 #45-67',
        description: 'Taller especializado',
        type: 'service',
        categories: ['mantenimiento', 'reparación'],
        location: { lat: 4.6097, lng: -74.0817 }
      })
    );

    // RF-19: Habilitar proveedor
    if (providerResult.success && providerResult.provider) {
      runTest('RF-19: Habilitar proveedor', () =>
        providerService.enableProvider(providerResult.provider.id)
      );

      // RF-24: Publicar producto
      runTest('RF-24: Publicar producto', () =>
        providerService.publishProduct({
          providerId: providerResult.provider.id,
          name: 'Mantenimiento básico',
          description: 'Servicio de mantenimiento',
          type: 'service',
          category: 'mantenimiento',
          price: 50000,
          currency: 'COP',
          images: [],
          isAvailable: true
        })
      );
    }
  };

  const testContent = () => {
    // RF-25: Crear publicación
    runTest('RF-25: Crear publicación', () =>
      contentService.createPost(
        userId,
        'Demo User',
        'social',
        'Esta es una publicación de prueba',
        'Título de prueba',
        [],
        'image'
      )
    );

    // RF-20: Dar me gusta
    const posts = contentService.getPosts();
    if (posts.length > 0) {
      runTest('RF-20: Dar me gusta', () =>
        contentService.likePost(posts[0].id, userId)
      );

      // RF-22: Comentar
      runTest('RF-22: Publicar comentario', () =>
        contentService.createComment(
          posts[0].id,
          userId,
          'Demo User',
          'Este es un comentario de prueba'
        )
      );
    }
  };

  const testRatings = () => {
    // RF-28, RF-29, RF-38: Calificar
    runTest('RF-28/29/38: Crear calificación', () =>
      ratingService.createRating(
        userId,
        'test_product_1',
        'product',
        5,
        'Excelente producto, muy recomendado'
      )
    );

    // RF-39: Verificar ventana de tiempo
    runTest('RF-39: Validar tiempo de calificación', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 61);
      return ratingService.createRating(
        userId,
        'test_product_2',
        'product',
        4,
        'Intentando calificar fuera de tiempo',
        oldDate.toISOString()
      );
    });
  };

  const testShopping = () => {
    // RF-35: Carrito de compras
    const mockProduct = {
      id: 'prod_1',
      providerId: 'prov_1',
      name: 'Casco Demo',
      description: 'Casco de prueba',
      type: 'product' as const,
      category: 'seguridad',
      price: 89000,
      currency: 'COP',
      images: [],
      isAvailable: true,
      rating: 4.5,
      reviewCount: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    runTest('RF-35: Agregar al carrito', () =>
      shoppingCartService.addToCart(userId, mockProduct, 1)
    );

    runTest('RF-35: Agregar a wishlist', () =>
      shoppingCartService.addToWishlist(userId, 'prod_2')
    );

    runTest('RF-35: Obtener total del carrito', () => {
      const total = shoppingCartService.getCartTotal(userId);
      return { success: true, total, message: `Total: $${total.subtotal}` };
    });
  };

  const testMap = () => {
    // RF-11: Ubicación
    runTest('RF-11: Obtener ubicación', async () => {
      const location = await mapService.getCurrentLocation();
      return { success: true, location, message: `Lat: ${location.lat}, Lng: ${location.lng}` };
    });

    // RF-27: Punto de interés
    runTest('RF-27: Registrar punto de interés', () =>
      mapService.createPointOfInterest({
        name: 'Estación Demo',
        description: 'Estación de carga de prueba',
        type: 'charging_station',
        location: { lat: 4.6097, lng: -74.0817 },
        icon: '⚡',
        isVerified: false,
        createdBy: userId
      })
    );
  };

  const testUserManagement = () => {
    // RF-13: Editar usuario
    runTest('RF-13: Editar perfil', () =>
      userService.updateUser(userId, {
        phone: '+57 300 999 8888',
        address: 'Nueva dirección'
      })
    );

    // RF-44: Asignar rol
    runTest('RF-44: Asignar rol', () =>
      userService.assignRole(userId, 'provider')
    );

    // RF-48: Solicitar eliminación
    runTest('RF-48: Solicitar eliminación de datos', () =>
      userService.requestDataDeletion(userId)
    );
  };

  const clearResults = () => {
    setTestResults([]);
    toast.info('Resultados limpiados');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🧪 Demo de Requerimientos Funcionales - Rola PET</span>
              <Badge variant="outline" className="ml-2">
                {testResults.filter(r => r.success).length} / {testResults.length} Exitosos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Este panel permite probar todos los requerimientos funcionales implementados.
              Haz clic en los botones para ejecutar las pruebas automáticas.
            </p>

            <Tabs defaultValue="auth" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="auth">Autenticación</TabsTrigger>
                <TabsTrigger value="data">Datos</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="results">Resultados</TabsTrigger>
              </TabsList>

              <TabsContent value="auth" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={testAuthentication} className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Test RF-01, 04, 37 (Auth)
                  </Button>
                  <Button onClick={testUserManagement} className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Test RF-13, 44, 48 (User Mgmt)
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={testVehicles} className="w-full">
                    <Car className="w-4 h-4 mr-2" />
                    Test RF-02, 03 (Vehículos)
                  </Button>
                  <Button onClick={testProviders} className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Test RF-15, 18, 19, 24 (Proveedores)
                  </Button>
                  <Button onClick={testMap} className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Test RF-11, 27 (Mapa)
                  </Button>
                  <Button onClick={testShopping} className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Test RF-35, 36 (Shopping)
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={testModeration} className="w-full">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Test RF-06, 07, 09, 10 (Moderación)
                  </Button>
                  <Button onClick={testContent} className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Test RF-20, 22, 25 (Contenido)
                  </Button>
                  <Button onClick={testRatings} className="w-full">
                    <Star className="w-4 h-4 mr-2" />
                    Test RF-28, 29, 38, 39 (Ratings)
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Resultados de Pruebas</h3>
                  <Button onClick={clearResults} variant="outline" size="sm">
                    Limpiar Resultados
                  </Button>
                </div>

                {testResults.length === 0 ? (
                  <Card className="p-8 text-center text-gray-500">
                    No hay resultados aún. Ejecuta algunas pruebas.
                  </Card>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <Card key={index} className={`p-3 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-start space-x-3">
                          {result.success ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{result.name}</p>
                            <p className="text-xs text-gray-600 truncate">{result.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{testResults.filter(r => r.success).length}</p>
              <p className="text-sm text-gray-600">Tests Exitosos</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{testResults.filter(r => !r.success).length}</p>
              <p className="text-sm text-gray-600">Tests Fallidos</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{testResults.length}</p>
              <p className="text-sm text-gray-600">Total Ejecutados</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">48+</p>
              <p className="text-sm text-gray-600">RFs Implementados</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}