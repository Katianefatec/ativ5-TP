import { URI } from "../enuns/uri";
import Buscador from "./buscador";

export default class BuscadorServicos implements Buscador {
    public async buscar() {
        let json = await fetch(URI.BUSCAR_SERVICOS).then(resposta => resposta.json())
        return json
    }

    public async buscarPeloID(id: any) {
        return fetch(`${URI.BUSCAR_SERVICO_PELO_ID}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(resposta => resposta.json())
    }
}