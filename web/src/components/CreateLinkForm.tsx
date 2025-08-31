import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Copy, Loader2, ExternalLink } from 'lucide-react';
import { CreateLinkFormData } from '../types/index';
import { getFullShortUrl, copyToClipboard } from '../utils/index';

type FormData = {
  originalUrl: string;
  shortUrl: string;
};

interface CreateLinkFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  createdLink?: CreateLinkFormData;
}

export function CreateLinkForm({ onSubmit, isLoading, createdLink }: CreateLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  });

  const watchedShortUrl = watch('shortUrl');

  const handleFormSubmit = async (data: { originalUrl: string; shortUrl: string }) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Erro ao criar link:', error);
    }
  };

  const handleCopyLink = async () => {
    if (createdLink) {
      const fullUrl = getFullShortUrl(createdLink.shortUrl);
      await copyToClipboard(fullUrl);
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Criar Link Encurtado
        </h2>
        <p className="text-gray-600">
          Encurte suas URLs de forma rápida e segura
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL Original *
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              {...register('originalUrl')}
              type="url"
              id="originalUrl"
              placeholder="https://exemplo.com/url-muito-longa"
              className="input pl-10"
              disabled={isSubmitting || isLoading}
            />
          </div>
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="shortUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL Encurtada (Opcional)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none z-10">
              {window.location.origin}/
            </div>
            <input
              {...register('shortUrl')}
              type="text"
              id="shortUrl"
              placeholder="minha-url"
              className="input pl-[calc(1rem+6rem)] relative z-0"
              disabled={isSubmitting || isLoading}
            />
          </div>
          {errors.shortUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.shortUrl.message}</p>
          )}
          {watchedShortUrl && (
            <p className="mt-1 text-sm text-gray-500">
              URL completa: {getFullShortUrl(watchedShortUrl)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="btn-primary w-full"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            <>
              <Link className="mr-2 h-4 w-4" />
              Criar Link
            </>
          )}
        </button>
      </form>

      {createdLink && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800 mb-1">
                Link criado com sucesso!
              </h3>
              <p className="text-sm text-green-700 break-all">
                {getFullShortUrl(createdLink.shortUrl)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="btn-secondary"
                title="Copiar link"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={getFullShortUrl(createdLink.shortUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                title="Abrir link em nova aba"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
