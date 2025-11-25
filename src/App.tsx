import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { AuthPages } from './components/AuthPages';
import { Dashboard } from './components/Dashboard';
import { MapView } from './components/MapView';
import { Marketplace } from './components/Marketplace';
import { SocialView } from './components/SocialView';
import { UserProfile } from './components/UserProfile';
import { ReviewsView } from './components/ReviewsView';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Verificar si el usuario es administrador
    if (userData?.email === 'admin@rolapet.com' || userData?.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentView('landing');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onViewChange={handleViewChange} />;
      
      case 'login':
        return (
          <AuthPages 
            view="login" 
            onViewChange={handleViewChange} 
            onLogin={handleLogin}
          />
        );
      
      case 'register':
        return (
          <AuthPages 
            view="register" 
            onViewChange={handleViewChange} 
            onLogin={handleLogin}
          />
        );
      
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onViewChange={handleViewChange} 
          />
        );
      
      case 'map':
        return <MapView onViewChange={handleViewChange} />;
      
      case 'marketplace':
        return <Marketplace onViewChange={handleViewChange} />;
      
      case 'social':
        return (
          <SocialView 
            user={user} 
            onViewChange={handleViewChange} 
          />
        );
      
      case 'profile':
        return (
          <UserProfile 
            user={user} 
            onViewChange={handleViewChange} 
          />
        );
      
      case 'reviews':
        return <ReviewsView onViewChange={handleViewChange} />;
      
      case 'admin':
        return isAdmin ? (
          <AdminPanel onViewChange={handleViewChange} />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
              <p className="text-gray-600 mb-6">No tienes permisos para acceder al panel de administración.</p>
              <button 
                onClick={() => handleViewChange('dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        );
      
      default:
        return <LandingPage onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show navigation only for authenticated views or auth pages, but not for admin panel */}
      {(isAuthenticated || ['login', 'register'].includes(currentView)) && currentView !== 'admin' && (
        <Navigation
          currentView={currentView}
          onViewChange={handleViewChange}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      )}
      
      {/* Main content */}
      <main className={isAuthenticated || ['login', 'register'].includes(currentView) ? '' : ''}>
        {renderCurrentView()}
      </main>
    </div>
  );
}