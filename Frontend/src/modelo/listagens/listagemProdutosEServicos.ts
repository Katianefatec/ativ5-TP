import Entrada from "../../io/entrada";
import Cliente from "../../modelo/cliente";
import Produto from "../../modelo/produto";
import Servico from "../../modelo/servico";
import { clientescadastrados } from "../cliente/clientesCadastrados";
import compras from '../compra/listaCompras';
import Listagem from "../listagem";
import produtoscadastrados from "./produtosCadastrados";
import servicosCadastrados from "./servicosCadastrados";

let entrada = new Entrada();
export default class ListagemProdutos extends Listagem {
    private produto: Array<Produto>
    private servico: Array<Servico>
    private compras: Array<any>;
    
    
    
    constructor() {
        super()
        this.produto = produtoscadastrados;
        this.servico = servicosCadastrados;
        this.compras = compras; 
    }

    public getProdutos(): Produto[] {
        return this.produto;
    }  
    
    public getServicos(): Servico[] {
        return this.servico;
    }
    public adicionarProduto(produto: Produto): void {
        this.produto.push(produto);
    }
    public adicionarServico(servico: Servico): void {
        this.servico.push(servico);
    }
    public listar(): void {
        console.log(`\nLista de todos os produtos:`);
        this.produto.forEach((produto) => {
            console.log(`Nome: ${produto.nome}`);
            console.log(`Valor: ${produto.valor}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }

    public listarServicos(): void {
        console.log(`\nLista de todos os serviços:`);
        this.servico.forEach((servico) => {
            console.log(`Nome: ${servico.nome}`);
            console.log(`Valor: ${servico.valor}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }

    public listarProdutosEServicos(): void {
        this.listar();
        this.listarServicos();
    }

    public listarMaisConsumidos(): void {
        let consumoProdutosServicos = new Map<Produto | Servico, number>();
    
        this.compras.forEach(compra => {
            let produtoServico = compra.produto || compra.servico;
            let quantidade = consumoProdutosServicos.get(produtoServico) || 0;
            consumoProdutosServicos.set(produtoServico, quantidade + 1);
        });
    
        let produtosServicosOrdenados = Array.from(consumoProdutosServicos).sort((a, b) => b[1] - a[1]);
    
        console.log(`\nProdutos e serviços mais consumidos:`);
        produtosServicosOrdenados.forEach((par, index) => {
            let produtoServico = par[0];
            let quantidade = par[1];
            console.log(`${index + 1}. Produto/Serviço: ${produtoServico.nome}, Quantidade consumida: ${quantidade}`);
        });
        console.log(`\n`);
    }

    public listarProdutosEServicosMaisConsumidosPorGenero(genero: string): void {
        let contadorProdutosServicos: { [nome: string]: number } = {};
        let comprasDoGenero = compras.filter(compra => compra.cliente.genero === genero);
    
        comprasDoGenero.forEach(compra => {
            let produtoServico = compra.produto || compra.servico;
            if (produtoServico) {
                if (contadorProdutosServicos[produtoServico.nome]) {
                    contadorProdutosServicos[produtoServico.nome]++;
                } else {
                    contadorProdutosServicos[produtoServico.nome] = 1;
                }
            }
        });
    
        let produtosServicosOrdenados = Object.entries(contadorProdutosServicos).sort((a, b) => b[1] - a[1]);
    
        console.log(`\nProdutos e serviços mais consumidos por clientes do gênero ${genero}:`);
        produtosServicosOrdenados.forEach(([nome, contagem]) => {
            console.log(`Nome: ${nome}, Quantidade: ${contagem}`);
        });
    }

    public listarCompras(): void {
        console.log("Lista de Compras:");
        this.compras.forEach((compra, index) => {
            console.log(`Compra ${index + 1}:`);
            console.log(`Cliente: ${compra.cliente.nome}`);
            console.log(`Produto: ${compra.produto ? compra.produto.nome : 'Nenhum'}`);
            console.log(`Serviço: ${compra.servico ? compra.servico.nome : 'Nenhum'}`);
        });
    }
 

    public listarProdutosOrdenados() {
        let produtosOrdenados = this.getProdutos().sort((a, b) => a.nome.localeCompare(b.nome));
        produtosOrdenados.forEach((produto, index) => {
            console.log(`${index + 1}. ${produto.nome} - ${produto.valor}`);
        });
    }   
}