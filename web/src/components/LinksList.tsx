import React from 'react';
import { Link, Copy, Trash2, ExternalLink, Download, Eye } from 'lucide-react';
import { Link as LinkType } from '../types/index';
import { formatDate, formatNumber, getFullShortUrl, copyToClipboard, truncateText } from '../utils/index';

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
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner h-8 w-8"></div>
          <span className="ml-3 text-gray-600">Carregando links...</span>
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Link className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum link encontrado
          </h3>
          <p className="text-gray-600">
            Crie seu primeiro link encurtado para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Seus Links
          </h2>
          <p className="text-gray-600">
            {formatNumber(links.length)} link{links.length !== 1 ? 's' : ''} criado{links.length !== 1 ? 's' : ''}
          </p>
        </div>
        {onDownloadCsv && (
          <button
            onClick={onDownloadCsv}
            className="btn-secondary"
            title="Baixar relatório CSV"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </button>
        )}
      </div>

      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-sm text-gray-500 mb-1">URL Original</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-900 break-all">
                      {truncateText(link.originalUrl, 60)}
                    </p>
                    <button
                      onClick={() => handleOpenLink(link.originalUrl)}
                      className="ml-2 text-primary-600 hover:text-primary-700"
                      title="Abrir URL original"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">URL Encurtada</p>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-primary-600 break-all">
                      {getFullShortUrl(link.shortUrl)}
                    </p>
                    <button
                      onClick={() => handleCopyLink(link.shortUrl)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      title="Copiar link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenLink(getFullShortUrl(link.shortUrl))}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      title="Abrir link em nova aba"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Eye className="mr-1 h-3 w-3" />
                    {formatNumber(link.accessCount)} acesso{link.accessCount !== 1 ? 's' : ''}
                  </div>
                  <div>
                    Criado em {formatDate(link.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {onDelete && (
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Deletar link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
