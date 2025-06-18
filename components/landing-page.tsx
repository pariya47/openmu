"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Search, 
  Zap, 
  Users, 
  GraduationCap, 
  Microscope, 
  Briefcase, 
  Heart,
  Menu,
  X,
  ChevronDown,
  Star,
  Clock,
  Shield,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Brain,
  Link,
  Filter,
  Sparkles,
  Target,
  Globe,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Award,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [testimonialFilter, setTestimonialFilter] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const audienceData = [
    { name: 'Students', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Researchers', value: 35, color: 'hsl(var(--secondary))' },
    { name: 'Professionals', value: 20, color: 'hsl(var(--accent))' }
  ];

  const impactData = [
    { category: 'Time Saved', value: 75, unit: '%', icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { category: 'Comprehension', value: 85, unit: '%', icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { category: 'Research Speed', value: 60, unit: '%', icon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { category: 'Knowledge Retention', value: 70, unit: '%', icon: <Award className="h-4 w-4 sm:h-5 sm:w-5" /> }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "AI-Powered Summaries",
      description: "Transform complex research papers into digestible insights",
      details: "Our advanced AI analyzes academic papers and generates clear, concise summaries that preserve key findings while making them accessible to broader audiences.",
      badge: "Core Feature"
    },
    {
      icon: <Search className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Semantic Search",
      description: "Find relevant research across disciplines with intelligent search",
      details: "Go beyond keyword matching. Our semantic search understands context and meaning, helping you discover relevant research even when different terminology is used.",
      badge: "AI-Powered"
    },
    {
      icon: <Link className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Context Linking",
      description: "Discover connections between related research and concepts",
      details: "Automatically identify and visualize relationships between papers, authors, and concepts to build comprehensive understanding of research landscapes.",
      badge: "Smart Insights"
    },
    {
      icon: <Filter className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Smart Filtering",
      description: "Navigate research by relevance, impact, and methodology",
      details: "Advanced filtering options help you focus on the most relevant research based on citation impact, methodology, publication date, and field of study.",
      badge: "Advanced"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "PhD Student, Neuroscience",
      category: "students",
      content: "OpenMU helped me understand complex papers outside my field in minutes instead of hours. It's revolutionized my literature review process.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Research Scientist, MIT",
      category: "researchers",
      content: "The semantic search capabilities are incredible. I've discovered relevant research I never would have found through traditional search methods.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Jennifer Park",
      role: "Product Manager, Tech Startup",
      category: "professionals",
      content: "As someone without a research background, OpenMU makes academic insights accessible for product development decisions.",
      rating: 5,
      avatar: "JP"
    },
    {
      name: "Alex Thompson",
      role: "Undergraduate, Biology",
      category: "students",
      content: "Finally, a tool that makes research papers approachable. My grades have improved significantly since using OpenMU.",
      rating: 5,
      avatar: "AT"
    },
    {
      name: "Prof. Lisa Wang",
      role: "Department Head, Stanford",
      category: "researchers",
      content: "OpenMU has become an essential tool for our research team. The context linking feature reveals connections we might have missed.",
      rating: 5,
      avatar: "LW"
    },
    {
      name: "David Kumar",
      role: "Healthcare Consultant",
      category: "professionals",
      content: "Staying current with medical research is crucial for my work. OpenMU makes it possible to quickly understand new developments.",
      rating: 5,
      avatar: "DK"
    }
  ];

  const painPoints = [
    {
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />,
      title: "Time-Consuming Research",
      description: "Hours spent deciphering complex academic language",
      impact: "3-5 hours per paper"
    },
    {
      icon: <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />,
      title: "Information Overload",
      description: "Overwhelming volume of research across multiple disciplines",
      impact: "1000+ papers daily"
    },
    {
      icon: <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />,
      title: "Relevance Filtering",
      description: "Difficulty identifying the most impactful and relevant studies",
      impact: "70% irrelevant results"
    },
    {
      icon: <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />,
      title: "Knowledge Gaps",
      description: "Missing connections between related research areas",
      impact: "Siloed insights"
    }
  ];

  const filteredTestimonials = testimonials.filter(t => 
    testimonialFilter === 'all' || t.category === testimonialFilter
  );

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                OpenMU
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('community')} className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Community
              </button>
              <button onClick={() => scrollToSection('audience')} className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                For You
              </button>
              <button onClick={() => scrollToSection('impact')} className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Impact
              </button>
              <Button className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Join Waitlist
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4 animate-in slide-in-from-top-2 duration-200 bg-background/95 backdrop-blur-md rounded-lg border shadow-lg">
              <div className="flex flex-col space-y-2 px-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  Features
                </button>
                <button onClick={() => scrollToSection('community')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  Community
                </button>
                <button onClick={() => scrollToSection('audience')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  For You
                </button>
                <button onClick={() => scrollToSection('impact')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  Impact
                </button>
                <Button className="w-full mt-4">Join Waitlist</Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className={`container mx-auto text-center max-w-5xl relative transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="secondary" className="mb-6 sm:mb-8 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Revolutionizing Academic Research
          </Badge>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            Make Research{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Accessible
            </span>{' '}
            to Everyone
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto px-2">
            OpenMU transforms complex academic research into clear, actionable insights. 
            Discover, understand, and apply knowledge faster than ever before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
            <Button size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
              Join Waitlist
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <Rocket className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-12 sm:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">The Research Challenge</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto px-2">
              Academic research shouldn't be a barrier to knowledge. Here's what researchers face daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="mx-auto mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors duration-300">
                    {point.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">{point.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {point.impact}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Powerful Features</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto px-2">
              Advanced AI technology meets intuitive design to transform how you interact with research.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl group ${
                    selectedFeature === index ? 'ring-2 ring-primary shadow-xl scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedFeature(index)}
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`p-2 sm:p-3 rounded-xl transition-colors duration-300 ${
                          selectedFeature === index ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        }`}>
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                          <CardDescription className="text-sm sm:text-base mt-1">{feature.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs hidden sm:block">
                        {feature.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="lg:sticky lg:top-32 shadow-xl border-0">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary text-primary-foreground">
                    {features[selectedFeature].icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{features[selectedFeature].title}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {features[selectedFeature].badge}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {features[selectedFeature].details}
                </p>
                <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-3 sm:p-4 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-3 text-primary flex-shrink-0" />
                  Available in Early Access
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section - Moved Up */}
      <section id="community" className="py-12 sm:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Join Our Community</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto px-2">
              Connect with researchers, students, and professionals who are transforming how we access and understand academic knowledge.
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/50 overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="p-4 sm:p-6 rounded-2xl bg-primary/10">
                  <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Discord Community</h3>
              <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Join hundreds of researchers, students, and knowledge enthusiasts in our vibrant Discord community. 
                Share insights, get help, and stay updated on the latest OpenMU developments.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="text-center">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-2 sm:mb-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Active Community</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Connect with like-minded researchers</p>
                </div>
                <div className="text-center">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-2 sm:mb-3">
                    <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Share Insights</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Discuss research and discoveries</p>
                </div>
                <div className="text-center">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-2 sm:mb-3">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Early Access</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Get first access to new features</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                onClick={() => window.open('https://discord.gg/ZY7gfFbz9n', '_blank')}
              >
                <MessageCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                Join Discord Community
                <ExternalLink className="ml-2 sm:ml-3 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Built for Everyone</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto px-2">
              From students to seasoned researchers, OpenMU adapts to your unique needs and workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Students</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Undergraduate & Graduate</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Accelerate your learning with simplified research summaries and cross-disciplinary insights that make complex topics accessible.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Microscope className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Researchers</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Academic & Industry</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Stay current with research across fields and discover unexpected connections that can drive breakthrough insights in your work.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Professionals</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Industry Leaders</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Apply cutting-edge research to real-world problems and stay ahead of industry trends with evidence-based insights.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">Our Community Distribution</h3>
              <div className="w-72 h-72 sm:w-96 sm:h-96 mx-auto mb-6 sm:mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center flex-wrap gap-3 sm:gap-6">
                {audienceData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3 bg-background/50 px-3 sm:px-4 py-2 rounded-full border">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm font-medium">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-12 sm:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Real-World Impact</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto px-2">
              See how OpenMU transforms research workflows and accelerates discovery across disciplines.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 flex items-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary" />
                Performance Improvements
              </h3>
              <div className="space-y-6 sm:space-y-8">
                {impactData.map((item, index) => (
                  <div key={index} className="space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary">
                          {item.icon}
                        </div>
                        <span className="font-semibold text-base sm:text-lg">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          +{item.value}{item.unit}
                        </span>
                        <p className="text-xs sm:text-sm text-muted-foreground">improvement</p>
                      </div>
                    </div>
                    <Progress value={item.value} className="h-2 sm:h-3" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 flex items-center">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary" />
                User Testimonials
              </h3>
              
              <Tabs value={testimonialFilter} onValueChange={setTestimonialFilter} className="mb-6 sm:mb-8">
                <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                  <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
                  <TabsTrigger value="researchers" className="text-xs sm:text-sm">Researchers</TabsTrigger>
                  <TabsTrigger value="professionals" className="text-xs sm:text-sm">Pros</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2">
                {filteredTestimonials.map((testimonial, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0 text-sm sm:text-base">
                          {testimonial.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 sm:mb-4 italic leading-relaxed text-sm sm:text-base">
                            "{testimonial.content}"
                          </p>
                          <div>
                            <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Section */}
      <section id="legal" className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Trust & Transparency</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto px-2">
              Your privacy and security are our top priorities. We're committed to building a trustworthy platform.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4 sm:space-y-6">
            <AccordionItem value="privacy" className="border rounded-xl px-6 sm:px-8 py-2 shadow-lg hover:shadow-xl transition-shadow">
              <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-semibold">Privacy Policy</span>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">How we protect and handle your data</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 sm:pt-6 pb-6 sm:pb-8 px-3 sm:px-4">
                <div className="space-y-4 sm:space-y-6">
                  <p className="leading-relaxed text-sm sm:text-base">
                    OpenMU is committed to protecting your privacy. We collect only the information necessary to provide our services and never sell your personal data to third parties.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Industry-standard encryption</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Private research activity</span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Data deletion on request</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">GDPR compliance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terms" className="border rounded-xl px-6 sm:px-8 py-2 shadow-lg hover:shadow-xl transition-shadow">
              <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-semibold">Terms of Service</span>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Fair use guidelines and platform rules</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 sm:pt-6 pb-6 sm:pb-8 px-3 sm:px-4">
                <div className="space-y-4 sm:space-y-6">
                  <p className="leading-relaxed text-sm sm:text-base">
                    By using OpenMU, you agree to our terms of service. These terms ensure fair use of our platform and protect both users and our service.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Academic and professional use encouraged</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Respect intellectual property rights</span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">No commercial redistribution</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Service availability transparency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refund" className="border rounded-xl px-6 sm:px-8 py-2 shadow-lg hover:shadow-xl transition-shadow">
              <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-semibold">Cancellation & Refund Policy</span>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Flexible cancellation and refund options</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 sm:pt-6 pb-6 sm:pb-8 px-3 sm:px-4">
                <div className="space-y-4 sm:space-y-6">
                  <p className="leading-relaxed text-sm sm:text-base">
                    We want you to be completely satisfied with OpenMU. Our flexible cancellation and refund policy ensures you're never locked into a service that doesn't meet your needs.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Cancel anytime</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">30-day full refund</span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">Pro-rated annual refunds</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm sm:text-base">No hidden fees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Ready to Transform Your Research?</h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Join thousands of researchers, students, and professionals who are already using OpenMU to accelerate their work and unlock new insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
            <Button size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
              Join Waitlist
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <MessageCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Schedule Demo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Early access Q1 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Free trial included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="space-y-4 sm:space-y-6 col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <span className="text-xl sm:text-2xl font-bold">OpenMU</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Making academic research accessible to everyone through AI-powered insights and intelligent search.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Product</h3>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                <p className="hover:text-foreground transition-colors cursor-pointer">Features</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Pricing</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">API</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Integrations</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Company</h3>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                <p className="hover:text-foreground transition-colors cursor-pointer">About</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Blog</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Careers</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Press</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Support</h3>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                <div className="flex items-center space-x-2 sm:space-x-3 hover:text-foreground transition-colors cursor-pointer">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>support@openmu.org</span>
                </div>
                <p className="hover:text-foreground transition-colors cursor-pointer">Documentation</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Community</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Status</p>
              </div>
            </div>
          </div>

          <Separator className="my-8 sm:my-12" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm sm:text-base">
              © 2025 OpenMU. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm text-muted-foreground">
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