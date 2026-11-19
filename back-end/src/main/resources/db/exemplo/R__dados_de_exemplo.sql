-- Dados de exemplo para desenvolvimento. Só entram no perfil dev (spring.flyway.locations em application-dev.properties).
-- Arquivo "repetível" do Flyway (R__): roda depois das migrations V1, V2... e de novo sempre que este arquivo mudar.
-- As 30 doações são as mesmas do front-end (front-end/src/data/content.js), com as fotos em
-- front-end/public/images/doacoes/.

-- Conta dona das doações de exemplo, para elas poderem ser favoritadas e, depois, solicitadas.
-- Só existe no banco local de desenvolvimento. Para entrar com ela: e-mail exemplos@farnel.dev, senha exemplos-farnel.
INSERT INTO usuario (nome, email, senha_hash)
VALUES ('Doações de exemplo do Farnel', 'exemplos@farnel.dev', '$2a$10$8p3edGuHubqyCDrbqlZDGeWUoaTyPNoCFB3fTP.NL.BHKszDgy37e')
ON CONFLICT (email) DO NOTHING;

-- Recomeça as doações de exemplo (os alergênicos saem junto, pelo ON DELETE CASCADE)
DELETE FROM doacao WHERE usuario_id = (SELECT id FROM usuario WHERE email = 'exemplos@farnel.dev');

-- Validade e data de cadastro contadas a partir do dia em que este arquivo roda,
-- para os exemplos não vencerem todos com o tempo (dias negativos = já vencida)
INSERT INTO doacao (usuario_id, titulo, categoria, descricao, quantidade, unidade, validade, conservacao, cidade, uf,
                    endereco, tipo_retirada, horario, observacoes, doador, contato, imagem, status, criado_em)
SELECT u.id, d.titulo, d.categoria, d.descricao, d.quantidade, d.unidade, CURRENT_DATE + d.dias_validade, d.conservacao,
       d.cidade, d.uf, d.endereco, d.tipo_retirada, d.horario, d.observacoes, d.doador, d.contato, d.imagem, d.status,
       now() - make_interval(days => d.dias_desde_cadastro)
FROM usuario u,
(VALUES
    ('Arroz Integral em Pacotes', 'GRAOS', 'Pacotes de 5 kg de arroz integral, lacrados e dentro da validade. Sobra de estoque de fim de mês.', 40, 'pacotes', 120, 'TEMPERATURA_AMBIENTE', 'São Paulo', 'SP', 'Rua da Mooca, 1200 - Mooca', 'RETIRADA_NO_LOCAL', 'Seg. a sáb., das 8h às 18h', 'Retirada pela doca de carga, nos fundos do mercado.', 'Mercado Bom Preço', '(11) 99999-1001', '/images/doacoes/arroz-integral.jpg', 'DISPONIVEL', 3),
    ('Feijão Carioca', 'GRAOS', 'Sacas de feijão carioca tipo 1, colhidas na última safra e bem armazenadas.', 150, 'kg', 90, 'TEMPERATURA_AMBIENTE', 'Belo Horizonte', 'MG', 'Av. do Contorno, 4500 - Funcionários', 'A_COMBINAR', 'Combinar pelo WhatsApp', 'Já existe uma instituição interessada; aguardando confirmação da retirada.', 'Cooperativa Grão de Minas', '(31) 99999-1002', '/images/doacoes/feijao-carioca.jpg', 'SOLICITADA', 6),
    ('Lentilha e Grão-de-Bico', 'GRAOS', 'Pacotes de 500 g de lentilha e grão-de-bico de um lote que saiu de linha.', 80, 'pacotes', 200, 'TEMPERATURA_AMBIENTE', 'Curitiba', 'PR', 'Rua XV de Novembro, 300 - Centro', 'ENTREGA_PELO_DOADOR', NULL, 'Entregue à Cozinha Solidária Boqueirão.', 'Empório Natural Paraná', '(41) 99999-1003', '/images/doacoes/grao-de-bico.jpg', 'CONCLUIDA', 25),
    ('Cestas de Banana Prata', 'FRUTAS', 'Bananas prata maduras, ótimas para consumo imediato ou para vitaminas e doces.', 80, 'kg', 4, 'TEMPERATURA_AMBIENTE', 'Campinas', 'SP', 'Ceasa Campinas - Pavilhão 3, box 12', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 6h às 12h', 'Levar caixas ou sacolas resistentes.', 'Frutaria Central', '(19) 99999-1004', '/images/doacoes/bananas.jpg', 'DISPONIVEL', 1),
    ('Mangas Palmer', 'FRUTAS', 'Caixas de manga palmer com pequenas marcas na casca, mas ótimas por dentro.', 12, 'caixas', -3, 'TEMPERATURA_AMBIENTE', 'Recife', 'PE', 'Rua Imperial, 850 - São José', 'RETIRADA_NO_LOCAL', 'Todos os dias, das 7h às 15h', NULL, 'Hortifruti Capibaribe', '(81) 99999-1005', '/images/doacoes/mangas.jpg', 'DISPONIVEL', 10),
    ('Laranjas Pera para Suco', 'FRUTAS', 'Laranjas pera de calibre pequeno, fora do padrão de venda, excelentes para suco.', 200, 'kg', 10, 'TEMPERATURA_AMBIENTE', 'Limeira', 'SP', 'Estrada Municipal LIM-040, km 6', 'RETIRADA_NO_LOCAL', 'Sábados, das 7h às 11h', 'Doação cancelada: o lote foi vendido para uma indústria de sucos.', 'Sítio Laranjal', '(19) 99999-1006', '/images/doacoes/laranjas.jpg', 'CANCELADA', 4),
    ('Alface Crespa e Rúcula', 'VERDURAS', 'Maços de alface crespa e rúcula orgânicas colhidas hoje de manhã.', 60, 'maços', 2, 'REFRIGERADO', 'Cotia', 'SP', 'Estrada do Morro Grande, 2100', 'RETIRADA_NO_LOCAL', 'Hoje e amanhã, das 8h às 16h', 'Retirar o quanto antes: as folhas murcham rápido.', 'Horta Verde Orgânicos', '(11) 99999-1007', '/images/doacoes/alface.jpg', 'DISPONIVEL', 0),
    ('Couve e Espinafre', 'VERDURAS', 'Maços de couve-manteiga e espinafre, já higienizados e embalados.', 35, 'maços', -1, 'REFRIGERADO', 'Rio de Janeiro', 'RJ', 'Rua Uruguaiana, 90 - Centro', 'A_COMBINAR', NULL, 'A instituição que solicitou não conseguiu retirar a tempo.', 'Sacolão Carioca', '(21) 99999-1008', '/images/doacoes/couve-espinafre.jpg', 'SOLICITADA', 5),
    ('Batata e Cenoura', 'LEGUMES', 'Sacos mistos de batata inglesa e cenoura, fora do padrão de tamanho para venda.', 120, 'kg', 15, 'TEMPERATURA_AMBIENTE', 'Porto Alegre', 'RS', 'Av. Fernando Ferrari, 1001 - Anchieta', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 5h às 11h', 'Necessário veículo para transporte.', 'Distribuidora Gaúcha de Legumes', '(51) 99999-1009', '/images/doacoes/batatas.jpg', 'DISPONIVEL', 2),
    ('Abóbora Cabotiá', 'LEGUMES', 'Abóboras cabotiá inteiras, firmes e sem cortes.', 300, 'kg', 20, 'TEMPERATURA_AMBIENTE', 'Goiânia', 'GO', 'Rodovia GO-060, km 3', 'ENTREGA_PELO_DOADOR', NULL, 'Entregue ao Restaurante Popular do Setor Leste.', 'Fazenda Três Irmãos', '(62) 99999-1010', '/images/doacoes/aboboras.jpg', 'CONCLUIDA', 18),
    ('Sardinha em Lata', 'ENLATADOS', 'Latas de sardinha em óleo com a embalagem levemente amassada, sem vazamentos.', 240, 'latas', 400, 'TEMPERATURA_AMBIENTE', 'Salvador', 'BA', 'Av. Tancredo Neves, 2500 - Caminho das Árvores', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 9h às 17h', 'Solicitada pela ONG Mesa Farta; retirada marcada para a próxima semana.', 'Atacado Bahia Sul', '(71) 99999-1011', '/images/doacoes/sardinha.jpg', 'SOLICITADA', 8),
    ('Milho e Ervilha em Conserva', 'ENLATADOS', 'Latas de milho verde e ervilha em conserva, dentro da validade.', 180, 'latas', 300, 'TEMPERATURA_AMBIENTE', 'Fortaleza', 'CE', 'Rua Barão do Rio Branco, 1500 - Centro', 'RETIRADA_NO_LOCAL', 'Seg. a sáb., das 8h às 17h', NULL, 'Supermercado Litoral', '(85) 99999-1012', '/images/doacoes/ervilhas.jpg', 'DISPONIVEL', 2),
    ('Macarrão Tipo Espaguete', 'MASSAS', 'Pacotes de 500 g de espaguete de sêmola, com a embalagem de uma promoção antiga.', 60, 'pacotes', 180, 'TEMPERATURA_AMBIENTE', 'São Paulo', 'SP', 'Rua Augusta, 2000 - Consolação', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 10h às 19h', NULL, 'Cantina Nonna Rosa', '(11) 99999-1013', '/images/doacoes/espaguete.jpg', 'DISPONIVEL', 7),
    ('Lasanhas Congeladas', 'MASSAS', 'Lasanhas à bolonhesa de 1 kg, congeladas e lacradas.', 30, 'unidades', 30, 'CONGELADO', 'Campinas', 'SP', 'Av. Norte-Sul, 800 - Cambuí', 'A_COMBINAR', NULL, 'Doação cancelada por falta de transporte refrigerado.', 'Congelados da Vila', '(19) 99999-1014', '/images/doacoes/lasanha.jpg', 'CANCELADA', 9),
    ('Sucos de Caixinha', 'BEBIDAS', 'Sucos de uva e maçã em caixinhas de 200 ml, ideais para lanches escolares.', 500, 'unidades', 60, 'TEMPERATURA_AMBIENTE', 'Osasco', 'SP', 'Av. dos Autonomistas, 3000 - Vila Yara', 'ENTREGA_PELO_DOADOR', NULL, 'Solicitada por uma escola comunitária; entrega em andamento.', 'Distribuidora Refresca', '(11) 99999-1015', '/images/doacoes/suco-laranja.jpg', 'SOLICITADA', 5),
    ('Água Mineral 1,5 L', 'BEBIDAS', 'Fardos de água mineral sem gás, com 6 garrafas de 1,5 L cada.', 50, 'fardos', 365, 'TEMPERATURA_AMBIENTE', 'Brasília', 'DF', 'SIA Trecho 3, lote 500', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 8h às 17h', NULL, 'Águas do Planalto', '(61) 99999-1016', '/images/doacoes/agua-mineral.jpg', 'DISPONIVEL', 1),
    ('Leite Integral UHT', 'LATICINIOS', 'Caixas de leite integral de 1 L, embaladas em fardos de 12 unidades.', 30, 'fardos', 45, 'TEMPERATURA_AMBIENTE', 'Santo André', 'SP', 'Av. Industrial, 600 - Jardim', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 7h às 16h', 'Após aberto, manter refrigerado.', 'Laticínios Serra Azul', '(11) 99999-1017', '/images/doacoes/leite.jpg', 'DISPONIVEL', 2),
    ('Iogurtes Naturais', 'LATICINIOS', 'Potes de iogurte natural integral, mantidos sob refrigeração.', 24, 'potes', -5, 'REFRIGERADO', 'Santo André', 'SP', 'Av. Industrial, 600 - Jardim', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 7h às 16h', 'Levar bolsa térmica para a retirada.', 'Laticínios Serra Azul', '(11) 99999-1018', '/images/doacoes/iogurte.jpg', 'DISPONIVEL', 12),
    ('Queijo Minas Frescal', 'LATICINIOS', 'Peças de queijo minas frescal de 500 g, embaladas a vácuo.', 40, 'peças', 12, 'REFRIGERADO', 'Juiz de Fora', 'MG', 'Rua Halfeld, 400 - Centro', 'RETIRADA_NO_LOCAL', NULL, 'Retirado pelo Abrigo São Vicente.', 'Queijaria Mantiqueira', '(32) 99999-1019', '/images/doacoes/queijo.jpg', 'CONCLUIDA', 6),
    ('Pães Franceses do Dia', 'PADARIA', 'Pães franceses assados hoje que sobraram do movimento da tarde.', 150, 'unidades', 1, 'TEMPERATURA_AMBIENTE', 'São Paulo', 'SP', 'Rua Voluntários da Pátria, 1500 - Santana', 'RETIRADA_NO_LOCAL', 'Hoje, das 19h às 21h', 'Retirar no balcão falando com o gerente.', 'Padaria Pão Nosso', '(11) 99999-1020', '/images/doacoes/paes.jpg', 'DISPONIVEL', 0),
    ('Bolos Caseiros', 'PADARIA', 'Bolos de cenoura e de fubá inteiros, preparados para um evento que foi cancelado.', 18, 'bolos', -2, 'TEMPERATURA_AMBIENTE', 'Florianópolis', 'SC', 'Rua Felipe Schmidt, 700 - Centro', 'RETIRADA_NO_LOCAL', 'Seg. a sáb., das 7h às 19h', NULL, 'Confeitaria Ilha Doce', '(48) 99999-1021', '/images/doacoes/bolo.jpg', 'DISPONIVEL', 6),
    ('Cestas Básicas Completas', 'OUTROS', 'Cestas com arroz, feijão, óleo, açúcar, café, farinha e macarrão.', 25, 'cestas', 150, 'TEMPERATURA_AMBIENTE', 'Manaus', 'AM', 'Av. Djalma Batista, 1661 - Chapada', 'A_COMBINAR', NULL, 'Solicitada pela Associação de Moradores do Bairro da Paz.', 'Rede Solidária Amazonas', '(92) 99999-1022', '/images/doacoes/cesta-basica.jpg', 'SOLICITADA', 4),
    ('Ovos Caipira', 'OUTROS', 'Bandejas com 30 ovos caipira cada, de galinhas criadas soltas.', 40, 'bandejas', 18, 'REFRIGERADO', 'Campinas', 'SP', 'Estrada da Rhodia, 5000 - Barão Geraldo', 'ENTREGA_PELO_DOADOR', NULL, 'Entregue à Casa de Apoio Esperança.', 'Granja Recanto Feliz', '(19) 99999-1023', '/images/doacoes/ovos.jpg', 'CONCLUIDA', 10),
    ('Temperos e Condimentos', 'OUTROS', 'Potes de orégano, colorau, cominho e sal temperado de um lote com rótulo trocado.', 90, 'potes', 200, 'TEMPERATURA_AMBIENTE', 'Belém', 'PA', 'Travessa Padre Eutíquio, 1000 - Batista Campos', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 9h às 17h', 'Doação cancelada pelo doador: o lote receberá novos rótulos e voltará à venda.', 'Empório Ver-o-Sabor', '(91) 99999-1024', '/images/doacoes/temperos.jpg', 'CANCELADA', 15),
    ('Tomates Maduros', 'LEGUMES', 'Caixas de tomate italiano bem maduro, ótimo para molhos e conservas.', 8, 'caixas', 6, 'TEMPERATURA_AMBIENTE', 'Sorocaba', 'SP', 'Av. General Carneiro, 1500 - Vila Lucy', 'RETIRADA_NO_LOCAL', 'Seg. a sáb., das 7h às 13h', 'Os tomates estão bem maduros: ideal usar em até uma semana.', 'Sítio Boa Colheita', '(15) 99999-1025', '/images/doacoes/tomates.jpg', 'DISPONIVEL', 1),
    ('Maçãs Gala', 'FRUTAS', 'Maçãs gala de calibre pequeno, fora do padrão de venda, doces e crocantes.', 150, 'kg', 20, 'REFRIGERADO', 'Caxias do Sul', 'RS', 'Rua Os Dezoito do Forte, 2200 - São Pelegrino', 'ENTREGA_PELO_DOADOR', NULL, 'O doador entrega em até 30 km de distância.', 'Pomar Serra Gaúcha', '(54) 99999-1026', '/images/doacoes/macas.jpg', 'DISPONIVEL', 2),
    ('Café em Grãos', 'BEBIDAS', 'Sacos de 1 kg de café arábica torrado em grãos, de uma torra que ficou fora do ponto de venda.', 30, 'sacos', 240, 'TEMPERATURA_AMBIENTE', 'Varginha', 'MG', 'Av. Rio Branco, 900 - Centro', 'A_COMBINAR', NULL, 'Solicitada por um restaurante popular; aguardando a retirada.', 'Torrefação Sul de Minas', '(35) 99999-1027', '/images/doacoes/cafe.jpg', 'SOLICITADA', 7),
    ('Brócolis Frescos', 'VERDURAS', 'Maços de brócolis ninja colhidos ontem, firmes e bem verdes.', 45, 'maços', 3, 'REFRIGERADO', 'Mogi das Cruzes', 'SP', 'Estrada do Taboão, 3000 - Taboão', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 6h às 14h', 'Levar caixas térmicas: o brócolis precisa ficar refrigerado.', 'Cinturão Verde Hortaliças', '(11) 99999-1028', '/images/doacoes/brocolis.jpg', 'DISPONIVEL', 0),
    ('Biscoitos Caseiros', 'PADARIA', 'Pacotes de biscoitos amanteigados feitos para uma feira que foi adiada.', 80, 'pacotes', 40, 'TEMPERATURA_AMBIENTE', 'Curitiba', 'PR', 'Rua Mateus Leme, 1800 - São Francisco', 'RETIRADA_NO_LOCAL', NULL, 'Retirado pela Associação Crescer Juntos.', 'Doceria Vó Lurdes', '(41) 99999-1029', '/images/doacoes/biscoitos.jpg', 'CONCLUIDA', 12),
    ('Pimentões Coloridos', 'LEGUMES', 'Pimentões vermelhos, amarelos e verdes que sobraram da feira de sábado.', 25, 'kg', -2, 'REFRIGERADO', 'Ribeirão Preto', 'SP', 'Rua São Sebastião, 700 - Centro', 'RETIRADA_NO_LOCAL', 'Seg. a sex., das 8h às 12h', NULL, 'Feira Livre do Centro', '(16) 99999-1030', '/images/doacoes/pimentoes.jpg', 'DISPONIVEL', 8)
) AS d (titulo, categoria, descricao, quantidade, unidade, dias_validade, conservacao, cidade, uf, endereco, tipo_retirada,
        horario, observacoes, doador, contato, imagem, status, dias_desde_cadastro)
WHERE u.email = 'exemplos@farnel.dev';

INSERT INTO doacao_alergenico (doacao_id, alergenico)
SELECT d.id, a.alergenico
FROM doacao d
JOIN usuario u ON u.id = d.usuario_id AND u.email = 'exemplos@farnel.dev'
JOIN (VALUES
    ('Sardinha em Lata', 'FRUTOS_DO_MAR'),
    ('Macarrão Tipo Espaguete', 'GLUTEN'),
    ('Macarrão Tipo Espaguete', 'OVOS'),
    ('Lasanhas Congeladas', 'GLUTEN'),
    ('Lasanhas Congeladas', 'LACTOSE'),
    ('Lasanhas Congeladas', 'OVOS'),
    ('Leite Integral UHT', 'LACTOSE'),
    ('Iogurtes Naturais', 'LACTOSE'),
    ('Queijo Minas Frescal', 'LACTOSE'),
    ('Pães Franceses do Dia', 'GLUTEN'),
    ('Bolos Caseiros', 'GLUTEN'),
    ('Bolos Caseiros', 'OVOS'),
    ('Bolos Caseiros', 'LACTOSE'),
    ('Cestas Básicas Completas', 'GLUTEN'),
    ('Ovos Caipira', 'OVOS'),
    ('Biscoitos Caseiros', 'GLUTEN'),
    ('Biscoitos Caseiros', 'LACTOSE'),
    ('Biscoitos Caseiros', 'OVOS')
) AS a (titulo, alergenico) ON a.titulo = d.titulo;

-- Conta administradora (área /admin). Só existe no banco local: e-mail admin@farnel.dev, senha exemplos-farnel.
INSERT INTO usuario (nome, email, senha_hash, papel)
VALUES ('Administração do Farnel', 'admin@farnel.dev', '$2a$10$8p3edGuHubqyCDrbqlZDGeWUoaTyPNoCFB3fTP.NL.BHKszDgy37e', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET papel = 'ADMIN';

-- Conta que fez os pedidos de exemplo: as 6 doações "Solicitada" acima têm um pedido de verdade, e as 5 "Concluída"
-- foram recebidas por ela. Ela é a instituição de exemplo, já verificada: a "Rede Solidária Farnel".
-- Só existe no banco local de desenvolvimento. Para entrar com ela: e-mail pedidos@farnel.dev, senha exemplos-farnel.
INSERT INTO usuario (nome, email, senha_hash, perfil, organizacao, telefone, cidade, uf, sobre, verificada)
VALUES ('Pedidos de exemplo do Farnel', 'pedidos@farnel.dev', '$2a$10$8p3edGuHubqyCDrbqlZDGeWUoaTyPNoCFB3fTP.NL.BHKszDgy37e',
        'ONG_INSTITUICAO', 'Rede Solidária Farnel', '(81) 98888-2000', 'Recife', 'PE',
        'Rede de exemplo que reúne ONGs, cozinhas solidárias e escolas para receber as doações do Farnel.', true)
ON CONFLICT (email) DO UPDATE SET perfil = EXCLUDED.perfil, organizacao = EXCLUDED.organizacao,
    telefone = EXCLUDED.telefone, cidade = EXCLUDED.cidade, uf = EXCLUDED.uf, sobre = EXCLUDED.sobre,
    verificada = EXCLUDED.verificada;

-- Segunda instituição, ainda NÃO verificada: o administrador pode verificá-la em "Gerenciar instituições".
-- Só existe no banco local. Para entrar com ela: e-mail instituicao@farnel.dev, senha exemplos-farnel.
INSERT INTO usuario (nome, email, senha_hash, perfil, organizacao, telefone, cidade, uf, sobre)
VALUES ('Cozinha Comunitária Esperança', 'instituicao@farnel.dev', '$2a$10$8p3edGuHubqyCDrbqlZDGeWUoaTyPNoCFB3fTP.NL.BHKszDgy37e',
        'ONG_INSTITUICAO', 'Cozinha Comunitária Esperança', '(71) 97777-3000', 'Salvador', 'BA',
        'Servimos 300 refeições por dia para famílias do bairro de Pernambués.')
ON CONFLICT (email) DO NOTHING;

-- Pedidos já entregues: as 5 doações "Concluída" foram recebidas pela Rede Solidária
INSERT INTO solicitacao (doacao_id, solicitante_id, tipo_solicitante, nome, contato, quantidade, data_retirada, forma,
                         status, criado_em, atualizado_em)
SELECT d.id, quem_pediu.id, p.tipo, p.nome, p.contato, p.quantidade, CURRENT_DATE - p.dias_desde_retirada, p.forma,
       'CONCLUIDA', now() - make_interval(days => p.dias_desde_pedido), now() - make_interval(days => p.dias_desde_retirada)
FROM (VALUES
    ('Lentilha e Grão-de-Bico', 'COZINHA_SOLIDARIA', 'Cozinha Solidária Boqueirão', '(41) 98888-3001', '80 pacotes (tudo)', 20, 'RETIRAR_NO_LOCAL', 24),
    ('Abóbora Cabotiá', 'COZINHA_SOLIDARIA', 'Restaurante Popular do Setor Leste', '(62) 98888-3002', '300 kg (tudo)', 14, 'PRECISA_ENTREGA', 17),
    ('Queijo Minas Frescal', 'ONG_INSTITUICAO', 'Abrigo São Vicente', '(31) 98888-3003', '40 peças', 3, 'RETIRAR_NO_LOCAL', 5),
    ('Ovos Caipira', 'ONG_INSTITUICAO', 'Casa de Apoio Esperança', '(19) 98888-3004', '40 bandejas', 6, 'RETIRAR_NO_LOCAL', 9),
    ('Biscoitos Caseiros', 'ONG_INSTITUICAO', 'Associação Crescer Juntos', '(11) 98888-3005', '80 pacotes', 8, 'A_COMBINAR', 11)
) AS p (titulo, tipo, nome, contato, quantidade, dias_desde_retirada, forma, dias_desde_pedido)
JOIN doacao d ON d.titulo = p.titulo
JOIN usuario dono ON dono.id = d.usuario_id AND dono.email = 'exemplos@farnel.dev'
JOIN usuario quem_pediu ON quem_pediu.email = 'pedidos@farnel.dev';

-- Os pedidos antigos saíram junto com as doações de exemplo (ON DELETE CASCADE); aqui entram de novo
INSERT INTO solicitacao (doacao_id, solicitante_id, tipo_solicitante, nome, contato, quantidade, data_retirada, horario,
                         forma, mensagem, status, criado_em)
SELECT d.id, quem_pediu.id, p.tipo, p.nome, p.contato, p.quantidade, CURRENT_DATE + p.dias_ate_retirada, p.horario,
       p.forma, p.mensagem, p.status, now() - make_interval(days => p.dias_desde_pedido)
FROM (VALUES
    ('Feijão Carioca', 'ONG_INSTITUICAO', 'Instituição Mãos que Alimentam', '(31) 98888-2001', '150 kg (tudo)', 3,
     'Manhã, das 8h às 11h', 'A_COMBINAR', 'Atendemos 80 famílias no bairro e podemos buscar com o nosso carro.', 'PENDENTE', 1),
    ('Couve e Espinafre', 'COZINHA_SOLIDARIA', 'Cozinha Comunitária Vila Nova', '(21) 98888-2002', '35 maços', -2,
     NULL, 'RETIRAR_NO_LOCAL', 'As verduras vão para o almoço comunitário de sábado.', 'ACEITA', 4),
    ('Sardinha em Lata', 'ONG_INSTITUICAO', 'ONG Mesa Farta', '(71) 98888-2003', '240 latas', 7,
     'Tarde, a partir das 14h', 'RETIRAR_NO_LOCAL', 'Vamos buscar com a van da ONG.', 'ACEITA', 6),
    ('Sucos de Caixinha', 'ESCOLA_CRECHE', 'Escola Comunitária Pequeno Saber', '(11) 98888-2004', '500 unidades', 2,
     'Manhã', 'PRECISA_ENTREGA', 'Os sucos vão para o lanche das crianças.', 'ACEITA', 3),
    ('Cestas Básicas Completas', 'ONG_INSTITUICAO', 'Associação de Moradores do Bairro da Paz', '(92) 98888-2005', '25 cestas', 5,
     NULL, 'A_COMBINAR', 'Temos uma lista de famílias cadastradas esperando as cestas.', 'PENDENTE', 2),
    ('Café em Grãos', 'COZINHA_SOLIDARIA', 'Restaurante Popular Centro', '(35) 98888-2006', '30 sacos', 4,
     'Seg. a sex., das 9h às 16h', 'A_COMBINAR', NULL, 'PENDENTE', 1)
) AS p (titulo, tipo, nome, contato, quantidade, dias_ate_retirada, horario, forma, mensagem, status, dias_desde_pedido)
JOIN doacao d ON d.titulo = p.titulo
JOIN usuario dono ON dono.id = d.usuario_id AND dono.email = 'exemplos@farnel.dev'
JOIN usuario quem_pediu ON quem_pediu.email = 'pedidos@farnel.dev';
