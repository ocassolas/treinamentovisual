# Treinamento Visual

Sistema de treinamento visual para empresas, com sincronização multiplataforma via Firebase.

## Funcionalidades
- Gerenciamento de setores e tutoriais por admins.
- Visualização de tutoriais por usuários.
- Sincronização em tempo real entre dispositivos.
- Interface responsiva para desktop e mobile.

## Configuração do Backend
Para habilitar a sincronização, configure o Firebase seguindo as instruções em [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## Desenvolvimento Local
1. Clone o repositório.
2. Instale dependências: `npm install`.
3. Configure Firebase (veja FIREBASE_SETUP.md).
4. Execute: `npm run dev`.
5. Acesse `http://localhost:8080`.

## Deploy
- O projeto é compatível com Vercel.
- Configure o Firebase antes do deploy.
- Veja o passo a passo em FIREBASE_SETUP.md.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edite um arquivo diretamente no GitHub**

- Navegue até o(s) arquivo(s) desejado(s).

- Clique no botão "Editar" (ícone de lápis) no canto superior direito da visualização do arquivo.

- Faça as alterações e confirme-as.

**Use o GitHub Codespaces**

- Navegue até a página principal do seu repositório.

- Clique no botão "Código" (botão verde) próximo ao canto superior direito.

- Selecione a aba "Codespaces".

- Clique em "Novo codespace" para iniciar um novo ambiente Codespace.

- Edite os arquivos diretamente no Codespace e confirme e envie suas alterações quando terminar.

## Quais tecnologias são usadas neste projeto?

Este projeto foi desenvolvido com:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

