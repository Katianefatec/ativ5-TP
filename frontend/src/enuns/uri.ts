export enum URI {
    BUSCAR_CLIENTES = 'http://localhost:3001/clientes',
    BUSCAR_CLIENTE_PELO_ID = 'http://localhost:3001/cliente',
    DELETAR_CLIENTE = 'http://localhost:3001/cliente/excluir',
    CADASTRAR_CLIENTE = 'http://localhost:3001/cliente/cadastrar',
    ATUALIZAR_CLIENTE = 'http://localhost:3001/cliente/atualizar',
    BUSCAR_PRODUTOS = 'http://localhost:3001/produtos',
    BUSCAR_PRODUTO_PELO_ID = 'http://localhost:3001/produto',
    DELETAR_PRODUTO = 'http://localhost:3001/produto/excluir',
    CADASTRAR_PRODUTO = 'http://localhost:3001/produto/cadastrar',
    ATUALIZAR_PRODUTO = 'http://localhost:3001/produto/atualizar',
    BUSCAR_SERVICOS = 'http://localhost:3001/servicos',
    BUSCAR_SERVICO_PELO_ID = 'http://localhost:3001/servico',
    DELETAR_SERVICO = 'http://localhost:3001/servico/excluir',
    CADASTRAR_SERVICO = 'http://localhost:3001/servico/cadastrar',
    ATUALIZAR_SERVICO = 'http://localhost:3001/servico/atualizar',
    CRIAR_COMPRA = 'http://localhost:3001/cliente/:id/compra',
    BUSCAR_COMPRAS = 'http://localhost:3001/compras',
    ATUALIZAR_COMPRA = 'http://localhost:3001/compra/atualizar',
    DELETAR_COMPRA = 'http://localhost:3001/compra/excluir',
    BUSCAR_COMPRA_PELO_ID = 'http://localhost:3001/compras/:id',  
    BUSCAR_COMPRA_PELO_ID_CLIENTE = 'http://localhost:3001/cliente/compras/:id',  
    
}