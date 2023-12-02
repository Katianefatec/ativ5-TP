import { URI } from "../enuns/uri";
import Cadastrador from "./cadastrador";
import api from '../api';

interface Compra {
    clienteId: number;
    produtoId: number;
    servicoId: number;
    quantidade: number;
}

class CadastradorCompra {
    async cadastrar(compra: { clienteId: number, produtoId: number | null, servicoId: number | null, quantidade: number }) {
        try {
            await api.post(URI.CRIAR_COMPRA.replace(':id', compra.clienteId.toString()), compra)
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

export default CadastradorCompra;