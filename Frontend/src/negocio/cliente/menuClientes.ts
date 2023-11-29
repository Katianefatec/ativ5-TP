import Entrada from "../../io/entrada";
import compras from '../compra/listaCompras';
import CadastroCliente from "./cadastroCliente";
import { clientescadastrados as clientes } from './clientesCadastrados';
import ListagemClientes from "./listagemClientes";
   
    
    export default function menuClientes() {
        let execucaoClientes = true;
        let listagemClientes = new ListagemClientes(clientes, compras);
        let cadastro = new CadastroCliente(listagemClientes);

        while (execucaoClientes) {
            console.log(`Opções:`);
            console.log(`1 - Cadastrar cliente`);
            console.log(`2 - Atualizar cliente`);
            console.log(`3 - Deletar cliente`);
            console.log(`4 - Listar clientes`);
            console.log(`5 - Listar clientes por gênero`);
            console.log(`0 - Voltar ao menu principal`);
    
            let entrada = new Entrada()
            let opcaoClientes = entrada.receberNumero(`Por favor, escolha uma opção: `)
            let listagemClientes = new ListagemClientes(clientes, compras);
            let opcaoGenero: number;
    let     genero: string;
    
            switch (opcaoClientes) {
                case 1:
                    cadastro.cadastrar()
                    break;
                case 2:
                    cadastro.atualizarCadastro()
                                      
                    break;
                case 3:
                    cadastro.deletarCadastro()
                    break;
                
                case 4:
                    listagemClientes.listar();
                    break;

                case 5:
                    console.log(`1 - Masculino`);
                    console.log(`2 - Feminino`);
                    opcaoGenero = entrada.receberNumero(`Por favor, escolha o gênero que deseja listar: `);
                    genero = '';
                    
                    switch (opcaoGenero) {
                        case 1:
                            genero = 'Masculino';
                            break;
                        case 2:
                            genero = 'Feminino';
                            break;
                        default:
                            console.log(`Opção inválida.`);
                            break;
                    }
                    if (genero) {
                        listagemClientes.listarClientesPorGenero(genero);
                    }
                    break;


                case 0:
                    execucaoClientes = false;
                    break;
                default:
                    console.log(`Opção inválida.`);
                    break;
            }
        }
    }

    