import bcrypt from 'bcryptjs';

// Gerar hash para a senha "123456"
const senha = '123456';
const hash = await bcrypt.hash(senha, 10);

console.log('Hash gerado para a senha "123456":');
console.log(hash);

// Verificar se o hash funciona
const isValid = await bcrypt.compare(senha, hash);
console.log('\nVerificacao do hash:');
console.log('Senha "123456" corresponde ao hash?', isValid);

