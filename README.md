# 🚀 danielalipio.me - Portfolio Full Stack

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green.svg)](https://www.mongodb.com/)

Portfólio profissional desenvolvido como monorepo, demonstrando arquitetura escalável full stack com práticas modernas de desenvolvimento. Sistema completo com API RESTful, interface responsiva e infraestrutura de produção.

**🌐 Live:** [danielalipio.me](https://danielalipio.me)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Backend (da-api)](#-backend-da-api)
- [Frontend (da-ui)](#-frontend-da-ui)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [Features](#-features)
- [Integrações em Tempo Real](#-integrações-em-tempo-real)
- [Segurança](#-segurança)
- [Performance](#-performance)
- [Licença](#-licença)

---

## 🎯 Visão Geral

Este projeto é um portfólio profissional desenvolvido como monorepo, contendo:

- **da-api**: API RESTful robusta em Node.js com Express
- **da-ui**: Interface moderna em React com Tailwind CSS

O sistema demonstra capacidades avançadas de desenvolvimento full stack, incluindo:
- Arquitetura escalável com microserviços
- Sistema de autenticação e autorização
- Cache distribuído com Redis
- Rate limiting e proteção contra ataques
- Logging estruturado com Winston
- Validação avançada de dados
- Sistema de e-mails transacionais
- Interface responsiva com animações

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Frontend      │
│   (React)       │◄────┐
└────────┬────────┘     │
         │              │
    API Calls       WebSocket
         │              │
         ▼              │
┌─────────────────┐     │
│   API Gateway   │     │
│   (Express)     │─────┘
└────────┬────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    │         │         │          │
    ▼         ▼         ▼          ▼
┌────────┐ ┌──────┐ ┌───────┐ ┌────────┐
│MongoDB │ │Redis │ │MySQL  │ │SendGrid│
│(NoSQL) │ │(Cache)│ │(Sessions)│ │(Email)│
└────────┘ └──────┘ └───────┘ └────────┘
```

### Camadas da Aplicação

**Backend:**
1. **Core Layer**: Gerenciamento de servidor, conexões e inicialização
2. **Middleware Layer**: Autenticação, validação, compressão, rate limiting
3. **Route Layer**: Carregamento dinâmico de rotas RESTful
4. **Data Layer**: Schemas Mongoose, conexões de banco de dados
5. **Utils Layer**: Logging, emails, criptografia, utilitários

**Frontend:**
1. **Presentation Layer**: Componentes React reutilizáveis
2. **Business Logic Layer**: Services, hooks customizados
3. **Routing Layer**: React Router com lazy loading
4. **State Management**: React Hooks (useState, useEffect, useCallback)

---

## 🛠️ Tecnologias

### Backend (da-api)

#### Core
- **Node.js** (v18+) - Runtime JavaScript
- **Express** (v5.1.0) - Framework web minimalista
- **Mongoose** (v8.19.2) - ODM para MongoDB

#### Bancos de Dados
- **MongoDB** (v6.20.0) - Banco NoSQL para dados principais
- **Redis** (v5.10.0) - Cache distribuído e pub/sub
- **MySQL** (v2.18.1) - Armazenamento de sessões

#### Autenticação & Segurança
- **Passport** (v0.7.0) - Estratégias de autenticação
- **jsonwebtoken** (v9.0.2) - Geração de tokens JWT
- **bcrypt** (v6.0.0) - Hash de senhas
- **helmet** (v8.1.0) - Headers de segurança HTTP

#### Validação & Email
- **Joi** (v17.13.3) - Validação de schemas
- **Nodemailer** (v7.0.10) - Envio de emails
- **@sendgrid/mail** (v8.1.6) - Integração SendGrid
- **disposable-email-domains** (v1.0.62) - Bloqueio de emails temporários

#### Performance & Logging
- **compression** (v1.8.1) - Compressão gzip/deflate
- **express-rate-limit** (v8.2.1) - Rate limiting
- **winston** (v3.19.0) - Logging estruturado
- **winston-daily-rotate-file** (v5.0.0) - Rotação de logs

### Frontend (da-ui)

#### Core
- **React** (v19.2.0) - Biblioteca UI
- **Vite** (v7.2.4) - Build tool e dev server
- **React Router DOM** (v7.9.6) - Roteamento SPA

#### UI & Styling
- **Tailwind CSS** (v4.1.17) - Framework CSS utilitário
- **Framer Motion** (v12.23.24) - Animações e transições
- **Lucide React** (v0.554.0) - Ícones modernos
- **React Icons** (v5.5.0) - Biblioteca de ícones

#### Comunicação & Segurança
- **Axios** (v1.13.2) - Cliente HTTP
- **DOMPurify** (v3.3.1) - Sanitização XSS

#### Dev Tools
- **ESLint** (v9.39.1) - Linter JavaScript
- **babel-plugin-react-compiler** (v1.0.0) - Otimizações React

---

## 📁 Estrutura do Projeto

```
d.me/
├── da-api/                    # Backend - API RESTful
│   ├── index.js              # Entry point da aplicação
│   ├── package.json          # Dependências e scripts
│   ├── logs/                 # Logs rotativos (Winston)
│   ├── scripts/              # Scripts utilitários
│   │   ├── crypto-gen.js     # Gerador de chaves de criptografia
│   │   ├── seed-portfolio.js # Seed de dados de projetos
│   │   └── test-smtp.js      # Teste de configuração SMTP
│   └── src/
│       ├── config/
│       │   └── config.js     # Configurações centralizadas
│       ├── core/
│       │   ├── passport.js   # Configuração Passport.js
│       │   ├── redis.js      # Cliente Redis e pub/sub
│       │   └── server.js     # Configuração Express e middlewares
│       ├── data/
│       │   ├── database.js   # Conexões MongoDB e MySQL
│       │   └── schema/
│       │       ├── ContactSchema.js    # Schema de contatos
│       │       ├── ProjectsSchema.js   # Schema de projetos
│       │       └── StackSchema.js      # Schema de tecnologias
│       ├── middlewares/
│       │   ├── auth.js            # Middleware de autenticação
│       │   ├── compression.js     # Middleware de compressão
│       │   ├── errorHandler.js    # Tratamento global de erros
│       │   ├── requestLogger.js   # Log de requisições
│       │   └── validate.js        # Middleware de validação Joi
│       ├── routes/
│       │   └── v1/
│       │       ├── contact.js     # Rota de contato
│       │       ├── projects.js    # Rota de projetos
│       │       └── stacks.js      # Rota de tecnologias
│       ├── utils/
│       │   ├── common.js          # Utilitários comuns
│       │   ├── encryption.js      # Funções de criptografia
│       │   ├── logger.js          # Logger Winston customizado
│       │   └── mailer.js          # Serviço de envio de emails
│       └── validators/
│           └── contactValidator.js # Validação de formulário de contato
│
├── da-ui/                     # Frontend - React SPA
│   ├── index.html            # HTML template
│   ├── package.json          # Dependências e scripts
│   ├── vite.config.js        # Configuração Vite
│   ├── tailwind.config.cjs   # Configuração Tailwind
│   ├── postcss.config.cjs    # Configuração PostCSS
│   ├── eslint.config.js      # Configuração ESLint
│   ├── public/               # Assets estáticos
│   │   ├── sitemap.xml       # Sitemap para SEO
│   │   ├── robots.txt        # Robots.txt
│   │   ├── og-image.jpg      # Open Graph image
│   │   └── projects/         # Imagens de projetos
│   └── src/
│       ├── App.jsx           # Componente raiz
│       ├── main.jsx          # Entry point React
│       ├── index.css         # Estilos globais
│       ├── components/
│       │   ├── forms/
│       │   │   └── ContactForm.jsx      # Formulário de contato
│       │   ├── icons/
│       │   │   └── BrandIcons.jsx       # Ícones de marcas
│       │   ├── landing/
│       │   │   ├── AboutSection.jsx     # Seção sobre
│       │   │   ├── ContactSection.jsx   # Seção de contato
│       │   │   ├── HeroSection.jsx      # Seção hero
│       │   │   ├── ProjectsSection.jsx  # Seção de projetos
│       │   │   └── StacksSection.jsx    # Seção de tecnologias
│       │   ├── layout/
│       │   │   ├── Footer.jsx           # Rodapé
│       │   │   ├── Header.jsx           # Cabeçalho
│       │   │   └── SEO.jsx              # Componente SEO
│       │   └── ui/
│       │       ├── ActivityDisplay.jsx      # Display unificado de atividades
│       │       ├── GitHubContributions.jsx  # Visualização de contribuições GitHub
│       │       ├── OptimizedImage.jsx       # Componente de imagem otimizada
│       │       ├── SpotifyBadge.jsx         # Badge do Spotify
│       │       ├── SpotifyDisplay.jsx       # Display de música Spotify
│       │       ├── SpotifyNowPlaying.jsx    # Now Playing Spotify
│       │       └── SteamDisplay.jsx         # Display de jogo Steam
│       ├── config/
│       │   └── endpoints.js             # Endpoints da API
│       ├── hooks/
│       │   ├── useActivity.js           # Hook de atividades GitHub
│       │   ├── useDebounce.js           # Hook de debounce
│       │   ├── useSpotify.js            # Hook de integração Spotify
│       │   └── useSteam.js              # Hook de integração Steam
│       ├── pages/
│       │   ├── LandingPage.jsx          # Página principal
│       │   └── NotFoundPage.jsx         # Página 404
│       ├── routes/
│       │   └── AppRoutes.jsx            # Configuração de rotas
│       ├── services/
│       │   └── api.js                   # Cliente Axios configurado
│       └── utils/
│           ├── apiLogger.js             # Logger de requisições API
│           ├── navigation.js            # Utilitários de navegação
│           └── projectEnricher.js       # Enriquecimento de dados
│
└── .gitignore                # Arquivos ignorados pelo Git
```

---

## 🔧 Backend (da-api)

### Arquitetura

O backend segue uma arquitetura modular e escalável:

#### 1. **Core Layer** (`src/core/`)

**server.js**: Núcleo da aplicação Express
- Configuração de CORS dinâmico (produção/desenvolvimento)
- Múltiplos rate limiters (global, auth, admin, API)
- Sistema de sessões com MySQL Store
- Helmet para headers de segurança
- Carregamento dinâmico de rotas
- Health check endpoint (`/api/health`)
- Graceful shutdown handlers

**redis.js**: Cliente Redis
- Conexão com retry strategy
- Funções de cache (get, set, invalidate)
- Sistema de pub/sub para eventos
- Sanitização de dados sensíveis em logs
- Timeout e fallback automático

**passport.js**: Estratégias de autenticação
- Serialização/deserialização de usuários
- Preparado para OAuth (Google, GitHub, etc.)

#### 2. **Data Layer** (`src/data/`)

**database.js**: Gerenciamento de conexões
- Pool de conexões MySQL (sessões)
- Conexão Mongoose para MongoDB
- Tratamento de erros de conexão
- Eventos de reconexão

**Schemas:**

**ContactSchema.js**:
```javascript
{
  name: String (required, max 100)
  email: String (required, lowercase)
  phone: String (optional, max 20)
  subject: String (required, max 2000)
  ipAddress: String (required)
  status: Enum ['new', 'read', 'replied', 'archived']
  emailSent: Boolean
  confirmationSent: Boolean
  createdAt: Date (indexed)
  updatedAt: Date
}
```

Métodos estáticos:
- `createContact()`: Cria novo contato
- `findByEmail()`: Busca por email
- `findRecentByIP()`: Busca recentes por IP
- `countRecentByEmail()`: Conta mensagens recentes

**ProjectsSchema.js**:
```javascript
{
  projectId: Number (unique, indexed)
  name: String (required)
  url: String (required)
  fullUrl: String
  description: String (max 1000)
  shortDescription: String (max 200)
  tech: Array<String>
  status: Enum ['Live', 'In Progress', 'Archived']
  tag: String
  tagColor: String
  logo: String
  hero: String
  accentColor: String
  isActive: Boolean
  order: Number
}
```

**StackSchema.js**:
```javascript
{
  category: Enum ['frontend', 'backend', 'devops'] (unique)
  techs: Array<{
    name: String
    icon: String
    color: String
    description: String
    isLearning: Boolean
    order: Number
  }>
  isActive: Boolean
}
```

#### 3. **Middleware Layer** (`src/middlewares/`)

**auth.js**: Autenticação e autorização
- Verificação de sessão
- Expiração de sessão (2 horas)
- Controle de acesso baseado em role (admin/user)
- Logs de tentativas não autorizadas

**validate.js**: Validação com Joi
- Validação de body, query, params
- Retorno de erros formatados
- Strip de campos desconhecidos

**compression.js**: Compressão HTTP
- Gzip/Deflate level 6
- Threshold de 1KB
- Header `x-no-compression` para bypass

**errorHandler.js**: Tratamento de erros
- Error handler global
- 404 handler
- Unhandled rejection handler
- Uncaught exception handler
- Graceful shutdown (SIGTERM, SIGINT)

**requestLogger.js**: Log de requisições
- Log de método, URL, status, IP
- Integração com Winston

#### 4. **Routes Layer** (`src/routes/v1/`)

Sistema de roteamento dinâmico que carrega automaticamente rotas de arquivos:

**Estrutura de uma rota:**
```javascript
module.exports = {
  method: 'GET/POST/PUT/DELETE',
  requiresAuth: Boolean,
  role: 'admin/user', // opcional
  validate: validateMiddleware, // opcional
  rateLimiter: rateLimiterInstance, // opcional
  async run(req, res) {
    // Lógica da rota
  }
};
```

**contact.js** (POST /api/v1/contact):
- Rate limit: 3 requisições/15min
- Validação com Joi
- Bloqueio de emails descartáveis
- Detecção de conteúdo suspeito (spam)
- Limite por IP (2/hora) e email (3/24h)
- Envio de emails (notificação + confirmação)
- Sistema anti-spam com patterns regex

**projects.js** (GET /api/v1/projects):
- Cache Redis (1 hora)
- Retorna lista de projetos ativos
- Header `X-Cache: HIT/MISS`
- Formatação de resposta padronizada

**stacks.js** (GET /api/v1/stacks):
- Cache Redis (1 hora)
- Retorna tecnologias por categoria
- Ordenação por categoria e order

**activity.js** (GET /api/v1/activity):
- Cache Redis (30 minutos)
- Integração com GitHub API
- Retorna contribuições dos últimos 6 meses
- Calcula estatísticas (total, dias ativos, sequências)
- Agrupa por semanas para visualização em grid
- Header `X-Cache: HIT/MISS`

**Integrações** (`integrations/`):
- `spotify.js`, `spotify-stream.js`, `spotify-stats.js` - Integração Spotify
- `steam.js`, `steam-stream.js`, `steam-stats.js` - Integração Steam

#### 5. **Utils Layer** (`src/utils/`)

**logger.js**: Sistema de logging Winston
- Logs coloridos no console
- Rotação diária de arquivos
- Níveis: debug, info, warn, error
- Categorias: CLIENT, COMMAND, EVENT, DATABASE, REDIS, ACCESS
- Logs estruturados em JSON (produção)
- Retention: 14 dias (error), 30 dias (combined)

**mailer.js**: Serviço de emails
- Integração Brevo (SendGrid)
- Templates HTML responsivos
- Envio de notificações para admin
- Emails de confirmação para usuários
- Fallback em caso de falha

**common.js**: Utilitários
- Função `sendResponse()` padronizada
- Constantes de cores para console
- Helpers diversos

**encryption.js**: Criptografia
- Hash bcrypt
- Geração de tokens
- Validação de passwords

#### 6. **Validators** (`src/validators/`)

**contactValidator.js**: Validação de contato
- Nome: 2-100 caracteres
- Email: formato válido, não descartável
- Telefone: 10-11 dígitos (opcional)
- Subject: 10-2000 caracteres
- Mensagens de erro customizadas em português

### Configuração de Ambiente

**Variáveis obrigatórias:**

```env
# Application
NODE_ENV=production
PORT=3000

# Secrets
USER_SECRET=your-user-secret
ADMIN_SECRET=your-admin-secret
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
JWT_SECRET_TEMP=your-temp-jwt-secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# MySQL (Sessions)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=portfolio_sessions
MYSQL_URI=mysql://user:pass@host:3306/db

# Redis (Cache)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_URL=redis://:password@host:6379

# Email (Brevo/SendGrid)
BREVO_FROM_EMAIL=noreply@danielalipio.me
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-smtp-user
BREVO_SMTP_PASSWORD=your-smtp-password
ADMIN_EMAIL=daniel@danielalipio.me

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutos
RATE_LIMIT_MAX=50         # Máximo de requisições

# Frontend
FRONTEND_URL=https://danielalipio.me
```

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm start        # Produção
npm run seed     # Seed de dados
```

### Endpoints da API

| Método | Endpoint | Descrição | Auth | Cache |
|--------|----------|-----------|------|-------|
| GET | `/api/v1/projects` | Lista projetos | ❌ | ✅ (1h) |
| GET | `/api/v1/stacks` | Lista tecnologias | ❌ | ✅ (1h) |
| GET | `/api/v1/activity` | Contribuições GitHub (6 meses) | ❌ | ✅ (30min) |
| POST | `/api/v1/contact` | Envia contato | ❌ | ❌ |
| GET | `/api/health` | Health check | ❌ | ❌ |

### Rate Limiting

- **Global**: 60 req/min
- **API**: 100 req/15min
- **Auth**: 5 req/15min
- **Contact**: 3 req/15min

---

## 🎨 Frontend (da-ui)

### Arquitetura

O frontend é uma Single Page Application (SPA) moderna construída com React 19 e Vite.

#### 1. **Components** (`src/components/`)

**Forms:**
- `ContactForm.jsx`: Formulário de contato com validação client-side, feedback visual, sanitização XSS

**Landing:**
- `HeroSection.jsx`: Hero com animações Framer Motion, troca de roles, imagem otimizada
- `AboutSection.jsx`: Seção sobre mim com biografia e visualização de contribuições do GitHub em tempo real
- `StacksSection.jsx`: Grid de tecnologias com categorias expansíveis, ícones animados
- `ProjectsSection.jsx`: Cards de projetos com modal detalhado, lazy loading
- `ContactSection.jsx`: CTA de contato com formulário

**Layout:**
- `Header.jsx`: Navegação responsiva com menu mobile
- `Footer.jsx`: Links sociais e informações
- `SEO.jsx`: Meta tags dinâmicas para SEO

**UI:**
- `OptimizedImage.jsx`: Componente de imagem com lazy loading, placeholder, error handling
- `GitHubContributions.jsx`: Visualização de contribuições do GitHub estilo heatmap (6 meses)
- `ActivityDisplay.jsx`: Display unificado de atividades em tempo real (Spotify, Steam)
- `SpotifyDisplay.jsx`: Componente especializado para exibição de música Spotify
- `SpotifyNowPlaying.jsx`: Widget de "Now Playing" do Spotify
- `SpotifyBadge.jsx`: Badge de status do Spotify
- `SteamDisplay.jsx`: Componente para exibição de jogo Steam

#### 2. **Services** (`src/services/`)

**api.js**: Cliente Axios configurado
- Base URL dinâmica (dev/prod)
- Timeout de 10s
- Interceptors de request/response
- Tratamento de erros HTTP completo
- Logging de requisições
- Credentials (cookies)

Métodos disponíveis:
```javascript
apiService.getProjects()      // GET /v1/projects
apiService.getStacks()        // GET /v1/stacks
apiService.sendContact(data)  // POST /v1/contact
apiService.healthCheck()      // GET /health
```

#### 3. **Routes** (`src/routes/`)

**AppRoutes.jsx**: Configuração de rotas
- Lazy loading de páginas
- Redirecionamentos externos (Instagram, LinkedIn, GitHub, X)
- 404 handler

Rotas:
- `/` - Landing Page
- `/instagram` → Redirect externo
- `/linkedin` → Redirect externo
- `/github` → Redirect externo
- `/x` → Redirect externo
- `*` - 404 Not Found

#### 4. **Pages** (`src/pages/`)

**LandingPage.jsx**: Página principal
- Smooth scroll ativado
- SEO otimizado (meta tags)
- Composição de seções

**NotFoundPage.jsx**: Página 404
- Design personalizado
- Link de retorno

#### 5. **Hooks** (`src/hooks/`)

**useActivity.js**: Hook de atividades GitHub
- Busca contribuições dos últimos 6 meses
- Retorna activities, stats, loading e error
- Integração com endpoint `/api/v1/activity`
- useEffect para fetch automático

**useSpotify.js**: Hook de integração Spotify
- Conexão SSE para streaming em tempo real
- Detecção de eventos (changemusic, play, pause, seek)
- Estado de música atual, progresso e loading
- Reconexão automática em caso de erro

**useSteam.js**: Hook de integração Steam
- Conexão SSE para streaming em tempo real
- Detecção de eventos (gamestart, gamestop, gamechange)
- Estado de jogo atual e loading
- Reconexão automática em caso de erro

**useDebounce.js**: Hook de debounce
- Atraso de atualização de valor
- Útil para inputs de busca
- Reduz chamadas à API

#### 6. **Utils** (`src/utils/`)

**apiLogger.js**: Logger de requisições
- Log de request (método, URL)
- Log de response (status, mensagem)
- Log de erros com detalhes

**projectEnricher.js**: Enriquecimento de dados
- Adiciona campos computados a projetos
- Mapeia cores e ícones

**navigation.js**: Utilitários de navegação
- Scroll suave para seções
- Hash navigation

### Configuração de Build

**vite.config.js**:
- React Compiler ativado (target: React 19)
- Code splitting inteligente (react-vendor, framer-motion, icons)
- Proxy para API em desenvolvimento
- Alias `@` para `./src`
- Preview server na porta 4173

**tailwind.config.cjs**:
- Configuração customizada
- PurgeCSS ativado
- Cores personalizadas
- Animações customizadas

### Otimizações

#### Performance
- **Code Splitting**: Chunks separados para vendors
- **Lazy Loading**: Componentes carregados sob demanda
- **Image Optimization**: Componente OptimizedImage
- **Memo**: Componentes memorizados (ProjectCard, TechCard)
- **useCallback**: Callbacks memorizados

#### SEO
- Meta tags dinâmicas
- Open Graph tags
- Sitemap.xml
- Robots.txt
- Semantic HTML

#### UX
- Animações suaves (Framer Motion)
- Feedback visual de loading/erro
- Formulários com validação em tempo real
- Design responsivo mobile-first
- Acessibilidade (ARIA labels)

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** v6+ ([Download](https://www.mongodb.com/try/download/community))
- **MySQL** v8+ ([Download](https://dev.mysql.com/downloads/))
- **Redis** v7+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))

### Clone o Repositório

```bash
git clone https://github.com/danielalipio/danielalipio.me.git
cd danielalipio.me
```

### Instalação do Backend

```bash
cd da-api
npm install
```

### Instalação do Frontend

```bash
cd da-ui
npm install
```

---

## ⚙️ Configuração

### 1. Configurar MongoDB

```bash
# Iniciar MongoDB
mongod --dbpath /path/to/data/db

# Criar banco de dados
mongosh
> use portfolio
```

### 2. Configurar MySQL

```bash
mysql -u root -p

CREATE DATABASE portfolio_sessions;
```

### 3. Configurar Redis

```bash
# Iniciar Redis
redis-server

# Testar conexão
redis-cli ping
# Deve retornar: PONG
```

### 4. Variáveis de Ambiente

**Backend** (`da-api/.env`):

```env
NODE_ENV=development
PORT=3000

USER_SECRET=your-user-secret-here
ADMIN_SECRET=your-admin-secret-here
SESSION_SECRET=your-session-secret-here
JWT_SECRET=your-jwt-secret-here
JWT_SECRET_TEMP=your-temp-jwt-secret-here

MONGODB_URI=mongodb://localhost:27017/portfolio

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=portfolio_sessions
MYSQL_URI=mysql://root:password@localhost:3306/portfolio_sessions

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_URL=redis://127.0.0.1:6379

BREVO_FROM_EMAIL=noreply@danielalipio.me
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-brevo-user
BREVO_SMTP_PASSWORD=your-brevo-password
ADMIN_EMAIL=your-admin@email.com

# GitHub API (obter em https://github.com/settings/tokens)
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_USERNAME=your-github-username

# Spotify API (obter em https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REFRESH_TOKEN=your-spotify-refresh-token

# Steam API (obter em https://steamcommunity.com/dev/apikey)
STEAM_API_KEY=your-steam-api-key
STEAM_ID=your-steam-id-64

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=50

FRONTEND_URL=http://localhost:5173
```

**Frontend** (`da-ui/src/config/.env`):

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Gerar Chaves de Criptografia

```bash
cd da-api
node scripts/crypto-gen.js
```

### 6. Configurar Tokens de API (Opcional)

**GitHub Token:**
1. Acessar [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Criar novo token (classic)
3. Selecionar escopos: `read:user`, `repo`
4. Copiar token e adicionar ao `.env`

**Spotify Token:**
1. Criar app em [Spotify Dashboard](https://developer.spotify.com/dashboard)
2. Usar script de geração: `node scripts/generate-spotify-token.js`
3. Copiar tokens e adicionar ao `.env`

**Steam API Key:**
1. Acessar [Steam Web API Key](https://steamcommunity.com/dev/apikey)
2. Registrar domínio e obter key
3. Obter Steam ID em [SteamID.io](https://steamid.io/)
4. Adicionar ao `.env`

### 7. Popular Banco de Dados

```bash
cd da-api
npm run seed
```

---

## 💻 Desenvolvimento

### Iniciar Backend

```bash
cd da-api
npm run dev
```

Servidor rodando em: `http://localhost:3000`

### Iniciar Frontend

```bash
cd da-ui
npm run dev
```

Aplicação rodando em: `http://localhost:5173`

### Testar SMTP

```bash
cd da-api
node scripts/test-smtp.js
```

### Desenvolvimento Simultâneo

```bash
# Terminal 1
cd da-api && npm run dev

# Terminal 2
cd da-ui && npm run dev
```

### Debugging

**Backend:**
```bash
NODE_ENV=development node --inspect index.js
```

**Frontend:**
- Abra React DevTools no navegador
- Console logs já configurados no `api.js`

---

## 📦 Deploy

### Build do Frontend

```bash
cd da-ui
npm run build
```

Arquivos gerados em `da-ui/dist/`

### Deploy Backend (PM2)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
cd da-api
pm2 start index.js --name "portfolio-api"

# Configurar auto-restart
pm2 startup
pm2 save
```

### Deploy com Docker

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  api:
    build: ./da-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongodb
      - redis
      - mysql
    restart: unless-stopped

  frontend:
    build: ./da-ui
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped

  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_DATABASE: portfolio_sessions
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mongo-data:
  mysql-data:
```

```bash
docker-compose up -d
```

### Deploy na Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd da-ui
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## ✨ Features

### Backend

✅ **API RESTful** completa com versionamento  
✅ **Autenticação** JWT + Sessions  
✅ **Autorização** baseada em roles  
✅ **Rate Limiting** inteligente por endpoint  
✅ **Cache Redis** distribuído  
✅ **Validação** robusta com Joi  
✅ **Logging** estruturado com Winston  
✅ **Emails** transacionais com templates HTML  
✅ **Anti-Spam** com detecção de padrões  
✅ **Health Check** para monitoramento  
✅ **Graceful Shutdown** para deploy zero-downtime  
✅ **Compressão** gzip/deflate  
✅ **CORS** configurável  
✅ **Helmet** para segurança  
✅ **Sessions** persistentes em MySQL  

### Frontend

✅ **SPA** moderna com React 19  
✅ **Animações** suaves com Framer Motion  
✅ **Design** responsivo mobile-first  
✅ **SEO** otimizado com meta tags  
✅ **Lazy Loading** de componentes  
✅ **Code Splitting** inteligente  
✅ **Image Optimization** automática  
✅ **Formulários** com validação em tempo real  
✅ **Error Handling** robusto  
✅ **Loading States** com feedback visual  
✅ **404** personalizado  
✅ **Acessibilidade** (ARIA)  
✅ **Integrações em Tempo Real** (Spotify + Steam)  
✅ **Visualização GitHub** com heatmap de contribuições  
✅ **Tooltips Inteligentes** com posicionamento responsivo  

---

## 🎮 Integrações em Tempo Real

### Visão Geral

O portfólio conta com integrações que exibem atividades do desenvolvedor, proporcionando uma experiência dinâmica e pessoal:

- **Spotify**: Música sendo ouvida em tempo real via **Server-Sent Events (SSE)**
- **Steam**: Jogo sendo jogado em tempo real via **Server-Sent Events (SSE)**
- **GitHub**: Visualização de contribuições dos últimos 6 meses em formato heatmap

### 🎵 Integração Spotify

Sistema completo que exibe em tempo real a música sendo ouvida no Spotify.

#### Funcionalidades

✅ **Real-time Streaming** via SSE  
✅ **Detecção inteligente de eventos:**
  - `spotify:changemusic` - Trocou de música
  - `spotify:play` - Retomou reprodução
  - `spotify:pause` - Pausou música
  - `spotify:seek` - Avançou/retrocedeu manualmente

✅ **Rate Limit Protection:**
  - Tracking local de requisições (janela de 30s)
  - Cache de token por 55 minutos
  - Margem de segurança de 10% (usa 162/180 req/30s)
  - Fallback automático em caso de erro

✅ **Interface:**
  - Barra de progresso com interpolação local
  - Botões visuais de Play/Pause
  - Badge dinâmico (Ouvindo/Pausado)
  - Link direto para música no Spotify

#### Arquitetura

```
Spotify API → SpotifyService (rate limit) → SSE Stream → useSpotify Hook → ActivityDisplay
                     ↓
              Redis Cache (60s TTL)
```

#### Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/integrations/spotify` | GET | Status atual (REST) |
| `/api/v1/integrations/spotify-stream` | GET | Stream SSE tempo real |
| `/api/v1/integrations/spotify-stats` | GET | Estatísticas de rate limit |

#### Configuração

```env
# Spotify API (obter em https://developer.spotify.com)
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REFRESH_TOKEN=your-refresh-token
```

**Como obter refresh token:**
1. Criar app em [Spotify Dashboard](https://developer.spotify.com/dashboard)
2. Usar ferramenta de autorização OAuth
3. Copiar refresh_token gerado

#### Performance

- **Polling:** 1 segundo (responsivo)
- **Cache:** Redis 60s TTL
- **Tráfego:** ~32 req/30s (18% do limite)
- **Otimização:** Não envia progresso normal (front interpola localmente)

---

### 🎮 Integração Steam

Sistema que exibe em tempo real o jogo sendo jogado na Steam.

#### Funcionalidades

✅ **Real-time Streaming** via SSE  
✅ **Detecção inteligente de eventos:**
  - `steam:gamestart` - Começou a jogar
  - `steam:gamestop` - Parou de jogar
  - `steam:gamechange` - Trocou de jogo
  - `steam:statuschange` - Mudou status (online/offline)

✅ **Rate Limit Protection:**
  - Tracking local (janela de 5 minutos)
  - Margem de segurança de 20% (usa 160/200 req/5min)
  - Fallback automático

✅ **Interface:**
  - Imagem do jogo (header oficial)
  - Nome do jogo e jogador
  - Link direto para Steam Store
  - Visual clean (sem play/pause, apenas "jogando")

#### Arquitetura

```
Steam API → SteamService (rate limit) → SSE Stream → useSteam Hook → ActivityDisplay
                   ↓
            Redis Cache (1h TTL)
```

#### Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/integrations/steam` | GET | Status atual (REST) |
| `/api/v1/integrations/steam-stream` | GET | Stream SSE tempo real |
| `/api/v1/integrations/steam-stats` | GET | Estatísticas de rate limit |

#### Configuração

```env
# Steam API (obter em https://steamcommunity.com/dev/apikey)
STEAM_API_KEY=your-api-key
STEAM_ID=your-steam-id-64
```

**Como obter Steam ID:**
1. Acessar [SteamID.io](https://steamid.io/)
2. Inserir perfil Steam
3. Copiar steamID64

#### Performance

- **Polling:** 10 segundos
- **Cache:** Redis 1h TTL
- **Tráfego:** ~8 req/5min (20% do limite)
- **Otimização:** Polling mais espaçado (Steam atualiza ~10s)

---

### 📊 Visualização de Contribuições GitHub

Sistema que exibe um heatmap das contribuições do GitHub nos últimos 6 meses, estilo grid de quadrados verdes, similar ao perfil do GitHub.

#### Funcionalidades

✅ **Heatmap de Contribuições:**
  - Grid estilo GitHub com quadrados verdes
  - 6 meses de histórico (26 semanas)
  - 5 níveis de intensidade (0-4)
  - Cores progressivas baseadas na quantidade de contribuições

✅ **Estatísticas Detalhadas:**
  - Total de contribuições
  - Dias com atividade
  - Sequência atual (current streak)
  - Maior sequência (longest streak)

✅ **Interface Responsiva:**
  - Tooltip personalizado ao passar o mouse
  - Ajuste automático de posicionamento (não vaza da tela)
  - Grid adaptável à largura do container
  - Labels de meses e dias da semana

✅ **Tooltip Inteligente:**
  - Exibe número de contribuições e data
  - Posicionamento dinâmico (acima/abaixo conforme espaço)
  - Seta apontando para o quadrado selecionado
  - Responsivo para mobile (não vaza das bordas)

#### Arquitetura

```
GitHub API → Activity Route → useActivity Hook → GitHubContributions Component
                     ↓
              Calculo de níveis e estatísticas
```

#### Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/activity` | GET | Contribuições dos últimos 6 meses |

#### Configuração

```env
# GitHub Token (obter em https://github.com/settings/tokens)
GITHUB_TOKEN=your-personal-access-token
GITHUB_USERNAME=your-github-username
```

**Como obter GitHub Token:**
1. Acessar [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Criar novo token (classic)
3. Selecionar escopo `read:user` e `repo`
4. Copiar o token gerado

#### Níveis de Contribuição

| Nível | Cor | Contribuições |
|-------|-----|---------------|
| 0 | `#161b22` (Cinza escuro) | 0 |
| 1 | `#0e4429` (Verde escuro) | 1-3 |
| 2 | `#006d32` (Verde médio) | 4-6 |
| 3 | `#26a641` (Verde claro) | 7-9 |
| 4 | `#39d353` (Verde brilhante) | 10+ |

#### Componente GitHubContributions

**Props:**
- `activities`: Array de objetos com data, count e level
- `stats`: Objeto com estatísticas (total, daysWithActivity, currentStreak, longestStreak)

**Features:**
- Portal do React para tooltip (renderizado no body)
- Animações com Framer Motion
- Grid CSS responsivo
- Cálculo automático de semanas e meses
- Limite de 26 semanas (6 meses)

**Exemplo de Uso:**
```jsx
<GitHubContributions 
  activities={activityData} 
  stats={statsData} 
/>
```

#### Performance

- **Loading:** Skeleton com animação pulse
- **Cache:** Dados podem ser cacheados no backend
- **Bundle Size:** ~8KB (minificado + gzipped)
- **Otimização:** Renderização eficiente com React portals

---

### 🎨 ActivityDisplay - Componente Unificado

Componente reutilizável que exibe qualquer atividade (Spotify, Steam, YouTube, Discord) de forma consistente.

#### Vantagens

✅ **DRY:** 1 componente ao invés de N separados  
✅ **Escalável:** Adicionar plataforma = apenas configuração  
✅ **Consistente:** Mesmo padrão visual para todas  
✅ **Performance:** -67% bundle size vs componentes separados  

#### Uso

```jsx
<ActivityDisplay 
  activity={spotifyData} 
  platform="spotify" 
  isMobile={false} 
/>
```

#### Plataformas Suportadas

| Plataforma | Cor | Ícone | Progress Bar | Link |
|------------|-----|-------|--------------|------|
| **Spotify** | Verde | 🎵 | ✅ Sim | Song URL |
| **Steam** | Azul | 🎮 | ❌ Não | Store Page |
| **YouTube*** | Vermelho | 📺 | ❌ Não | Video URL |
| **Discord*** | Roxo | 💬 | ❌ Não | - |

*Template pronto para implementação futura

#### Adicionar Nova Plataforma

```javascript
// 1. Adicionar config em ActivityDisplay.jsx
newplatform: {
  color: { primary: 'color-500', secondary: 'color-400' },
  icon: IconComponent,
  badge: 'Texto do badge',
  title: activity.field_name,
  subtitle: activity.subtitle_field,
  image: activity.image_url,
  link: activity.external_link,
  showProgress: false
}

// 2. Criar hook useNewPlatform.js (padrão SSE)
// 3. Usar: <ActivityDisplay activity={data} platform="newplatform" />
```

**Tempo para adicionar:** ~5 minutos 🚀

---

### 🔄 Toggle de Plataformas

Sistema inteligente que alterna entre plataformas ativas:

#### Desktop
- Botões laterais com ícones SVG oficiais
- Spotify (verde) e Steam (azul)
- Transições suaves entre plataformas

#### Mobile  
- Botões horizontais no topo
- Apenas ícones (sem texto)
- Design minimalista e touch-friendly

#### Comportamento

```
Apenas Spotify ativo  → Exibe Spotify (sem toggle)
Apenas Steam ativo    → Exibe Steam (sem toggle)
Ambos ativos          → Exibe toggle entre os dois
Nenhum ativo          → Logo padrão
```

---

### 📊 Comparação de APIs

| Aspecto | Spotify | Steam |
|---------|---------|-------|
| **Rate Limit** | 180/30s | 200/5min |
| **Polling** | 1s | 10s |
| **Uso Médio** | 18% | 20% |
| **Cache TTL** | 60s | 1h |
| **Eventos** | 4 tipos | 4 tipos |
| **Token** | Refresh (55min) | API Key |

---

### 🛡️ Segurança das Integrações

#### Backend Protection

✅ **Rate Limit Local:**
  - Spotify: Margem de 10% (162/180)
  - Steam: Margem de 20% (160/200)
  
✅ **Variáveis Seguras:**
  - Secrets nunca expostos ao frontend
  - Apenas dados públicos via SSE

✅ **Fallback Automático:**
  - Cache de último estado válido
  - Não quebra em caso de API down

#### Frontend Protection

✅ **SSE Auto-reconnect:**
  - EventSource reconecta automaticamente
  - Logs de status de conexão

✅ **Interpolação Local:**
  - Spotify: Progress bar fluida sem polling
  - Steam: Dados estáticos (sem interpolação)

✅ **Error Handling:**
  - Loading states
  - Error boundaries
  - Fallback UI

---

## 🔒 Segurança

### Backend

- **Helmet**: Headers de segurança HTTP
- **CORS**: Whitelist de origens permitidas
- **Rate Limiting**: Proteção contra DDoS e brute force
- **Validação**: Joi para sanitização de inputs
- **Anti-Spam**: Detecção de padrões suspeitos
- **Disposable Email**: Bloqueio de emails temporários
- **Sessions**: Secure cookies, httpOnly, sameSite
- **JWT**: Tokens assinados com secret
- **Bcrypt**: Hash de senhas com salt rounds
- **Environment Variables**: Secrets nunca commitados

### Frontend

- **DOMPurify**: Sanitização XSS
- **HTTPS**: Conexões criptografadas
- **CSP**: Content Security Policy
- **SRI**: Subresource Integrity
- **CORS**: Credenciais controladas

---

## ⚡ Performance

### Backend

- **Compressão**: Gzip/Deflate level 6
- **Cache Redis**: TTL de 1 hora para dados estáticos
- **Connection Pooling**: MySQL e MongoDB
- **Índices**: Queries otimizadas
- **Pagination**: Para listas grandes (preparado)
- **Lazy Loading**: Rotas carregadas dinamicamente

### Frontend

- **Code Splitting**: Chunks separados (react-vendor, framer-motion, icons)
- **Lazy Loading**: Componentes sob demanda
- **Memoization**: React.memo e useCallback
- **Image Optimization**: Lazy loading, placeholders
- **Bundle Size**: Otimizado com Vite
- **Tree Shaking**: Código não utilizado removido

### Métricas

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 200KB (gzipped)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2025 Daniel Alípio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Autor

**Daniel Alípio**
- Website: [danielalipio.me](https://danielalipio.me)
- GitHub: [@danielalipio](https://github.com/danielalipio)
- LinkedIn: [/in/danielalipio](https://linkedin.com/in/danielalipio)
- Instagram: [@danielhs](https://instagram.com/danielhs)
- X (Twitter): [@danielalipio](https://x.com/danielalipio)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato:

- Email: daniel@danielalipio.me
- Formulário: [danielalipio.me/#contact](https://danielalipio.me/#contact)

---

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)
- [Winston](https://github.com/winstonjs/winston)
- [Joi](https://joi.dev/)
- [Passport](https://www.passportjs.org/)

---

<div align="center">
  <p>Feito com ❤️ por Daniel Alípio</p>
  <p>© 2025 - Todos os direitos reservados</p>
</div>

