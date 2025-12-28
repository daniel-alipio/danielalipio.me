import axios from 'axios';
import ENDPOINTS from '../config/endpoints';
import { apiLogger } from '../utils/apiLogger';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
      apiLogger.logRequest(config.method, config.url);

      if (import.meta.env.DEV) {
        console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, {
          params: config.params,
          hasData: !!config.data
        });
      }

      return config;
    },
    (error) => {
      console.error('[API] Erro na configuração da requisição:', error.message);
      return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
      const message = response.data?.data?.length
        ? `${response.data.data.length} items found`
        : response.data?.message || 'Success';

      apiLogger.logResponse(response.status, message, response.config.url);

      if (import.meta.env.DEV) {
        console.log(`[API] ✅ ${response.status} ${response.config.url}`);
      }

      return response.data;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        const errorMessages = {
          400: 'Requisição inválida',
          401: 'Não autorizado - Faça login novamente',
          402: 'Pagamento necessário',
          403: 'Acesso proibido - Você não tem permissão',
          404: 'Recurso não encontrado',
          405: 'Método não permitido',
          406: 'Formato não aceito',
          407: 'Autenticação de proxy necessária',
          408: 'Tempo de requisição esgotado',
          409: 'Conflito - O recurso já existe',
          410: 'Recurso não disponível',
          411: 'Tamanho do conteúdo necessário',
          412: 'Pré-condição falhou',
          413: 'Conteúdo muito grande',
          414: 'URL muito longa',
          415: 'Tipo de mídia não suportado',
          416: 'Intervalo não satisfatório',
          417: 'Expectativa falhou',
          418: 'Sou um bule de chá',
          421: 'Requisição mal direcionada',
          422: 'Entidade não processável - Dados inválidos',
          423: 'Recurso bloqueado',
          424: 'Dependência falhou',
          425: 'Muito cedo',
          426: 'Atualização necessária',
          428: 'Pré-condição necessária',
          429: 'Muitas requisições. Tente novamente em alguns minutos.',
          431: 'Cabeçalhos muito grandes',
          451: 'Indisponível por razões legais',
          500: 'Erro interno do servidor',
          501: 'Não implementado',
          502: 'Servidor temporariamente indisponível',
          503: 'Serviço temporariamente indisponível',
          504: 'Tempo de resposta do servidor esgotado',
          505: 'Versão HTTP não suportada',
          506: 'Variante também negocia',
          507: 'Armazenamento insuficiente',
          508: 'Loop detectado',
          510: 'Não estendido',
          511: 'Autenticação de rede necessária',
        };

        const errorMsg = data?.message || errorMessages[status] || 'Erro desconhecido';
        apiLogger.logError(status, errorMsg);

        console.error(`[API] ❌ ${status} - ${errorMsg}`);

        return Promise.reject({
          status,
          message: errorMsg,
          data,
        });
      }

      if (error.request) {
        apiLogger.logError(0, 'Servidor não está respondendo');
        console.error('[API] 🔌 Servidor não está respondendo');
        return Promise.reject({
          status: 0,
          message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        });
      }

      apiLogger.logError(-1, error.message);
      console.error('[API] ⚙️ Erro de configuração:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message,
      });
    }
);

const apiService = {
  getProjects: async () => {
    try {
      return await api.get(ENDPOINTS.PROJECTS);
    } catch (error) {
      console.error('[API Service] Erro ao buscar projetos:', error);
      throw error;
    }
  },

  getStacks: async () => {
    try {
      return await api.get(ENDPOINTS.STACKS);
    } catch (error) {
      console.error('[API Service] Erro ao buscar stacks:', error);
      throw error;
    }
  },

  sendContact: async (contactData) => {
    try {
      return await api.post(ENDPOINTS.CONTACT, contactData);
    } catch (error) {
      console.error('[API Service] Erro ao enviar contato:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      return await api.get(ENDPOINTS.HEALTH);
    } catch (error) {
      console.error('[API Service] Erro no health check:', error);
      throw error;
    }
  },

  getSpotifyNowPlaying: async () => {
    try {
      return await api.get(ENDPOINTS.SPOTIFY_NOW_PLAYING);
    } catch (error) {
      console.error('[API Service] Erro ao buscar status do Spotify:', error);
      throw error;
    }
  },
};

export { ENDPOINTS };
export { apiService };
export default api;
