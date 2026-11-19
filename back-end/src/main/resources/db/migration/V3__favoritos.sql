-- V3: doações favoritas de cada usuário (a página "Favoritos").

CREATE TABLE favorito (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT      NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    doacao_id  BIGINT      NOT NULL REFERENCES doacao (id) ON DELETE CASCADE,
    criado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- A mesma doação não entra duas vezes na lista da mesma pessoa
    UNIQUE (usuario_id, doacao_id)
);
