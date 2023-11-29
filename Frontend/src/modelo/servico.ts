export default class Servico {
    public nome: string;
    public valor: number;
    public servicosConsumidos: Array<Servico>
    public quantidadeConsumida: number = 0;

    constructor(nome: string, valor: number) {
        this.nome = nome;
        this.valor = valor;
        this.servicosConsumidos = [];
    }

    public atualizarServico(novoNome: string, novoValor: number): void {
        this.nome = novoNome;
        this.valor = novoValor;
        
    }

    public contratarServico(): void {
        this.quantidadeConsumida++;
    }

    public deletarServicoConsumido(servico: Servico): void {
        const index = this.servicosConsumidos.indexOf(servico);
        if (index > -1) {
            this.servicosConsumidos.splice(index, 1);
            this.quantidadeConsumida--;
        }
    }

    
}