-- V1: contas de usuário e sessões de login.
-- Regras gerais (valem também para as próximas migrations):
--   * ids são BIGINT gerados pelo próprio banco (IDENTITY)
--   * "tipos" fixos (papel, status...) são texto com CHECK, que combina com @Enumerated(EnumType.STRING) no Java
--   * datas com hora usam TIMESTAMPTZ (guarda o fuso horário)
-- Uma migration que já rodou nunca é editada: qualquer mudança no banco vira um arquivo novo (V2, V3...).

CREATE TABLE usuario (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(100) NOT NULL,              -- BCrypt, nunca a senha pura
    papel      VARCHAR(10)  NOT NULL DEFAULT 'USUARIO' CHECK (papel IN ('USUARIO', 'ADMIN')),
    criado_em  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Token que renova o login sem pedir a senha de novo (fica num cookie HttpOnly).
-- O banco guarda só o hash SHA-256: quem ler a tabela não consegue usar os tokens.
CREATE TABLE token_renovacao (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT      NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expira_em  TIMESTAMPTZ NOT NULL,
    criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_token_renovacao_usuario ON token_renovacao (usuario_id);
