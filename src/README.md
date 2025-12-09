# Rola PET - Movilidad 🛴⚡

## Aplicación Web Completa para Movilidad Eléctrica en Bogotá D.C.

**Rola PET - Movilidad** es una plataforma integral desarrollada en React/TypeScript que conecta a usuarios de scooters, bicicletas y motos eléctricas con servicios, comercios y una comunidad activa en Bogotá.

---

## ✨ Características Principales

### 🔐 Autenticación y Gestión de Usuarios
- **Registro completo** con validación de datos (RF-01)
- **Sistema de login** con validación de credenciales (RF-04)
- **Recuperación de contraseña** (RF-37)
- **Validación de mayoría de edad** con consentimiento para menores (RF-46, RF-47)
- **Gestión de perfiles** editable (RF-13, RF-14)
- **Sistema de roles**: Usuario, Proveedor, Administrador (RF-44, RF-45)
- **Sesiones con JWT** simulado (RF-42)
- **Eliminación de datos** bajo solicitud (RF-48)

### 🚗 Gestión de Vehículos
- **Registro ilimitado** de vehículos (RF-02)
- **Vinculación automática** a cuenta de usuario (RF-03)
- Soporte para **scooters, bicicletas y motos eléctricas**
- Información detallada: marca, modelo, batería, autonomía, velocidad

### 🛡️ Moderación de Contenido
- **Sistema de moderación automática** con detección de palabras prohibidas (RF-06, RF-10)
- **Baneo automático** por lenguaje inapropiado
- **Sistema de advertencias** con límite antes de baneo (RF-09)
- **Consulta de historial** de advertencias (RF-07)
- **Revisión de contenido** por administradores (RF-08)
- **Filtrado de contenido** personalizable (RF-05)

### 🗺️ Mapa Interactivo
- **Acceso a ubicación** geoespacial (RF-11)
- **Puntos de interés** categorizados con iconos (RF-27, RNF-06):
  - Estaciones de carga
  - Talleres de reparación
  - Parqueaderos seguros
  - Tiendas especializadas
- **Creación de rutas** personalizadas
- **Calificación de rutas** y puntos de interés (RF-28, RF-29)
- **Comentarios** sobre puntos de interés (RF-30)

### 🏪 Marketplace Digital
- **Registro de proveedores** con clasificación servicio/producto (RF-15, RF-16, RF-18)
- **Habilitación de proveedores** por administradores (RF-19)
- **Publicación de catálogos** con multimedia (RF-24, RF-26)
- **Edición de productos** por proveedores (RF-23, RF-40)
- **Filtros avanzados** por categoría, precio, rating, ubicación (RF-31, RF-32)
- **Carrito de compras** y wishlist (RF-35)
- **Validación de compras** (RF-36)

### ⭐ Sistema de Calificaciones
- **Calificación con estrellas** (1-5) para productos, servicios y puntos de interés (RF-38)
- **Ventana de tiempo** de 60 días para calificar compras (RF-39)
- **Alertas automáticas** para calificar compras (RF-33)
- **Comentarios** en calificaciones
- **Sistema de likes** para calificaciones (RF-20, RF-21)

### 👥 Red Social
- **Publicaciones** de texto y multimedia (RF-25)
- **Sistema de comentarios** con respuestas anidadas (RF-22, RF-34)
- **Me gusta** y unlike en publicaciones (RF-20, RF-21)
- **Foros de discusión** asíncronos entre usuarios, proveedores y administradores

### 👨‍💼 Panel de Administración
- **Gestión completa de usuarios** con filtros
- **Moderación de contenido** en tiempo real
- **Gestión de proveedores** y productos
- **Administración de categorías** (RF-41)
- **Publicación de noticias** oficiales (RF-43)
- **Estadísticas** de la plataforma
- **Configuración** de palabras prohibidas

---

## 🏗️ Arquitectura Técnica

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS v4** para estilos responsivos
- **Componentes UI** con shadcn/ui
- **Lucide React** para iconografía
- **Sonner** para notificaciones toast

### Servicios (Patrón Singleton + DAO)
```
/services/
  ├── LocalStorageService.ts      # Persistencia de datos (Singleton)
  ├── AuthService.ts              # Autenticación y JWT
  ├── UserService.ts              # Gestión de usuarios
  ├── VehicleService.ts           # CRUD de vehículos
  ├── ModerationService.ts        # Moderación automática
  ├── ContentService.ts           # Publicaciones y comentarios
  ├── ProviderService.ts          # Proveedores y productos
  ├── RatingService.ts            # Calificaciones y compras
  ├── ShoppingCartService.ts      # Carrito y wishlist
  └── MapService.ts               # Mapa y puntos de interés
```

### Componentes
```
/components/
  ├── LandingPage.tsx             # Página de aterrizaje
  ├── AuthPages.tsx               # Login, registro, recuperación
  ├── Dashboard.tsx               # Panel principal del usuario
  ├── Navigation.tsx              # Barra de navegación
  ├── VehicleManagement.tsx       # Gestión de vehículos
  ├── MapView.tsx                 # Vista del mapa
  ├── Marketplace.tsx             # Tienda digital
  ├── SocialView.tsx              # Red social
  ├── UserProfile.tsx             # Perfil de usuario
  ├── ReviewsView.tsx             # Calificaciones y reseñas
  ├── AdminPanel.tsx              # Panel de administración
  ├── FeaturesDemo.tsx            # Demo de funcionalidades
  └── ui/                         # Componentes UI reutilizables
```

---

## 📋 Requerimientos Implementados

### Funcionales: 48+ RFs
✅ RF-01 al RF-48 implementados

Ver detalle completo en [`/IMPLEMENTACION.md`](/IMPLEMENTACION.md)

### No Funcionales: 8 RNFs
- ✅ **RNF-01**: Identidad visual Rola PET (verde #10B981, azul)
- ✅ **RNF-02**: Branding en toda la aplicación
- ✅ **RNF-03**: Diseño responsive (móvil, tablet, desktop)
- ✅ **RNF-04**: Interfaces específicas por rol
- ✅ **RNF-05**: Disponibilidad continua (aplicación SPA)
- ✅ **RNF-06**: Iconos distintivos para puntos de interés
- ✅ **RNF-07**: Patrón Singleton en servicios
- ✅ **RNF-08**: Validaciones en operaciones CRUD

---

## 🚀 Inicio Rápido

### Credenciales de Prueba

**Usuario Administrador:**
- Email: `admin@rolapet.com`
- Contraseña: `admin123`

**Usuario Demo:**
- Cualquier email válido
- Cualquier contraseña (6+ caracteres)

### Datos Precargados

**Puntos de Interés en Bogotá:**
1. Estación de Carga Usaquén (4.7010, -74.0304)
2. Taller Motos Eléctricas Chapinero (4.6333, -74.0640)
3. Parqueadero Seguro Centro (4.5981, -74.0758)

**Categorías de Productos:**
- Repuestos
- Accesorios
- Mantenimiento
- Reparación
- Seguridad

**Palabras Prohibidas:**
- odio, violencia, discriminación, amenaza
- insulto, agresión, racismo, xenofobia

---

## 🧪 Demo de Funcionalidades

Accede a `/features-demo` para probar automáticamente todos los requerimientos funcionales implementados con un panel interactivo.

**Categorías de Tests:**
1. **Autenticación**: RF-01, 04, 37, 13, 44, 48
2. **Datos**: RF-02, 03, 15, 18, 19, 24, 11, 27, 35, 36
3. **Social**: RF-06, 07, 09, 10, 20, 22, 25, 28, 29, 38, 39

---

## 📱 Navegación

### Vistas Públicas
- **Landing Page**: Página de inicio con información
- **Login**: Inicio de sesión
- **Registro**: Crear cuenta nueva
- **Recuperar Contraseña**: Recuperación de acceso

### Vistas de Usuario
- **Dashboard**: Panel principal con estadísticas
- **Mapa**: Rutas y puntos de interés
- **Marketplace**: Tienda de productos y servicios
- **Social**: Red social y comunidad
- **Perfil**: Gestión de cuenta y vehículos
- **Reseñas**: Calificaciones y opiniones

### Vistas de Administrador
- **Panel Admin**: Gestión completa de la plataforma
  - Usuarios
  - Contenido
  - Proveedores
  - Marketplace
  - Rutas
  - Configuración

---

## 🔒 Seguridad

**⚠️ IMPORTANTE**: Esta aplicación usa LocalStorage para simular persistencia de datos. Es solo para demostración.

### Para Producción:
- ❌ NO usar contraseñas en texto plano
- ✅ Implementar hash (bcrypt, Argon2)
- ✅ Base de datos real (PostgreSQL, MongoDB)
- ✅ Backend seguro (Node.js, Python, etc.)
- ✅ HTTPS obligatorio
- ✅ Rate limiting
- ✅ Validación servidor + cliente
- ✅ Cumplimiento GDPR/LOPD

**Datos sensibles**: La aplicación NO está diseñada para manejar datos personales sensibles o información financiera en producción.

---

## 🎨 Identidad Visual

### Colores Principales
- **Verde Rola PET**: #10B981 (verde-600)
- **Azul Secundario**: #3B82F6 (blue-600)
- **Gris Neutro**: #6B7280 (gray-600)

### Tipografía
- **Sistema**: Default font stack de Tailwind
- Pesos: Regular (400), Medium (500), Semibold (600), Bold (700)

### Logo
- **Formato**: Círculo con iniciales "RP"
- **Colores**: Fondo verde, texto blanco

---

## 🛠️ Ejemplos de Uso

### Registrar un Vehículo
```typescript
import { vehicleService } from './services/VehicleService';

const result = vehicleService.registerVehicle(userId, {
  type: 'scooter',
  brand: 'Xiaomi',
  model: 'M365',
  year: 2024,
  isElectric: true,
  batteryCapacity: '10Ah',
  maxSpeed: 25,
  range: 40
});

if (result.success) {
  vehicleService.linkVehicleToUser(userId, result.vehicle.id);
}
```

### Moderar Contenido
```typescript
import { moderationService } from './services/ModerationService';

const result = moderationService.moderateContent(
  'Este es mi comentario',
  userId
);

if (!result.isAllowed) {
  console.log('Palabras bloqueadas:', result.flaggedWords);
  console.log('Acción:', result.action); // 'warn', 'block', 'auto-ban'
}
```

### Agregar al Carrito
```typescript
import { shoppingCartService } from './services/ShoppingCartService';

shoppingCartService.addToCart(userId, product, 2);
const total = shoppingCartService.getCartTotal(userId);
console.log('Total:', total.subtotal, 'COP');
```

---

## 📄 Documentación Adicional

- **Implementación Detallada**: [`/IMPLEMENTACION.md`](/IMPLEMENTACION.md)
- **Atribuciones**: [`/Attributions.md`](/Attributions.md)

---

## 💡 Características Destacadas

### Patrón Singleton
Todos los servicios implementan Singleton para garantizar una única instancia y estado compartido.

### Validaciones Robustas
- Email válido
- Contraseñas seguras (6+ caracteres)
- Campos obligatorios
- Validación de edad
- Límites de tiempo para calificaciones (60 días)

### Moderación Inteligente
- Detección automática de palabras prohibidas
- Niveles de severidad (low, medium, high)
- Acciones graduales (warn, block, auto-ban)
- Límite de advertencias antes de baneo

### Experiencia de Usuario
- Notificaciones toast en tiempo real
- Diseño responsive
- Interfaces específicas por rol
- Estadísticas visuales
- Navegación intuitiva

---

## 🎯 Próximos Pasos para Producción

1. **Backend Real**: Migrar a Supabase, Firebase o Node.js + PostgreSQL
2. **Autenticación Segura**: OAuth2, Auth0, o similar
3. **Mapa Real**: Integrar Mapbox, Google Maps o OpenStreetMap
4. **Pasarela de Pagos**: Stripe, PayU, Mercado Pago
5. **Notificaciones**: Push notifications + emails transaccionales
6. **Analytics**: Google Analytics, Mixpanel
7. **Testing**: Unit tests (Jest), E2E (Cypress)
8. **CI/CD**: GitHub Actions, GitLab CI
9. **Hosting**: Vercel, Netlify, AWS

---

## 👨‍💻 Desarrollo

Esta aplicación fue desarrollada con las mejores prácticas de React y TypeScript, siguiendo principios de:
- **Clean Code**
- **SOLID**
- **Separación de responsabilidades**
- **Componentización**
- **Reutilización**

---

## 📞 Soporte

Todos los servicios retornan objetos consistentes:
```typescript
{
  success: boolean;
  message: string;
  data?: any; // cuando aplica
}
```

Usa el componente `toast` de Sonner para mostrar feedback al usuario en toda la aplicación.

---

## 🌟 Reconocimientos

Desarrollado para la **Asociación Rola PET** - Promoviendo la movilidad eléctrica sostenible en Bogotá, D.C.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024
