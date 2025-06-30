"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function PlanPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-cycle through cards for demo effect
    const interval = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      title: "Research Phase",
      icon: <Target className="h-8 w-8" />,
      description: "Define objectives and methodology",
      timeline: "Q1 2025",
      status: "In Progress",
      color: "bg-blue-500"
    },
    {
      title: "Development Phase", 
      icon: <Zap className="h-8 w-8" />,
      description: "Build core AI features and platform",
      timeline: "Q2 2025",
      status: "Planned",
      color: "bg-purple-500"
    },
    {
      title: "Launch Phase",
      icon: <Users className="h-8 w-8" />,
      description: "Public release and community building",
      timeline: "Q3 2025", 
      status: "Future",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className={`container mx-auto text-center max-w-4xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="secondary" className="mb-8 text-sm px-4 py-2 bg-blue-100 text-blue-700 border-0">
            <Calendar className="h-4 w-4 mr-2" />
            Development Roadmap
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-black">
            Our Strategic
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Development Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Follow our journey as we build the future of academic research accessibility. 
            Each phase brings us closer to revolutionizing how knowledge is shared and understood.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                  activeCard === index ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setActiveCard(index)}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${plan.color}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${plan.color} text-white`}>
                      {plan.icon}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        plan.status === 'In Progress' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                        plan.status === 'Planned' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                        'border-gray-500 text-gray-700 bg-gray-50'
                      }`}
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl mb-2 text-black">{plan.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {plan.timeline}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-6">{plan.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Research & Planning
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Team Assembly
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="h-4 w-4 mr-2 border-2 border-gray-300 rounded-full" />
                      Implementation
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-blue-500" />
            <h2 className="text-4xl font-bold mb-6 text-black">More Details Coming Soon</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're working hard to bring you detailed timelines, milestones, and progress updates. 
              Stay tuned for more comprehensive planning information.
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Notified
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-black text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-black">mdscholar</span>
            </div>
            
            <p className="text-gray-600">
              © 2025 mdscholar. Building the future of research accessibility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}