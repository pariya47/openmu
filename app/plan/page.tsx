"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Calendar,
  Target,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

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
      color: "bg-accent-1"
    },
    {
      title: "Development Phase", 
      icon: <Zap className="h-8 w-8" />,
      description: "Build core AI features and platform",
      timeline: "Q2 2025",
      status: "Planned",
      color: "bg-primary"
    },
    {
      title: "Launch Phase",
      icon: <Users className="h-8 w-8" />,
      description: "Public release and community building",
      timeline: "Q3 2025", 
      status: "Future",
      color: "bg-accent-2"
    }
  ];

  const handleGetNotified = () => {
    toast.success('Thank you for your interest! Notification feature will be implemented soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className={`container mx-auto text-center max-w-4xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="secondary" className="mb-8 text-sm px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            Development Roadmap
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-foreground">
            Our Strategic
            <br />
            <span className="bg-gradient-to-r from-accent-1 to-primary bg-clip-text text-transparent">
              Development Plan
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
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
                  activeCard === index ? 'ring-2 ring-primary shadow-xl scale-105' : 'hover:scale-102'
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
                        plan.status === 'In Progress' ? 'border-accent-1 text-accent-1 bg-accent-1/10' :
                        plan.status === 'Planned' ? 'border-primary text-primary bg-primary/10' :
                        'border-muted-foreground text-muted-foreground bg-muted/10'
                      }`}
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {plan.timeline}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-6">{plan.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Research & Planning
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Team Assembly
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="h-4 w-4 mr-2 border-2 border-border rounded-full" />
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
      <section className="py-20 px-4 bg-gradient-to-r from-accent-1/10 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-accent-1" />
            <h2 className="text-4xl font-bold mb-6 text-foreground">More Details Coming Soon</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're working hard to bring you detailed timelines, milestones, and progress updates. 
              Stay tuned for more comprehensive planning information.
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleGetNotified}
          >
            Get Notified
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground font-lora">mdscholar</span>
            </div>
            
            <p className="text-muted-foreground">
              © 2025 mdscholar. Building the future of research accessibility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}