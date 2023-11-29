import Servico from "../../modelo/servico";
import servicosCadastrados from "./servicosCadastrados";

export default class cadastroServico {
    private servico: Array<Servico>;

    constructor() {
        this.servico = servicosCadastrados;
    }

    public adicionarServico(servico: Servico): void {
        this.servico.push(servico);
    }

    public atualizarServico(nomeServico: string, novoNome: string, novoValor: number): void {
        let servico = this.servico.find(p => p.nome === nomeServico);
        if (servico) {
            servico.atualizarServico(novoNome, novoValor);
        }
    }

    public deletarServico(nomeServico: string): void {
        let servicoIndex = this.servico.findIndex(p => p.nome === nomeServico);
        if (servicoIndex !== -1) {
            this.servico.splice(servicoIndex, 1);
        }
    }

    public getServicos(): Array<Servico> {
        return this.servico;
    }
}