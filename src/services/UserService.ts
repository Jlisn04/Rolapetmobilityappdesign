import { storageService } from './LocalStorageService';
import type { User } from './AuthService';

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // RF-13: Editar datos de usuario
  updateUser(
    userId: string,
    updates: Partial<User>
  ): { success: boolean; message: string; user?: User } {
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Validar email si se está actualizando
    if (updates.email && updates.email !== users[userIndex].email) {
      if (users.find(u => u.email === updates.email && u.id !== userId)) {
        return { success: false, message: 'El email ya está registrado' };
      }
    }

    // Validar username si se está actualizando
    if (updates.username && updates.username !== users[userIndex].username) {
      if (users.find(u => u.username === updates.username && u.id !== userId)) {
        return { success: false, message: 'El nombre de usuario ya existe' };
      }
    }

    // No permitir cambiar ciertos campos
    const { id, password, role, warnings, createdAt, ...safeUpdates } = updates as any;

    users[userIndex] = {
      ...users[userIndex],
      ...safeUpdates
    };

    storageService.set('users', users);

    return { 
      success: true, 
      message: 'Perfil actualizado exitosamente', 
      user: this.sanitizeUser(users[userIndex]) 
    };
  }

  // RF-14: Consultar datos de usuario
  getUserById(userId: string): User | null {
    const users = storageService.get<User[]>('users') || [];
    const user = users.find(u => u.id === userId);
    return user ? this.sanitizeUser(user) : null;
  }

  // Obtener usuario por email
  getUserByEmail(email: string): User | null {
    const users = storageService.get<User[]>('users') || [];
    const user = users.find(u => u.email === email);
    return user ? this.sanitizeUser(user) : null;
  }

  // Obtener usuario por username
  getUserByUsername(username: string): User | null {
    const users = storageService.get<User[]>('users') || [];
    const user = users.find(u => u.username === username);
    return user ? this.sanitizeUser(user) : null;
  }

  // RF-44: Asignar rol a usuario
  assignRole(
    userId: string,
    role: 'user' | 'provider' | 'admin'
  ): { success: boolean; message: string } {
    const users = storageService.get<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    users[userIndex].role = role;
    storageService.set('users', users);

    return { success: true, message: `Rol ${role} asignado exitosamente` };
  }

  // RF-45: Quitar rol (volver a usuario básico)
  removeRole(userId: string): { success: boolean; message: string } {
    return this.assignRole(userId, 'user');
  }

  // RF-48: Solicitar eliminación de datos
  requestDataDeletion(userId: string): { success: boolean; message: string } {
    const deletionRequests = storageService.get<any[]>('deletionRequests') || [];

    // Verificar si ya existe una solicitud pendiente
    if (deletionRequests.find(req => req.userId === userId && req.status === 'pending')) {
      return { success: false, message: 'Ya tienes una solicitud de eliminación pendiente' };
    }

    const request = {
      id: this.generateId(),
      userId,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
    };

    deletionRequests.push(request);
    storageService.set('deletionRequests', deletionRequests);

    return { 
      success: true, 
      message: 'Solicitud de eliminación registrada. Tus datos serán eliminados en 30 días.' 
    };
  }

  // Procesar eliminación de datos (llamado por admin)
  processDataDeletion(requestId: string): { success: boolean; message: string } {
    const deletionRequests = storageService.get<any[]>('deletionRequests') || [];
    const requestIndex = deletionRequests.findIndex(req => req.id === requestId);

    if (requestIndex === -1) {
      return { success: false, message: 'Solicitud no encontrada' };
    }

    const request = deletionRequests[requestIndex];
    const userId = request.userId;

    // Eliminar usuario
    let users = storageService.get<User[]>('users') || [];
    users = users.filter(u => u.id !== userId);
    storageService.set('users', users);

    // Eliminar vehículos del usuario
    let vehicles = storageService.get<any[]>('vehicles') || [];
    vehicles = vehicles.filter(v => v.userId !== userId);
    storageService.set('vehicles', vehicles);

    // Anonimizar publicaciones y comentarios
    let posts = storageService.get<any[]>('posts') || [];
    posts.forEach(post => {
      if (post.userId === userId) {
        post.username = 'Usuario eliminado';
        post.userId = 'deleted';
      }
    });
    storageService.set('posts', posts);

    // Marcar solicitud como completada
    deletionRequests[requestIndex].status = 'completed';
    deletionRequests[requestIndex].completedAt = new Date().toISOString();
    storageService.set('deletionRequests', deletionRequests);

    return { success: true, message: 'Datos de usuario eliminados exitosamente' };
  }

  // Obtener todos los usuarios (admin)
  getAllUsers(filters?: {
    role?: string;
    isActive?: boolean;
    searchTerm?: string;
  }): User[] {
    let users = storageService.get<User[]>('users') || [];

    if (!filters) return users.map(u => this.sanitizeUser(u));

    if (filters.role) {
      users = users.filter(u => u.role === filters.role);
    }

    if (filters.isActive !== undefined) {
      users = users.filter(u => u.isActive === filters.isActive);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      users = users.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term)
      );
    }

    return users.map(u => this.sanitizeUser(u));
  }

  // Obtener estadísticas de usuarios
  getUserStats(): {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  } {
    const users = storageService.get<User[]>('users') || [];

    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      byRole: {
        user: users.filter(u => u.role === 'user').length,
        provider: users.filter(u => u.role === 'provider').length,
        admin: users.filter(u => u.role === 'admin').length
      }
    };

    return stats;
  }

  private sanitizeUser(user: User): User {
    const { password, ...sanitized } = user;
    return sanitized as User;
  }

  private generateId(): string {
    return 'req_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const userService = UserService.getInstance();
