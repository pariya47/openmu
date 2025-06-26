export interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

export const mockDocSections: DocSection[] = [
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

- **Unified Model Access**: A consistent API across 500+ model architectures through Auto classes
- **Multi-Framework Support**: Native implementations for PyTorch, TensorFlow, and JAX/Flax
- **Production-Ready Inference**: Optimized Pipeline API for common tasks
- **Comprehensive Training**: Full training infrastructure with the Trainer class
- **Advanced Generation**: Sophisticated text generation with multiple decoding strategies
- **Memory Optimization**: Quantization support and efficient caching mechanisms

## Core Library Structure

The library follows a modular architecture with clear separation of concerns:

### Auto-Loading System Architecture

The Auto classes provide dynamic model loading based on configuration files, enabling seamless switching between different model architectures without code changes.

### Key Design Patterns

- **Lazy Loading and Import Structure**: Models and components are loaded on-demand to minimize memory footprint
- **Configuration-Driven Architecture**: All model behavior is controlled through configuration objects
- **Multi-Framework Abstraction**: Common interfaces abstract away framework-specific implementations

## Model Ecosystem Overview

Transformers supports a vast ecosystem of models across different domains:

- **Language Models**: GPT, BERT, T5, LLaMA, and hundreds more
- **Vision Models**: ViT, CLIP, DETR for image processing tasks
- **Audio Models**: Wav2Vec2, Whisper for speech processing
- **Multimodal Models**: CLIP, LayoutLM for cross-modal understanding
    `,
    subsections: [
      { id: 'library-purpose', title: 'Library Purpose and Scope', level: 2 },
      { id: 'high-level-architecture', title: 'High-Level Architecture', level: 2 },
      { id: 'core-library-structure', title: 'Core Library Structure', level: 2 },
      { id: 'auto-loading-system', title: 'Auto-Loading System Architecture', level: 3 },
      { id: 'key-design-patterns', title: 'Key Design Patterns', level: 3 },
      { id: 'model-ecosystem', title: 'Model Ecosystem Overview', level: 2 }
    ]
  },
  {
    id: 'core-architecture',
    title: 'Core Architecture',
    content: `
# Core Architecture

## Base Classes and Model Loading

The Transformers library is built on a foundation of base classes that provide consistent interfaces across different model architectures and frameworks.

### PreTrainedModel Base Class

All PyTorch models inherit from \`PreTrainedModel\`, which provides:

- **Model Loading**: Automatic weight loading from pretrained checkpoints
- **Configuration Management**: Integration with model-specific configuration classes
- **Device Management**: Automatic handling of GPU/CPU placement
- **Serialization**: Save and load functionality for models and tokenizers

### Auto Classes System

The Auto classes (\`AutoModel\`, \`AutoTokenizer\`, \`AutoConfig\`) provide dynamic loading:

\`\`\`python
from transformers import AutoModel, AutoTokenizer

# Automatically detects model type and loads appropriate classes
model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
\`\`\`

## Configuration System

Every model is controlled by a configuration object that defines:

- **Architecture Parameters**: Hidden sizes, number of layers, attention heads
- **Task-Specific Settings**: Number of labels, problem type (classification/regression)
- **Generation Parameters**: Max length, sampling strategies, special tokens

### Configuration Inheritance

Configurations follow an inheritance hierarchy:

\`\`\`
PretrainedConfig
├── BertConfig
├── GPT2Config
├── T5Config
└── ...
\`\`\`

## Tokenization Architecture

Tokenizers handle the conversion between text and model inputs:

### Fast vs Slow Tokenizers

- **Fast Tokenizers**: Rust-based implementation with parallel processing
- **Slow Tokenizers**: Python implementation with full feature compatibility

### Tokenizer Features

- **Subword Tokenization**: BPE, WordPiece, SentencePiece support
- **Special Token Handling**: Automatic insertion of [CLS], [SEP], etc.
- **Padding and Truncation**: Batch processing with consistent lengths
- **Attention Masks**: Automatic generation of attention masks

## Multi-Framework Support

The library provides native implementations across frameworks:

### Framework-Specific Base Classes

- **PyTorch**: \`PreTrainedModel\` with automatic differentiation
- **TensorFlow**: \`TFPreTrainedModel\` with Keras integration
- **JAX/Flax**: \`FlaxPreTrainedModel\` with functional programming paradigms

### Cross-Framework Compatibility

Models can be converted between frameworks:

\`\`\`python
# Load PyTorch model and convert to TensorFlow
pytorch_model = AutoModel.from_pretrained("bert-base-uncased")
tf_model = TFAutoModel.from_pretrained("bert-base-uncased", from_pytorch=True)
\`\`\`
    `,
    subsections: [
      { id: 'base-classes', title: 'Base Classes and Model Loading', level: 2 },
      { id: 'pretrained-model', title: 'PreTrainedModel Base Class', level: 3 },
      { id: 'auto-classes', title: 'Auto Classes System', level: 3 },
      { id: 'configuration-system', title: 'Configuration System', level: 2 },
      { id: 'config-inheritance', title: 'Configuration Inheritance', level: 3 },
      { id: 'tokenization', title: 'Tokenization Architecture', level: 2 },
      { id: 'fast-slow-tokenizers', title: 'Fast vs Slow Tokenizers', level: 3 },
      { id: 'tokenizer-features', title: 'Tokenizer Features', level: 3 },
      { id: 'multi-framework', title: 'Multi-Framework Support', level: 2 },
      { id: 'framework-classes', title: 'Framework-Specific Base Classes', level: 3 },
      { id: 'cross-framework', title: 'Cross-Framework Compatibility', level: 3 }
    ]
  },
  {
    id: 'training-system',
    title: 'Training System',
    content: `
# Training System

## Trainer Class Architecture

The \`Trainer\` class provides a high-level interface for training and evaluation, abstracting away the complexity of the training loop while maintaining flexibility for customization.

### Core Training Components

- **Training Loop**: Automatic handling of forward/backward passes, gradient accumulation
- **Evaluation**: Built-in evaluation during training with metric computation
- **Checkpointing**: Automatic saving and loading of model states
- **Logging**: Integration with popular logging frameworks (TensorBoard, Weights & Biases)

### Trainer Initialization

\`\`\`python
from transformers import Trainer, TrainingArguments

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
    tokenizer=tokenizer,
)
\`\`\`

## Training Arguments System

\`TrainingArguments\` centralizes all training configuration:

### Learning Rate and Optimization

- **Learning Rate Scheduling**: Linear, cosine, polynomial decay options
- **Optimizer Selection**: AdamW, SGD, Adafactor support
- **Gradient Clipping**: Automatic gradient norm clipping
- **Mixed Precision**: Automatic mixed precision with FP16/BF16

### Batch Processing

- **Dynamic Batching**: Automatic padding within batches
- **Gradient Accumulation**: Simulate larger batch sizes on limited hardware
- **DataLoader Configuration**: Multi-processing and prefetching options

## Custom Training Loops

For advanced use cases, the library supports custom training implementations:

### Subclassing Trainer

\`\`\`python
class CustomTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False):
        # Custom loss computation
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.logits
        loss = custom_loss_function(logits, labels)
        return (loss, outputs) if return_outputs else loss
\`\`\`

### Training Callbacks

The callback system allows for custom behavior during training:

- **EarlyStoppingCallback**: Stop training based on evaluation metrics
- **WandbCallback**: Weights & Biases integration
- **TensorBoardCallback**: TensorBoard logging
- **Custom Callbacks**: User-defined training interventions

## Distributed Training

Support for training across multiple devices and nodes:

### Data Parallel Training

- **DataParallel**: Single-node multi-GPU training
- **DistributedDataParallel**: Multi-node distributed training
- **DeepSpeed Integration**: Memory-efficient training for large models

### Model Parallel Training

- **Pipeline Parallelism**: Split model across devices by layers
- **Tensor Parallelism**: Split individual layers across devices
- **Gradient Checkpointing**: Trade computation for memory

## Evaluation and Metrics

Comprehensive evaluation framework:

### Built-in Metrics

- **Classification**: Accuracy, F1, precision, recall
- **Regression**: MSE, MAE, R²
- **Generation**: BLEU, ROUGE, perplexity
- **Custom Metrics**: User-defined evaluation functions

### Evaluation Strategies

- **Steps-based**: Evaluate every N training steps
- **Epoch-based**: Evaluate at the end of each epoch
- **No Evaluation**: Training-only mode for large-scale pretraining
    `,
    subsections: [
      { id: 'trainer-architecture', title: 'Trainer Class Architecture', level: 2 },
      { id: 'core-components', title: 'Core Training Components', level: 3 },
      { id: 'trainer-init', title: 'Trainer Initialization', level: 3 },
      { id: 'training-arguments', title: 'Training Arguments System', level: 2 },
      { id: 'learning-rate', title: 'Learning Rate and Optimization', level: 3 },
      { id: 'batch-processing', title: 'Batch Processing', level: 3 },
      { id: 'custom-training', title: 'Custom Training Loops', level: 2 },
      { id: 'subclassing', title: 'Subclassing Trainer', level: 3 },
      { id: 'callbacks', title: 'Training Callbacks', level: 3 },
      { id: 'distributed', title: 'Distributed Training', level: 2 },
      { id: 'data-parallel', title: 'Data Parallel Training', level: 3 },
      { id: 'model-parallel', title: 'Model Parallel Training', level: 3 },
      { id: 'evaluation', title: 'Evaluation and Metrics', level: 2 },
      { id: 'built-in-metrics', title: 'Built-in Metrics', level: 3 },
      { id: 'eval-strategies', title: 'Evaluation Strategies', level: 3 }
    ]
  },
  {
    id: 'generation-system',
    title: 'Generation System',
    content: `
# Generation System

## Text Generation Architecture

The generation system in Transformers provides sophisticated text generation capabilities with multiple decoding strategies and fine-grained control over the generation process.

### Generation Methods

The library supports various generation strategies:

- **Greedy Decoding**: Select the most probable token at each step
- **Beam Search**: Maintain multiple hypotheses and select the best sequence
- **Sampling**: Random sampling with temperature and top-k/top-p filtering
- **Contrastive Search**: Balance coherence and diversity in generation

### Generation Configuration

\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# Configure generation parameters
generation_config = {
    "max_length": 100,
    "temperature": 0.7,
    "top_k": 50,
    "top_p": 0.9,
    "do_sample": True,
    "pad_token_id": tokenizer.eos_token_id
}

outputs = model.generate(input_ids, **generation_config)
\`\`\`

## Decoding Strategies

### Beam Search Decoding

Beam search maintains multiple partial sequences (beams) and explores the most promising paths:

- **Beam Width**: Number of hypotheses to maintain
- **Length Penalty**: Adjust scores based on sequence length
- **Early Stopping**: Stop when all beams end with EOS token
- **No Repeat N-gram**: Prevent repetitive patterns

### Sampling Methods

Advanced sampling techniques for diverse generation:

- **Temperature Scaling**: Control randomness in token selection
- **Top-k Sampling**: Sample from the k most probable tokens
- **Top-p (Nucleus) Sampling**: Sample from tokens with cumulative probability p
- **Typical Sampling**: Sample based on conditional entropy

### Contrastive Search

A newer decoding method that balances:

- **Model Confidence**: Prefer tokens with high probability
- **Contrastive Objective**: Avoid repetition by penalizing similar contexts
- **Degeneration Penalty**: Reduce likelihood of repetitive text

## Generation Utilities

### Stopping Criteria

Flexible stopping conditions for generation:

\`\`\`python
from transformers import StoppingCriteria, StoppingCriteriaList

class CustomStoppingCriteria(StoppingCriteria):
    def __init__(self, target_sequence, tokenizer):
        self.target_sequence = target_sequence
        self.tokenizer = tokenizer

    def __call__(self, input_ids, scores, **kwargs):
        # Custom logic to stop generation
        return self.should_stop(input_ids)

stopping_criteria = StoppingCriteriaList([CustomStoppingCriteria(...)])
outputs = model.generate(input_ids, stopping_criteria=stopping_criteria)
\`\`\`

### Logits Processors

Modify token probabilities during generation:

- **RepetitionPenaltyLogitsProcessor**: Penalize repeated tokens
- **TemperatureLogitsWarper**: Apply temperature scaling
- **TopKLogitsWarper**: Implement top-k filtering
- **TopPLogitsWarper**: Implement nucleus sampling

## Constrained Generation

Generate text that follows specific constraints:

### Guided Generation

- **Prefix Constraints**: Force generation to start with specific tokens
- **Suffix Constraints**: Ensure generation ends with specific patterns
- **Banned Words**: Prevent generation of specific tokens or phrases

### Structured Generation

- **Grammar-Constrained**: Follow formal grammar rules
- **Format-Constrained**: Generate JSON, XML, or other structured formats
- **Template-Based**: Fill in predefined templates with generated content

## Streaming Generation

Real-time generation for interactive applications:

\`\`\`python
from transformers import TextIteratorStreamer
import threading

streamer = TextIteratorStreamer(tokenizer, skip_prompt=True)

generation_kwargs = {
    "input_ids": input_ids,
    "streamer": streamer,
    "max_length": 100,
    "do_sample": True,
    "temperature": 0.7
}

thread = threading.Thread(target=model.generate, kwargs=generation_kwargs)
thread.start()

for new_text in streamer:
    print(new_text, end="", flush=True)
\`\`\`

## Multi-Modal Generation

Support for generating text from various input modalities:

### Vision-Language Models

- **Image Captioning**: Generate descriptions from images
- **Visual Question Answering**: Answer questions about images
- **Image-to-Text**: Convert visual content to textual descriptions

### Audio-Language Models

- **Speech-to-Text**: Transcribe audio to text
- **Audio Captioning**: Describe audio content in text
- **Music Generation**: Generate musical sequences
    `,
    subsections: [
      { id: 'generation-architecture', title: 'Text Generation Architecture', level: 2 },
      { id: 'generation-methods', title: 'Generation Methods', level: 3 },
      { id: 'generation-config', title: 'Generation Configuration', level: 3 },
      { id: 'decoding-strategies', title: 'Decoding Strategies', level: 2 },
      { id: 'beam-search', title: 'Beam Search Decoding', level: 3 },
      { id: 'sampling-methods', title: 'Sampling Methods', level: 3 },
      { id: 'contrastive-search', title: 'Contrastive Search', level: 3 },
      { id: 'generation-utilities', title: 'Generation Utilities', level: 2 },
      { id: 'stopping-criteria', title: 'Stopping Criteria', level: 3 },
      { id: 'logits-processors', title: 'Logits Processors', level: 3 },
      { id: 'constrained-generation', title: 'Constrained Generation', level: 2 },
      { id: 'guided-generation', title: 'Guided Generation', level: 3 },
      { id: 'structured-generation', title: 'Structured Generation', level: 3 },
      { id: 'streaming-generation', title: 'Streaming Generation', level: 2 },
      { id: 'multi-modal', title: 'Multi-Modal Generation', level: 2 },
      { id: 'vision-language', title: 'Vision-Language Models', level: 3 },
      { id: 'audio-language', title: 'Audio-Language Models', level: 3 }
    ]
  },
  {
    id: 'model-implementations',
    title: 'Model Implementations',
    content: `
# Model Implementations

## Architecture Families

The Transformers library implements hundreds of model architectures, organized into major families based on their design principles and use cases.

### Encoder-Only Models

Models that process input sequences to create rich representations:

#### BERT Family
- **BERT**: Bidirectional Encoder Representations from Transformers
- **RoBERTa**: Robustly Optimized BERT Pretraining Approach
- **DeBERTa**: Decoding-enhanced BERT with Disentangled Attention
- **ELECTRA**: Efficiently Learning an Encoder that Classifies Token Replacements Accurately

#### Specialized Encoders
- **DistilBERT**: Distilled version of BERT with 97% performance, 60% size
- **ALBERT**: A Lite BERT for Self-supervised Learning of Language Representations
- **CamemBERT**: French language model based on RoBERTa architecture

### Decoder-Only Models

Autoregressive models designed for text generation:

#### GPT Family
- **GPT**: Generative Pre-trained Transformer
- **GPT-2**: Language Models are Unsupervised Multitask Learners
- **GPT-Neo/GPT-J**: Open-source alternatives to GPT-3
- **CodeGen**: Specialized for code generation tasks

#### Large Language Models
- **LLaMA**: Large Language Model Meta AI
- **Falcon**: Technology Innovation Institute's language model
- **MPT**: MosaicML Pretrained Transformer
- **Bloom**: BigScience Large Open-science Open-access Multilingual language model

### Encoder-Decoder Models

Sequence-to-sequence models for translation and summarization:

#### T5 Family
- **T5**: Text-to-Text Transfer Transformer
- **UL2**: Unified Language Learner framework
- **Flan-T5**: Instruction-tuned version of T5

#### Specialized Seq2Seq
- **BART**: Denoising Autoencoder for Natural Language Generation
- **Pegasus**: Pre-training with Extracted Gap-sentences for Abstractive Summarization
- **mT5**: Multilingual T5 for cross-lingual tasks

## Vision Models

Computer vision architectures integrated with the Transformers ecosystem:

### Vision Transformers
- **ViT**: Vision Transformer for image classification
- **DeiT**: Data-efficient Image Transformers
- **Swin**: Shifted Window Transformer for hierarchical vision
- **BEiT**: BERT Pre-Training of Image Transformers

### Multi-Modal Vision
- **CLIP**: Contrastive Language-Image Pre-training
- **BLIP**: Bootstrapping Language-Image Pre-training
- **LayoutLM**: Pre-training of Text and Layout for Document AI
- **DETR**: Detection Transformer for object detection

## Audio Models

Speech and audio processing architectures:

### Speech Recognition
- **Wav2Vec2**: Self-Supervised Learning for Speech Recognition
- **Whisper**: Robust Speech Recognition via Large-Scale Weak Supervision
- **SpeechT5**: Unified-Modal Encoder-Decoder Pre-training for Spoken Language Processing

### Audio Generation
- **MusicGen**: Simple and Controllable Music Generation
- **AudioLM**: Language Modeling Approach to Audio Generation
- **Bark**: Text-Prompted Generative Audio Model

## Implementation Patterns

### Model Registration System

All models follow a consistent registration pattern:

\`\`\`python
# Model configuration
class CustomConfig(PretrainedConfig):
    model_type = "custom"
    
    def __init__(self, vocab_size=30522, hidden_size=768, **kwargs):
        super().__init__(**kwargs)
        self.vocab_size = vocab_size
        self.hidden_size = hidden_size

# Model implementation
class CustomModel(PreTrainedModel):
    config_class = CustomConfig
    
    def __init__(self, config):
        super().__init__(config)
        # Model layers initialization
        
    def forward(self, input_ids, attention_mask=None, **kwargs):
        # Forward pass implementation
        return outputs

# Registration with Auto classes
AutoConfig.register("custom", CustomConfig)
AutoModel.register(CustomConfig, CustomModel)
\`\`\`

### Layer Implementations

Common layer patterns across architectures:

#### Attention Mechanisms
- **Multi-Head Attention**: Standard transformer attention
- **Sparse Attention**: Efficient attention for long sequences
- **Local Attention**: Sliding window attention patterns
- **Cross Attention**: Attention between different modalities

#### Position Encodings
- **Absolute Position**: Learned or sinusoidal position embeddings
- **Relative Position**: T5-style relative position bias
- **Rotary Position**: RoPE (Rotary Position Embedding)
- **ALiBi**: Attention with Linear Biases

### Memory Optimization

Techniques for efficient model implementation:

#### Gradient Checkpointing
Trade computation for memory by recomputing activations:

\`\`\`python
model.gradient_checkpointing_enable()
\`\`\`

#### Model Sharding
Distribute model parameters across devices:

- **Pipeline Parallelism**: Split by layers
- **Tensor Parallelism**: Split within layers
- **Data Parallelism**: Replicate across devices

#### Quantization Support
Reduce memory footprint with lower precision:

- **8-bit Quantization**: bitsandbytes integration
- **4-bit Quantization**: QLoRA support
- **Dynamic Quantization**: Runtime precision adjustment

## Custom Model Development

Guidelines for implementing new architectures:

### Model Structure
1. **Configuration Class**: Define model hyperparameters
2. **Model Class**: Implement the neural network architecture
3. **Tokenizer**: Handle text preprocessing (if needed)
4. **Auto Registration**: Enable automatic loading

### Testing Framework
- **Model Tests**: Verify forward pass and gradient computation
- **Integration Tests**: Test with pipelines and training
- **Serialization Tests**: Ensure save/load functionality
- **Cross-Framework Tests**: Verify multi-framework compatibility

### Documentation Requirements
- **Model Card**: Describe model capabilities and limitations
- **Usage Examples**: Provide clear implementation examples
- **Performance Benchmarks**: Document speed and accuracy metrics
- **Citation Information**: Reference original papers and implementations
    `,
    subsections: [
      { id: 'architecture-families', title: 'Architecture Families', level: 2 },
      { id: 'encoder-only', title: 'Encoder-Only Models', level: 3 },
      { id: 'bert-family', title: 'BERT Family', level: 4 },
      { id: 'specialized-encoders', title: 'Specialized Encoders', level: 4 },
      { id: 'decoder-only', title: 'Decoder-Only Models', level: 3 },
      { id: 'gpt-family', title: 'GPT Family', level: 4 },
      { id: 'large-language-models', title: 'Large Language Models', level: 4 },
      { id: 'encoder-decoder', title: 'Encoder-Decoder Models', level: 3 },
      { id: 't5-family', title: 'T5 Family', level: 4 },
      { id: 'specialized-seq2seq', title: 'Specialized Seq2Seq', level: 4 },
      { id: 'vision-models', title: 'Vision Models', level: 2 },
      { id: 'vision-transformers', title: 'Vision Transformers', level: 3 },
      { id: 'multi-modal-vision', title: 'Multi-Modal Vision', level: 3 },
      { id: 'audio-models', title: 'Audio Models', level: 2 },
      { id: 'speech-recognition', title: 'Speech Recognition', level: 3 },
      { id: 'audio-generation', title: 'Audio Generation', level: 3 },
      { id: 'implementation-patterns', title: 'Implementation Patterns', level: 2 },
      { id: 'model-registration', title: 'Model Registration System', level: 3 },
      { id: 'layer-implementations', title: 'Layer Implementations', level: 3 },
      { id: 'attention-mechanisms', title: 'Attention Mechanisms', level: 4 },
      { id: 'position-encodings', title: 'Position Encodings', level: 4 },
      { id: 'memory-optimization', title: 'Memory Optimization', level: 3 },
      { id: 'gradient-checkpointing', title: 'Gradient Checkpointing', level: 4 },
      { id: 'model-sharding', title: 'Model Sharding', level: 4 },
      { id: 'quantization', title: 'Quantization Support', level: 4 },
      { id: 'custom-development', title: 'Custom Model Development', level: 2 },
      { id: 'model-structure', title: 'Model Structure', level: 3 },
      { id: 'testing-framework', title: 'Testing Framework', level: 3 },
      { id: 'documentation', title: 'Documentation Requirements', level: 3 }
    ]
  }
];