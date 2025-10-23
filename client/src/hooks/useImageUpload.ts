import { useState } from 'react';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface UseImageUploadOptions {
  maxSize?: number; // em MB
  acceptedFormats?: string[];
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    maxSize = 5,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    onSuccess,
    onError
  } = options;

  const validateFile = (file: File): string | null => {
    // Verificar formato
    if (!acceptedFormats.includes(file.type)) {
      return `Formato não suportado. Use: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxSize}MB`;
    }

    return null;
  };

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (file: File, contentType: 'ofertas' | 'categorias', contentId: string): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validar arquivo
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        return { success: false, error: validationError };
      }

      // Processar imagem
      const imageDataUrl = await processImage(file);
      
      // Simular upload para servidor
      // Em produção, aqui seria a chamada para a API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar URL específica para o conteúdo
      const imageUrl = `/uploads/${contentType}/${contentId}/${file.name}`;
      
      onSuccess?.(imageUrl);
      return { success: true, url: imageUrl };
      
    } catch (err) {
      const errorMessage = 'Erro ao processar imagem';
      setError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (
    files: File[], 
    contentType: 'ofertas' | 'categorias', 
    contentId: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadImage(file, contentType, contentId);
      results.push(result);
    }
    
    return results;
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    error,
    clearError: () => setError(null)
  };
}

