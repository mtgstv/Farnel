-- V4: pedidos de doação (solicitações). Quem pede escolhe uma doação disponível; o doador aceita ou recusa
-- e, depois da entrega, marca como entregue. Os códigos são os mesmos dos enums de solicitacao/OpcoesSolicitacao.java.

CREATE TABLE solicitacao (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    doacao_id        BIGINT       NOT NULL REFERENCES doacao (id) ON DELETE CASCADE,
    -- Conta que fez o pedido
    solicitante_id   BIGINT       NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    tipo_solicitante VARCHAR(20)  NOT NULL CHECK (tipo_solicitante IN ('PESSOA_FISICA', 'ONG_INSTITUICAO',
                                                                       'COZINHA_SOLIDARIA', 'ESCOLA_CRECHE')),
    nome             VARCHAR(150) NOT NULL,             -- nome de quem vai receber (pessoa ou instituição)
    contato          VARCHAR(20)  NOT NULL,             -- telefone de quem pediu (o doador vê)
    quantidade       VARCHAR(50)  NOT NULL,             -- texto livre: "10 kg", "tudo"...
    data_retirada    DATE         NOT NULL,
    horario          VARCHAR(100),
    forma            VARCHAR(20)  NOT NULL CHECK (forma IN ('RETIRAR_NO_LOCAL', 'PRECISA_ENTREGA', 'A_COMBINAR')),
    mensagem         VARCHAR(500),
    status           VARCHAR(15)  NOT NULL DEFAULT 'PENDENTE'
                                  CHECK (status IN ('PENDENTE', 'ACEITA', 'CONCLUIDA', 'RECUSADA', 'CANCELADA')),
    criado_em        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    atualizado_em    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_solicitacao_doacao ON solicitacao (doacao_id);
CREATE INDEX idx_solicitacao_solicitante ON solicitacao (solicitante_id);

-- A mesma pessoa não pode ter dois pedidos em aberto (pendente ou aceito) para a mesma doação.
-- Índice "parcial": a regra só vale para as linhas do WHERE (pedidos encerrados não contam).
CREATE UNIQUE INDEX uq_solicitacao_em_aberto ON solicitacao (doacao_id, solicitante_id)
    WHERE status IN ('PENDENTE', 'ACEITA');
