export interface Telefone {
  id: number;
  ddd: string;
  numero: string;
  clienteId: number;
}

export interface Endereco {
  id?: number;
  cidade: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  informacoesAdicionais: string;
  clienteId?: number;
}

export interface Cliente {
  id: number;
  nome: string;
  nomeSocial: string;
  genero: string;
  dataCadastro: string;
  endereco: Endereco;
  telefones: Telefone[];
  compras: Compra[];
  quantidadeConsumida?: number; 
  valorConsumido?: number;
}

export interface Compra {
  id: number;
  quantidade: number;
  clienteId: number;
  produtoId: number;
  servicoId: number;
}