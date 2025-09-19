import React from 'react';
import { useForm } from 'react-hook-form';
import { Copy, CircleNotch, ArrowSquareOut } from 'phosphor-react';
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
  } = useForm<FormData>({
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  });

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
    <div className="animate-fade-in">
      {/* Título da seção */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Novo link
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Campo URL Original */}
        <div>
          <label htmlFor="originalUrl" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            LINK ORIGINAL
          </label>
          <input
            {...register('originalUrl')}
            type="url"
            id="originalUrl"
            placeholder="www.exemplo.com.br"
            className="input"
            disabled={isSubmitting || isLoading}
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
          )}
        </div>

        {/* Campo URL Encurtada */}
        <div>
          <label htmlFor="shortUrl" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            LINK ENCURTADO
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none z-10">
              brev.ly/
            </div>
            <input
              {...register('shortUrl')}
              type="text"
              id="shortUrl"
              placeholder=""
              className="input pl-[calc(1rem+4rem)] relative z-0"
              disabled={isSubmitting || isLoading}
            />
          </div>
          {errors.shortUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.shortUrl.message}</p>
          )}
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? (
            <>
              <CircleNotch className="mr-2 h-4 w-4 animate-spin inline" />
              Salvando...
            </>
          ) : (
            'Salvar link'
          )}
        </button>
      </form>

      {/* Mensagem de sucesso */}
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
                <ArrowSquareOut className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
