import Entrada from "../../io/entrada";
import Cliente from "../../modelo/cliente";
import CPF from "../../modelo/cpf";
import Cadastro from "../cadastro";
import { clientescadastrados } from "./clientesCadastrados";
import ListagemClientes from './listagemClientes';
import Telefone from "../../modelo/telefone";
import RG from "../../modelo/rg";

export default class CadastroCliente extends Cadastro {
    private entrada: Entrada
    public listagemClientes : ListagemClientes

    constructor(listagemClientes: ListagemClientes) {
        super()
        this.entrada = new Entrada()
        this.listagemClientes = listagemClientes;
        
    }
    public cadastrar(): void {
        console.log(`\nInício do cadastro do cliente`);
        let nome = this.entrada.receberTexto(`Por favor informe o nome do cliente: `)
        let nomeSocial = this.entrada.receberTexto(`Por favor informe o nome social do cliente: `)
        let valor = this.entrada.receberTexto(`Por favor informe o número do cpf: `);
        let data = this.entrada.receberTexto(`Por favor informe a data de emissão do cpf, no padrão dd/mm/yyyy: `);
        let partesData = data.split('/')
        let ano = new Number(partesData[2].valueOf()).valueOf()
        let mes = new Number(partesData[1].valueOf()).valueOf()
        let dia = new Number(partesData[0].valueOf()).valueOf()
        let dataEmissao = new Date(ano, mes, dia)
        let cpf = new CPF(valor, dataEmissao); 
        let cpfExistente = clientescadastrados.find(cliente => cliente.getCpf.getValor === cpf.getValor);
        if (cpfExistente) {
            console.log(`\n Já existe um cliente cadastrado com o CPF ${cpf.getValor}.\n`);
            return;
        }
        let valorRG = this.entrada.receberTexto(`Por favor informe o número do RG: `);
        let dataRG = this.entrada.receberTexto(`Por favor informe a data de emissão do RG, no padrão dd/mm/yyyy: `);
        let partesDataRG = dataRG.split('/')
        let anoRG = new Number(partesDataRG[2].valueOf()).valueOf()
        let mesRG = new Number(partesDataRG[1].valueOf()).valueOf()
        let diaRG = new Number(partesDataRG[0].valueOf()).valueOf()
        let dataEmissaoRG = new Date(anoRG, mesRG, diaRG)
        let rg = new RG(valorRG, dataEmissaoRG); 
	    let genero = '';
            while (genero !== '1' && genero !== '2') {
        genero = this.entrada.receberTexto(`Por favor informe o gênero do cliente (1 - Masculino, 2 - Feminino): `)}
        genero = genero === '1' ? 'Masculino' : 'Feminino';
        let ddd = this.entrada.receberTexto(`Por favor informe o DDD do telefone do cliente: `);
        let numero = this.entrada.receberTexto(`Por favor informe o número do telefone do cliente: `);
        let telefone = new Telefone(ddd, numero);
        let cliente = new Cliente(nome, nomeSocial, cpf, rg, genero, telefone);
	    clientescadastrados.push(cliente);        

        console.log(`\nCadastro concluído :)\n`);
    }

    public atualizarCadastro(): void {
        console.log(`\nInício da atualização do cliente`);
        let entrada = new Entrada();        
        let nomeClienteAtualizar= entrada.receberTexto(`Por favor, informe o nome do cliente que deseja atualizar: `);
        let cliente = this.listagemClientes.getClientes().find(c => c.nome === nomeClienteAtualizar);
        if (cliente) {
            let novoNome = entrada.receberTexto(`Por favor informe o novo nome do cliente (ou pressione enter para manter o atual): `);
            if (novoNome !== '') {
                cliente.nome = novoNome;
            }
            let novoNomeSocial = entrada.receberTexto(`Por favor informe o novo nome social do cliente (ou pressione enter para manter o atual): `);
            if (novoNomeSocial !== '') {
                cliente.nomeSocial = novoNomeSocial;
            }
            let novoValorCPF = entrada.receberTexto(`Por favor informe o novo número do cpf (ou pressione enter para manter o atual): `);
            if (novoValorCPF !== '') {
                let novaDataCPF = entrada.receberTexto(`Por favor informe a nova data de emissão do cpf, no padrão dd/mm/yyyy (ou pressione enter para manter a atual): `);
                if (novaDataCPF !== '') {
                    let partesData = novaDataCPF.split('/')
                    if (partesData.length === 3) {
                        let ano = new Number(partesData[2].valueOf()).valueOf()
                        let mes = new Number(partesData[1].valueOf()).valueOf()
                        let dia = new Number(partesData[0].valueOf()).valueOf()
                        let dataEmissao = new Date(ano, mes, dia)
                        let novoCPF = new CPF(novoValorCPF, dataEmissao);
                        cliente.setCpf(novoCPF);
                    } else {
                        console.log('Data de emissão do CPF inválida. Mantendo a data atual.');
                    }
                }
            }
            let novoGenero = entrada.receberTexto(`Por favor informe o novo gênero do cliente (1 - Masculino, 2 - Feminino) ou pressione enter para manter o atual: `);
            if (novoGenero !== '') {
                while (novoGenero !== '1' && novoGenero !== '2') {
                    novoGenero = entrada.receberTexto(`Por favor informe o novo gênero do cliente (1 - Masculino, 2 - Feminino) ou pressione enter para manter o atual: `);
                }
                novoGenero = novoGenero === '1' ? 'Masculino' : 'Feminino';
                cliente.genero = novoGenero;
            }
            let novoValorRG = entrada.receberTexto(`Por favor informe o novo número do RG (ou pressione enter para manter o atual): `);
            if (novoValorRG !== '') {
                let novaDataRG = entrada.receberTexto(`Por favor informe a nova data de emissão do RG, no padrão dd/mm/yyyy (ou pressione enter para manter a atual): `);
                if (novaDataRG !== '') {
                    let partesDataRG = novaDataRG.split('/')
                    if (partesDataRG.length === 3) {
                        let anoRG = new Number(partesDataRG[2].valueOf()).valueOf()
                        let mesRG = new Number(partesDataRG[1].valueOf()).valueOf()
                        let diaRG = new Number(partesDataRG[0].valueOf()).valueOf()
                        let dataEmissaoRG = new Date(anoRG, mesRG, diaRG)
                        let novoRG = new RG(novoValorRG, dataEmissaoRG);
                        cliente.setRg(novoRG);
                    } else {
                        console.log('Data de emissão do RG inválida. Mantendo a data atual.');
                    }
                }
            }
            let novoDDD = entrada.receberTexto(`Por favor informe o novo DDD do telefone do cliente (ou pressione enter para manter o atual): `);
            let novoNumero = entrada.receberTexto(`Por favor informe o novo número do telefone do cliente (ou pressione enter para manter o atual): `);
            if (novoDDD !== '' && novoNumero !== '') {
                let novoTelefone = new Telefone(novoDDD, novoNumero);
                cliente.setTelefone(novoTelefone);
            }
        } else {
            console.log('Cliente não encontrado.');
        }
    }

       
    public deletarCadastro(): void {
        console.log(`\nInício da atualização do cliente`);
        let entrada = new Entrada();  
        let nomeClienteDeletar = entrada.receberTexto("Por favor, informe o nome do cliente que deseja deletar: ");
        let clienteIndex = this.listagemClientes.getClientes().findIndex(function (c) { return c.nome === nomeClienteDeletar; });
        if (clienteIndex !== -1) {
            this.listagemClientes.getClientes().splice(clienteIndex, 1);
            console.log("Cliente deletado com sucesso.");
        } else {
            console.log("Cliente não encontrado.");
        }
    }
}