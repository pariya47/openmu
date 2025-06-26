"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BookOpen, Search, Clock, AlertCircle, Target, Globe, Sparkles, Upload, DivideIcon as LucideIcon } from 'lucide-react';

// Types for better type safety (SOLID - Interface Segregation)
interface PainPoint {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  iconColor: string;
}

interface FooterSection {
  title: string;
  links: string[];
}

interface StatusIndicator {
  text: string;
  color: string;
}

// Data constants (DRY - Don't Repeat Yourself)
const PAIN_POINTS: PainPoint[] = [
  {
    icon: Clock,
    title: "Time-Consuming Research",
    subtitle: "3-5 hours per paper",
    description: "Hours spent deciphering complex academic language",
    iconColor: "text-red-500"
  },
  {
    icon: AlertCircle,
    title: "Information Overload", 
    subtitle: "1000+ papers daily",
    description: "Overwhelming volume of research across multiple disciplines",
    iconColor: "text-orange-500"
  },
  {
    icon: Target,
    title: "Relevance Filtering",
    subtitle: "70% irrelevant results", 
    description: "Difficulty identifying the most impactful and relevant studies",
    iconColor: "text-blue-500"
  },
  {
    icon: Globe,
    title: "Knowledge Gaps",
    subtitle: "Siloed insights",
    description: "Missing connections between related research areas",
    iconColor: "text-gray-500"
  }
];

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Product",
    links: ["Features", "Pricing", "API", "Integrations"]
  },
  {
    title: "Company", 
    links: ["About", "Blog", "Careers", "Press"]
  },
  {
    title: "Support",
    links: ["Documentation", "Community", "Contact", "Status"]
  }
];

const STATUS_INDICATORS: StatusIndicator[] = [
  { text: "Early access Q1 2025", color: "bg-green-500" },
  { text: "No credit card required", color: "bg-green-500" },
  { text: "Free trial included", color: "bg-green-500" }
];

// Reusable Components (SOLID - Single Responsibility Principle)
interface PainPointCardProps {
  painPoint: PainPoint;
  index: number;
}

function PainPointCard({ painPoint, index }: PainPointCardProps) {
  const { icon: Icon, title, subtitle, description, iconColor } = painPoint;
  
  return (
    <Card 
      key={index} 
      className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white"
    >
      <CardHeader className="pb-4">
        <div className="mx-auto mb-6 p-4 rounded-2xl bg-gray-50 w-fit">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <CardTitle className="text-xl mb-2 text-black">{title}</CardTitle>
        <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
          {subtitle}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

interface HeroSectionProps {
  className?: string;
}

function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={`pt-20 pb-16 px-4 relative ${className || ''}`}>
      <div className="container mx-auto text-center max-w-4xl">
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
              Upload Paper
            </Button>
          </Link>
          <Link href="/read">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="mr-3 h-5 w-5" />
              Explore Research
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface StatusIndicatorProps {
  indicators: StatusIndicator[];
}

function StatusIndicators({ indicators }: StatusIndicatorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className={`w-2 h-2 ${indicator.color} rounded-full`}></div>
          <span>{indicator.text}</span>
        </div>
      ))}
    </div>
  );
}

interface FooterSectionProps {
  section: FooterSection;
}

function FooterSectionComponent({ section }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-black">{section.title}</h3>
      <div className="space-y-3 text-gray-600">
        {section.links.map((link, index) => (
          <p key={index} className="hover:text-black transition-colors cursor-pointer">
            {link}
          </p>
        ))}
      </div>
    </div>
  );
}

// Main Component (KISS - Keep It Simple)
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

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
            {PAIN_POINTS.map((painPoint, index) => (
              <PainPointCard key={index} painPoint={painPoint} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of researchers, students, and professionals who are already using mdscholar 
            to accelerate their work and unlock new insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/test-upload">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/plan">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Learn More
              </Button>
            </Link>
          </div>

          <StatusIndicators indicators={STATUS_INDICATORS} />
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
                <span className="text-xl font-bold text-black">mdscholar</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Making academic research accessible to everyone through AI-powered insights and intelligent search.
              </p>
            </div>

            {FOOTER_SECTIONS.map((section, index) => (
              <FooterSectionComponent key={index} section={section} />
            ))}
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">
              © 2025 mdscholar. All rights reserved.
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