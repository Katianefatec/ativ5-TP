import api from "../api";
import Atualizador from "./atualizador"

class AtualizadorServico implements Atualizador {
    atualizar(id: string, objeto: Object): void {
        api.put(`/servico/atualizar/${id}`, objeto)
            .then(response => {
                console.log('Serviço atualizado com sucesso');
            })
            .catch(error => {
                console.error('Erro ao atualizar serviço:', error);
            });
    }
}
export default AtualizadorServico;