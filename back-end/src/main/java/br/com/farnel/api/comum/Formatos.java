package br.com.farnel.api.comum;

// Formatos (expressões regulares) usados nas validações de doações, pedidos e perfil.
// São constantes para poderem ser usadas dentro das anotações, como @Pattern(regexp = Formatos.TELEFONE).
public final class Formatos {

	private Formatos() {
	}

	// Telefone com DDD: 10 ou 11 números, com ou sem a máscara (11) 99999-9999
	public static final String TELEFONE = "\\D*(\\d\\D*){10,11}";

	// Siglas dos estados
	public static final String UF = "AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO";

	// Foto já reduzida pelo front (services/imagem.js), enviada como data URL em base64
	public static final String FOTO = "data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+";
}
