import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from '../estilos/styles.module.css';
import { Cliente } from '../modelo/cliente';
import Compra from '../modelo/compra';
import axios from 'axios';


interface Produto {
    id: string;
    nome: string;
    valor: number;  
    generoMaisConsumidor?: string;
    quantidadeConsumida?: number; 

  }
  
  interface Servico {
    id: string;
    nome: string;
    valor: number;  
    generoMaisConsumidor?: string;  
    quantidadeConsumida?: number; 
  }

 

  interface Relatorio {
    top10ClientesMaisConsumo: Cliente[];
    clientesPorGenero: {
        masculino: Cliente[];
        feminino: Cliente[];
    };
    servicosMaisConsumidos: Servico[];
    servicosMaisConsumidosPorGenero: {
        masculino: Servico[];
        feminino: Servico[];
    };
    clientesQueMenosConsumiram: Cliente[];
    top5ClientesMaisValor: Cliente[];
    itensMaisConsumidos: (Produto | Servico)[];
}

interface CompraComValorTotal extends Compra {
    valorTotal?: number;
}

interface ClienteComValorConsumido extends Cliente {
    valorConsumido?: number;
}



function Relatorios(){
    const [relatorios, setRelatorios] = useState<Relatorio>({
        top10ClientesMaisConsumo: [],
        clientesPorGenero: {
            masculino: [],
            feminino: []
        },
        servicosMaisConsumidos: [],
        servicosMaisConsumidosPorGenero: {
            masculino: [],
            feminino: []
        },
        clientesQueMenosConsumiram: [],
        top5ClientesMaisValor: [],
        itensMaisConsumidos: [],
    });

    useEffect(() => {
        const fetchDados = async () => {
            const top10ClientesMaisConsumo = await fetchTop10ClientesMaisConsumo();
            const clientesPorGenero = await fetchClientesPorGenero();
            const itensMaisConsumidos = await fetchItensMaisConsumidos();
            const itensMaisConsumidosPorGenero = await fetchItensMaisConsumidosPorGenero();
            const clientesQueMenosConsumiram = await fetchClientesQueMenosConsumiram();
            const top5ClientesMaisValor = await fetchTop5ClientesMaisValor();

            setRelatorios({
                top10ClientesMaisConsumo,
                clientesPorGenero: {
                    masculino: clientesPorGenero.masculino,
                    feminino: clientesPorGenero.feminino,
                },
                servicosMaisConsumidos: itensMaisConsumidos,
                servicosMaisConsumidosPorGenero: {
                    masculino: itensMaisConsumidosPorGenero.masculino,
                    feminino: itensMaisConsumidosPorGenero.feminino,
                },
                clientesQueMenosConsumiram,
                top5ClientesMaisValor,
                itensMaisConsumidos,
            });
        };

        fetchDados();
    }, []);

    const [relatorioSelecionado, setRelatorioSelecionado] = useState("");

    async function fetchCompras(): Promise<Compra[]> {
        const response = await axios.get('http://localhost:3000/compras');
        return response.data;
    }
    
    async function fetchClientes(): Promise<Cliente[]> {
        const response = await axios.get('http://localhost:3000/clientes');
        return response.data;
    }

    const fetchTop10ClientesMaisConsumo = async () => {
        const compras = await fetchCompras();
        const clientes = await fetchClientes();
    
        const consumoPorCliente = compras.reduce((acc: any, compra: any) => {
            acc[compra.clienteId] = (acc[compra.clienteId] || 0) + compra.quantidade;
            return acc;
        }, {});
    
        const clientesComConsumo = clientes.map((cliente: any) => ({
            ...cliente,
            quantidadeConsumida: consumoPorCliente[cliente.id] || 0,
        }));
    
        const top10ClientesMaisConsumo = clientesComConsumo.sort((a: any, b: any) => b.quantidadeConsumida - a.quantidadeConsumida).slice(0, 10);
    
        return top10ClientesMaisConsumo;
    };
    
    const fetchClientesPorGenero = async (): Promise<{ masculino: Cliente[], feminino: Cliente[] }> => {
        const response = await fetch('http://localhost:3001/clientes');
        const clientes: Cliente[] = await response.json();
    
        const clientesMasculino = clientes.filter((cliente: Cliente) => cliente.genero.toLowerCase() === 'masculino');
        const clientesFeminino = clientes.filter((cliente: Cliente) => cliente.genero.toLowerCase() === 'feminino');
    
        return {
            masculino: clientesMasculino,
            feminino: clientesFeminino,
        };
    };
    
    const fetchItensMaisConsumidos = async (): Promise<(Produto | Servico)[]> => {
        const responseCompras = await fetch('http://localhost:3001/compras');
        const compras: Compra[] = await responseCompras.json();
    
        const consumoPorItem = compras.reduce((acc: {[key: string]: number}, compra: Compra) => {
            if(compra.produtoId !== null) {
                acc[compra.produtoId] = (acc[compra.produtoId] || 0) + compra.quantidade;
            }
            if(compra.servicoId !== null) {
                acc[compra.servicoId] = (acc[compra.servicoId] || 0) + compra.quantidade;
            }
            return acc;
        }, {});
    
        const responseProdutos = await fetch('http://localhost:3001/produtos');
        const produtos: Produto[] = await responseProdutos.json();
    
        const responseServicos = await fetch('http://localhost:3001/servicos');
        const servicos: Servico[] = await responseServicos.json();
    
        const itensComConsumo = [...produtos, ...servicos].map((item: Produto | Servico) => ({
            ...item,
            quantidadeConsumida: consumoPorItem[item.id] || 0,
        }));
    
        const itensMaisConsumidos = itensComConsumo.sort((a, b) => b.quantidadeConsumida - a.quantidadeConsumida).slice(0, 10);
    
        return itensMaisConsumidos;
    };
    const fetchItensMaisConsumidosPorGenero = async (): Promise<{ masculino: (Produto | Servico)[], feminino: (Produto | Servico)[] }> => {
        const responseClientes = await fetch('http://localhost:3001/clientes');
        const clientes: Cliente[] = await responseClientes.json();
    
        const responseCompras = await fetch('http://localhost:3001/compras');
        const compras: Compra[] = await responseCompras.json();
    
        const consumoPorItemPorGenero: { [key: string]: { [key: string]: number } } = { masculino: {}, feminino: {} };
    
        compras.forEach((compra: Compra) => {
            const cliente = clientes.find((cliente: Cliente) => cliente.id === compra.clienteId);
            const genero = cliente ? cliente.genero.toLowerCase() : 'desconhecido';
    
            if (compra.produtoId !== null && consumoPorItemPorGenero[genero]) {
                consumoPorItemPorGenero[genero][compra.produtoId] = (consumoPorItemPorGenero[genero][compra.produtoId] || 0) + compra.quantidade;
            }
    
            if (compra.servicoId !== null && consumoPorItemPorGenero[genero]) {
                consumoPorItemPorGenero[genero][compra.servicoId] = (consumoPorItemPorGenero[genero][compra.servicoId] || 0) + compra.quantidade;
            }
        });
    
        const responseProdutos = await fetch('http://localhost:3001/produtos');
        const produtos: Produto[] = await responseProdutos.json();
    
        const responseServicos = await fetch('http://localhost:3001/servicos');
        const servicos: Servico[] = await responseServicos.json();
    
        const getItensMaisConsumidos = (genero: string) => {
            const itensComConsumo = [...produtos, ...servicos].map((item: Produto | Servico) => ({
                ...item,
                quantidadeConsumida: consumoPorItemPorGenero[genero][item.id] || 0,
            }));
    
            const itensMaisConsumidos = itensComConsumo.sort((a, b) => b.quantidadeConsumida - a.quantidadeConsumida).slice(0, 10);
    
            return itensMaisConsumidos;
        };
    
        return {
            masculino: getItensMaisConsumidos('masculino'),
            feminino: getItensMaisConsumidos('feminino'),
        };
    };
    
    const fetchClientesQueMenosConsumiram = async (): Promise<Cliente[]> => {
        const responseClientes = await fetch('http://localhost:3001/clientes');
        const clientes: Cliente[] = await responseClientes.json();
    
        const responseCompras = await fetch('http://localhost:3001/compras');
        const compras: Compra[] = await responseCompras.json();
    
        const consumoPorCliente: { [key: string]: number } = {};
    
        compras.forEach((compra: Compra) => {
            consumoPorCliente[compra.clienteId] = (consumoPorCliente[compra.clienteId] || 0) + compra.quantidade;
        });
    
        const clientesComConsumo = clientes.map((cliente: Cliente) => ({
            ...cliente,
            quantidadeConsumida: consumoPorCliente[cliente.id] || 0,
        }));
    
        const clientesQueMenosConsumiram = clientesComConsumo.sort((a, b) => a.quantidadeConsumida - b.quantidadeConsumida).slice(0, 10);
    
        // You need to return a value here because your function's return type is not void
        return clientesQueMenosConsumiram;
    };
    const fetchTop5ClientesMaisValor = async (): Promise<Cliente[]> => {
        const responseClientes = await fetch('http://localhost:3001/clientes');
        const clientes: Cliente[] = await responseClientes.json();
    
        const responseCompras = await fetch('http://localhost:3001/compras');
        const compras: Compra[] = await responseCompras.json();
    
        const responseProdutos = await fetch('http://localhost:3001/produtos');
        const produtos: Produto[] = await responseProdutos.json();
    
        const responseServicos = await fetch('http://localhost:3001/servicos');
        const servicos: Servico[] = await responseServicos.json();
    
        clientes.forEach((cliente: Cliente) => {
            let valorConsumido = 0;
    
            compras.forEach((compra: Compra) => {
                if (Number(compra.clienteId) === cliente.id) {
                    const produto = produtos.find((produto: Produto) => Number(produto.id) === Number(compra.produtoId));
                    const servico = servicos.find((servico: Servico) => Number(servico.id) === Number(compra.servicoId));
    
                    if (produto) {
                        valorConsumido += produto.valor * compra.quantidade;
                    }
    
                    if (servico) {
                        valorConsumido += servico.valor * compra.quantidade;
                    }
                }
            });
    
            cliente.valorConsumido = valorConsumido;
        });
    
        const top5ClientesMaisValor = clientes.sort((a, b) => (b.valorConsumido || 0) - (a.valorConsumido || 0)).slice(0, 5);
    
        return top5ClientesMaisValor;
    };
    const handleRelatorioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRelatorioSelecionado(event.target.value);
    };

    const renderRelatorio = () => {
        switch (relatorioSelecionado) {
            case 'top10ClientesMaisConsumo':
                return (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Quantidade Consumida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorios.top10ClientesMaisConsumo.map((cliente, index) => (
                                <tr key={index}>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.quantidadeConsumida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );

                case 'clientesPorGenero':
                    return (
                        <>
                            <h3 style={{ textAlign: 'center' }}>Masculino</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Gênero</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatorios.clientesPorGenero.masculino.map((cliente, index) => (
                                        <tr key={index}>
                                            <td>{cliente.nome}</td>
                                            <td>{cliente.genero}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <h3 style={{ textAlign: 'center' }}>Feminino</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Gênero</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatorios.clientesPorGenero.feminino.map((cliente, index) => (
                                        <tr key={index}>
                                            <td>{cliente.nome}</td>
                                            <td>{cliente.genero}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    );
            case 'servicosMaisConsumidos':
                return (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Serviço</th>
                                <th>Quantidade Consumida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorios.servicosMaisConsumidos.map((servico, index) => (
                                <tr key={index}>
                                    <td>{servico.nome}</td>
                                    <td>{servico.quantidadeConsumida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
                case 'servicosMaisConsumidosPorGenero':
                    return (
                        <>
                            <h3 style={{ textAlign: 'center' }}>Masculino</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Serviço</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatorios.servicosMaisConsumidosPorGenero.masculino.map((servico, index) => (
                                        <tr key={index}>
                                            <td>{servico.nome}</td>
                                            <td>{servico.quantidadeConsumida}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <h3 style={{ textAlign: 'center' }}>Feminino</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Serviço</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatorios.servicosMaisConsumidosPorGenero.feminino.map((servico, index) => (
                                        <tr key={index}>
                                            <td>{servico.nome}</td>
                                            <td>{servico.quantidadeConsumida}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    );

                case 'top10ClientesMenosConsumo':
                    return (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Quantidade Consumida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorios.clientesQueMenosConsumiram.map((cliente, index) => (
                                    <tr key={index}>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.quantidadeConsumida}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    );
                case 'top5ClientesMaisValor':
                    return (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Valor Consumido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorios.top5ClientesMaisValor.map((cliente, index) => (
                                    <tr key={index}>
                                        <td>{cliente.nome}</td>
                                        <td>{`R$ ${((cliente.valorConsumido || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    );
                default:
                    return null;
                }
            };
                    
            return (
                <div className={styles['container-lista']}>
                <div className={styles['wrap-cadastro']}>
                    <h1>Relatórios</h1>
        
                    <Form.Control as="select" onChange={(event: any) => handleRelatorioChange(event)}>
                        <option value="">Selecione um relatório</option>
                        <option value="top10ClientesMaisConsumo">10 clientes que mais consumiram produtos ou serviços</option>
                        <option value="clientesPorGenero">Clientes por gênero</option>
                        <option value="servicosMaisConsumidos">Serviços ou produtos mais consumidos</option>
                        <option value="servicosMaisConsumidosPorGenero">Serviços ou produtos mais consumidos por gênero</option>
                        <option value="top10ClientesMenosConsumo">10 clientes que menos consumiram produtos ou serviços</option>
                        <option value="top5ClientesMaisValor">5 clientes que mais consumiram em valor</option>
                    </Form.Control>
        
                    {renderRelatorio()}
                </div>
            </div>
            );
        }
        
export default Relatorios;

// import React, { useState } from 'react';
// import { Table, Form } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css'
// import styles from '../estilos/styles.module.css';

// type Relatorio = {
//     top10ClientesMaisConsumo: Cliente[];
//     clientesPorGenero: Cliente[];
//     servicosMaisConsumidos: Servico[];
//     servicosMaisConsumidosPorGenero: Servico[];
//     top10ClientesMenosConsumo: Cliente[];
//     top5ClientesMaisValor: Cliente[];
// }

// type Cliente = {
//     nome: string;
//     genero: string;
//     quantidadeConsumida: number;
//     valorConsumido: number;
// }

// type Servico = {
//     nome: string;
//     quantidadeConsumida: number;
//     generoMaisConsumidor: string;
// }

// function Relatorios() {
//     const [relatorios, setRelatorios] = useState<Relatorio>({
//         top10ClientesMaisConsumo: [
//             { nome: 'Cliente 1', genero: 'Masculino', quantidadeConsumida: 100, valorConsumido: 1000 },
//             { nome: 'Cliente 2', genero: 'Feminino', quantidadeConsumida: 90, valorConsumido: 900 },
//             // ... outros clientes
//         ],
//             clientesPorGenero: [
//                 { nome: 'Cliente 1', genero: 'Masculino', quantidadeConsumida: 0, valorConsumido: 0 },
//                 { nome: 'Cliente 2', genero: 'Feminino', quantidadeConsumida: 0, valorConsumido: 0 },
//                 // ... outros clientes
//             ],
//             servicosMaisConsumidos: [
//                 { nome: 'Serviço 1', quantidadeConsumida: 100, generoMaisConsumidor: 'Masculino' },
//                 { nome: 'Serviço 2', quantidadeConsumida: 90, generoMaisConsumidor: 'Feminino' },
//                 // ... outros serviços
//             ],
//             servicosMaisConsumidosPorGenero: [
//                 { nome: 'Serviço 1', quantidadeConsumida: 0, generoMaisConsumidor: 'Masculino' },
//                 { nome: 'Serviço 2', quantidadeConsumida: 0, generoMaisConsumidor: 'Feminino' },
//                 // ... outros serviços
//             ],
//             top10ClientesMenosConsumo: [
//                 { nome: 'Cliente 1', genero: 'Masculino', quantidadeConsumida: 10, valorConsumido: 100 },
//                 { nome: 'Cliente 2', genero: 'Feminino', quantidadeConsumida: 20, valorConsumido: 200 },
//                 // ... outros clientes
//             ],
//             top5ClientesMaisValor: [
//                 { nome: 'Cliente 1', genero: 'Masculino', quantidadeConsumida: 0, valorConsumido: 1000 },
//                 { nome: 'Cliente 2', genero: 'Feminino', quantidadeConsumida: 0, valorConsumido: 900 },
//                 // ... outros clientes
//             ],
//         });

//     const [relatorioSelecionado, setRelatorioSelecionado] = useState('');


//     const handleRelatorioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRelatorioSelecionado(event.target.value);
//     };

//     const renderRelatorio = () => {
//         switch (relatorioSelecionado) {
//             case 'top10ClientesMaisConsumo':
//                 return (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Nome</th>
//                                 <th>Quantidade Consumida</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {relatorios.top10ClientesMaisConsumo.map((cliente, index) => (
//                                 <tr key={index}>
//                                     <td>{cliente.nome}</td>
//                                     <td>{cliente.quantidadeConsumida}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 );
//             case 'clientesPorGenero':
//                 return (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Nome</th>
//                                 <th>Gênero</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {relatorios.clientesPorGenero.map((cliente, index) => (
//                                 <tr key={index}>
//                                     <td>{cliente.nome}</td>
//                                     <td>{cliente.genero}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 );
            
//             case 'servicosMaisConsumidos':
//                 return (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Serviço</th>
//                                 <th>Quantidade Consumida</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {relatorios.servicosMaisConsumidos.map((servico, index) => (
//                                 <tr key={index}>
//                                     <td>{servico.nome}</td>
//                                     <td>{servico.quantidadeConsumida}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 );
            
//             case 'servicosMaisConsumidosPorGenero':
//                 return (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Serviço</th>
//                                 <th>Gênero Mais Consumidor</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {relatorios.servicosMaisConsumidosPorGenero.map((servico, index) => (
//                                 <tr key={index}>
//                                     <td>{servico.nome}</td>
//                                     <td>{servico.generoMaisConsumidor}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 );

//             case 'top10ClientesMenosConsumo':
//                 return (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Nome</th>
//                                 <th>Quantidade Consumida</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {relatorios.top10ClientesMenosConsumo.map((cliente, index) => (
//                                 <tr key={index}>
//                                     <td>{cliente.nome}</td>
//                                     <td>{cliente.quantidadeConsumida}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 );

//             case 'top5ClientesMaisValor':
//                 return (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Nome</th>
//                                 <th>Valor Consumido</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                         {relatorios.top5ClientesMaisValor.map((cliente, index) => (
//                             <tr key={index}>
//                                 <td>{cliente.nome}</td>
//                                 <td>{cliente.valorConsumido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </Table>
//                 );
//             default:
//                 return null;
//             }
//             }

//     return (
//         <div className={styles['container-lista']}>
//         <div className={styles['wrap-cadastro']}>
//             <h1>Relatórios</h1>

//             <Form.Control as="select" onChange={(event: any) => handleRelatorioChange(event)}>
//                 <option value="">Selecione um relatório</option>
//                 <option value="top10ClientesMaisConsumo">10 clientes que mais consumiram produtos ou serviços</option>
//                 <option value="clientesPorGenero">Clientes por gênero</option>
//                 <option value="servicosMaisConsumidos">Serviços ou produtos mais consumidos</option>
//                 <option value="servicosMaisConsumidosPorGenero">Serviços ou produtos mais consumidos por gênero</option>
//                 <option value="top10ClientesMenosConsumo">10 clientes que menos consumiram produtos ou serviços</option>
//                 <option value="top5ClientesMaisValor">5 clientes que mais consumiram em valor</option>
//             </Form.Control>

//             {renderRelatorio()}
//         </div>
//     </div>
// );

// }

// export default Relatorios;