import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useApi } from '../services/api';

export function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const api = useApi();

  console.log('Redirect component rendered with shortUrl:', shortUrl);

  useEffect(() => {
    let redirected = false;
    
    const handleRedirect = async () => {
      console.log('handleRedirect called with shortUrl:', shortUrl);
      
      if (!shortUrl) {
        console.log('No shortUrl provided');
        setError('URL encurtada não fornecida');
        setStatus('error');
        return;
      }

      if (redirected) {
        console.log('Already redirected, skipping');
        return;
      }

      try {
        console.log('Making API request for shortUrl:', shortUrl);
        setStatus('redirecting');
        
        const response = await api.getLinkByShortUrl(shortUrl);
        console.log('API response:', response);
        
        if (response.success && response.data?.originalUrl) {
          const originalUrl = response.data.originalUrl;
          console.log('Redirecting to:', originalUrl);
          redirected = true;
          setTimeout(() => {
            window.location.href = originalUrl;
          }, 1000);
        } else {
          throw new Error('Link não encontrado');
        }
      } catch (error) {
        console.error('Erro ao redirecionar:', error);
        setError('Link não encontrado ou expirado');
        setStatus('error');
      }
    };

    handleRedirect();
  }, [shortUrl]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo width={120} height={30} />
        </div>
        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Procurando link...
            </h1>
            <p className="text-gray-600">Carregando...</p>
          </>
        )}
        
        {status === 'redirecting' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Redirecionando...
            </h1>
            <p className="text-gray-600 mb-4">
              Você será redirecionado em instantes!
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erro
            </h1>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Voltar para Home
            </button>
          </>
        )}
        
      </div>
    </div>
  );
}
