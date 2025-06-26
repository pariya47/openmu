// Mock data for documentation sections and papers

export interface Paper {
  id: string;
  title: string;
  year: number;
  authors: string[];
  abstract: string;
  doi?: string;
  fullPaperUrl?: string;
  dateAdded: string;
}

export interface DocSubsection {
  id: string;
  title: string;
  level: number;
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections: DocSubsection[];
}

// Sample papers data - exported for use in other components
export const samplePapers: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    year: 2017,
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable.',
    doi: '10.48550/arXiv.1706.03762',
    fullPaperUrl: '#',
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    year: 2018,
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations.',
    doi: '10.48550/arXiv.1810.04805',
    fullPaperUrl: '#',
    dateAdded: '2024-01-14'
  },
  {
    id: '3',
    title: 'Language Models are Few-Shot Learners',
    year: 2020,
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder'],
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets.',
    doi: '10.48550/arXiv.2005.14165',
    fullPaperUrl: '#',
    dateAdded: '2024-01-13'
  },
  {
    id: '4',
    title: 'Deep Residual Learning for Image Recognition',
    year: 2015,
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren'],
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions.',
    doi: '10.1109/CVPR.2016.90',
    fullPaperUrl: '#',
    dateAdded: '2024-01-12'
  },
  {
    id: '5',
    title: 'Generative Adversarial Networks',
    year: 2014,
    authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza'],
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability.',
    doi: '10.48550/arXiv.1406.2661',
    fullPaperUrl: '#',
    dateAdded: '2024-01-11'
  }
];

// Mock documentation sections
export const mockDocSections: DocSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `# Overview

## Library Purpose and Scope

The Hugging Face Transformers library is a comprehensive machine learning framework that provides state-of-the-art pretrained models for natural language processing, computer vision, audio processing, and multimodal tasks. The library serves as both an inference engine and training platform, offering over 500,000 model checkpoints across multiple architectures and frameworks.

This document covers the foundational architecture, core systems, and design patterns that enable Transformers to provide a unified API for diverse model architectures and tasks. For detailed information about specific components, see Core Architecture, Training System, Generation System, and Model Implementations.

## High-Level Architecture

Transformers is designed to democratize access to state-of-the-art machine learning models by providing:

- **Unified Model Access**: A consistent API across 500+ model architectures through Auto classes
- **Multi-Framework Support**: Native implementations for PyTorch, TensorFlow, and JAX/Flax
- **Production-Ready Inference**: Optimized Pipeline API for common tasks
- **Comprehensive Training**: Full training infrastructure with the Trainer class
- **Advanced Generation**: Sophisticated text generation with multiple decoding strategies
- **Memory Optimization**: Quantization support and efficient caching mechanisms

## Core Library Structure

### Auto-Loading System Architecture

The Auto classes provide dynamic model loading based on configuration:

\`\`\`python
from transformers import AutoModel, AutoTokenizer

# Automatic model detection and loading
model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
\`\`\`

### Key Design Patterns

- **Lazy Loading and Import Structure**: Models are loaded on-demand to minimize memory footprint
- **Configuration-Driven Architecture**: All models use configuration objects for reproducible initialization
- **Multi-Framework Abstraction**: Common interfaces across PyTorch, TensorFlow, and JAX implementations
- **Model Ecosystem Overview**: Seamless integration with Hugging Face Hub for model discovery and sharing

## Integration Points

The library integrates with the broader Hugging Face ecosystem:

- **Hugging Face Hub**: Model hosting, versioning, and discovery
- **Datasets Library**: Seamless data loading and preprocessing
- **Accelerate**: Distributed training and mixed precision
- **Optimum**: Hardware-specific optimizations
- **Gradio/Spaces**: Easy model deployment and sharing`,
    subsections: [
      { id: 'library-purpose-and-scope', title: 'Library Purpose and Scope', level: 2 },
      { id: 'high-level-architecture', title: 'High-Level Architecture', level: 2 },
      { id: 'core-library-structure', title: 'Core Library Structure', level: 2 },
      { id: 'auto-loading-system-architecture', title: 'Auto-Loading System Architecture', level: 3 },
      { id: 'key-design-patterns', title: 'Key Design Patterns', level: 3 },
      { id: 'integration-points', title: 'Integration Points', level: 2 }
    ]
  },
  {
    id: 'core-architecture',
    title: 'Core Architecture',
    content: `# Core Architecture

## Base Classes and Model Loading

### PreTrainedModel Foundation

All models inherit from \`PreTrainedModel\`, which provides:

\`\`\`python
class PreTrainedModel(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        
    @classmethod
    def from_pretrained(cls, model_name_or_path, **kwargs):
        # Load configuration and weights
        config = AutoConfig.from_pretrained(model_name_or_path)
        model = cls(config)
        model.load_state_dict(torch.load(model_path))
        return model
\`\`\`

### Configuration System

Every model uses a configuration class that defines architecture parameters:

- **Model Architecture**: Layer counts, hidden dimensions, attention heads
- **Task-Specific Settings**: Number of labels, problem type (classification/regression)
- **Training Parameters**: Dropout rates, activation functions
- **Tokenization Settings**: Vocabulary size, special tokens

## Tokenization System

### PreTrainedTokenizer Architecture

Tokenizers handle text preprocessing with consistent interfaces:

\`\`\`python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
inputs = tokenizer("Hello world!", return_tensors="pt")
# Returns: {'input_ids': tensor, 'attention_mask': tensor}
\`\`\`

### Tokenization Features

- **Fast Tokenizers**: Rust-based implementations for speed
- **Subword Algorithms**: BPE, WordPiece, SentencePiece support
- **Special Token Handling**: Automatic insertion of [CLS], [SEP], etc.
- **Padding and Truncation**: Batch processing with consistent lengths
- **Encoding/Decoding**: Bidirectional text ↔ token conversion

## Pipeline System

### Task-Agnostic Interface

Pipelines provide high-level APIs for common tasks:

\`\`\`python
from transformers import pipeline

# Text classification
classifier = pipeline("text-classification", 
                     model="distilbert-base-uncased-finetuned-sst-2-english")
result = classifier("I love this library!")

# Question answering
qa_pipeline = pipeline("question-answering")
answer = qa_pipeline(question="What is transformers?", 
                    context="Transformers is a library...")
\`\`\`

### Pipeline Architecture

- **Preprocessing**: Automatic tokenization and input formatting
- **Model Inference**: Optimized forward passes with batching
- **Postprocessing**: Task-specific output formatting and decoding
- **Device Management**: Automatic GPU/CPU placement and optimization

## Model Hub Integration

### Hub Architecture

Seamless integration with Hugging Face Hub:

- **Model Discovery**: Search and filter by task, language, size
- **Version Control**: Git-based model versioning and branching
- **Metadata Management**: Model cards, training details, evaluation metrics
- **Access Control**: Private models and organization management

### Loading Mechanisms

\`\`\`python
# Load from Hub
model = AutoModel.from_pretrained("microsoft/DialoGPT-medium")

# Load local model
model = AutoModel.from_pretrained("./my-local-model")

# Load with specific revision
model = AutoModel.from_pretrained("gpt2", revision="main")
\`\`\``,
    subsections: [
      { id: 'base-classes-and-model-loading', title: 'Base Classes and Model Loading', level: 2 },
      { id: 'pretrainedmodel-foundation', title: 'PreTrainedModel Foundation', level: 3 },
      { id: 'configuration-system', title: 'Configuration System', level: 3 },
      { id: 'tokenization-system', title: 'Tokenization System', level: 2 },
      { id: 'pretrainedtokenizer-architecture', title: 'PreTrainedTokenizer Architecture', level: 3 },
      { id: 'tokenization-features', title: 'Tokenization Features', level: 3 },
      { id: 'pipeline-system', title: 'Pipeline System', level: 2 },
      { id: 'task-agnostic-interface', title: 'Task-Agnostic Interface', level: 3 },
      { id: 'pipeline-architecture', title: 'Pipeline Architecture', level: 3 },
      { id: 'model-hub-integration', title: 'Model Hub Integration', level: 2 },
      { id: 'hub-architecture', title: 'Hub Architecture', level: 3 },
      { id: 'loading-mechanisms', title: 'Loading Mechanisms', level: 3 }
    ]
  },
  {
    id: 'training-system',
    title: 'Training System',
    content: `# Training System

## Trainer Class

### Core Training Infrastructure

The Trainer class provides a comprehensive training framework:

\`\`\`python
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
)

trainer.train()
\`\`\`

### Training Features

- **Automatic Mixed Precision**: FP16/BF16 training for memory efficiency
- **Gradient Accumulation**: Handle large effective batch sizes
- **Learning Rate Scheduling**: Cosine, linear, polynomial schedules
- **Early Stopping**: Prevent overfitting with patience-based stopping
- **Checkpointing**: Automatic saving and resuming from interruptions

## Training Arguments

### Comprehensive Configuration

TrainingArguments covers all aspects of training:

\`\`\`python
training_args = TrainingArguments(
    # Basic settings
    output_dir="./model-output",
    overwrite_output_dir=True,
    
    # Training parameters
    num_train_epochs=3,
    per_device_train_batch_size=8,
    gradient_accumulation_steps=2,
    
    # Optimization
    learning_rate=5e-5,
    weight_decay=0.01,
    adam_epsilon=1e-8,
    max_grad_norm=1.0,
    
    # Scheduling
    warmup_steps=1000,
    lr_scheduler_type="cosine",
    
    # Evaluation
    evaluation_strategy="steps",
    eval_steps=500,
    per_device_eval_batch_size=16,
    
    # Logging and saving
    logging_steps=100,
    save_steps=1000,
    save_total_limit=3,
    
    # Hardware optimization
    fp16=True,
    dataloader_num_workers=4,
)
\`\`\`

## Distributed Training

### Multi-GPU Support

Seamless scaling across multiple GPUs:

\`\`\`bash
# DataParallel (single machine)
python train.py

# DistributedDataParallel
python -m torch.distributed.launch --nproc_per_node=4 train.py

# Accelerate integration
accelerate launch train.py
\`\`\`

### Distributed Strategies

- **Data Parallelism**: Replicate model across GPUs, split data
- **Model Parallelism**: Split large models across devices
- **Pipeline Parallelism**: Stage-wise model execution
- **ZeRO Optimization**: Memory-efficient distributed training

## Evaluation and Metrics

### Built-in Evaluation

\`\`\`python
from transformers import EvalPrediction
import numpy as np
from sklearn.metrics import accuracy_score

def compute_metrics(eval_pred: EvalPrediction):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    return {"accuracy": accuracy_score(labels, predictions)}

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=compute_metrics,
)
\`\`\`

### Evaluation Features

- **Automatic Evaluation**: Periodic evaluation during training
- **Custom Metrics**: User-defined evaluation functions
- **Early Stopping**: Stop training based on evaluation metrics
- **Prediction Output**: Save predictions for analysis
- **Metric Logging**: Integration with TensorBoard, Weights & Biases

## Callbacks and Customization

### Training Callbacks

Extend training behavior with callbacks:

\`\`\`python
from transformers import TrainerCallback

class CustomCallback(TrainerCallback):
    def on_epoch_end(self, args, state, control, **kwargs):
        print(f"Epoch {state.epoch} completed")
        
    def on_train_end(self, args, state, control, **kwargs):
        print("Training completed!")

trainer.add_callback(CustomCallback())
\`\`\`

### Available Callbacks

- **EarlyStoppingCallback**: Stop training based on metrics
- **TensorBoardCallback**: Log metrics to TensorBoard
- **WandbCallback**: Weights & Biases integration
- **MLflowCallback**: MLflow experiment tracking
- **ProgressCallback**: Training progress bars`,
    subsections: [
      { id: 'trainer-class', title: 'Trainer Class', level: 2 },
      { id: 'core-training-infrastructure', title: 'Core Training Infrastructure', level: 3 },
      { id: 'training-features', title: 'Training Features', level: 3 },
      { id: 'training-arguments', title: 'Training Arguments', level: 2 },
      { id: 'comprehensive-configuration', title: 'Comprehensive Configuration', level: 3 },
      { id: 'distributed-training', title: 'Distributed Training', level: 2 },
      { id: 'multi-gpu-support', title: 'Multi-GPU Support', level: 3 },
      { id: 'distributed-strategies', title: 'Distributed Strategies', level: 3 },
      { id: 'evaluation-and-metrics', title: 'Evaluation and Metrics', level: 2 },
      { id: 'built-in-evaluation', title: 'Built-in Evaluation', level: 3 },
      { id: 'evaluation-features', title: 'Evaluation Features', level: 3 },
      { id: 'callbacks-and-customization', title: 'Callbacks and Customization', level: 2 },
      { id: 'training-callbacks', title: 'Training Callbacks', level: 3 },
      { id: 'available-callbacks', title: 'Available Callbacks', level: 3 }
    ]
  },
  {
    id: 'generation-system',
    title: 'Generation System',
    content: `# Generation System

## Text Generation Overview

### Generation Pipeline

The generation system provides sophisticated text generation capabilities:

\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# Simple generation
inputs = tokenizer("The future of AI is", return_tensors="pt")
outputs = model.generate(
    inputs.input_ids,
    max_length=50,
    num_return_sequences=3,
    temperature=0.8,
    do_sample=True
)

generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
\`\`\`

### Generation Methods

- **Greedy Decoding**: Select highest probability token at each step
- **Beam Search**: Maintain multiple hypotheses, select best sequence
- **Sampling**: Probabilistic token selection with temperature control
- **Top-k Sampling**: Sample from k most likely tokens
- **Top-p (Nucleus) Sampling**: Sample from cumulative probability mass

## Decoding Strategies

### Beam Search

Maintain multiple candidate sequences:

\`\`\`python
outputs = model.generate(
    input_ids,
    num_beams=5,
    num_return_sequences=3,
    early_stopping=True,
    max_length=100
)
\`\`\`

### Sampling with Temperature

Control randomness in generation:

\`\`\`python
# Conservative generation (low temperature)
outputs = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.3,
    max_length=50
)

# Creative generation (high temperature)
outputs = model.generate(
    input_ids,
    do_sample=True,
    temperature=1.2,
    max_length=50
)
\`\`\`

### Advanced Sampling

Combine multiple sampling strategies:

\`\`\`python
outputs = model.generate(
    input_ids,
    do_sample=True,
    temperature=0.8,
    top_k=50,
    top_p=0.95,
    repetition_penalty=1.2,
    max_length=100
)
\`\`\`

## Streaming Generation

### Real-time Generation

Generate text incrementally for better user experience:

\`\`\`python
from transformers import TextIteratorStreamer
import threading

streamer = TextIteratorStreamer(tokenizer, skip_special_tokens=True)

generation_kwargs = dict(
    input_ids=input_ids,
    streamer=streamer,
    max_length=100,
    do_sample=True,
    temperature=0.8
)

thread = threading.Thread(target=model.generate, kwargs=generation_kwargs)
thread.start()

for new_text in streamer:
    print(new_text, end="", flush=True)
\`\`\`

### Streaming Features

- **Token-by-token Output**: Real-time text generation
- **Interrupt Capability**: Stop generation mid-stream
- **Progress Tracking**: Monitor generation progress
- **Memory Efficiency**: Process long sequences incrementally

## Generation Configuration

### GenerationConfig

Centralized generation parameter management:

\`\`\`python
from transformers import GenerationConfig

generation_config = GenerationConfig(
    max_length=100,
    min_length=10,
    do_sample=True,
    temperature=0.8,
    top_k=50,
    top_p=0.95,
    repetition_penalty=1.1,
    length_penalty=1.0,
    early_stopping=True,
    pad_token_id=tokenizer.eos_token_id
)

outputs = model.generate(input_ids, generation_config=generation_config)
\`\`\`

### Parameter Categories

- **Length Control**: max_length, min_length, length_penalty
- **Sampling Control**: temperature, top_k, top_p, do_sample
- **Quality Control**: repetition_penalty, no_repeat_ngram_size
- **Stopping Criteria**: early_stopping, eos_token_id
- **Beam Search**: num_beams, num_beam_groups, diversity_penalty

## Constrained Generation

### Guided Generation

Control generation with constraints:

\`\`\`python
from transformers import DisjunctiveConstraint

# Force inclusion of specific phrases
constraints = [
    DisjunctiveConstraint([
        tokenizer("artificial intelligence", add_special_tokens=False).input_ids,
        tokenizer("machine learning", add_special_tokens=False).input_ids
    ])
]

outputs = model.generate(
    input_ids,
    constraints=constraints,
    num_beams=5,
    max_length=100
)
\`\`\`

### Constraint Types

- **Disjunctive Constraints**: Include one of several options
- **Phrase Constraints**: Force specific phrase inclusion
- **Token Constraints**: Control individual token selection
- **Format Constraints**: Maintain specific output formats`,
    subsections: [
      { id: 'text-generation-overview', title: 'Text Generation Overview', level: 2 },
      { id: 'generation-pipeline', title: 'Generation Pipeline', level: 3 },
      { id: 'generation-methods', title: 'Generation Methods', level: 3 },
      { id: 'decoding-strategies', title: 'Decoding Strategies', level: 2 },
      { id: 'beam-search', title: 'Beam Search', level: 3 },
      { id: 'sampling-with-temperature', title: 'Sampling with Temperature', level: 3 },
      { id: 'advanced-sampling', title: 'Advanced Sampling', level: 3 },
      { id: 'streaming-generation', title: 'Streaming Generation', level: 2 },
      { id: 'real-time-generation', title: 'Real-time Generation', level: 3 },
      { id: 'streaming-features', title: 'Streaming Features', level: 3 },
      { id: 'generation-configuration', title: 'Generation Configuration', level: 2 },
      { id: 'generationconfig', title: 'GenerationConfig', level: 3 },
      { id: 'parameter-categories', title: 'Parameter Categories', level: 3 },
      { id: 'constrained-generation', title: 'Constrained Generation', level: 2 },
      { id: 'guided-generation', title: 'Guided Generation', level: 3 },
      { id: 'constraint-types', title: 'Constraint Types', level: 3 }
    ]
  },
  {
    id: 'model-implementations',
    title: 'Model Implementations',
    content: `# Model Implementations

## Architecture Families

### Transformer Architectures

The library supports major transformer variants:

#### Encoder-Only Models
- **BERT**: Bidirectional encoder for understanding tasks
- **RoBERTa**: Robustly optimized BERT pretraining
- **DeBERTa**: Decoding-enhanced BERT with disentangled attention
- **ELECTRA**: Efficiently learning encoder through replaced token detection

#### Decoder-Only Models
- **GPT**: Generative pretrained transformer family
- **GPT-2**: Improved language modeling with larger scale
- **GPT-Neo/GPT-J**: Open-source GPT alternatives
- **OPT**: Open pretrained transformer models

#### Encoder-Decoder Models
- **T5**: Text-to-text transfer transformer
- **BART**: Bidirectional and auto-regressive transformers
- **Pegasus**: Pretraining with extracted gap-sentences
- **mT5**: Multilingual T5 for cross-lingual tasks

### Implementation Example

\`\`\`python
from transformers import (
    AutoModel, AutoTokenizer,
    BertModel, GPT2LMHeadModel, T5ForConditionalGeneration
)

# Auto classes (recommended)
model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Specific model classes
bert_model = BertModel.from_pretrained("bert-base-uncased")
gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
t5_model = T5ForConditionalGeneration.from_pretrained("t5-small")
\`\`\`

## Vision Models

### Computer Vision Architectures

Support for vision transformers and CNN models:

\`\`\`python
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image

# Vision Transformer
processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
model = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")

# Process image
image = Image.open("image.jpg")
inputs = processor(images=image, return_tensors="pt")
outputs = model(**inputs)
predictions = outputs.logits.softmax(dim=-1)
\`\`\`

### Vision Model Types

- **Vision Transformer (ViT)**: Pure transformer for image classification
- **DeiT**: Data-efficient image transformers
- **Swin Transformer**: Hierarchical vision transformer
- **ConvNeXT**: Modernized ConvNet architecture
- **DETR**: Detection transformer for object detection

## Audio Models

### Speech and Audio Processing

Comprehensive audio model support:

\`\`\`python
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import soundfile as sf

# Load audio model
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

# Process audio
audio_input, sample_rate = sf.read("audio.wav")
inputs = processor(audio_input, sampling_rate=sample_rate, return_tensors="pt")
outputs = model(**inputs)

# Decode predictions
predicted_ids = torch.argmax(outputs.logits, dim=-1)
transcription = processor.decode(predicted_ids[0])
\`\`\`

### Audio Model Categories

- **Wav2Vec2**: Self-supervised speech representation learning
- **Whisper**: Robust speech recognition and translation
- **SpeechT5**: Unified speech and text pretraining
- **Bark**: Text-to-speech with voice cloning
- **MusicGen**: Music generation from text descriptions

## Multimodal Models

### Vision-Language Models

Models that process both text and images:

\`\`\`python
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

# CLIP model
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

# Process image and text
image = Image.open("image.jpg")
text = ["a photo of a cat", "a photo of a dog"]

inputs = processor(text=text, images=image, return_tensors="pt", padding=True)
outputs = model(**inputs)

# Get similarity scores
logits_per_image = outputs.logits_per_image
probs = logits_per_image.softmax(dim=1)
\`\`\`

### Multimodal Architectures

- **CLIP**: Contrastive language-image pretraining
- **BLIP**: Bootstrapping language-image pretraining
- **LayoutLM**: Document understanding with layout
- **LXMERT**: Learning cross-modality encoder representations
- **ViLBERT**: Vision-and-language BERT

## Model Optimization

### Quantization and Compression

Optimize models for deployment:

\`\`\`python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# 8-bit quantization
quantization_config = BitsAndBytesConfig(load_in_8bit=True)
model = AutoModelForCausalLM.from_pretrained(
    "microsoft/DialoGPT-medium",
    quantization_config=quantization_config
)

# 4-bit quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16
)
model = AutoModelForCausalLM.from_pretrained(
    "microsoft/DialoGPT-medium",
    quantization_config=quantization_config
)
\`\`\`

### Optimization Techniques

- **Quantization**: 8-bit and 4-bit weight compression
- **Pruning**: Remove unnecessary model parameters
- **Distillation**: Train smaller models from larger teachers
- **ONNX Export**: Convert models for optimized inference
- **TensorRT**: NVIDIA GPU optimization`,
    subsections: [
      { id: 'architecture-families', title: 'Architecture Families', level: 2 },
      { id: 'transformer-architectures', title: 'Transformer Architectures', level: 3 },
      { id: 'implementation-example', title: 'Implementation Example', level: 3 },
      { id: 'vision-models', title: 'Vision Models', level: 2 },
      { id: 'computer-vision-architectures', title: 'Computer Vision Architectures', level: 3 },
      { id: 'vision-model-types', title: 'Vision Model Types', level: 3 },
      { id: 'audio-models', title: 'Audio Models', level: 2 },
      { id: 'speech-and-audio-processing', title: 'Speech and Audio Processing', level: 3 },
      { id: 'audio-model-categories', title: 'Audio Model Categories', level: 3 },
      { id: 'multimodal-models', title: 'Multimodal Models', level: 2 },
      { id: 'vision-language-models', title: 'Vision-Language Models', level: 3 },
      { id: 'multimodal-architectures', title: 'Multimodal Architectures', level: 3 },
      { id: 'model-optimization', title: 'Model Optimization', level: 2 },
      { id: 'quantization-and-compression', title: 'Quantization and Compression', level: 3 },
      { id: 'optimization-techniques', title: 'Optimization Techniques', level: 3 }
    ]
  }
];

// Paper to documentation section mapping
const paperToSectionMapping: Record<string, string> = {
  '1': 'core-architecture', // Attention Is All You Need -> Core Architecture
  '2': 'model-implementations', // BERT -> Model Implementations  
  '3': 'generation-system', // GPT-3 -> Generation System
  '4': 'training-system', // ResNet -> Training System
  '5': 'overview' // GANs -> Overview
};

// Helper function to get documentation section for a paper
export function getDocSectionForPaper(paperId: string): DocSection | null {
  const sectionId = paperToSectionMapping[paperId];
  if (!sectionId) return null;
  
  return mockDocSections.find(section => section.id === sectionId) || null;
}

// Helper function to get all available paper IDs
export function getAvailablePaperIds(): string[] {
  return samplePapers.map(paper => paper.id);
}

// Helper function to get all available section IDs
export function getAvailableSectionIds(): string[] {
  return mockDocSections.map(section => section.id);
}