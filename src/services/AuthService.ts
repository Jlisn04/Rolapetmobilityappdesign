import { storageService } from './LocalStorageService';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'user' | 'provider' | 'admin';
  name: string;
  isActive: boolean;
  createdAt: string;
  vehicles: string[];
  warnings: Warning[];
  isOfAge: boolean;
  documentId?: string;
  legalConsent?: string; // Para menores de edad
  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface Warning {
  id: string;
  reason: string;
  description: string;
  date: string;
  adminId: string;
}

export interface Session {
  token: string;
  user: User;
  expiresAt: string;
}

class AuthService {
  private static instance: AuthService;
  private currentSession: Session | null = null;

  private constructor() {
    this.loadSession();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // RF-01: Registro de usuario
  register(
    email: string,
    username: string,
    password: string,
    name: string,
    isOfAge: boolean,
    documentId?: string,
    legalConsent?: string
  ): { success: boolean; message: string; user?: User } {
    // Validaciones
    if (!email || !username || !password || !name) {
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Email inválido' };
    }

    if (password.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // RF-46: Validación de mayoría de edad
    if (!isOfAge && !legalConsent) {
      return { 
        success: false, 
        message: 'Los menores de edad requieren consentimiento notariado' 
      };
    }

    const users = storageService.get<User[]>('users') || [];
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'El email ya está registrado' };
    }

    if (users.find(u => u.username === username)) {
      return { success: false, message: 'El nombre de usuario ya existe' };
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: this.generateId(),
      email,
      username,
      password, // En producción debe estar hasheado
      role: 'user',
      name,
      isActive: true,
      createdAt: new Date().toISOString(),
      vehicles: [],
      warnings: [],
      isOfAge,
      documentId,
      legalConsent
    };

    users.push(newUser);
    storageService.set('users', users);

    return { success: true, message: 'Usuario registrado exitosamente', user: this.sanitizeUser(newUser) };
  }

  // RF-04: Login con validación de credenciales
  login(emailOrUsername: string, password: string): { success: boolean; message: string; user?: User; token?: string } {
    const users = storageService.get<User[]>('users') || [];
    
    const user = users.find(
      u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );

    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }

    // RF-17: Verificar si la cuenta está activa
    if (!user.isActive) {
      return { success: false, message: 'Tu cuenta ha sido desactivada. Contacta al administrador.' };
    }

    // RF-42: Generar token JWT simulado
    const token = this.generateToken(user);
    const session: Session = {
      token,
      user,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    this.currentSession = session;
    storageService.set('session', session);

    return { 
      success: true, 
      message: 'Login exitoso', 
      user: this.sanitizeUser(user),
      token 
    };
  }

  // RF-37: Recuperación de contraseña
  requestPasswordReset(email: string): { success: boolean; message: string } {
    const users = storageService.get<User[]>('users') || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      // Por seguridad, no revelar si el email existe
      return { 
        success: true, 
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' 
      };
    }

    // En producción, aquí se enviaría un email
    // Por ahora, guardamos un token de reset
    const resetTokens = storageService.get<any>('resetTokens') || {};
    resetTokens[email] = {
      token: this.generateId(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hora
    };
    storageService.set('resetTokens', resetTokens);

    return { 
      success: true, 
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' 
    };
  }

  resetPassword(email: string, token: string, newPassword: string): { success: boolean; message: string } {
    const resetTokens = storageService.get<any>('resetTokens') || {};
    const resetData = resetTokens[email];

    if (!resetData || resetData.token !== token) {
      return { success: false, message: 'Token inválido' };
    }

    if (new Date(resetData.expiresAt) < new Date()) {
      return { success: false, message: 'Token expirado' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    users[userIndex].password = newPassword;
    storageService.set('users', users);

    // Eliminar token usado
    delete resetTokens[email];
    storageService.set('resetTokens', resetTokens);

    return { success: true, message: 'Contraseña actualizada exitosamente' };
  }

  logout(): void {
    this.currentSession = null;
    storageService.remove('session');
  }

  getCurrentUser(): User | null {
    if (!this.currentSession) return null;
    
    // Verificar si la sesión ha expirado
    if (new Date(this.currentSession.expiresAt) < new Date()) {
      this.logout();
      return null;
    }

    return this.sanitizeUser(this.currentSession.user);
  }

  validateToken(token: string): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.token === token && new Date(this.currentSession.expiresAt) > new Date();
  }

  private loadSession(): void {
    const session = storageService.get<Session>('session');
    if (session && new Date(session.expiresAt) > new Date()) {
      this.currentSession = session;
    }
  }

  private generateToken(user: User): string {
    // Simulación de JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 
    }));
    const signature = btoa(`${header}.${payload}.secret`);
    return `${header}.${payload}.${signature}`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeUser(user: User): User {
    const { password, ...sanitized } = user;
    return sanitized as User;
  }
}

export const authService = AuthService.getInstance();
