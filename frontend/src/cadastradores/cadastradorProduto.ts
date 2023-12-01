import { URI } from "../enuns/uri";
import Cadastrador from "./cadastrador";
import api from '../api';

class CadastradorProduto implements Cadastrador {
    async cadastrar(objeto: Object): Promise<void> {
        try {
            await api.post(URI.CADASTRAR_PRODUTO, objeto)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error('There was a problem with the axios operation: ', error);
        }
    }
}
export default CadastradorProduto;