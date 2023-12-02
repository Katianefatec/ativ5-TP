import { URI } from "../enuns/uri";
import { Cliente } from '../modelo/cliente'; // Importe a interface Cliente
import RemovedorRemoto from "./removedorRemoto";

export default class RemovedorCliente implements RemovedorRemoto {
  public remover(cliente: Cliente): Promise<Response> {
      return fetch(`${URI.DELETAR_CLIENTE}/${cliente.id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      });
  }
}