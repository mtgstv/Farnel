/*
 * Reduz uma imagem enviada pelo usuário e devolve como texto (data URL),
 * para caber no localStorage, que tem limite de cerca de 5 MB no total.
 */
export function comprimirImagem(arquivo, ladoMaximo = 800, qualidade = 0.7) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(arquivo);
        const imagem = new Image();

        imagem.onload = () => {
            const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(imagem.width * escala);
            canvas.height = Math.round(imagem.height * escala);
            canvas.getContext("2d").drawImage(imagem, 0, 0, canvas.width, canvas.height);

            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", qualidade));
        };

        imagem.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Não foi possível ler a imagem."));
        };

        imagem.src = url;
    });
}
