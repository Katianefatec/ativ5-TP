export default interface RemovedorRemoto {
    remover(objeto: Object): Promise<Response>;
}