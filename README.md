# ðŸŒ PAM_AdminWeb

[![Next.js](https://img.shields.io/badge/Next.js-13.0-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081CB?style=flat-square&logo=material-ui)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

## ðŸ“‹ Sobre

Dashboard administrativo da plataforma PAM. Interface completa para gestÃ£o de usuÃ¡rios, parceiros, pedidos, relatÃ³rios e configuraÃ§Ãµes do sistema. Desenvolvido com Next.js e Material-UI para proporcionar uma experiÃªncia administrativa moderna e eficiente.

Esta aplicaÃ§Ã£o faz parte da **PAM (Plataforma de Agendamento de ManutenÃ§Ã£o)**, proporcionando uma interface moderna e responsiva para gestÃ£o da plataforma.

## ðŸ—ï¸ Estrutura do Projeto

`
PAM_AdminWeb/
â”œâ”€â”€ public/          # Arquivos estÃ¡ticos
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/  # Componentes reutilizÃ¡veis
â”‚   â”œâ”€â”€ pages/       # PÃ¡ginas da aplicaÃ§Ã£o
â”‚   â”œâ”€â”€ styles/      # Estilos globais e temas
â”‚   â”œâ”€â”€ utils/       # UtilitÃ¡rios e helpers
â”‚   â”œâ”€â”€ hooks/       # Custom hooks
â”‚   â”œâ”€â”€ context/     # Context providers
â”‚   â””â”€â”€ services/    # ServiÃ§os e APIs
â”œâ”€â”€ Dockerfile       # ConfiguraÃ§Ã£o do container
â””â”€â”€ README.md        # Este arquivo
`

## ðŸš€ Tecnologias

- **Next.js 13** - Framework React com SSR/SSG
- **TypeScript** - Tipagem estÃ¡tica
- **Material-UI (MUI)** - Biblioteca de componentes
- **Emotion** - CSS-in-JS
- **React Hook Form** - Gerenciamento de formulÃ¡rios
- **Axios** - Cliente HTTP
- **Auth0** - AutenticaÃ§Ã£o
- **Docker** - ContainerizaÃ§Ã£o

## ðŸ“¦ PrÃ©-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional)

## ðŸ”§ InstalaÃ§Ã£o e ExecuÃ§Ã£o

### Desenvolvimento Local

1. **Clone o repositÃ³rio**
   `ash
   git clone https://github.com/EmmanuelSMenezes/PAM_AdminWeb.git
   cd PAM_AdminWeb
   `

2. **Instale as dependÃªncias**
   `ash
   yarn install
   # ou
   npm install
   `

3. **Configure as variÃ¡veis de ambiente**
   `ash
   cp .env.example .env.local
   # Edite o arquivo .env.local com suas configuraÃ§Ãµes
   `

4. **Execute em modo desenvolvimento**
   `ash
   yarn dev
   # ou
   npm run dev
   `

5. **Acesse a aplicaÃ§Ã£o**
   - URL: http://localhost:8026

### ProduÃ§Ã£o

1. **Build da aplicaÃ§Ã£o**
   `ash
   yarn build
   yarn start
   `

### Docker

1. **Build da imagem**
   `ash
   docker build -t PAM_AdminWeb.ToLower() .
   `

2. **Execute o container**
   `ash
   docker run -p 8026:8026 PAM_AdminWeb.ToLower()
   `

## ðŸŽ¨ Funcionalidades

- âœ… **Interface Responsiva** - AdaptÃ¡vel a todos os dispositivos
- âœ… **Tema CustomizÃ¡vel** - Dark/Light mode
- âœ… **AutenticaÃ§Ã£o Segura** - IntegraÃ§Ã£o com Auth0
- âœ… **FormulÃ¡rios Validados** - ValidaÃ§Ã£o em tempo real
- âœ… **Componentes ReutilizÃ¡veis** - Biblioteca prÃ³pria de componentes
- âœ… **Performance Otimizada** - SSR e otimizaÃ§Ãµes do Next.js
- âœ… **SEO Friendly** - Meta tags e estrutura otimizada

## ðŸ”’ AutenticaÃ§Ã£o

A aplicaÃ§Ã£o utiliza **Auth0** para autenticaÃ§Ã£o segura:

- Login social (Google, Facebook, etc.)
- AutenticaÃ§Ã£o multi-fator (MFA)
- Gerenciamento de sessÃµes
- Controle de acesso baseado em roles

## ðŸŒ VariÃ¡veis de Ambiente

| VariÃ¡vel | DescriÃ§Ã£o | Exemplo |
|----------|-----------|---------|
| NEXT_PUBLIC_API_URL | URL da API backend | https://api.pam.com |
| NEXT_PUBLIC_AUTH0_DOMAIN | DomÃ­nio do Auth0 | pam.auth0.com |
| NEXT_PUBLIC_AUTH0_CLIENT_ID | Client ID do Auth0 | bc123... |
| NEXTAUTH_SECRET | Secret para NextAuth | andom-secret |

## ðŸ“± Responsividade

A aplicaÃ§Ã£o Ã© totalmente responsiva, suportando:

- ðŸ“± **Mobile** (320px+)
- ðŸ“± **Tablet** (768px+)
- ðŸ’» **Desktop** (1024px+)
- ðŸ–¥ï¸ **Large Desktop** (1440px+)

## ðŸ§ª Testes

`ash
# Executar testes unitÃ¡rios
yarn test

# Executar testes com cobertura
yarn test:coverage

# Executar testes E2E
yarn test:e2e
`

## ðŸ“Š Scripts DisponÃ­veis

`ash
yarn dev          # Desenvolvimento
yarn build        # Build de produÃ§Ã£o
yarn start        # Iniciar produÃ§Ã£o
yarn lint         # Verificar cÃ³digo
yarn lint:fix     # Corrigir problemas de lint
yarn prettier     # Formatar cÃ³digo
`

## ðŸ¤ ContribuiÃ§Ã£o

1. Fork o projeto
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Commit suas mudanÃ§as (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

## ðŸ“„ LicenÃ§a

Este projeto estÃ¡ sob a licenÃ§a MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ðŸ†˜ Suporte

- ðŸ“§ Email: suporte@pam.com
- ðŸ“± WhatsApp: +55 (11) 99999-9999
- ðŸ› Issues: [GitHub Issues](https://github.com/EmmanuelSMenezes/PAM_AdminWeb/issues)

---

<div align="center">
  <strong>PAM - Plataforma de Agendamento de ManutenÃ§Ã£o</strong><br>
  Desenvolvido com â¤ï¸ pela equipe PAM
</div>
