import { URI } from "../enuns/uri";
import Cadastrador from "./cadastrador";
import axios from 'axios';
import api from '../api'; // Certifique-se de importar a instância do axios que você criou

class CadastradorCliente implements Cadastrador {
    async cadastrar(objeto: Object): Promise<void> {
        try {
            await api.post(URI.CADASTRAR_CLIENTE, objeto)
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
export default CadastradorCliente