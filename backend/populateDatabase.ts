import { PrismaClient } from '@prisma/client';
import { clientescadastrados } from '../bancodedados/clientesCadastrados';
const prisma = new PrismaClient();

async function main() {
  for (const cliente of clientescadastrados) {
    await prisma.cliente.create({
        data: {
          nome: cliente.nome,
          nomeSocial: cliente.nomeSocial,
          genero: cliente.genero,
          dataCadastro: cliente.dataCadastro,
          quantidadeConsumida: cliente.quantidadeConsumida,
          cpf: {
            create: {
              valor: cliente.cpf.valor,
              dataEmissao: cliente.cpf.dataEmissao,
            },
          },
          rg: {
            create: {
              valor: cliente.rg.valor,
              dataEmissao: cliente.rg.dataEmissao,
            },
          },
          telefones: {
            create: {
              ddd: cliente.telefone.ddd,
              numero: cliente.telefone.numero,
            },
          },
        },
      });
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });