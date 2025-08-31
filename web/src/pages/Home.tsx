import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateLinkForm } from '../components/CreateLinkForm';
import { LinksList } from '../components/LinksList';
import { Logo } from '../components/Logo';
import { useApi } from '../services/api';
import { CreateLinkFormData, Link } from '../types/index';

export function Home() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [createdLink, setCreatedLink] = useState<CreateLinkFormData | undefined>(undefined);
  const api = useApi();

  const {
    data: linksData,
    isLoading: isLoadingLinks,
    error: linksError,
  } = useQuery({
    queryKey: ['links', currentPage],
    queryFn: () => api.getLinks({ page: currentPage, limit: 10 }),
  });

  const createLinkMutation = useMutation({
    mutationFn: api.createLink,
    onSuccess: (response) => {
      if (response.data) {
        setCreatedLink({
          originalUrl: response.data.originalUrl,
          shortUrl: response.data.shortUrl,
        });
        queryClient.invalidateQueries({ queryKey: ['links'] });
      }
    },
    onError: (error: any) => {
      console.error('Erro ao criar link:', error);
      const errorMessage = error?.message || 'Erro ao criar link. Tente novamente.';
      alert(errorMessage);
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: api.deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      console.error('Erro ao deletar link:', error);
      alert('Erro ao deletar link. Tente novamente.');
    },
  });

  const generateCsvMutation = useMutation({
    mutationFn: api.generateCsvReport,
    onSuccess: (response) => {
      if (response.data) {
        window.open(response.data.publicUrl, '_blank');
      }
    },
    onError: (error) => {
      console.error('Erro ao gerar relatório CSV:', error);
      alert('Erro ao gerar relatório CSV. Tente novamente.');
    },
  });

  const handleCreateLink = async (data: { originalUrl: string; shortUrl?: string }) => {
    await createLinkMutation.mutateAsync(data);
  };

  const handleDeleteLink = async (id: string) => {
    await deleteLinkMutation.mutateAsync(id);
  };

  const handleDownloadCsv = async () => {
    await generateCsvMutation.mutateAsync();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo width={120} height={30} />
          </div>
          <p className="text-xl text-gray-600">
            Encurte suas URLs de forma rápida e segura
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <CreateLinkForm
            onSubmit={handleCreateLink}
            isLoading={createLinkMutation.isPending}
            createdLink={createdLink}
          />

          <LinksList
            links={linksData?.data?.links || []}
            isLoading={isLoadingLinks}
            onDelete={handleDeleteLink}
            onDownloadCsv={handleDownloadCsv}
            currentPage={currentPage}
            totalPages={linksData?.data?.totalPages || 1}
            onPageChange={handlePageChange}
          />

          {linksError && (
            <div className="card bg-red-50 border-red-200">
              <div className="text-center py-4">
                <p className="text-red-600">
                  Erro ao carregar links. Tente recarregar a página.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
