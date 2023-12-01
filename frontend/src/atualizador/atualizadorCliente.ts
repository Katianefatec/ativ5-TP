
import api from "../api";
import Atualizador from "./atualizador"

class AtualizadorCliente implements Atualizador {
    atualizar(id: string, objeto: Object): void {
        api.put(`/cliente/atualizar/${id}`, objeto)
            .then(response => {
                console.log('Cliente atualizado com sucesso');
            })
            .catch(error => {
                console.error('Erro ao atualizar cliente:', error);
            });
    }
}
export default AtualizadorCliente;