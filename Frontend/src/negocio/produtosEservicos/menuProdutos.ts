import Entrada from "../../io/entrada";
import Produto from "../../modelo/produto";
import CadastroCliente from "../cliente/cadastroCliente";
import { clientescadastrados as clientes } from '../cliente/clientesCadastrados';
import ListagemClientes from "../cliente/listagemClientes";
import compras from '../compra/listaCompras';
import ListagemProdutos from "./listagemProdutosEServicos";
import produtoscadastrados from "./produtosCadastrados";

export default function menuProdutos() {
    let execucaoProdutos = true;
    let entrada = new Entrada();
    let listagemProdutos = new ListagemProdutos();
    let listagemClientes = new ListagemClientes(clientes, compras);
    let cadastro = new CadastroCliente(listagemClientes);
    let produto;

    while (execucaoProdutos) {
        console.log(`Opções:`);
        console.log(`1 - Cadastrar produto`);
        console.log(`2 - Atualizar produto`);
        console.log(`3 - Deletar produto`);
        console.log(`4 - Listar produtos`);
        console.log(`5 - Cadastrar serviço`);
        console.log(`6 - Atualizar serviço`);
        console.log(`7 - Deletar serviço`);
        console.log(`8 - Listar serviços`);
        console.log(`9 - Listar produtos e serviços`);
        console.log(`0 - Voltar ao menu principal`);

        let opcaoProdutos = entrada.receberNumero(`Por favor, escolha uma opção: `)

        switch (opcaoProdutos) {
            case 1:
                let nomeProduto = entrada.receberTexto(`Por favor, informe o nome do produto: `);
                let valorProduto = entrada.receberNumero(`Por favor, informe o valor do produto: `);
                listagemProdutos.adicionarProdutoMenu(nomeProduto, valorProduto);
                break;
            
            case 2:
                listagemProdutos.atualizarProdutoMenu();

                break;
            case 3:
                listagemProdutos.deletarProdutoMenu();

            case 4:
                listagemProdutos.listarProdutosOrdenados();
                break;
            
            case 5:                
                let nomeServico = entrada.receberTexto(`Por favor, informe o nome do serviço: `);
                let valorServico = entrada.receberNumero(`Por favor, informe o valor do serviço: `);
                listagemProdutos.adicionarServicoMenu(nomeServico, valorServico);
                break;
            
            case 6:
                console.log("Serviços disponíveis:");
                listagemProdutos.getServicos().forEach((produto, index) => {
                    console.log(`${index + 1}. ${produto.nome} - ${produto.valor}`);
                });
                let nomeServicoAtualizar = entrada.receberTexto(`Por favor, informe o nome do serviço que deseja atualizar: `);
                produto = listagemProdutos.getServicos().find(p => p.nome === nomeServicoAtualizar);
                if (produto) {
                    let novoNome = entrada.receberTexto(`Por favor informe o novo nome do serviço: `)
                    let novoValor = entrada.receberNumero(`Por favor informe o novo valor do serviço: `);
                    produto.atualizarProduto(novoNome, novoValor);
                } else {
                    console.log(`Serviço não encontrado.`);
                }
                break;
            
            case 7:
                console.log("Serviços disponíveis:");
                listagemProdutos.getServicos().forEach((produto, index) => {
                    console.log(`${index + 1}. ${produto.nome} - ${produto.valor}`);
                });
                let nomeServicoDeletar = entrada.receberTexto("Por favor, informe o nome do serviço que deseja deletar: ");
                let servicoIndex = listagemProdutos.getServicos().findIndex(function (p) { return p.nome === nomeServicoDeletar; });
                if (servicoIndex !== -1) {
                    listagemProdutos.getServicos().splice(servicoIndex, 1);
                    console.log("Serviço deletado com sucesso.");
                } else {
                    console.log("Serviço não encontrado.");
                }
                break;

            case 8:
                listagemProdutos.listarServicos();

            case 9:
                listagemProdutos.listarProdutosEServicos();
                break;
            case 0:
                execucaoProdutos = false;
                break;
            default:
                console.log(`Opção inválida.`);
                break;
        }
    }
}