"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  ChevronRight,
  Search,
  Calendar,
  ExternalLink,
  Menu,
  X,
  Hash,
  MessageSquare,
  Sparkles,
  Clock,
  FileText
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  element?: HTMLElement;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DocViewerProps {
  paperId: string;
}

// Mock data - in a real app, this would come from your backend
const mockDocSections: DocSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `
# Overview

## Library Purpose and Scope

The Hugging Face Transformers library is a comprehensive machine learning framework that provides state-of-the-art pretrained models for natural language processing, computer vision, audio processing, and multimodal tasks. The library serves as both an inference engine and training platform, offering over 500,000 model checkpoints across multiple architectures and frameworks.

This document covers the foundational architecture, core systems, and design patterns that enable Transformers to provide a unified API for diverse model architectures and tasks.

## High-Level Architecture

Transformers is designed to democratize access to state-of-the-art machine learning models by providing:

### Unified Model Access
A consistent API across 500+ model architectures through Auto classes

### Multi-Framework Support
Native implementations for PyTorch, TensorFlow, and JAX/Flax

### Production-Ready Inference
Optimized Pipeline API for common tasks

### Comprehensive Training
Full training infrastructure with the Trainer class

### Advanced Generation
Sophisticated text generation with multiple decoding strategies

### Memory Optimization
Quantization support and efficient caching mechanisms

## Core Library Structure

The library is organized into several key modules:

- **Models**: Architecture-specific implementations
- **Tokenizers**: Text preprocessing and encoding
- **Pipelines**: High-level task-oriented interfaces  
- **Training**: Optimization and training utilities
- **Generation**: Text generation algorithms
- **Utils**: Common utilities and helpers

## Auto-Loading System Architecture

The Auto classes provide a unified interface for loading models, tokenizers, and configurations without requiring knowledge of the specific architecture.

### Key Design Patterns

- **Factory Pattern**: Auto classes act as factories for creating appropriate instances
- **Registry Pattern**: Model mappings are maintained in centralized registries
- **Lazy Loading**: Components are loaded on-demand to optimize memory usage
- **Configuration-Driven**: Model behavior is controlled through configuration objects

## Multi-Framework Abstraction

Transformers maintains separate implementations for each supported framework while providing a consistent user interface. This is achieved through:

- **Abstract Base Classes**: Common interfaces across frameworks
- **Framework-Specific Implementations**: Optimized code for each backend
- **Unified Configuration**: Shared configuration objects
- **Cross-Framework Compatibility**: Models can be converted between frameworks
    `,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'core-architecture',
    title: 'Core Architecture',
    content: `
# Core Architecture

## Base Classes and Model Loading

### PreTrainedModel Base Class

All model implementations inherit from framework-specific base classes that provide common functionality:

- **Configuration Management**: Loading and saving model configurations
- **Weight Management**: Handling model parameters and state dictionaries
- **Device Management**: Moving models between CPU/GPU/TPU
- **Serialization**: Saving and loading model checkpoints

### Auto Classes System

The Auto classes provide a unified interface for model instantiation:

\`\`\`python
from transformers import AutoModel, AutoTokenizer, AutoConfig

# Automatic model loading based on configuration
model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
config = AutoConfig.from_pretrained("bert-base-uncased")
\`\`\`

## Tokenization System

### Tokenizer Architecture

The tokenization system is built around several key components:

- **Fast Tokenizers**: Rust-based implementations for performance
- **Slow Tokenizers**: Python implementations for compatibility
- **Special Tokens**: Handling of model-specific tokens (CLS, SEP, etc.)
- **Encoding/Decoding**: Bidirectional text-token conversion

### Tokenizer Features

- **Subword Tokenization**: BPE, WordPiece, SentencePiece support
- **Batch Processing**: Efficient processing of multiple sequences
- **Padding and Truncation**: Automatic sequence length management
- **Attention Masks**: Generation of attention masks for variable-length sequences

## Pipeline System

### High-Level Task Interface

Pipelines provide a simple interface for common NLP tasks:

\`\`\`python
from transformers import pipeline

# Text classification
classifier = pipeline("text-classification")
result = classifier("This movie is great!")

# Question answering
qa_pipeline = pipeline("question-answering")
answer = qa_pipeline(question="What is AI?", context="AI is...")
\`\`\`

### Pipeline Architecture

- **Task-Specific Logic**: Each pipeline handles task-specific preprocessing/postprocessing
- **Model Agnostic**: Pipelines work with any compatible model
- **Batching Support**: Efficient processing of multiple inputs
- **Device Management**: Automatic device placement and optimization
    `,
    lastUpdated: '2024-01-14'
  },
  {
    id: 'training-system',
    title: 'Training System',
    content: `
# Training System

## Trainer Class Architecture

The Trainer class provides a comprehensive training framework with the following features:

### Core Training Loop

- **Automatic Mixed Precision**: FP16/BF16 training support
- **Gradient Accumulation**: Handling large effective batch sizes
- **Learning Rate Scheduling**: Various scheduling strategies
- **Checkpointing**: Automatic model and optimizer state saving

### Training Configuration

\`\`\`python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    gradient_accumulation_steps=2,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)
\`\`\`

## Optimization and Callbacks

### Optimizer Integration

- **AdamW**: Default optimizer with weight decay
- **Custom Optimizers**: Support for various optimization algorithms
- **Learning Rate Scheduling**: Cosine, linear, polynomial schedules
- **Gradient Clipping**: Preventing gradient explosion

### Callback System

The callback system allows for extensible training customization:

- **Early Stopping**: Automatic training termination based on metrics
- **Model Checkpointing**: Saving best models during training
- **Logging**: Integration with TensorBoard, Weights & Biases
- **Custom Callbacks**: User-defined training interventions

## Distributed Training

### Multi-GPU Training

- **DataParallel**: Simple multi-GPU training
- **DistributedDataParallel**: Efficient distributed training
- **DeepSpeed Integration**: Memory-efficient large model training
- **FSDP Support**: Fully Sharded Data Parallel training

### Training Strategies

- **Gradient Checkpointing**: Trading compute for memory
- **Mixed Precision**: Faster training with maintained accuracy
- **Dynamic Loss Scaling**: Preventing underflow in FP16 training
    `,
    lastUpdated: '2024-01-13'
  },
  {
    id: 'generation-system',
    title: 'Generation System',
    content: `
# Generation System

## Text Generation Architecture

The generation system provides sophisticated text generation capabilities with multiple decoding strategies and optimization techniques.

### Generation Methods

#### Greedy Decoding
The simplest generation method that always selects the token with the highest probability:

\`\`\`python
outputs = model.generate(
    input_ids,
    max_length=50,
    do_sample=False  # Greedy decoding
)
\`\`\`

#### Beam Search
Explores multiple hypotheses simultaneously to find higher-quality sequences:

\`\`\`python
outputs = model.generate(
    input_ids,
    max_length=50,
    num_beams=5,
    early_stopping=True
)
\`\`\`

#### Sampling Methods
Various sampling strategies for more diverse generation:

- **Top-k Sampling**: Sample from top-k most likely tokens
- **Top-p (Nucleus) Sampling**: Sample from tokens with cumulative probability p
- **Temperature Scaling**: Control randomness in generation

### Advanced Generation Features

#### Constrained Generation
- **Prefix Constraints**: Force generation to start with specific tokens
- **Suffix Constraints**: Ensure generation ends with specific patterns
- **Guided Generation**: Use external constraints to guide generation

#### Generation Configuration

\`\`\`python
from transformers import GenerationConfig

generation_config = GenerationConfig(
    max_length=100,
    min_length=10,
    do_sample=True,
    top_k=50,
    top_p=0.95,
    temperature=0.7,
    repetition_penalty=1.2,
    length_penalty=1.0,
    no_repeat_ngram_size=2
)

outputs = model.generate(input_ids, generation_config=generation_config)
\`\`\`

## Caching and Optimization

### Key-Value Caching
Efficient caching of attention keys and values for faster generation:

- **Static Caching**: Pre-allocated cache for known sequence lengths
- **Dynamic Caching**: Adaptive cache sizing during generation
- **Cache Optimization**: Memory-efficient cache management

### Generation Optimization
- **Batched Generation**: Processing multiple sequences simultaneously
- **Streaming Generation**: Token-by-token output for real-time applications
- **Memory Management**: Efficient handling of large generation batches
    `,
    lastUpdated: '2024-01-12'
  },
  {
    id: 'model-implementations',
    title: 'Model Implementations',
    content: `
# Model Implementations

## Architecture Families

The Transformers library supports numerous model architectures, each with specific implementations and optimizations.

### BERT Family
Bidirectional Encoder Representations from Transformers and variants:

- **BERT**: Original bidirectional transformer
- **RoBERTa**: Robustly Optimized BERT Pretraining Approach
- **DeBERTa**: Decoding-enhanced BERT with Disentangled Attention
- **ELECTRA**: Efficiently Learning an Encoder that Classifies Token Replacements Accurately

### GPT Family
Generative Pre-trained Transformers for autoregressive language modeling:

- **GPT**: Original generative transformer
- **GPT-2**: Larger scale language model
- **GPT-Neo/GPT-J**: Open-source GPT alternatives
- **CodeGen**: Code generation specialized models

### T5 Family
Text-to-Text Transfer Transformer and variants:

- **T5**: Text-to-Text Transfer Transformer
- **UL2**: Unified Language Learner
- **Flan-T5**: Instruction-tuned T5 models

### Vision Models
Computer vision transformer architectures:

- **Vision Transformer (ViT)**: Image classification with transformers
- **DeiT**: Data-efficient Image Transformers
- **Swin Transformer**: Hierarchical vision transformer
- **DETR**: Detection Transformer for object detection

## Model-Specific Features

### Attention Mechanisms
Different models implement various attention patterns:

- **Full Attention**: Standard self-attention mechanism
- **Sparse Attention**: Efficient attention for long sequences
- **Local Attention**: Attention within local windows
- **Dilated Attention**: Attention with dilated patterns

### Position Encodings
Various approaches to encoding positional information:

- **Absolute Position Embeddings**: Learned position embeddings
- **Relative Position Encodings**: Relative position bias
- **Rotary Position Embeddings (RoPE)**: Rotational position encoding
- **ALiBi**: Attention with Linear Biases

## Implementation Details

### Memory Optimization
- **Gradient Checkpointing**: Recompute activations during backward pass
- **Parameter Sharing**: Share parameters across layers
- **Quantization**: Reduce model precision for efficiency
- **Pruning**: Remove unnecessary model parameters

### Framework-Specific Optimizations
Each framework implementation includes specific optimizations:

- **PyTorch**: JIT compilation, TorchScript support
- **TensorFlow**: XLA compilation, TensorFlow Lite
- **JAX**: JIT compilation, automatic differentiation
    `,
    lastUpdated: '2024-01-11'
  }
];

const mockPaperData = {
  title: "Attention Is All You Need",
  authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
  year: 2017,
  lastIndexed: "2024-01-15"
};

export function DocViewer({ paperId }: DocViewerProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeTocItem, setActiveTocItem] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate table of contents from markdown content
  useEffect(() => {
    const currentSection = mockDocSections.find(section => section.id === activeSection);
    if (!currentSection) return;

    const headings: TableOfContentsItem[] = [];
    const lines = currentSection.content.split('\n');
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2];
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        headings.push({
          id,
          title,
          level
        });
      }
    });

    setTableOfContents(headings);
  }, [activeSection]);

  // Set up intersection observer for scroll spy
  useEffect(() => {
    if (!contentRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveTocItem(id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    // Observe all headings
    const headings = contentRef.current.querySelectorAll('h2, h3');
    headings.forEach((heading) => {
      if (observerRef.current) {
        observerRef.current.observe(heading);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeSection]);

  // Convert markdown to HTML with proper IDs
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const htmlLines = lines.map(line => {
      // Handle headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2];
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return `<h${level} id="${id}" class="scroll-mt-20">${title}</h${level}>`;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        return line.includes('```python') ? '<pre class="bg-slate-100 p-4 rounded-lg overflow-x-auto"><code class="language-python">' : 
               line === '```' ? '</code></pre>' : line;
      }

      // Handle inline code
      const codeMatch = line.match(/`([^`]+)`/g);
      if (codeMatch) {
        let processedLine = line;
        codeMatch.forEach(match => {
          const code = match.slice(1, -1);
          processedLine = processedLine.replace(match, `<code class="bg-slate-100 px-2 py-1 rounded text-sm">${code}</code>`);
        });
        return processedLine;
      }

      // Handle bullet points
      if (line.match(/^[-*]\s+/)) {
        return `<li class="ml-4">${line.replace(/^[-*]\s+/, '')}</li>`;
      }

      // Handle bold text
      const boldMatch = line.match(/\*\*([^*]+)\*\*/g);
      if (boldMatch) {
        let processedLine = line;
        boldMatch.forEach(match => {
          const text = match.slice(2, -2);
          processedLine = processedLine.replace(match, `<strong>${text}</strong>`);
        });
        return processedLine;
      }

      // Regular paragraphs
      if (line.trim() && !line.startsWith('#') && !line.startsWith('```')) {
        return `<p class="mb-4 leading-relaxed">${line}</p>`;
      }

      return line;
    });

    return htmlLines.join('\n');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Based on the current section "${mockDocSections.find(s => s.id === activeSection)?.title}", here's what I found:

• The Transformers library uses a unified API design pattern through Auto classes
• Key architectural components include tokenizers, models, and pipelines
• The system supports multiple frameworks (PyTorch, TensorFlow, JAX)
• Memory optimization is achieved through techniques like gradient checkpointing

Would you like me to elaborate on any of these points?`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSection = mockDocSections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Global Navigation */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push('/papers')}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Papers</span>
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                {mockPaperData.title}
              </h1>
              <p className="text-sm text-slate-600">
                {mockPaperData.authors.join(', ')} • {mockPaperData.year}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Calendar className="h-3 w-3" />
                <span>Last Indexed: {mockPaperData.lastIndexed}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {mockDocSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    activeSection === section.id
                      ? 'bg-slate-200 text-slate-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span>{section.title}</span>
                  {activeSection === section.id && (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex items-center space-x-2">
                <FileText className="h-3 w-3" />
                <span>Doc Viewer v1.0</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>Updated {currentSection?.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-slate-800 truncate">
              {currentSection?.title}
            </h1>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
              <div 
                ref={contentRef}
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: currentSection ? renderMarkdownContent(currentSection.content) : '' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Right TOC Panel */}
        <div className="hidden xl:block w-80 bg-slate-50 border-l border-slate-200">
          <div className="sticky top-0 h-screen flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <Hash className="h-4 w-4 mr-2" />
                On this page
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left text-sm transition-colors duration-200 ${
                      item.level === 2 ? 'pl-0' : 'pl-4'
                    } ${
                      activeTocItem === item.id
                        ? 'text-slate-900 font-medium'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </ScrollArea>

            {/* Ad Placement */}
            <div className="p-4 border-t border-slate-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                <Sparkles className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-blue-700 font-medium mb-2">Sponsored</p>
                <p className="text-xs text-blue-600">
                  Enhance your research with AI-powered insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom AI Chat Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
        isChatOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-w-6xl mx-auto">
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="max-h-80 overflow-y-auto border-b border-slate-200">
              <div className="p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-md p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Ask about "{currentSection?.title}"
                </span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            
            <div className="flex space-x-3">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="What is lazy loading in this library?"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Toggle (when chat is closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-all duration-200 hover:scale-110 z-20"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}