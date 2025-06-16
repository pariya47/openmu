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
  Globe
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [testimonialFilter, setTestimonialFilter] = useState('all');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const audienceData = [
    { name: 'Students', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Researchers', value: 35, color: 'hsl(var(--secondary))' },
    { name: 'Professionals', value: 20, color: 'hsl(var(--accent))' }
  ];

  const impactData = [
    { category: 'Time Saved', value: 75, unit: '%' },
    { category: 'Comprehension', value: 85, unit: '%' },
    { category: 'Research Speed', value: 60, unit: '%' },
    { category: 'Knowledge Retention', value: 70, unit: '%' }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Summaries",
      description: "Transform complex research papers into digestible insights",
      details: "Our advanced AI analyzes academic papers and generates clear, concise summaries that preserve key findings while making them accessible to broader audiences."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Semantic Search",
      description: "Find relevant research across disciplines with intelligent search",
      details: "Go beyond keyword matching. Our semantic search understands context and meaning, helping you discover relevant research even when different terminology is used."
    },
    {
      icon: <Link className="h-8 w-8" />,
      title: "Context Linking",
      description: "Discover connections between related research and concepts",
      details: "Automatically identify and visualize relationships between papers, authors, and concepts to build comprehensive understanding of research landscapes."
    },
    {
      icon: <Filter className="h-8 w-8" />,
      title: "Smart Filtering",
      description: "Navigate research by relevance, impact, and methodology",
      details: "Advanced filtering options help you focus on the most relevant research based on citation impact, methodology, publication date, and field of study."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "PhD Student, Neuroscience",
      category: "students",
      content: "OpenMU helped me understand complex papers outside my field in minutes instead of hours. It's revolutionized my literature review process.",
      rating: 5
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Research Scientist, MIT",
      category: "researchers",
      content: "The semantic search capabilities are incredible. I've discovered relevant research I never would have found through traditional search methods.",
      rating: 5
    },
    {
      name: "Jennifer Park",
      role: "Product Manager, Tech Startup",
      category: "professionals",
      content: "As someone without a research background, OpenMU makes academic insights accessible for product development decisions.",
      rating: 5
    },
    {
      name: "Alex Thompson",
      role: "Undergraduate, Biology",
      category: "students",
      content: "Finally, a tool that makes research papers approachable. My grades have improved significantly since using OpenMU.",
      rating: 5
    },
    {
      name: "Prof. Lisa Wang",
      role: "Department Head, Stanford",
      category: "researchers",
      content: "OpenMU has become an essential tool for our research team. The context linking feature reveals connections we might have missed.",
      rating: 5
    },
    {
      name: "David Kumar",
      role: "Healthcare Consultant",
      category: "professionals",
      content: "Staying current with medical research is crucial for my work. OpenMU makes it possible to quickly understand new developments.",
      rating: 5
    }
  ];

  const painPoints = [
    {
      icon: <Clock className="h-6 w-6 text-destructive" />,
      title: "Time-Consuming Research",
      description: "Hours spent deciphering complex academic language"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-muted-foreground" />,
      title: "Information Overload",
      description: "Overwhelming volume of research across multiple disciplines"
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Relevance Filtering",
      description: "Difficulty identifying the most impactful and relevant studies"
    },
    {
      icon: <Globe className="h-6 w-6 text-muted-foreground" />,
      title: "Knowledge Gaps",
      description: "Missing connections between related research areas"
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
        scrollY > 50 ? 'bg-background/95 backdrop-blur-md border-b' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">OpenMU</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('audience')} className="text-muted-foreground hover:text-foreground transition-colors">
                For You
              </button>
              <button onClick={() => scrollToSection('impact')} className="text-muted-foreground hover:text-foreground transition-colors">
                Impact
              </button>
              <button onClick={() => scrollToSection('legal')} className="text-muted-foreground hover:text-foreground transition-colors">
                Legal
              </button>
              <Button>Join Waitlist</Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection('audience')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  For You
                </button>
                <button onClick={() => scrollToSection('impact')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  Impact
                </button>
                <button onClick={() => scrollToSection('legal')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  Legal
                </button>
                <Button className="w-full">Join Waitlist</Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Revolutionizing Academic Research
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Make Research Accessible to Everyone
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            OpenMU transforms complex academic research into clear, actionable insights. 
            Discover, understand, and apply knowledge faster than ever before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6">
              Join Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary px-6 py-3 rounded-full border">
            <Clock className="h-5 w-5 text-secondary-foreground" />
            <span className="text-secondary-foreground font-medium">Coming Soon - Early 2025</span>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Research Challenge</h2>
            <p className="text-muted-foreground text-lg">
              Academic research shouldn't be a barrier to knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-muted">
                    {point.icon}
                  </div>
                  <CardTitle className="text-lg">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">
              Advanced AI technology meets intuitive design
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedFeature === index ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedFeature(index)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {features[selectedFeature].icon}
                  </div>
                  <CardTitle className="text-xl">{features[selectedFeature].title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {features[selectedFeature].details}
                </p>
                <div className="mt-6 flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  Available in Early Access
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-muted-foreground text-lg">
              From students to seasoned researchers, OpenMU adapts to your needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Students</CardTitle>
                      <CardDescription>Undergraduate & Graduate</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accelerate your learning with simplified research summaries and cross-disciplinary insights.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Microscope className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Researchers</CardTitle>
                      <CardDescription>Academic & Industry</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay current with research across fields and discover unexpected connections in your work.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Professionals</CardTitle>
                      <CardDescription>Industry Leaders</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Apply cutting-edge research to real-world problems and stay ahead of industry trends.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6">Our Community</h3>
              <div className="w-80 h-80 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {audienceData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
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
      <section id="impact" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Impact</h2>
            <p className="text-muted-foreground text-lg">
              See how OpenMU transforms research workflows
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Performance Improvements</h3>
              <div className="space-y-6">
                {impactData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        +{item.value}{item.unit}
                      </span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">User Testimonials</h3>
              
              <Tabs value={testimonialFilter} onValueChange={setTestimonialFilter} className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="researchers">Researchers</TabsTrigger>
                  <TabsTrigger value="professionals">Professionals</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTestimonials.map((testimonial, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 italic">
                            "{testimonial.content}"
                          </p>
                          <div>
                            <p className="font-medium">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
      <section id="legal" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trust & Transparency</h2>
            <p className="text-muted-foreground text-lg">
              Your privacy and security are our top priorities
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="privacy" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Privacy Policy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <div className="space-y-4">
                  <p>
                    OpenMU is committed to protecting your privacy. We collect only the information necessary to provide our services and never sell your personal data to third parties.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>We use industry-standard encryption to protect your data</li>
                    <li>Your research activity remains private and is not shared</li>
                    <li>You can request data deletion at any time</li>
                    <li>We comply with GDPR and other privacy regulations</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terms" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Terms of Service</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <div className="space-y-4">
                  <p>
                    By using OpenMU, you agree to our terms of service. These terms ensure fair use of our platform and protect both users and our service.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Academic and professional use is encouraged</li>
                    <li>Commercial redistribution of content is prohibited</li>
                    <li>Users must respect intellectual property rights</li>
                    <li>Service availability is subject to maintenance windows</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refund" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-destructive" />
                  <span>Cancellation & Refund Policy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <div className="space-y-4">
                  <p>
                    We want you to be completely satisfied with OpenMU. Our flexible cancellation and refund policy ensures you're never locked into a service that doesn't meet your needs.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Cancel your subscription at any time</li>
                    <li>Full refund available within 30 days of purchase</li>
                    <li>Pro-rated refunds for annual subscriptions</li>
                    <li>No cancellation fees or hidden charges</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Research?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of researchers, students, and professionals who are already using OpenMU to accelerate their work.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8 py-6">
              Join Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Early access starts Q1 2025 • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">OpenMU</span>
              </div>
              <p className="text-muted-foreground">
                Making academic research accessible to everyone through AI-powered insights and intelligent search.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Features</p>
                <p>Pricing</p>
                <p>API</p>
                <p>Integrations</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>About</p>
                <p>Blog</p>
                <p>Careers</p>
                <p>Press</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@openmu.org</span>
                </div>
                <p>Documentation</p>
                <p>Community</p>
                <p>Status</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 OpenMU. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}