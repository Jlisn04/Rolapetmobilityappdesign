import { storageService } from './LocalStorageService';
import type { Product } from './ProviderService';

export interface Rating {
  id: string;
  userId: string;
  targetId: string; // ID del producto, proveedor o punto de interés
  targetType: 'product' | 'provider' | 'pointOfInterest' | 'route';
  rating: number; // 1-5 estrellas
  comment?: string;
  createdAt: string;
  purchaseDate?: string; // Para validar tiempo de calificación
  images?: string[];
  likes: number;
  dislikes: number;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  providerId: string;
  purchaseDate: string;
  hasRated: boolean;
}

class RatingService {
  private static instance: RatingService;
  private readonly ratingWindowDays = 60; // RF-39: 60 días para calificar

  private constructor() {}

  public static getInstance(): RatingService {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService();
    }
    return RatingService.instance;
  }

  // RF-28, RF-29, RF-38: Crear calificación
  createRating(
    userId: string,
    targetId: string,
    targetType: 'product' | 'provider' | 'pointOfInterest' | 'route',
    rating: number,
    comment?: string,
    purchaseDate?: string
  ): { success: boolean; message: string; rating?: Rating } {
    // Validaciones
    if (rating < 1 || rating > 5) {
      return { success: false, message: 'La calificación debe estar entre 1 y 5 estrellas' };
    }

    // RF-39: Validar ventana de tiempo para productos
    if (targetType === 'product' && purchaseDate) {
      const daysSincePurchase = this.getDaysSince(new Date(purchaseDate));
      if (daysSincePurchase > this.ratingWindowDays) {
        return { 
          success: false, 
          message: `Solo puedes calificar productos dentro de los ${this.ratingWindowDays} días posteriores a la compra` 
        };
      }
    }

    const ratings = storageService.get<Rating[]>('ratings') || [];

    // Verificar si el usuario ya calificó este item
    const existingRating = ratings.find(
      r => r.userId === userId && r.targetId === targetId && r.targetType === targetType
    );

    if (existingRating) {
      return { success: false, message: 'Ya has calificado este elemento' };
    }

    const newRating: Rating = {
      id: this.generateId(),
      userId,
      targetId,
      targetType,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      purchaseDate,
      likes: 0,
      dislikes: 0
    };

    ratings.push(newRating);
    storageService.set('ratings', ratings);

    // Actualizar rating promedio del objetivo
    this.updateTargetRating(targetId, targetType);

    // Si es un producto, marcar la compra como calificada
    if (targetType === 'product' && purchaseDate) {
      this.markPurchaseAsRated(userId, targetId);
    }

    return { success: true, message: 'Calificación registrada exitosamente', rating: newRating };
  }

  // RF-20: Dar me gusta a una publicación/calificación
  likeRating(ratingId: string, userId: string): { success: boolean; message: string } {
    const ratings = storageService.get<Rating[]>('ratings') || [];
    const ratingIndex = ratings.findIndex(r => r.id === ratingId);

    if (ratingIndex === -1) {
      return { success: false, message: 'Calificación no encontrada' };
    }

    // Verificar si ya le dio like
    const likes = storageService.get<Record<string, string[]>>('ratingLikes') || {};
    if (!likes[ratingId]) {
      likes[ratingId] = [];
    }

    if (likes[ratingId].includes(userId)) {
      return { success: false, message: 'Ya le diste me gusta a esta calificación' };
    }

    likes[ratingId].push(userId);
    ratings[ratingIndex].likes++;

    storageService.set('ratings', ratings);
    storageService.set('ratingLikes', likes);

    return { success: true, message: 'Me gusta registrado' };
  }

  // RF-21: Quitar me gusta
  unlikeRating(ratingId: string, userId: string): { success: boolean; message: string } {
    const ratings = storageService.get<Rating[]>('ratings') || [];
    const ratingIndex = ratings.findIndex(r => r.id === ratingId);

    if (ratingIndex === -1) {
      return { success: false, message: 'Calificación no encontrada' };
    }

    const likes = storageService.get<Record<string, string[]>>('ratingLikes') || {};
    if (!likes[ratingId] || !likes[ratingId].includes(userId)) {
      return { success: false, message: 'No le has dado me gusta a esta calificación' };
    }

    likes[ratingId] = likes[ratingId].filter(id => id !== userId);
    ratings[ratingIndex].likes--;

    storageService.set('ratings', ratings);
    storageService.set('ratingLikes', likes);

    return { success: true, message: 'Me gusta eliminado' };
  }

  // Obtener calificaciones de un objetivo
  getRatings(targetId: string, targetType: string): Rating[] {
    const ratings = storageService.get<Rating[]>('ratings') || [];
    return ratings.filter(r => r.targetId === targetId && r.targetType === targetType);
  }

  // Obtener calificación promedio
  getAverageRating(targetId: string, targetType: string): { average: number; count: number } {
    const ratings = this.getRatings(targetId, targetType);
    
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: sum / ratings.length,
      count: ratings.length
    };
  }

  // RF-36: Registrar compra
  registerPurchase(
    userId: string,
    productId: string,
    providerId: string
  ): { success: boolean; message: string; purchase?: Purchase } {
    const purchases = storageService.get<Purchase[]>('purchases') || [];

    const newPurchase: Purchase = {
      id: this.generateId(),
      userId,
      productId,
      providerId,
      purchaseDate: new Date().toISOString(),
      hasRated: false
    };

    purchases.push(newPurchase);
    storageService.set('purchases', purchases);

    return { success: true, message: 'Compra registrada', purchase: newPurchase };
  }

  // RF-33: Verificar si debe mostrar alerta de calificación
  shouldShowRatingAlert(userId: string): Purchase[] {
    const purchases = storageService.get<Purchase[]>('purchases') || [];
    const userPurchases = purchases.filter(
      p => p.userId === userId && !p.hasRated
    );

    // Filtrar compras dentro de la ventana de tiempo
    return userPurchases.filter(purchase => {
      const daysSincePurchase = this.getDaysSince(new Date(purchase.purchaseDate));
      return daysSincePurchase <= this.ratingWindowDays;
    });
  }

  // Marcar compra como calificada
  private markPurchaseAsRated(userId: string, productId: string): void {
    const purchases = storageService.get<Purchase[]>('purchases') || [];
    const purchaseIndex = purchases.findIndex(
      p => p.userId === userId && p.productId === productId && !p.hasRated
    );

    if (purchaseIndex !== -1) {
      purchases[purchaseIndex].hasRated = true;
      storageService.set('purchases', purchases);
    }
  }

  // Actualizar rating promedio del objetivo
  private updateTargetRating(targetId: string, targetType: string): void {
    const { average, count } = this.getAverageRating(targetId, targetType);

    if (targetType === 'product') {
      const products = storageService.get<Product[]>('products') || [];
      const productIndex = products.findIndex(p => p.id === targetId);
      if (productIndex !== -1) {
        products[productIndex].rating = average;
        products[productIndex].reviewCount = count;
        storageService.set('products', products);
      }
    } else if (targetType === 'provider') {
      const providers = storageService.get<any[]>('providers') || [];
      const providerIndex = providers.findIndex(p => p.id === targetId);
      if (providerIndex !== -1) {
        providers[providerIndex].rating = average;
        providers[providerIndex].reviewCount = count;
        storageService.set('providers', providers);
      }
    }
  }

  private getDaysSince(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateId(): string {
    return 'rat_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const ratingService = RatingService.getInstance();
