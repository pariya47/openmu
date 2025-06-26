"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ArrowLeft,
  Heart,
  Users,
  Zap,
  Target,
  Coffee,
  Rocket,
  Star,
  Gift,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function DonatePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const donationTiers = [
    {
      amount: 5,
      title: "Coffee Supporter",
      icon: <Coffee className="h-6 w-6" />,
      description: "Buy our team a coffee to fuel late-night coding sessions",
      color: "bg-amber-500",
      benefits: ["Thank you email", "Project updates"]
    },
    {
      amount: 25,
      title: "Research Advocate", 
      icon: <Target className="h-6 w-6" />,
      description: "Support our mission to make research accessible to everyone",
      color: "bg-blue-500",
      benefits: ["Thank you email", "Project updates", "Early access invite"]
    },
    {
      amount: 100,
      title: "Innovation Champion",
      icon: <Zap className="h-6 w-6" />,
      description: "Help us accelerate development and reach more researchers",
      color: "bg-purple-500", 
      benefits: ["All previous benefits", "Beta testing access", "Feature request priority"]
    },
    {
      amount: 500,
      title: "Visionary Partner",
      icon: <Rocket className="h-6 w-6" />,
      description: "Become a key partner in revolutionizing academic research",
      color: "bg-green-500",
      benefits: ["All previous benefits", "Direct feedback sessions", "Recognition on website"]
    }
  ];

  const quickAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className={`container mx-auto text-center max-w-4xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge variant="secondary" className="mb-8 text-sm px-4 py-2 bg-rose-100 text-rose-700 border-0">
            <Heart className="h-4 w-4 mr-2" />
            Support Our Mission
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-black">
            Help Us Make Research
            <br />
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Accessible to All
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Your support helps us build tools that democratize access to academic knowledge. 
            Together, we can break down barriers and accelerate human understanding.
          </p>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black">Choose Your Impact Level</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every contribution, no matter the size, helps us build a more accessible future for research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                  selectedAmount === tier.amount ? 'ring-2 ring-rose-500 shadow-xl scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setSelectedAmount(tier.amount)}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${tier.color}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${tier.color} text-white`}>
                      {tier.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black">${tier.amount}</div>
                      <div className="text-xs text-gray-500">USD</div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 text-black">{tier.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{tier.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700 mb-2">What you get:</div>
                    {tier.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <Star className="h-3 w-3 mr-2 text-yellow-500 fill-current" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-black mb-4">Make Your Donation</CardTitle>
              <p className="text-gray-600">Choose an amount or enter a custom value</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Select</label>
                <div className="grid grid-cols-5 gap-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`${
                        selectedAmount === amount 
                          ? "bg-black text-white" 
                          : "border-gray-300 hover:border-black"
                      } transition-all duration-200`}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                  />
                </div>
              </div>

              {/* Donation Button */}
              <Button 
                size="lg" 
                className="w-full text-lg py-6 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Gift className="mr-3 h-5 w-5" />
                Donate ${customAmount || selectedAmount}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>🔒 Secure payment processing</p>
                <p>Your donation helps build the future of research accessibility</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-rose-500" />
            <h2 className="text-4xl font-bold mb-6 text-black">Your Impact</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Every donation directly contributes to making academic research more accessible, 
              helping researchers, students, and professionals worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Empower Researchers</h3>
              <p className="text-gray-600 text-sm">Help researchers access and understand complex studies faster</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 rounded-full bg-green-100 w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Accelerate Discovery</h3>
              <p className="text-gray-600 text-sm">Speed up scientific breakthroughs by improving knowledge access</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 rounded-full bg-purple-100 w-fit mx-auto mb-4">
                <Rocket className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Build the Future</h3>
              <p className="text-gray-600 text-sm">Contribute to a world where knowledge is accessible to everyone</p>
            </div>
          </div>
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
              © 2025 mdscholar. Thank you for supporting accessible research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}