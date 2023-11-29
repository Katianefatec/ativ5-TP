import Produto from "../../modelo/produto";
import produtoscadastrados from "./produtosCadastrados";

export default class CadastroProdutos {
    private produto: Array<Produto>;

    constructor() {
        
        this.produto = produtoscadastrados;
        
    }

    public adicionarProduto(produto: Produto): void {
        this.produto.push(produto);
    }

    public atualizarProduto(nomeProduto: string, novoNome: string, novoValor: number): void {
        let produto = this.produto.find(p => p.nome === nomeProduto);
        if (produto) {
            produto.atualizarProduto(novoNome, novoValor);
        }
    }

    public deletarProduto(nomeProduto: string): void {
        let produtoIndex = this.produto.findIndex(p => p.nome === nomeProduto);
        if (produtoIndex !== -1) {
            this.produto.splice(produtoIndex, 1);
        }
    }

    public getProdutos(): Array<Produto> {
        return this.produto;
    }
}