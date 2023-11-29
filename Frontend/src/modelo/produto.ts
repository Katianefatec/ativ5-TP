export default class Produto {
    public nome: string;
    public valor: number;
    public produtosConsumidos: Array<Produto>    
    public quantidadeConsumida: number = 0;

    constructor(nome: string, valor: number) {
        this.nome = nome;
        this.valor = valor;
        this.produtosConsumidos = [];        
    }
    public atualizarProduto(novoNome: string, novoValor: number): void {
        this.nome = novoNome;
        this.valor = novoValor;
        
    }    
    public comprarProduto(): void {
        this.quantidadeConsumida++;
    }
    
    public deletarProdutoConsumido(produto: Produto): void {
        const index = this.produtosConsumidos.indexOf(produto);
        if (index > -1) {
            this.produtosConsumidos.splice(index, 1);
            this.quantidadeConsumida--;
        }
    }

    
}
