import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AtualizadorCliente from '../atualizador/atualizadorCliente';
import CadastradorCompra from '../cadastradores/cadastradorCompra';
import styles from '../estilos/styles.module.css';
import { Cliente, Endereco } from '../modelo/cliente';
import RemovedorCliente from '../removedores/removedorCliente';
import Compra from '../modelo/compra';

interface Produto {
  id: string;
  nome: string;
  valor: number;  
}

interface Servico {
  id: string;
  nome: string;
  valor: number;    
}




function ListaClientesSJC(){
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteAtualizar, setClienteAtualizar] = useState<Cliente | null>(null);  
  const [filtro, setFiltro] = useState('');  
  const [modalAlterarShow, setModalAlterarShow] = useState(false);  
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('');  
  const [modalConsumoShow, setModalConsumoShow] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]); 
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [quantidade, setQuantidade] = useState(0);
  
  

  
  
  
useEffect(() => {
        fetch('http://localhost:3001/clientes')
             .then(response => response.json())
             .then(data => { 
                 data.sort((a: Cliente, b: Cliente) => a.nome.localeCompare(b.nome));
                 setClientes(data);
                 console.log(data); 
             })
             .catch(error => console.error('Erro ao buscar clientes:', error));
     }, []);

useEffect(() => {
fetch('http://localhost:3001/produtos')
  .then(response => response.json())
  .then(data => setProdutos(data))
  .catch(error => console.error('Erro ao buscar produtos:', error));

fetch('http://localhost:3001/servicos')
  .then(response => response.json())
  .then(data => setServicos(data))
  .catch(error => console.error('Erro ao buscar serviços:', error));
}, []);

const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(event.target.value);
}

const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.nomeSocial.toLowerCase().includes(filtro.toLowerCase())
);

const handleAlterarShow = (cliente: Cliente) => {
  abrirModalAtualizar(cliente);
};


const abrirModalAtualizar = (cliente: Cliente) => {
  setClienteAtualizar(cliente);
  setModalAlterarShow(true);
};

const atualizadorCliente = new AtualizadorCliente();

const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setClienteAtualizar(prevState => {
    if (prevState) {
      return { ...prevState, nome: event.target.value };
    }
    return prevState;
  });
};
const handleNomeSocialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setClienteAtualizar(prevState => {
    if (prevState) {
      return { ...prevState, nomeSocial: event.target.value };
    }
    return prevState;
  });
};
const handleEnderecoChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const field = event.target.name as keyof Endereco;
  const value = event.target.value;
  setClienteAtualizar(prevState => {
    if (prevState) {
      const newEndereco = {...prevState.endereco, [field]: value};
      return {...prevState, endereco: newEndereco};
    }
    return prevState;
  });
};

function handlePhoneChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value.replace(/\D/g, ''); 
  const ddd = value.slice(0, 2); 
  const numero = value.slice(2); 

  setClienteAtualizar(prevState => {
    if (prevState) {
      const newTelefones = [...prevState.telefones];
      newTelefones[index].ddd = ddd;
      newTelefones[index].numero = numero;
      return {...prevState, telefones: newTelefones};
    }
    return prevState;
  });
}

const fetchClientes = async () => {
  const response = await fetch('http://localhost:3001/clientes');
  const data = await response.json();
  data.sort((a: Cliente, b: Cliente) => a.nome.localeCompare(b.nome));
  setClientes(data);
};

useEffect(() => {
  fetchClientes();
}, []);

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  if (clienteAtualizar) {
    await atualizadorCliente.atualizar(clienteAtualizar.id.toString(), clienteAtualizar);
    setModalAlterarShow(false);
    setTimeout(fetchClientes, 500); 
  }
};


const excluirRemoto = (idCliente: string) => {
  let removedor = new RemovedorCliente();
  let cliente = clientes.find(cliente => cliente.id.toString() === idCliente);
  if (cliente) {
    removedor.remover(cliente)
      .then(() => {
        fetchClientes(); 
      })
      .catch(error => console.error('Erro ao excluir cliente:', error));
  }
};
function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;
  setClienteAtualizar(prevState => {
    if (prevState) {
      return { ...prevState, [name]: value };
    }
    return prevState;
  });
}

function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
  const { name, value } = event.target;
  setClienteAtualizar(prevState => {
    if (prevState) {
      return { ...prevState, [name]: value };
    }
    return prevState;
  });
}


const handleProdutoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setProdutoSelecionado(event.target.value);
};

const handleServicoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setServicoSelecionado(event.target.value);
};

const [quantidadeProduto, setQuantidadeProduto] = useState(0);
const [quantidadeServico, setQuantidadeServico] = useState(0);

const handleQuantidadeProdutoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setQuantidadeProduto(Number(event.target.value));
};

const handleQuantidadeServicoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setQuantidadeServico(Number(event.target.value));
};
const handleConsumoClick = (cliente: Cliente) => {
  setClienteSelecionado(cliente);  
  setModalConsumoShow(true);
};

function formatPhoneNumber(ddd: string, numero: string) {
  return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
}

function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque os meses começam do 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const cadastradorCompra = new CadastradorCompra();


const adicionarConsumo = async () => {
  if (!clienteSelecionado) {
    alert('Por favor, selecione um cliente.');
    return;
  }

  const produto = produtos.find(produto => Number(produto.id) === Number(produtoSelecionado));
  const servico = servicos.find(servico => servico && Number(servico.id) === Number(servicoSelecionado));

  if (!produto && !servico) {
    alert('Por favor, selecione um produto ou serviço.');
    return;
  }

  const compra = new Compra(
    clienteSelecionado.id,
    produto ? Number(produto.id) : null,
    servico ? Number(servico.id) : null,
    produto ? quantidadeProduto : quantidadeServico
  );

  try {
    await cadastradorCompra.cadastrar(compra);
    alert('Compra adicionada com sucesso.');
  } catch (error) {
    console.error(error);
    alert('Ocorreu um erro ao tentar adicionar a compra.');
  }
};


return (
  <div className={styles['container-lista']}>
      <div className={styles['wrap-lista']}>
          <div className={styles['titulo-tabela']}>
              <h1>Lista de Clientes</h1>
          </div>
          <div className={styles['titulo-tabela2']}>
              <input type="text" value={filtro} onChange={handleFiltroChange} placeholder="Buscar por nome" />
              <span className="bi bi-search"></span>
              
          </div>
          <div className={styles['table-responsive']}>
              <Table striped hover>
                  <thead>
                      <tr className={styles['coluna-left']}>
                          <th>Nome</th>
                          <th>Nome Social</th>
                          <th>Data de cadastro</th>
                          <th>Genero</th>
                          <th>Endereço</th>  
                          <th>Telefone</th> 
                          <th>Consumo</th>                                                 
                          <th>Editar</th>
                          <th>Excluir</th>
                          
                      </tr>
                  </thead>                  
                  <tbody>
                    {clientesFiltrados.map((cliente, clienteIndex) => (
                      <tr className={styles['coluna-left']} key={clienteIndex}>
                        <td>{cliente.nome}</td>
                        <td>{cliente.nomeSocial}</td>
                        <td>{formatDate(new Date(cliente.dataCadastro))}</td>                    
                        <td>{cliente.genero}</td>
                        <td>{cliente.endereco && `${cliente.endereco.rua}, 
                        ${cliente.endereco.numero}, 
                        ${cliente.endereco.bairro}, 
                        ${cliente.endereco.cidade}, 
                        ${cliente.endereco.estado}, 
                        ${cliente.endereco.codigoPostal}`}
                        </td>
                        {cliente && cliente.telefones ? cliente.telefones.map((telefone, telefoneIndex) => (
                          <td key={`${clienteIndex}-${telefoneIndex}`}>
                            {telefone.ddd} {telefone.numero}
                          </td>
                        )) : ''}                      
                        <td><button onClick={() => handleConsumoClick(cliente)}>Adicionar</button></td>
                        <td>
                        <button onClick={() => handleAlterarShow(cliente)}>Editar</button>
                        </td>
                        <td>
                          <button onClick={(e) => excluirRemoto(cliente.id.toString())}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </Table>              
            </div>
            <div className={styles['titulo-tabela2']}>
              <Link to="/cadastroSJC">
                  <button>Cadastrar </button>
              </Link>
              </div>
            </div>
            <div>
            <Modal show={modalAlterarShow} onHide={() => setModalAlterarShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title className={styles['modal-title']}>Atualizar Cliente</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form onSubmit={handleSubmit} className={styles['modal-container']}>
                  {clienteAtualizar && (
                    <>
                      <input type="hidden" name="id" value={clienteAtualizar.id} />
                      <label>
                        Nome:
                        <br />
                        <input type="text" name="nome" value={clienteAtualizar.nome} onChange={handleNomeChange} className={styles['full-width-input']} />
                      </label>
                      <label>
                        Nome Social:
                        <br />
                        <input type="text" name="nomeSocial" value={clienteAtualizar.nomeSocial} onChange={handleNomeSocialChange} className={styles['full-width-input']}/>
                      </label>
                      <label>
                        Rua:
                        <br />
                        <input type="text" name="rua" value={clienteAtualizar.endereco.rua} onChange={handleEnderecoChange} className={styles['full-width-input']} />
                      </label>
                      <div className={styles['flex-container-modal']}>
                        <label className={styles['flex-item-modal']}>
                          Número:
                          <br />
                          <input type="text" name="numero" value={clienteAtualizar.endereco.numero} onChange={handleEnderecoChange} />
                        </label>
                        <label className={styles['flex-item-modal']}>
                          Bairro:
                          <br />
                          <input type="text" name="bairro" value={clienteAtualizar.endereco.bairro} onChange={handleEnderecoChange} />
                        </label>
                      </div>
                      <div className={styles['flex-container-modal']}>
                        <label className={styles['flex-item-modal']}>
                          CEP:
                          <br />
                          <input type="text" name="codigoPostal" value={clienteAtualizar.endereco.codigoPostal} onChange={handleEnderecoChange} />
                        </label>
                        <label className={styles['flex-item-modal']}>
                          Cidade:
                          <br />
                          <input type="text" name="cidade" value={clienteAtualizar.endereco.cidade} onChange={handleEnderecoChange} />
                        </label>
                      </div>
                      <div className={styles['flex-container-modal']}>
                      <label className={styles['flex-item-modal']}>
                        Estado:
                        <br />
                        <select name="estado" value={clienteAtualizar.endereco.estado} onChange={handleEnderecoChange}>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                            <option value="EX">Estrangeiro</option>
                        </select>
                        </label>
                        <label className={styles['flex-item-modal']}>
                          Telefone:
                          {clienteAtualizar.telefones.map((telefone, index) => (
                            <div key={index}>
                              <input 
                                type="text" 
                                name={`telefone-${index}`} 
                                value={formatPhoneNumber(telefone.ddd, telefone.numero)} 
                                onChange={e => handlePhoneChange(index, e)} 
                              />
                            </div>
                          ))}
                        </label>
                      </div>
                      <div className={styles['flex-container-modal']}>
                        <label className={styles['flex-item-modal']}>
                          Gênero:
                          <br />
                          <select name="genero" value={clienteAtualizar.genero} onChange={handleSelectChange}>
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                              <option value="Outro">Outro</option>
                          </select>
                        </label>
                        <label className={styles['flex-item-modal']}>
                          Data de cadastro:
                          <br />
                          <input type="date" name="dataCadastro" value={clienteAtualizar.dataCadastro} onChange={handleInputChange} />
                        </label>
                      </div>
                      <label>
                        Informações adicionais:
                        <br />
                        <textarea name="informacoesAdicionais" value={clienteAtualizar.endereco.informacoesAdicionais} onChange={handleEnderecoChange} className={styles['full-width-input']} />
                      </label>                      
                      <div className={styles['button-container']}>                        
                        <button type="submit">Atualizar</button>
                      </div>
                    </>
                  )}
                </Form>
              </Modal.Body>
            </Modal>
            <Modal show={modalConsumoShow} onHide={() => setModalConsumoShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title className={styles['modal-title']}>
                 {clienteSelecionado ? clienteSelecionado.nome : 'Nenhum cliente selecionado'} 
                </Modal.Title>                
              </Modal.Header>
              <Modal.Body>
                <form>
                  <label>
                    Produto:
                    <select value={produtoSelecionado} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleProdutoChange(event)}>
                      <option value="">Selecione um produto</option>
                      {produtos.map(produto => (
                        <option key={produto.id} value={produto.id}>{produto.nome}</option>
                      ))}
                    </select>
                  </label>                  
                  <br />                  
                  <label>
                    Quantidade:
                    <input type="number" value={quantidadeProduto} onChange={handleQuantidadeProdutoChange} />
                  </label>
                  <br />
                  <br />
                  <label>
                    Serviço:
                    <select value={servicoSelecionado} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleServicoChange(event)}>
                      <option value="">Selecione um serviço</option>
                      {servicos.map(servico => (
                        <option key={servico.id} value={servico.id}>{servico.nome}</option>
                      ))}
                    </select>
                  </label>
                  <br />
                  <label>
                    Quantidade:
                    <input type="number" value={quantidadeServico} onChange={handleQuantidadeServicoChange} />
                  </label>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalConsumoShow(false)}>
                  Fechar
                </Button>
                <Button variant="primary" onClick={adicionarConsumo}>
                  Salvar
                </Button>
              </Modal.Footer>
            </Modal>
            
        </div>
      </div>

  
);
}

export default ListaClientesSJC;

