
import { Cliente } from "../cliente";
import Produto from "./produto";
import Servico from "./servico";

export default class Compra {
    cliente: Cliente;
    produto: Produto;
    servico?: Servico;
    public produtosConsumidos: Array<Produto>
    public servicosConsumidos: Array<Servico>
  
    constructor(cliente: Cliente, produto: Produto, servico?: Servico) {
        this.cliente = cliente;
        this.produto = produto;
        this.servico = servico;
        this.produtosConsumidos = [];
        this.servicosConsumidos = [];
      
    }

    public consumirServico(servico: Servico): void {
        this.servicosConsumidos.push(servico);
    }

    public consumirProduto(produto: Produto): void {
        this.produtosConsumidos.push(produto);        
    }

  
  
    public registrarCompra(): void {
            if (this.produto) {
                this.consumirProduto(this.produto);
            }
           
            if (this.servico) {
                this.consumirServico(this.servico);
            }
        
            console.log("Compra registrada com sucesso!");
        }
  }
  