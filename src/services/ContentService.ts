import { storageService } from './LocalStorageService';
import { moderationService } from './ModerationService';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  type: 'news' | 'social' | 'provider' | 'announcement';
  title?: string;
  content: string;
  mediaUrl?: string[];
  mediaType?: 'image' | 'video' | 'document';
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  isHidden: boolean;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
  isHidden: boolean;
  parentCommentId?: string; // Para comentarios anidados
  replies?: Comment[];
}

export interface ContentFilter {
  keywords?: string[];
  types?: string[];
  userId?: string;
  hideUser?: boolean;
}

class ContentService {
  private static instance: ContentService;

  private constructor() {}

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // RF-25: Crear publicación (con moderación automática)
  createPost(
    userId: string,
    username: string,
    type: 'news' | 'social' | 'provider' | 'announcement',
    content: string,
    title?: string,
    mediaUrl?: string[],
    mediaType?: 'image' | 'video' | 'document'
  ): { success: boolean; message: string; post?: Post } {
    // RF-06 & RF-10: Moderar contenido antes de publicar
    const moderationResult = moderationService.moderateContent(content, userId);

    if (!moderationResult.isAllowed) {
      return {
        success: false,
        message: `Contenido rechazado: ${moderationResult.action === 'auto-ban' 
          ? 'Has sido baneado por uso de lenguaje inapropiado' 
          : 'Contiene palabras prohibidas'}`
      };
    }

    const posts = storageService.get<Post[]>('posts') || [];

    const newPost: Post = {
      id: this.generateId(),
      userId,
      username,
      type,
      title,
      content,
      mediaUrl,
      mediaType,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isApproved: type === 'social', // Social posts auto-approved, news need admin approval
      isHidden: false
    };

    posts.push(newPost);
    storageService.set('posts', posts);

    return { 
      success: true, 
      message: moderationResult.action === 'warn' 
        ? 'Publicación creada con advertencia de moderación' 
        : 'Publicación creada exitosamente',
      post: newPost 
    };
  }

  // RF-23: Editar publicación
  updatePost(
    postId: string,
    userId: string,
    updates: Partial<Post>
  ): { success: boolean; message: string } {
    const posts = storageService.get<Post[]>('posts') || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return { success: false, message: 'Publicación no encontrada' };
    }

    if (posts[postIndex].userId !== userId) {
      return { success: false, message: 'No tienes permiso para editar esta publicación' };
    }

    // Si se actualiza el contenido, moderar nuevamente
    if (updates.content) {
      const moderationResult = moderationService.moderateContent(updates.content, userId);
      if (!moderationResult.isAllowed) {
        return { success: false, message: 'El contenido actualizado contiene palabras prohibidas' };
      }
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      id: postId,
      userId: posts[postIndex].userId,
      updatedAt: new Date().toISOString()
    };

    storageService.set('posts', posts);

    return { success: true, message: 'Publicación actualizada exitosamente' };
  }

  // RF-08: Revisar contenido (Admin)
  reviewPost(postId: string, isApproved: boolean): { success: boolean; message: string } {
    const posts = storageService.get<Post[]>('posts') || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return { success: false, message: 'Publicación no encontrada' };
    }

    posts[postIndex].isApproved = isApproved;
    storageService.set('posts', posts);

    return { success: true, message: isApproved ? 'Publicación aprobada' : 'Publicación rechazada' };
  }

  // RF-22 & RF-34: Crear comentario
  createComment(
    postId: string,
    userId: string,
    username: string,
    content: string,
    parentCommentId?: string
  ): { success: boolean; message: string; comment?: Comment } {
    // Moderar comentario
    const moderationResult = moderationService.moderateContent(content, userId);

    if (!moderationResult.isAllowed) {
      return { success: false, message: 'Comentario rechazado por contenido inapropiado' };
    }

    const posts = storageService.get<Post[]>('posts') || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return { success: false, message: 'Publicación no encontrada' };
    }

    const newComment: Comment = {
      id: this.generateId(),
      postId,
      userId,
      username,
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
      isHidden: false,
      parentCommentId,
      replies: []
    };

    if (parentCommentId) {
      // Es una respuesta a un comentario
      const parentComment = this.findCommentById(posts[postIndex].comments, parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(newComment);
      }
    } else {
      // Es un comentario principal
      posts[postIndex].comments.push(newComment);
    }

    storageService.set('posts', posts);

    // Guardar también en colección de comentarios global
    const allComments = storageService.get<Comment[]>('comments') || [];
    allComments.push(newComment);
    storageService.set('comments', allComments);

    return { success: true, message: 'Comentario publicado', comment: newComment };
  }

  // RF-20: Dar me gusta a publicación
  likePost(postId: string, userId: string): { success: boolean; message: string } {
    const posts = storageService.get<Post[]>('posts') || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return { success: false, message: 'Publicación no encontrada' };
    }

    const likes = storageService.get<Record<string, string[]>>('postLikes') || {};
    if (!likes[postId]) likes[postId] = [];

    if (likes[postId].includes(userId)) {
      return { success: false, message: 'Ya le diste me gusta a esta publicación' };
    }

    likes[postId].push(userId);
    posts[postIndex].likes++;

    storageService.set('posts', posts);
    storageService.set('postLikes', likes);

    return { success: true, message: 'Me gusta registrado' };
  }

  // RF-21: Quitar me gusta
  unlikePost(postId: string, userId: string): { success: boolean; message: string } {
    const posts = storageService.get<Post[]>('posts') || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return { success: false, message: 'Publicación no encontrada' };
    }

    const likes = storageService.get<Record<string, string[]>>('postLikes') || {};
    if (!likes[postId] || !likes[postId].includes(userId)) {
      return { success: false, message: 'No le has dado me gusta a esta publicación' };
    }

    likes[postId] = likes[postId].filter(id => id !== userId);
    posts[postIndex].likes--;

    storageService.set('posts', posts);
    storageService.set('postLikes', likes);

    return { success: true, message: 'Me gusta eliminado' };
  }

  // RF-05: Obtener publicaciones con filtros
  getPosts(filters?: ContentFilter): Post[] {
    let posts = storageService.get<Post[]>('posts') || [];

    // Solo mostrar publicaciones aprobadas por defecto
    posts = posts.filter(p => p.isApproved && !p.isHidden);

    if (!filters) return posts;

    if (filters.types && filters.types.length > 0) {
      posts = posts.filter(p => filters.types!.includes(p.type));
    }

    if (filters.userId) {
      posts = posts.filter(p => p.userId === filters.userId);
    }

    if (filters.keywords && filters.keywords.length > 0) {
      posts = posts.filter(p => {
        const content = (p.title + ' ' + p.content).toLowerCase();
        return filters.keywords!.some(keyword => content.includes(keyword.toLowerCase()));
      });
    }

    return posts;
  }

  // Obtener publicación por ID
  getPostById(postId: string): Post | null {
    const posts = storageService.get<Post[]>('posts') || [];
    return posts.find(p => p.id === postId) || null;
  }

  // Ocultar publicación (soft delete)
  hidePost(postId: string): { success: boolean; message: string } {
    const posts = storageService.get<Post[]>('posts') || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return { success: false, message: 'Publicación no encontrada' };
    }

    posts[postIndex].isHidden = true;
    storageService.set('posts', posts);

    return { success: true, message: 'Publicación ocultada' };
  }

  // Ocultar comentario
  hideComment(commentId: string): { success: boolean; message: string } {
    const comments = storageService.get<Comment[]>('comments') || [];
    const commentIndex = comments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
      return { success: false, message: 'Comentario no encontrado' };
    }

    comments[commentIndex].isHidden = true;
    storageService.set('comments', comments);

    // También ocultarlo en el post
    const posts = storageService.get<Post[]>('posts') || [];
    posts.forEach(post => {
      const comment = this.findCommentById(post.comments, commentId);
      if (comment) {
        comment.isHidden = true;
      }
    });
    storageService.set('posts', posts);

    return { success: true, message: 'Comentario ocultado' };
  }

  private findCommentById(comments: Comment[], commentId: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      if (comment.replies && comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  }

  private generateId(): string {
    return 'post_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const contentService = ContentService.getInstance();
