import React from 'react';
import { Copy, Trash, ArrowSquareOut, DownloadSimple } from 'phosphor-react';
import { Link as LinkType } from '../types/index';
import { formatNumber, getFullShortUrl, copyToClipboard } from '../utils/index';

interface LinksListProps {
  links: LinkType[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onDownloadCsv?: () => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function LinksList({ 
  links, 
  isLoading, 
  onDelete, 
  onDownloadCsv,
  currentPage,
  totalPages,
  onPageChange 
}: LinksListProps) {
  const handleCopyLink = async (shortUrl: string) => {
    const fullUrl = getFullShortUrl(shortUrl);
    await copyToClipboard(fullUrl);
  };

  const handleDeleteLink = async (id: string) => {
    if (onDelete && confirm('Tem certeza que deseja deletar este link?')) {
      await onDelete(id);
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner h-8 w-8"></div>
        <span className="ml-3 text-gray-600">Carregando links...</span>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="animate-fade-in">
        {/* Header com título e botão CSV */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Meus links
          </h2>
          {onDownloadCsv && (
            <button
              onClick={onDownloadCsv}
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              title="Baixar relatório CSV"
            >
              <DownloadSimple className="mr-1 h-4 w-4" />
              Baixar CSV
            </button>
          )}
        </div>

        {/* Estado vazio */}
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            AINDA NÃO EXISTEM LINKS CADASTRADOS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header com título e botão CSV */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Meus links
        </h2>
        {onDownloadCsv && (
          <button
            onClick={onDownloadCsv}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            title="Baixar relatório CSV"
          >
            <DownloadSimple className="mr-1 h-4 w-4" />
            Baixar CSV
          </button>
        )}
      </div>

      {/* Lista de links */}
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Informações do link */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <a href={getFullShortUrl(link.shortUrl)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 mr-2">
                  {getFullShortUrl(link.shortUrl)}
                </a>
                <button
                  onClick={() => handleCopyLink(link.shortUrl)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Copiar link"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate flex-1 mr-4">
                  {link.originalUrl}
                </p>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {formatNumber(link.accessCount)} acessos
                </p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleOpenLink(getFullShortUrl(link.shortUrl))}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Abrir link"
              >
                <ArrowSquareOut className="h-4 w-4" />
              </button>
              {onDelete && (
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Deletar link"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
