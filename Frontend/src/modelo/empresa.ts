import Cliente from "./cliente"
import Produto from "./produto"
import Servico from "./servico"



export default class Empresa{
    private compras: Array<any>; 
    private clientes: Array<Cliente>; 
    private produtos: Array<Produto>
    private servicos: Array<Servico>
    constructor(){
        this.clientes = [] 
        this.produtos = []
        this.servicos = []
        this.compras = [];
    }
    public get getClientes(): Array <Cliente>{
        return this.clientes
    }
    public get getProdutos(): Array<Produto>{
        return this.produtos
    }
    public get getServicos(): Array<Servico>{
        return this.servicos
    }

    
    
    

    
}

    

