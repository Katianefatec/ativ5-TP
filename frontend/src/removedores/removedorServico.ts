import RemovedorRemoto from "./removedorRemoto";
import { URI } from "../enuns/uri";
import Servico from "../modelo/servico";


export default class RemovedorServico implements RemovedorRemoto {
    public remover(servico: Servico): Promise<Response> {
        return fetch(`${URI.DELETAR_SERVICO}/${servico.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
  }