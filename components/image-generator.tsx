'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { GenerateRequestSchema, type Category } from '@/lib/schemas';
import { validateImage, isValidBase64Image } from '@/lib/image-utils-client';

// Form schema for the component
const ImageGeneratorFormSchema = z.object({
    category: z.enum(['eticaret', 'giyim', 'taki', 'teknoloji', 'guzellik']),
    modelImage: z.string().min(1, 'Model resmi zorunludur'),
    productImage: z.string().min(1, 'Ürün resmi zorunludur'),
});

type ImageGeneratorForm = z.infer<typeof ImageGeneratorFormSchema>;

interface UploadedImage {
    file: File;
    preview: string;
    base64: string;
    isValid: boolean;
    errors: string[];
}

interface GenerationResult {
    success: boolean;
    data?: {
        generationId: string;
        generatedImage: string;
        downloadUrl: string;
    };
    error?: {
        code: string;
        message: string;
    };
}

const CATEGORIES: { value: Category; label: string; description: string }[] = [
    { value: 'eticaret', label: 'E-ticaret', description: 'Genel ürün fotoğrafçılığı' },
    { value: 'giyim', label: 'Giyim', description: 'Kıyafet ve aksesuarlar' },
    { value: 'taki', label: 'Takı', description: 'Yüzük, kolye ve aksesuarlar' },
    { value: 'teknoloji', label: 'Teknoloji', description: 'Elektronik ve gadgetlar' },
    { value: 'guzellik', label: 'Güzellik', description: 'Kozmetik ve cilt bakımı' },
];

export function ImageGenerator() {
    const [modelImage, setModelImage] = useState<UploadedImage | null>(null);
    const [productImage, setProductImage] = useState<UploadedImage | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<ImageGeneratorForm>({
        resolver: zodResolver(ImageGeneratorFormSchema),
        mode: 'onChange',
    });

    const selectedCategory = watch('category');

    // Convert file to base64 and validate
    const processFile = useCallback(async (file: File): Promise<UploadedImage> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;

                // Validate the image
                const validation = await validateImage(base64);

                resolve({
                    file,
                    preview: URL.createObjectURL(file),
                    base64,
                    isValid: validation.isValid,
                    errors: validation.errors,
                });
            };
            reader.readAsDataURL(file);
        });
    }, []);

    // Handle model image upload
    const onModelImageDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const processedImage = await processFile(file);
            setModelImage(processedImage);

            if (processedImage.isValid) {
                setValue('modelImage', processedImage.base64, { shouldValidate: true });
            } else {
                setValue('modelImage', '', { shouldValidate: true });
            }
        }
    }, [processFile, setValue]);

    // Handle product image upload
    const onProductImageDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const processedImage = await processFile(file);
            setProductImage(processedImage);

            if (processedImage.isValid) {
                setValue('productImage', processedImage.base64, { shouldValidate: true });
            } else {
                setValue('productImage', '', { shouldValidate: true });
            }
        }
    }, [processFile, setValue]);

    // Dropzone for model image
    const modelImageDropzone = useDropzone({
        onDrop: onModelImageDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    // Dropzone for product image
    const productImageDropzone = useDropzone({
        onDrop: onProductImageDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    // Remove uploaded image
    const removeImage = (type: 'model' | 'product') => {
        if (type === 'model') {
            if (modelImage?.preview) {
                URL.revokeObjectURL(modelImage.preview);
            }
            setModelImage(null);
            setValue('modelImage', '', { shouldValidate: true });
        } else {
            if (productImage?.preview) {
                URL.revokeObjectURL(productImage.preview);
            }
            setProductImage(null);
            setValue('productImage', '', { shouldValidate: true });
        }
    };

    // Submit form and generate image
    const onSubmit = async (data: ImageGeneratorForm) => {
        if (!modelImage?.isValid || !productImage?.isValid) {
            return;
        }

        setIsGenerating(true);
        setGenerationResult(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: data.category,
                    modelImage: data.modelImage,
                    productImage: data.productImage,
                }),
            });

            const result = await response.json();
            setGenerationResult(result);
        } catch (error) {
            setGenerationResult({
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: 'Görsel oluşturulamadı. Lütfen tekrar deneyin.',
                },
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Reset form
    const resetForm = () => {
        removeImage('model');
        removeImage('product');
        setGenerationResult(null);
        setValue('category', 'eticaret');
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">AI Ürün Görsel Üretici</h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Çarpıcı ürün fotoğrafçılığı oluşturmak için model resmi ve ürün resmi yükleyin
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Category Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground">
                        Kategori <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map((category) => (
                            <motion.div
                                key={category.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        value={category.value}
                                        {...register('category')}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`rounded-2xl border px-5 py-4 transition-all backdrop-blur ${selectedCategory === category.value ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/50'}`}
                                    >
                                        <div className={`text-sm font-semibold ${selectedCategory === category.value ? 'text-primary' : 'text-foreground'}`}>{category.label}</div>
                                        <div className="mt-1 text-xs text-muted-foreground/80">{category.description}</div>
                                    </div>
                                </label>
                            </motion.div>
                        ))}
                    </div>
                    {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                </div>

                {/* Image Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Model Image Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-muted-foreground">
                            Model Resmi <span className="text-destructive">*</span>
                        </label>
                        <div
                            {...modelImageDropzone.getRootProps()}
                            className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center shadow-lg shadow-black/10 backdrop-blur transition-all cursor-pointer ${modelImageDropzone.isDragActive ? 'border-primary/50 bg-primary/10' : 'border-border/60 bg-card/40 hover:border-primary/30 hover:bg-card/50'}`}
                        >
                            <input {...modelImageDropzone.getInputProps()} />

                            {modelImage ? (
                                <div className="relative">
                                    <div className="relative w-full max-w-xs mx-auto h-48">
                                        <Image
                                            src={modelImage.preview}
                                            alt="Model"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage('model');
                                        }}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {!modelImage.isValid && (
                                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/40 rounded text-xs text-destructive">
                                            {modelImage.errors.join(', ')}
                                        </div>
                                    )}
                                    {modelImage.isValid && (
                                        <div className="mt-2 flex items-center justify-center text-primary">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            <span className="text-xs">Geçerli resim</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="w-12 h-12 mx-auto text-muted-foreground/70" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Model resminizi buraya sürükleyin, veya{' '}
                                            <span className="text-primary font-semibold hover:underline">göz atın</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            Desteklenen formatlar: JPEG, PNG, WebP (max 10MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.modelImage && (
                            <p className="text-sm text-destructive">{errors.modelImage.message}</p>
                        )}
                    </div>

                    {/* Product Image Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-muted-foreground">
                            Ürün Resmi <span className="text-destructive">*</span>
                        </label>
                        <div
                            {...productImageDropzone.getRootProps()}
                            className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center shadow-lg shadow-black/10 backdrop-blur transition-all cursor-pointer ${productImageDropzone.isDragActive ? 'border-primary/50 bg-primary/10' : 'border-border/60 bg-card/40 hover:border-primary/30 hover:bg-card/50'}`}
                        >
                            <input {...productImageDropzone.getInputProps()} />

                            {productImage ? (
                                <div className="relative">
                                    <div className="relative w-full max-w-xs mx-auto h-48">
                                        <Image
                                            src={productImage.preview}
                                            alt="Product"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage('product');
                                        }}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {!productImage.isValid && (
                                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/40 rounded text-xs text-destructive">
                                            {productImage.errors.join(', ')}
                                        </div>
                                    )}
                                    {productImage.isValid && (
                                        <div className="mt-2 flex items-center justify-center text-primary">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            <span className="text-xs">Geçerli resim</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="w-12 h-12 mx-auto text-muted-foreground/70" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Ürün resminizi buraya sürükleyin, veya{' '}
                                            <span className="text-primary font-semibold hover:underline">göz atın</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            Desteklenen formatlar: JPEG, PNG, WebP (max 10MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.productImage && (
                            <p className="text-sm text-destructive">{errors.productImage.message}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        type="submit"
                        disabled={!isValid || isGenerating || !modelImage?.isValid || !productImage?.isValid}
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-black/10 transition-all hover:bg-primary/90 disabled:bg-primary/40 disabled:text-primary-foreground/70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Oluşturuluyor...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Görsel Oluştur
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={isGenerating}
                        className="inline-flex items-center justify-center rounded-xl border border-border/50 bg-card/60 px-8 py-3 font-semibold text-foreground shadow-lg shadow-black/5 transition-all hover:bg-card/80 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Sıfırla
                    </button>
                </div>
            </form>

            {/* Generation Result */}
            <AnimatePresence>
                {generationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8"
                    >
                        {generationResult.success ? (
                            <div className="rounded-3xl border border-primary/40 bg-primary/10 p-8 shadow-xl shadow-black/20 backdrop-blur">
                                <div className="flex items-center mb-6">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary">Görsel Başarıyla Oluşturuldu!</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-lg shadow-black/10 backdrop-blur">
                                        <img
                                            src={generationResult.data?.generatedImage || ''}
                                            alt="Generated product"
                                            className="w-full h-auto max-h-[500px] rounded-2xl object-contain mx-auto shadow-lg shadow-black/20"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a
                                            href={generationResult.data?.downloadUrl}
                                            download
                                            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-black/10 transition-all duration-200 hover:bg-primary/90"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Görseli İndir
                                        </a>

                                        <button
                                            onClick={() => setGenerationResult(null)}
                                            className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-card/60 px-6 py-3 font-semibold text-foreground shadow-lg shadow-black/5 transition-all duration-200 hover:bg-card/80"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Yeni Görsel Oluştur
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-destructive/40 bg-destructive/10 p-8 shadow-xl shadow-black/20 backdrop-blur">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center mr-3">
                                        <AlertCircle className="w-5 h-5 text-destructive" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-destructive">Oluşturma Başarısız</h3>
                                </div>
                                <p className="text-destructive mb-6 leading-relaxed">{generationResult.error?.message}</p>
                                <button
                                    onClick={() => setGenerationResult(null)}
                                    className="inline-flex items-center justify-center rounded-xl bg-destructive px-6 py-3 font-semibold text-destructive-foreground shadow-lg shadow-black/10 transition-all duration-200 hover:bg-destructive/90"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Tekrar Dene
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
