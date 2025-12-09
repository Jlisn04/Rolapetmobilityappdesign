import { storageService } from './LocalStorageService';

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  type: 'service' | 'product' | 'both';
  categories: string[];
  isEnabled: boolean;
  registrationDate: string;
  userId?: string;
  logo?: string;
  photos?: string[];
  rating: number;
  reviewCount: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Product {
  id: string;
  providerId: string;
  name: string;
  description: string;
  type: 'service' | 'product';
  category: string;
  price: number;
  currency: string;
  images: string[];
  isAvailable: boolean;
  stock?: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  features?: string[];
  specifications?: Record<string, string>;
}

class ProviderService {
  private static instance: ProviderService;

  private constructor() {}

  public static getInstance(): ProviderService {
    if (!ProviderService.instance) {
      ProviderService.instance = new ProviderService();
    }
    return ProviderService.instance;
  }

  // RF-15 & RF-18: Registrar proveedor
  registerProvider(
    providerData: Omit<Provider, 'id' | 'isEnabled' | 'registrationDate' | 'rating' | 'reviewCount'>
  ): { success: boolean; message: string; provider?: Provider } {
    // Validaciones
    if (!providerData.name || !providerData.email || !providerData.type) {
      return { success: false, message: 'Campos obligatorios faltantes' };
    }

    const providers = storageService.get<Provider[]>('providers') || [];

    // Verificar si el email ya existe
    if (providers.find(p => p.email === providerData.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }

    const newProvider: Provider = {
      id: this.generateId(),
      ...providerData,
      isEnabled: false, // Debe ser habilitado por admin (RF-19)
      registrationDate: new Date().toISOString(),
      rating: 0,
      reviewCount: 0
    };

    providers.push(newProvider);
    storageService.set('providers', providers);

    return { success: true, message: 'Proveedor registrado exitosamente', provider: newProvider };
  }

  // RF-19: Habilitar proveedor
  enableProvider(providerId: string): { success: boolean; message: string } {
    const providers = storageService.get<Provider[]>('providers') || [];
    const providerIndex = providers.findIndex(p => p.id === providerId);

    if (providerIndex === -1) {
      return { success: false, message: 'Proveedor no encontrado' };
    }

    providers[providerIndex].isEnabled = true;
    storageService.set('providers', providers);

    return { success: true, message: 'Proveedor habilitado exitosamente' };
  }

  // Deshabilitar proveedor
  disableProvider(providerId: string): { success: boolean; message: string } {
    const providers = storageService.get<Provider[]>('providers') || [];
    const providerIndex = providers.findIndex(p => p.id === providerId);

    if (providerIndex === -1) {
      return { success: false, message: 'Proveedor no encontrado' };
    }

    providers[providerIndex].isEnabled = false;
    storageService.set('providers', providers);

    return { success: true, message: 'Proveedor deshabilitado exitosamente' };
  }

  // RF-16: Actualizar tipo de proveedor
  updateProviderType(providerId: string, type: 'service' | 'product' | 'both'): { success: boolean; message: string } {
    const providers = storageService.get<Provider[]>('providers') || [];
    const providerIndex = providers.findIndex(p => p.id === providerId);

    if (providerIndex === -1) {
      return { success: false, message: 'Proveedor no encontrado' };
    }

    providers[providerIndex].type = type;
    storageService.set('providers', providers);

    return { success: true, message: 'Tipo de proveedor actualizado exitosamente' };
  }

  // Obtener todos los proveedores
  getAllProviders(onlyEnabled: boolean = false): Provider[] {
    const providers = storageService.get<Provider[]>('providers') || [];
    return onlyEnabled ? providers.filter(p => p.isEnabled) : providers;
  }

  // Obtener proveedor por ID
  getProviderById(providerId: string): Provider | null {
    const providers = storageService.get<Provider[]>('providers') || [];
    return providers.find(p => p.id === providerId) || null;
  }

  // RF-32: Filtrar proveedores
  filterProviders(filters: {
    type?: 'service' | 'product' | 'both';
    category?: string;
    minRating?: number;
    location?: { lat: number; lng: number; radiusKm: number };
    searchTerm?: string;
  }): Provider[] {
    let providers = this.getAllProviders(true);

    if (filters.type) {
      providers = providers.filter(p => p.type === filters.type || p.type === 'both');
    }

    if (filters.category) {
      providers = providers.filter(p => p.categories.includes(filters.category));
    }

    if (filters.minRating) {
      providers = providers.filter(p => p.rating >= filters.minRating);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      providers = providers.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (filters.location && filters.location.radiusKm) {
      providers = providers.filter(p => {
        if (!p.location) return false;
        const distance = this.calculateDistance(
          filters.location!.lat,
          filters.location!.lng,
          p.location.lat,
          p.location.lng
        );
        return distance <= filters.location!.radiusKm;
      });
    }

    return providers;
  }

  // RF-24 & RF-26: Publicar producto/servicio
  publishProduct(
    productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; message: string; product?: Product } {
    // Verificar que el proveedor existe y está habilitado
    const provider = this.getProviderById(productData.providerId);
    if (!provider) {
      return { success: false, message: 'Proveedor no encontrado' };
    }

    if (!provider.isEnabled) {
      return { success: false, message: 'El proveedor no está habilitado' };
    }

    // Validaciones
    if (!productData.name || !productData.price || !productData.type) {
      return { success: false, message: 'Campos obligatorios faltantes' };
    }

    const products = storageService.get<Product[]>('products') || [];

    const newProduct: Product = {
      id: this.generateId(),
      ...productData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    storageService.set('products', products);

    return { success: true, message: 'Producto publicado exitosamente', product: newProduct };
  }

  // RF-23 & RF-40: Editar producto
  updateProduct(
    productId: string,
    providerId: string,
    updates: Partial<Product>
  ): { success: boolean; message: string; product?: Product } {
    const products = storageService.get<Product[]>('products') || [];
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return { success: false, message: 'Producto no encontrado' };
    }

    if (products[productIndex].providerId !== providerId) {
      return { success: false, message: 'No tienes permiso para editar este producto' };
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      id: productId,
      providerId: products[productIndex].providerId,
      updatedAt: new Date().toISOString()
    };

    storageService.set('products', products);

    return { success: true, message: 'Producto actualizado exitosamente', product: products[productIndex] };
  }

  // Obtener productos de un proveedor
  getProviderProducts(providerId: string): Product[] {
    const products = storageService.get<Product[]>('products') || [];
    return products.filter(p => p.providerId === providerId);
  }

  // Obtener todos los productos con filtros
  getProducts(filters?: {
    type?: 'service' | 'product';
    category?: string;
    providerId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    searchTerm?: string;
    onlyAvailable?: boolean;
  }): Product[] {
    let products = storageService.get<Product[]>('products') || [];

    if (!filters) return products;

    if (filters.type) {
      products = products.filter(p => p.type === filters.type);
    }

    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters.providerId) {
      products = products.filter(p => p.providerId === filters.providerId);
    }

    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.minRating) {
      products = products.filter(p => p.rating >= filters.minRating!);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (filters.onlyAvailable) {
      products = products.filter(p => p.isAvailable);
    }

    return products;
  }

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

  private generateId(): string {
    return 'prov_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const providerService = ProviderService.getInstance();
