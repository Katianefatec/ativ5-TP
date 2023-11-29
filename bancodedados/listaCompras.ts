import { clientescadastrados } from '../cliente/clientesCadastrados';
import produtosCadastrados from '../produtosEservicos/produtosCadastrados';
import servicosCadastrados from '../produtosEservicos/servicosCadastrados';


interface Compra {
    cliente: typeof clientescadastrados[0];
    produto?: typeof produtosCadastrados[0];
    servico?: typeof servicosCadastrados[0];
}

let compras: Compra[] = [
    { cliente: clientescadastrados[0], produto: produtosCadastrados[0] },
    { cliente: clientescadastrados[1], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[2], produto: produtosCadastrados[2] },
    { cliente: clientescadastrados[3], produto: produtosCadastrados[3] },
    { cliente: clientescadastrados[4], produto: produtosCadastrados[4] },
    { cliente: clientescadastrados[5], produto: produtosCadastrados[5] },
    { cliente: clientescadastrados[6], produto: produtosCadastrados[6] },
    { cliente: clientescadastrados[7], produto: produtosCadastrados[0] },
    { cliente: clientescadastrados[8], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[9], produto: produtosCadastrados[2] },
    { cliente: clientescadastrados[10], produto: produtosCadastrados[3] },
    { cliente: clientescadastrados[11], produto: produtosCadastrados[4] },
    { cliente: clientescadastrados[12], produto: produtosCadastrados[5] },
    { cliente: clientescadastrados[13], produto: produtosCadastrados[6] },
    { cliente: clientescadastrados[14], produto: produtosCadastrados[0] },
    { cliente: clientescadastrados[15], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[16], produto: produtosCadastrados[2] },
    { cliente: clientescadastrados[17], produto: produtosCadastrados[3] },
    { cliente: clientescadastrados[8], produto: produtosCadastrados[4] },
    { cliente: clientescadastrados[19], produto: produtosCadastrados[5] },
    { cliente: clientescadastrados[20], produto: produtosCadastrados[6] },
    { cliente: clientescadastrados[21], produto: produtosCadastrados[0] },
    { cliente: clientescadastrados[22], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[23], produto: produtosCadastrados[2] },
    { cliente: clientescadastrados[25], produto: produtosCadastrados[3] },
    { cliente: clientescadastrados[24], produto: produtosCadastrados[4] },
    { cliente: clientescadastrados[26], produto: produtosCadastrados[5] },
    { cliente: clientescadastrados[27], produto: produtosCadastrados[6] },
    { cliente: clientescadastrados[28], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[29], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[30], produto: produtosCadastrados[1] },
    { cliente: clientescadastrados[6], produto: produtosCadastrados[7] },
    { cliente: clientescadastrados[6], produto: produtosCadastrados[8] },
    { cliente: clientescadastrados[6], produto: produtosCadastrados[9] },
    { cliente: clientescadastrados[0], produto: produtosCadastrados[10] },
    { cliente: clientescadastrados[0], produto: produtosCadastrados[10] },
    { cliente: clientescadastrados[1], produto: produtosCadastrados[11] },
    { cliente: clientescadastrados[1], produto: produtosCadastrados[12] },
    { cliente: clientescadastrados[7], produto: produtosCadastrados[13] },
    { cliente: clientescadastrados[8], servico: servicosCadastrados[0] },
    { cliente: clientescadastrados[9], servico: servicosCadastrados[1] },
    { cliente: clientescadastrados[10], servico: servicosCadastrados[2] },
    

    
];




compras.forEach(compra => {
    if (compra.produto) {
        compra.produto.comprarProduto();
    } else if (compra.servico) {
        compra.servico.contratarServico();
    }
});

export default compras;