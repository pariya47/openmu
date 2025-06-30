"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Clock, 
  AlertCircle,
  Target,
  Globe,
  Sparkles,
  Upload,
  ExternalLink,
  ArrowRight,
  Rocket
} from 'lucide-react';

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const painPoints = [
    {
      icon: <Clock className="h-6 w-6 text-warning" />,
      title: "Time-Consuming Research",
      subtitle: "3-5 hours per paper",
      description: "Hours spent deciphering complex academic language"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-destructive" />,
      title: "Information Overload", 
      subtitle: "1000+ papers daily",
      description: "Overwhelming volume of research across multiple disciplines"
    },
    {
      icon: <Target className="h-6 w-6 text-accent-1" />,
      title: "Relevance Filtering",
      subtitle: "70% irrelevant results", 
      description: "Difficulty identifying the most impactful and relevant studies"
    },
    {
      icon: <Globe className="h-6 w-6 text-muted-foreground" />,
      title: "Knowledge Gaps",
      subtitle: "Siloed insights",
      description: "Missing connections between related research areas"
    }
  ];

  const handleExploreResearches = () => {
    router.push('/papers');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto text-center max-w-5xl relative animate-hero-fade-in">
          <Badge variant="secondary" className="mb-6 sm:mb-8 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Revolutionizing Academic Research
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-foreground">
            Make Research Accessible
            <br />
            to Everyone
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            mdscholar transforms complex academic research into clear, actionable
            insights. Discover, understand, and apply knowledge faster than ever before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              asChild
            >
              <Link href="/test-upload">
                <Upload className="mr-3 h-5 w-5" />
                Upload a new one
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleExploreResearches}
            >
              <Search className="mr-3 h-5 w-5" />
              Explore researches
            </Button>
          </div>
        </div>
      </section>

      {/* Research Challenge Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">The Research Challenge</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Academic research shouldn't be a barrier to knowledge. Here's what researchers face daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-6 p-4 rounded-2xl bg-muted w-fit">
                    {point.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{point.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {point.subtitle}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to Transform Your Research?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of researchers, students, and professionals who are already using mdscholar to accelerate their work and unlock new insights.
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleExploreResearches}
            >
              <Search className="mr-3 h-5 w-5" />
              Explore research
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Early access Q1 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Free trial included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-foreground font-lora">mdscholar</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Making academic research accessible to everyone through AI-powered insights and intelligent search.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="hover:text-foreground transition-colors cursor-pointer">Features</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Pricing</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">API</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Integrations</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="hover:text-foreground transition-colors cursor-pointer">About</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Blog</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Careers</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Press</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="hover:text-foreground transition-colors cursor-pointer">Documentation</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Community</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Contact</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Status</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2025 mdscholar. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}