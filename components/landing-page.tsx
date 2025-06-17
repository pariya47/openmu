"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Clock, 
  AlertCircle,
  Target,
  Globe,
  Sparkles,
  Upload,
  ExternalLink
} from 'lucide-react';

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const painPoints = [
    {
      icon: <Clock className="h-6 w-6 text-red-500" />,
      title: "Time-Consuming Research",
      subtitle: "3-5 hours per paper",
      description: "Hours spent deciphering complex academic language"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      title: "Information Overload", 
      subtitle: "1000+ papers daily",
      description: "Overwhelming volume of research across multiple disciplines"
    },
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Relevance Filtering",
      subtitle: "70% irrelevant results", 
      description: "Difficulty identifying the most impactful and relevant studies"
    },
    {
      icon: <Globe className="h-6 w-6 text-gray-500" />,
      title: "Knowledge Gaps",
      subtitle: "Siloed insights",
      description: "Missing connections between related research areas"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-black text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-black">OpenMU</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button className="text-gray-600 hover:text-black transition-colors font-medium">
                HOME
              </button>
              <button className="text-gray-600 hover:text-black transition-colors font-medium">
                PLAN
              </button>
              <button className="text-gray-600 hover:text-black transition-colors font-medium">
                Donate
              </button>
              <button className="text-gray-600 hover:text-black transition-colors font-medium">
                JoinUs
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative">
        <div className={`container mx-auto text-center max-w-4xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="secondary" className="mb-8 text-sm px-4 py-2 bg-gray-100 text-gray-700 border-0">
            <Sparkles className="h-4 w-4 mr-2" />
            Revolutionizing Academic Research
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-black">
            Make Research Accessible
            <br />
            to Everyone
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            OpenMU transforms complex academic research into clear, actionable
            insights. Discover, understand, and apply knowledge faster than ever before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Upload className="mr-3 h-5 w-5" />
              Upload a new one
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="mr-3 h-5 w-5" />
              Explore researches
            </Button>
          </div>

          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            Coming Soon - Early 2025
          </div>
        </div>
      </section>

      {/* Research Challenge Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black">The Research Challenge</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Academic research shouldn't be a barrier to knowledge. Here's what researchers face daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-6 p-4 rounded-2xl bg-gray-50 w-fit">
                    {point.icon}
                  </div>
                  <CardTitle className="text-xl mb-2 text-black">{point.title}</CardTitle>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    {point.subtitle}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Ready to Transform Your Research?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of researchers, students, and professionals who are already using OpenMU to accelerate their work and unlock new insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Join Waitlist
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Early access Q1 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free trial included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-black text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-black">OpenMU</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Making academic research accessible to everyone through AI-powered insights and intelligent search.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black">Product</h3>
              <div className="space-y-3 text-gray-600">
                <p className="hover:text-black transition-colors cursor-pointer">Features</p>
                <p className="hover:text-black transition-colors cursor-pointer">Pricing</p>
                <p className="hover:text-black transition-colors cursor-pointer">API</p>
                <p className="hover:text-black transition-colors cursor-pointer">Integrations</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black">Company</h3>
              <div className="space-y-3 text-gray-600">
                <p className="hover:text-black transition-colors cursor-pointer">About</p>
                <p className="hover:text-black transition-colors cursor-pointer">Blog</p>
                <p className="hover:text-black transition-colors cursor-pointer">Careers</p>
                <p className="hover:text-black transition-colors cursor-pointer">Press</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black">Support</h3>
              <div className="space-y-3 text-gray-600">
                <p className="hover:text-black transition-colors cursor-pointer">Documentation</p>
                <p className="hover:text-black transition-colors cursor-pointer">Community</p>
                <p className="hover:text-black transition-colors cursor-pointer">Contact</p>
                <p className="hover:text-black transition-colors cursor-pointer">Status</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">
              © 2025 OpenMU. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600 mt-4 md:mt-0">
              <span className="hover:text-black transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-black transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-black transition-colors cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}