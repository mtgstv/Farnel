-- V2: doações de alimentos.
-- As opções fixas (categoria, conservação, retirada, status e alergênico) ficam guardadas como códigos sem acento
-- (GRAOS, TEMPERATURA_AMBIENTE...), iguais aos enums do Java (doacao/OpcoesDoacao.java). A API devolve o texto
-- que aparece na tela ("Grãos", "Temperatura ambiente").

CREATE TABLE doacao (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Conta que cadastrou a doação: só ela pode alterar o status
    usuario_id    BIGINT        NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    titulo        VARCHAR(100)  NOT NULL,
    categoria     VARCHAR(20)   NOT NULL CHECK (categoria IN ('GRAOS', 'FRUTAS', 'VERDURAS', 'LEGUMES', 'ENLATADOS',
                                                             'MASSAS', 'BEBIDAS', 'LATICINIOS', 'PADARIA', 'OUTROS')),
    descricao     VARCHAR(1000) NOT NULL,
    quantidade    NUMERIC(10, 2) NOT NULL CHECK (quantidade > 0),
    unidade       VARCHAR(20)   NOT NULL,                  -- kg, pacotes, caixas... (texto livre)
    validade      DATE          NOT NULL,
    conservacao   VARCHAR(25)   NOT NULL CHECK (conservacao IN ('TEMPERATURA_AMBIENTE', 'REFRIGERADO', 'CONGELADO')),
    cidade        VARCHAR(100)  NOT NULL,
    uf            VARCHAR(2)    NOT NULL,
    endereco      VARCHAR(200),                            -- obrigatório só na retirada no local (regra no DoacaoService)
    tipo_retirada VARCHAR(25)   NOT NULL CHECK (tipo_retirada IN ('RETIRADA_NO_LOCAL', 'ENTREGA_PELO_DOADOR', 'A_COMBINAR')),
    horario       VARCHAR(100),
    observacoes   VARCHAR(500),
    doador        VARCHAR(150)  NOT NULL,                  -- nome mostrado: a pessoa ou o estabelecimento
    contato       VARCHAR(20)   NOT NULL,                  -- telefone/WhatsApp (a API só mostra para quem está logado)
    imagem        TEXT,                                    -- endereço da foto ou a própria foto em base64 (data URL)
    -- "Vencida" não é guardado: é calculado pela validade (ver Doacao.estaVencida)
    status        VARCHAR(15)   NOT NULL DEFAULT 'DISPONIVEL'
                                CHECK (status IN ('DISPONIVEL', 'SOLICITADA', 'CONCLUIDA', 'CANCELADA')),
    criado_em     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_doacao_usuario ON doacao (usuario_id);

-- Alergênicos de cada doação: uma doação pode ter vários (ou nenhum)
CREATE TABLE doacao_alergenico (
    doacao_id  BIGINT      NOT NULL REFERENCES doacao (id) ON DELETE CASCADE,
    alergenico VARCHAR(15) NOT NULL CHECK (alergenico IN ('GLUTEN', 'LACTOSE', 'OVOS', 'AMENDOIM', 'CASTANHAS', 'SOJA',
                                                          'FRUTOS_DO_MAR')),
    PRIMARY KEY (doacao_id, alergenico)
);
