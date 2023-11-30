import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { Cliente, Endereco } from '../cliente';
import styles from '../estilos/styles.module.css';
import CadastradorCliente from '../cadastradores/cadastradorCliente';
import { useHistory } from 'react-router-dom';
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


function CadastroSJC() {
    
    
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
            })
            .catch(error => {
                console.error(error);
            });
    }

    function handleEnderecoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            endereco: {
                ...prevState.endereco,
                [name]: value
            }
        }));
    }

    function handleTelefoneChange(event: ChangeEvent<HTMLInputElement>, index: number) {
        const { name, value } = event.target;
        setState(prevState => {
            const newTelefones = prevState.telefones.map((telefone, i) => {
                if (i !== index) return telefone;
                return { ...telefone, [name]: value };
            });
            return { ...prevState, telefones: newTelefones };
        });
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
                     <input type="text" name="rua" value={state.endereco.rua} onChange={handleEnderecoChange} required />
                    
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
                    
                    <div className={styles['form-group'] + ' ' + styles['flex-container']}>
                        <div className={styles['half']}>
                            <label>Gênero:</label>
                            <input type="text" name="genero" value={state.genero} onChange={handleInputChange} required />
                        </div>
                        <div className={styles['half']}>
                            <label>Telefones:</label>
                            {state.telefones.map((telefone, index) => (
                                <div key={index}>
                                    <label>DDD:</label>
                                    <input type="text" name="ddd" value={telefone.ddd} onChange={(event) => handleTelefoneChange(event, index)} />
                                    <label>Número:</label>
                                    <input type="text" name="numero" value={telefone.numero} onChange={(event) => handleTelefoneChange(event, index)} />
                                </div>
                            ))}
                    </div>
                    </div>
                    <div className={styles['form-group']}>
                        <input type="submit" value="Enviar" />
                    </div>
                </form>
            </div>
         
        
        
            {/* <div className={styles['wrap-cadastro2']}>
                <div className={styles['titulo-cadastro']}>
                    <h1>Cadastro de Produtos </h1>
                </div>
                <form onSubmit={handleSubmitProduto}>
                    <div className={styles['form-group'] + ' ' + styles['flex-container']}>
                        <div className={styles['half']}>
                            <label>Produto:</label>
                            <input type="text" name="produto" value={state.produto} onChange={handleInputChange} required />
                        </div>
                        <div className={styles['half']}>
                            <label>Valor:</label>
                            <input type="number" name="valorProduto" value={state.valorProduto} onChange={handleInputChange} required />
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
                            <input type="text" name="servico" value={state.servico} onChange={handleInputChange} required />
                        </div>
                        <div className={styles['half']}>
                            <label>Valor:</label>
                            <input type="number" name="valorServico" value={state.valorServico} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className={styles['form-group']}>
                        <input type="submit" value="Enviar" />
                    </div>
                </form>
            </div> */}
        </div> 
    </>
                
    );
    }
//     return (
//     <div className={styles['container-lista']}>
//         <div className={styles['wrap-cadastro']}>
//             <div className={styles['titulo-cadastro']}>
//                 <h1>Cadastro de Clientes</h1>
//             </div>
//             <form onSubmit={handleSubmit}>
//                 <div className={styles['form-group']}>
//                     <label>Nome:</label>
//                     <input type="text" className={styles['full-width']} name="nome" value={novoCliente.nome} onChange={handleNomeChange} required />
//                 </div>
//                 <div className={styles['form-group']}>
//                     <label>Sobrenome:</label>
//                     <input type="text" className={styles['full-width']} name="sobreNome" value={novoCliente.sobreNome} onChange={handleSobreNomeChange} />
//                 </div>  

//                 <div className={styles['form-group']}>
//                     <label>Nome Social:</label>
//                     <input type="text" className={styles['full-width']} name="nomeSocial" value={novoCliente.nomeSocial} onChange={handleNomeSocialChange} required />
//                 </div>        
                        
                               
//                 <div className={styles['form-group']}>
//                     <label>Rua:</label>
//                     <input type="text" className={styles['full-width']} name="rua" value={novoCliente.endereco.rua} onChange={(event) => handleEnderecoChange('rua', event)} required />
                    
//                 </div>
//                 <div className={styles['form-group'] + ' ' + styles['flex-container'] }>
//                     <div className={styles['half']}>
//                         <label>Número:</label>
//                         <input type="text" name="rua" value={novoCliente.endereco.numero} onChange={(event) => handleEnderecoChange('numero', event)} required />
//                     </div>                
//                     <div className={styles['half']}>
//                         <label>Bairro:</label>                    
//                         <input type="text"  name="rua" value={novoCliente.endereco.bairro} onChange={(event) => handleEnderecoChange('bairro', event)} required />
//                     </div>
//                     <div className={styles['half']}>                    
//                         <label>CEP:</label>
//                         <input type="text"  name="rua" value={novoCliente.endereco.codigoPostal} onChange={(event) => handleEnderecoChange('codigoPostal', event)} required />
//                     </div>                          
//                 </div>
//                 <div className={styles['form-group'] + ' ' + styles['flex-container']}>
//                     <div className={styles['half']}>
//                         <label>CPF:</label>
//                         <input type="text" name="cpf" value={state.cpf} onChange={handleInputChange} required />
//                     </div>
//                     <div className={styles['half']}>
//                         <label>RG:</label>
//                         <input type="text" name="rgs" value={state.rgs} onChange={handleInputChange} />
//                     </div>                            
//                     <div className={styles['half']}>
//                         <label>Gênero:</label>
//                         <input type="text" className={styles['full-width']} name="genero" value={novoCliente.genero} onChange={handleGeneroChange} required />
//                     </div>
//                 </div>        
                
               
//                 <div className={styles['form-group'] + ' ' + styles['flex-container']}>
                
                    
//                     <div className={styles['half']}>
//                     <label>Estado:</label>
//                     <select name="estado" value={novoCliente.endereco.estado} onChange={(event) => handleEnderecoChange('estado', event)} required>
//                         <option value="">Selecione...</option>
//                         <option value="AC">Acre</option>
//                         <option value="AL">Alagoas</option>
//                         <option value="AP">Amapá</option>
//                         <option value="AM">Amazonas</option>
//                         <option value="BA">Bahia</option>
//                         <option value="CE">Ceará</option>
//                         <option value="DF">Distrito Federal</option>
//                         <option value="ES">Espírito Santo</option>
//                         <option value="GO">Goiás</option>
//                         <option value="MA">Maranhão</option>
//                         <option value="MT">Mato Grosso</option>
//                         <option value="MS">Mato Grosso do Sul</option>
//                         <option value="MG">Minas Gerais</option>
//                         <option value="PA">Para</option>
//                         <option value="PB">Paraíba</option>
//                         <option value="PR">Paraná</option>
//                         <option value="PE">Pernambuco</option>
//                         <option value="PI">Piauí</option>
//                         <option value="RJ">Rio de Janeiro</option>
//                         <option value="RN">Rio Grande do Norte</option>
//                         <option value="RS">Rio Grande do Sul</option>
//                         <option value="RO">Rondônia</option>
//                         <option value="RR">Roraima</option>
//                         <option value="SC">Santa Catarina</option>
//                         <option value="SP">São Paulo</option>
//                         <option value="SE">Sergipe</option>
//                         <option value="TO">Tocantins</option>
//                         <option value="EX">Estrangeiro</option>                                 
//                     </select>                               
//                 </div>
//                 <div className={styles['half']}>
//                         <label>Cidade:</label>
//                         <input type="text" name="cidade" value={novoCliente.endereco.cidade} onChange={(event) => handleEnderecoChange('cidade', event)} required />
                        
//                     </div>
                
//                 <div className={styles['half']}>
//                     <label>Telefone:</label>
//                     <input type="text" name="telefone" value={novoCliente.telefones[0]?.numero} onChange={handlePhoneChange} required />
//                 </div>
                
                
//                 </div>
//                 <div className={styles['form-group']}>
//                     <label>Informacoes Adicionais:</label>                       
//                 <textarea name="informacoesAdicionais" className={styles['full-width']} value={novoCliente.endereco.informacoesAdicionais} onChange={(event) => handleEnderecoChange('informacoesAdicionais', event)} required />
//                 </div>      
//                 <div className={` ${styles['btn-center']}`}>
//                     <button type="submit" className={styles['btn-submit']}>Cadastrar</button>
//                 </div>         
                             
//             </form>
            
                
//         </div>
//     </div>
//     );
// }
    
    

export default CadastroSJC;


      
