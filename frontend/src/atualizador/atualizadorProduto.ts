import api from "../api";
import Atualizador from "./atualizador"

class AtualizadorProduto implements Atualizador {
    atualizar(id: string, objeto: Object): void {
        api.put(`/produto/atualizar/${id}`, objeto)
            .then(response => {
                console.log('Produto atualizado com sucesso');
            })
            .catch(error => {
                console.error('Erro ao atualizar produto:', error);
            });
    }
}
export default AtualizadorProduto;