// Singleton pattern para gestión de almacenamiento local
class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly prefix = 'rolapet_';

  private constructor() {
    this.initializeDefaults();
  }

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  private initializeDefaults(): void {
    // Inicializar estructuras de datos si no existen
    if (!this.get('users')) {
      this.set('users', [
        {
          id: '1',
          email: 'admin@rolapet.com',
          username: 'admin',
          password: 'admin123', // En producción esto debe estar hasheado
          role: 'admin',
          name: 'Administrador Rola PET',
          isActive: true,
          createdAt: new Date().toISOString(),
          vehicles: [],
          warnings: [],
          isOfAge: true
        }
      ]);
    }
    
    if (!this.get('vehicles')) this.set('vehicles', []);
    if (!this.get('posts')) this.set('posts', []);
    if (!this.get('comments')) this.set('comments', []);
    if (!this.get('ratings')) this.set('ratings', []);
    if (!this.get('providers')) this.set('providers', []);
    if (!this.get('products')) this.set('products', []);
    if (!this.get('pointsOfInterest')) this.set('pointsOfInterest', []);
    if (!this.get('routes')) this.set('routes', []);
    if (!this.get('warnings')) this.set('warnings', []);
    if (!this.get('bannedWords')) {
      this.set('bannedWords', [
        'odio', 'violencia', 'discriminación', 'amenaza',
        'insulto', 'agresión', 'racismo', 'xenofobia'
      ]);
    }
    if (!this.get('categories')) {
      this.set('categories', [
        { id: '1', name: 'Repuestos', type: 'product' },
        { id: '2', name: 'Accesorios', type: 'product' },
        { id: '3', name: 'Mantenimiento', type: 'service' },
        { id: '4', name: 'Reparación', type: 'service' },
        { id: '5', name: 'Seguridad', type: 'product' }
      ]);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    this.initializeDefaults();
  }
}

export const storageService = LocalStorageService.getInstance();
