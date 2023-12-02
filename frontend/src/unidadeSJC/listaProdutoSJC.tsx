import React, { useState, useEffect  } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from '../estilos/styles.module.css';
import { Link } from 'react-router-dom';
import { URI } from "../enuns/uri";
import RemovedorProduto from '../removedores/removedorProduto';


type Produto = {
    id: number;
    nome: string;
    valor: number;
}

function ListaProdutoSJC() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null);
  const [produtoAtualizar, setProdutoAtualizar] = useState<Produto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroProduto, setFiltroProduto] = useState('');
  const [modalExcluirShow, setModalExcluirShow] = useState(false);

  const fetchProdutos = async () => {
    const response = await fetch('http://localhost:3001/produtos');
    const data = await response.json();
    data.sort((a: Produto, b: Produto) => a.nome.localeCompare(b.nome));
    setProdutos(data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleEditarClick = (produto: Produto) => {
      setProdutoModal(produto);
      setShowModal(true);
  };
  
  const handleSalvarClick = () => {
    if (produtoModal) {
      fetch(`${URI.ATUALIZAR_PRODUTO}/${produtoModal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoModal)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao salvar o produto');
        }
        return response.json();
      })
      .then(data => {
        setProdutos(produtos.map(produto => produto.id === data.id ? data : produto));
        setShowModal(false);
      })
      .catch(error => console.error('Erro:', error));
    }
  };

const handleFiltroProdutoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroProduto(event.target.value);
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

const handleExcluirClick = (idProduto: string) => {
  let removedor = new RemovedorProduto ();
  let produto = produtos.find(produto => produto.id.toString() === idProduto);
  if (produto) {
    removedor.remover(produto)
      .then(() => {
        fetchProdutos(); 
      })
      .catch(error => console.error('Erro ao excluir produto:', error));
  }
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
                          <td><button onClick={() => handleExcluirClick(produto.id.toString())}>Excluir</button></td>
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