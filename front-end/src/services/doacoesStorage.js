import { doacoes } from "../data/content";

const CHAVE_DOACOES ="doacoes";


export function getDoacoes(){
    const dadosSalvos = localStorage.getItem(CHAVE_DOACOES);

    if (dadosSalvos) {
        return JSON.parse(dadosSalvos);
    }
    localStorage.setItem(CHAVE_DOACOES, JSON.stringify(doacoes));

    return doacoes;
}

export function saveDoacoes(doacoesAtualizadas){

    localStorage.setItem(
        CHAVE_DOACOES,
         JSON.stringify(doacoesAtualizadas)
        
    );

}