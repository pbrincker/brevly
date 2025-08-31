import { 
  ApiResponse, 
  Link, 
  LinksList, 
  CreateLinkData, 
  CsvReport,
  PaginationParams 
} from '../types/index';

/**
 * Configuração da API
 */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';

/**
 * Classe para gerenciar as chamadas da API
 */
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Faz uma requisição HTTP genérica
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Verifica se a resposta é JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { error: `Erro ${response.status}: ${response.statusText}` };
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  /**
   * Cria um novo link
   */
  async createLink(linkData: CreateLinkData): Promise<ApiResponse<Link>> {
    return this.request<Link>('/api/links', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  /**
   * Lista todos os links com paginação
   */
  async getLinks(params: PaginationParams = { page: 1, limit: 10 }): Promise<ApiResponse<LinksList>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    return this.request<LinksList>(`/api/links?${queryParams}`);
  }

  /**
   * Obtém um link específico por ID
   */
  async getLink(id: string): Promise<ApiResponse<Link>> {
    return this.request<Link>(`/api/links/${id}`);
  }

  /**
   * Obtém um link específico por shortUrl
   */
  async getLinkByShortUrl(shortUrl: string): Promise<ApiResponse<Link>> {
    return this.request<Link>(`/api/links/short/${shortUrl}`);
  }

  /**
   * Deleta um link por ID
   */
  async deleteLink(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/links/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Gera um relatório CSV
   */
  async generateCsvReport(): Promise<ApiResponse<CsvReport>> {
    return this.request<CsvReport>('/api/reports/csv', {
      method: 'POST',
    });
  }

  /**
   * Verifica o status da API
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; database: string; uptime: number }>> {
    return this.request<{ status: string; database: string; uptime: number }>('/health');
  }
}

/**
 * Instância global do serviço de API
 */
export const apiService = new ApiService(API_BASE_URL);

/**
 * Hook personalizado para usar o serviço de API
 */
export const useApi = () => {
  return {
    createLink: apiService.createLink.bind(apiService),
    getLinks: apiService.getLinks.bind(apiService),
    getLink: apiService.getLink.bind(apiService),
    getLinkByShortUrl: apiService.getLinkByShortUrl.bind(apiService),
    deleteLink: apiService.deleteLink.bind(apiService),
    generateCsvReport: apiService.generateCsvReport.bind(apiService),
    healthCheck: apiService.healthCheck.bind(apiService),
  };
};
