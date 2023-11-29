import Entrada from "../../io/entrada";
import Compra from "../../modelo/compra";
import Produto from "../../modelo/produto";

export default class RegistroCompras {
    private clientesCadastrados;
    private produtosCadastrados;
    private servicosCadastrados;
    private compras;

    constructor(clientesCadastrados, produtosCadastrados, servicosCadastrados, compras) {
        this.clientesCadastrados = clientesCadastrados;
        this.produtosCadastrados = produtosCadastrados;
        this.servicosCadastrados = servicosCadastrados;
        this.compras = compras;
    }

    public registrarCompra() {
        console.log("Registro de compra:");
        console.log("Clientes:");
        this.clientesCadastrados.forEach((cliente, index) => {
            console.log(`${index + 1}. ${cliente.nome}`);
        });

        let entrada = new Entrada();
        let nomeCliente = entrada.receberTexto("Digite o nome do cliente:");
        let cliente = this.clientesCadastrados.find(c => c.nome === nomeCliente);

        if (!cliente) {
            console.log("Cliente não encontrado.");
            return;
        }

        console.log("Produtos:");
        this.produtosCadastrados.forEach((produto, index) => {
            console.log(`${index + 1}. ${produto.nome}`);
        });

        console.log("Serviços:");
        this.servicosCadastrados.forEach((servico, index) => {
            console.log(`${index + 1}. ${servico.nome}`);
        });

        let nomeProdutoOuServico = entrada.receberTexto("Digite o nome do produto ou serviço que deseja comprar:");
        let produto = this.produtosCadastrados.find(p => p.nome === nomeProdutoOuServico);
        let servico = this.servicosCadastrados.find(s => s.nome === nomeProdutoOuServico);

        if (!produto && !servico) {
            console.log("Produto ou serviço não encontrado.");
            return;
        }

        let novaCompra = new Compra(cliente, produto, servico);
        novaCompra.registrarCompra();
        this.compras.push(novaCompra);
        console.log("Compra registrada com sucesso!");
    }

    public listarCompras() {
        console.log("Listagem de compras:");
        this.compras.forEach((compra, index) => {
            console.log(`Compra ${index + 1}:`);
            console.log(`Cliente: ${compra.cliente.nome}`);
            if (compra.produto) {
                console.log(`Produto: ${compra.produto.nome}`);
            }
            if (compra.servico) {
                console.log(`Serviço: ${compra.servico.nome}`);
            }
        });
    }
}
