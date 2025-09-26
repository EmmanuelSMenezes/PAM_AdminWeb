# PAM_AdminWeb

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-13.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081CB?style=for-the-badge&logo=material-ui)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**Aplicacao web moderna e responsiva para a Plataforma PAM**

[Demo](#demo) â€¢ [Documentacao](#documentacao) â€¢ [Instalacao](#instalacao) â€¢ [Contribuicao](#contribuicao)

</div>

---

## Sobre o Projeto

Dashboard administrativo completo da plataforma PAM. Interface moderna e intuitiva para gestao de usuarios, parceiros, pedidos, relatorios financeiros, configuracoes do sistema, monitoramento em tempo real e analytics avancados. Desenvolvido com Next.js 13, TypeScript e Material-UI para proporcionar uma experiencia administrativa profissional e eficiente.

### Principais Funcionalidades

- **Gestao de Usuarios**: CRUD completo, roles e permissoes
- **Gestao de Parceiros**: Cadastro, aprovacao e monitoramento
- **Gestao de Pedidos**: Acompanhamento e controle de status
- **Relatorios Financeiros**: Dashboards e metricas de receita
- **Configuracoes**: Parametros do sistema e customizacoes
- **Analytics**: Metricas de performance e KPIs
- **Notificacoes**: Centro de alertas e comunicacoes
- **Auditoria**: Logs de acoes e seguranca
- **Responsivo**: Interface adaptavel a todos dispositivos
- **Tema Escuro**: Modo claro/escuro personalizavel

## Tecnologias

### Frontend Framework
- **[Next.js 13](https://nextjs.org/)** - Framework React com SSR/SSG
- **[React 18](https://reactjs.org/)** - Biblioteca de interface
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estatica

### UI/UX
- **[Material-UI (MUI)](https://mui.com/)** - Biblioteca de componentes
- **[Emotion](https://emotion.sh/)** - CSS-in-JS
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formularios

## Pre-requisitos

- **[Node.js 18+](https://nodejs.org/)** (versao LTS recomendada)
- **[Yarn](https://yarnpkg.com/)** ou **[npm](https://www.npmjs.com/)** (gerenciador de pacotes)
- **[Git](https://git-scm.com/)** (controle de versao)

## Instalacao

### 1. Clone o Repositorio

`ash
git clone https://github.com/EmmanuelSMenezes/PAM_AdminWeb.git
cd PAM_AdminWeb
`

### 2. Instalar Dependencias

`ash
# Usando Yarn (recomendado)
yarn install

# Ou usando npm
npm install
`

### 3. Configuracao do Ambiente

`ash
cp .env.example .env.local
`

### 4. Executar em Desenvolvimento

`ash
yarn dev
# ou
npm run dev
`

### 5. Verificar Instalacao

Acesse http://localhost:8026 para ver a aplicacao rodando.

## Docker

`ash
# Build
docker build -t pam_adminweb .

# Run
docker run -p 8026:8026 pam_adminweb
`

## Build de Producao

`ash
yarn build
yarn start
`

## Testes

`ash
yarn test
`

## Contribuicao

1. Fork o projeto
2. Crie uma branch (git checkout -b feature/nova-funcionalidade)
3. Commit suas mudancas (git commit -m 'feat: nova funcionalidade')
4. Push para a branch (git push origin feature/nova-funcionalidade)
5. Abra um Pull Request

## Licenca

Este projeto esta sob a licenca **MIT**. Veja [LICENSE](LICENSE) para mais detalhes.

## Suporte

- **Email**: suporte@pam.com
- **Issues**: [GitHub Issues](https://github.com/EmmanuelSMenezes/PAM_AdminWeb/issues)

---

<div align="center">

**PAM - Plataforma de Agendamento de Manutencao**  
*Desenvolvido com amor pela equipe PAM*

</div>