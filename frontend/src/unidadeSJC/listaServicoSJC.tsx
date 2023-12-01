import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../estilos/styles.module.css';
import { Link } from 'react-router-dom';
import api from '../api';
import { URI } from "../enuns/uri";

type Servico = {
    nome: string;
    valor: number;
}

function ListaServicoSJC() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [servicoModal, setServicoModal] = useState<Servico>({ nome: '', valor: 0 });
    const [showModal, setShowModal] = useState(false);
    const [filtroServico, setFiltroServico] = useState('');

    useEffect(() => {
        fetch(URI.BUSCAR_SERVICOS)
            .then(response => response.json())
            .then(data => setServicos(data))
            .catch(error => console.error('Erro ao buscar serviços:', error));
    }, []);

    const handleEditarClick = (servico: Servico) => {
        setServicoModal(servico);
        setShowModal(true);
    };

    const handleSalvarClick = () => {
        setShowModal(false);
    };

    const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServicoModal(prevServicoModal => ({
            ...prevServicoModal,
            nome: event.target.value || prevServicoModal.nome
        }));
    };

    const handlevalorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (servicoModal) {
            const valor = parseFloat(event.target.value.replace(/\D/g,'')) / 100;
            setServicoModal({ ...servicoModal, valor: valor });
        }
    };

    const handleExcluirClick = (servico: Servico) => {
        setServicos(prevServicos => prevServicos.filter(s => s !== servico));
    };

    const handleFiltroServicoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroServico(event.target.value);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
                                {servicos.map((servico, index) => (
                                    <tr className={styles['coluna-left']} key={index} >
                                    <td className={styles['nome-servico']} id="nome-servico">{servico.nome}</td>
                                    <td>{servico.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td><button onClick={() => handleEditarClick(servico)}>Editar</button></td>
                                    <td><button onClick={() => handleExcluirClick(servico)}>Excluir</button></td>
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