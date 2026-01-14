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

6. **Deploy**:
   - Após configurar, faça commit e push para GitHub.
   - O Vercel fará o deploy automaticamente.

Agora, tutoriais e setores criados pelos admins serão sincronizados em tempo real em todos os dispositivos!