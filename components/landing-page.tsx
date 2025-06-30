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

const testimonials = [
  {
    category: 'researcher',
    name: 'Dr. Sarah Chen',
    quote: 'mdscholar has revolutionized how I approach literature reviews. What used to take weeks now takes days.',
    role: 'Research Scientist, MIT'
  },
  {
    category: 'student',
    name: 'Marcus Johnson',
    quote: 'As a PhD student, mdscholar helps me stay on top of the latest research in my field effortlessly.',
    role: 'PhD Candidate, Stanford University'
  },
  {
    category: 'professional',
    name: 'Lisa Rodriguez',
    quote: 'The insights from mdscholar directly inform our product development decisions.',
    role: 'Head of R&D, TechCorp'
  },
  {
    category: 'researcher',
    name: 'Prof. David Kim',
    quote: 'mdscholar bridges the gap between complex research and practical application beautifully.',
    role: 'Professor of Computer Science, UC Berkeley'
  },
  {
    category: 'student',
    name: 'Emma Thompson',
    quote: 'Finally, a tool that makes academic papers accessible without losing the depth.',
    role: 'Graduate Student, Harvard'
  },
  {
    category: 'professional',
    name: 'Alex Martinez',
    quote: 'mdscholar saves our team countless hours of research while improving decision quality.',
    role: 'Strategy Director, Innovation Labs'
  }
];

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
            Join thousands of researchers, students, and professionals who are already using mdscholar to accelerate their work and unlock new insights.
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleExploreResearches}
            >
              <Search className="mr-3 h-5 w-5" />
              Explore research
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}