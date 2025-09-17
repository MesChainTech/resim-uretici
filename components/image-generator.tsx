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
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">AI Ürün Görsel Üretici</h1>
                <p className="text-lg text-gray-600">
                    Çarpıcı ürün fotoğrafçılığı oluşturmak için model resmi ve ürün resmi yükleyin
                </p>
            </div>            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Category Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">
                        Kategori <span className="text-red-500">*</span>
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
                                        className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === category.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-sm font-medium text-gray-900">{category.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                                    </div>
                                </label>
                            </motion.div>
                        ))}
                    </div>
                    {errors.category && (
                        <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                </div>

                {/* Image Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Model Image Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700">
                            Model Resmi <span className="text-red-500">*</span>
                        </label>
                        <div
                            {...modelImageDropzone.getRootProps()}
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${modelImageDropzone.isDragActive
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
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
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {!modelImage.isValid && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                                            {modelImage.errors.join(', ')}
                                        </div>
                                    )}
                                    {modelImage.isValid && (
                                        <div className="mt-2 flex items-center justify-center text-green-600">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            <span className="text-xs">Geçerli resim</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Model resminizi buraya sürükleyin, veya{' '}
                                            <span className="text-blue-500 font-medium">göz atın</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Desteklenen formatlar: JPEG, PNG, WebP (max 10MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.modelImage && (
                            <p className="text-sm text-red-500">{errors.modelImage.message}</p>
                        )}
                    </div>

                    {/* Product Image Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700">
                            Ürün Resmi <span className="text-red-500">*</span>
                        </label>
                        <div
                            {...productImageDropzone.getRootProps()}
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${productImageDropzone.isDragActive
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
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
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {!productImage.isValid && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                                            {productImage.errors.join(', ')}
                                        </div>
                                    )}
                                    {productImage.isValid && (
                                        <div className="mt-2 flex items-center justify-center text-green-600">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            <span className="text-xs">Geçerli resim</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Ürün resminizi buraya sürükleyin, veya{' '}
                                            <span className="text-blue-500 font-medium">göz atın</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Desteklenen formatlar: JPEG, PNG, WebP (max 10MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.productImage && (
                            <p className="text-sm text-red-500">{errors.productImage.message}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        type="submit"
                        disabled={!isValid || isGenerating || !modelImage?.isValid || !productImage?.isValid}
                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                        className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
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
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 shadow-sm">
                                <div className="flex items-center mb-6">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900">Görsel Başarıyla Oluşturuldu!</h3>
                                </div>

                                <div className="space-y-6 w-fit">
                                    <div className="rounded-lg p-4 border border-gray-100">
                                        <img
                                            src={generationResult.data?.generatedImage || ''}
                                            alt="Generated product"
                                            className="w-full h-auto rounded-lg max-h-[500px] object-contain mx-auto shadow-md padding-5"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a
                                            href={generationResult.data?.downloadUrl}
                                            download
                                            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Görseli İndir
                                        </a>

                                        <button
                                            onClick={() => setGenerationResult(null)}
                                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
                            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-8 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-red-900">Oluşturma Başarısız</h3>
                                </div>
                                <p className="text-red-700 mb-6 leading-relaxed">{generationResult.error?.message}</p>
                                <button
                                    onClick={() => setGenerationResult(null)}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
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