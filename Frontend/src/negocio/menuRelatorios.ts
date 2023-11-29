import Entrada from "../io/entrada";
import { clientescadastrados as clientes } from './cliente/clientesCadastrados';
import ListagemClientes from "./cliente/listagemClientes";
import compras from './compra/listaCompras';
import ListagemProdutos from "./produtosEservicos/listagemProdutosEServicos";
import produtoscadastrados from "./produtosEservicos/produtosCadastrados";

export default function menuRelatorios() {
    let execucaoRelatorios = true;
    let listagemProdutos = new ListagemProdutos();
    let listagemClientes = new ListagemClientes(clientes, compras);
        

while (execucaoRelatorios) {
    console.log(`Opções:`);
    console.log(`1 - Listar top 10 clientes que mais consumiram produtos ou serviços`);
    console.log(`2 - Listar clientes por gênero`);
    console.log(`3 - Listar produtos e serviços mais consumidos`);
    console.log(`4 - Listar produtos e serviços mais consumidos por gênero`); 
    console.log(`5 - Listar 5 clientes que mais consumiram em valor`);  
    console.log(`6 - Listar 10 clientes que menos consumiram produtos ou serviços`);  
          
    console.log(`0 - Sair`);

    let entrada = new Entrada()
    let opcao = entrada.receberNumero(`Por favor, escolha uma opção: `)
    let opcaoGenero: number;
    let genero: string;
    
    
    

    switch (opcao) {
        case 1:
            listagemClientes.listarTop10Clientes();
            break;
        
        case 2:
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

        case 3:
            listagemProdutos.listarMaisConsumidos();
            break;   
        case 4:
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
                listagemProdutos.listarProdutosEServicosMaisConsumidosPorGenero(genero);
            }
            
            break;    
        
        case 5:
            listagemClientes.listarTop5ClientesPorValor();
            break;

        case 6:
            listagemClientes.listarMenosConsumidores();
            
            break;               
    
        case 0:
            execucaoRelatorios = false;
            break;
    }
}
}