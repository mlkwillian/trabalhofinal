import { read } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function verificarLogs() {
    try {
        console.log('=== Verificando logs mais recentes ===\n');
        
        // Buscar os últimos 5 logs
        const logs = await read('logs', null);
        
        // Ordenar por data_hora (mais recente primeiro) e pegar os últimos 5
        const logsOrdenados = logs
            .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
            .slice(0, 5);
        
        console.log(`Total de logs no banco: ${logs.length}`);
        console.log(`Mostrando os últimos 5 logs:\n`);
        
        logsOrdenados.forEach((log, index) => {
            console.log(`--- Log ${index + 1} (ID: ${log.id}) ---`);
            console.log(`Data/Hora: ${log.data_hora}`);
            console.log(`Método: ${log.metodo}`);
            console.log(`Rota: ${log.rota}`);
            console.log(`Status Code: ${log.status_code}`);
            console.log(`Tempo de Resposta: ${log.tempo_resposta_ms}ms`);
            console.log(`Usuário ID: ${log.usuario_id || 'Anônimo'}`);
            console.log(`IP: ${log.ip_address || 'N/A'}`);
            if (log.dados_requisicao) {
                console.log(`Dados da Requisição:`, JSON.stringify(log.dados_requisicao, null, 2));
            }
            if (log.dados_resposta) {
                console.log(`Dados da Resposta:`, JSON.stringify(log.dados_resposta, null, 2));
            }
            console.log('');
        });
        
        // Buscar especificamente o log da última requisição POST /api/produtos
        const logsProdutos = logs.filter(log => 
            log.rota === '/api/produtos' && log.metodo === 'POST'
        ).sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
        
        if (logsProdutos.length > 0) {
            console.log('=== Última criação de produto ===');
            const ultimoLogProduto = logsProdutos[0];
            console.log(`ID do Log: ${ultimoLogProduto.id}`);
            console.log(`Data/Hora: ${ultimoLogProduto.data_hora}`);
            console.log(`Status Code: ${ultimoLogProduto.status_code}`);
            console.log(`Tempo de Resposta: ${ultimoLogProduto.tempo_resposta_ms}ms`);
            console.log(`Usuário ID: ${ultimoLogProduto.usuario_id ? ultimoLogProduto.usuario_id : 'NULL (Anônimo - não capturado)'}`);
            if (ultimoLogProduto.usuario_id) {
                console.log(`✅ USUÁRIO REGISTRADO COM SUCESSO!`);
            } else {
                console.log(`❌ USUÁRIO NÃO FOI REGISTRADO!`);
            }
            if (ultimoLogProduto.dados_requisicao) {
                console.log(`Body da Requisição:`, JSON.stringify(ultimoLogProduto.dados_requisicao.body, null, 2));
            }
        }
        
    } catch (error) {
        console.error('Erro ao verificar logs:', error);
    }
    
    process.exit(0);
}

verificarLogs();

