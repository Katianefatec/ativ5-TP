import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../estilos/styles.module.css';
import { Link } from 'react-router-dom';
import api from '../api';
import { URI } from "../enuns/uri";
import RemovedorServico from '../removedores/removedorServico';

type Servico = {
    id?: number;
    nome: string;
    valor: number;
}

function ListaServicoSJC() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [servicoModal, setServicoModal] = useState<Servico>({ nome: '', valor: 0 });
    const [showModal, setShowModal] = useState(false);
    const [filtroServico, setFiltroServico] = useState('');

    const fetchServicos = async () => {
        const response = await fetch('http://localhost:3001/servicos');
        const data = await response.json();
        data.sort((a: Servico, b: Servico) => a.nome.localeCompare(b.nome));
        setServicos(data);
      };
    
      useEffect(() => {
        fetchServicos();
      }, []);
    
    const handleEditarClick = (produto: Servico) => {
        setServicoModal(produto);
        setShowModal(true);
    };
    
      
    const handleSalvarClick = () => {
        if (servicoModal) {
          fetch(`${URI.ATUALIZAR_SERVICO}/${servicoModal.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicoModal)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao salvar o servico');
            }
            return response.json();
          })
          .then(data => {
            setServicos(servicos.map(servico => servico.id === data.id ? data : servico));
            setShowModal(false);
          })
          .catch(error => console.error('Erro:', error));
        }
      };
    
    const handleFiltroServicoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroServico(event.target.value);
    };
    
    const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (servicoModal) {
          setServicoModal({ ...servicoModal, nome: event.target.value });
      }
    };
    
    const handlevalorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (servicoModal) {
        const valor = parseFloat(event.target.value.replace(/\D/g,'')) / 100;
        setServicoModal({ ...servicoModal, valor: valor });
    }
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleExcluirClick = (idProduto: string) => {
        let removedor = new RemovedorServico();
        let servico = servicos.find(servico => servico.id?.toString() === idProduto);
        if (servico && servico.id) {
            removedor.remover({ ...servico, id: servico.id })
                .then(() => {
                    fetchServicos();
                })
                .catch(error => console.error('Erro ao excluir produto:', error));
        }
    };
    
    const servicosFiltrados = servicos.filter((servico) => servico.nome.toLowerCase().includes(filtroServico));

    return (
        
            <>
                <div className={styles['container-lista']}>
                    <div className={styles['wrap-lista']}>
                        <div className={styles['titulo-tabela']}>
                            <h1>Lista de Serviços</h1>
                        </div>
                        <div className={styles['titulo-tabela2']}>
                            
                        <input type="text" value={filtroServico} onChange={handleFiltroServicoChange} placeholder="Buscar por serviço" />
                            <Link to="/cadastroSJC">
                                <button>Cadastrar </button>
                            </Link>
                        </div> 
                            <Table striped hover>
                                <thead>
                                <tr className={styles['coluna-left']}>
                                        <th>Serviço</th>
                                        <th>Preço</th>
                                        <th>Alterar</th>
                                        <th>Excluir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {servicosFiltrados.map((servico, index) => (
                                    <tr className={styles['coluna-left']} key={index} >
                                    <td className={styles['nome-servico']} id="nome-servico">{servico.nome}</td>
                                    <td>{servico.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td><button onClick={() => handleEditarClick(servico)}>Editar</button></td>
                                    <td><button onClick={() => servico.id && handleExcluirClick(servico.id.toString())}>Excluir</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
           
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Serviço</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="servicoNome">Serviço</label>
                            <input type="text" className="form-control" id="servicoNome" value={servicoModal?.nome} onChange={handleNomeChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="servicovalor">Preço</label>
                            <input type="text" className="form-control" id="servicovalor" 
                                value={servicoModal?.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                                onChange={handlevalorChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSalvarClick}>
                        Salvar Alterações
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    }

    export default ListaServicoSJC;