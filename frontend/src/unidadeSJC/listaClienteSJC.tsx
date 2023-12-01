import React, { useEffect, useState, FormEvent} from 'react';
import axios from 'axios';
import styles from '../estilos/styles.module.css';
import { Link } from 'react-router-dom';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import RemovedorCliente from '../removedores/removedorCliente';
import RemovedorClienteLocal from '../removedores/removedorClienteLocal';
import { Cliente } from '../cliente'; 
import AtualizadorCliente from '../atualizador/atualizadorCliente';
import { Endereco } from '../cliente';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ListaClientesSJC(){
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteAtualizar, setClienteAtualizar] = useState<Cliente | null>(null);
  const [clienteModal, setClienteModal] = useState<Cliente | null>(null);
  const [filtro, setFiltro] = useState('');  
  const [modalAlterarShow, setModalAlterarShow] = useState(false);
  const [modalExcluirShow, setModalExcluirShow] = useState(false);
  const [state, setState] = useState<Cliente>({
    id: 0,
    nome: '',
    nomeSocial: '',
    genero: '',
    endereco: {
      cidade: '',
      estado: '',
      bairro: '',
      rua: '',
      numero: '',
      codigoPostal: '',
      informacoesAdicionais: '',
    },
    telefones: [],
    dataCadastro: new Date().toISOString(),
  });

  
  
  
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
    removedor.remover(cliente);
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


function formatPhoneNumber(ddd: string, numero: string) {
  return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
}

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
                          <th>Sobrenome</th>
                          <th>Data de cadastro</th>
                          <th>Genero</th>
                          <th>Endereço</th>  
                          <th>Telefone</th>                                                  
                          <th>Editar</th>
                          <th>Excluir</th>
                          
                      </tr>
                  </thead>
                  <tbody>
                  {clientesFiltrados.map((cliente, index) => (
                    <tr className={styles['coluna-left']} key={index}>
                      <td>{cliente.nome}</td>
                      <td>{cliente.nomeSocial}</td>
                      <td>{cliente.dataCadastro}</td>                      
                      <td>{cliente.genero}</td>
                      <td>{cliente.endereco && `${cliente.endereco.rua}, 
                      ${cliente.endereco.numero}, 
                      ${cliente.endereco.bairro}, 
                      ${cliente.endereco.cidade}, 
                      ${cliente.endereco.estado}, 
                      ${cliente.endereco.codigoPostal}`}
                      </td>
                      {cliente && cliente.telefones ? cliente.telefones.map((telefone, index) => (
                        <td key={index}>
                          {telefone.ddd} {telefone.numero}
                        </td>
                      )) : ''}                      
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
            
        </div>
      </div>

  
);
}

export default ListaClientesSJC;

