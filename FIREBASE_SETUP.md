# Configuração do Firebase

Para usar o backend com Firebase, siga estes passos:

1. **Crie um projeto no Firebase**:
   - Acesse [Firebase Console](https://console.firebase.google.com/).
   - Clique em "Criar um projeto" ou "Add project".
   - Dê um nome (ex.: "treinamento-visual").
   - Ative o Google Analytics se quiser (opcional).

2. **Configure Firestore**:
   - No painel do projeto, vá para "Firestore Database".
   - Clique em "Criar banco de dados".
   - Escolha "Iniciar no modo de teste" (para desenvolvimento; depois configure regras de segurança).
   - Selecione uma localização (ex.: us-central).

3. **Obtenha as configurações**:
   - Vá para "Configurações do projeto" (ícone de engrenagem).
   - Role para "Seus apps" e clique em "Adicionar app" > Web (</>).
   - Registre o app com um nome.
   - Copie o objeto `firebaseConfig` (apiKey, authDomain, etc.).

4. **Atualize o código**:
   - Abra `src/lib/firebase.ts`.
   - Substitua o `firebaseConfig` com os valores copiados do Firebase.

5. **Regras de segurança no Firestore** (importante para produção):
   - No painel Firestore, vá para "Regras".
   - Configure regras básicas para permitir leitura/escrita (exemplo para desenvolvimento):
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true; // Apenas para desenvolvimento
         }
       }
     }
     ```
   - Para produção, restrinja acesso (ex.: apenas usuários autenticados).

6. **Configure no Vercel** (se estiver fazendo deploy lá):
   - No painel do Vercel, vá para seu projeto > "Settings" > "Environment Variables".
   - Adicione as seguintes variáveis (use os valores do Firebase):
     - `VITE_FIREBASE_API_KEY`: Seu apiKey
     - `VITE_FIREBASE_AUTH_DOMAIN`: Seu authDomain
     - `VITE_FIREBASE_PROJECT_ID`: Seu projectId
     - `VITE_FIREBASE_STORAGE_BUCKET`: Seu storageBucket
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Seu messagingSenderId
     - `VITE_FIREBASE_APP_ID`: Seu appId
   - Re-deploy o projeto no Vercel.

7. **Deploy**:
   - Após configurar, faça commit e push para GitHub.
   - O Vercel fará o deploy automaticamente.

Agora, tutoriais e setores criados pelos admins serão sincronizados em tempo real em todos os dispositivos!