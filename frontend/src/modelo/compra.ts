
export default class Compra {
    public clienteId: number;
    public produtoId: number | null;
    public servicoId: number | null;
    public quantidade: number;
  
    constructor(clienteId: number, produtoId: number | null, servicoId: number | null, quantidade: number) {
      this.clienteId = clienteId;
      this.produtoId = produtoId;
      this.servicoId = servicoId;
      this.quantidade = quantidade;
    }
  }

    