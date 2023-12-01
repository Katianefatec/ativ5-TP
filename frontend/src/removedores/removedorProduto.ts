import Produto from "../modelo/produto";
import RemovedorRemoto from "./removedorRemoto";
import { URI } from "../enuns/uri";

export default class RemovedorProduto implements RemovedorRemoto {
    public remover(produto: Produto): Promise<Response> {
        return fetch(`${URI.DELETAR_PRODUTO}/${produto.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
  }