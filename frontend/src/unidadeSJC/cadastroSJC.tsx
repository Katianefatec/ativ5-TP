import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from '../estilos/styles.module.css';

import api from '../api';
import { URI } from "../enuns/uri";


interface State {
    id?: number;
    nome: string;    
    nomeSocial: string;                     
    genero: string; 
    endereco: {
        cidade: string;
        estado: string;
        bairro: string;
        rua: string;
        numero: string;
        codigoPostal: string;
        informacoesAdicionais: string;
    };
    telefones: {ddd: string; numero: string;}[];
    dataCadastro: Date; 
    
}

interface Produto {
    id?: number;
    nome: string;
    valor: number;
}

interface Servico {
    id?: number;
    nome: string;
    valor: number;
}


function CadastroSJC() {
    const history = useHistory();   
    const [produto, setProduto] = useState<Produto>({ nome: '', valor: 0 });
    const [servico, setServico] = useState<Servico>({ nome: '', valor: 0 });    
    const [valorServico, setValorServico] = useState(0); 
    const [state, setState] = useState<State>({
        
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
        telefones: [{ddd: '', numero: ''}],
        dataCadastro: new Date(),   
        
              
    });

    

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'number' ? Number(target.value) : target.value;
        const name = target.name;

        setState((prevState: State) => ({ ...prevState, [name]: value }));
    }

    function handleSubmitCliente(event: FormEvent) {
        event.preventDefault();
    
        api.post(URI.CADASTRAR_CLIENTE, state)
            .then(response => {
                console.log(response.data);
               
                setState({
                    
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
                    telefones: [{ddd: '', numero: ''}],
                    dataCadastro: new Date(),  
                           
                });
                history.push('/clienteSJC');
            })
            .catch(error => {
                console.error(error);
            });
    }

    function handleEnderecoChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            endereco: {
                ...prevState.endereco,
                [name]: value
            }
        }));
    }

    const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value.replace(/\D/g, '');
        if (value) {
            const ddd = value.slice(0, 2); 
            const numero = value.slice(2);
    
            setState(prevState => {
                const newTelefones = [...prevState.telefones];
                newTelefones[index] = { ...newTelefones[index], ddd, numero };
                return { ...prevState, telefones: newTelefones };
            });
        }
    };

    function formatPhoneNumber(ddd: string, numero: string) {
        return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
      }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    function handleSubmitProduto(event: FormEvent) {
        event.preventDefault();
    
        api.post(URI.CADASTRAR_PRODUTO, produto)
        .then(response => {
            console.log(response.data);
    
            setProduto({ nome: '', valor: 0 });
    
            history.push('/produtoSJC');
        })
        .catch(error => {
            console.error(error);
        });
    }
    
    function handleSubmitServico(event: FormEvent) {
        event.preventDefault();
    
        api.post(URI.CADASTRAR_SERVICO, servico)
        .then(response => {
            console.log(response.data);
    
            setServico({ nome: '', valor: 0 });
    
            history.push('/servicoSJC');
        })
        .catch(error => {
            console.error(error);
        });
    }

    function handleProductInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        let value = target.type === 'number' ? Number(target.value) : target.value;
        const name = target.name === 'produto' ? 'nome' : 'valor';
        
        if (name === 'valor' && typeof value === 'string') {
            value = parseFloat(value);
        }
    
        setProduto((prevState) => ({ ...prevState, [name]: value }));
    }
    
    function handleServiceInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        let value = target.type === 'number' ? Number(target.value) : target.value;
        const name = target.name === 'servico' ? 'nome' : 'valor';
    
        if (name === 'valor' && typeof value === 'string') {
            value = parseFloat(value);
        }
    
        setServico((prevState) => ({ ...prevState, [name]: value }));
    }
    return (
        <>
        <div className={styles['container-lista']}>
            <div className={styles['wrap-cadastro']}>
                <div className={styles['titulo-cadastro']}>
                    <h1>Cadastro de Clientes</h1>
                </div>
                <form  onSubmit={handleSubmitCliente}>
                    <div className={styles['form-group']}>
                        <label>Nome:</label>
                        <input type="text" className={styles['full-width']} name="nome" value={state.nome} onChange={handleInputChange} required />
                    </div>
                    
                    <div className={styles['form-group']}>
                        <label>Nome Social:</label>
                        <input type="text" className={styles['full-width']} name="nomeSocial" value={state.nomeSocial} onChange={handleInputChange} />
                    </div>   
                    <div className={styles['form-group']}>
                     <label>Rua:</label>
                     <input type="text" className={styles['full-width']} name="rua" value={state.endereco.rua} onChange={handleEnderecoChange} required />
                    
                    </div>
                    <div className={styles['form-group'] + ' ' + styles['flex-container'] }>
                        <div className={styles['half']}>
                            <label>Número:</label>
                            <input type="text" name="numero" value={state.endereco.numero} onChange={handleEnderecoChange} required />
                        </div>                
                        <div className={styles['half']}>
                            <label>Bairro:</label>                    
                            <input type="text" name="bairro" value={state.endereco.bairro} onChange={handleEnderecoChange} required />
                        </div>
                        <div className={styles['half']}>                    
                            <label>CEP:</label>
                            <input type="text" name="codigoPostal" value={state.endereco.codigoPostal} onChange={handleEnderecoChange}  />
                        </div>                          
                    </div>       
                    <div className={styles['form-group'] + ' ' + styles['flex-container'] }>
                        <div className={styles['half']}>
                            <label>Estado:</label>
                            <select name="estado" value={state.endereco.estado} onChange={handleEnderecoChange} required>
                                <option value="">Selecione...</option>
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
                                <option value="PA">Para</option>
                                <option value="PB">Paraíba</option>
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
                        </div>
                        <div className={styles['half']}>
                                <label>Cidade:</label>
                                <input type="text" name="cidade" value={state.endereco.cidade} onChange={handleEnderecoChange} required />
                                
                        </div>  
                        <div className={styles['half']}>
                        <label>Telefones:</label>
                        {state.telefones.map((telefone, index) => (
                            <div key={index}>
                                <input
                                type="text"
                                name="telefone"
                                value={formatPhoneNumber(telefone.ddd, telefone.numero)}
                                onChange={(event) => handleTelefoneChange(event, index)}
                                placeholder="(DD)9999-9999"
                                required
                                />
                            </div>
                        ))}
                    </div>     
                    </div>         
                        
                    
                    <div className={styles['form-group'] + ' ' + styles['flex-container']}>
                        
                    
                    <div className={styles['half']}>
                    <label> Gênero:</label>                        
                        <select name="genero" value={state.genero} onChange={handleSelectChange}>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>                        
                    </div>
                </div>
                    <div className={styles['form-group']}>
                        <input type="submit" value="Enviar" />
                    </div>
                </form>
            </div>  

             <div className={styles['wrap-cadastro2']}>
                    <div className={styles['titulo-cadastro']}>
                        <h1>Cadastro de Produtos </h1>
                    </div>
                    <form onSubmit={handleSubmitProduto}>
                        <div className={styles['form-group'] + ' ' + styles['flex-container']}>
                            <div className={styles['half']}>
                                <label>Produto:</label>
                                <input type="text" name="produto" value={produto.nome} onChange={handleProductInputChange} required />
                            </div>
                            <div className={styles['half']}>
                                <label>Valor:</label>
                                <input type="number" name="valorProduto" value={produto.valor} onChange={handleProductInputChange} required />


                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <input type="submit" value="Enviar" />
                        </div>
                    </form>
                </div>
             

            
                <div className={styles['wrap-cadastro2']}>
                    <div className={styles['titulo-cadastro']}>
                        <h1>Cadastro de Serviços </h1>
                    </div>
                    <form onSubmit={handleSubmitServico}>
                        <div className={styles['form-group'] + ' ' + styles['flex-container']}>
                            <div className={styles['half']}>
                                <label>Serviço:</label>
                                <input type="text" name="servico" value={servico.nome} onChange={handleServiceInputChange} required />
                            </div>
                            <div className={styles['half']}>
                                <label>Valor:</label>
                                <input type="number" name="valor" value={servico.valor} onChange={handleServiceInputChange} required />
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <input type="submit" value="Enviar" />
                        </div>
                    </form>
                </div>
            </div> 
        </>
                    
        );
    }
    
    

export default CadastroSJC;


      
