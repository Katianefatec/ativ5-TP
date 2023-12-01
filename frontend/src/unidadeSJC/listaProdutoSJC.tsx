import React, { useState, useEffect  } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from '../estilos/styles.module.css';
import { Link } from 'react-router-dom';
import { URI } from "../enuns/uri";


type Produto = {
    nome: string;
    valor: number;
}

function ListaProdutoSJC() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroProduto, setFiltroProduto] = useState('');

  useEffect(() => {
    fetch(URI.BUSCAR_PRODUTOS)
        .then(response => response.json())
        .then(data => setProdutos(data))
        .catch(error => console.error('Erro ao buscar serviços:', error));
}, []);

  const handleEditarClick = (produto: Produto) => {
      setProdutoModal(produto);
      setShowModal(true);
  };
  
  const handleSalvarClick = () => {
    setShowModal(false);
  };

  const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (produtoModal) {
        setProdutoModal({ ...produtoModal, nome: event.target.value });
    }
};

const handlevalorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (produtoModal) {
      const valor = parseFloat(event.target.value.replace(/\D/g,'')) / 100;
      setProdutoModal({ ...produtoModal, valor: valor });
  }
};

const handleCloseModal = () => {
    setShowModal(false);
};

const handleExcluirClick = (produto: Produto) => {
    setProdutos(produtos.filter(p => p !== produto));
};

const handleFiltroProdutoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroProduto(event.target.value);
};

const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(filtroProduto.toLowerCase()));

  return (
          <>
            <div className={styles['container-lista']}>
              <div className={styles['wrap-lista']}>
                <div className={styles['titulo-tabela']}>
                  <h1>Lista de Produtos</h1>
                </div>
                <div className={styles['titulo-tabela2']}>                           
                <input type="text" value={filtroProduto} onChange={handleFiltroProdutoChange} placeholder="Buscar por produto" />
                    <Link to="/cadastroSJC">
                        <button>Cadastrar </button>
                    </Link>
                </div>
                <div className={styles['table-responsive']}>
                  <Table striped hover>
                    <thead>
                    <tr className={styles['coluna-left']}>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Alterar</th>
                        <th>Excluir</th>
                      </tr>
                    </thead>
                    <tbody>
                    {produtosFiltrados.map((produto, index) => (
                        <tr className={styles['coluna-left']} key={index} >
                          <td>{produto.nome}</td>
                          <td>{produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td><button onClick={() => handleEditarClick(produto)}>Editar</button></td>
                          <td><button onClick={() => handleExcluirClick(produto)}>Excluir</button></td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>
              </div>
                    
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                  <div className="form-group">
                      <label htmlFor="produtoNome">Produto</label>
                      <input type="text" className="form-control" id="produtoNome" value={produtoModal?.nome} onChange={handleNomeChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="produtovalor">Preço</label>
                    <input type="text" className="form-control" id="produtovalor" 
                        value={produtoModal?.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
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
    };

export default ListaProdutoSJC;