-- V6: instituições verificadas.
-- Instituição é a conta que marca "ONG ou instituição" no perfil (usuario.perfil = 'ONG_INSTITUICAO').
-- O administrador confere os dados e marca como verificada; só as verificadas aparecem na lista pública.
ALTER TABLE usuario ADD COLUMN verificada BOOLEAN NOT NULL DEFAULT false;
