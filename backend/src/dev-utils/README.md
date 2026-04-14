# 🛠️ Utilitários de Desenvolvimento

Esta pasta contém ferramentas auxiliares para desenvolvimento e configuração do projeto.

## ⚠️ IMPORTANTE

**Estes arquivos são apenas para fins educacionais e desenvolvimento!**
- ❌ NÃO devem acompanhar o projeto em produção
- ❌ NÃO devem ser commitados em repositórios públicos
- ✅ Use apenas para configurar o ambiente de desenvolvimento
- ✅ Delete após configurar o projeto

## 📁 Arquivos Disponíveis

### 🔐 Scripts de Configuração

#### `gerar-jwt-secret.js`
Gera uma chave secreta aleatória para JWT.

**Como usar:**
```bash
node dev-utils/gerar-jwt-secret.js
```

**O que faz:**
- Gera uma chave secreta de 64 bytes (512 bits)
- Exibe a chave no formato correto para o .env
- Fornece instruções de segurança

**Exemplo de saída:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
```

#### `gerar-hash-senha.js`
Gera um hash bcrypt para senhas, útil para criar hashes corretos nas migrations.

**Como usar:**
```bash
node dev-utils/gerar-hash-senha.js
```

**O que faz:**
- Gera um hash bcrypt válido para a senha "123456"
- Valida o hash gerado
- Exibe o hash pronto para uso em migrations SQL

**Uso:**
Útil para corrigir ou gerar hashes de senha nas migrations quando necessário atualizar credenciais.

### 📄 Formulários HTML para Teste

#### `upload-imagem.html`
Formulário simples para testar upload de imagens para produtos.

**Como usar:**
1. Abra o arquivo `upload-imagem.html` no navegador
2. Faça login usando o formulário integrado (ou cole um token JWT)
3. Informe o ID do produto
4. Selecione uma imagem (JPEG, PNG, GIF ou WebP)
5. Clique em "Enviar Imagem"

**Funcionalidades:**
- Login integrado para obter token automaticamente
- Validação de campos
- Feedback visual de sucesso/erro
- Link para visualizar imagem enviada
- Conecta com a rota `/api/produtos/upload`

**Requisitos:**
- Servidor da API rodando em `http://localhost:3000`
- Token JWT válido (obtido via login)
- Produto existente no banco de dados

#### `upload-arquivo.html`
Formulário simples para testar upload de arquivos diversos (PDF, DOC, TXT, etc.).

**Como usar:**
1. Abra o arquivo `upload-arquivo.html` no navegador
2. Faça login usando o formulário integrado (ou cole um token JWT)
3. Selecione um arquivo
4. (Opcional) Adicione uma descrição
5. Clique em "Enviar Arquivo"

**Funcionalidades:**
- Login integrado para obter token automaticamente
- Aceita diversos tipos de arquivo (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV, ZIP, RAR)
- Validação de campos
- Feedback visual de sucesso/erro

**Nota:**
Este formulário demonstra como fazer upload de arquivos. A rota `/api/arquivos/upload` pode não estar implementada na API. Este é um exemplo educacional de como implementar upload de arquivos.

## 🔐 Segurança

1. **Nunca compartilhe** as chaves geradas
2. **Use chaves diferentes** para cada ambiente (dev, test, prod)
3. **Mantenha o .env** fora do controle de versão
4. **Delete estes arquivos** após configurar o projeto
5. **Formulários HTML** são apenas para testes locais e demonstração

## 📝 Próximos Passos

### Após gerar a chave JWT:
1. Copie a chave gerada
2. Adicione ao arquivo `.env`:
   ```
   JWT_SECRET=sua_chave_aqui
   JWT_EXPIRES_IN=1h
   ```
3. Reinicie o servidor
4. Delete este arquivo (opcional, mas recomendado)

### Para usar os formulários de upload:
1. Certifique-se de que o servidor da API está rodando
2. Abra os arquivos HTML diretamente no navegador
3. Use os formulários para testar uploads
4. **Importante:** Os formulários são apenas para demonstração e testes locais

