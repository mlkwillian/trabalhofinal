const db = require("../config/db");


/* listar incidentes abertos */

exports.listarIncidentes = (req, res) => {

    const query = `
    SELECT i.*, s.nome_sala
    FROM incidentes i
    JOIN salas s ON i.id_sala = s.id_sala
    WHERE i.status = 'aberto'
  `;

    db.query(query, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao buscar incidentes" });
        }

        res.json(result);

    });

};



/* resolver incidente */

exports.resolverIncidente = (req, res) => {

    const id_incidente = req.params.id;
    const { observacao, usuario_id } = req.body;
    
    if (!id_incidente || !usuario_id) {
        return res.status(400).json({ erro: "Dados obrigatórios não informados" });
    }

    const query = `
    UPDATE incidentes
    SET
      status = 'resolvido',
      data_resolucao = NOW(),
      observacao = ?,
      id_usuario = ?
    WHERE id_incidente = ?
    AND status = 'aberto'
  `;

    db.query(query, [observacao, usuario_id, id_incidente], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao resolver incidente" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Incidente não encontrado ou já resolvido" });
        }

        res.json({ mensagem: "Incidente resolvido com sucesso" });

    });

};