import React from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { Menu, MapPin, ShoppingBag, Users, Star, User, Home, LogOut, Shield } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  isAdmin?: boolean;
}

export function Navigation({ currentView, onViewChange, isAuthenticated, onLogout, isAdmin }: NavigationProps) {
  const menuItems = isAuthenticated 
    ? [
        { id: 'dashboard', label: 'Inicio', icon: Home },
        { id: 'map', label: 'Mapa y Rutas', icon: MapPin },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'social', label: 'Social', icon: Users },
        { id: 'profile', label: 'Mi Perfil', icon: User },
        { id: 'reviews', label: 'Calificaciones', icon: Star },
        ...(isAdmin ? [{ id: 'admin', label: 'Administración', icon: Shield }] : [])
      ]
    : [
        { id: 'landing', label: 'Inicio', icon: Home },
      ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <div>
              <h1 className="text-green-700 font-bold">Rola PET</h1>
              <p className="text-xs text-gray-600">Movilidad</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="ml-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Abrir menú de navegación">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
              <SheetDescription className="sr-only">
                Menú de navegación principal de Rola PET
              </SheetDescription>
              <div className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        currentView === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="mt-4 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}