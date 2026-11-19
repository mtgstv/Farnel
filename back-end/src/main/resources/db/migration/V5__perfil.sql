-- V5: dados do perfil (página "Meu perfil"). Eles também preenchem sozinhos os formulários de doação e de pedido.

ALTER TABLE usuario
    ADD COLUMN telefone                 VARCHAR(20),
    -- "Você participa como" (as instituições são as contas com ONG_INSTITUICAO)
    ADD COLUMN perfil                   VARCHAR(25) NOT NULL DEFAULT 'PESSOA_FISICA'
        CHECK (perfil IN ('PESSOA_FISICA', 'ESTABELECIMENTO_COMERCIAL', 'PRODUTOR_RURAL', 'ONG_INSTITUICAO')),
    ADD COLUMN organizacao              VARCHAR(150),     -- nome do estabelecimento ou da instituição
    ADD COLUMN sobre                    VARCHAR(300),
    ADD COLUMN cidade                   VARCHAR(100),
    ADD COLUMN uf                       VARCHAR(2),
    ADD COLUMN endereco                 VARCHAR(200),
    ADD COLUMN horario                  VARCHAR(100),
    ADD COLUMN foto                     TEXT,             -- foto de perfil já reduzida pelo front (data URL)
    ADD COLUMN aviso_novas_doacoes      BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN aviso_pedidos_recebidos  BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN aviso_lembretes_validade BOOLEAN NOT NULL DEFAULT true;

-- Categorias que mais interessam à pessoa (uma linha por categoria marcada)
CREATE TABLE usuario_interesse (
    usuario_id BIGINT      NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    categoria  VARCHAR(20) NOT NULL CHECK (categoria IN ('GRAOS', 'FRUTAS', 'VERDURAS', 'LEGUMES', 'ENLATADOS',
                                                         'MASSAS', 'BEBIDAS', 'LATICINIOS', 'PADARIA', 'OUTROS')),
    PRIMARY KEY (usuario_id, categoria)
);
