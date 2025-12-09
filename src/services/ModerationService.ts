import { storageService } from './LocalStorageService';
import type { User } from './AuthService';

export interface ContentModerationResult {
  isAllowed: boolean;
  flaggedWords: string[];
  severity: 'low' | 'medium' | 'high';
  action: 'allow' | 'warn' | 'block' | 'auto-ban';
}

class ModerationService {
  private static instance: ModerationService;
  private readonly maxWarningsBeforeBan = 3;

  private constructor() {}

  public static getInstance(): ModerationService {
    if (!ModerationService.instance) {
      ModerationService.instance = new ModerationService();
    }
    return ModerationService.instance;
  }

  // RF-06 & RF-10: Sistema de revisión y eliminación automática de comentarios
  moderateContent(content: string, userId: string): ContentModerationResult {
    const bannedWords = storageService.get<string[]>('bannedWords') || [];
    const lowerContent = content.toLowerCase();
    const flaggedWords: string[] = [];

    // Detectar palabras prohibidas
    bannedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(lowerContent)) {
        flaggedWords.push(word);
      }
    });

    // Determinar severidad y acción
    let severity: 'low' | 'medium' | 'high' = 'low';
    let action: 'allow' | 'warn' | 'block' | 'auto-ban' = 'allow';

    if (flaggedWords.length === 0) {
      return { isAllowed: true, flaggedWords: [], severity, action };
    }

    if (flaggedWords.length <= 1) {
      severity = 'low';
      action = 'warn';
    } else if (flaggedWords.length <= 3) {
      severity = 'medium';
      action = 'block';
    } else {
      severity = 'high';
      action = 'auto-ban';
    }

    // Aplicar acción automática
    if (action === 'auto-ban') {
      this.autoBanUser(userId, `Uso de múltiples palabras prohibidas: ${flaggedWords.join(', ')}`);
    } else if (action === 'warn' || action === 'block') {
      this.addWarningToUser(
        userId, 
        'Moderación automática', 
        `Contenido inapropiado detectado. Palabras: ${flaggedWords.join(', ')}`,
        'system'
      );
    }

    return {
      isAllowed: action !== 'block' && action !== 'auto-ban',
      flaggedWords,
      severity,
      action
    };
  }

  // RF-09: Registrar advertencia a usuario
  addWarningToUser(
    userId: string, 
    reason: string, 
    description: string, 
    adminId: string
  ): { success: boolean; message: string } {
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const warning = {
      id: this.generateId(),
      reason,
      description,
      date: new Date().toISOString(),
      adminId
    };

    if (!users[userIndex].warnings) {
      users[userIndex].warnings = [];
    }

    users[userIndex].warnings.push(warning);

    // Verificar si debe ser baneado automáticamente
    if (users[userIndex].warnings.length >= this.maxWarningsBeforeBan) {
      users[userIndex].isActive = false;
      storageService.set('users', users);
      return { 
        success: true, 
        message: `Usuario baneado automáticamente por acumular ${this.maxWarningsBeforeBan} advertencias` 
      };
    }

    storageService.set('users', users);

    // Guardar en registro de advertencias global
    const warnings = storageService.get<any[]>('warnings') || [];
    warnings.push({
      ...warning,
      userId,
      username: users[userIndex].username
    });
    storageService.set('warnings', warnings);

    return { success: true, message: 'Advertencia registrada exitosamente' };
  }

  // RF-07: Consultar advertencias de un usuario
  getUserWarnings(userId: string): any[] {
    const users = storageService.get<User[]>('users') || [];
    const user = users.find(u => u.id === userId);
    return user?.warnings || [];
  }

  // RF-10: Baneo automático
  autoBanUser(userId: string, reason: string): { success: boolean; message: string } {
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    users[userIndex].isActive = false;

    // Agregar advertencia final
    const finalWarning = {
      id: this.generateId(),
      reason: 'Baneo automático',
      description: reason,
      date: new Date().toISOString(),
      adminId: 'system'
    };

    if (!users[userIndex].warnings) {
      users[userIndex].warnings = [];
    }
    users[userIndex].warnings.push(finalWarning);

    storageService.set('users', users);

    return { success: true, message: 'Usuario baneado automáticamente' };
  }

  // RF-17: Desactivar cuenta de usuario
  deactivateUser(userId: string, adminId: string, reason: string): { success: boolean; message: string } {
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (users[userIndex].role === 'admin') {
      return { success: false, message: 'No se puede desactivar una cuenta de administrador' };
    }

    users[userIndex].isActive = false;

    // Agregar advertencia
    this.addWarningToUser(userId, 'Cuenta desactivada', reason, adminId);

    storageService.set('users', users);

    return { success: true, message: 'Usuario desactivado exitosamente' };
  }

  // Reactivar usuario
  reactivateUser(userId: string, adminId: string): { success: boolean; message: string } {
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    users[userIndex].isActive = true;
    storageService.set('users', users);

    return { success: true, message: 'Usuario reactivado exitosamente' };
  }

  // Agregar palabra prohibida
  addBannedWord(word: string): { success: boolean; message: string } {
    const bannedWords = storageService.get<string[]>('bannedWords') || [];
    
    if (bannedWords.includes(word.toLowerCase())) {
      return { success: false, message: 'La palabra ya está en la lista' };
    }

    bannedWords.push(word.toLowerCase());
    storageService.set('bannedWords', bannedWords);

    return { success: true, message: 'Palabra prohibida agregada' };
  }

  // Eliminar palabra prohibida
  removeBannedWord(word: string): { success: boolean; message: string } {
    let bannedWords = storageService.get<string[]>('bannedWords') || [];
    const initialLength = bannedWords.length;
    
    bannedWords = bannedWords.filter(w => w !== word.toLowerCase());
    
    if (bannedWords.length === initialLength) {
      return { success: false, message: 'Palabra no encontrada' };
    }

    storageService.set('bannedWords', bannedWords);

    return { success: true, message: 'Palabra prohibida eliminada' };
  }

  // Obtener todas las palabras prohibidas
  getBannedWords(): string[] {
    return storageService.get<string[]>('bannedWords') || [];
  }

  // Obtener todas las advertencias (para admin)
  getAllWarnings(): any[] {
    return storageService.get<any[]>('warnings') || [];
  }

  private generateId(): string {
    return 'warn_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const moderationService = ModerationService.getInstance();
