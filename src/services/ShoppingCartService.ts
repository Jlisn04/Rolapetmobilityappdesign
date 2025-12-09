import { storageService } from './LocalStorageService';
import type { Product } from './ProviderService';

export interface CartItem {
  id: string;
  userId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

class ShoppingCartService {
  private static instance: ShoppingCartService;

  private constructor() {}

  public static getInstance(): ShoppingCartService {
    if (!ShoppingCartService.instance) {
      ShoppingCartService.instance = new ShoppingCartService();
    }
    return ShoppingCartService.instance;
  }

  // RF-35: Agregar al carrito
  addToCart(
    userId: string,
    product: Product,
    quantity: number = 1
  ): { success: boolean; message: string; cartItem?: CartItem } {
    if (quantity <= 0) {
      return { success: false, message: 'La cantidad debe ser mayor a 0' };
    }

    if (!product.isAvailable) {
      return { success: false, message: 'El producto no está disponible' };
    }

    if (product.stock !== undefined && quantity > product.stock) {
      return { success: false, message: 'Stock insuficiente' };
    }

    const cart = storageService.get<CartItem[]>('cart') || [];
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(
      item => item.userId === userId && item.product.id === product.id
    );

    if (existingItemIndex !== -1) {
      // Actualizar cantidad
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      
      if (product.stock !== undefined && newQuantity > product.stock) {
        return { success: false, message: 'Stock insuficiente para la cantidad solicitada' };
      }

      cart[existingItemIndex].quantity = newQuantity;
      storageService.set('cart', cart);

      return { 
        success: true, 
        message: 'Cantidad actualizada en el carrito',
        cartItem: cart[existingItemIndex]
      };
    }

    // Agregar nuevo item
    const newItem: CartItem = {
      id: this.generateId(),
      userId,
      product,
      quantity,
      addedAt: new Date().toISOString()
    };

    cart.push(newItem);
    storageService.set('cart', cart);

    return { success: true, message: 'Producto agregado al carrito', cartItem: newItem };
  }

  // Actualizar cantidad en el carrito
  updateCartItemQuantity(
    cartItemId: string,
    userId: string,
    quantity: number
  ): { success: boolean; message: string } {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId, userId);
    }

    const cart = storageService.get<CartItem[]>('cart') || [];
    const itemIndex = cart.findIndex(item => item.id === cartItemId && item.userId === userId);

    if (itemIndex === -1) {
      return { success: false, message: 'Producto no encontrado en el carrito' };
    }

    const product = cart[itemIndex].product;
    if (product.stock !== undefined && quantity > product.stock) {
      return { success: false, message: 'Stock insuficiente' };
    }

    cart[itemIndex].quantity = quantity;
    storageService.set('cart', cart);

    return { success: true, message: 'Cantidad actualizada' };
  }

  // Remover del carrito
  removeFromCart(cartItemId: string, userId: string): { success: boolean; message: string } {
    let cart = storageService.get<CartItem[]>('cart') || [];
    const initialLength = cart.length;

    cart = cart.filter(item => !(item.id === cartItemId && item.userId === userId));

    if (cart.length === initialLength) {
      return { success: false, message: 'Producto no encontrado en el carrito' };
    }

    storageService.set('cart', cart);
    return { success: true, message: 'Producto eliminado del carrito' };
  }

  // Obtener carrito de usuario
  getUserCart(userId: string): CartItem[] {
    const cart = storageService.get<CartItem[]>('cart') || [];
    return cart.filter(item => item.userId === userId);
  }

  // Limpiar carrito
  clearCart(userId: string): { success: boolean; message: string } {
    let cart = storageService.get<CartItem[]>('cart') || [];
    cart = cart.filter(item => item.userId !== userId);
    storageService.set('cart', cart);

    return { success: true, message: 'Carrito limpiado' };
  }

  // Calcular total del carrito
  getCartTotal(userId: string): { subtotal: number; itemCount: number } {
    const cart = this.getUserCart(userId);
    
    const subtotal = cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, itemCount };
  }

  // WISHLIST

  // Agregar a wishlist
  addToWishlist(userId: string, productId: string): { success: boolean; message: string } {
    const wishlist = storageService.get<Wishlist[]>('wishlist') || [];

    // Verificar si ya está en wishlist
    if (wishlist.find(item => item.userId === userId && item.productId === productId)) {
      return { success: false, message: 'El producto ya está en tu lista de deseos' };
    }

    const newItem: Wishlist = {
      id: this.generateId(),
      userId,
      productId,
      addedAt: new Date().toISOString()
    };

    wishlist.push(newItem);
    storageService.set('wishlist', wishlist);

    return { success: true, message: 'Producto agregado a lista de deseos' };
  }

  // Remover de wishlist
  removeFromWishlist(userId: string, productId: string): { success: boolean; message: string } {
    let wishlist = storageService.get<Wishlist[]>('wishlist') || [];
    const initialLength = wishlist.length;

    wishlist = wishlist.filter(item => !(item.userId === userId && item.productId === productId));

    if (wishlist.length === initialLength) {
      return { success: false, message: 'Producto no encontrado en lista de deseos' };
    }

    storageService.set('wishlist', wishlist);
    return { success: true, message: 'Producto eliminado de lista de deseos' };
  }

  // Obtener wishlist de usuario
  getUserWishlist(userId: string): string[] {
    const wishlist = storageService.get<Wishlist[]>('wishlist') || [];
    return wishlist
      .filter(item => item.userId === userId)
      .map(item => item.productId);
  }

  // Verificar si producto está en wishlist
  isInWishlist(userId: string, productId: string): boolean {
    const wishlist = this.getUserWishlist(userId);
    return wishlist.includes(productId);
  }

  private generateId(): string {
    return 'cart_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const shoppingCartService = ShoppingCartService.getInstance();
