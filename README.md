# ðŸŒ PAM_AdminWeb

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-13.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081CB?style=for-the-badge&logo=material-ui)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**AplicaÃ§Ã£o web moderna e responsiva para a Plataforma PAM**

[ðŸš€ Demo](#-demo) â€¢ [ðŸ“– DocumentaÃ§Ã£o](#-documentaÃ§Ã£o) â€¢ [ðŸ› ï¸ InstalaÃ§Ã£o](#ï¸-instalaÃ§Ã£o) â€¢ [ðŸ¤ ContribuiÃ§Ã£o](#-contribuiÃ§Ã£o)

</div>

---

## ðŸ“‹ Sobre o Projeto

**Dashboard administrativo completo** da plataforma PAM. Interface moderna e intuitiva para gestÃ£o de usuÃ¡rios, parceiros, pedidos, relatÃ³rios financeiros, configuraÃ§Ãµes do sistema, monitoramento em tempo real e analytics avanÃ§ados. Desenvolvido com Next.js 13, TypeScript e Material-UI para proporcionar uma experiÃªncia administrativa profissional e eficiente.

### ðŸŽ¯ Principais Funcionalidades

- ðŸ‘¥ **GestÃ£o de UsuÃ¡rios**: CRUD completo, roles e permissÃµes
- ðŸ¢ **GestÃ£o de Parceiros**: Cadastro, aprovaÃ§Ã£o e monitoramento
- ðŸ“‹ **GestÃ£o de Pedidos**: Acompanhamento e controle de status
- ðŸ’° **RelatÃ³rios Financeiros**: Dashboards e mÃ©tricas de receita
- âš™ï¸ **ConfiguraÃ§Ãµes**: ParÃ¢metros do sistema e customizaÃ§Ãµes
- ðŸ“Š **Analytics**: MÃ©tricas de performance e KPIs
- ðŸ”” **NotificaÃ§Ãµes**: Centro de alertas e comunicaÃ§Ãµes
- ðŸ›¡ï¸ **Auditoria**: Logs de aÃ§Ãµes e seguranÃ§a
- ðŸ“± **Responsivo**: Interface adaptÃ¡vel a todos dispositivos
- ðŸŒ™ **Tema Escuro**: Modo claro/escuro personalizÃ¡vel

### ðŸ—ï¸ Arquitetura do Projeto

`
PAM_AdminWeb/
â”œâ”€â”€ ðŸ“ public/             # ðŸŒ Arquivos EstÃ¡ticos
â”‚   â”œâ”€â”€ assets/            # Imagens e Ã­cones
â”‚   â”œâ”€â”€ favicon/           # Favicons
â”‚   â””â”€â”€ fonts/             # Fontes customizadas
â”œâ”€â”€ ðŸ“ src/                # ðŸ“¦ CÃ³digo Fonte
â”‚   â”œâ”€â”€ components/        # ðŸ§© Componentes ReutilizÃ¡veis
â”‚   â”‚   â”œâ”€â”€ ui/            # Componentes de UI bÃ¡sicos
â”‚   â”‚   â”œâ”€â”€ forms/         # FormulÃ¡rios
â”‚   â”‚   â””â”€â”€ layout/        # Layout components
â”‚   â”œâ”€â”€ pages/             # ðŸ“„ PÃ¡ginas da AplicaÃ§Ã£o
â”‚   â”‚   â”œâ”€â”€ dashboard/     # Dashboard administrativo
â”‚   â”‚   â”œâ”€â”€ auth/          # AutenticaÃ§Ã£o
â”‚   â”‚   â””â”€â”€ api/           # API routes (Next.js)
â”‚   â”œâ”€â”€ styles/            # ðŸŽ¨ Estilos e Temas
â”‚   â”‚   â”œâ”€â”€ globals.css    # Estilos globais
â”‚   â”‚   â””â”€â”€ theme/         # ConfiguraÃ§Ã£o do tema MUI
â”‚   â”œâ”€â”€ utils/             # ðŸ”§ UtilitÃ¡rios
â”‚   â”‚   â”œâ”€â”€ helpers/       # FunÃ§Ãµes auxiliares
â”‚   â”‚   â””â”€â”€ constants/     # Constantes
â”‚   â”œâ”€â”€ hooks/             # ðŸª Custom Hooks
â”‚   â”œâ”€â”€ context/           # ðŸŒ Context Providers
â”‚   â”œâ”€â”€ services/          # ðŸŒ ServiÃ§os e APIs
â”‚   â”‚   â”œâ”€â”€ api/           # Chamadas para APIs
â”‚   â”‚   â””â”€â”€ auth/          # ServiÃ§os de autenticaÃ§Ã£o
â”‚   â””â”€â”€ types/             # ðŸ“ DefiniÃ§Ãµes TypeScript
â”œâ”€â”€ ðŸ“„ Dockerfile          # ðŸ³ ContainerizaÃ§Ã£o
â”œâ”€â”€ ðŸ“„ docker-compose.yml  # ðŸ³ OrquestraÃ§Ã£o local
â”œâ”€â”€ ðŸ“„ next.config.js      # âš™ï¸ ConfiguraÃ§Ã£o Next.js
â””â”€â”€ ðŸ“„ README.md           # ðŸ“– Este arquivo
`

## ðŸš€ Tecnologias e Ferramentas

### Frontend Framework
- **[Next.js 13](https://nextjs.org/)** - Framework React com SSR/SSG
- **[React 18](https://reactjs.org/)** - Biblioteca de interface
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estÃ¡tica

### UI/UX
- **[Material-UI (MUI)](https://mui.com/)** - Biblioteca de componentes
- **[Emotion](https://emotion.sh/)** - CSS-in-JS
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulÃ¡rios
- **[Framer Motion](https://www.framer.com/motion/)** - AnimaÃ§Ãµes

### Estado e Dados
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - Gerenciamento de estado
- **[React Query](https://tanstack.com/query)** - Cache e sincronizaÃ§Ã£o de dados
- **[Axios](https://axios-http.com/)** - Cliente HTTP

### AutenticaÃ§Ã£o e SeguranÃ§a
- **[Auth0](https://auth0.com/)** - AutenticaÃ§Ã£o e autorizaÃ§Ã£o
- **[NextAuth.js](https://next-auth.js.org/)** - AutenticaÃ§Ã£o para Next.js

### DevOps e Qualidade
- **[Docker](https://www.docker.com/)** - ContainerizaÃ§Ã£o
- **[ESLint](https://eslint.org/)** - Linting de cÃ³digo
- **[Prettier](https://prettier.io/)** - FormataÃ§Ã£o de cÃ³digo
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

## ðŸ“¦ PrÃ©-requisitos

Antes de comeÃ§ar, certifique-se de ter instalado:

- **[Node.js 18+](https://nodejs.org/)** (versÃ£o LTS recomendada)
- **[Yarn](https://yarnpkg.com/)** ou **[npm](https://www.npmjs.com/)** (gerenciador de pacotes)
- **[Git](https://git-scm.com/)** (controle de versÃ£o)
- **[Docker Desktop](https://www.docker.com/products/docker-desktop)** (opcional, para containerizaÃ§Ã£o)

## ðŸ› ï¸ InstalaÃ§Ã£o e ConfiguraÃ§Ã£o

### 1ï¸âƒ£ Clone o RepositÃ³rio

`ash
git clone https://github.com/EmmanuelSMenezes/PAM_AdminWeb.git
cd PAM_AdminWeb
`

### 2ï¸âƒ£ Instalar DependÃªncias

`ash
# Usando Yarn (recomendado)
yarn install

# Ou usando npm
npm install
`

### 3ï¸âƒ£ ConfiguraÃ§Ã£o do Ambiente

`ash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure suas variÃ¡veis de ambiente
# Edite o arquivo .env.local
`

### 4ï¸âƒ£ ConfiguraÃ§Ã£o das VariÃ¡veis de Ambiente

`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_VERSION=v1

# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:8026
NEXTAUTH_SECRET=your-nextauth-secret

# Environment
NODE_ENV=development
`

### 5ï¸âƒ£ Executar em Desenvolvimento

`ash
# Iniciar servidor de desenvolvimento
yarn dev

# Ou com npm
npm run dev
`

### 6ï¸âƒ£ Verificar InstalaÃ§Ã£o

Acesse http://localhost:8026 para ver a aplicaÃ§Ã£o rodando.

## ðŸ³ Docker

### Desenvolvimento com Docker

`ash
# Build da imagem
docker build -t PAM_AdminWeb.ToLower() .

# Executar container
docker run -p 8026:8026 PAM_AdminWeb.ToLower()
`

### Docker Compose

`ash
# Subir todos os serviÃ§os
docker-compose up -d

# Ver logs
docker-compose logs -f PAM_AdminWeb.ToLower()

# Parar serviÃ§os
docker-compose down
`

## ðŸ—ï¸ Build e Deploy

### Build de ProduÃ§Ã£o

`ash
# Build da aplicaÃ§Ã£o
yarn build

# Iniciar em modo produÃ§Ã£o
yarn start
`

### Deploy AutomÃ¡tico

`ash
# Netlify
yarn build-netlify

# Vercel
vercel --prod

# Docker Registry
docker tag PAM_AdminWeb.ToLower() registry.azurecr.io/pam/PAM_AdminWeb.ToLower():latest
docker push registry.azurecr.io/pam/PAM_AdminWeb.ToLower():latest
`

## ðŸŽ¨ Funcionalidades Principais

### ðŸ” AutenticaÃ§Ã£o Segura
- Login com email/senha
- AutenticaÃ§Ã£o social (Google, Facebook)
- AutenticaÃ§Ã£o multi-fator (MFA)
- RecuperaÃ§Ã£o de senha
- Gerenciamento de sessÃµes

### ðŸ“Š Dashboard Interativo
- MÃ©tricas em tempo real
- GrÃ¡ficos e visualizaÃ§Ãµes
- Filtros avanÃ§ados
- ExportaÃ§Ã£o de dados
- PersonalizaÃ§Ã£o de layout

### ðŸŽ¯ Interface Responsiva
- Design mobile-first
- AdaptaÃ§Ã£o automÃ¡tica
- Touch-friendly
- Performance otimizada
- Acessibilidade (WCAG 2.1)

### ðŸŒ™ Tema CustomizÃ¡vel
- Dark/Light mode
- Cores personalizÃ¡veis
- Tipografia adaptÃ¡vel
- Componentes temÃ¡ticos

## ðŸ“± Responsividade

A aplicaÃ§Ã£o Ã© totalmente responsiva e otimizada para:

| Dispositivo | Breakpoint | CaracterÃ­sticas |
|-------------|------------|-----------------|
| ðŸ“± **Mobile** | 320px - 767px | Interface touch, navegaÃ§Ã£o simplificada |
| ðŸ“± **Tablet** | 768px - 1023px | Layout hÃ­brido, gestos touch |
| ðŸ’» **Desktop** | 1024px - 1439px | Interface completa, mouse/teclado |
| ðŸ–¥ï¸ **Large Desktop** | 1440px+ | Layout expandido, mÃºltiplas colunas |

## ðŸ§ª Testes

### Executar Testes

`ash
# Testes unitÃ¡rios
yarn test

# Testes com cobertura
yarn test:coverage

# Testes E2E
yarn test:e2e

# Testes de componentes
yarn test:components
`

### Estrutura de Testes

`
__tests__/
â”œâ”€â”€ components/        # Testes de componentes
â”œâ”€â”€ pages/            # Testes de pÃ¡ginas
â”œâ”€â”€ utils/            # Testes de utilitÃ¡rios
â”œâ”€â”€ fixtures/         # Dados de teste
â””â”€â”€ __mocks__/        # Mocks
`

## ðŸ“Š Scripts DisponÃ­veis

| Script | DescriÃ§Ã£o |
|--------|-----------|
| yarn dev | Servidor de desenvolvimento |
| yarn build | Build de produÃ§Ã£o |
| yarn start | Iniciar produÃ§Ã£o |
| yarn lint | Verificar cÃ³digo |
| yarn lint:fix | Corrigir problemas |
| yarn prettier | Formatar cÃ³digo |
| yarn type-check | Verificar tipos |
| yarn analyze | Analisar bundle |

## ðŸŒ VariÃ¡veis de Ambiente

| VariÃ¡vel | DescriÃ§Ã£o | Exemplo | ObrigatÃ³rio |
|----------|-----------|---------|-------------|
| NEXT_PUBLIC_API_URL | URL da API backend | https://api.pam.com | âœ… |
| NEXT_PUBLIC_AUTH0_DOMAIN | DomÃ­nio do Auth0 | pam.auth0.com | âœ… |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | Client ID do Auth0 | bc123... | âœ… |
| AUTH0_CLIENT_SECRET | Secret do Auth0 | secret123... | âœ… |
| NEXTAUTH_SECRET | Secret para NextAuth | andom-secret | âœ… |
| NODE_ENV | Ambiente de execuÃ§Ã£o | production | âŒ |

## ðŸš€ Performance

### OtimizaÃ§Ãµes Implementadas
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: AnÃ¡lise de tamanho
- **Lazy Loading**: Componentes lazy
- **Caching**: Cache inteligente
- **Compression**: Gzip/Brotli

### MÃ©tricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## ðŸ¤ ContribuiÃ§Ã£o

ContribuiÃ§Ãµes sÃ£o sempre bem-vindas! Siga estas etapas:

### 1ï¸âƒ£ Fork o Projeto
`ash
git clone https://github.com/EmmanuelSMenezes/PAM_AdminWeb.git
`

### 2ï¸âƒ£ Criar Branch
`ash
git checkout -b feature/nova-funcionalidade
`

### 3ï¸âƒ£ Commit das MudanÃ§as
`ash
git commit -m "feat: adiciona nova funcionalidade incrÃ­vel"
`

### 4ï¸âƒ£ Push para Branch
`ash
git push origin feature/nova-funcionalidade
`

### 5ï¸âƒ£ Abrir Pull Request
Abra um PR descrevendo suas mudanÃ§as detalhadamente.

### ðŸ“ PadrÃµes de CÃ³digo
- **ESLint**: Seguir regras configuradas
- **Prettier**: FormataÃ§Ã£o automÃ¡tica
- **TypeScript**: Tipagem obrigatÃ³ria
- **Conventional Commits**: PadrÃ£o de commits

## ðŸ“„ LicenÃ§a

Este projeto estÃ¡ sob a licenÃ§a **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ðŸ†˜ Suporte e Contato

### ðŸ“ž Canais de Suporte
- **ðŸ“§ Email**: suporte@pam.com
- **ðŸ’¬ WhatsApp**: +55 (11) 99999-9999
- **ðŸ› Issues**: [GitHub Issues](https://github.com/EmmanuelSMenezes/PAM_AdminWeb/issues)
- **ðŸ“– Wiki**: [DocumentaÃ§Ã£o Completa](https://github.com/EmmanuelSMenezes/PAM_AdminWeb/wiki)

### ðŸ‘¥ Equipe de Desenvolvimento
- **Frontend Lead**: Emmanuel Menezes
- **UI/UX**: Equipe PAM
- **DevOps**: Equipe PAM

---

<div align="center">

**[â¬† Voltar ao Topo](#-PAM_AdminWeb)**

**PAM - Plataforma de Agendamento de ManutenÃ§Ã£o**  
*Desenvolvido com â¤ï¸ pela equipe PAM*

[![GitHub](https://img.shields.io/badge/GitHub-PAM-181717?style=for-the-badge&logo=github)](https://github.com/EmmanuelSMenezes)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-PAM-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/company/pam)

</div>
