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
  Rocket,
  Brain,
  Zap,
  Users
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

  const researchChallenges = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time-Intensive Analysis",
      description: "Researchers spend countless hours parsing dense academic papers, often struggling to extract key insights efficiently.",
      gradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      borderColor: "border-amber-200"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Complex Language Barriers",
      description: "Academic jargon and technical terminology create accessibility barriers for interdisciplinary collaboration.",
      gradient: "from-blue-500/10 to-indigo-500/10",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      borderColor: "border-blue-200"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Information Fragmentation",
      description: "Critical insights are scattered across multiple papers, making it difficult to synthesize comprehensive understanding.",
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      borderColor: "border-emerald-200"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Knowledge Silos",
      description: "Valuable research remains isolated within academic circles, limiting its potential impact on real-world applications.",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
      borderColor: "border-purple-200"
    }
  ];

  const handleExploreResearches = () => {
    router.push('/papers');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto text-center max-w-5xl relative animate-hero-fade-in">
          <Badge variant="secondary" className="mb-6 sm:mb-8 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Revolutionizing Academic Research
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-black">
            Make Research Accessible
            <br />
            to Everyone
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            mdscholar transforms complex academic research into clear, actionable
            insights. Discover, understand, and apply knowledge faster than ever before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/test-upload">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Upload className="mr-3 h-5 w-5" />
                Upload a new one
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleExploreResearches}
            >
              <Search className="mr-3 h-5 w-5" />
              Explore researches
            </Button>
          </div>
        </div>
      </section>

      {/* Research Challenge Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-slate-100 rounded-full mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                <Zap className="h-6 w-6 text-slate-700" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
              Research Challenges We Solve
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Academic research faces fundamental barriers that limit knowledge accessibility and collaboration. 
              We're building solutions to bridge these gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {researchChallenges.map((challenge, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden border-2 ${challenge.borderColor} bg-gradient-to-br ${challenge.gradient} hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]`}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                
                <CardHeader className="relative pb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-4 rounded-2xl ${challenge.iconBg} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors duration-300">
                        {challenge.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {challenge.description}
                  </p>
                  
                  {/* Subtle hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center space-x-2 text-slate-600 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-slate-300" />
              <span className="text-sm font-medium">Ready to overcome these challenges?</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-slate-300" />
            </div>
            <Button 
              size="lg" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              onClick={handleExploreResearches}
            >
              <Search className="mr-3 h-5 w-5" />
              Start Exploring Research
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}