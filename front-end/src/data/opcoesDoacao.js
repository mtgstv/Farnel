// Opções usadas no cadastro e nos filtros de doações.

export const CATEGORIAS = [
    "Grãos",
    "Frutas",
    "Verduras",
    "Legumes",
    "Enlatados",
    "Massas",
    "Bebidas",
    "Laticínios",
    "Padaria",
    "Outros",
];

// Status que uma doação pode ter ("Vencida" é calculada pela validade).
export const STATUS_DOACAO = ["Disponível", "Solicitada", "Vencida", "Concluída", "Cancelada"];

export const UNIDADES = ["kg", "g", "litros", "unidades", "caixas", "pacotes", "cestas"];

export const CONSERVACAO = ["Temperatura ambiente", "Refrigerado", "Congelado"];

export const TIPOS_RETIRADA = [
    "Retirada no local",
    "Entrega pelo doador",
    "A combinar",
];

export const ALERGENICOS = [
    "Glúten",
    "Lactose",
    "Ovos",
    "Amendoim",
    "Castanhas",
    "Soja",
    "Frutos do mar",
];

export const ESTADOS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// ---------- Solicitações ----------

// Pendente → Aceita → Concluída (entregue); ou Recusada (pelo doador) / Cancelada (por quem pediu).
export const STATUS_SOLICITACAO = ["Pendente", "Aceita", "Concluída", "Recusada", "Cancelada"];

export const TIPOS_SOLICITANTE = [
    "Pessoa física",
    "ONG ou instituição",
    "Cozinha solidária",
    "Escola ou creche",
];

export const FORMAS_RECEBIMENTO = ["Vou retirar no local", "Preciso de entrega", "A combinar"];

// ---------- Perfil ----------

export const PERFIS_USUARIO = [
    "Pessoa física",
    "Estabelecimento comercial",
    "Produtor rural",
    "ONG ou instituição",
];
