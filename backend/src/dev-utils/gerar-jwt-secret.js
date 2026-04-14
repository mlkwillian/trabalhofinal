/**
 * UTILITÁRIO PARA GERAR JWT SECRET
 * 
 * ⚠️  IMPORTANTE: Este arquivo é apenas para fins educacionais!
 * ⚠️  NÃO deve acompanhar o projeto em produção!
 * ⚠️  Use apenas para gerar uma chave secreta e adicionar ao .env
 * 
 * Como usar:
 * 1. Execute: node dev-utils/gerar-jwt-secret.js
 * 2. Copie a chave gerada
 * 3. Adicione ao arquivo .env: JWT_SECRET=sua_chave_aqui
 * 4. Delete este arquivo após usar (ou mantenha apenas para desenvolvimento)
 */

import crypto from 'crypto';

console.log('🔐 GERADOR DE JWT SECRET');
console.log('========================');
console.log('');

// Gerar uma chave secreta aleatória de 64 bytes (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ Chave JWT gerada com sucesso!');
console.log('');
console.log('📋 Copie a linha abaixo e adicione ao seu arquivo .env:');
console.log('');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('⚠️  LEMBRE-SE:');
console.log('   - Mantenha esta chave em segredo!');
console.log('   - Nunca compartilhe em repositórios públicos');
console.log('   - Use uma chave diferente para cada ambiente');
console.log('   - Este arquivo não deve ir para produção!');
console.log('');
console.log('🎯 Exemplo de uso no .env:');
console.log('JWT_SECRET=' + jwtSecret);
console.log('JWT_EXPIRES_IN=1h');
console.log('');

// Gerar também uma chave mais curta para desenvolvimento/teste
const jwtSecretDev = crypto.randomBytes(32).toString('hex');
console.log('🔧 Para desenvolvimento/teste (chave mais curta):');
console.log(`JWT_SECRET=${jwtSecretDev}`);
console.log('');

