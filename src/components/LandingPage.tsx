import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MapPin, ShoppingBag, Users, Star, ArrowRight, Zap, Shield, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onViewChange: (view: string) => void;
}

export function LandingPage({ onViewChange }: LandingPageProps) {
  const features = [
    {
      icon: MapPin,
      title: 'Rutas Inteligentes',
      description: 'Encuentra las mejores rutas a través de ciclorrutas en Bogotá'
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace Digital',
      description: 'Compra y vende productos relacionados con vehículos eléctricos'
    },
    {
      icon: Users,
      title: 'Comunidad Segura',
      description: 'Conecta con otros usuarios en un ambiente social seguro'
    },
    {
      icon: Star,
      title: 'Calificaciones',
      description: 'Califica rutas y servicios para ayudar a la comunidad'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Movilidad Sostenible',
      description: 'Contribuye al medio ambiente con transporte eléctrico'
    },
    {
      icon: Shield,
      title: 'Seguridad Primero',
      description: 'Rutas verificadas y comunidad confiable'
    },
    {
      icon: Heart,
      title: 'Comunidad Unida',
      description: 'Parte de la asociación Rola PET en Bogotá'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                  Movilidad <span className="text-green-600">Eléctrica</span> en Bogotá
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Únete a la comunidad Rola PET y descubre la mejor manera de moverte por la ciudad con scooters, bicicletas y motos eléctricas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  onClick={() => onViewChange('register')}
                >
                  Únete a la Comunidad
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
                  onClick={() => onViewChange('login')}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 p-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1713254249770-7e9a688064d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBjaXR5fGVufDF8fHx8MTc1ODU4MTU1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Scooter eléctrico en la ciudad"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en una plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre, conecta y muévete de manera inteligente por Bogotá
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                ¿Por qué elegir Rola PET?
              </h2>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1692668696811-90976b749459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGJpY3ljbGUlMjB1cmJhbnxlbnwxfHx8fDE3NTg2NDU3MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Bicicleta eléctrica"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1617134380746-5f313a64a6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU4NjQ1NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Accesorios"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1657193995891-8c7e11ea826a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMG1vdG9yY3ljbGUlMjBzdHJlZXR8ZW58MXx8fHwxNzU4NjQ1NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Moto eléctrica"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Comienza tu viaje hoy!
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Únete a miles de usuarios que ya disfrutan de la movilidad eléctrica en Bogotá
          </p>
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
            onClick={() => onViewChange('register')}
          >
            Registrarse Gratis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}