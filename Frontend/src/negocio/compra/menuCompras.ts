import Entrada from "../../io/entrada";
import compras from '../compra/listaCompras';
import RegistroCompras from "./registroCompra";

export default function menuCompras(clientesCadastrados, produtosCadastrados, servicosCadastrados) {
    let execucaoCompras = true;

    while (execucaoCompras) {
        console.log(`Opções:`);
        console.log(`1 - Registrar compra`);
        console.log(`2 - Listar compras`);
        console.log(`0 - Voltar ao menu principal`);

        let entrada = new Entrada()
        let opcaoCompras = entrada.receberNumero(`Por favor, escolha uma opção: `)
        let registroCompras = new RegistroCompras(clientesCadastrados, produtosCadastrados, servicosCadastrados, compras);

        switch (opcaoCompras) {
            case 1:    
                console.log("Registro de compra:");            
                registroCompras.registrarCompra();
                break;
            case 2:
                console.log("Listagem de compras:");
                registroCompras.listarCompras();
                break;
            case 0:
                execucaoCompras = false;
                break;
            default:
                console.log(`Opção inválida.`);
                break;
        }
    }
}
