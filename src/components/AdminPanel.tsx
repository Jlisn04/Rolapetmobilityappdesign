import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Users, 
  ShoppingBag, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AdminPanelProps {
  onViewChange: (view: string) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  vehicle: string;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActivity: string;
}

interface Product {
  id: string;
  name: string;
  seller: string;
  price: number;
  status: 'active' | 'pending' | 'rejected';
  category: string;
  reportCount: number;
}

interface Route {
  id: string;
  name: string;
  creator: string;
  difficulty: string;
  rating: number;
  reports: number;
  status: 'active' | 'under_review' | 'blocked';
}

export function AdminPanel({ onViewChange }: AdminPanelProps) {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - En producción vendría de la base de datos
  const statsData = {
    totalUsers: 1247,
    activeUsers: 892,
    totalProducts: 324,
    pendingProducts: 23,
    totalRoutes: 156,
    reportedContent: 12,
    revenue: 45680,
    monthlyGrowth: 12.5
  };

  const recentUsers: User[] = [
    {
      id: '1',
      name: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      vehicle: 'Scooter Eléctrico',
      status: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2024-01-20'
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@email.com',
      vehicle: 'Bicicleta Eléctrica',
      status: 'pending',
      joinDate: '2024-01-18',
      lastActivity: '2024-01-19'
    },
    {
      id: '3',
      name: 'Andrés Mora',
      email: 'andres@email.com',
      vehicle: 'Moto Eléctrica',
      status: 'active',
      joinDate: '2024-01-10',
      lastActivity: '2024-01-20'
    }
  ];

  const pendingProducts: Product[] = [
    {
      id: '1',
      name: 'Casco Urbano Premium',
      seller: 'TechBike Store',
      price: 89000,
      status: 'pending',
      category: 'Seguridad',
      reportCount: 0
    },
    {
      id: '2',
      name: 'Batería Extra 48V',
      seller: 'ElectroMovil',
      price: 450000,
      status: 'pending',
      category: 'Repuestos',
      reportCount: 1
    }
  ];

  const reportedRoutes: Route[] = [
    {
      id: '1',
      name: 'Ruta Centro Histórico',
      creator: 'Juan Pérez',
      difficulty: 'Fácil',
      rating: 4.2,
      reports: 3,
      status: 'under_review'
    },
    {
      id: '2',
      name: 'Circuito Chapinero',
      creator: 'Ana Silva',
      difficulty: 'Medio',
      rating: 3.8,
      reports: 1,
      status: 'active'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive',
      rejected: 'destructive',
      under_review: 'secondary',
      blocked: 'destructive'
    };
    
    const labels = {
      active: 'Activo',
      pending: 'Pendiente',
      suspended: 'Suspendido',
      rejected: 'Rechazado',
      under_review: 'En Revisión',
      blocked: 'Bloqueado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleUserAction = (userId: string, action: 'approve' | 'suspend' | 'delete') => {
    console.log(`${action} user ${userId}`);
    // Aquí iría la lógica para la acción
  };

  const handleProductAction = (productId: string, action: 'approve' | 'reject' | 'delete') => {
    console.log(`${action} product ${productId}`);
    // Aquí iría la lógica para la acción
  };

  const handleRouteAction = (routeId: string, action: 'approve' | 'block' | 'delete') => {
    console.log(`${action} route ${routeId}`);
    // Aquí iría la lógica para la acción
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona la plataforma Rola PET</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => onViewChange('dashboard')}>
                <Eye className="w-4 h-4 mr-2" />
                Ver como Usuario
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Exportar Datos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Rutas
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Moderación
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{statsData.monthlyGrowth}%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((statsData.activeUsers / statsData.totalUsers) * 100).toFixed(1)}% del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-orange-600">{statsData.pendingProducts}</span> pendientes de aprobación
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contenido Reportado</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.reportedContent}</div>
                  <p className="text-xs text-muted-foreground">
                    Requiere atención inmediata
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Recientes</CardTitle>
                  <CardDescription>Últimos registros en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.vehicle}</p>
                          </div>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas Pendientes</CardTitle>
                  <CardDescription>Elementos que requieren tu atención</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {statsData.pendingProducts} productos pendientes de aprobación
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {statsData.reportedContent} reportes de contenido sin revisar
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        3 rutas con múltiples reportes de seguridad
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="suspended">Suspendidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios de la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.vehicle}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-400">
                              Registro: {new Date(user.joinDate).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400">
                              Última actividad: {new Date(user.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(user.status)}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleUserAction(user.id, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Gestión del Marketplace</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Productos Pendientes de Aprobación</CardTitle>
                <CardDescription>Revisa y aprueba nuevos productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-500">Vendedor: {product.seller}</p>
                        <p className="text-sm text-gray-500">Categoría: {product.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="font-semibold text-lg">
                            ${product.price.toLocaleString()} COP
                          </span>
                          {product.reportCount > 0 && (
                            <Badge variant="destructive">
                              {product.reportCount} reportes
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleProductAction(product.id, 'approve')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleProductAction(product.id, 'reject')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Gestión de Rutas</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Ruta
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rutas Reportadas</CardTitle>
                <CardDescription>Rutas que requieren moderación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedRoutes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{route.name}</h4>
                        <p className="text-sm text-gray-500">Creador: {route.creator}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{route.difficulty}</Badge>
                          <span className="text-sm">⭐ {route.rating}</span>
                          <Badge variant="destructive">{route.reports} reportes</Badge>
                          {getStatusBadge(route.status)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleRouteAction(route.id, 'approve')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRouteAction(route.id, 'block')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Bloquear
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <h2 className="text-2xl font-semibold">Centro de Moderación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comentarios Reportados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <p className="text-sm text-gray-500">Pendientes de revisión</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Usuarios Reportados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-sm text-gray-500">Requieren acción</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tiempo Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-sm text-gray-500">Resolución de reportes</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Configuración de la Plataforma</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                  <CardDescription>Ajustes básicos de la plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance">Modo Mantenimiento</Label>
                    <Switch id="maintenance" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="registration">Registro Abierto</Label>
                    <Switch id="registration" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notificaciones Push</Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Moderación Automática</CardTitle>
                  <CardDescription>Configurar filtros automáticos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-approve">Auto-aprobar productos</Label>
                    <Switch id="auto-approve" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="spam-filter">Filtro anti-spam</Label>
                    <Switch id="spam-filter" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="word-filter">Filtro de palabras</Label>
                    <Switch id="word-filter" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}