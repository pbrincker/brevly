import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'redirecting'>('loading');

  console.log('Redirect component rendered with shortUrl:', shortUrl);

  useEffect(() => {
    let redirected = false;
    
    const handleRedirect = async () => {
      console.log('handleRedirect called with shortUrl:', shortUrl);
      
      if (!shortUrl) {
        console.log('No shortUrl provided');
        // Redireciona para a página 404 quando não há shortUrl
        navigate('/404', { replace: true });
        return;
      }

      if (redirected) {
        console.log('Already redirected, skipping');
        return;
      }

      try {
        console.log('Redirecting to backend URL that increments counter:', shortUrl);
        setStatus('redirecting');
        
        // Redireciona diretamente para a rota do backend que incrementa o contador
        // A rota /:shortUrl no backend vai incrementar o accessCount e redirecionar automaticamente
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';
        const redirectUrl = `${backendUrl}/${shortUrl}`;
        
        console.log('Redirecting to:', redirectUrl);
        redirected = true;
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao redirecionar:', error);
        // Redireciona para a página 404 quando o link não é encontrado
        navigate('/404', { replace: true });
      }
    };

    handleRedirect();
  }, [shortUrl, navigate]);

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
              O link será aberto automaticamente em alguns instantes.
            </p>
            <p className="text-gray-600 mb-4">
              Não foi redirecionado?  <a href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333'}/${shortUrl}`} className="text-blue-600 hover:text-blue-800 underline">Acesse aqui</a>
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
}
